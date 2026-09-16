# Meesho GSTR-1 Generator Architecture

## Overview
An online GSTR-1 JSON and Excel generator for Meesho sellers. It automates the generation of compliant GSTR-1 formats by processing standard Meesho reports (`tcs_sales.xlsx`, `tcs_sales_return.xlsx`, and `Tax_invoice_details.xlsx`).

## Tech Stack
- **Framework**: Next.js (Fullstack App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Forms**: React-Hook-Form
- **Icons**: React Icons
- **Database**: MongoDB (Mongoose)
- **API**: Next.js REST API routes
- **Authentication**: NextAuth.js (Credentials/Email)

## Core Features
1. **File Upload & Parsing**: Secure interface for uploading the 3 required Excel files.
2. **Data Extraction & Aggregation**:
   - Net Sales calculation (Sales - Returns).
   - HSN summaries extraction from `Tax_invoice_details.xlsx`.
   - State-wise B2C sales calculation (`b2cs`).
   - Total supplies through E-commerce operator (`supeco`).
   - Document Issued details extraction (`doc_issue`).
3. **Report Generation**: Generates the standard GST offline tool Excel format and JSON format.

## Workflows
1. User logs in/signs up.
2. User inputs GSTIN, filing month/year, and uploads the 3 Excel files.
3. System parses files, aggregates data, and saves to MongoDB.
4. User reviews the summary dashboard.
5. User downloads the final `.xlsx` and `.json` files.

## Edge Cases to Handle
- **Negative Sales**: GST portal does not accept negative values in B2CS. Users must be warned on the dashboard to adjust manually or carry forward.
- **Missing or Corrupted Files**: Need strict validation.
- **Zero Sales Month**: Must generate valid JSON with zero values.
- **Missing HSN**: Must handle gracefully if Meesho reports omit them.
