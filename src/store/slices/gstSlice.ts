import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GSTState {
  gstin: string;
  filingMonth: string;
  filingYear: string;
  isProcessing: boolean;
  summary: any | null;
}

const initialState: GSTState = {
  gstin: '',
  filingMonth: '',
  filingYear: '',
  isProcessing: false,
  summary: null,
};

export const gstSlice = createSlice({
  name: 'gst',
  initialState,
  reducers: {
    setGstin: (state, action: PayloadAction<string>) => {
      state.gstin = action.payload;
    },
    setFilingPeriod: (state, action: PayloadAction<{ month: string; year: string }>) => {
      state.filingMonth = action.payload.month;
      state.filingYear = action.payload.year;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setSummary: (state, action: PayloadAction<any>) => {
      state.summary = action.payload;
    },
  },
});

export const { setGstin, setFilingPeriod, setProcessing, setSummary } = gstSlice.actions;
export default gstSlice.reducer;
