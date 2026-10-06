import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, FileText, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvoice: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenInvoice,
}) => {
  const { storeInfo: STORE_INFO } = useStore();
  const { cart, subtotal, totalBoxes, customerDetails, updateCustomerDetails, placeOrder } = useCart();
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState('Pending');
  const [backendSaved, setBackendSaved] = useState(false);

  if (!isOpen) return null;

  const recordAndSync = async () => {
    const saved = await placeOrder();
    setOrderId(saved.orderId);
    return saved;
  };

  const saveToBackend = async () => {
    // Orders are now created directly through the Supabase RPC in placeOrder().
    return true;
  };

  const handleCopy = async () => {
    try {
      const saved = await recordAndSync();
      const text = formatWhatsAppMessage(saved.items, saved.customer, saved.subtotal, saved.orderId);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e: any) {
      alert(e.message || 'Unable to place order.');
    }
  };

  const handleWhatsAppClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const saved = await recordAndSync();
      window.open(getWhatsAppUrl(saved.items, saved.customer, saved.subtotal, saved.orderId), '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      alert(e.message || 'Unable to place order.');
    }
  };

  const whatsappUrl = getWhatsAppUrl(cart, customerDetails, subtotal, orderId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-950 dark:bg-stone-950 light:bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 dark:bg-emerald-950 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 border border-emerald-800/80 dark:border-emerald-800/80 light:border-emerald-300">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900">
                Complete Your Sivakasi WhatsApp Order
              </h2>
              <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600">
                Order ID: <span className="font-mono text-amber-400 dark:text-amber-400 light:text-amber-700 font-semibold">{orderId}</span> · {totalBoxes} units · ₹{subtotal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-800 light:hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Important Dispatch Notice from Catalog */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 dark:bg-amber-950/30 light:bg-amber-50 border border-amber-900/50 dark:border-amber-900/50 light:border-amber-200 flex gap-3 text-xs text-amber-200/90 dark:text-amber-200/90 light:text-amber-900 leading-relaxed">
            <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400 dark:text-amber-300 light:text-amber-900 font-semibold block mb-0.5">
                Official Sivakasi Dispatch Policy:
              </strong>
              Orders are dispatched against payment receipt only. Our Sivakasi team will verify product stock, compute exact transport lorry parcel charges for your city/location, and confirm your final invoice.
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-white dark:text-white light:text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Customer & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar"
                  value={customerDetails.name}
                  onChange={(e) => updateCustomerDetails({ name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  WhatsApp / Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customerDetails.phone}
                  onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  City / Town <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, Madurai, Coimbatore"
                  value={customerDetails.city}
                  onChange={(e) => updateCustomerDetails({ city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 600001"
                  value={customerDetails.pincode}
                  onChange={(e) => updateCustomerDetails({ pincode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  Complete Delivery Address / Landmark
                </label>
                <textarea
                  rows={2}
                  placeholder="Street name, area, door number or transport godown preference"
                  value={customerDetails.address}
                  onChange={(e) => updateCustomerDetails({ address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  Transport Preference
                </label>
                <select
                  value={customerDetails.transportPreference}
                  onChange={(e) => updateCustomerDetails({ transportPreference: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-white dark:text-white light:text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Lorry Transport Parcel Office Pickup (Standard & Economical)">
                    Lorry Transport Parcel Office Pickup (Standard & Economical)
                  </option>
                  <option value="Direct Sivakasi Godown / Counter Pickup">
                    Direct Sivakasi Godown / Counter Pickup (No transport fee)
                  </option>
                  <option value="Home Delivery (Subject to local transport availability)">
                    Home Delivery (Subject to local transport availability)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Order Review Snippet */}
          <div className="p-3.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-stone-400 dark:text-stone-400 light:text-stone-600 font-medium">
              <span>Order Summary:</span>
              <span className="text-white dark:text-white light:text-stone-900 font-semibold">
                {cart.length} varieties · {totalBoxes} units
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white dark:text-white light:text-stone-900 pt-2 border-t border-stone-800/80 dark:border-stone-800/80 light:border-stone-200">
              <span>Product Estimate Total:</span>
              <span className="text-amber-400 dark:text-amber-400 light:text-amber-700 font-display text-base tabular-nums">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-950 dark:bg-stone-950 light:bg-stone-50 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5 text-emerald-100" />
            <span>Send Order via WhatsApp Now</span>
          </a>

          <button
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white hover:bg-stone-800 text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700/80 dark:border-stone-700/80 light:border-stone-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Order Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-400" />
                <span>Copy Order Text</span>
              </>
            )}
          </button>

          <button
            onClick={async () => {
              try { await recordAndSync(); onClose(); onOpenInvoice(); } catch (e: any) { alert(e.message || 'Unable to place order.'); }
            }}
            className="py-3 px-4 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white hover:bg-stone-800 text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700/80 dark:border-stone-700/80 light:border-stone-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>View Invoice</span>
          </button>
        </div>

      </div>
    </div>
  );
};
