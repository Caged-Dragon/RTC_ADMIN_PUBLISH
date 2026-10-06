import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, FileText, Printer, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface MailingOptionScreenProps {
  onOpenInvoice: () => void;
}

export const MailingOptionScreen: React.FC<MailingOptionScreenProps> = ({ onOpenInvoice }) => {
  const { storeInfo: STORE_INFO } = useStore();
  const { cart, subtotal, totalBoxes, customerDetails, updateCustomerDetails } = useCart();
  const [recipientEmail, setRecipientEmail] = useState(customerDetails.email || '');
  const [customerName, setCustomerName] = useState(customerDetails.name || '');
  const [notes, setNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const orderId = `RT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const emailSubject = `RedThunder Crackers Sivakasi - 2026 Order Estimate (#${orderId})`;
  
  const generateEmailBody = () => {
    let body = `Dear ${customerName || 'Customer'},\n\n`;
    body += `Thank you for your interest in RedThunder Crackers, Sivakasi (2026 Catalog).\n\n`;
    body += `ORDER QUOTATION DETAILS:\n`;
    body += `Order ID: #${orderId}\n`;
    body += `Items Count: ${cart.length} varieties (${totalBoxes} boxes/units)\n`;
    body += `Subtotal Estimate: ₹${subtotal.toLocaleString('en-IN')}\n`;
    body += `Delivery City: ${customerDetails.city || 'Tamil Nadu'}\n\n`;

    if (cart.length > 0) {
      body += `ITEMIZED BREAKDOWN:\n`;
      cart.forEach((it, i) => {
        body += `${i + 1}. [S.No ${it.product.sNo}] ${it.product.name} - ${it.quantity} ${it.product.unit} @ ₹${it.product.rate} = ₹${it.product.rate * it.quantity}\n`;
      });
      body += `\n`;
    }

    if (notes) {
      body += `Customer Notes: ${notes}\n\n`;
    }

    body += `DISPATCH TERMS:\n`;
    body += `• Dispatched directly from Sivakasi against payment receipt only.\n`;
    body += `• Delivery freight is charged by lorry transport to your town parcel office.\n`;
    body += `• WhatsApp Booking Desk: +91 8124100501\n`;
    body += `• Office: ${STORE_INFO.address}, Sivakasi - 626189\n\n`;
    body += `Best regards,\nRedThunder Crackers Sivakasi`;

    return body;
  };

  const handleSendViaBackend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) { alert('Please enter a valid email address'); return; }
    setSending(true); setStatusMessage(null);
    updateCustomerDetails({ email: recipientEmail, name: customerName, notes });
    const body = generateEmailBody();
    window.location.href = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
    setStatusMessage('Your email app has been opened with the quotation ready to send.');
    setSending(false);
  };

  const handleOpenEmailClient = () => {
    const body = generateEmailBody();
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">
          <Mail className="w-3.5 h-3.5" />
          <span>Email Quotation Service</span>
        </div>
        <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
          Email Your Order Quotation
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 max-w-xl">
          Get a copy of your 2026 cracker quotation delivered to your email or forward it to your family, society, or corporate purchasing team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <form onSubmit={handleSendViaBackend} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                  Recipient Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. yourname@gmail.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                readOnly
                value={emailSubject}
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-100 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-stone-400 dark:text-stone-400 light:text-stone-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 dark:text-stone-300 light:text-stone-700 mb-1">
                Additional Note or Questions (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Write any special requests or delivery preferences to include in the email..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={sending}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending...' : 'Send Email Quotation Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEmailClient}
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4 text-stone-400" />
                <span>Open in Gmail / Mail App</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: Preview of Quotation */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-3">
              <h3 className="font-display text-sm font-bold text-white dark:text-white light:text-stone-900">
                Quotation Summary Preview
              </h3>
              <span className="text-[11px] font-mono text-amber-500">
                #{orderId}
              </span>
            </div>

            <div className="space-y-2 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <strong>{cart.length} varieties</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Units:</span>
                <strong>{totalBoxes} boxes/pkts</strong>
              </div>
              <div className="flex justify-between text-sm font-bold text-white dark:text-white light:text-stone-900 pt-2 border-t border-stone-800 dark:border-stone-800 light:border-stone-200">
                <span>Product Subtotal:</span>
                <span className="text-amber-400 font-display text-base">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenInvoice}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full Official Printable Bill</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/40 text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 space-y-1.5">
            <strong className="text-amber-400 dark:text-amber-400 light:text-amber-800 block">
              Instant Email Delivery
            </strong>
            <p>
              Your email will include the complete 2026 catalog pricing, itemized units, and Sivakasi transport dispatch instructions.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
