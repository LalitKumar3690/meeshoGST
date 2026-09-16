'use client';

import { motion } from 'framer-motion';
import { FiCheckCircle, FiFile, FiTrendingUp, FiShield } from 'react-icons/fi';

export default function ToolsSection() {
  const features = [
    {
      title: 'B2CS Aggregation',
      description: 'Automatically calculates Net Sales (Sales minus Returns) and groups by POS and Rate.',
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'HSN Summary Parsing',
      description: 'Extracts exact HSN codes, quantities, and tax values directly from your Tax Invoice details.',
      icon: <FiFile className="w-6 h-6" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Validation Engine',
      description: 'Checks for negative tax values and missing GSTINs to ensure error-free portal uploads.',
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Secure & Private',
      description: 'Your financial data is processed securely in-memory and never permanently stored.',
      icon: <FiShield className="w-6 h-6" />,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20'
    },
  ];

  return (
    <section id="tools" className="py-24 relative overflow-hidden bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Everything you need to turn raw Meesho spreadsheets into compliant GST returns in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-2xl border ${feature.bg} backdrop-blur-sm hover:bg-white/5 transition-colors group`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} bg-black/40`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
