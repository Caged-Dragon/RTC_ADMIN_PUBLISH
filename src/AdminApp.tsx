import React, { useState } from 'react';
import {
  LogOut, Building2, Store, ShieldCheck, ExternalLink, Sun, Moon,
  Image as ImageIcon, Layers, Mail, Menu, X, Package, ClipboardList,
  Users, Truck, Receipt, TrendingUp, QrCode, Palette, ChevronRight, type LucideIcon,
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { ProductsProvider } from './context/ProductsContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { SellerPortalScreen, type SellerTab } from './screens/SellerPortalScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { CompanySettingsScreen } from './screens/CompanySettingsScreen';
import { InvoiceModal } from './components/InvoiceModal';
import { BannerManagementScreen } from './screens/BannerManagementScreen';
import { useTheme } from './context/ThemeContext';
import { ThemeManagementScreen } from './screens/ThemeManagementScreen';
import { CategoryManagementScreen } from './screens/CategoryManagementScreen';
import { CategoriesProvider } from './context/CategoriesContext';
import { dbSelect } from './lib/supabase';

type AdminScreen = 'operations' | 'categories' | 'banners' | 'company' | 'theme';
type IconComponent = LucideIcon;

interface NavigationItem {
  id: string;
  label: string;
  description: string;
  icon: IconComponent;
  screen: AdminScreen;
  sellerTab?: SellerTab;
}

const navigationGroups: { title: string; items: NavigationItem[] }[] = [
  {
    title: 'Business operations',
    items: [
      { id: 'inventory', label: 'Products & inventory', description: 'Products, prices, images and stock', icon: Package, screen: 'operations', sellerTab: 'inventory' },
      { id: 'orders', label: 'Orders', description: 'Review and update customer orders', icon: ClipboardList, screen: 'operations', sellerTab: 'orders' },
      { id: 'customers', label: 'Customers', description: 'Customer history and analysis', icon: Users, screen: 'operations', sellerTab: 'customers' },
      { id: 'dispatch', label: 'Dispatch & transport', description: 'Transporters and LR details', icon: Truck, screen: 'operations', sellerTab: 'dispatch' },
      { id: 'walkin', label: 'Walk-in billing', description: 'Create quick bills and quotations', icon: Receipt, screen: 'operations', sellerTab: 'walkin' },
      { id: 'analytics', label: 'Sales analytics', description: 'Sales and performance reports', icon: TrendingUp, screen: 'operations', sellerTab: 'analytics' },
      { id: 'factory', label: 'Factory profile & QR', description: 'Business profile and payment QR', icon: QrCode, screen: 'operations', sellerTab: 'settings' },
    ],
  },
  {
    title: 'Catalog & website',
    items: [
      { id: 'categories', label: 'Categories', description: 'Organize product categories', icon: Layers, screen: 'categories' },
      { id: 'banners', label: 'Banners & media', description: 'Manage homepage banners', icon: ImageIcon, screen: 'banners' },
      { id: 'company', label: 'Company details', description: 'Logo, contact and company profile', icon: Building2, screen: 'company' },
      { id: 'theme', label: 'Theme & appearance', description: 'Manage website colours and layouts', icon: Palette, screen: 'theme' },
    ],
  },
];

const AdminWorkspace: React.FC = () => {
  const { admin, session, loading, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { storeInfo: STORE_INFO } = useStore();
  const [screen, setScreen] = useState<AdminScreen>('operations');
  const [operationTab, setOperationTab] = useState<SellerTab>('inventory');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  React.useEffect(() => {
    if (admin) window.dispatchEvent(new CustomEvent('rt-theme-page', { detail: screen }));
  }, [screen, admin]);

  React.useEffect(() => {
    if (!mobileNavOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileNavOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileNavOpen]);

  // Unread count for the company mailbox (same database, admin-only by row-level security).
  const [unreadMail, setUnreadMail] = useState<number | null>(null);
  React.useEffect(() => {
    if (!admin) return;
    let stop = false;
    const load = async () => {
      if (document.hidden) return;
      try {
        const rows = await dbSelect<any>('email_messages', 'select=email_message_id&direction=eq.inbound&is_read=eq.false&deleted_at=is.null&limit=100', session?.access_token);
        if (!stop) setUnreadMail(rows.length);
      } catch { if (!stop) setUnreadMail(null); }
    };
    void load();
    const id = window.setInterval(load, 60000);
    return () => { stop = true; window.clearInterval(id); };
  }, [admin, session?.access_token]);

  const navigate = (item: NavigationItem) => {
    if (item.screen === 'operations' && item.sellerTab) setOperationTab(item.sellerTab);
    setScreen(item.screen);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (item: NavigationItem) => screen === item.screen &&
    (item.screen !== 'operations' || item.sellerTab === operationTab);

  const renderNavigation = (mobile = false) => (
    <nav aria-label="Admin sections" className={mobile ? 'space-y-5' : 'space-y-6'}>
      {navigationGroups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <h2 className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">{group.title}</h2>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item)}
                  aria-current={active ? 'page' : undefined}
                  className={`group w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer border ${active
                    ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-200 shadow-sm'
                    : 'border-transparent text-stone-700 hover:bg-stone-100 hover:border-stone-200 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:border-stone-800'}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-600 group-hover:bg-white dark:bg-stone-900 dark:text-stone-300 dark:group-hover:bg-stone-800'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold leading-4">{item.label}</span>
                    <span className={`mt-0.5 block text-[10px] leading-4 ${active ? 'text-red-700/80 dark:text-red-200/70' : 'text-stone-500 dark:text-stone-400'}`}>{item.description}</span>
                  </span>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${active ? 'text-red-600 dark:text-red-300' : 'text-stone-400 opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <div className="mx-2 rounded-xl border border-red-100 bg-red-50/70 p-3 dark:border-red-950 dark:bg-red-950/20">
        <p className="text-xs font-bold text-red-900 dark:text-red-200">Need the storefront?</p>
        <a href="https://cart.rtcrackers.com" target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-white">
          Open customer website <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </nav>
  );

  if (loading) return <div className="min-h-screen bg-stone-50 text-stone-600 dark:bg-stone-950 dark:text-stone-400 flex items-center justify-center text-sm">Checking administrator access…</div>;
  if (!admin) return <AdminLoginScreen />;

  return (
    <div data-rtc-admin-portal="true" className="min-h-screen bg-[#faf7f2] text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header data-rtc-component="header" className="sticky top-0 z-50 border-b border-red-100 bg-white/95 text-stone-900 shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-950/95 dark:text-white">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label={mobileNavOpen ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={mobileNavOpen} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-red-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 lg:hidden">
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm dark:border-stone-700">
              {STORE_INFO.logoUrl ? <img src={STORE_INFO.logoUrl} alt={`${STORE_INFO.name || 'Company'} logo`} className="h-full w-full object-contain" /> : <ShieldCheck className="h-5 w-5 text-red-700" />}
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-black sm:text-base">{STORE_INFO.name || 'RT Crackers'}</div>
              <div className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-red-700 dark:text-red-300">{STORE_INFO.tagline || 'Admin Control Center'}</div>
            </div>
          </div>

          <div className="hidden min-w-0 items-center gap-2 xl:flex">
            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{admin.role === 'primary_admin' ? 'Primary Admin' : 'Admin'}</span>
            <span className="max-w-[220px] truncate text-xs text-stone-500 dark:text-stone-400">{admin.email}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button type="button" onClick={toggleTheme} aria-label="Toggle light/dark mode" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-red-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href="https://mail.rtcrackers.com" aria-label="Open company email" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 text-xs font-bold text-stone-700 hover:border-red-200 hover:bg-red-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 sm:px-3">
              <Mail className="h-4 w-4" /><span className="hidden sm:inline">Mail</span>
              {unreadMail ? <span className="min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[10px] leading-none text-white">{unreadMail >= 100 ? '99+' : unreadMail}</span> : null}
            </a>
            <a href="https://cart.rtcrackers.com" aria-label="Open customer storefront" target="_blank" rel="noreferrer" className="hidden h-10 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 text-xs font-bold text-stone-700 hover:border-red-200 hover:bg-red-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 md:inline-flex">
              <Store className="h-4 w-4" /><span>Store</span><ExternalLink className="h-3 w-3" />
            </a>
            <button type="button" onClick={logout} aria-label="Log out of admin" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-2.5 text-xs font-bold text-red-800 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/60 sm:px-3">
              <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[66px] z-40 overflow-y-auto border-t border-red-100 bg-white px-3 py-4 shadow-xl dark:border-stone-800 dark:bg-stone-950 lg:hidden">
          {renderNavigation(true)}
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1800px] items-start gap-4 px-3 sm:gap-5 sm:px-5 lg:gap-6 lg:px-6">
        <aside className="sticky top-[88px] hidden max-h-[calc(100vh-104px)] w-[270px] shrink-0 overflow-y-auto py-6 lg:block xl:w-[292px]" aria-label="Primary admin navigation">
          <div className="mb-4 px-3">
            <div className="text-sm font-extrabold">Admin workspace</div>
            <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">All sections in one place</div>
          </div>
          {renderNavigation()}
        </aside>

        <main data-rtc-component={screen === 'operations' ? 'dashboard_cards' : screen} className="min-w-0 flex-1 py-4 sm:py-5 lg:py-6">
          {screen === 'operations' ? (
            <SellerPortalScreen
              activeTab={operationTab}
              onActiveTabChange={setOperationTab}
              onSwitchToCustomer={() => window.open('https://cart.rtcrackers.com', '_blank', 'noopener,noreferrer')}
              onOpenInvoice={() => setInvoiceOpen(true)}
            />
          ) : screen === 'categories' ? <CategoryManagementScreen />
            : screen === 'banners' ? <BannerManagementScreen />
              : screen === 'company' ? <CompanySettingsScreen />
                : <ThemeManagementScreen />}
        </main>
      </div>
      <InvoiceModal isOpen={invoiceOpen} onClose={() => setInvoiceOpen(false)} />
    </div>
  );
};

export default function AdminApp() {
  return <ThemeProvider><AdminAuthProvider><AuthProvider><StoreProvider><CategoriesProvider><ProductsProvider><ToastProvider><CartProvider><AdminWorkspace /></CartProvider></ToastProvider></ProductsProvider></CategoriesProvider></StoreProvider></AuthProvider></AdminAuthProvider></ThemeProvider>;
}
