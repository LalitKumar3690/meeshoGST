import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 inline-block">
              MeeshoGST
            </span>
            <p className="text-slate-400 text-sm max-w-sm">
              Automating GST Return generation (GSTR-1 JSON & Excel) specifically for Meesho sellers. Focus on your business, let us handle the compliance.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#tools" className="text-sm text-slate-400 hover:text-white transition-colors">Tools</Link></li>
              <li><Link href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} MeeshoGST Tool. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs mt-2 md:mt-0">
            Not affiliated with Meesho or the Government of India.
          </p>
        </div>
      </div>
    </footer>
  );
}
