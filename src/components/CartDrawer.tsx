import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, FileText, MessageCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onOpenInvoice: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout, onOpenInvoice }) => {
  const { storeInfo: STORE_INFO } = useStore();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalBoxes,
    subtotal,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 dark:bg-stone-900 light:bg-white border-l border-stone-800 dark:border-stone-800 light:border-stone-200 flex flex-col shadow-2xl transition-colors">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 flex items-center justify-between bg-stone-950 dark:bg-stone-950 light:bg-stone-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-950 dark:bg-red-950 light:bg-red-100 text-red-400 dark:text-red-400 light:text-red-700 border border-red-800/80 dark:border-red-800/80 light:border-red-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900">Your Cracker Cart</h2>
                <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-500">
                  {totalItems} items · {totalBoxes} units in total
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 dark:text-stone-400 light:text-stone-600 hover:text-white dark:hover:text-white light:hover:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-800 light:hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 dark:text-stone-400 light:text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-800/60 dark:bg-stone-800/60 light:bg-stone-100 flex items-center justify-center mb-4 text-stone-500 dark:text-stone-500 light:text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display text-base font-semibold text-white dark:text-white light:text-stone-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 max-w-xs mb-6">
                  Add sparklers, flower pots, chakkars, repeating shots, or gift boxes from our 2026 catalog.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Explore 2026 Products
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-400 light:text-stone-500 pb-1">
                  <span>Selected Items</span>
                  <button
                    onClick={clearCart}
                    className="text-stone-500 dark:text-stone-500 light:text-stone-600 hover:text-red-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>

                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-lg bg-stone-950/80 dark:bg-stone-950/80 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200 hover:border-stone-700/80 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-amber-500 font-bold">
                          #{product.sNo}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-500 light:text-stone-600 uppercase font-semibold">
                          {product.unit}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-white dark:text-white light:text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <div className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 mt-0.5">
                        ₹{product.rate} × {quantity} ={' '}
                        <strong className="text-amber-400 dark:text-amber-400 light:text-amber-700 font-bold tabular-nums">
                          ₹{(product.rate * quantity).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 rounded-md p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 active:bg-stone-700 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-amber-400 dark:text-amber-400 light:text-amber-700 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 active:bg-stone-700 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-stone-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-950 dark:bg-stone-950 light:bg-stone-50 space-y-3">
              {/* Sivakasi Policy Callout */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/30 dark:bg-amber-950/30 light:bg-amber-50 border border-amber-900/40 dark:border-amber-900/40 light:border-amber-200 text-[11px] text-amber-300/90 dark:text-amber-300/90 light:text-amber-900 leading-tight">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Dispatched directly from Sivakasi. Delivery charges depend on destination. Confirm stock & transport before final payment.
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400 dark:text-stone-400 light:text-stone-600">
                  <span>Total Varieties</span>
                  <span className="font-semibold text-stone-200 dark:text-stone-200 light:text-stone-800">{totalItems} items</span>
                </div>
                <div className="flex justify-between text-stone-400 dark:text-stone-400 light:text-stone-600">
                  <span>Total Units (Boxes/Pkts)</span>
                  <span className="font-semibold text-stone-200 dark:text-stone-200 light:text-stone-800">{totalBoxes} units</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white dark:text-white light:text-stone-900 pt-2 border-t border-stone-800 dark:border-stone-800 light:border-stone-200">
                  <span>Subtotal Amount</span>
                  <span className="font-display text-lg text-amber-400 dark:text-amber-400 light:text-amber-700 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onOpenCheckout();
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp (8124100501)</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onOpenInvoice();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-stone-900 dark:bg-stone-900 light:bg-white hover:bg-stone-800 text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white dark:hover:text-white light:hover:text-stone-900 border border-stone-700/80 dark:border-stone-700/80 light:border-stone-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Printable Estimate / Invoice</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
