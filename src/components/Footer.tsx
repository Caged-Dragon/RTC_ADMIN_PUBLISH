import React from 'react';
import { MessageCircle, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenSafety: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSafety }) => {
  const { storeInfo: STORE_INFO } = useStore();
  return (
    <footer className="bg-stone-950 border-t border-stone-850 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-900">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-black text-white">
                RED<span className="text-red-500">THUNDER</span> CRACKERS
              </span>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                2026
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              {STORE_INFO.tagline}. Direct wholesale & retail online bookings with prompt dispatches across Tamil Nadu and serviceable transport destinations.
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Genuine Sivakasi Factory Direct Stock</span>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Sivakasi Office
            </h4>
            <p className="text-stone-400 leading-relaxed text-xs">
              {STORE_INFO.address},<br />
              {STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}
            </p>
            <p className="text-stone-300 pt-1">
              WhatsApp: <strong className="text-white">{STORE_INFO.phoneDisplay}</strong>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Ordering & Information
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Business Ordering</span>
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenSafety}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Product Safety Instructions
                </button>
              </li>
              <li>
                <span className="text-stone-500">Dispatch: Against payment receipt only</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal & Notice */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500 text-[11px]">
          <p>
            © 2026 {STORE_INFO.name}. All rights reserved. Delivery is subject to applicable laws and serviceable carrier locations.
          </p>
          <p className="text-stone-400">
            Please confirm product availability and delivery charges before payment.
          </p>
        </div>

      </div>
    </footer>
  );
};
