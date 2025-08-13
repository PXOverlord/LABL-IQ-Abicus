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
  
  console.log('Successfully parsed CSV!');
  console.log('Number of records:', records.length);
  console.log('Columns:', Object.keys(records[0] || {}));
  console.log('First record sample:', records[0]);
  console.log('Sample data types:');
  
  if (records[0]) {
    Object.entries(records[0]).slice(0, 10).forEach(([key, value]) => {
      console.log(`  ${key}: "${value}" (${typeof value})`);
    });
  }
});
