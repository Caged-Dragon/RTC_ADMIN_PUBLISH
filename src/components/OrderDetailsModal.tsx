import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  MessageCircle,
  Phone,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { PlacedOrder } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PlacedOrder | null;
  onUpdateStatus: (orderId: string, status: PlacedOrder['status'], lrNumber?: string, transporter?: string) => void;
  onOpenInvoice: (order: PlacedOrder) => void;
  onOpenPackingSlip: (order: PlacedOrder) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onOpenInvoice,
  onOpenPackingSlip,
}) => {
  const { storeInfo: STORE_INFO } = useStore();
  const [copied, setCopied] = useState(false);
  const [isEditingLR, setIsEditingLR] = useState(false);
  const [lrInput, setLrInput] = useState(order?.lrNumber || '');
  const [transporterInput, setTransporterInput] = useState(order?.lorryTransport || 'ARC Parcels Sivakasi Booking');

  if (!isOpen || !order) return null;

  // Copy plain text order summary for WhatsApp / SMS
  const handleCopySummary = () => {
    let summary = `REDTHUNDER CRACKERS - ORDER #${order.orderId}\n`;
    summary += `Customer: ${order.customer.name} (${order.customer.phone})\n`;
    summary += `City: ${order.customer.city}, ${order.customer.state}\n`;
    summary += `Status: ${order.status}\n`;
    if (order.lrNumber) summary += `Lorry LR No: ${order.lrNumber} (${order.lorryTransport || 'Sivakasi Transport'})\n`;
    summary += `----------------------------\n`;
    order.items.forEach((item) => {
      summary += `#${item.product.sNo} ${item.product.name} x ${item.quantity} ${item.product.unit} = ₹${item.product.rate * item.quantity}\n`;
    });
    summary += `----------------------------\n`;
    summary += `Total: ${order.totalBoxes} boxes | Net Amount: ₹${order.subtotal.toLocaleString('en-IN')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Direct WhatsApp message from Seller to Customer
  const handleWhatsApp = () => {
    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    let text = `*REDTHUNDER CRACKERS, SIVAKASI - ORDER UPDATE*\n`;
    text += `Dear ${order.customer.name},\n\n`;
    text += `Greetings from RedThunder Crackers Factory Godown, Sivakasi!\n`;
    text += `Your order *#${order.orderId}* status is: *${order.status.toUpperCase()}*.\n\n`;
    text += `*Order Breakdown:*\n`;
    text += `• Total Boxes/Cartons: ${order.totalBoxes} items\n`;
    text += `• Total Bill Amount: ₹${order.subtotal.toLocaleString('en-IN')}\n`;
    text += `• Delivery Hub: ${order.customer.city}, ${order.customer.state}\n`;
    
    if (order.lrNumber) {
      text += `\n*🚚 Sivakasi Lorry Dispatch:* \n`;
      text += `• Transporter: ${order.lorryTransport || order.customer.transportPreference}\n`;
      text += `• Lorry Receipt (LR) No: *${order.lrNumber}*\n`;
      text += `• Please present this LR number at your city parcel counter for pickup.\n`;
    }

    text += `\nThank you for celebrating with RedThunder Crackers, Sivakasi! (WhatsApp: ${STORE_INFO.phoneDisplay})`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSaveLR = () => {
    onUpdateStatus(order.orderId, 'Sent via Lorry', lrInput, transporterInput);
    setIsEditingLR(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-stone-100 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-amber-400">#{order.orderId}</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {order.date}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Customer: <strong className="text-white">{order.customer.name}</strong> • City: <strong className="text-amber-300">{order.customer.city}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              order.status === 'Sent via Lorry'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                : order.status === 'Packed in Sivakasi'
                ? 'bg-blue-950/80 text-blue-300 border-blue-600'
                : order.status === 'Payment Checked'
                ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                : 'bg-stone-800 text-stone-300 border-stone-700'
            }`}>
              {order.status}
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top Status Progression Banner */}
          <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-stone-400 text-[11px] font-bold uppercase block mb-1">
                Sivakasi Dispatch Workflow Stage:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onUpdateStatus(order.orderId, 'Payment Checked')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    order.status === 'Payment Checked'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Payment Verified</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(order.orderId, 'Packed in Sivakasi')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    order.status === 'Packed in Sivakasi'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. Packed in Godown</span>
                </button>

                <button
                  onClick={() => {
                    const lr = prompt('Enter Sivakasi Lorry Receipt (LR) Number:', order.lrNumber || ('SVKS-LR-' + Math.floor(100000 + Math.random() * 900000)));
                    if (lr) {
                      onUpdateStatus(order.orderId, 'Sent via Lorry', lr);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    order.status === 'Sent via Lorry'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-stone-700'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3. Dispatched via Lorry</span>
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </button>

              <button
                onClick={() => onOpenInvoice(order)}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>

              <button
                onClick={() => onOpenPackingSlip(order)}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Packing Slip</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Copy order text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Customer Profile & Transport Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Details Card */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2.5">
              <span className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Customer & Destination Contact</span>
              </span>

              <div className="space-y-1 text-stone-300">
                <div className="text-sm font-bold text-white">{order.customer.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">Mobile Phone:</span>
                  <strong className="font-mono text-amber-300">{order.customer.phone}</strong>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] flex items-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5" />
                    <span>Call</span>
                  </a>
                </div>
                <div>
                  <span className="text-stone-400">Email:</span> {order.customer.email || 'N/A'}
                </div>
                <div>
                  <span className="text-stone-400">Address:</span> {order.customer.address}
                </div>
                <div>
                  <span className="text-stone-400">City / State / Pin:</span>{' '}
                  <strong className="text-white">
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </strong>
                </div>
                {order.customer.notes && (
                  <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-400 mt-2">
                    <span className="text-amber-400 font-bold">Buyer Note:</span> {order.customer.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Lorry Transport Card */}
            <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Sivakasi Lorry Consignment & LR Status</span>
                </span>
                {!isEditingLR ? (
                  <button
                    onClick={() => {
                      setLrInput(order.lrNumber || '');
                      setTransporterInput(order.lorryTransport || 'ARC Parcels Sivakasi Booking');
                      setIsEditingLR(true);
                    }}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer font-semibold"
                  >
                    Edit LR Details
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingLR(false)}
                    className="text-[11px] text-stone-400 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditingLR ? (
                <div className="space-y-1.5 text-stone-300">
                  <div>
                    <span className="text-stone-400">Transport Carrier:</span>{' '}
                    <strong className="text-white">
                      {order.lorryTransport || order.customer.transportPreference}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Lorry Receipt (LR) No:</span>{' '}
                    {order.lrNumber ? (
                      <strong className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                        {order.lrNumber}
                      </strong>
                    ) : (
                      <span className="text-amber-400 italic">Not booked yet (Awaiting warehouse packing)</span>
                    )}
                  </div>
                  <div className="text-stone-400 text-[11px] pt-1">
                    * Crackers dispatched via licensed Sivakasi dangerous goods carrier with waterproof gunny wrapping.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[10px] text-stone-400 block font-bold mb-1">Carrier Name:</label>
                    <input
                      type="text"
                      value={transporterInput}
                      onChange={(e) => setTransporterInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block font-bold mb-1">LR Tracking Number:</label>
                    <input
                      type="text"
                      value={lrInput}
                      onChange={(e) => setLrInput(e.target.value)}
                      placeholder="e.g. SVKS-LR-782194"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-white text-xs font-mono font-bold"
                    />
                  </div>
                  <button
                    onClick={handleSaveLR}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    Save & Update LR
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Itemized Products Checklist Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase text-stone-400">
                Itemized Order Varieties ({order.items.length} types • {order.totalBoxes} total boxes)
              </span>
              <span className="text-stone-400 text-[11px]">
                Warehouse Count Verification
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-950 text-stone-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                    <th className="py-2.5 px-4">Product Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-2 text-center w-16">Unit</th>
                    <th className="py-2.5 px-3 text-right w-24">Rate (₹)</th>
                    <th className="py-2.5 px-2 text-center w-20">Ordered Qty</th>
                    <th className="py-2.5 px-4 text-right w-28">Line Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 text-stone-300">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-850">
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-500">
                        #{item.product.sNo}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-white">
                        <div>{item.product.name}</div>
                        {item.product.pieces && (
                          <div className="text-[10px] text-stone-400 font-normal">
                            Pack: {item.product.pieces}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-stone-400">
                        {item.product.category}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">
                        {item.product.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        ₹{item.product.rate}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-amber-400 font-mono text-sm">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-white font-mono text-sm">
                        ₹{(item.product.rate * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown Summary */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs text-stone-400 space-y-1">
              <div>Payment Terms: <strong>100% Advance Payment Receipt before Godown Despatch</strong></div>
              <div>Lorry Freight: <strong>To-Pay at Destination Parcel Office</strong></div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 block">Total Net Order Value:</span>
              <span className="font-display text-2xl font-black text-amber-400 tabular-nums">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
