import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parse } from 'csv-parse/sync';

export const runtime = 'nodejs';

const UPLOAD_DIR = process.env.UPLOAD_BASE_DIR || '/tmp';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const fileId = crypto.randomBytes(8).toString('hex');
    const filePath = path.join(UPLOAD_DIR, `${fileId}.csv`);
    await fs.writeFile(filePath, buf);

    // Parse CSV to get columns and record count
    const text = buf.toString('utf-8');
    const records: string[][] = parse(text, { skip_empty_lines: true });
    
    let columns: string[] = [];
    let recordCount = 0;
    
    if (records.length > 0) {
      columns = records[0]; // First row contains headers
      recordCount = records.length - 1; // Subtract header row
    }

    return NextResponse.json({ 
      fileId,
      columns,
      recordCount,
      fileName: file.name,
      fileSize: file.size
    });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
