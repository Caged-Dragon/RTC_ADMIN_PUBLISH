import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, ShieldCheck, AlertCircle, Phone, MessageCircle, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { dbSelect } from '../lib/supabase';

interface DestinationInfo {
  city: string;
  state: string;
  approxDays: string;
  freightPerBox: string;
  hubs: string[];
}

export const TransportScreen: React.FC = () => {
  const { storeInfo: STORE_INFO } = useStore();
  const { totalBoxes, subtotal, customerDetails, updateCustomerDetails, setIsCartOpen } = useCart();
  const [destinations, setDestinations] = useState<DestinationInfo[]>([]);
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [customCity, setCustomCity] = useState('');
  const [estimatedCartonBoxes, setEstimatedCartonBoxes] = useState(1);

  useEffect(() => {
    dbSelect<any>('freight_rates', 'select=destination_city,state,estimated_transit_days_min,estimated_transit_days_max,freight_rate_per_box_min,freight_rate_per_box_max,primary_hub_names&is_active=eq.true&order=destination_city.asc')
      .then(rows => setDestinations(rows.map(r => ({ city:r.destination_city, state:r.state, approxDays: `${r.estimated_transit_days_min}-${r.estimated_transit_days_max} days`, freightPerBox: `₹${r.freight_rate_per_box_min}${r.freight_rate_per_box_max != null && r.freight_rate_per_box_max !== r.freight_rate_per_box_min ? `–₹${r.freight_rate_per_box_max}` : ''}`, hubs:r.primary_hub_names || [] }))))
      .catch(err => console.error('Failed to load freight rates from Supabase', err));
  }, []);

  useEffect(() => {
    // 1 standard Sivakasi heavy transport carton holds ~15-20 small retail boxes or 1-2 big gift boxes
    const boxes = Math.max(1, Math.ceil(totalBoxes / 18));
    setEstimatedCartonBoxes(boxes);
  }, [totalBoxes]);

  const activeDest = destinations.find((d) => d.city === selectedCity) || destinations[0];

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    updateCustomerDetails({ city });
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Screen Header */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
          <Truck className="w-4 h-4 text-amber-500" />
          <span>Direct Sivakasi Logistics Network</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
          Delivery Charges & Transport Lorry Calculator
        </h1>
        <p className="text-sm text-stone-300 dark:text-stone-300 light:text-stone-600 mt-2 max-w-3xl leading-relaxed">
          Due to government and PESO transport guidelines, fireworks are shipped exclusively via registered heavy road transport lorry services directly from Sivakasi to your nearest town parcel office.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Calculator Card */}
        <div className="lg:col-span-7 bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <h2 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>Select Delivery Destination</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {destinations.map((dest) => (
              <button
                key={dest.city}
                onClick={() => handleSelectCity(dest.city)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedCity === dest.city
                    ? 'bg-amber-600/15 dark:bg-amber-600/20 light:bg-amber-100 border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-900 font-bold shadow-sm'
                    : 'bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-50 border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700 hover:border-stone-700'
                }`}
              >
                <div className="text-xs font-bold truncate">{dest.city}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{dest.state}</div>
              </button>
            ))}
          </div>

          {/* Custom City Input */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-stone-400 mb-1.5">
              Not on the list? Enter your city / town / district:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Hosur, Vellore, Thanjavur, Erode, Mysore..."
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => {
                  if (customCity.trim()) {
                    handleSelectCity(customCity.trim());
                  }
                }}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-500 transition-colors"
              >
                Set
              </button>
            </div>
          </div>

          {/* Real-time Calculation for Selected City */}
          {activeDest && (
            <div className="p-5 rounded-xl bg-stone-950/80 dark:bg-stone-950/80 light:bg-stone-50 border border-amber-600/30 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                    Sivakasi to {activeDest.city}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900">
                    Logistics Breakdown
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 font-semibold bg-stone-900 dark:bg-stone-900 light:bg-white px-2.5 py-1 rounded-lg border border-stone-800 dark:border-stone-800 light:border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transit Time: {activeDest.approxDays}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Approx. Freight Rate:</span>
                  <strong className="text-base font-display font-extrabold text-amber-400 tabular-nums">
                    {activeDest.freightPerBox}
                  </strong>
                  <span className="text-stone-500 text-[11px] block mt-0.5">per heavy transport carton</span>
                </div>

                <div>
                  <span className="text-stone-500 block">Current Cart Estimate:</span>
                  <strong className="text-base font-display font-extrabold text-white dark:text-white light:text-stone-900 tabular-nums">
                    ~{estimatedCartonBoxes} {estimatedCartonBoxes === 1 ? 'Carton' : 'Cartons'}
                  </strong>
                  <span className="text-stone-500 text-[11px] block mt-0.5">
                    ({totalBoxes} retail units in cart)
                  </span>
                </div>
              </div>

              {activeDest.hubs && activeDest.hubs.length > 0 && (
                <div className="pt-2 text-xs text-stone-400">
                  <span className="font-semibold text-stone-300 dark:text-stone-300 light:text-stone-800 block mb-1">
                    Major Parcel Delivery Hubs in {activeDest.city}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDest.hubs.map((hub) => (
                      <span
                        key={hub}
                        className="px-2 py-0.5 rounded text-[11px] bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 text-stone-300 dark:text-stone-300 light:text-stone-700"
                      >
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${STORE_INFO.phone}?text=${encodeURIComponent(
                `Hello RedThunder Crackers, I want to check delivery options and exact freight charges to ${selectedCity} for my 2026 order.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm Freight for {selectedCity} via WhatsApp</span>
            </a>

            {totalBoxes > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Out Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Dispatch Policy & Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Official Sivakasi Dispatch Policy</span>
            </h3>

            <div className="space-y-3 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 leading-relaxed">
              <div className="p-3 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <strong className="text-white dark:text-white light:text-stone-900 block mb-0.5">
                  1. Payment Receipt Mandatory
                </strong>
                Against payment receipt only, crackers will be dispatched from Sivakasi factory. No COD is permitted under hazardous goods laws.
              </div>

              <div className="p-3 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <strong className="text-white dark:text-white light:text-stone-900 block mb-0.5">
                  2. Lorry Office Pickup ("To-Pay" Basis)
                </strong>
                You collect your parcel package from the transport godown in your city by presenting your Lorry Receipt (LR) copy sent to your WhatsApp. You pay the nominal freight fee directly to the transport counter.
              </div>

              <div className="p-3 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200">
                <strong className="text-white dark:text-white light:text-stone-900 block mb-0.5">
                  3. Packing & Box Sealing
                </strong>
                Every order is wrapped in heavy-duty weatherproof corrugated cartons reinforced with strapping bands for zero in-transit damage.
              </div>
            </div>
          </div>

          {/* Sivakasi Help Desk Contact */}
          <div className="p-5 rounded-2xl bg-amber-950/30 dark:bg-amber-950/30 light:bg-amber-50 border border-amber-800/40 text-xs space-y-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider block text-[10px]">
              Direct Dispatch Support Desk
            </span>
            <p className="text-stone-200 dark:text-stone-200 light:text-stone-800">
              Need assistance finding the nearest transport godown in your district or arranging bulk tempo deliveries?
            </p>
            <p className="font-bold text-white dark:text-white light:text-stone-900 text-sm">
              Call / WhatsApp: {STORE_INFO.phoneDisplay}
            </p>
            <p className="text-stone-400 text-[11px]">
              Address: {STORE_INFO.address}, Sivakasi - {STORE_INFO.pincode}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
