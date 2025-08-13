import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';

interface MappingRequest {
  filePath: string;
  existingMapping?: Record<string, string>;
}

interface MappingResponse {
  success: boolean;
  columns?: string[];
  suggestedMapping?: Record<string, string>;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MappingRequest = await request.json();
    const { filePath, existingMapping } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing required field: filePath' },
        { status: 400 }
      );
    }

    // Read the uploaded file
    const fileContent = await readFile(filePath, 'utf-8');
    
    // Parse CSV/Excel data
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Generate suggested mapping
    const suggestedMapping = suggestColumnMapping(headers);

    return NextResponse.json({
      success: true,
      columns: headers,
      suggestedMapping
    });

  } catch (error) {
    console.error('Mapping error:', error);
    return NextResponse.json(
      { error: 'Mapping failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

function suggestColumnMapping(headers: string[]): Record<string, string> {
  const suggestions: Record<string, string> = {};
  const lowerHeaders = headers.map(h => h.toLowerCase());

  // Mapping rules from Streamlit version
  const mappingRules = {
    'destination_zip': ['zip', 'postal', 'destination', 'zip_code', 'postal_code'],
    'weight': ['weight', 'mass', 'lbs', 'pounds', 'package_weight'],
    'length': ['length', 'long', 'package_length'],
    'width': ['width', 'wide', 'package_width'],
    'height': ['height', 'tall', 'package_height'],
    'shipment_id': ['id', 'order', 'tracking', 'shipment_id', 'order_id'],
    'service_level': ['service', 'shipping', 'method', 'service_level', 'shipping_method'],
    'package_type': ['type', 'package', 'box', 'package_type', 'box_type'],
    'carrier_rate': ['rate', 'paid', 'carrier', 'cost', 'charge', 'amount', 'price', 'carrier_rate', 'shipping_cost']
  };

  // Find matches for each field
  for (const [field, keywords] of Object.entries(mappingRules)) {
    for (const keyword of keywords) {
      const matchingIndex = lowerHeaders.findIndex(header => 
        header.includes(keyword) || keyword.includes(header)
      );
      
      if (matchingIndex !== -1) {
        suggestions[field] = headers[matchingIndex];
        break;
      }
    }
  }

  return suggestions;
}
