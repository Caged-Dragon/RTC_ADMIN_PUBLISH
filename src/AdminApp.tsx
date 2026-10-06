import React, { useState } from 'react';
import { LogOut, Building2, Store, ShieldCheck, ExternalLink, Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ProductsProvider } from './context/ProductsContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { SellerPortalScreen } from './screens/SellerPortalScreen';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { CompanySettingsScreen } from './screens/CompanySettingsScreen';
import { InvoiceModal } from './components/InvoiceModal';
import { BannerManagementScreen } from './screens/BannerManagementScreen';
import { useTheme } from './context/ThemeContext';

const AdminWorkspace: React.FC = () => {
  const { admin, loading, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const [screen,setScreen]=useState<'operations'|'banners'|'company'>('operations');
  const [invoiceOpen,setInvoiceOpen]=useState(false);
  if(loading) return <div className="min-h-screen bg-stone-950 text-stone-400 flex items-center justify-center text-sm">Checking administrator access…</div>;
  if(!admin) return <AdminLoginScreen />;
  return <div className="min-h-screen bg-[#faf7f2] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-amber-600/30 text-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-red-600 to-rose-600 flex items-center justify-center"><ShieldCheck className="w-5 h-5"/></div><div><div className="font-display text-lg font-black">RED<span className="text-red-500">THUNDER</span></div><div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Admin Control Center</div></div></div>
        <div className="hidden sm:flex items-center gap-2 text-xs"><span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{admin.role==='primary_admin'?'Primary Admin':'Admin'}</span><span className="text-stone-400">{admin.email}</span></div>
        <div className="flex items-center gap-2 flex-wrap justify-end"><button onClick={()=>setScreen('operations')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${screen==='operations'?'bg-amber-600 text-white':'text-stone-300 hover:bg-stone-900'}`}><Store className="w-4 h-4"/>Operations</button><button onClick={()=>setScreen('banners')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${screen==='banners'?'bg-amber-600 text-white':'text-stone-300 hover:bg-stone-900'}`}><ImageIcon className="w-4 h-4"/>Banners</button><button onClick={()=>setScreen('company')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${screen==='company'?'bg-amber-600 text-white':'text-stone-300 hover:bg-stone-900'}`}><Building2 className="w-4 h-4"/>Company</button><button onClick={toggleTheme} aria-label="Toggle light/dark mode" title={theme==='dark'?'Switch to light mode':'Switch to dark mode'} className="p-2 rounded-lg text-stone-300 hover:bg-stone-900 cursor-pointer">{theme==='dark'?<Sun className="w-4 h-4"/>:<Moon className="w-4 h-4"/>}</button><a href="https://cart.rtcrackers.com" target="_blank" rel="noreferrer" className="hidden md:flex px-3 py-2 rounded-lg text-xs font-bold text-stone-300 hover:bg-stone-900 items-center gap-1.5"><ExternalLink className="w-4 h-4"/>Store</a><button onClick={logout} className="px-3 py-2 rounded-lg text-xs font-bold text-red-300 hover:bg-red-950/50 flex items-center gap-1.5 cursor-pointer"><LogOut className="w-4 h-4"/>Logout</button></div>
      </div>
    </header>
    <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-5">
      {screen==='operations' ? <SellerPortalScreen onSwitchToCustomer={()=>window.open('https://cart.rtcrackers.com','_blank')} onOpenInvoice={()=>setInvoiceOpen(true)} /> : screen==='banners' ? <BannerManagementScreen /> : <CompanySettingsScreen />}
    </main>
    <InvoiceModal isOpen={invoiceOpen} onClose={()=>setInvoiceOpen(false)} />
  </div>;
};

export default function AdminApp(){
  return <ThemeProvider><AdminAuthProvider><AuthProvider><StoreProvider><ProductsProvider><ToastProvider><CartProvider><AdminWorkspace/></CartProvider></ToastProvider></ProductsProvider></StoreProvider></AuthProvider></AdminAuthProvider></ThemeProvider>;
}
