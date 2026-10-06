import React, { useRef, useState } from 'react';
import { X, Printer, Download, Sparkles, MapPin, Phone, CheckCircle2, Loader2, Check } from 'lucide-react';
import { useCart, PlacedOrder } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: PlacedOrder | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  const { storeInfo: STORE_INFO } = useStore();
  const { cart, subtotal, totalBoxes, customerDetails } = useCart();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Use either the explicit order or current active cart
  const itemsToDisplay = order ? order.items : cart;
  const subtotalToDisplay = order ? order.subtotal : subtotal;
  const totalBoxesToDisplay = order ? order.totalBoxes : totalBoxes;
  const customerToDisplay = order ? order.customer : customerDetails;
  const dateStr = order ? order.date : new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const orderIdStr = order ? order.orderId : 'RT-2026-ESTIMATE';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      setIsDownloading(true);
      const html2canvasModule = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = invoiceRef.current;
      const canvas = await html2canvasModule(element, {
        scale: 2, // High DPI / Retina sharpness
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        // Multi-page or scale to fit
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight, undefined, 'FAST');
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight, undefined, 'FAST');
      }

      pdf.save(`RedThunder_Crackers_Invoice_${orderIdStr}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error, fallback to print', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white text-stone-900 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print p-4 sm:p-5 bg-stone-900 border-b border-stone-800 text-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white text-sm sm:text-base">
              Official 2026 Order Estimate & Invoice
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded font-mono font-bold">
              PROFORMA
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Download as PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              title="Download professional PDF invoice document"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print invoice or browser save"
            >
              <Printer className="w-3.5 h-3.5 text-stone-400" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & PDF Capture Invoice Sheet */}
        <div ref={invoiceRef} id="printable-invoice-sheet" className="p-6 sm:p-8 space-y-6 text-stone-800 bg-white">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                  REDTHUNDER <span className="text-stone-900">CRACKERS</span>
                </span>
              </div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                2026 Product Catalog & Direct Factory Godown • Sivakasi
              </p>
              <p className="text-xs text-stone-600 mt-1 max-w-sm leading-relaxed">
                {STORE_INFO.address},<br />
                {STORE_INFO.city}, {STORE_INFO.state} - {STORE_INFO.pincode}
              </p>
              <p className="text-xs font-medium text-stone-700 mt-1.5 flex items-center gap-1">
                <span>WhatsApp / Phone:</span>
                <strong className="text-stone-900 font-bold">{STORE_INFO.phoneDisplay}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 text-xs font-black bg-red-100 text-red-800 rounded-lg border border-red-200">
                PROFORMA ESTIMATE
              </span>
              <p className="font-mono text-sm font-black text-stone-900 mt-2">
                #{orderIdStr}
              </p>
              <p className="text-xs font-mono text-stone-600 mt-1">
                Date: <strong className="text-stone-800 font-semibold">{dateStr}</strong>
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Official Season: <strong>Diwali 2026</strong>
              </p>
            </div>
          </div>

          {/* Customer Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px]">
                Consignee / Customer Details:
              </span>
              <p className="font-bold text-sm text-stone-900 mt-1">
                {customerToDisplay.name || 'Valued Festival Customer'}
              </p>
              <p className="text-stone-700 mt-0.5 font-mono">
                Phone: {customerToDisplay.phone || '+91 - Verified via WhatsApp'}
              </p>
              {customerToDisplay.email && (
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Email: {customerToDisplay.email}
                </p>
              )}
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px]">
                Delivery Destination & Transport Hub:
              </span>
              <p className="font-bold text-stone-800 mt-1">
                {customerToDisplay.city ? `${customerToDisplay.city}, ${customerToDisplay.state}` : 'City Destination to be confirmed'}
                {customerToDisplay.pincode ? ` - ${customerToDisplay.pincode}` : ''}
              </p>
              {customerToDisplay.address && (
                <p className="text-stone-600 mt-0.5 text-[11px] truncate">
                  {customerToDisplay.address}
                </p>
              )}
              <p className="text-amber-800 font-semibold mt-1 text-[11px] bg-amber-50 p-1.5 rounded border border-amber-200">
                Lorry Mode: {customerToDisplay.transportPreference}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                  <th className="py-2.5 px-3">Description of Crackers</th>
                  <th className="py-2.5 px-2 text-center w-16">Unit</th>
                  <th className="py-2.5 px-3 text-right w-20">Rate (₹)</th>
                  <th className="py-2.5 px-2 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-24">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700">
                {itemsToDisplay.map((item, idx) => (
                  <tr key={item.product.id || idx} className={idx % 2 === 1 ? 'bg-stone-50/50' : 'bg-white'}>
                    <td className="py-2 px-3 text-center font-mono font-bold text-stone-500">
                      #{item.product.sNo}
                    </td>
                    <td className="py-2 px-3 font-semibold text-stone-900">
                      {item.product.name}
                      {item.product.pieces && (
                        <span className="text-[10px] text-stone-500 ml-1.5 font-normal">
                          ({item.product.pieces})
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center text-stone-600 uppercase font-mono text-[11px]">
                      {item.product.unit}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-stone-800 font-mono">
                      ₹{item.product.rate}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-stone-900 tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-right font-black text-stone-900 tabular-nums">
                      ₹{(item.product.rate * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-stone-600 space-y-1.5 max-w-sm">
              <p className="font-bold text-stone-800">Important Sivakasi Despatch Terms:</p>
              <p>• Against 100% advance payment receipt only, crackers will be dispatched from Sivakasi factory.</p>
              <p>• Transport lorry freight is collected at the destination parcel office (To-Pay basis).</p>
              <p>• Certified Green Crackers under Supreme Court & CSIR-NEERI norms.</p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs border border-stone-200 rounded-2xl p-4 bg-stone-50">
              <div className="flex justify-between text-stone-600">
                <span>Total Items:</span>
                <span className="font-bold text-stone-800">{itemsToDisplay.length} varieties</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Units:</span>
                <span className="font-bold text-stone-800">{totalBoxesToDisplay} boxes/pkts</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Lorry Freight:</span>
                <span className="font-semibold text-stone-800">To Pay at Destination</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Estimated Net Total:</span>
                <span className="text-red-600 text-lg tabular-nums font-black">
                  ₹{subtotalToDisplay.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 gap-2">
            <div>
              <span>REDTHUNDER CRACKERS, Sivakasi • Genuine 2026 Factory Prices • Safe Celebrations</span>
            </div>
            <div className="text-right font-semibold text-stone-800">
              WhatsApp Booking: +91 8124100501
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
