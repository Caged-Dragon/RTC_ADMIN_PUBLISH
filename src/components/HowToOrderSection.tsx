import React from 'react';
import { MessageCircle, MapPin, Truck, CheckCircle2, ShieldAlert, ArrowRight, PhoneCall } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export const HowToOrderSection: React.FC = () => {
  const { storeInfo: STORE_INFO } = useStore();
  const { setIsCartOpen } = useCart();

  const steps = [
    {
      num: '01',
      title: 'Select Products & Quantities',
      desc: 'Add items from our 127 catalog products or use the quick price sheet matrix. Your cart calculates the total instantly.',
    },
    {
      num: '02',
      title: 'Send Order on WhatsApp',
      desc: 'Click "Order on WhatsApp". Your complete itemized list and delivery location will be formatted and sent to 8124100501.',
    },
    {
      num: '03',
      title: 'Quotation & Stock Confirmation',
      desc: 'Our Sivakasi dispatch desk verifies stock availability and shares exact transport lorry parcel charges for your city.',
    },
    {
      num: '04',
      title: 'Payment & Fast Sivakasi Dispatch',
      desc: 'Upon payment receipt, your goods are packed securely in wooden/corrugated containers and dispatched via registered transport.',
    },
  ];

  return (
    <section id="how-to-order" className="py-16 bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Official Booking Guide
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How to Order from Sivakasi
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            Simple, transparent, and direct booking via WhatsApp Business at <strong className="text-white">{STORE_INFO.phoneDisplay}</strong>.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-2xl font-black text-amber-500/80 mb-3 block">
                  {step.num}
                </span>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Catalog Terms & Official Sivakasi Info Banner */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-500" />
              <span>Payment & Sivakasi Dispatch Terms</span>
            </h3>
            
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Payment & Dispatch:</strong> Against payment receipt only, crackers will be dispatched directly from Sivakasi factory godown.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Transport Charges:</strong> Delivery charges are additional and depend on destination town, package weight, and volume.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Serviceable Locations:</strong> Delivery is subject to applicable state laws and carrier-serviceable transport godowns.
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${STORE_INFO.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp: {STORE_INFO.phoneDisplay}</span>
              </a>

              <button
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
              >
                <span>View Cart Items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-3 text-xs">
            <span className="font-semibold text-amber-400 uppercase tracking-wider block text-[11px]">
              Sivakasi Booking Office Address
            </span>
            <p className="text-sm font-bold text-white">
              {STORE_INFO.name}
            </p>
            <p className="text-stone-300 leading-relaxed">
              {STORE_INFO.address},<br />
              {STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}
            </p>
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-stone-400">
              <span>WhatsApp Business:</span>
              <strong className="text-amber-400 font-mono">{STORE_INFO.phoneDisplay}</strong>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
