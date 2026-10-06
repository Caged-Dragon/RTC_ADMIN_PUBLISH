import React from 'react';
import {
  Sparkles,
  Grid,
  FileSpreadsheet,
  Gift,
  Truck,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Clock,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ScreenId } from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { LiveOffersSection } from '../components/LiveOffersSection';

interface IntroScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onNavigate }) => {
  const { storeInfo: STORE_INFO } = useStore();
  const { totalBoxes } = useCart();

  return (
    <div className="space-y-16 pb-16">
      <LiveOffersSection />
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden bg-stone-950 border-b border-stone-800 dark:border-stone-800 light:border-stone-200">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/redthunder_hero_crackers_1791297525760.jpg"
            alt="RedThunder Fireworks Diwali Celebration"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
          <div className="max-w-3xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official 2026 Price List • Direct from Sivakasi</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Buy Diwali Crackers at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">Real Factory Prices</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-2xl">
              Welcome to <strong className="text-white">{STORE_INFO.name}</strong>, Sivakasi. No middlemen. You get 100% fresh stock, safe packing, and direct lorry transport delivery to your town.
            </p>

            {/* Quick Action Cards */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-950/60 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Grid className="w-4 h-4" />
                <span>See All Products with Photos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('table')}
                className="px-5 py-3.5 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700/80 dark:border-stone-700/80 light:border-stone-300 font-semibold text-sm hover:border-amber-500 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Full Price Sheet (Table View)</span>
              </button>

              <button
                onClick={() => onNavigate('gift-boxes')}
                className="px-5 py-3.5 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700/80 dark:border-stone-700/80 light:border-stone-300 font-semibold text-sm hover:border-amber-500 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Gift className="w-4 h-4 text-red-400" />
                <span>Diwali Gift Boxes (from ₹400)</span>
              </button>
            </div>

            {/* Simple Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-800 text-xs">
              <div>
                <div className="font-display text-2xl font-black text-white tabular-nums">127</div>
                <div className="text-stone-400 mt-0.5">Types of Crackers</div>
              </div>
              <div>
                <div className="font-display text-2xl font-black text-white tabular-nums">18</div>
                <div className="text-stone-400 mt-0.5">Product Categories</div>
              </div>
              <div>
                <div className="font-display text-2xl font-black text-emerald-400">100%</div>
                <div className="text-stone-400 mt-0.5">Sivakasi Factory Direct</div>
              </div>
              <div>
                <div className="font-display text-2xl font-black text-amber-400">2026</div>
                <div className="text-stone-400 mt-0.5">Fresh Year Stock</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Easy Steps to Order */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            How It Works
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-stone-900 mt-1">
            Order in 4 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-2">
            Anyone can place an order in under 2 minutes. No complicated checkout needed!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900">
              Pick Your Crackers
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Use our photo catalog or price list table. Click "+" to add what you like to your cart.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900">
              Send on WhatsApp
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Click "Send on WhatsApp". Your complete item list and city are sent directly to 8124100501.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900">
              Check Bill & Pay
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Our Sivakasi team checks stock, confirms parcel charges to your town, and sends the final bill.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900">
              Get Your Parcel
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Packed in strong wooden/corrugated boxes and sent via lorry transport to your nearest town office.
            </p>
          </div>

        </div>
      </section>

      {/* Explore More Pages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white dark:text-white light:text-stone-900 mb-6">
          Explore Website Features & Pages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <button
            onClick={() => onNavigate('products')}
            className="p-6 rounded-2xl bg-stone-900/80 dark:bg-stone-900/80 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 text-left hover:border-amber-500 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900 mb-1 group-hover:text-amber-400">
              Product Photos Page
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              See colorful pictures for sparklers, pots, chakkars, aerial rockets, and repeat shots.
            </p>
          </button>

          <button
            onClick={() => onNavigate('table')}
            className="p-6 rounded-2xl bg-stone-900/80 dark:bg-stone-900/80 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 text-left hover:border-amber-500 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900 mb-1 group-hover:text-red-400">
              Price Sheet Table
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Fast spreadsheet format matching our printed price list. Best for quick big orders.
            </p>
          </button>

          <button
            onClick={() => onNavigate('transport')}
            className="p-6 rounded-2xl bg-stone-900/80 dark:bg-stone-900/80 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 text-left hover:border-amber-500 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900 mb-1 group-hover:text-blue-400">
              Delivery Charges to Your City
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Check lorry transport rates, delivery days, and parcel godown locations for your city.
            </p>
          </button>

          <button
            onClick={() => onNavigate('tracker')}
            className="p-6 rounded-2xl bg-stone-900/80 dark:bg-stone-900/80 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 text-left hover:border-amber-500 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900 mb-1 group-hover:text-emerald-400">
              Track Order Status
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Check where your parcel is, see packing status, and get your lorry booking LR number.
            </p>
          </button>

          <button
            onClick={() => onNavigate('whatsapp')}
            className="p-6 rounded-2xl bg-stone-900/80 dark:bg-stone-900/80 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 text-left hover:border-amber-500 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900 mb-1 group-hover:text-emerald-400">
              WhatsApp Messaging Desk
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Chat with our Sivakasi booking team directly at 8124100501 for questions or orders.
            </p>
          </button>

          <button
            onClick={() => onNavigate('mail')}
            className="p-6 rounded-2xl bg-stone-900/80 dark:bg-stone-900/80 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 text-left hover:border-amber-500 transition-all group cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white dark:text-white light:text-stone-900 mb-1 group-hover:text-rose-400">
              Email Quotation Option
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Want a written price estimate sent to your email? Send or download a clean copy here.
            </p>
          </button>

        </div>
      </section>

    </div>
  );
};
