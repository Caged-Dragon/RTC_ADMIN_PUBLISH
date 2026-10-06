import React, { useState, useEffect } from 'react';
import { PackageCheck, Search, CheckCircle2, Clock, Truck, ShieldAlert, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { dbSelect, rpc } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface OrderData {
  orderId: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    state: string;
    pincode: string;
    transportPreference: string;
  };
  items: Array<{
    productId: number;
    sNo: number;
    name: string;
    unit: string;
    rate: number;
    quantity: number;
    lineTotal: number;
  }>;
  totalBoxes: number;
  subtotal: number;
  status: string;
  trackingNumber?: string;
  lorryTransportName?: string;
}

export const TrackerScreen: React.FC = () => {
  const { storeInfo: STORE_INFO } = useStore();
  const [searchId, setSearchId] = useState('');
  const [trackingToken, setTrackingToken] = useState('');
  const { session } = useAuth();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true); setError(null);
    try {
      let payload:any;
      if (trackingToken.trim()) {
        payload = await rpc('get_guest_order',{p_order_number:Number(id.replace(/\D/g,'')),p_token:trackingToken.trim()},session?.access_token);
      } else {
        const rows:any[] = await dbSelect<any>('orders', `select=*,order_items(*),order_tracking(*)&order_number=eq.${Number(id.replace(/\D/g,''))}&limit=1`, session?.access_token);
        if (!rows[0]) throw new Error('Order not found. Sign in to track your account order, or enter the guest tracking token.');
        payload={order:rows[0],items:rows[0].order_items||[],tracking:rows[0].order_tracking||[]};
      }
      if (!payload?.order) throw new Error('Order not found or tracking token is invalid.');
      const o=payload.order;
      setOrder({orderId:String(o.order_number),createdAt:o.created_at,customer:{name:[o.shipping_first_name,o.shipping_last_name].filter(Boolean).join(' '),phone:o.shipping_phone||o.customer_phone||'',city:o.shipping_city||'',address:o.shipping_address_line_1||'',state:o.shipping_state||'',pincode:o.shipping_postal_code||'',transportPreference:o.lorry_transporter_id||'Sivakasi Transport'},items:(payload.items||[]).map((i:any)=>({productId:Number(i.product_code),sNo:Number(i.product_code),name:i.product_name,unit:i.pack_type,rate:Number(i.unit_price),quantity:Number(i.quantity),lineTotal:Number(i.line_total)})),totalBoxes:Number(o.total_boxes_count||0),subtotal:Number(o.subtotal||0),status:o.status,trackingNumber:o.lr_number,lorryTransportName:o.lorry_transporter_id});
    } catch(err:any) { setOrder(null); setError(err.message || 'Unable to track order'); } finally { setLoading(false); }
  };

  useEffect(() => { /* no demo order; live database is the source of truth */ }, []);

  const getStepStatus = (stepIndex: number, currentStatus?: string) => {
    const statuses = ['pending','confirmed','processing','packed','shipped','out_for_delivery','delivered'];
    const currentIndex = statuses.indexOf(currentStatus || 'QUOTATION_CREATED');
    if (currentIndex >= stepIndex) return 'complete';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'upcoming';
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">
          <PackageCheck className="w-4 h-4 text-emerald-500" />
          <span>Sivakasi Live Order Tracking</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
          Track Your 2026 Cracker Order Status
        </h1>
        <p className="text-sm text-stone-300 dark:text-stone-300 light:text-stone-600 mt-2 max-w-2xl leading-relaxed">
          Enter your Order ID (from your quotation or WhatsApp confirmation) to check packaging status, payment receipt verification, and Sivakasi transport lorry dispatch details.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl">
        <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-2">
          Enter Order ID:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 1"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 text-sm text-white dark:text-white light:text-stone-900 font-mono placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => fetchOrder(searchId)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
        <input value={trackingToken} onChange={e=>setTrackingToken(e.target.value)} placeholder="Guest tracking token (only for guest orders)" className="mt-2 w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white" />
        <div className="mt-2 text-[11px] text-stone-500">
          Use the guest tracking token from your order confirmation. Sign-in customers can track without it. <button onClick={() => { setSearchId('RT-2026-1088'); fetchOrder('RT-2026-1088'); }} className="text-amber-500 font-mono underline hover:text-amber-400">RT-2026-1088</button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Order lookup failed:</strong>
            {error}
          </div>
        </div>
      )}

      {/* Order Details View */}
      {order && (
        <div className="space-y-8">
          
          {/* Tracking Progress Bar Card */}
          <div className="bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  Current Status
                </span>
                <h2 className="font-display text-2xl font-black text-white dark:text-white light:text-stone-900 mt-0.5">
                  Order #{order.orderId}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Booked for: <strong className="text-stone-200 dark:text-stone-200 light:text-stone-800">{order.customer.name}</strong> · {order.customer.city}, {order.customer.state}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/80 dark:bg-emerald-950/80 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-800 border border-emerald-800/80 dark:border-emerald-800/80 light:border-emerald-200">
                  ✓ {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Stages */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-500">STAGE 1</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-xs text-white dark:text-white light:text-stone-900">
                  Quotation Created
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Itemized list and pricing registered in Sivakasi system.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-500">STAGE 2</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-xs text-white dark:text-white light:text-stone-900">
                  WhatsApp Confirmed
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Stock availability and destination lorry route verified.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-500">STAGE 3</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-xs text-white dark:text-white light:text-stone-900">
                  Factory Packed
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Sealed in weatherproof heavy export-grade corrugated cartons.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-500">STAGE 4</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-xs text-white dark:text-white light:text-stone-900">
                  Dispatched from Sivakasi
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Loaded onto registered transport lorry for destination godown.
                </p>
              </div>

            </div>

            {/* Transport details banner */}
            {order.trackingNumber && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-emerald-50 border border-emerald-800/40 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    Transport Lorry Receipt (LR) Details
                  </span>
                  <div className="font-mono text-sm font-bold text-white dark:text-white light:text-stone-900 mt-0.5">
                    LR No: {order.trackingNumber}
                  </div>
                  <div className="text-stone-400 mt-0.5">
                    Agency: {order.lorryTransportName}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${STORE_INFO.phone}?text=${encodeURIComponent(
                    `Hello RedThunder Crackers, please share LR status and godown contact for order #${order.orderId}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask LR on WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Itemized Order Breakdown */}
          <div className="bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 shadow-xl">
            <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 mb-4">
              Items Ordered ({order.items.length} varieties, {order.totalBoxes} units)
            </h3>

            <div className="overflow-x-auto border border-stone-800 dark:border-stone-800 light:border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-950 dark:bg-stone-950 light:bg-stone-100 text-stone-400 font-semibold border-b border-stone-800 dark:border-stone-800 light:border-stone-200">
                    <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                    <th className="py-2.5 px-3">Cracker Item</th>
                    <th className="py-2.5 px-2 text-center w-16">Unit</th>
                    <th className="py-2.5 px-3 text-right w-20">Rate</th>
                    <th className="py-2.5 px-2 text-center w-16">Qty</th>
                    <th className="py-2.5 px-3 text-right w-24">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 dark:divide-stone-800/80 light:divide-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700">
                  {order.items.map((it) => (
                    <tr key={it.productId}>
                      <td className="py-2 px-3 text-center font-mono text-amber-500 font-bold">
                        {it.sNo}
                      </td>
                      <td className="py-2 px-3 font-semibold text-white dark:text-white light:text-stone-900">
                        {it.name}
                      </td>
                      <td className="py-2 px-2 text-center">{it.unit}</td>
                      <td className="py-2 px-3 text-right tabular-nums">₹{it.rate}</td>
                      <td className="py-2 px-2 text-center font-bold text-amber-400 tabular-nums">
                        {it.quantity}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-white dark:text-white light:text-stone-900 tabular-nums">
                        ₹{it.lineTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm font-bold pt-3 border-t border-stone-800 dark:border-stone-800 light:border-stone-200">
              <span className="text-stone-400">Order Product Subtotal:</span>
              <span className="font-display text-xl text-amber-400 tabular-nums">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
