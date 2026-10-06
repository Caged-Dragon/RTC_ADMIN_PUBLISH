import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, QrCode, Sparkles, HeartHandshake, PhoneCall } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SafetyScreen: React.FC = () => {
  const { storeInfo: STORE_INFO } = useStore();
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PESO Certified & Eco-Responsible Formulations</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
          Safety Guidelines & Green Crackers Compliance
        </h1>
        <p className="text-sm text-stone-300 dark:text-stone-300 light:text-stone-600 mt-2 max-w-2xl leading-relaxed">
          {STORE_INFO.name} is dedicated to making every festive celebration joyful, safe, and lawful. All items comply with PESO standards and green fireworks formulations.
        </p>
      </div>

      {/* Grid of Key Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 dark:bg-emerald-950 light:bg-emerald-100 text-emerald-400 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900">
            CSIR-NEERI Green Crackers
          </h3>
          <p className="text-xs text-stone-300 dark:text-stone-300 light:text-stone-600 leading-relaxed">
            Formulated using safe oxidizers with minimum 30% reduction in particulate matter emissions and zero prohibited chemicals (arsenic, antimony, lead, mercury).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-950 dark:bg-amber-950 light:bg-amber-100 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900">
            Sound Decibel Restrictions
          </h3>
          <p className="text-xs text-stone-300 dark:text-stone-300 light:text-stone-600 leading-relaxed">
            All sound and barrage crackers stay within the legal ceiling of 125 dB at 4 meters distance from the point of bursting, safe for neighborhood environments.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-red-950 dark:bg-red-950 light:bg-red-100 text-red-400 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900">
            Child Protection & Family Care
          </h3>
          <p className="text-xs text-stone-300 dark:text-stone-300 light:text-stone-600 leading-relaxed">
            Sparklers and ground novelties must always be supervised by an adult. Sparkler tips remain hot even after flame extinguishes—always dispose directly in a water tub.
          </p>
        </div>

      </div>

      {/* Recommended Distances Table */}
      <div className="bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900">
          Recommended Safety Clearances by Product Type
        </h3>
        <div className="overflow-x-auto border border-stone-800 dark:border-stone-800 light:border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-950 dark:bg-stone-950 light:bg-stone-100 text-stone-400 font-semibold border-b border-stone-800 dark:border-stone-800 light:border-stone-200">
                <th className="py-2.5 px-4">Cracker Category</th>
                <th className="py-2.5 px-4">Min. Safe Viewer Distance</th>
                <th className="py-2.5 px-4">Ideal Ground Surface</th>
                <th className="py-2.5 px-4">Safety Instruction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 dark:divide-stone-800/80 light:divide-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700">
              <tr>
                <td className="py-2.5 px-4 font-bold text-white dark:text-white light:text-stone-900">Colourful Sparklers</td>
                <td className="py-2.5 px-4">Arm's length (1 meter)</td>
                <td className="py-2.5 px-4">Open balcony or patio</td>
                <td className="py-2.5 px-4">Hold at wire end, plunge spent wire in water immediately</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-white dark:text-white light:text-stone-900">Flower Pots & Fountains</td>
                <td className="py-2.5 px-4">5 meters</td>
                <td className="py-2.5 px-4">Level masonry or paved floor</td>
                <td className="py-2.5 px-4">Light fuse with long agarbatti and step back swiftly</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-white dark:text-white light:text-stone-900">Ground Chakkars</td>
                <td className="py-2.5 px-4">4 meters</td>
                <td className="py-2.5 px-4">Smooth flat concrete/tile</td>
                <td className="py-2.5 px-4">Place flat side down; do not ignite on gravel or grass</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-white dark:text-white light:text-stone-900">Repeating Shots & Sky Fancy</td>
                <td className="py-2.5 px-4">15 - 20 meters</td>
                <td className="py-2.5 px-4">Open ground away from trees/wires</td>
                <td className="py-2.5 px-4">Place box vertical on firm ground, brace with 2 bricks to prevent tilt</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-white dark:text-white light:text-stone-900">Wala & Garlands (100 to 10,000)</td>
                <td className="py-2.5 px-4">8 - 10 meters</td>
                <td className="py-2.5 px-4">Unobstructed road or open field</td>
                <td className="py-2.5 px-4">Unroll completely before lighting; never ignite coiled inside box</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency First-Aid Box */}
      <div className="p-6 rounded-2xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/40 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 space-y-3">
        <h4 className="font-display font-bold text-base text-amber-400 dark:text-amber-400 light:text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Diwali Night Emergency Preparedness</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-stone-900/60 dark:bg-stone-900/60 light:bg-white rounded-xl border border-stone-800 dark:border-stone-800 light:border-stone-200">
            <strong className="block text-white dark:text-white light:text-stone-900 mb-1">Water Bucket Ready</strong>
            Keep two buckets of cool water nearby for immediate disposal of burnt sticks and cooling burns.
          </div>
          <div className="p-3 bg-stone-900/60 dark:bg-stone-900/60 light:bg-white rounded-xl border border-stone-800 dark:border-stone-800 light:border-stone-200">
            <strong className="block text-white dark:text-white light:text-stone-900 mb-1">In Case of Minor Burns</strong>
            Hold under flowing clean water for 10-15 minutes. Never apply butter or oil. Seek medical aid if needed.
          </div>
          <div className="p-3 bg-stone-900/60 dark:bg-stone-900/60 light:bg-white rounded-xl border border-stone-800 dark:border-stone-800 light:border-stone-200">
            <strong className="block text-white dark:text-white light:text-stone-900 mb-1">Emergency Numbers</strong>
            Ambulance: 108 | Fire Services: 101 | National Emergency: 112
          </div>
        </div>
      </div>

    </div>
  );
};
