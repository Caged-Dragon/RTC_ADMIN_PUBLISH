import React, { useMemo, useState } from 'react';
import { Image as ImageIcon, Layers, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';

export const CategoryManagementScreen: React.FC = () => {
  const { categories, isLoading, createCategory, updateCategory, deactivateCategory, uploadCategoryImage } = useCategories();
  const [selectedId, setSelectedId] = useState<string>('new');
  const selected = useMemo(() => categories.find(c => c.category_id === selectedId) || null, [categories, selectedId]);
  const [form, setForm] = useState<any>({ category_name: '', slug: '', description: '', details: '', image_url: '', alt_text: '', display_order: 0, is_active: true });
  const [notice, setNotice] = useState('');

  React.useEffect(() => {
    if (selected) setForm({ ...selected });
    else if (selectedId === 'new') setForm({ category_name: '', slug: '', description: '', details: '', image_url: '', alt_text: '', display_order: categories.length + 1, is_active: true });
  }, [selected, selectedId, categories.length]);

  const save = async () => {
    try {
      if (!form.category_name.trim()) throw new Error('Category name is required.');
      if (selected) await updateCategory(selected.category_id, form);
      else await createCategory(form);
      setNotice('Category saved to Supabase.');
      setSelectedId('new');
    } catch (e: any) { setNotice(e.message || 'Unable to save category.'); }
  };

  const upload = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadCategoryImage(file, selected?.category_id);
      setForm((p: any) => ({ ...p, image_url: url }));
      setNotice(`Original image uploaded: ${file.name}`);
    } catch (e: any) { setNotice(e.message || 'Image upload failed.'); }
  };

  const deactivate = async () => {
    if (!selected) return;
    if (!window.confirm(`Deactivate "${selected.category_name}"? Existing products stay safe in the database.`)) return;
    try { await deactivateCategory(selected.category_id); setSelectedId('new'); setNotice('Category deactivated.'); }
    catch (e: any) { setNotice(e.message || 'Unable to deactivate category.'); }
  };

  const selectCategory = (id: string) => setSelectedId(id);
  const active = categories.filter(c => c.is_active);

  return <div className="space-y-6" data-rtc-component="category_management">
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div><div className="text-xs uppercase tracking-[.2em] text-purple-600 font-black flex items-center gap-2"><Layers className="w-4 h-4"/> Catalogue structure</div><h1 className="text-3xl font-black mt-1">Category Manager</h1><p className="text-sm opacity-70 mt-2 max-w-3xl">Change the category name, description, detailed information, image, alt text and order. Renaming a category automatically updates the products linked to it.</p></div>
      <button className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold flex items-center gap-2" onClick={() => selectCategory('new')}><Plus className="w-4 h-4"/>New category</button>
    </div>

    <div className="grid lg:grid-cols-[330px_1fr] gap-5">
      <aside className="rounded-2xl border p-3 bg-white/60 dark:bg-stone-900/60">
        <div className="px-3 py-2 text-xs uppercase tracking-widest font-black opacity-60">Active categories ({active.length})</div>
        <div className="max-h-[620px] overflow-auto space-y-1">
          {categories.map(c => <button key={c.category_id} onClick={() => selectCategory(c.category_id)} className={`w-full text-left rounded-xl px-3 py-3 border ${selectedId===c.category_id?'bg-red-600 text-white border-red-600':'hover:bg-red-50 dark:hover:bg-stone-800'}`}><div className="font-bold text-sm">{c.category_name}</div><div className="text-[11px] opacity-70 mt-1">{c.is_active?'Active':'Inactive'} • order {c.display_order}</div></button>)}
        </div>
      </aside>

      <section className="rounded-2xl border p-5 bg-white/60 dark:bg-stone-900/60">
        <div className="flex items-center justify-between gap-3"><div><div className="text-xs uppercase tracking-widest text-purple-600 font-black">{selected?'Edit category':'Create category'}</div><h2 className="text-2xl font-black mt-1">{selected?.category_name || 'New category'}</h2></div>{selected && <button onClick={deactivate} className="px-3 py-2 rounded-lg border border-red-300 text-red-600 font-bold flex items-center gap-2"><Trash2 className="w-4 h-4"/>Deactivate</button>}</div>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <label><span className="block text-xs font-bold opacity-65 mb-1">Category name</span><input className="w-full border rounded-xl px-3 py-2.5 bg-transparent" value={form.category_name||''} onChange={e=>setForm({...form,category_name:e.target.value})}/></label>
          <label><span className="block text-xs font-bold opacity-65 mb-1">Slug</span><input className="w-full border rounded-xl px-3 py-2.5 bg-transparent" value={form.slug||''} onChange={e=>setForm({...form,slug:e.target.value})}/></label>
          <label className="md:col-span-2"><span className="block text-xs font-bold opacity-65 mb-1">Short description</span><textarea className="w-full border rounded-xl px-3 py-2.5 bg-transparent min-h-24" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></label>
          <label className="md:col-span-2"><span className="block text-xs font-bold opacity-65 mb-1">Category details</span><textarea className="w-full border rounded-xl px-3 py-2.5 bg-transparent min-h-28" value={form.details||''} onChange={e=>setForm({...form,details:e.target.value})}/></label>
          <label><span className="block text-xs font-bold opacity-65 mb-1">Image URL</span><input className="w-full border rounded-xl px-3 py-2.5 bg-transparent" value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})}/></label>
          <label><span className="block text-xs font-bold opacity-65 mb-1">Alt text</span><input className="w-full border rounded-xl px-3 py-2.5 bg-transparent" value={form.alt_text||''} onChange={e=>setForm({...form,alt_text:e.target.value})}/></label>
          <label><span className="block text-xs font-bold opacity-65 mb-1">Display order</span><input type="number" className="w-full border rounded-xl px-3 py-2.5 bg-transparent" value={form.display_order ?? 0} onChange={e=>setForm({...form,display_order:Number(e.target.value)})}/></label>
          <label><span className="block text-xs font-bold opacity-65 mb-1">Status</span><select className="w-full border rounded-xl px-3 py-2.5 bg-transparent" value={String(form.is_active!==false)} onChange={e=>setForm({...form,is_active:e.target.value==='true'})}><option value="true">Active</option><option value="false">Inactive</option></select></label>
        </div>
        <div className="mt-5 rounded-2xl border p-4 flex flex-col md:flex-row gap-4 items-center"><div className="w-36 h-24 rounded-xl overflow-hidden border bg-red-50 dark:bg-stone-950 flex items-center justify-center">{form.image_url?<img src={form.image_url} alt={form.alt_text||form.category_name} className="w-full h-full object-cover"/>:<ImageIcon className="w-8 h-8 opacity-30"/>}</div><div className="flex-1"><div className="font-black">Original category image</div><p className="text-xs opacity-65 mt-1">Upload keeps the original file. The database stores the resulting Storage URL.</p></div><label className="px-4 py-2.5 rounded-xl border font-bold cursor-pointer flex items-center gap-2"><Upload className="w-4 h-4"/>Upload image<input type="file" accept="image/*" className="hidden" onChange={e=>upload(e.target.files?.[0])}/></label></div>
        <div className="mt-5 flex justify-end"><button onClick={save} className="px-5 py-3 rounded-xl bg-red-600 text-white font-black flex items-center gap-2"><Save className="w-4 h-4"/>Save category</button></div>
        {isLoading && <div className="text-sm opacity-60 mt-3">Loading categories…</div>}
        {notice && <div className="text-sm font-semibold text-emerald-600 mt-3">{notice}</div>}
      </section>
    </div>
  </div>;
};
