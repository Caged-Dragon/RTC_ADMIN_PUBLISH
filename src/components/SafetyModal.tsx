import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/80">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Celebration Safety Instructions
              </h2>
              <p className="text-xs text-stone-400">
                Light Up Your Celebrations with Joy & Safety
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-stone-300 max-h-[70vh] overflow-y-auto">
          
          <div>
            <h3 className="font-semibold text-emerald-400 text-sm mb-2.5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>DO'S (Recommended Safe Practices)</span>
            </h3>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Burst crackers only in open outdoor spaces away from thatched roofs, electrical wires, and parked vehicles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Always keep two buckets filled with water and clean sand readily accessible near the lighting area.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Wear snug-fitting cotton clothing and hard-soled footwear. Avoid loose synthetic garments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Light crackers using a long incense stick (agarbatti) or sparkler while keeping your face and body at arm’s length.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Ensure children are always under active adult supervision while handling sparklers or novelty items.</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-stone-800">
            <h3 className="font-semibold text-red-400 text-sm mb-2.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>DON'TS (Avoid These Hazards)</span>
            </h3>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Never hold fireworks or lit crackers in your hands while lighting (except handheld sparklers properly held by the wire tip).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Never try to re-ignite or closely inspect a cracker that failed to burst. Wait 15 minutes and douse it with water.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Never light crackers inside closed rooms, corridors, stairwells, or near animals/pets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Never keep crackers inside pockets or near burning oil lamps (diyas).</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 leading-relaxed">
            All products conform to government-prescribed green cracker formulations with low decibel ratings and safe oxidizers. Follow your local city timings and municipal pollution guidelines for a joyful festival!
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
