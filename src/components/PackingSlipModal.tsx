import React from 'react';
import { X, Printer, Package, CheckSquare, Truck, MapPin, Phone } from 'lucide-react';
import { PlacedOrder } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface PackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PlacedOrder | null;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({ isOpen, onClose, order }) => {
  const { storeInfo: STORE_INFO } = useStore();
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white text-stone-900 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print p-4 bg-stone-900 border-b border-stone-800 text-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span className="font-display font-bold text-white text-sm">
              Sivakasi Godown Packing & Dispatch Checklist
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
              #{order.orderId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Packing Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Packing Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800 bg-white">
          
          {/* Header */}
          <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xs font-black tracking-widest text-red-600 uppercase">
                FACTORY GODOWN PACKING SLIP
              </div>
              <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">
                {STORE_INFO.name}
              </h1>
              <p className="text-xs text-stone-600 mt-0.5">
                {STORE_INFO.address}, {STORE_INFO.city} - {STORE_INFO.pincode}
              </p>
              <p className="text-xs text-stone-600">
                Godown Phone: <strong>{STORE_INFO.phoneDisplay}</strong>
              </p>
            </div>

            <div className="text-right sm:border-l sm:pl-6 border-stone-200">
              <div className="font-mono text-sm font-bold text-stone-900">
                ORDER #{order.orderId}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Booking Date: {order.date}
              </div>
              <div className="inline-block mt-2 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded border border-amber-300">
                Stage: {order.status}
              </div>
            </div>
          </div>

          {/* Consignee & Lorry Transport Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Consignee (Customer):
              </span>
              <div className="font-bold text-stone-900 text-sm">{order.customer.name}</div>
              <div className="text-stone-700 mt-0.5">{order.customer.phone}</div>
              <div className="text-stone-600 mt-1">{order.customer.address}</div>
              <div className="font-semibold text-stone-900 mt-0.5">
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </div>
            </div>

            <div className="sm:border-l sm:pl-4 border-stone-200">
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Lorry Transport & Dispatch:
              </span>
              <div className="font-bold text-stone-900">
                {order.lorryTransport || order.customer.transportPreference || 'ARC / KPN Parcels Sivakasi'}
              </div>
              <div className="mt-2 text-stone-700">
                Lorry Receipt (LR) No:{' '}
                <strong className="font-mono text-stone-900 font-bold">
                  {order.lrNumber || 'TO BE ASSIGNED ON LOADING'}
                </strong>
              </div>
              <div className="mt-2 text-stone-500 text-[11px]">
                * Heavy waterproof gunny bag wrapping required for festival parcel transit.
              </div>
            </div>
          </div>

          {/* Items Checklist Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
                Items to Pack from Factory Shelves:
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Total {order.items.length} varieties • {order.totalBoxes} total units
              </span>
            </div>

            <table className="w-full text-left text-xs border border-stone-200">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold">
                <tr>
                  <th className="py-2 px-3 w-10 text-center">Pack</th>
                  <th className="py-2 px-2 w-14 text-center">S.No</th>
                  <th className="py-2 px-4">Cracker Description</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3 text-center">Unit</th>
                  <th className="py-2 px-4 text-right">Qty</th>
                  <th className="py-2 px-4 text-center">Checked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-4 h-4 border-2 border-stone-400 rounded mx-auto" />
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-stone-600">
                      #{item.product.sNo}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-stone-900">
                      {item.product.name}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 text-[11px]">
                      {item.product.category}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-stone-700">
                      {item.product.unit}
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-stone-900 tabular-nums text-sm">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-4 text-center text-stone-400 text-[11px]">
                      [ &nbsp; &nbsp; &nbsp; &nbsp; ]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Godown Verification & Signatures */}
          <div className="border-t border-stone-200 pt-4 grid grid-cols-3 gap-6 text-xs text-stone-600">
            <div>
              <span className="block font-bold text-stone-700 mb-6">Packed By (Godown Supervisor):</span>
              <div className="border-b border-stone-400 pb-1 text-stone-400">Signature:</div>
            </div>

            <div>
              <span className="block font-bold text-stone-700 mb-6">Quality & Count Verified:</span>
              <div className="border-b border-stone-400 pb-1 text-stone-400">Signature:</div>
            </div>

            <div>
              <span className="block font-bold text-stone-700 mb-6">Lorry Transport Handover:</span>
              <div className="border-b border-stone-400 pb-1 text-stone-400">Driver / Agent Sign:</div>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 text-center border-t border-stone-200 pt-3">
            RedThunder Crackers Sivakasi • All consignments inspected under PESO Safety Rules • Sivakasi - 626189
          </div>

        </div>

      </div>
    </div>
  );
};
