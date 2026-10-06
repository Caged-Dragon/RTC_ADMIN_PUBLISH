import React, { useState } from 'react';
import {
  Package,
  Clock,
  Truck,
  FileText,
  RotateCcw,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageSquare,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useCart, PlacedOrder } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ScreenId } from '../components/Navbar';
import { CustomerReviewsFeedback } from '../components/CustomerReviewsFeedback';

interface MyOrdersScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenInvoice: () => void;
  onSelectTrackingId: (id: string) => void;
}

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
  onNavigate,
  onOpenInvoice,
  onSelectTrackingId,
}) => {
  const { storeInfo: STORE_INFO } = useStore();
  const { ordersHistory, reorder } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews'>('orders');
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<string>('');

  const handleTrack = (orderId: string) => {
    onSelectTrackingId(orderId);
    onNavigate('tracker');
  };

  const handleReorder = (order: PlacedOrder) => {
    reorder(order.items);
    onNavigate('cart');
  };

  const handleRateOrder = (orderId: string) => {
    setSelectedOrderForReview(orderId);
    setActiveTab('reviews');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Customer Dashboard Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Customer Account & Bookings Dashboard</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 dark:text-stone-300 light:text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Manage your festive cracker orders, track Sivakasi lorry parcel consignments, view invoices, and share your experience with the community.
          </p>
        </div>

        <button
          onClick={() => onNavigate('products')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>+ Place New Cracker Order</span>
        </button>
      </div>

      {/* Dashboard Sub-Tabs (Orders vs Reviews & Feedback) */}
      <div className="flex border-b border-stone-800 dark:border-stone-800 light:border-stone-200 space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders History ({ordersHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'reviews'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Customer Reviews & Feedback</span>
        </button>
      </div>

      {/* TAB 1: MY ORDERS HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {ordersHistory.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-stone-900/40 dark:bg-stone-900/40 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 p-8 space-y-3">
              <Package className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="text-stone-400">You don't have any past orders yet.</p>
              <button
                onClick={() => onNavigate('products')}
                className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Start Browsing 127 Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersHistory.map((order) => (
                <div
                  key={order.orderId}
                  className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-md space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-amber-400 dark:text-amber-400 light:text-amber-700">
                          #{order.orderId}
                        </span>
                        <span className="text-stone-500" aria-hidden="true">·</span>
                        <span className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600">
                          {order.date}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 dark:text-stone-300 light:text-stone-700">
                        Destination: <strong>{order.customer.city || 'Sivakasi Delivery'}</strong> · {order.customer.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 dark:bg-emerald-950/80 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-800 border border-emerald-800/80 dark:border-emerald-800/80 light:border-emerald-300">
                        ✓ {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 block">Items Count:</span>
                      <strong className="text-stone-200 dark:text-stone-200 light:text-stone-800 font-bold">
                        {order.items.length} varieties ({order.totalBoxes} boxes/units)
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Total Amount:</span>
                      <strong className="text-amber-400 dark:text-amber-400 light:text-amber-700 font-bold text-base tabular-nums">
                        ₹{order.subtotal.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Transport Lorry:</span>
                      <span className="text-stone-300 dark:text-stone-300 light:text-stone-700 font-medium">
                        {order.lorryTransport || 'Sivakasi Transport Booking'}
                      </span>
                    </div>
                  </div>

                  {/* Items Quick Preview */}
                  <div className="pt-2 text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 border-t border-stone-800/60 dark:border-stone-800/60 light:border-stone-200">
                    <span className="font-semibold text-stone-300 dark:text-stone-300 light:text-stone-700 mr-2">Includes:</span>
                    {order.items.slice(0, 3).map((it) => `${it.product.name} (${it.quantity})`).join(', ')}
                    {order.items.length > 3 && ` + ${order.items.length - 3} more`}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleTrack(order.orderId)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Parcel</span>
                    </button>

                    <button
                      onClick={() => handleRateOrder(order.orderId)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Rate this order and submit feedback"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Rate Order & Review</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>1-Click Re-Order</span>
                    </button>

                    <button
                      onClick={onOpenInvoice}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Bill</span>
                    </button>

                    <a
                      href={`https://wa.me/${STORE_INFO.phone}?text=${encodeURIComponent(
                        `Hello RedThunder Sivakasi, I am asking about my order #${order.orderId}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-200 dark:text-stone-200 light:text-stone-800 border border-stone-700 dark:border-stone-700 light:border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ask on WhatsApp</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOMER REVIEWS & FEEDBACK */}
      {activeTab === 'reviews' && (
        <CustomerReviewsFeedback
          orders={ordersHistory}
          prefilledOrderId={selectedOrderForReview}
          onFeedbackSubmitted={() => {
            setSelectedOrderForReview('');
          }}
        />
      )}

    </div>
  );
};
