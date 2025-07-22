import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV or Excel files only.' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Generate unique filename
    const analysisId = randomUUID();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${analysisId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // For CSV files, let's also parse and validate the structure
    if (file.type === 'text/csv') {
      try {
        const csv = require('csv');
        const fileContent = buffer.toString('utf8');
        
        // Parse CSV to validate structure
        const records = await new Promise((resolve, reject) => {
          csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
          }, (err: any, records: any[]) => {
            if (err) reject(err);
            else resolve(records);
          });
        });

        // Filter out empty records
        const validRecords = (records as any[]).filter(record => {
          return Object.values(record).some(value => value && String(value).trim() !== '');
        });

        console.log(`CSV parsed successfully: ${validRecords.length} valid records`);

        // Check for required shipping analysis columns
        const requiredColumns = ['Ship State', 'Ship Postal Code', 'Weight', 'Carrier Fee'];
        const availableColumns = Object.keys(validRecords[0] || {});
        const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
        
        if (missingColumns.length > 0) {
          console.warn(`Missing recommended columns: ${missingColumns.join(', ')}`);
        }

        return NextResponse.json({
          success: true,
          analysisId,
          fileName: file.name,
          fileSize: file.size,
          recordCount: validRecords.length,
          columns: availableColumns,
          missingColumns,
          message: 'File uploaded and parsed successfully'
        });

      } catch (parseError) {
        console.error('CSV parsing error:', parseError);
        return NextResponse.json(
          { error: 'Invalid CSV format. Please check your file structure.' },
          { status: 400 }
        );
      }
    }

    // For non-CSV files (Excel), return basic success response
    return NextResponse.json({
      success: true,
      analysisId,
      fileName: file.name,
      fileSize: file.size,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload endpoint is ready. Use POST to upload files.' },
    { status: 200 }
  );
}
