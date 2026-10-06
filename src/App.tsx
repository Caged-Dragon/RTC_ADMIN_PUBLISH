import React, { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar, ScreenId } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { SafetyModal } from './components/SafetyModal';
import { Footer } from './components/Footer';

// Customer Screens
import { IntroScreen } from './screens/IntroScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { TableScreen } from './screens/TableScreen';
import { CartPageScreen } from './screens/CartPageScreen';
import { MyOrdersScreen } from './screens/MyOrdersScreen';
import { TrackerScreen } from './screens/TrackerScreen';
import { WhatsAppMessagingScreen } from './screens/WhatsAppMessagingScreen';
import { MailingOptionScreen } from './screens/MailingOptionScreen';
import { AuthScreen } from './screens/AuthScreen';
import { GiftBoxesShowcase } from './components/GiftBoxesShowcase';
import { TransportScreen } from './screens/TransportScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { CustomerReviewsFeedback } from './components/CustomerReviewsFeedback';

// Parallel Seller Portal

function StorefrontApp() {
  const { totalBoxes, subtotal, ordersHistory } = useCart();
  
  // Navigation Screen State (can be customer screens or 'seller')
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('intro');
  const [selectedTrackingId, setSelectedTrackingId] = useState('RT-2026-1088');

  // Modals
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      
      {/* Top Bar with Navigation & Controls */}
      <Navbar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        onOpenSafety={() => setIsSafetyOpen(true)}
      />

      {/* Main Screen Router */}
      <main className="flex-1">
        {/* CUSTOMER STOREFRONT SCREENS */}
        {currentScreen === 'intro' && (
          <IntroScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'products' && (
          <ProductsScreen />
        )}

        {currentScreen === 'table' && (
          <TableScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'cart' && (
          <CartPageScreen
            onNavigate={setCurrentScreen}
            onOpenInvoice={() => setIsInvoiceOpen(true)}
          />
        )}

        {currentScreen === 'myorders' && (
          <MyOrdersScreen
            onNavigate={setCurrentScreen}
            onOpenInvoice={() => setIsInvoiceOpen(true)}
            onSelectTrackingId={(id) => setSelectedTrackingId(id)}
          />
        )}

        {currentScreen === 'tracker' && (
          <TrackerScreen />
        )}

        {currentScreen === 'whatsapp' && (
          <WhatsAppMessagingScreen />
        )}

        {currentScreen === 'mail' && (
          <MailingOptionScreen onOpenInvoice={() => setIsInvoiceOpen(true)} />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'gift-boxes' && (
          <GiftBoxesShowcase isStandaloneScreen={true} />
        )}

        {currentScreen === 'transport' && (
          <TransportScreen />
        )}

        {currentScreen === 'safety' && (
          <SafetyScreen />
        )}

        {currentScreen === 'reviews' && (
          <div className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CustomerReviewsFeedback orders={ordersHistory} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenSafety={() => setIsSafetyOpen(true)} />

      {/* Floating Bottom Cart Bar (visible in customer mode when items in cart) */}
      {totalBoxes > 0 && currentScreen !== 'cart' && true && (
        <aside
          aria-label="Current Cart Summary"
          className="fixed bottom-0 inset-x-0 z-40 bg-stone-900/95 dark:bg-stone-900/95 light:bg-white/95 backdrop-blur-md border-t border-amber-600/40 p-3 sm:p-4 shadow-2xl transition-all"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shadow">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600">
                  <span className="text-white dark:text-white light:text-stone-900 font-bold tabular-nums">{totalBoxes}</span> items in cart
                </div>
                <div className="font-display text-lg sm:text-xl font-black text-amber-400 dark:text-amber-400 light:text-amber-700 tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="hidden sm:inline-flex px-3.5 py-2.5 rounded-lg bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-200 dark:text-stone-200 light:text-stone-800 text-xs font-semibold border border-stone-700 dark:border-stone-700 light:border-stone-300 transition-colors cursor-pointer"
              >
                View Bill / PDF
              </button>

              <button
                onClick={() => setCurrentScreen('cart')}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/60 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span>Open Cart Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Side Slide-Over Cart Drawer */}
      <CartDrawer
        onOpenCheckout={() => setCurrentScreen('cart')}
        onOpenInvoice={() => setIsInvoiceOpen(true)}
      />

      {/* Printable Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Safety Modal */}
      <SafetyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
        <ProductsProvider>
          <ToastProvider>
            <CartProvider>
              <StorefrontApp />
            </CartProvider>
          </ToastProvider>
        </ProductsProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
