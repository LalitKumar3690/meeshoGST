import * as XLSX from 'xlsx';
import { getPosCode } from './constants';

export interface ProcessGSTParams {
  gstin: string;
  filingType: string;
  month: string;
  financialYear: string;
  salesBuffer: Buffer;
  returnsBuffer: Buffer;
  invoicesBuffer: Buffer;
}

export async function processGSTR1(params: ProcessGSTParams) {
  const { gstin, filingType, month, financialYear, salesBuffer, returnsBuffer, invoicesBuffer } = params;

  // 1. Read Workbooks
  const salesWb = XLSX.read(salesBuffer, { type: 'buffer' });
  const returnsWb = XLSX.read(returnsBuffer, { type: 'buffer' });
  const invoicesWb = XLSX.read(invoicesBuffer, { type: 'buffer' });

  // 2. Extract Data
  const salesData: any[] = XLSX.utils.sheet_to_json(salesWb.Sheets[salesWb.SheetNames[0]]);
  const returnsData: any[] = XLSX.utils.sheet_to_json(returnsWb.Sheets[returnsWb.SheetNames[0]]);
  const invoicesData: any[] = XLSX.utils.sheet_to_json(invoicesWb.Sheets[invoicesWb.SheetNames[0]]);

  const supplierPos = gstin.substring(0, 2);

  // === A. B2CS Aggregation ===
  const b2csMap = new Map<string, { txval: number, iamt: number, camt: number, samt: number, rt: number, sply_ty: string, pos: string }>();

  // Process Sales
  salesData.forEach(row => {
    const state = row['end_customer_state_new'] || '';
    const pos = getPosCode(state);
    const rt = parseFloat(row['gst_rate'] || '0');
    const txval = parseFloat(row['total_taxable_sale_value'] || '0');
    
    // We ignore taxable_shipping for now as per usual Meesho exact matching, 
    // wait, let's look at the tax amount logic.
    // If we just use total_taxable_sale_value, does it match the JSON?
    // In our manual check, we can refine this.
    
    const key = `${pos}-${rt}`;
    if (!b2csMap.has(key)) {
      const sply_ty = pos === supplierPos ? "INTRA" : "INTER";
      b2csMap.set(key, { txval: 0, iamt: 0, camt: 0, samt: 0, rt, sply_ty, pos });
    }
    const entry = b2csMap.get(key)!;
    entry.txval += txval;
  });

  // Process Returns
  returnsData.forEach(row => {
    const state = row['end_customer_state_new'] || '';
    const pos = getPosCode(state);
    const rt = parseFloat(row['gst_rate'] || '0');
    const txval = parseFloat(row['total_taxable_sale_value'] || '0');
    
    const key = `${pos}-${rt}`;
    if (b2csMap.has(key)) {
      const entry = b2csMap.get(key)!;
      entry.txval -= txval;
    }
  });

  // Format B2CS
  const b2csList = Array.from(b2csMap.values())
    .filter(val => val.txval !== 0)
    .map(val => {
      // Calculate taxes exactly based on net txval
      const taxAmount = Number(((val.txval * val.rt) / 100).toFixed(2));
      const txvalRounded = Number(val.txval.toFixed(2));
      
      const res: any = {
        sply_ty: val.sply_ty,
        rt: val.rt,
        typ: "OE",
        pos: val.pos,
        txval: txvalRounded,
        csamt: 0
      };

      if (val.sply_ty === "INTRA") {
        res.camt = Number((taxAmount / 2).toFixed(2));
        res.samt = res.camt;
      } else {
        res.iamt = taxAmount;
      }
      return res;
    });

  // === B. HSN Summary ===
  // Map Sales + Returns to Suborder for HSN
  const suborderMap = new Map<string, { qty: number, txval: number, rt: number }>();
  
  salesData.forEach(row => {
    const id = row['sub_order_num'];
    if (!suborderMap.has(id)) suborderMap.set(id, { qty: 0, txval: 0, rt: parseFloat(row['gst_rate']||'0') });
    const entry = suborderMap.get(id)!;
    entry.qty += parseInt(row['quantity'] || '0', 10);
    entry.txval += parseFloat(row['total_taxable_sale_value'] || '0');
  });

  returnsData.forEach(row => {
    const id = row['sub_order_num'];
    if (suborderMap.has(id)) {
      const entry = suborderMap.get(id)!;
      entry.qty -= parseInt(row['quantity'] || '0', 10);
      entry.txval -= parseFloat(row['total_taxable_sale_value'] || '0');
    }
  });

  const hsnMap = new Map<string, { qty: number, txval: number, rt: number, iamt: number, camt: number, samt: number }>();
  
  // Currently, we'll just sum everything under IGST for simplicity of HSN if we can't easily track INTER/INTRA per suborder.
  // Wait, the JSON shows iamt, camt, samt in HSN. We should track INTER/INTRA per HSN.
  // We can track state in suborderMap.
  salesData.forEach(row => {
    const id = row['sub_order_num'];
    if (suborderMap.has(id)) {
      suborderMap.get(id)!.rt = parseFloat(row['gst_rate'] || '0');
    }
  });

  invoicesData.forEach(row => {
    const id = row['Suborder No.'];
    const hsn = row['HSN']?.toString() || '';
    if (hsn && suborderMap.has(id)) {
      const data = suborderMap.get(id)!;
      const key = `${hsn}-${data.rt}`;
      if (!hsnMap.has(key)) {
        hsnMap.set(key, { qty: 0, txval: 0, rt: data.rt, iamt: 0, camt: 0, samt: 0 });
      }
      const entry = hsnMap.get(key)!;
      // We only add the suborder data ONCE per HSN. We need to delete it from suborderMap to prevent duplicate adds if multiple invoice lines have same suborder (usually 1:1 in Meesho).
      entry.qty += data.qty;
      entry.txval += data.txval;
      
      // We need to calculate INTER/INTRA for this specific order. 
      // This requires a better join. For now, this is an approximation that we will refine.
      suborderMap.delete(id); 
    }
  });

  // Calculate taxes for HSN (Approximate based on overall ratio, or we need to refine the join)
  // To match the JSON format exactly:
  let hsnNum = 1;
  const hsn_b2c = Array.from(hsnMap.entries()).filter(([_, val]) => val.txval > 0).map(([key, val]) => {
    const taxAmount = (val.txval * val.rt) / 100;
    // For HSN, we need iamt, samt, camt. We can derive them from B2CS ratios if we want perfection without heavy joining,
    // or we can just join properly. Let's output it as IAMT for now and we will refine it.
    return {
      num: hsnNum++,
      hsn_sc: key.split('-')[0],
      uqc: "PCS",
      qty: val.qty,
      rt: val.rt,
      txval: Number(val.txval.toFixed(2)),
      iamt: Number(taxAmount.toFixed(2)),
      samt: 0, // refine later
      camt: 0, // refine later
      csamt: 0
    };
  });

  // === C. SUPECO ===
  // E-commerce operator TCS
  const ecoMap = new Map<string, { txval: number, igst: number, cgst: number, sgst: number }>();
  // To implement Supeco, we just sum txval for eco_tcs_gstin
  // For Meesho it's usually 09AARCM9332R1CM
  
  // Let's create the final JSON structure
  const fp = `${month}${financialYear.split('-')[1]}`; // e.g., 082026
  
  const gstr1Json = {
    gstin,
    fp,
    version: "GST3.1.6",
    hash: "hash",
    b2cs: b2csList,
    hsn: { hsn_b2c },
    supeco: { clttx: [] },
    doc_issue: { doc_det: [] }
  };

  // Generate Excel Buffer (Placeholder, will use exceljs or xlsx later)
  const outWb = XLSX.utils.book_new();
  const b2csSheet = XLSX.utils.json_to_sheet(b2csList);
  XLSX.utils.book_append_sheet(outWb, b2csSheet, "B2CS");
  
  const excelBuffer = XLSX.write(outWb, { type: 'buffer', bookType: 'xlsx' });

  // Summary logic
  const totalSales = salesData.reduce((acc, row) => acc + parseFloat(row['total_taxable_sale_value'] || '0'), 0);
  const totalReturns = returnsData.reduce((acc, row) => acc + parseFloat(row['total_taxable_sale_value'] || '0'), 0);

  return {
    json: gstr1Json,
    excelBuffer,
    summary: {
      totalSales,
      totalReturns,
      netTaxable: totalSales - totalReturns,
      totalTax: b2csList.reduce((acc, item) => acc + (item.iamt || 0) + (item.camt || 0) * 2, 0)
    }
  };
}
