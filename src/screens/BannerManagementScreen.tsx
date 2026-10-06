import React, { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, Save, Trash2, Power, Upload, Eye, X } from 'lucide-react';
import { dbDelete, dbInsert, dbSelect, dbUpdate, storageUploadOriginal } from '../lib/supabase';
import { useAdminAuth } from '../context/AdminAuthContext';

interface Banner { id:string; offer_id:string; image_url:string; mobile_image_url:string|null; alt_text:string|null; headline:string|null; subheadline:string|null; button_text:string|null; button_url:string|null; display_order:number; is_active:boolean; starts_at:string|null; ends_at:string|null; }
interface Offer { id:string; title:string; offer_code:string|null; is_active:boolean; }

const emptyForm = { offerId:'', title:'', imageUrl:'', mobileImageUrl:'', altText:'Home banner', headline:'', subheadline:'', buttonText:'', buttonUrl:'', displayOrder:'1', isActive:true, startsAt:'', endsAt:'' };

export const BannerManagementScreen: React.FC = () => {
  const { session } = useAdminAuth();
  const token = session?.access_token;
  const [banners,setBanners]=useState<Banner[]>([]);
  const [offers,setOffers]=useState<Offer[]>([]);
  const [form,setForm]=useState(emptyForm);
  const [editingId,setEditingId]=useState<string|null>(null);
  const [uploading,setUploading]=useState<'desktop'|'mobile'|null>(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');

  const load=async()=>{
    if(!token)return;
    setLoading(true); setError('');
    try{
      const [b,o]=await Promise.all([
        dbSelect<Banner>('offer_banners','select=*&order=display_order.asc,created_at.desc',token),
        dbSelect<Offer>('offers','select=id,title,offer_code,is_active&order=display_order.asc,created_at.desc',token)
      ]);
      setBanners(b); setOffers(o);
    }catch(e:any){setError(e.message||'Unable to load banners.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{load();},[token]);

  const selectedOffer=useMemo(()=>offers.find(o=>o.id===form.offerId),[offers,form.offerId]);
  const reset=()=>{setEditingId(null);setForm(emptyForm);setMessage('');setError('');};
  const edit=(b:Banner)=>{
    setEditingId(b.id); setMessage(''); setError('');
    setForm({offerId:b.offer_id,title:offers.find(o=>o.id===b.offer_id)?.title||'',imageUrl:b.image_url,mobileImageUrl:b.mobile_image_url||'',altText:b.alt_text||'',headline:b.headline||'',subheadline:b.subheadline||'',buttonText:b.button_text||'',buttonUrl:b.button_url||'',displayOrder:String(b.display_order),isActive:b.is_active,startsAt:b.starts_at?b.starts_at.slice(0,16):'',endsAt:b.ends_at?b.ends_at.slice(0,16):''});
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const upload=async(file:File,kind:'desktop'|'mobile')=>{
    if(!token) return; if(!file.type.startsWith('image/')){setError('Please select an image file.');return;}
    setUploading(kind); setError('');
    try{const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const url=await storageUploadOriginal(file,'rtcrackers-images',`banners/${crypto.randomUUID()}-${safe}`,token);setForm(f=>({...f,[kind==='desktop'?'imageUrl':'mobileImageUrl']:url}));}
    catch(e:any){setError(e.message||'Image upload failed.');} finally{setUploading(null);}
  };
  const save=async()=>{
    if(!token)return;
    if(!form.imageUrl.trim()) return setError('Desktop banner image is required.');
    if(!form.title.trim()) return setError('Banner/offer title is required.');
    setSaving(true);setError('');setMessage('');
    try{
      let offerId=form.offerId;
      if(!offerId){
        const created=await dbInsert<Offer>('offers',{title:form.title.trim(),short_title:form.title.trim(),description:form.subheadline.trim()||null,offer_type:'CUSTOM_OFFER',priority:0,is_stackable:false,is_featured:true,is_active:true,display_order:Number(form.displayOrder)||1,metadata:{}},token);
        offerId=created[0]?.id;
        if(!offerId)throw new Error('Could not create the banner offer record.');
      } else if(selectedOffer?.title!==form.title.trim()){
        await dbUpdate('offers',`id=eq.${offerId}`,{title:form.title.trim(),short_title:form.title.trim(),updated_at:new Date().toISOString()},token);
      }
      const payload={offer_id:offerId,image_url:form.imageUrl.trim(),mobile_image_url:form.mobileImageUrl.trim()||null,alt_text:form.altText.trim()||null,headline:form.headline.trim()||null,subheadline:form.subheadline.trim()||null,button_text:form.buttonText.trim()||null,button_url:form.buttonUrl.trim()||null,display_order:Number(form.displayOrder)||1,is_active:form.isActive,starts_at:form.startsAt?new Date(form.startsAt).toISOString():null,ends_at:form.endsAt?new Date(form.endsAt).toISOString():null,metadata:{placement:'home_top_banner'}};
      if(editingId) await dbUpdate('offer_banners',`id=eq.${editingId}`,{...payload,updated_at:new Date().toISOString()},token);
      else await dbInsert('offer_banners',payload,token);
      setMessage(editingId?'Banner updated successfully.':'Banner created successfully.'); reset(); await load();
    }catch(e:any){setError(e.message||'Could not save banner.');}finally{setSaving(false);}
  };
  const deactivate=async(b:Banner)=>{if(!token)return;try{await dbUpdate('offer_banners',`id=eq.${b.id}`,{is_active:!b.is_active,updated_at:new Date().toISOString()},token);await load();}catch(e:any){setError(e.message||'Could not update banner.');}};
  const remove=async(b:Banner)=>{if(!token||!confirm('Delete this banner? The linked offer will be kept.'))return;try{await dbDelete('offer_banners',`id=eq.${b.id}`,token);if(editingId===b.id)reset();await load();}catch(e:any){setError(e.message||'Could not delete banner.');}};

  return <div className="space-y-6">
    <div className="rounded-3xl border border-amber-600/30 bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div><div className="text-[11px] uppercase tracking-widest font-bold text-amber-400 mb-2">Home Screen Control</div><h1 className="font-display text-2xl sm:text-3xl font-black">Top Banner Management</h1><p className="text-sm text-stone-300 mt-2 max-w-2xl">The first component on the customer home screen comes from this banner section. Create, edit, reorder, activate or deactivate banners here.</p></div>
        <button onClick={()=>{reset();window.scrollTo({top:0,behavior:'smooth'});}} className="px-4 py-3 rounded-xl bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> New Banner</button>
      </div>
    </div>

    {(message||error)&&<div className={`rounded-xl border p-3 text-sm ${error?'border-red-500/40 bg-red-950/30 text-red-200':'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'}`}>{error||message}</div>}

    <section className="rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-900/80 dark:bg-stone-900/80 light:bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5"><div><h2 className="font-display text-xl font-black text-white dark:text-white light:text-stone-900">{editingId?'Edit Home Banner':'Create Home Banner'}</h2><p className="text-xs text-stone-400 mt-1">Upload the original image file. No client-side compression is applied.</p></div>{editingId&&<button onClick={reset} className="p-2 rounded-lg border border-stone-700 text-stone-300"><X className="w-4 h-4"/></button>}</div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-stone-300">Offer / Banner Title<select value={form.offerId} onChange={e=>setForm(f=>({...f,offerId:e.target.value,title:e.target.value?(offers.find(o=>o.id===e.target.value)?.title||f.title):f.title}))} className="mt-1 w-full rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 p-3 text-sm text-white dark:text-white light:text-stone-900"><option value="">Create new offer for this banner</option>{offers.map(o=><option key={o.id} value={o.id}>{o.title}{o.is_active?'':' (inactive)'}</option>)}</select></label>
          <label className="block text-xs font-bold text-stone-300">Title<input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 p-3 text-sm text-white dark:text-white light:text-stone-900" placeholder="Diwali 2026 Special Offer"/></label>
          <label className="block text-xs font-bold text-stone-300">Headline<input value={form.headline} onChange={e=>setForm(f=>({...f,headline:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 p-3 text-sm text-white dark:text-white light:text-stone-900"/></label>
          <label className="block text-xs font-bold text-stone-300">Subheadline<textarea value={form.subheadline} onChange={e=>setForm(f=>({...f,subheadline:e.target.value}))} rows={3} className="mt-1 w-full rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 dark:border-stone-700 light:border-stone-300 p-3 text-sm text-white dark:text-white light:text-stone-900"/></label>
          <div className="grid sm:grid-cols-2 gap-3"><label className="block text-xs font-bold text-stone-300">Button Text<input value={form.buttonText} onChange={e=>setForm(f=>({...f,buttonText:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 p-3 text-sm"/></label><label className="block text-xs font-bold text-stone-300">Button URL / Screen<input value={form.buttonUrl} onChange={e=>setForm(f=>({...f,buttonUrl:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 p-3 text-sm" placeholder="/products"/></label></div>
          <div className="grid sm:grid-cols-3 gap-3"><label className="block text-xs font-bold text-stone-300">Order<input type="number" min="1" value={form.displayOrder} onChange={e=>setForm(f=>({...f,displayOrder:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-sm"/></label><label className="block text-xs font-bold text-stone-300">Starts<input type="datetime-local" value={form.startsAt} onChange={e=>setForm(f=>({...f,startsAt:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-xs"/></label><label className="block text-xs font-bold text-stone-300">Ends<input type="datetime-local" value={form.endsAt} onChange={e=>setForm(f=>({...f,endsAt:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-xs"/></label></div>
          <label className="flex items-center gap-2 text-sm font-bold text-stone-200"><input type="checkbox" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))}/> Active on customer home</label>
        </div>
        <div className="space-y-4">
          {(['desktop','mobile'] as const).map(kind=>{const url=kind==='desktop'?form.imageUrl:form.mobileImageUrl;return <div key={kind} className="rounded-2xl border border-stone-800 p-4"><div className="flex items-center justify-between mb-3"><div><h3 className="font-bold text-white text-sm">{kind==='desktop'?'Desktop / Main Image':'Mobile Image (optional)'}</h3><p className="text-[11px] text-stone-500">Original file preserved</p></div><label className="px-3 py-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-black cursor-pointer flex items-center gap-1.5">{uploading===kind?<span>Uploading…</span>:<><Upload className="w-3.5 h-3.5"/> Upload</>}<input type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],kind)}/></label></div>{url?<img src={url} className="w-full aspect-[16/6] object-cover rounded-xl border border-stone-700"/>:<div className="aspect-[16/6] rounded-xl border border-dashed border-stone-700 flex items-center justify-center text-xs text-stone-500"><ImageIcon className="w-5 h-5 mr-2"/>No image selected</div>}<input value={url} onChange={e=>setForm(f=>({...f,[kind==='desktop'?'imageUrl':'mobileImageUrl']:e.target.value}))} className="mt-3 w-full rounded-lg bg-stone-950 border border-stone-700 p-2.5 text-xs text-stone-300" placeholder="Or paste image URL"/></div>})}
          <label className="block text-xs font-bold text-stone-300">Alt Text<input value={form.altText} onChange={e=>setForm(f=>({...f,altText:e.target.value}))} className="mt-1 w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-sm"/></label>
          <button disabled={saving} onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>{saving?'Saving…':editingId?'Update Banner':'Create Banner'}</button>
        </div>
      </div>
    </section>

    <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-black text-white dark:text-white light:text-stone-900">Existing Home Banners</h2><span className="text-xs text-stone-500">{banners.length} banner(s)</span></div>{loading?<div className="text-sm text-stone-400">Loading banners…</div>:banners.length===0?<div className="rounded-2xl border border-dashed border-stone-700 p-8 text-center text-sm text-stone-500">No database banner yet. Create the first home banner above.</div>:<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{banners.map(b=><article key={b.id} className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/80 dark:bg-stone-900/80 light:bg-white"><img src={b.image_url} alt={b.alt_text||''} className="w-full aspect-[16/6] object-cover"/><div className="p-4 space-y-3"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-white dark:text-white light:text-stone-900">{b.headline||offers.find(o=>o.id===b.offer_id)?.title||'Untitled banner'}</h3><p className="text-[11px] text-stone-500">Display order {b.display_order}</p></div><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${b.is_active?'bg-emerald-500/15 text-emerald-400':'bg-stone-800 text-stone-500'}`}>{b.is_active?'Active':'Inactive'}</span></div><div className="flex gap-2"><button onClick={()=>edit(b)} className="flex-1 py-2 rounded-lg border border-stone-700 text-xs font-bold text-stone-300">Edit</button><button onClick={()=>deactivate(b)} className="px-3 rounded-lg border border-stone-700 text-xs text-amber-400"><Power className="w-4 h-4"/></button><button onClick={()=>remove(b)} className="px-3 rounded-lg border border-red-900/60 text-xs text-red-400"><Trash2 className="w-4 h-4"/></button></div></div></article>)}</div>}</section>
  </div>;
};
