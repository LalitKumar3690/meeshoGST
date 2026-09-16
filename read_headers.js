const XLSX = require('xlsx');

const file = '/home/codex/projects/ai_work/sample/GSTR1_09BUZPR2385D1ZV_monthly_082026.xlsx';

try {
  const workbook = XLSX.readFile(file);
  const targetSheets = ['b2cs', 'hsn(b2c)', 'eco', 'docs'];
  
  targetSheets.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\n--- Sheet: ${sheetName} ---`);
    if (data.length > 2) console.log('Row 3 (Headers?):', JSON.stringify(data[2]));
    if (data.length > 3) console.log('Row 4 (Data):', JSON.stringify(data[3]));
    if (data.length > 4) console.log('Row 5 (Data):', JSON.stringify(data[4]));
  });
} catch (err) {
  console.error(`Error reading ${file}:`, err.message);
}
