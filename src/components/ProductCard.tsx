import React from 'react';
import { Plus, Minus, Box } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  return (
    <div className="group relative flex flex-col justify-between bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-xl border border-stone-800/80 dark:border-stone-800/80 light:border-stone-200 hover:border-amber-500/50 hover:shadow-xl transition-all overflow-hidden p-4">
      {/* Product Image Banner if uploaded */}
      {product.imageUrl && (
        <div className="relative -mx-4 -mt-4 mb-3 h-32 overflow-hidden bg-stone-950">
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
        </div>
      )}

      {/* Visual Header / Kicker */}
      <div>
        <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-400 light:text-stone-500 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-amber-500 dark:text-amber-500 light:text-amber-700">#{product.sNo}</span>
            <span aria-hidden="true" className="text-stone-600 dark:text-stone-600 light:text-stone-300">·</span>
            <span className="truncate max-w-[130px]">{product.category}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {product.stockStatus === 'LOW_STOCK' && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Few Left
              </span>
            )}
            {isOutOfStock && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                Sold Out
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-800 dark:bg-stone-800 light:bg-stone-100 text-stone-300 dark:text-stone-300 light:text-stone-700 border border-stone-700/60 dark:border-stone-700/60 light:border-stone-300 uppercase">
              {product.unit}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 group-hover:text-amber-400 dark:group-hover:text-amber-300 light:group-hover:text-amber-700 transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Description & pieces */}
        <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 line-clamp-2 leading-relaxed min-h-[2rem]">
          {product.description}
        </p>

        {product.pieces && (
          <div className="mt-2 text-[11px] font-medium text-stone-300 dark:text-stone-300 light:text-stone-700 flex items-center gap-1">
            <Box className="w-3 h-3 text-amber-500/80" />
            <span>Contains: {product.pieces}</span>
          </div>
        )}
      </div>

      {/* Pricing and Action Baseline */}
      <div className="mt-4 pt-3 border-t border-stone-800/80 dark:border-stone-800/80 light:border-stone-200 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-semibold text-stone-500 dark:text-stone-500 light:text-stone-400 block">Rate / {product.unit}</span>
          <div className="font-display text-xl font-extrabold text-white dark:text-white light:text-stone-900 tabular-nums tracking-tight">
            ₹{product.rate}
          </div>
        </div>

        {/* Quantity Controls */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="px-3.5 py-2 rounded-lg bg-stone-800/60 text-stone-500 text-xs font-semibold border border-stone-800 cursor-not-allowed whitespace-nowrap"
            >
              Sold Out
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-2 rounded-lg bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-200 dark:text-stone-200 light:text-stone-800 text-xs font-semibold border border-stone-700/80 dark:border-stone-700/80 light:border-stone-300 hover:border-amber-500 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-stone-950 dark:bg-stone-950 light:bg-white rounded-lg p-1 border border-amber-600/50 shadow-inner">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-7 h-7 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 active:bg-stone-700 transition-colors cursor-pointer"
                aria-label={`Decrease quantity for ${product.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <span className="w-8 text-center text-xs font-bold text-amber-400 dark:text-amber-400 light:text-amber-800 tabular-nums">
                {quantity}
              </span>

              <button
                onClick={() => addToCart(product, 1)}
                className="w-7 h-7 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 active:bg-stone-700 transition-colors cursor-pointer"
                aria-label={`Increase quantity for ${product.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicator when added */}
      {quantity > 0 && (
        <div className="mt-2 text-[11px] font-semibold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 flex items-center justify-between bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-900/40 dark:border-emerald-900/40 light:border-emerald-200">
          <span>{quantity} in cart</span>
          <span className="tabular-nums font-bold">₹{quantity * product.rate}</span>
        </div>
      )}
    </div>
  );
};
