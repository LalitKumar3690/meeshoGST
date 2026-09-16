import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGSTFiling extends Document {
  userId: mongoose.Types.ObjectId;
  gstin: string;
  fp: string; // Filing period (e.g. "082026")
  version: string;
  hash: string;
  b2cs: Array<{
    sply_ty: string;
    rt: number;
    typ: string;
    pos: string;
    txval: number;
    iamt?: number;
    camt?: number;
    samt?: number;
    csamt: number;
  }>;
  hsn: {
    hsn_b2c: Array<{
      num: number;
      hsn_sc: string;
      uqc: string;
      qty: number;
      rt: number;
      txval: number;
      iamt?: number;
      samt?: number;
      camt?: number;
      csamt: number;
    }>;
  };
  supeco: {
    clttx: Array<{
      etin: string;
      suppval: number;
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
      flag: string;
    }>;
  };
  doc_issue: {
    doc_det: Array<{
      doc_num: number;
      doc_typ: string;
      docs: Array<{
        num: number;
        from: string;
        to: string;
        totnum: number;
        cancel: number;
        net_issue: number;
      }>;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GSTFilingSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gstin: { type: String, required: true },
    fp: { type: String, required: true },
    version: { type: String, default: 'GST3.1.6' },
    hash: { type: String, default: 'hash' },
    b2cs: [
      {
        sply_ty: { type: String, required: true },
        rt: { type: Number, required: true },
        typ: { type: String, default: 'OE' },
        pos: { type: String, required: true },
        txval: { type: Number, required: true },
        iamt: { type: Number, default: 0 },
        camt: { type: Number, default: 0 },
        samt: { type: Number, default: 0 },
        csamt: { type: Number, default: 0 },
      },
    ],
    hsn: {
      hsn_b2c: [
        {
          num: { type: Number },
          hsn_sc: { type: String, required: true },
          uqc: { type: String, required: true },
          qty: { type: Number, required: true },
          rt: { type: Number, required: true },
          txval: { type: Number, required: true },
          iamt: { type: Number, default: 0 },
          samt: { type: Number, default: 0 },
          camt: { type: Number, default: 0 },
          csamt: { type: Number, default: 0 },
        },
      ],
    },
    supeco: {
      clttx: [
        {
          etin: { type: String, required: true },
          suppval: { type: Number, required: true },
          igst: { type: Number, default: 0 },
          cgst: { type: Number, default: 0 },
          sgst: { type: Number, default: 0 },
          cess: { type: Number, default: 0 },
          flag: { type: String, default: 'N' },
        },
      ],
    },
    doc_issue: {
      doc_det: [
        {
          doc_num: { type: Number, required: true },
          doc_typ: { type: String, required: true },
          docs: [
            {
              num: { type: Number },
              from: { type: String, required: true },
              to: { type: String, required: true },
              totnum: { type: Number, required: true },
              cancel: { type: Number, default: 0 },
              net_issue: { type: Number, required: true },
            },
          ],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in Next.js development
const GSTFiling: Model<IGSTFiling> =
  mongoose.models.GSTFiling || mongoose.model<IGSTFiling>('GSTFiling', GSTFilingSchema);

export default GSTFiling;
