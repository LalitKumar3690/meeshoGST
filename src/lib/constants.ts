export const STATE_TO_POS: { [key: string]: string } = {
  "JAMMU AND KASHMIR": "01",
  "HIMACHAL PRADESH": "02",
  "PUNJAB": "03",
  "CHANDIGARH": "04",
  "UTTARAKHAND": "05",
  "HARYANA": "06",
  "DELHI": "07",
  "RAJASTHAN": "08",
  "UTTAR PRADESH": "09",
  "BIHAR": "10",
  "SIKKIM": "11",
  "ARUNACHAL PRADESH": "12",
  "NAGALAND": "13",
  "MANIPUR": "14",
  "MIZORAM": "15",
  "TRIPURA": "16",
  "MEGHALAYA": "17",
  "ASSAM": "18",
  "WEST BENGAL": "19",
  "JHARKHAND": "20",
  "ODISHA": "21",
  "CHHATTISGARH": "22",
  "MADHYA PRADESH": "23",
  "GUJARAT": "24",
  "DAMAN AND DIU": "25",
  "DADRA AND NAGAR HAVELI": "26",
  "MAHARASHTRA": "27",
  "ANDHRA PRADESH": "28",
  "KARNATAKA": "29",
  "GOA": "30",
  "LAKSHADWEEP": "31",
  "KERALA": "32",
  "TAMIL NADU": "33",
  "PUDUCHERRY": "34",
  "ANDAMAN AND NICOBAR ISLANDS": "35",
  "TELANGANA": "36",
  "ANDHRA PRADESH (NEW)": "37",
  "LADAKH": "38"
};

export const normalizeStateName = (state: string): string => {
  return state.trim().toUpperCase();
};

export const getPosCode = (state: string): string => {
  const normalized = normalizeStateName(state);
  return STATE_TO_POS[normalized] || "97"; // 97 is Other Territory
};
