const fs = require('fs');
const csv = require('csv');

const csvFilePath = '/home/ubuntu/Uploads/SolBrush Amazon Rate DownloadAmazon Only .csv';

console.log('Testing CSV parsing...');

// Test with csv library
csv.parse(fs.readFileSync(csvFilePath, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  trim: true
}, (err, records) => {
  if (err) {
    console.error('CSV parsing error:', err);
    return;
  }
  
  // Filter out completely empty records
  const validRecords = records.filter(record => {
    return Object.values(record).some(value => value && value.trim() !== '');
  });
  
  console.log('Successfully parsed CSV!');
  console.log('Total records:', records.length);
  console.log('Valid records (non-empty):', validRecords.length);
  console.log('Columns:', Object.keys(records[0] || {}));
  console.log('First valid record sample:', validRecords[0]);
  console.log('Sample data types from first valid record:');
  
  if (validRecords[0]) {
    Object.entries(validRecords[0]).slice(0, 10).forEach(([key, value]) => {
      console.log(`  ${key}: "${value}" (${typeof value})`);
    });
  }
});
