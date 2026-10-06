import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, ShoppingBag, Sparkles, X, AlertCircle, Info, ArrowRight } from 'lucide-react';

export type ToastType = 'success' | 'order' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
  productImage?: string;
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  success: (message: string, title?: string, action?: ToastAction) => string;
  orderSubmitted: (orderId: string, amount: number, action?: ToastAction) => string;
  addedToCart: (productName: string, quantity: number, unit: string, rate: number, image?: string, onViewCart?: () => void) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duration = options.duration ?? 4000;
      const newToast: ToastItem = {
        ...options,
        id,
        type: options.type || 'success',
        duration,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 4)); // Keep up to 4 toasts max

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: string, title?: string, action?: ToastAction) => {
      return showToast({ type: 'success', message, title, action });
    },
    [showToast]
  );

  const orderSubmitted = useCallback(
    (orderId: string, amount: number, action?: ToastAction) => {
      return showToast({
        type: 'order',
        title: '🎉 Order Placed Successfully!',
        message: `Order #${orderId} for ₹${amount.toLocaleString('en-IN')} submitted for Sivakasi packing & dispatch.`,
        duration: 5500,
        action,
      });
    },
    [showToast]
  );

  const addedToCart = useCallback(
    (productName: string, quantity: number, unit: string, rate: number, image?: string, onViewCart?: () => void) => {
      return showToast({
        type: 'success',
        title: 'Added to Cart',
        message: `${quantity} × ${productName} (${unit}) · ₹${(rate * quantity).toLocaleString('en-IN')}`,
        duration: 3800,
        productImage: image,
        action: onViewCart ? { label: 'View Cart', onClick: onViewCart } : undefined,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        success,
        orderSubmitted,
        addedToCart,
      }}
    >
      {children}

      {/* TOAST CONTAINER PORTAL */}
      <div
        aria-live="polite"
        className="fixed top-14 sm:top-20 right-0 sm:right-4 z-50 p-4 sm:p-0 max-w-md w-full pointer-events-none space-y-2.5 flex flex-col items-center sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto w-full max-w-sm rounded-2xl p-3.5 sm:p-4 shadow-2xl border transition-all duration-300 animate-in slide-in-from-top-4 sm:slide-in-from-right-4 fade-in ${
              toast.type === 'order'
                ? 'bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border-amber-500 text-stone-100 shadow-amber-950/40 ring-1 ring-amber-500/50'
                : toast.type === 'success'
                ? 'bg-stone-900 dark:bg-stone-900 light:bg-white border-emerald-500/60 dark:border-emerald-500/60 light:border-emerald-500 text-stone-100 dark:text-stone-100 light:text-stone-900 shadow-emerald-950/30'
                : toast.type === 'error'
                ? 'bg-stone-900 dark:bg-stone-900 light:bg-white border-red-500 text-stone-100 dark:text-stone-100 light:text-stone-900'
                : 'bg-stone-900 dark:bg-stone-900 light:bg-white border-stone-700 text-stone-100 dark:text-stone-100 light:text-stone-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon / Thumbnail */}
              {toast.productImage ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-stone-700 bg-stone-950">
                  <img
                    src={toast.productImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : toast.type === 'order' ? (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
              ) : toast.type === 'success' ? (
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : toast.type === 'error' ? (
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
              )}

              {/* Text Body */}
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <h4 className="font-display text-xs sm:text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5 leading-snug">
                    {toast.type === 'order' && <span className="text-amber-400">⚡</span>}
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-stone-600 dark:text-stone-300 light:text-stone-700 leading-snug mt-0.5 font-medium line-clamp-2">
                  {toast.message}
                </p>

                {/* Optional Action Button */}
                {toast.action && (
                  <div className="mt-2.5">
                    <button
                      onClick={() => {
                        toast.action?.onClick();
                        dismissToast(toast.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <span>{toast.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-stone-400 hover:text-stone-200 light:hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
