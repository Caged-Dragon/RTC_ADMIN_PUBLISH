import React, { useEffect, useState } from 'react';
import { BadgePercent, Tag } from 'lucide-react';
import { dbSelect } from '../lib/supabase';

export const LiveOffersSection: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  useEffect(() => {
    dbSelect<any>('offers', 'select=*,offer_banners(*)&is_active=eq.true&order=display_order.asc,priority.desc')
      .then(setOffers)
      .catch(() => setOffers([]));
  }, []);
  if (!offers.length) return null;
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
    <div className="rounded-2xl border border-amber-700/30 bg-amber-950/20 p-5 space-y-4">
      <div className="flex items-center gap-2"><BadgePercent className="w-5 h-5 text-amber-400"/><h2 className="font-display text-xl font-black text-white">Current Offers</h2></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map(o => {
          const banner=(o.offer_banners||[]).find((b:any)=>b.is_active);
          return <article key={o.id} className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900/80">
            {banner?.image_url && <img src={banner.image_url} alt={banner.alt_text || o.title} className="w-full h-40 object-cover" />}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-white">{o.title}</h3><Tag className="w-4 h-4 text-amber-400 shrink-0"/></div>
              {o.short_title && <p className="text-amber-300 text-xs font-semibold">{o.short_title}</p>}
              {o.description && <p className="text-xs text-stone-400 leading-relaxed">{o.description}</p>}
              {o.minimum_order_value != null && <p className="text-[11px] text-stone-500">Minimum order: ₹{Number(o.minimum_order_value).toLocaleString('en-IN')}</p>}
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
};
