import React, { useEffect, useState } from 'react';
import {
  Building2, Save, RefreshCw, Image as ImageIcon, CheckCircle2, AlertCircle,
  Phone, Mail, MapPin, Upload, Globe, FileJson, Eye
} from 'lucide-react';
import { dbSelect, dbUpdate, storageUploadOriginal } from '../lib/supabase';
import { useAdminAuth } from '../context/AdminAuthContext';

type CompanyRecord = Record<string, any> & { id?: string };
type JsonFieldKey = 'social_links' | 'contact_details' | 'business_hours' | 'policies' | 'seo_details' | 'extra_details';

const FIELDS = [
  ['company_name', 'Company Name'], ['legal_name', 'Legal Name'], ['tagline', 'Tagline'], ['description', 'Description'],
  ['vision', 'Vision'], ['aim', 'Aim'], ['mission', 'Mission'], ['logo_url', 'Logo URL'], ['favicon_url', 'Favicon URL'],
  ['website_url', 'Website URL'], ['email', 'Email'], ['support_email', 'Support Email'], ['mobile', 'Mobile'],
  ['alternate_mobile', 'Alternate Mobile'], ['whatsapp_number', 'WhatsApp Number'], ['landline', 'Landline'],
  ['physical_address', 'Physical Address'], ['address_line_2', 'Address Line 2'], ['landmark', 'Landmark'],
  ['city', 'City'], ['district', 'District'], ['state', 'State'], ['postal_code', 'Postal Code'], ['country', 'Country'],
  ['google_maps_url', 'Google Maps URL'], ['gst_number', 'GST Number'], ['pan_number', 'PAN Number'],
  ['business_registration_number', 'Business Registration Number'], ['established_year', 'Established Year']
] as const;

const JSON_FIELDS: { key: JsonFieldKey; label: string; hint: string }[] = [
  { key: 'social_links', label: 'Social Links', hint: 'Social profile URLs keyed by platform, e.g. { "instagram": "https://…" }.' },
  { key: 'contact_details', label: 'Additional Contact Details', hint: 'Extra phone numbers, departments, and contact labels.' },
  { key: 'business_hours', label: 'Business Hours', hint: 'Opening hours and working-day details.' },
  { key: 'policies', label: 'Company Policies', hint: 'Policy content used by website sections.' },
  { key: 'seo_details', label: 'SEO & Browser Metadata', hint: 'Search metadata such as title, description, and social sharing information.' },
  { key: 'extra_details', label: 'Additional Company Data', hint: 'Other structured company information saved in the company_profile row.' },
];

const prettyJson = (value: unknown) => JSON.stringify(value ?? {}, null, 2);

export const CompanySettingsScreen: React.FC = () => {
  const { session } = useAdminAuth();
  const [row, setRow] = useState<CompanyRecord>({});
  const [jsonDrafts, setJsonDrafts] = useState<Record<JsonFieldKey, string>>({
    social_links: '{}', contact_details: '{}', business_hours: '{}', policies: '{}', seo_details: '{}', extra_details: '{}'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'logo_url' | 'favicon_url' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError('');
    try {
      const rows = await dbSelect<CompanyRecord>(
        'company_profile',
        'select=*&is_active=eq.true&order=updated_at.desc&limit=1',
        session.access_token
      );
      const company = rows[0] || {};
      setRow(company);
      setJsonDrafts(Object.fromEntries(JSON_FIELDS.map(({ key }) => [key, prettyJson(company[key])])) as Record<JsonFieldKey, string>);
    } catch (e: any) {
      setError(e.message || 'Failed to load company profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [session?.access_token]);

  const uploadAsset = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'favicon_url') => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !session?.access_token) return;
    setMessage('');
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Please choose an image smaller than 10 MB.');
      return;
    }
    setUploading(field);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const folder = field === 'logo_url' ? 'logo' : 'favicon';
      const url = await storageUploadOriginal(
        file,
        'rtcrackers-images',
        `company/${folder}/${crypto.randomUUID()}-${safeName}`,
        session.access_token
      );
      setRow((current) => ({ ...current, [field]: url }));
      setMessage(`${field === 'logo_url' ? 'Company logo' : 'Favicon'} uploaded. Save Company Details to publish it.`);
    } catch (e: any) {
      setError(e.message || `Unable to upload ${field === 'logo_url' ? 'logo' : 'favicon'}.`);
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    if (!session?.access_token || !row.id) {
      setError('No active company profile row was found to update.');
      return;
    }
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const jsonValues: Partial<Record<JsonFieldKey, unknown>> = {};
      for (const { key, label } of JSON_FIELDS) {
        const raw = jsonDrafts[key].trim();
        try {
          const value = JSON.parse(raw || '{}');
          if (value === null || typeof value !== 'object') {
            throw new Error('Enter a JSON object or array.');
          }
          jsonValues[key] = value;
        } catch (e: any) {
          throw new Error(`${label} is not valid JSON: ${e.message || 'please check the syntax'}`);
        }
      }
      const payload = {
        ...row,
        ...jsonValues,
        updated_at: new Date().toISOString(),
        id: undefined,
        created_at: undefined,
      };
      const updated = await dbUpdate<CompanyRecord>('company_profile', `id=eq.${row.id}`, payload, session.access_token);
      if (!updated.length) throw new Error('Supabase did not return an updated company profile row. Check update permissions and row-level security.');
      setMessage('Company details saved. The admin branding and browser favicon will refresh automatically.');
      window.dispatchEvent(new CustomEvent('rt-company-profile-updated'));
      await load();
    } catch (e: any) {
      setError(e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-stone-400"><RefreshCw className="w-5 h-5 animate-spin mr-2" />Loading company profile…</div>;
  }

  const companyName = row.company_name || 'Company';
  const faviconUrl = row.favicon_url || row.logo_url;
  const inputClass = 'w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-xs focus:outline-none focus:border-red-500';
  const panelClass = 'p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm';

  return <div className="space-y-6" data-rtc-company-settings="true">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-red-700 dark:text-red-400 font-bold flex items-center gap-2"><Building2 className="w-4 h-4" /> Company Control</div>
        <h1 className="font-display text-3xl font-black text-stone-900 dark:text-white mt-1">Company Details</h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Edit the active company profile in Supabase. Name, tagline, logo and favicon are used by the admin website branding.</p>
      </div>
      <button onClick={save} disabled={saving || !row.id} className="px-5 py-3 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-red-950/10"><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Company Details'}</button>
    </div>

    {message && <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{message}</div>}
    {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      <section className={`xl:col-span-2 ${panelClass}`}>
        <h2 className="font-display font-black text-lg text-stone-900 dark:text-white mb-4">Company Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map(([key, label]) => {
            const isLong = ['description', 'vision', 'aim', 'mission', 'physical_address', 'address_line_2'].includes(key);
            return <label key={key} className={`block ${isLong ? 'md:col-span-2' : ''}`}>
              <span className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1.5">{label}</span>
              {isLong ?
                <textarea rows={key === 'description' ? 4 : 2} value={row[key] ?? ''} onChange={(e) => setRow((current) => ({ ...current, [key]: e.target.value }))} className={inputClass} /> :
                <input value={row[key] ?? ''} onChange={(e) => setRow((current) => ({ ...current, [key]: e.target.value }))} className={inputClass} />}
            </label>;
          })}
        </div>
      </section>

      <div className="space-y-5">
        <section className={panelClass}>
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-bold mb-4"><ImageIcon className="w-4 h-4" /> Brand Assets</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">Company Logo</div>
              <label className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-[11px] font-bold text-center cursor-pointer">{uploading === 'logo_url' ? 'Uploading…' : <><Upload className="w-3.5 h-3.5" /> Upload Logo</>}<input type="file" accept="image/*" onChange={(e) => void uploadAsset(e, 'logo_url')} disabled={uploading !== null} className="hidden" /></label>
              <div className="aspect-square mt-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center overflow-hidden">
                {row.logo_url ? <img src={row.logo_url} alt={`${companyName} logo`} className="w-full h-full object-contain" /> : <span className="text-[10px] text-stone-500">No logo uploaded</span>}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">Browser Favicon</div>
              <label className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-[11px] font-bold text-center cursor-pointer">{uploading === 'favicon_url' ? 'Uploading…' : <><Upload className="w-3.5 h-3.5" /> Upload Icon</>}<input type="file" accept="image/*,.ico,.svg" onChange={(e) => void uploadAsset(e, 'favicon_url')} disabled={uploading !== null} className="hidden" /></label>
              <div className="aspect-square mt-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center overflow-hidden p-4">
                {faviconUrl ? <img src={faviconUrl} alt={`${companyName} favicon preview`} className="w-full h-full object-contain" /> : <Globe className="w-8 h-8 text-stone-400" />}
              </div>
              <p className="text-[10px] text-stone-500 mt-2">If no favicon URL is set, the logo is used in the browser tab.</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-3">
            <div className="flex gap-2 items-center text-red-800 dark:text-red-300 font-bold text-xs"><Eye className="w-4 h-4" /> Branding preview</div>
            <div className="mt-2 text-sm font-black text-stone-900 dark:text-white">{companyName}</div>
            <div className="text-xs text-stone-600 dark:text-stone-400">{row.tagline || 'Company tagline'} · Admin Portal</div>
            <div className="text-[10px] text-stone-500 mt-1 break-all">Tab icon: {faviconUrl || 'No icon set'}</div>
          </div>
          <p className="text-[10px] text-stone-500 mt-3">Uploads preserve the original image bytes in Supabase Storage. A URL is saved in the company profile only when you save the full company details.</p>
        </section>

        <section className={panelClass}>
          <div className="font-bold text-stone-900 dark:text-white text-sm mb-3">Live Contact Preview</div>
          <div className="flex gap-2 text-stone-600 dark:text-stone-400 text-xs mb-2"><Phone className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0" />{row.whatsapp_number || row.mobile || 'Not set'}</div>
          <div className="flex gap-2 text-stone-600 dark:text-stone-400 text-xs mb-2"><Mail className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0" />{row.support_email || row.email || 'Not set'}</div>
          <div className="flex gap-2 text-stone-600 dark:text-stone-400 text-xs"><MapPin className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0" /><span>{[row.physical_address, row.city, row.state, row.postal_code].filter(Boolean).join(', ') || 'Not set'}</span></div>
        </section>
      </div>
    </div>

    <section className={panelClass}>
      <div className="flex items-center gap-2 mb-2"><FileJson className="w-4 h-4 text-red-700 dark:text-red-400" /><h2 className="font-display font-black text-lg text-stone-900 dark:text-white">Additional Company Data</h2></div>
      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">These editable JSON fields map directly to the existing JSONB columns in <code>company_profile</code>. Use valid JSON; your changes are checked before saving.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {JSON_FIELDS.map(({ key, label, hint }) => <label key={key} className="block">
          <span className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">{label}</span>
          <span className="block text-[10px] text-stone-500 mb-2">{hint}</span>
          <textarea rows={5} spellCheck={false} value={jsonDrafts[key]} onChange={(e) => setJsonDrafts((current) => ({ ...current, [key]: e.target.value }))} className={`${inputClass} font-mono leading-relaxed`} />
        </label>)}
      </div>
      <div className="flex justify-end mt-5"><button onClick={save} disabled={saving || !row.id} className="px-5 py-3 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Company & Metadata'}</button></div>
    </section>
  </div>;
};
