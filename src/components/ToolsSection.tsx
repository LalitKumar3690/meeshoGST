'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiSettings } from 'react-icons/fi';

export default function ToolsSection() {
  return (
    <section id="tools" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Available Tools</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Everything you need to stay compliant.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full relative group"
          >
            {/* Hover Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative p-8 rounded-3xl bg-slate-900 border border-white/10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
                <FiSettings className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Meesho GSTR-1 Generator</h3>
              <p className="text-slate-400 mb-8 flex-grow">
                Upload your TCS Sales, Returns, and Tax Invoice sheets to instantly generate the JSON and Excel files required for filing your GSTR-1 on the GST portal.
              </p>
              
              <Link 
                href="/dashboard"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-center flex items-center justify-center transition-all shadow-lg shadow-indigo-500/25"
              >
                Launch Tool
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
