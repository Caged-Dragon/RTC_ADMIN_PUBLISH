import React, { createContext, useContext, useEffect, useState } from 'react';
import { dbSelect } from '../lib/supabase';
import { STORE_INFO as FALLBACK_INFO, StoreInfo } from '../data/products';

interface StoreContextValue { storeInfo: StoreInfo; loading: boolean; }
const StoreContext = createContext<StoreContextValue>({ storeInfo: FALLBACK_INFO, loading: true });

function updateHeadElement(selector: string, tagName: string, attributes: Record<string, string>, content?: string) {
  let element = document.head.querySelector(selector) as HTMLElement | null;
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
  if (content !== undefined) element.textContent = content;
  return element;
}

function applyCompanyMetadata(row: Record<string, any>) {
  const companyName = String(row.company_name || FALLBACK_INFO.name || 'Admin Portal').trim();
  const tagline = String(row.tagline || FALLBACK_INFO.tagline || '').trim();
  const logoUrl = String(row.logo_url || '').trim();
  const faviconUrl = String(row.favicon_url || logoUrl || '').trim();
  const seo = row.seo_details && typeof row.seo_details === 'object' ? row.seo_details : {};
  const description = String(seo.meta_description || seo.description || row.description || tagline || `${companyName} administration portal`).trim();
  const configuredTitle = String(seo.admin_title || seo.title || '').trim();

  document.title = configuredTitle ? `${configuredTitle} | Admin Portal` : `${companyName} | Admin Portal`;
  updateHeadElement('meta[name="description"]', 'meta', { name: 'description', content: description });
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--rtc-primary').trim() || '#c62828';
  updateHeadElement('meta[name="theme-color"]', 'meta', { name: 'theme-color', content: primaryColor });
  if (faviconUrl) {
    const extension = faviconUrl.split('?')[0].split('.').pop()?.toLowerCase();
    const mime = extension === 'svg' ? 'image/svg+xml' : extension === 'png' ? 'image/png' : extension === 'ico' ? 'image/x-icon' : extension === 'webp' ? 'image/webp' : extension === 'jpeg' || extension === 'jpg' ? 'image/jpeg' : '';
    const icon = updateHeadElement('link[rel="icon"]', 'link', { rel: 'icon', href: faviconUrl, ...(mime ? { type: mime } : {}) });
    if (!mime) icon.removeAttribute('type');
    updateHeadElement('link[rel="apple-touch-icon"]', 'link', { rel: 'apple-touch-icon', href: faviconUrl });
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(FALLBACK_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadCompanyProfile = async () => {
      try {
        const rows = await dbSelect<any>(
          'company_profile',
          'select=company_name,legal_name,tagline,description,physical_address,city,state,postal_code,country,mobile,alternate_mobile,whatsapp_number,logo_url,favicon_url,website_url,email,support_email,seo_details&is_active=eq.true&order=updated_at.desc&limit=1'
        );
        if (cancelled) return;
        const row = rows[0];
        if (row) {
          const phone = row.whatsapp_number || row.mobile || FALLBACK_INFO.phoneDisplay;
          setStoreInfo({
            ...FALLBACK_INFO,
            name: row.company_name || FALLBACK_INFO.name,
            brandCode: row.legal_name || FALLBACK_INFO.brandCode,
            legalName: row.legal_name || undefined,
            websiteUrl: row.website_url || undefined,
            tagline: row.tagline || FALLBACK_INFO.tagline,
            phone: String(phone).replace(/^\+/, ''),
            phoneDisplay: phone,
            address: row.physical_address || FALLBACK_INFO.address,
            city: row.city || FALLBACK_INFO.city,
            state: row.state || FALLBACK_INFO.state,
            pincode: row.postal_code || FALLBACK_INFO.pincode,
            logoUrl: row.logo_url || undefined,
            faviconUrl: row.favicon_url || row.logo_url || undefined,
          });
          applyCompanyMetadata(row);
        }
      } catch (error) {
        // Retain the local brand defaults if the public company profile is unavailable.
        console.warn('Unable to load the active company profile for branding.', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadCompanyProfile();
    const onCompanyProfileUpdated = () => { void loadCompanyProfile(); };
    window.addEventListener('rt-company-profile-updated', onCompanyProfileUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener('rt-company-profile-updated', onCompanyProfileUpdated);
    };
  }, []);

  return <StoreContext.Provider value={{ storeInfo, loading }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
