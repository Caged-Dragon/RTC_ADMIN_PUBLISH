import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, Server, ArrowRight, ShieldCheck, RefreshCw, Key, Globe } from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  getSupabaseClient,
  SUPABASE_SQL_SETUP_SCRIPT
} from '../lib/supabase';
import { useCart } from '../context/CartContext';

export const SupabaseScreen: React.FC = () => {
  const { ordersHistory } = useCart();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const config = getStoredSupabaseConfig();
    setUrl(config.url);
    setAnonKey(config.anonKey);
  }, []);

  const handleTestConnection = async () => {
    if (!url || !anonKey) {
      setTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key first.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url, anonKey);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleSyncOrders = async () => {
    const client = getSupabaseClient();
    if (!client) {
      alert('Please save and test your Supabase connection first.');
      return;
    }
    if (ordersHistory.length === 0) {
      alert('No orders in your local history to sync.');
      return;
    }

    setSyncing(true);
    try {
      for (const order of ordersHistory) {
        // Upsert order
        await client.from('orders').upsert({
          order_id: order.orderId,
          customer_name: order.customer.name,
          customer_phone: order.customer.phone,
          customer_email: order.customer.email,
          customer_city: order.customer.city,
          customer_address: order.customer.address,
          transport_preference: order.customer.transportPreference,
          notes: order.customer.notes,
          total_boxes: order.totalBoxes,
          subtotal: order.subtotal,
          status: order.status,
          lr_number: order.lrNumber,
        });

        // Insert items
        for (const it of order.items) {
          await client.from('order_items').insert({
            order_id: order.orderId,
            product_id: it.product.id,
            product_s_no: it.product.sNo,
            product_name: it.product.name,
            unit: it.product.unit,
            rate: it.product.rate,
            quantity: it.quantity,
            line_total: it.product.rate * it.quantity,
          });
        }
      }
      alert(`Successfully synced ${ordersHistory.length} orders to your Supabase database!`);
    } catch (e: any) {
      alert(`Sync note: ${e.message || 'Make sure you have created the SQL tables first!'}`);
    } finally {
      setSyncing(false);
    }
  };

  const isConnected = !!url && !!anonKey;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Cloud Database Integration</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
            Supabase Database Configuration
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 max-w-xl">
            Connect your own PostgreSQL database on Supabase to store customer orders, delivery requests, and live catalog data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
            isConnected
              ? 'bg-emerald-950/80 dark:bg-emerald-950/80 light:bg-emerald-100 text-emerald-400 dark:text-emerald-400 light:text-emerald-800 border-emerald-800/80'
              : 'bg-stone-900 dark:bg-stone-900 light:bg-stone-100 text-stone-400 border-stone-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
            <span>{isConnected ? 'Supabase Configured' : 'Using Local Node Backend'}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Credentials Form */}
        <div className="lg:col-span-7 bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <h2 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            <span>Supabase Project Credentials</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                Supabase Project URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://your-project-id.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Found in your Supabase Dashboard: Settings $\to$ API $\to$ Project URL.
              </span>
            </div>

            <div>
              <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                Supabase Anon / Public API Key <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Found in your Supabase Dashboard: Settings $\to$ API $\to$ Project API keys $\to$ `anon` / `public`.
              </span>
            </div>
          </div>

          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
              testResult.success
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : 'bg-red-950/40 text-red-300 border-red-800/60'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {savedNotice && (
            <div className="p-3 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800/60 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400" />
              <span>Credentials saved to local storage!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Save Credentials
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-400 text-xs font-medium border border-stone-800 transition-colors cursor-pointer"
              >
                Clear / Disconnect
              </button>
            )}
          </div>

          {/* Sync Button */}
          {isConnected && (
            <div className="pt-4 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <strong className="text-white dark:text-white light:text-stone-900 text-xs block">
                  Sync Orders History
                </strong>
                <span className="text-[11px] text-stone-400">
                  Upload all {ordersHistory.length} local orders to your Supabase database table.
                </span>
              </div>
              <button
                onClick={handleSyncOrders}
                disabled={syncing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Column: 1-Click SQL Setup Script */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-stone-900/90 dark:bg-stone-900/90 light:bg-white rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase SQL Setup Script</span>
              </h3>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                <span>{sqlCopied ? 'Copied Script!' : 'Copy SQL'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 leading-relaxed">
              Run this script once in your <strong>Supabase Dashboard $\to$ SQL Editor</strong> to automatically create the `orders`, `order_items`, and `inquiries` tables with full Row Level Security (RLS).
            </p>

            <div className="p-3.5 rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-200 font-mono text-[11px] text-stone-300 dark:text-stone-300 light:text-stone-800 max-h-56 overflow-y-auto leading-relaxed">
              <pre>{SUPABASE_SQL_SETUP_SCRIPT}</pre>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50 border border-amber-800/40 text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 space-y-2">
            <strong className="text-amber-400 dark:text-amber-400 light:text-amber-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>How it works:</span>
            </strong>
            <p className="leading-relaxed">
              When Supabase is connected, new cracker orders placed from the Cart Page or WhatsApp checkout will automatically sync into your Supabase database table in real time!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
