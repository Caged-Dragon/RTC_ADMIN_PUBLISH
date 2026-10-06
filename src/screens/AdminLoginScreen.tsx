import React, { useState } from 'react';
import { ShieldCheck, LockKeyhole, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLoginScreen: React.FC = () => {
  const { login } = useAdminAuth();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setError(''); setBusy(true);
    try { await login(email,password); }
    catch(err:any){ setError(err?.message || 'Login failed.'); }
    finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-red-600 to-rose-600 flex items-center justify-center shadow-2xl mb-5">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="font-display text-3xl font-black tracking-tight">RED<span className="text-red-500">THUNDER</span></div>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
        </div>
      </div>

      <form onSubmit={submit} className="bg-stone-900/95 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div>
          <h1 className="font-display text-2xl font-black">Admin Sign In</h1>
          <p className="text-xs text-stone-400 mt-1">Only the two authorized RT Crackers administrator IDs can enter this website.</p>
        </div>
        {error && <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex gap-2"><AlertCircle className="w-4 h-4 shrink-0"/><span>{error}</span></div>}
        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1.5">Admin ID</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" required placeholder="admin@rtcrackers.com" className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1.5">Password</label>
          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} autoComplete="current-password" required placeholder="Enter your password" className="w-full pl-10 pr-11 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500" />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-200 cursor-pointer">{show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
          </div>
        </div>
        <button disabled={busy} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-60 text-white font-black text-sm shadow-lg cursor-pointer">
          {busy ? 'Verifying administrator…' : 'Enter Admin Portal'}
        </button>
        <p className="text-[10px] text-stone-600 text-center">Unauthorized accounts are rejected even when their Supabase password is correct.</p>
      </form>
    </div>
  </div>;
};
