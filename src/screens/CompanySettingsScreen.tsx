import React, { useEffect, useState } from 'react';
import { Building2, Save, RefreshCw, Image as ImageIcon, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { dbSelect, dbUpdate, storageUploadOriginal } from '../lib/supabase';
import { useAdminAuth } from '../context/AdminAuthContext';

const FIELDS = [
  ['company_name','Company Name'],['legal_name','Legal Name'],['tagline','Tagline'],['description','Description'],
  ['vision','Vision'],['aim','Aim'],['mission','Mission'],['logo_url','Logo URL'],['favicon_url','Favicon URL'],
  ['website_url','Website URL'],['email','Email'],['support_email','Support Email'],['mobile','Mobile'],
  ['alternate_mobile','Alternate Mobile'],['whatsapp_number','WhatsApp Number'],['landline','Landline'],
  ['physical_address','Physical Address'],['address_line_2','Address Line 2'],['landmark','Landmark'],
  ['city','City'],['district','District'],['state','State'],['postal_code','Postal Code'],['country','Country'],
  ['google_maps_url','Google Maps URL'],['gst_number','GST Number'],['pan_number','PAN Number'],
  ['business_registration_number','Business Registration Number'],['established_year','Established Year']
] as const;

export const CompanySettingsScreen: React.FC = () => {
  const { session } = useAdminAuth();
  const [row,setRow]=useState<any>({});
  const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
  const load=async()=>{ if(!session?.access_token)return; setLoading(true); try { const rows=await dbSelect<any>('company_profile','select=*&is_active=eq.true&limit=1',session.access_token); setRow(rows[0]||{}); } catch(e:any){setError(e.message||'Failed to load company profile.')} finally{setLoading(false)} };
  useEffect(()=>{load()},[session?.access_token]);
  const uploadLogo=async(e:React.ChangeEvent<HTMLInputElement>)=>{ const file=e.target.files?.[0]; if(!file||!session?.access_token)return; try { const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_'); const url=await storageUploadOriginal(file,'rtcrackers-images',`company/${crypto.randomUUID()}-${safe}`,session.access_token); setRow((r:any)=>({...r,logo_url:url})); setMessage('Original logo uploaded. Save Company Details to publish it.'); } catch(err:any){setError(err.message||'Logo upload failed.');} };
  const save=async()=>{ if(!session?.access_token||!row.id)return; setSaving(true);setMessage('');setError(''); try { await dbUpdate('company_profile',`id=eq.${row.id}`,{...row,updated_at:new Date().toISOString(),id:undefined,created_at:undefined},session.access_token); setMessage('Company details saved. The customer website will use the updated values.'); await load(); } catch(e:any){setError(e.message||'Save failed.')} finally{setSaving(false)} };
  if(loading)return <div className="min-h-[50vh] flex items-center justify-center text-stone-400"><RefreshCw className="w-5 h-5 animate-spin mr-2"/>Loading company profile…</div>;
  return <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><div className="text-[11px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2"><Building2 className="w-4 h-4"/> Company Control</div><h1 className="font-display text-3xl font-black text-white mt-1">Company Details</h1><p className="text-xs text-stone-400 mt-1">Changes here become the source of truth for the customer website.</p></div><button onClick={save} disabled={saving} className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4"/>{saving?'Saving…':'Save Company Details'}</button></div>
    {message&&<div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{message}</div>}
    {error&&<div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map(([key,label])=><div key={key} className={['description','vision','aim','mission','physical_address','address_line_2'].includes(key)?'md:col-span-2':''}><label className="block text-[11px] font-bold text-stone-400 mb-1.5">{label}</label>{['description','vision','aim','mission','physical_address','address_line_2'].includes(key)?<textarea rows={key==='description'?4:2} value={row[key]||''} onChange={e=>setRow((r:any)=>({...r,[key]:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-500"/>:<input value={row[key]||''} onChange={e=>setRow((r:any)=>({...r,[key]:e.target.value}))} className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-500"/>}</div>)}
        </div>
      </div>
      <div className="space-y-5">
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800"><div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-3"><ImageIcon className="w-4 h-4"/> Logo Preview</div><label className="block mb-3 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold text-center cursor-pointer">Upload Original Logo<input type="file" accept="image/*" onChange={uploadLogo} className="hidden"/></label><div className="aspect-square max-w-[240px] mx-auto rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center overflow-hidden">{row.logo_url?<img src={row.logo_url} alt={row.company_name||'Company logo'} className="w-full h-full object-contain"/>:<span className="text-xs text-stone-600">No logo URL</span>}</div><p className="text-[10px] text-stone-500 mt-3">Uploaded images are stored as the original file in Supabase Storage. No client-side resize, recompression, or WebP conversion is applied. The database stores only the public URL.</p></div>
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 text-xs"><div className="font-bold text-white">Live Contact Preview</div><div className="flex gap-2 text-stone-400"><Phone className="w-4 h-4 text-emerald-400 shrink-0"/>{row.whatsapp_number||row.mobile||'Not set'}</div><div className="flex gap-2 text-stone-400"><Mail className="w-4 h-4 text-blue-400 shrink-0"/>{row.support_email||row.email||'Not set'}</div><div className="flex gap-2 text-stone-400"><MapPin className="w-4 h-4 text-red-400 shrink-0"/><span>{[row.physical_address,row.city,row.state,row.postal_code].filter(Boolean).join(', ')||'Not set'}</span></div></div>
      </div>
    </div>
  </div>;
};
