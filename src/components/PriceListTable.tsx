import React, { useState } from 'react';
import { Plus, Minus, Trash2, Zap, ArrowDown, Check, Sparkles, Filter } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface PriceListTableProps {
  products: Product[];
}

export const PriceListTable: React.FC<PriceListTableProps> = ({ products }) => {
  const { getItemQuantity, updateQuantity, addToCart, clearCart, subtotal, totalBoxes } = useCart();
  const [selectedCategoryJump, setSelectedCategoryJump] = useState<string>('All Items');
  const categories = ['All Items', ...Array.from(new Set(products.map(p => p.category))).sort((a,b)=>a.localeCompare(b))];

  const displayedProducts = selectedCategoryJump === 'All Items'
    ? products
    : products.filter((p) => p.category === selectedCategoryJump);

  // Quick Preset Helper
  const applyPreset = (presetType: 'family' | 'kids' | 'aerial') => {
    if (presetType === 'family') {
      // Common Diwali family mix
      addToCart(products.find((p) => p.sNo === 1) || products[0], 2); // 10cm electric sparklers
      addToCart(products.find((p) => p.sNo === 16) || products[0], 1); // 30cm red sparklers
      addToCart(products.find((p) => p.sNo === 25) || products[0], 2); // Flower pot big
      addToCart(products.find((p) => p.sNo === 33) || products[0], 2); // Ground chakkar big
      addToCart(products.find((p) => p.sNo === 93) || products[0], 1); // 7 shot
    } else if (presetType === 'kids') {
      addToCart(products.find((p) => p.sNo === 1) || products[0], 3); // 10cm electric
      addToCart(products.find((p) => p.sNo === 2) || products[0], 2); // 10cm colour
      addToCart(products.find((p) => p.sNo === 112) || products[0], 2); // Snake serpent
      addToCart(products.find((p) => p.sNo === 114) || products[0], 1); // 10 in 1 matchbox
      addToCart(products.find((p) => p.sNo === 54) || products[0], 1); // Super car
    } else if (presetType === 'aerial') {
      addToCart(products.find((p) => p.sNo === 93) || products[0], 2); // 7 shot
      addToCart(products.find((p) => p.sNo === 96) || products[0], 2); // 12 shot multi
      addToCart(products.find((p) => p.sNo === 97) || products[0], 1); // 30 shot
      addToCart(products.find((p) => p.sNo === 85) || products[0], 2); // 2" fancy
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Table Controls & Bulk Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm text-xs">
        
        {/* Category Jump Selector */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-semibold uppercase text-[11px] shrink-0">Jump To Section:</span>
          <select
            value={selectedCategoryJump}
            onChange={(e) => setSelectedCategoryJump(e.target.value)}
            className="py-1.5 px-3 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-stone-200 dark:text-stone-200 light:text-stone-800 font-medium focus:outline-none focus:border-amber-500 cursor-pointer text-xs"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-500 text-[11px] font-semibold">1-Click Presets:</span>
          
          <button
            onClick={() => applyPreset('family')}
            className="px-2.5 py-1 rounded-md bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-300 dark:text-stone-300 light:text-stone-700 transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>+ Family Starter Mix</span>
          </button>

          <button
            onClick={() => applyPreset('kids')}
            className="px-2.5 py-1 rounded-md bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-300 dark:text-stone-300 light:text-stone-700 transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>+ Kids Novelty Pack</span>
          </button>

          <button
            onClick={() => applyPreset('aerial')}
            className="px-2.5 py-1 rounded-md bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-300 dark:text-stone-300 light:text-stone-700 transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-red-400" />
            <span>+ Aerial Shots Combo</span>
          </button>
        </div>

      </div>

      {/* Main Table */}
      <div className="w-full overflow-hidden rounded-xl border border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-900/95 dark:bg-stone-900/95 light:bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-red-950/80 via-stone-900 to-amber-950/80 dark:from-red-950/80 dark:via-stone-900 dark:to-amber-950/80 light:from-stone-100 light:via-stone-50 light:to-amber-50 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700 text-xs uppercase font-semibold">
                <th className="py-3 px-3 w-16 text-center">S.No</th>
                <th className="py-3 px-4">Name of Crackers</th>
                <th className="py-3 px-4 hidden md:table-cell">Category</th>
                <th className="py-3 px-3 text-center w-24">Unit</th>
                <th className="py-3 px-4 text-right w-28">Rate (₹)</th>
                <th className="py-3 px-4 text-center w-36">Quantity</th>
                <th className="py-3 px-4 text-right w-28">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 dark:divide-stone-800/80 light:divide-stone-200 font-normal">
              {displayedProducts.map((product) => {
                const qty = getItemQuantity(product.id);
                const rowTotal = qty * product.rate;
                const hasQty = qty > 0;

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      hasQty
                        ? 'bg-amber-950/25 dark:bg-amber-950/25 light:bg-amber-100/70 text-white dark:text-white light:text-stone-900 font-medium'
                        : 'hover:bg-stone-850 dark:hover:bg-stone-850 light:hover:bg-stone-50 text-stone-300 dark:text-stone-300 light:text-stone-700'
                    }`}
                  >
                    {/* S.No */}
                    <td className="py-2.5 px-3 text-center font-mono text-xs text-amber-500 font-bold tabular-nums">
                      {product.sNo}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-4 font-medium">
                      <div className="flex flex-col">
                        <span className={hasQty ? 'text-amber-200 dark:text-amber-200 light:text-amber-900 font-semibold' : 'text-stone-100 dark:text-stone-100 light:text-stone-900'}>
                          {product.name}
                        </span>
                        {product.pieces && (
                          <span className="text-[11px] text-stone-500 font-normal">
                            Pack: {product.pieces}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-4 hidden md:table-cell text-xs text-stone-400 dark:text-stone-400 light:text-stone-500">
                      {product.category}
                    </td>

                    {/* Unit */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-800 dark:bg-stone-800 light:bg-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-800 border border-stone-700/60 dark:border-stone-700/60 light:border-stone-300 uppercase">
                        {product.unit}
                      </span>
                    </td>

                    {/* Rate */}
                    <td className="py-2.5 px-4 text-right font-semibold text-stone-200 dark:text-stone-200 light:text-stone-800 tabular-nums">
                      ₹{product.rate}
                    </td>

                    {/* Quantity Stepper & Direct Typing Input */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateQuantity(product.id, Math.max(0, qty - 1))}
                          disabled={qty === 0}
                          className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                            qty > 0
                              ? 'bg-stone-800 dark:bg-stone-800 light:bg-stone-200 text-stone-200 dark:text-stone-200 light:text-stone-800 hover:bg-stone-700 active:scale-95'
                              : 'bg-stone-850 dark:bg-stone-850 light:bg-stone-100 text-stone-600 dark:text-stone-600 light:text-stone-300 cursor-not-allowed'
                          }`}
                          aria-label={`Decrease ${product.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          max="999"
                          value={qty === 0 ? '' : qty}
                          placeholder="0"
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateQuantity(product.id, isNaN(val) ? 0 : Math.max(0, val));
                          }}
                          className={`w-12 h-7 text-center rounded border text-xs font-bold tabular-nums focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                            hasQty
                              ? 'bg-stone-950 dark:bg-stone-950 light:bg-white border-amber-600 text-amber-400 dark:text-amber-400 light:text-amber-800'
                              : 'bg-stone-950/60 dark:bg-stone-950/60 light:bg-stone-50 border-stone-700 dark:border-stone-700 light:border-stone-300 text-stone-400 dark:text-stone-400 light:text-stone-700'
                          }`}
                        />

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-7 h-7 rounded bg-stone-800 dark:bg-stone-800 light:bg-stone-200 hover:bg-amber-600 hover:text-white text-stone-200 dark:text-stone-200 light:text-stone-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                          aria-label={`Increase ${product.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="py-2.5 px-4 text-right font-bold tabular-nums">
                      {hasQty ? (
                        <span className="text-amber-400 dark:text-amber-400 light:text-amber-700">
                          ₹{rowTotal.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-stone-600 dark:text-stone-600 light:text-stone-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {displayedProducts.length === 0 && (
          <div className="py-12 text-center text-stone-400">
            No crackers match your current filter.
          </div>
        )}
      </div>

    </div>
  );
};
