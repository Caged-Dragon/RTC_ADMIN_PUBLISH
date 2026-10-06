import React from 'react';
import { Gift, Plus, Check, Sparkles, Box, ShieldCheck, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

interface GiftBoxesShowcaseProps {
  isStandaloneScreen?: boolean;
}

export const GiftBoxesShowcase: React.FC<GiftBoxesShowcaseProps> = ({ isStandaloneScreen = false }) => {
  const { getItemQuantity, addToCart, updateQuantity, setIsCartOpen } = useCart();
  const { products } = useProducts();
  const giftBoxes = products.filter((p) => p.category === 'Gift Boxes');

  return (
    <section id="gift-boxes" className={`${isStandaloneScreen ? 'py-10' : 'py-16'} bg-stone-900/60 dark:bg-stone-900/60 light:bg-stone-50 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 dark:text-amber-400 light:text-amber-800 uppercase tracking-wider mb-2">
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Diwali & Festival Special Family Combos</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-stone-900 tracking-tight">
              Assorted Gift Boxes (15 to 60 Items)
            </h2>
            <p className="text-sm text-stone-300 dark:text-stone-300 light:text-stone-600 mt-2 max-w-2xl">
              Complete celebration packages with an ideal mix of sparklers, chakkars, flower pots, novelty fountains, and repeating aerial shots. Perfect for families, corporate gifts, and festive celebrations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 px-3.5 py-2 rounded-xl shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Factory Packed in Tamper-Proof Corrugated Boxes</span>
          </div>
        </div>

        {/* Feature Banner & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Visual Showcase Card */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-950 dark:bg-stone-950 light:bg-white relative group shadow-xl">
            <img
              src="/src/assets/images/redthunder_gift_boxes_1791297541022.jpg"
              alt="RedThunder Sivakasi Festival Gift Boxes"
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Direct From Sivakasi
              </span>
              <h3 className="font-display text-xl font-black text-white mt-1">
                Value-Packed Festive Hampers
              </h3>
              <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                Save time choosing individual items. Each gift box contains handpicked festive staples with 100% genuine Sivakasi quality.
              </p>
            </div>
          </div>

          {/* Gift Box Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {giftBoxes.map((box) => {
              const qty = getItemQuantity(box.id);
              const isBestseller = box.rate === 1000 || box.rate === 1800;

              return (
                <div
                  key={box.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isBestseller
                      ? 'bg-gradient-to-b from-amber-950/40 to-stone-900 dark:from-amber-950/40 dark:to-stone-900 light:from-amber-50 light:to-white border-amber-600/50 shadow-lg shadow-amber-950/20'
                      : 'bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border-stone-800 dark:border-stone-800 light:border-stone-200 hover:border-stone-700 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-400 light:text-stone-500 mb-2">
                      <span className="font-mono text-amber-500 dark:text-amber-500 light:text-amber-700 font-bold">#{box.sNo}</span>
                      {isBestseller && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 dark:text-amber-300 light:text-amber-800 border border-amber-500/30 uppercase">
                          Popular
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 leading-snug">
                      {box.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-amber-400 dark:text-amber-300 light:text-amber-800 font-medium mt-1">
                      <Box className="w-3.5 h-3.5 text-amber-500" />
                      <span>{box.pieces} included</span>
                    </div>

                    <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {box.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-500 light:text-stone-400 block">Box Price</span>
                      <div className="font-display text-lg font-black text-white dark:text-white light:text-stone-900 tabular-nums">
                        ₹{box.rate}
                      </div>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(box, 1)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Box</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-stone-950 dark:bg-stone-950 light:bg-stone-100 border border-amber-600/60 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(box.id, qty - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-amber-400 dark:text-amber-400 light:text-amber-800 tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(box, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
