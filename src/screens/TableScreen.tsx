import React from 'react';
import { FileSpreadsheet, ShoppingBag, ArrowRight } from 'lucide-react';

import { PriceListTable } from '../components/PriceListTable';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { ScreenId } from '../components/Navbar';

interface TableScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const TableScreen: React.FC<TableScreenProps> = ({ onNavigate }) => {
  const { totalBoxes, subtotal, setIsCartOpen } = useCart();
  const { products, isLoading } = useProducts();

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Sivakasi Price List Matrix</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
            2026 Price List Table (Spreadsheet View)
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 max-w-xl">
            This table matches our physical 2026 Sivakasi printed price catalog. You can type numbers directly into the boxes to build large festival orders quickly.
          </p>
        </div>

        {totalBoxes > 0 && (
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to Cart ({totalBoxes} items · ₹{subtotal.toLocaleString('en-IN')})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Table Component */}
      {isLoading ? <div className="py-12 text-center text-stone-500">Loading live catalogue…</div> : <PriceListTable products={products} />}

      {/* Footer Banner */}
      <div className="p-4 rounded-xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/30 text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>Finished selecting your items? You can review your bill and order on WhatsApp.</span>
        <button
          onClick={() => onNavigate('cart')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
        >
          Review Cart & Order Now
        </button>
      </div>

    </div>
  );
};
