import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  FileSpreadsheet,
  Grid,
  Sun,
  Moon,
  Truck,
  PackageCheck,
  ShieldCheck,
  Gift,
  Mail,
  User,
  Package,
  Home,
  Store,
  Briefcase,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export type ScreenId =
  | 'intro'
  | 'products'
  | 'table'
  | 'cart'
  | 'myorders'
  | 'tracker'
  | 'whatsapp'
  | 'mail'
  | 'auth'
  | 'gift-boxes'
  | 'transport'
  | 'safety'
  | 'reviews'

interface NavbarProps {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  onOpenSafety: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, setCurrentScreen }) => {
  const { storeInfo: STORE_INFO } = useStore();
  const { totalBoxes, subtotal } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSellerMode = false;

  const customerNav: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    { id: 'intro', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'products', label: 'Products (Photos)', icon: <Grid className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'table', label: 'Price Sheet (Table)', icon: <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'gift-boxes', label: 'Gift Boxes', icon: <Gift className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'myorders', label: 'Dashboard', icon: <Package className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> },
    { id: 'tracker', label: 'Track Order', icon: <PackageCheck className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5 text-green-500" /> },
    { id: 'mail', label: 'Email Bill', icon: <Mail className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'transport', label: 'Delivery', icon: <Truck className="w-3.5 h-3.5 text-blue-500" /> },
  ];

  const handleNavClick = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors shadow-sm ${
      isSellerMode
        ? 'bg-stone-900/95 dark:bg-stone-950/95 border-amber-500/40 text-stone-100'
        : 'bg-white/95 dark:bg-stone-950/95 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Mode Badge */}
          <button
            onClick={() => handleNavClick('intro')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform overflow-hidden ${
              isSellerMode
                ? 'bg-gradient-to-tr from-amber-600 to-yellow-500 text-stone-950'
                : 'bg-gradient-to-tr from-amber-600 via-red-600 to-rose-600'
            }`}>
              {STORE_INFO.logoUrl ? <img src={STORE_INFO.logoUrl} alt={STORE_INFO.name} className="w-full h-full object-contain bg-white" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white block leading-none">
                RED<span className="text-red-500">THUNDER</span>
              </span>
              <span className={`text-[11px] font-semibold tracking-wider uppercase block mt-1 ${
                isSellerMode ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-amber-700 dark:text-amber-400'
              }`}>
                {isSellerMode ? '🏭 Sivakasi Seller Portal' : 'Sivakasi • 2026 Price List'}
              </span>
            </div>
          </button>

          {/* Primary Nav Links (shown when on customer storefront) */}
          {!isSellerMode && (
            <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
              {customerNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    currentScreen === item.id
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-amber-500/30'
                      : 'hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Seller Portal Nav Links (shown when on seller portal) */}
          {isSellerMode && (
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-300 dark:border-amber-500/30">
                Product Catalog CRUD Active
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                Incoming Orders Queue
              </span>
            </div>
          )}

          {/* Right Action Icons: Parallel Mode Toggle + Theme + Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Parallel Mode Switcher Button */}
            <button
              onClick={() => handleNavClick('intro')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isSellerMode
                  ? 'bg-stone-800 text-stone-100 border border-stone-700 hover:border-amber-500'
                  : 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40 hover:bg-amber-500/25'
              }`}
              title={isSellerMode ? 'Switch to Customer Storefront' : 'Switch to Parallel Seller Portal'}
            >
              {isSellerMode ? (
                <>
                  <Store className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Customer Store</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Seller Portal</span>
                </>
              )}
            </button>

            {/* Account Button (on customer mode) */}
            {!isSellerMode && (
              <button
                onClick={() => handleNavClick('auth')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  currentScreen === 'auth'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-800 dark:text-amber-400 font-bold'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
                title={isAuthenticated ? `Signed in as ${user?.name}` : 'Sign In / Account'}
              >
                <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Sign In'}
                </span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-amber-700" />
              )}
            </button>

            {/* Cart Button (on customer mode) */}
            {!isSellerMode && (
              <button
                onClick={() => handleNavClick('cart')}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-red-950/50 hover:shadow-red-900/60 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">Cart</span>
                {totalBoxes > 0 && (
                  <span className="bg-white text-stone-950 text-xs font-black px-2 py-0.5 rounded-md tabular-nums">
                    {totalBoxes}
                  </span>
                )}
                {subtotal > 0 && (
                  <span className="hidden 2xl:inline text-xs font-bold border-l border-white/20 pl-2 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 xl:hidden text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto shadow-xl">
          
          <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl mb-3 flex gap-1">
            <button
              onClick={() => handleNavClick('intro')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                !isSellerMode ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Customer Store
            </button>
            <button
              onClick={() => handleNavClick('intro')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                isSellerMode ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Seller Portal
            </button>
          </div>

          {!isSellerMode ? (
            <>
              {customerNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg text-left text-xs font-semibold transition-colors ${
                    currentScreen === item.id
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                onClick={() => handleNavClick('cart')}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-amber-500/15 border border-amber-300 dark:border-amber-800/40 text-amber-800 dark:text-amber-400 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Full Cart Page</span>
                </span>
                <span>{totalBoxes} units (₹{subtotal.toLocaleString('en-IN')})</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
                <span className="text-amber-700 dark:text-amber-400 font-bold block mb-1">Seller Back-Office & Factory Operations</span>
                <span>Insert, update, or delete crackers, track LR dispatch, and analyze sales.</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-stone-600 dark:text-stone-400">
            <span className="text-xs">Theme Preset:</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-700" />}
              <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Booking: {STORE_INFO.phoneDisplay}</span>
          </a>
        </div>
      )}
    </header>
  );
};
