import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { dbInsert, dbSelect, dbUpdate, getSession, storageUploadOriginal } from '../lib/supabase';

export type AdminCategory = {
  category_id: string;
  category_key: string;
  category_name: string;
  slug: string;
  description: string | null;
  details: string | null;
  image_url: string | null;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
};

type CategoriesContextValue = {
  categories: AdminCategory[];
  isLoading: boolean;
  refreshCategories: () => Promise<void>;
  createCategory: (input: Partial<AdminCategory>) => Promise<void>;
  updateCategory: (id: string, input: Partial<AdminCategory>) => Promise<void>;
  deactivateCategory: (id: string) => Promise<void>;
  uploadCategoryImage: (file: File, categoryId?: string) => Promise<string>;
};

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const sessionToken = () => getSession()?.access_token;

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = sessionToken();
      const rows = await dbSelect<AdminCategory>('product_categories', 'select=*&order=display_order.asc,category_name.asc', token);
      setCategories(rows);
    } catch (e) {
      console.error('Failed to load categories from Supabase', e);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshCategories(); }, [refreshCategories]);

  const createCategory = async (input: Partial<AdminCategory>) => {
    const token = sessionToken();
    if (!token) throw new Error('Admin authorization required.');
    const name = String(input.category_name || '').trim();
    if (!name) throw new Error('Category name is required.');
    const slug = slugify(String(input.slug || name));
    if (!slug) throw new Error('Please provide a valid category name.');
    await dbInsert('product_categories', {
      category_key: slug,
      category_name: name,
      slug,
      description: input.description || null,
      details: input.details || null,
      image_url: input.image_url || null,
      alt_text: input.alt_text || name,
      display_order: Number(input.display_order || 0),
      is_active: input.is_active !== false,
    }, token);
    await refreshCategories();
  };

  const updateCategory = async (id: string, input: Partial<AdminCategory>) => {
    const token = sessionToken();
    if (!token) throw new Error('Admin authorization required.');
    const name = String(input.category_name || '').trim();
    if (!name) throw new Error('Category name is required.');
    const slug = slugify(String(input.slug || name));
    await dbUpdate('product_categories', `category_id=eq.${encodeURIComponent(id)}`, {
      category_key: slug,
      category_name: name,
      slug,
      description: input.description || null,
      details: input.details || null,
      image_url: input.image_url || null,
      alt_text: input.alt_text || name,
      display_order: Number(input.display_order || 0),
      is_active: input.is_active !== false,
      updated_at: new Date().toISOString(),
    }, token);
    await refreshCategories();
  };

  const deactivateCategory = async (id: string) => {
    const token = sessionToken();
    if (!token) throw new Error('Admin authorization required.');
    await dbUpdate('product_categories', `category_id=eq.${encodeURIComponent(id)}`, { is_active: false, updated_at: new Date().toISOString() }, token);
    await refreshCategories();
  };

  const uploadCategoryImage = async (file: File, categoryId?: string) => {
    const token = sessionToken();
    if (!token) throw new Error('Admin authorization required.');
    if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    return storageUploadOriginal(file, 'rtcrackers-images', `categories/${categoryId || 'new'}/${crypto.randomUUID()}-${safe}`, token);
  };

  return <CategoriesContext.Provider value={{ categories, isLoading, refreshCategories, createCategory, updateCategory, deactivateCategory, uploadCategoryImage }}>{children}</CategoriesContext.Provider>;
};

export const useCategories = () => {
  const value = useContext(CategoriesContext);
  if (!value) throw new Error('useCategories must be used inside CategoriesProvider');
  return value;
};
