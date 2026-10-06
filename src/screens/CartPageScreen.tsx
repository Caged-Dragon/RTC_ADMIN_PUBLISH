import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  FileText,
  Mail,
  Truck,
  MapPin,
  Check,
  Copy,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart, PlacedOrder } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { ScreenId } from '../components/Navbar';

interface CartPageScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenInvoice: () => void;
}

export const CartPageScreen: React.FC<CartPageScreenProps> = ({ onNavigate, onOpenInvoice }) => {
  const { storeInfo: STORE_INFO } = useStore();
  const {
    cart,
    subtotal,
    totalBoxes,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    customerDetails,
    updateCustomerDetails,
    placeOrder,
  } = useCart();

  const [copied, setCopied] = useState(false);

  const recordOrder = async () => placeOrder();

  const handleWhatsAppSend = async () => {
    try {
      const saved = await recordOrder();
      window.open(getWhatsAppUrl(saved.items, saved.customer, saved.subtotal, saved.orderId), '_blank');
    } catch (e: any) { alert(e.message || 'Unable to place order.'); }
  };

  const handleCopyText = async () => {
    try {
      const saved = await recordOrder();
      const text = formatWhatsAppMessage(saved.items, saved.customer, saved.subtotal, saved.orderId);
      await navigator.clipboard.writeText(text);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    } catch (e: any) { alert(e.message || 'Unable to place order.'); }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Review & Checkout</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
            Your Cracker Cart ({totalBoxes} items)
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1">
            Check your items, enter your delivery city, and click "Send Order on WhatsApp".
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-red-400 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-stone-900/40 dark:bg-stone-900/40 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-800/80 dark:bg-stone-800/80 light:bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-white dark:text-white light:text-stone-900">
            Your cart is currently empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 max-w-sm mx-auto">
            You haven't picked any crackers yet. Browse our photos catalog or full price list to choose your favorites.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('products')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Browse Products with Photos
            </button>
            <button
              onClick={() => onNavigate('table')}
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Open Price Sheet Table
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="p-4 rounded-xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm">
              <h3 className="font-display text-sm font-bold text-white dark:text-white light:text-stone-900 mb-3">
                Selected Crackers ({totalItems} varieties)
              </h3>

              <div className="divide-y divide-stone-800/80 dark:divide-stone-800/80 light:divide-stone-200 space-y-2">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-amber-500 font-bold">#{product.sNo}</span>
                        <span className="text-[10px] uppercase font-semibold text-stone-500">
                          {product.unit}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white dark:text-white light:text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-stone-400 dark:text-stone-400 light:text-stone-600 mt-0.5">
                        ₹{product.rate} × {quantity} ={' '}
                        <strong className="text-amber-400 dark:text-amber-400 light:text-amber-800 font-bold tabular-nums">
                          ₹{(product.rate * quantity).toLocaleString('en-IN')}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-stone-950 dark:bg-stone-950 light:bg-stone-100 border border-stone-800 dark:border-stone-800 light:border-stone-300 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-amber-400 dark:text-amber-400 light:text-amber-800 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 text-stone-500 hover:text-red-400 cursor-pointer"
                        title="Remove this item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sivakasi Packing & Freight Info */}
            <div className="p-4 rounded-xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/40 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Truck className="w-4 h-4" />
                <span>Direct Sivakasi Transport Dispatch</span>
              </div>
              <p className="leading-relaxed">
                • Dispatched against payment receipt only directly from our Sivakasi godown.
              </p>
              <p className="leading-relaxed">
                • Delivery freight charge is paid to the lorry transport parcel office in your town upon collecting your parcel (To-Pay basis).
              </p>
            </div>

          </div>

          {/* Right Column: Customer Details & Order Actions */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Customer Details Form */}
            <div className="p-5 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-xl space-y-4">
              <h3 className="font-display text-sm font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Your Delivery Details</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-semibold mb-1">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={customerDetails.name}
                    onChange={(e) => updateCustomerDetails({ name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-semibold mb-1">
                      WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerDetails.phone}
                      onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-semibold mb-1">
                      Delivery City / Town <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Madurai"
                      value={customerDetails.city}
                      onChange={(e) => updateCustomerDetails({ city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-semibold mb-1">
                    Your Email (for email receipt)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={customerDetails.email}
                    onChange={(e) => updateCustomerDetails({ email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-semibold mb-1">
                    Full Address / Landmark
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Door number, street, or preferred transport godown"
                    value={customerDetails.address}
                    onChange={(e) => updateCustomerDetails({ address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-400">
                  <span>Total Varieties:</span>
                  <span className="font-bold text-white dark:text-white light:text-stone-900">{totalItems} items</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Total Units:</span>
                  <span className="font-bold text-white dark:text-white light:text-stone-900">{totalBoxes} boxes/pkts</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white dark:text-white light:text-stone-900 pt-2 border-t border-stone-800 dark:border-stone-800 light:border-stone-200">
                  <span>Estimated Total:</span>
                  <span className="font-display text-lg text-amber-400 dark:text-amber-400 light:text-amber-700 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppSend}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Order on WhatsApp (8124100501)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyText}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    <span>{copied ? 'Copied!' : 'Copy Order Text'}</span>
                  </button>

                  <button
                    onClick={onOpenInvoice}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>View / Print Bill</span>
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('mail')}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-stone-100 hover:bg-stone-800 text-stone-300 dark:text-stone-300 light:text-stone-700 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>Send Bill to Email</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
