const XLSX = require('xlsx');

const files = [
  '/home/codex/projects/ai_work/sample/tcs_sales.xlsx',
  '/home/codex/projects/ai_work/sample/tcs_sales_return.xlsx',
  '/home/codex/projects/ai_work/sample/Tax_invoice_details.xlsx'
];

files.forEach(file => {
  try {
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`\n--- First Row for ${file.split('/').pop()} ---`);
    console.log(JSON.stringify(data[0], null, 2));
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
