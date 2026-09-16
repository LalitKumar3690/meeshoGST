import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ToolsSection from '@/components/ToolsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />
      <HeroSection />
      <ToolsSection />
      
      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-8">
            <div className="bg-slate-900 px-8 py-4 rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-2">Built for E-Commerce</h2>
              <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Stop wasting hours on Excel</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            The Meesho GST Generator was created to solve a singular problem: the tedious, error-prone process of manually aggregating TCS Sales and Returns data to file GSTR-1. By automating the aggregation of B2C sales and HSN summaries, we save sellers and CAs countless hours every month.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
