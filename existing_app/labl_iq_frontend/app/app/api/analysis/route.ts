import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export const runtime = 'nodejs';

type ColumnMapping = {
  weight: string;
  carrier_rate: string;
  zone?: string;
  dest_zip?: string;
  orig_zip?: string;
};

type Settings = {
  weightUnit: 'oz' | 'lb' | 'lbs' | 'g' | 'kg';
  fuelSurchargePct?: number;
  markupPct?: number;
  dimDivisor?: number;
  dasSurcharge?: number;
  edasSurcharge?: number;
  remoteSurcharge?: number;
  discountPercent?: number;
  markupPercentage?: number;
  originZip?: string;
  destinationZip?: string;
  minMargin?: number;
};

function parseCurrency(v: unknown): number {
  if (v == null) return 0;
  const s = String(v).replace(/[^0-9.-]+/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
function parseNumber(v: unknown): number {
  if (v == null) return 0;
  const s = String(v).replace(/[^0-9.-]+/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
function toLbs(val: number, unit: Settings['weightUnit']): number {
  switch ((unit || 'lb').toLowerCase()) {
    case 'oz': return val / 16;
    case 'lb':
    case 'lbs': return val;
    case 'g': return val / 453.592;
    case 'kg': return val * 2.20462;
    default: return val;
  }
}
function headerIndex(headers: string[], targetHeader: string): number {
  // First try exact match
  const idx = headers.findIndex(h => h.trim() === targetHeader.trim());
  if (idx !== -1) return idx;
  
  // Then try case-insensitive match
  const idx2 = headers.findIndex(h => h.trim().toLowerCase() === targetHeader.trim().toLowerCase());
  if (idx2 !== -1) return idx2;
  
  // Then try contains match (more flexible)
  const targetLower = targetHeader.trim().toLowerCase();
  const idx3 = headers.findIndex(h => h.trim().toLowerCase().includes(targetLower) || targetLower.includes(h.trim().toLowerCase()));
  if (idx3 !== -1) return idx3;
  
  // Finally try aggressive normalization (remove all special chars)
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const t = norm(targetHeader);
  return headers.findIndex(h => norm(h) === t);
}
function round2(n: number) { return Math.round((n + Number.EPSILON) * 100) / 100; }
function avg(nums: number[]) { return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0; }

async function filePathFromId(fileId: string) {
  const base = process.env.UPLOAD_BASE_DIR || '/tmp'; // Same as upload API
  return path.join(base, `${fileId}.csv`);
}

export async function POST(req: Request) {
  try {
    const { fileId, mapping, settings } = await req.json() as {
      fileId: string, mapping: ColumnMapping, settings: Settings
    };
    if (!fileId || !mapping || !settings) {
      return NextResponse.json({ error: 'Missing fileId, mapping, or settings' }, { status: 400 });
    }

    const filePath = await filePathFromId(fileId);
    const raw = await fs.readFile(filePath);
    const rows: string[][] = parse(raw, { skip_empty_lines: true });

    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV has no data' }, { status: 400 });
    }

    const headers = rows[0];
    const data = rows.slice(1);

    // Debug logging
    console.log('CSV Headers:', headers);
    console.log('Mapping:', mapping);
    console.log('Settings:', settings);

    const weightIdx = headerIndex(headers, mapping.weight);
    const rateIdx   = headerIndex(headers, mapping.carrier_rate);
    const zoneIdx   = mapping.zone ? headerIndex(headers, mapping.zone) : -1;
    const destIdx   = mapping.dest_zip ? headerIndex(headers, mapping.dest_zip) : -1;
    const origIdx   = mapping.orig_zip ? headerIndex(headers, mapping.orig_zip) : -1;

    console.log('Column indices:', { weightIdx, rateIdx, zoneIdx, destIdx, origIdx });

    if (weightIdx < 0 || rateIdx < 0) {
      console.error('Column mapping failed:', { 
        weight: mapping.weight, 
        carrier_rate: mapping.carrier_rate,
        availableHeaders: headers 
      });
      return NextResponse.json({ 
        error: `Missing required mapping for weight or carrier_rate. 
        Weight column '${mapping.weight}' not found. 
        Carrier rate column '${mapping.carrier_rate}' not found. 
        Available columns: ${headers.join(', ')}` 
      }, { status: 400 });
    }

    const cleaned = data.map((row, i) => {
      const rawW = row[weightIdx];
      const rawR = row[rateIdx];
      const rawZ = zoneIdx >= 0 ? row[zoneIdx] : undefined;

      const wNum = parseNumber(rawW);
      const weight_lbs = toLbs(wNum, settings.weightUnit);
      const carrier_rate = parseCurrency(rawR);

      let zone: number | null = null;
      if (rawZ != null && String(rawZ).trim() !== '') {
        const z = parseInt(String(rawZ), 10);
        zone = Number.isFinite(z) ? z : null;
      }

      const dest_zip = destIdx >= 0 ? String(row[destIdx] ?? '').trim() : '';
      const orig_zip = origIdx >= 0 ? String(row[origIdx] ?? '').trim() : '';

      return { rowIndex: i + 1, weight_lbs, carrier_rate, zone, dest_zip, orig_zip };
    });

    // sanity log a couple of rows
    console.log('analysis sample', cleaned.slice(0, 3));

    // Use the REAL Python rate engine instead of fake calculations
    try {
      const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8001';
      
      // Prepare shipments for the Python rate engine
      const shipments = cleaned.map(r => {
        // Convert weight from ounces to pounds if needed
        let weightInLbs = r.weight_lbs;
        if (settings.weightUnit === 'oz') {
          weightInLbs = r.weight_lbs / 16; // Convert ounces to pounds
        }
        
        return {
          weight: weightInLbs,
          zone: r.zone,
          origin_zip: r.orig_zip && r.orig_zip.trim() !== '' ? r.orig_zip : undefined,
          destination_zip: r.dest_zip && r.dest_zip.trim() !== '' ? r.dest_zip : undefined,
          package_type: 'box', // Default to box
          service_level: 'standard', // Default service level
          carrier_rate: r.carrier_rate
        };
      });
      
      // Debug logging for weight conversion
      console.log('Weight conversion sample:', {
        original: cleaned.slice(0, 3).map(r => ({ weight_lbs: r.weight_lbs, unit: settings.weightUnit })),
        converted: shipments.slice(0, 3).map(s => ({ weight: s.weight, zone: s.zone, dest_zip: s.destination_zip }))
      });

      // Call the Python rate engine
      const response = await fetch(`${pythonApiUrl}/api/calculate-rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipments,
          discount_percent: settings.discountPercent || 0,
          markup_percent: (settings.markupPct || 0) * 100, // Convert to percentage
          fuel_surcharge_percent: (settings.fuelSurchargePct || 0) * 100, // Convert to percentage
          
          // Frontend-controlled surcharge settings
          das_surcharge: settings.dasSurcharge || 1.98,
          edas_surcharge: settings.edasSurcharge || 3.92,
          remote_surcharge: settings.remoteSurcharge || 14.15,
          dim_divisor: settings.dimDivisor || 139.0,
          origin_zip: settings.originZip || '46307'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Python API error:', errorText);
        throw new Error(`Python rate engine failed: ${response.status} ${response.statusText}`);
      }

      const pythonResults = await response.json();
      
      // Debug logging for Python API response
      console.log('Python API response:', {
        success: pythonResults.success,
        resultsCount: pythonResults.results?.length || 0,
        summary: pythonResults.summary,
        sampleResult: pythonResults.results?.[0]
      });
      
      if (!pythonResults.success) {
        throw new Error(pythonResults.message || 'Python rate engine returned error');
      }

      // Return the real results from your rate engine
      return NextResponse.json({
        results: pythonResults.results,
        summary: pythonResults.summary
      });

    } catch (pythonError) {
      console.error('Python rate engine error:', pythonError);
      
      // Fallback to basic calculations if Python engine fails
      console.log('Falling back to basic calculations...');
      
      const fuelPct = settings.fuelSurchargePct || 0;
      const markupPct = settings.markupPct || 0;

      const results = cleaned.map(r => {
        // Basic fallback calculation (this should rarely be used)
        let base_rate = 0;
        
        if (r.zone && r.zone > 0) {
          if (r.weight_lbs <= 1) {
            base_rate = 8.50 + (r.zone * 0.75);
          } else if (r.weight_lbs <= 5) {
            base_rate = 12.00 + (r.zone * 1.25);
          } else if (r.weight_lbs <= 10) {
            base_rate = 18.00 + (r.zone * 1.75);
          } else {
            base_rate = 25.00 + (r.zone * 2.25);
          }
        } else {
          if (r.weight_lbs <= 1) {
            base_rate = 9.50;
          } else if (r.weight_lbs <= 5) {
            base_rate = 14.00;
          } else if (r.weight_lbs <= 10) {
            base_rate = 22.00;
          } else {
            base_rate = 32.00;
          }
        }
        
        base_rate = round2(base_rate);
        const fuel = base_rate * fuelPct;
        const final = (base_rate + fuel) * (1 + markupPct);
        const savings = r.carrier_rate - base_rate;
        const savingsPct = r.carrier_rate > 0 ? (savings / r.carrier_rate) * 100 : 0;
        
        return { 
          ...r, 
          base_rate, 
          fuel_surcharge: round2(fuel), 
          final_rate: round2(final),
          savings: round2(savings),
          savings_percent: round2(savingsPct)
        };
      });

      const summary = {
        count: results.length,
        avg_final: round2(avg(results.map(r => r.final_rate))),
        min_final: round2(Math.min(...results.map(r => r.final_rate))),
        max_final: round2(Math.max(...results.map(r => r.final_rate))),
      };

      return NextResponse.json({ 
        results, 
        summary,
        warning: 'Using fallback calculations - Python rate engine unavailable'
      });
    }

  } catch (e) {
    console.error('analysis error', e);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
