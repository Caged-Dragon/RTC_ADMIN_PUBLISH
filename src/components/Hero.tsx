import React from 'react';
import { MessageCircle, FileSpreadsheet, Sparkles, MapPin, ShieldCheck, ArrowDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onExploreCatalog: () => void;
  onExploreTable: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onExploreTable }) => {
  const { storeInfo: STORE_INFO } = useStore();
  return (
    <section className="relative overflow-hidden bg-stone-950 border-b border-stone-800">
      {/* Background Image with Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/redthunder_hero_crackers_1791297525760.jpg"
          alt="RedThunder Sivakasi fireworks celebration"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-3xl">
          
          {/* Authentic Regional Trust Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400 mb-4 tracking-wide uppercase">
            <span className="flex items-center gap-1.5 bg-amber-950/70 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Sivakasi, Tamil Nadu - 626189
            </span>
            <span className="text-stone-500" aria-hidden="true">·</span>
            <span className="text-stone-300">Official 2026 Price List</span>
            <span className="text-stone-500" aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Factory Dispatches
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance mb-6">
            Light Up Your Celebrations with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">Joy & Safety</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-2xl">
            Complete wholesale & retail 2026 catalog from <strong className="text-white font-semibold">{STORE_INFO.name}</strong>. 
            Choose your favorites, create an itemized cart, and send your order directly to our Sivakasi booking team via WhatsApp.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onExploreCatalog}
              className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm shadow-lg shadow-red-950/60 hover:shadow-red-900/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Browse 127 Products</span>
            </button>

            <button
              onClick={onExploreTable}
              className="px-5 py-3.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Bulk Order Sheet (PDF Style)</span>
            </button>

            <a
              href={`https://wa.me/${STORE_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: 8124100501</span>
            </a>
          </div>

          {/* Trust Metrics Adjacency */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-800/80 text-stone-400 text-xs">
            <div>
              <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">127</div>
              <div className="mt-0.5 text-stone-400">Catalog Items</div>
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">18</div>
              <div className="mt-0.5 text-stone-400">Festive Categories</div>
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-bold text-white">Direct</div>
              <div className="mt-0.5 text-stone-400">Sivakasi Transport</div>
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-bold text-amber-400">2026</div>
              <div className="mt-0.5 text-stone-400">Fresh Stock Rates</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
