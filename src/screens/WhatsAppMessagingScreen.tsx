import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, Phone, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export const WhatsAppMessagingScreen: React.FC = () => {
  const { storeInfo: STORE_INFO } = useStore();
  const { cart, subtotal, totalBoxes, customerDetails } = useCart();
  const [selectedTopic, setSelectedTopic] = useState('order');
  const [customCity, setCustomCity] = useState(customerDetails.city || 'Chennai');
  const [customNote, setCustomNote] = useState('');

  const generateMessage = () => {
    if (selectedTopic === 'order') {
      if (cart.length > 0) {
        return (
          `💥 *REDTHUNDER CRACKERS 2026 ORDER* 💥\n` +
          `Name: ${customerDetails.name || 'Customer'}\n` +
          `City: ${customCity}\n` +
          `Items in cart: ${cart.length} items (${totalBoxes} boxes)\n` +
          `Cart Total: ₹${subtotal.toLocaleString('en-IN')}\n\n` +
          `Please confirm product stock & delivery freight charges.`
        );
      }
      return (
        `💥 *REDTHUNDER CRACKERS SIVAKASI* 💥\n` +
        `Hello, I would like to place an order from your 2026 price list for delivery to ${customCity}.\n` +
        `Please share available stock.`
      );
    }
    if (selectedTopic === 'freight') {
      return (
        `🚚 *DELIVERY CHARGES INQUIRY* 🚚\n` +
        `Hello RedThunder Sivakasi, what are the lorry transport parcel charges to ${customCity}? How many days does delivery take?`
      );
    }
    if (selectedTopic === 'bulk') {
      return (
        `📦 *WHOLESALE / BULK CRACKERS INQUIRY* 📦\n` +
        `Hello, I want to purchase crackers in bulk for Diwali/resale. Please provide wholesale quotation and carton box packing options.`
      );
    }
    if (selectedTopic === 'giftboxes') {
      return (
        `🎁 *DIWALI GIFT BOXES INQUIRY* 🎁\n` +
        `Hello, I want to inquire about your 10 assorted gift boxes (Red Rose, Tulip ₹1000, Jasmine, Sunflower, etc.). Please share corporate/family gift details.`
      );
    }
    return `Hello RedThunder Crackers Sivakasi, ${customNote}`;
  };

  const messageText = generateMessage();
  const whatsappUrl = `https://wa.me/${STORE_INFO.phone}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Official Sivakasi WhatsApp Help Desk</span>
        </div>
        <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
          WhatsApp Messaging & Direct Booking
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 max-w-xl">
          Chat directly with our factory booking office at <strong className="text-white dark:text-white light:text-stone-900">{STORE_INFO.phoneDisplay}</strong>. Choose a message template or write your own note.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Message Builder */}
        <div className="lg:col-span-7 bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 space-y-6 shadow-xl">
          
          <div>
            <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 uppercase tracking-wider mb-2">
              1. What would you like to message us about?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => setSelectedTopic('order')}
                className={`p-3 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic === 'order'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 dark:text-emerald-400 light:text-emerald-800'
                    : 'bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-50 border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700'
                }`}
              >
                Send My Cracker Order {cart.length > 0 && `(${cart.length} items in cart)`}
              </button>

              <button
                onClick={() => setSelectedTopic('freight')}
                className={`p-3 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic === 'freight'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 dark:text-emerald-400 light:text-emerald-800'
                    : 'bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-50 border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700'
                }`}
              >
                Ask Delivery Charges to My Town
              </button>

              <button
                onClick={() => setSelectedTopic('bulk')}
                className={`p-3 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic === 'bulk'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 dark:text-emerald-400 light:text-emerald-800'
                    : 'bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-50 border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700'
                }`}
              >
                Wholesale / Bulk Booking
              </button>

              <button
                onClick={() => setSelectedTopic('giftboxes')}
                className={`p-3 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                  selectedTopic === 'giftboxes'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 dark:text-emerald-400 light:text-emerald-800'
                    : 'bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-50 border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700'
                }`}
              >
                Diwali Gift Boxes Inquiry
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
              Your City or Town
            </label>
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              placeholder="e.g. Chennai, Madurai, Coimbatore, Bangalore"
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
              Message Preview
            </label>
            <div className="p-4 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200 font-mono text-xs text-stone-300 dark:text-stone-300 light:text-stone-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {messageText}
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <MessageCircle className="w-5 h-5 text-emerald-100" />
            <span>Open WhatsApp & Send Message</span>
          </a>

        </div>

        {/* Right Column: Support Info */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-xl space-y-4">
            <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Sivakasi Contact Info</span>
            </h3>

            <div className="space-y-3 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 leading-relaxed">
              <div>
                <span className="text-stone-500 block">Official WhatsApp Number:</span>
                <strong className="text-base text-white dark:text-white light:text-stone-900 font-bold font-mono">
                  {STORE_INFO.phoneDisplay}
                </strong>
              </div>

              <div>
                <span className="text-stone-500 block">Factory Address:</span>
                <span className="text-stone-300 dark:text-stone-300 light:text-stone-800">
                  {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}
                </span>
              </div>

              <div>
                <span className="text-stone-500 block">Working Hours:</span>
                <span className="text-stone-300 dark:text-stone-300 light:text-stone-800">
                  Monday to Sunday: 8:00 AM – 9:30 PM (Diwali Season)
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/40 text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Fast Response Guarantee</span>
            </div>
            <p>
              During festival booking hours, our WhatsApp team responds within 5 to 15 minutes to confirm availability and transport quotes.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
