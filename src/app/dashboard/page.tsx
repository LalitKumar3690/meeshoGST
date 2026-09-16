'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiUploadCloud, FiFile, FiCheckCircle, FiDownload, FiArrowRight, FiArrowLeft, FiEye, FiX, FiList } from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    sales: null,
    returns: null,
    invoices: null
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ jsonUrl?: string, excelUrl?: string, summary?: any, rawData?: any } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modals state
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const onSubmitStep1 = () => {
    setStep(2);
  };

  const onProcessFiles = async (data: any) => {
    if (!files.sales || !files.returns || !files.invoices) {
      setErrorMsg('Please upload all three required Excel files.');
      return;
    }
    
    setErrorMsg('');
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('gstin', data.gstin);
    formData.append('filingType', data.filingType);
    formData.append('month', data.month);
    formData.append('financialYear', data.financialYear);
    formData.append('salesFile', files.sales);
    formData.append('returnsFile', files.returns);
    formData.append('invoicesFile', files.invoices);

    try {
      const response = await fetch('/api/gst/generate', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.message || 'Error processing files');
      }

      setResult({
        jsonUrl: resData.jsonUrl,
        excelUrl: resData.excelUrl,
        summary: resData.summary,
        rawData: resData.rawData
      });
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            GSTR-1 Generator
          </h1>
          <p className="text-slate-400 mt-2">Welcome back, {session?.user?.name}. Let's file your returns.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2"></div>
          <div className="absolute left-0 top-1/2 h-1 bg-indigo-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 ${step >= num ? 'bg-indigo-600 border-slate-900 text-white' : 'bg-slate-800 border-slate-900 text-slate-500'}`}>
              {num}
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3">1</span>
                  Filing Details
                </h2>
                
                <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Your GSTIN</label>
                      <input 
                        type="text" 
                        {...register('gstin', { required: 'GSTIN is required', minLength: 15, maxLength: 15 })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase transition-all"
                        placeholder="22AAAAA0000A1Z5"
                        defaultValue={(session?.user as any)?.gstin || ''}
                      />
                      {errors.gstin && <p className="text-red-400 text-xs mt-1">15 character GSTIN is required</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Filing Type</label>
                      <select 
                        {...register('filingType', { required: true })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Month</label>
                      <select 
                        {...register('month', { required: true })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                      >
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Financial Year</label>
                      <select 
                        {...register('financialYear', { required: true })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                      >
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2025-2026">2025-2026</option>
                        <option value="2026-2027">2026-2027</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all flex items-center">
                      Next Step <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: File Uploads */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mr-3">2</span>
                  Upload Meesho Reports
                </h2>
                
                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
                    <span className="mr-2">⚠️</span> {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  {[
                    { id: 'sales', label: 'TCS Sales Report', accept: '.xlsx', icon: <FiFile className="text-emerald-400" /> },
                    { id: 'returns', label: 'TCS Sales Return Report', accept: '.xlsx', icon: <FiFile className="text-rose-400" /> },
                    { id: 'invoices', label: 'Tax Invoice Details', accept: '.xlsx', icon: <FiFile className="text-blue-400" /> }
                  ].map((doc) => (
                    <div key={doc.id} className="relative group">
                      <input 
                        type="file" 
                        accept={doc.accept} 
                        onChange={(e) => handleFileChange(e, doc.id)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`p-6 border-2 border-dashed rounded-2xl flex items-center justify-between transition-all ${files[doc.id] ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 bg-slate-900/50 group-hover:border-slate-500'}`}>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                            {files[doc.id] ? <FiCheckCircle className="text-indigo-400 w-6 h-6" /> : doc.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-200">{doc.label}</h3>
                            <p className="text-sm text-slate-500">
                              {files[doc.id] ? files[doc.id]!.name : 'Click or drag .xlsx file here'}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <span className={`px-4 py-2 rounded-full text-xs font-medium ${files[doc.id] ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                            {files[doc.id] ? 'Ready' : 'Required'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={() => setStep(1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all flex items-center">
                    <FiArrowLeft className="mr-2" /> Back
                  </button>
                  <button 
                    onClick={handleSubmit(onProcessFiles)} 
                    disabled={isProcessing}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Processing AI...
                      </>
                    ) : (
                      <>
                        Generate GSTR-1 <FiUploadCloud className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Results */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Success! Your GSTR-1 is Ready</h2>
                <p className="text-slate-400 mb-10 max-w-lg mx-auto">
                  We've successfully aggregated your B2C Sales, extracted HSN summaries, and compiled the JSON schema for the GST portal.
                </p>

                {result?.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Sales</p>
                      <p className="text-xl font-bold text-indigo-400">₹{result.summary.totalSales.toLocaleString('en-IN', {maximumFractionDigits:2})}</p>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Returns</p>
                      <p className="text-xl font-bold text-rose-400">₹{result.summary.totalReturns.toLocaleString('en-IN', {maximumFractionDigits:2})}</p>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Net Taxable</p>
                      <p className="text-xl font-bold text-emerald-400">₹{result.summary.netTaxable.toLocaleString('en-IN', {maximumFractionDigits:2})}</p>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Tax</p>
                      <p className="text-xl font-bold text-yellow-400">₹{result.summary.totalTax.toLocaleString('en-IN', {maximumFractionDigits:2})}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                  {result?.jsonUrl && (
                    <a 
                      href={result.jsonUrl} 
                      download="GSTR1_Generated.json"
                      className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20"
                    >
                      <FiDownload className="mr-2" /> Download JSON
                    </a>
                  )}
                  {result?.excelUrl && (
                    <a 
                      href={result.excelUrl} 
                      download="GSTR1_Generated.xlsx"
                      className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20"
                    >
                      <FiDownload className="mr-2" /> Download Excel
                    </a>
                  )}
                </div>

                <div className="flex justify-center space-x-6 border-t border-white/10 pt-6">
                  <button 
                    onClick={() => setShowJsonModal(true)}
                    className="flex items-center text-slate-300 hover:text-white transition-colors text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                  >
                    <FiEye className="mr-2" /> Preview JSON Data
                  </button>
                  <button 
                    onClick={() => setShowTableModal(true)}
                    className="flex items-center text-slate-300 hover:text-white transition-colors text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                  >
                    <FiList className="mr-2" /> Preview Table Data
                  </button>
                </div>
                
                <button onClick={() => setStep(1)} className="mt-8 text-slate-500 hover:text-slate-300 underline text-sm transition-colors">
                  Generate another return
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      <AnimatePresence>
        {showJsonModal && result?.rawData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">JSON Preview</h3>
                <button onClick={() => setShowJsonModal(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-black/50 rounded-xl p-4 border border-white/5">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(result.rawData, null, 2)}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Viewer Modal */}
      <AnimatePresence>
        {showTableModal && result?.rawData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">B2CS Data Preview (Excel Format)</h3>
                <button onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto rounded-xl border border-white/5">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-800 text-slate-400 sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Place of Supply (POS)</th>
                      <th className="px-6 py-3">Rate</th>
                      <th className="px-6 py-3">Taxable Value</th>
                      <th className="px-6 py-3">IGST</th>
                      <th className="px-6 py-3">CGST</th>
                      <th className="px-6 py-3">SGST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rawData.b2cs && result.rawData.b2cs.length > 0 ? (
                      result.rawData.b2cs.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="px-6 py-4">{row.typ || 'OE'}</td>
                          <td className="px-6 py-4 font-mono">{row.pos}</td>
                          <td className="px-6 py-4">{row.rt}%</td>
                          <td className="px-6 py-4 text-emerald-400 font-medium">{row.txval}</td>
                          <td className="px-6 py-4 text-slate-300">{row.iamt || 0}</td>
                          <td className="px-6 py-4 text-slate-300">{row.camt || 0}</td>
                          <td className="px-6 py-4 text-slate-300">{row.samt || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No B2CS data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
