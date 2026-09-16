'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiFileText, FiDownload } from 'react-icons/fi';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[400px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium inline-block mb-6 shadow-xl backdrop-blur-md">
              ⚡ The Ultimate Tool for E-Commerce Sellers
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight"
          >
            Automate Your <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Meesho GSTR-1
            </span> Filing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your Meesho TCS Sales, Returns, and Tax Invoice Excel sheets. We instantly calculate B2CS, HSN summaries, and generate portal-ready JSON & Excel files.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link 
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center group"
            >
              Get Started Free
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="#tools"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg backdrop-blur-md transition-all flex items-center justify-center"
            >
              How it works
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden">
            <div className="rounded-xl border border-white/5 bg-black/50 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FiFileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">1. Upload Excels</h4>
                    <p className="text-slate-400 text-sm">Drop your 3 Meesho reports here</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <svg className="w-6 h-6 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">2. AI Processing</h4>
                    <p className="text-slate-400 text-sm">Validates & aggregates data</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FiDownload size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">3. Download Outputs</h4>
                    <p className="text-slate-400 text-sm">GSTR-1 JSON & Excel ready</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full flex justify-center">
                <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                  <div className="bg-slate-900 px-4 py-3 border-b border-white/5 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-6 font-mono text-xs sm:text-sm text-green-400 overflow-hidden">
                    <p>{"{"}</p>
                    <p className="pl-4">"gstin": "09BUZPR2385D1ZV",</p>
                    <p className="pl-4">"fp": "082026",</p>
                    <p className="pl-4">"b2cs": [</p>
                    <p className="pl-8">{"{"}</p>
                    <p className="pl-12">"sply_ty": "INTER",</p>
                    <p className="pl-12">"rt": 3,</p>
                    <p className="pl-12">"txval": 4022.76,</p>
                    <p className="pl-12">"iamt": 120.69</p>
                    <p className="pl-8">{"}"}</p>
                    <p className="pl-4">],</p>
                    <p className="text-slate-500 pl-4">... 300 more lines</p>
                    <p>{"}"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
