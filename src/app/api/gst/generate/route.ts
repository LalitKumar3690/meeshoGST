import { NextResponse } from 'next/server';
import { processGSTR1 } from '@/lib/gstProcessor';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const gstin = formData.get('gstin') as string;
    const filingType = formData.get('filingType') as string;
    const month = formData.get('month') as string;
    const financialYear = formData.get('financialYear') as string;
    
    const salesFile = formData.get('salesFile') as File;
    const returnsFile = formData.get('returnsFile') as File;
    const invoicesFile = formData.get('invoicesFile') as File;

    if (!gstin || !salesFile || !returnsFile || !invoicesFile) {
      return NextResponse.json({ message: 'Missing required files or fields' }, { status: 400 });
    }

    // Convert Files to Buffers
    const salesBuffer = Buffer.from(await salesFile.arrayBuffer());
    const returnsBuffer = Buffer.from(await returnsFile.arrayBuffer());
    const invoicesBuffer = Buffer.from(await invoicesFile.arrayBuffer());

    // Process Data
    const result = await processGSTR1({
      gstin,
      filingType,
      month,
      financialYear,
      salesBuffer,
      returnsBuffer,
      invoicesBuffer
    });

    // In a real application, we would save the JSON/Excel files to S3 or locally, 
    // and return the URL. For now, we will return the JSON directly and use base64 for Excel download.
    // Or we can save to /public/downloads temporarily for testing.
    
    // Convert JSON and Excel to Base64 data URIs so the frontend can download them directly
    const jsonString = JSON.stringify(result.json, null, 2);
    const jsonBase64 = Buffer.from(jsonString).toString('base64');
    const jsonUrl = `data:application/json;base64,${jsonBase64}`;

    const excelBase64 = result.excelBuffer.toString('base64');
    const excelUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBase64}`;

    return NextResponse.json({
      message: 'Processed successfully',
      summary: result.summary,
      jsonUrl,
      excelUrl,
      rawData: result.json
    }, { status: 200 });

  } catch (error: any) {
    console.error('GST Processing Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
