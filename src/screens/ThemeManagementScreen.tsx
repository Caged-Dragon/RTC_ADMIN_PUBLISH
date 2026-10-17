import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Eye, Palette, Save, RotateCcw } from 'lucide-react';
import { dbSelect, dbUpdate, getSession } from '../lib/supabase';
import { applyThemeVars, applyComponentStyles } from '../themeDatabase';

type PageRow = any;
type ComponentRow = any;

const pageLabels: Record<string,string> = { main:'Main / Portfolio', cart:'Customer / Cart', admin:'Admin / Control Center', mail:'Mail / Workspace' };
const pageThemeFields = ['background_color','surface_color','surface_elevated_color','section_color','header_color','footer_color','text_color','muted_text_color','heading_color','primary_color','primary_dark_color','secondary_color','accent_color','link_color','button_background_color','button_text_color','border_color','border_strong_color','input_background_color','input_border_color','hero_background_color','banner_background_color','nav_background_color','nav_text_color','font_heading','font_body','radius_small','radius_medium','radius_large'] as const;
const paletteTextFields = new Set(['text_color','muted_text_color','heading_color','link_color','button_text_color','nav_text_color']);
const allowedTextColors = [{ label: 'Black', value: '#171717' }, { label: 'Red', value: '#C62828' }, { label: 'Orange', value: '#EA580C' }];
const componentEditableFields = ['font_family','font_size','font_weight','line_height','letter_spacing','text_color','background_color','border_color','border_width','border_radius','box_shadow','padding','margin','width','max_width','text_align','component_tokens','content_value','is_active','sort_order'] as const;
const valueFields = [
  ['font_family','Font family','text'],['font_size','Font size','text'],['font_weight','Font weight','select'],['line_height','Line height','text'],['letter_spacing','Letter spacing','text'],
  ['text_color','Text colour','palette'],['background_color','Background colour','color'],['border_color','Border colour','color'],['border_width','Border width','text'],['border_radius','Corner radius','text'],
  ['box_shadow','Shadow','text'],['padding','Padding','text'],['margin','Margin','text'],['width','Width','text'],['max_width','Maximum width','text'],['text_align','Text alignment','select']
] as const;

const pretty = (v:string) => v.replace(/[-_]/g,' ').replace(/\b\w/g,m=>m.toUpperCase());

export const ThemeManagementScreen: React.FC = () => {
  const token = getSession()?.access_token;
  const [pages,setPages] = useState<PageRow[]>([]);
  const [components,setComponents] = useState<ComponentRow[]>([]);
  // This project boots the admin portal; default to its live database theme instead of an unrelated storefront theme.
  const [website,setWebsite] = useState('admin');
  const [pageKey,setPageKey] = useState('operations');
  const [sectionKey,setSectionKey] = useState('about');
  const [componentKey,setComponentKey] = useState('about_heading');
  const [pageForm,setPageForm] = useState<any>(null);
  const [componentForm,setComponentForm] = useState<any>(null);
  const [status,setStatus] = useState('');
  const [statusTone,setStatusTone] = useState<'success'|'error'|'info'>('info');
  const [saving,setSaving] = useState(false);
  const [loadFailed,setLoadFailed] = useState(false);

  const reload = async (): Promise<{ pages: PageRow[]; components: ComponentRow[] }> => {
    const [p,c] = await Promise.all([
      dbSelect<any>('theme_page_settings','select=*&order=website_key,page_key',token),
      dbSelect<any>('theme_component_settings','select=*&order=website_key,page_key,section_key,sort_order',token),
    ]);
    setPages(p); setComponents(c);
    return { pages: p, components: c };
  };
  useEffect(()=>{ reload().catch(e=>{setLoadFailed(true);setStatusTone('error');setStatus(e.message||'Unable to load theme settings');}); },[]);

  const websitePages = useMemo(()=>pages.filter(r=>r.website_key===website),[pages,website]);
  const pageComponents = useMemo(()=>components.filter(r=>r.website_key===website && r.page_key===pageKey),[components,website,pageKey]);
  const sections = useMemo(()=>Array.from(new Map(pageComponents.map(r=>[r.section_key,{key:r.section_key,name:r.section_name}])).values()),[pageComponents]);
  const sectionComponents = useMemo(()=>pageComponents.filter(r=>r.section_key===sectionKey),[pageComponents,sectionKey]);
  const selectedPage = pages.find(r=>r.website_key===website && r.page_key===pageKey);

  useEffect(()=>{
    const first = websitePages[0]?.page_key; if(first && !websitePages.some(p=>p.page_key===pageKey)) setPageKey(first);
  },[websitePages,pageKey]);
  useEffect(()=>{ const first=sections[0]?.key; if(first && !sections.some(s=>s.key===sectionKey)) setSectionKey(first); },[sections,sectionKey]);
  useEffect(()=>{ const first=sectionComponents[0]?.component_key; if(first && !sectionComponents.some(c=>c.component_key===componentKey)) setComponentKey(first); },[sectionComponents,componentKey]);
  useEffect(()=>{
    const p=pages.find(r=>r.website_key===website && r.page_key===pageKey); setPageForm(p?{...p}:null); if(p && website === 'admin') applyThemeVars(p);
  },[pages,website,pageKey]);
  useEffect(()=>{ const c=components.find(r=>r.website_key===website && r.page_key===pageKey && r.section_key===sectionKey && r.component_key===componentKey); setComponentForm(c?{...c}:null); },[components,website,pageKey,sectionKey,componentKey]);

  const savePage = async () => {
    if(!pageForm) return;
    if(!token) { setStatusTone('error'); setStatus('Your admin session has expired. Sign in again before saving.'); return; }
    setSaving(true); setStatusTone('info'); setStatus('Saving page theme to Supabase…');
    try {
      const patch = Object.fromEntries(pageThemeFields.filter(k => pageForm[k] !== undefined).map(k => [k, pageForm[k]]));
      const updated = await dbUpdate<PageRow>('theme_page_settings',`theme_page_id=eq.${pageForm.theme_page_id}`,patch,token);
      if(!Array.isArray(updated) || updated.length === 0) throw new Error('Supabase did not update a row. Check that this admin account has theme-edit permissions.');
      const saved = { ...pageForm, ...updated[0] };
      setPageForm(saved);
      const loaded = await reload();
      if(website === 'admin') {
        applyThemeVars(saved);
        applyComponentStyles(loaded.components.filter(r => r.website_key === 'admin' && r.page_key === pageKey && r.is_active));
      }
      setStatusTone('success'); setStatus('Page theme saved successfully to Supabase. Open that page to see the saved colours.');
      if(website === 'admin' && pageKey === 'theme') window.dispatchEvent(new CustomEvent('rt-theme-page', { detail: 'theme' }));
    } catch (e: any) { setStatusTone('error'); setStatus(e?.message || 'Could not save page theme.'); }
    finally { setSaving(false); }
  };
  const saveComponent = async () => {
    if(!componentForm) return;
    if(!token) { setStatusTone('error'); setStatus('Your admin session has expired. Sign in again before saving.'); return; }
    setSaving(true); setStatusTone('info'); setStatus('Saving component style to Supabase…');
    try {
      const patch = Object.fromEntries(componentEditableFields.filter(k => componentForm[k] !== undefined).map(k => [k, componentForm[k]]));
      const updated = await dbUpdate<ComponentRow>('theme_component_settings',`theme_component_id=eq.${componentForm.theme_component_id}`,patch,token);
      if(!Array.isArray(updated) || updated.length === 0) throw new Error("Supabase did not update a component row. Check this admin account's permissions.");
      const loaded = await reload();
      if(website === 'admin') {
        applyComponentStyles(loaded.components.filter(r => r.website_key === 'admin' && r.page_key === pageKey && r.is_active));
        window.dispatchEvent(new CustomEvent('rt-theme-page', { detail: pageKey }));
      }
      setStatusTone('success'); setStatus('Component style saved successfully to Supabase.');
    } catch (e: any) { setStatusTone('error'); setStatus(e?.message || 'Could not save component style.'); }
    finally { setSaving(false); }
  };
  const resetComponent = () => { if(!componentForm) return; setComponentForm({...componentForm,font_family:null,font_size:null,font_weight:null,line_height:null,letter_spacing:null,text_color:null,background_color:null,border_color:null,border_width:null,border_radius:null,box_shadow:null,padding:null,margin:null,width:null,max_width:null,text_align:null}); };

  if(!pages.length && !loadFailed) return <div className="p-8 rounded-2xl border bg-white">Loading database theme editor…</div>;
  if(!pages.length && loadFailed) return <div className="p-6 rounded-2xl border border-red-200 bg-red-50 text-red-800"><h2 className="font-black">Theme settings could not be loaded</h2><p className="mt-2 text-sm">{status}</p><button type="button" onClick={()=>{setLoadFailed(false);setStatus('');reload().catch(e=>{setLoadFailed(true);setStatusTone('error');setStatus(e.message||'Unable to load theme settings');});}} className="mt-4 rounded-xl bg-orange-400 px-4 py-2 font-bold text-black">Retry</button></div>;

  return <div className="space-y-6" data-rtc-component="property_editor">
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[.2em] text-red-700 dark:text-red-400 font-black"><Palette className="w-4 h-4"/> Database design control</div>
      <h1 className="text-3xl font-black mt-1">Theme & component editor</h1>
      <p className="text-sm opacity-70 mt-2 max-w-3xl">Choose the website, page, section and exact component. You will edit it using the same path an admin sees on the website — for example <b>Main / Portfolio / Home / About Us / Heading</b>.</p>
    </div>

    <div className="rounded-2xl border p-4 bg-white/70 dark:bg-stone-900/70" data-rtc-component="component_selector">
      <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
        <div className="text-[11px] uppercase tracking-widest text-red-700 dark:text-red-400 font-black">Website</div><select className="border rounded-xl px-3 py-2 bg-transparent" value={website} onChange={e=>{const next=e.target.value;setWebsite(next);setPageKey(next==='admin'?'operations':'home')}}>{Object.entries(pageLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
        <ChevronRight className="w-4 h-4 opacity-40"/>
        <div className="text-[11px] uppercase tracking-widest text-red-700 dark:text-red-400 font-black">Page</div><select className="border rounded-xl px-3 py-2 bg-transparent" value={pageKey} onChange={e=>setPageKey(e.target.value)}>{websitePages.map(p=><option key={p.page_key} value={p.page_key}>{p.page_name}</option>)}</select>
        <ChevronRight className="w-4 h-4 opacity-40"/>
        <div className="text-[11px] uppercase tracking-widest text-red-700 dark:text-red-400 font-black">Section</div><select className="border rounded-xl px-3 py-2 bg-transparent" value={sectionKey} onChange={e=>setSectionKey(e.target.value)}>{sections.map(s=><option key={s.key} value={s.key}>{pretty(s.name)}</option>)}</select>
        <ChevronRight className="w-4 h-4 opacity-40"/>
        <div className="text-[11px] uppercase tracking-widest text-red-700 dark:text-red-400 font-black">Component</div><select className="border rounded-xl px-3 py-2 bg-transparent" value={componentKey} onChange={e=>setComponentKey(e.target.value)}>{sectionComponents.map(c=><option key={c.component_key} value={c.component_key}>{c.component_name}</option>)}</select>
      </div>
      <div className="mt-3 text-xs text-stone-500">{pageLabels[website]} / {selectedPage?.page_name} / {pretty(sectionKey)} / <b>{componentForm?.component_name || 'Component'}</b></div>
    </div>

    {pageForm && <section className="rounded-2xl border p-5" data-rtc-component="page_selector">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-black">Page-wide theme</h2><p className="text-sm opacity-65">These values are saved directly to Supabase and applied to the selected website/page when it is opened. Background, surface, section and input colours are separate on purpose.</p></div><button type="button" onClick={savePage} disabled={saving} className="px-4 py-2.5 rounded-xl bg-orange-400 text-black font-bold flex items-center gap-2 disabled:opacity-60"><Save className="w-4 h-4"/>{saving?'Saving…':'Save page'}</button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {(['background_color','surface_color','surface_elevated_color','section_color','header_color','footer_color','text_color','muted_text_color','heading_color','primary_color','primary_dark_color','secondary_color','accent_color','link_color','button_background_color','button_text_color','border_color','border_strong_color','input_background_color','input_border_color','hero_background_color','banner_background_color','nav_background_color','nav_text_color'] as string[]).map(k=><label key={k} className="rounded-xl border p-3 bg-white/70"><span className="block text-xs font-bold mb-1 text-stone-800">{pretty(k)}</span>{paletteTextFields.has(k)?<select aria-label={`${pretty(k)} palette`} className="w-full border rounded-lg px-2 py-2 bg-white text-black" value={pageForm[k]??'#171717'} onChange={e=>setPageForm({...pageForm,[k]:e.target.value})}>{allowedTextColors.map(option=><option key={option.value} value={option.value}>{option.label} ({option.value})</option>)}</select>:<div className="flex gap-2"><input aria-label={`${pretty(k)} colour picker`} type="color" value={/^#[0-9a-f]{6}$/i.test(pageForm[k]||'')?pageForm[k]:'#ffffff'} onChange={e=>setPageForm({...pageForm,[k]:e.target.value})} className="w-10 h-10 p-0 border-0 bg-transparent"/><input aria-label={`${pretty(k)} hex value`} className="flex-1 min-w-0 border rounded-lg px-2 bg-white text-black" value={pageForm[k]??''} onChange={e=>setPageForm({...pageForm,[k]:e.target.value})}/></div>}</label>)}
      </div>
    </section>}

    {componentForm && <section className="rounded-2xl border p-5" data-rtc-component="property_editor">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"><div><div className="text-xs uppercase tracking-widest text-red-700 dark:text-red-400 font-black">Exact component</div><h2 className="text-2xl font-black mt-1">{componentForm.component_name}</h2><p className="text-sm opacity-65 mt-1">Component type: {componentForm.component_type}. Edit only this component without touching the rest of the page.</p></div><div className="flex gap-2"><button onClick={resetComponent} className="px-4 py-2.5 rounded-xl border font-bold flex items-center gap-2"><RotateCcw className="w-4 h-4"/>Reset fields</button><button type="button" onClick={saveComponent} disabled={saving} className="px-4 py-2.5 rounded-xl bg-orange-400 text-black font-bold flex items-center gap-2 disabled:opacity-60"><Save className="w-4 h-4"/>{saving?'Saving…':'Save component'}</button></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {valueFields.map(([key,label,type])=><label key={key} className="rounded-xl border p-3 bg-white/40 dark:bg-stone-950/30"><span className="block text-xs font-bold opacity-65 mb-1">{label}</span>{type==='palette'?<select className="w-full border rounded-lg px-2 py-2 bg-white text-black" value={componentForm[key]??''} onChange={e=>setComponentForm({...componentForm,[key]:e.target.value||null})}><option value="">Default</option>{allowedTextColors.map(option=><option key={option.value} value={option.value}>{option.label} ({option.value})</option>)}</select>:type==='color'?<div className="flex gap-2"><input type="color" value={/^#[0-9a-f]{6}$/i.test(componentForm[key]||'')?componentForm[key]:'#ffffff'} onChange={e=>setComponentForm({...componentForm,[key]:e.target.value})} className="w-10 h-10 p-0 border-0 bg-transparent"/><input className="flex-1 border rounded-lg px-2 bg-transparent" value={componentForm[key]??''} onChange={e=>setComponentForm({...componentForm,[key]:e.target.value})}/></div>:type==='select'?<select className="w-full border rounded-lg px-2 py-2 bg-transparent" value={componentForm[key]??''} onChange={e=>setComponentForm({...componentForm,[key]:e.target.value||null})}>{key==='font_weight' ? ['','400','500','600','700','800','900'].map(v=><option key={v} value={v}>{v||'Default'}</option>) : ['','left','center','right','justify'].map(v=><option key={v} value={v}>{v||'Default'}</option>)}</select>:<input className="w-full border rounded-lg px-2 py-2 bg-transparent" value={componentForm[key]??''} onChange={e=>setComponentForm({...componentForm,[key]:e.target.value||null})}/>}</label>)}
      </div>
      <label className="block mt-4 rounded-xl border p-3"><span className="block text-xs font-bold opacity-65 mb-1">Advanced component tokens (JSON)</span><textarea className="w-full min-h-28 border rounded-lg p-3 font-mono text-xs bg-transparent" value={JSON.stringify(componentForm.component_tokens||{},null,2)} onChange={e=>{try{setComponentForm({...componentForm,component_tokens:JSON.parse(e.target.value)})}catch{}}}/></label>
    </section>}

    <div className="rounded-2xl border p-5 bg-gradient-to-br from-red-50 to-amber-50 dark:from-stone-900 dark:to-stone-950" data-rtc-component="preview">
      <div className="flex items-center gap-2 font-black"><Eye className="w-4 h-4"/> How the admin sees the hierarchy</div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm"><span className="px-3 py-2 rounded-lg border">{pageLabels[website]}</span><ChevronRight className="self-center w-4 opacity-40"/><span className="px-3 py-2 rounded-lg border">{selectedPage?.page_name}</span><ChevronRight className="self-center w-4 opacity-40"/><span className="px-3 py-2 rounded-lg border">{pretty(sectionKey)}</span><ChevronRight className="self-center w-4 opacity-40"/><span className="px-3 py-2 rounded-lg bg-red-600 text-white font-bold">{componentForm?.component_name}</span></div>
      <p className="text-xs opacity-65 mt-3">Example: <b>Main / Portfolio → Home → About Us → Heading</b>. The same editor works for paragraph, card, button, banner, footer and other component levels.</p>
    </div>
    {status && <div role="status" aria-live="polite" className={`rounded-xl border px-4 py-3 text-sm font-semibold ${statusTone==='error'?'border-red-200 bg-red-50 text-red-800':statusTone==='success'?'border-orange-200 bg-orange-50 text-orange-900':'border-stone-200 bg-white text-stone-900'}`}>{status}</div>}
  </div>;
};
