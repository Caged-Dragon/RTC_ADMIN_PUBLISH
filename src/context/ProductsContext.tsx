import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product } from '../data/products';
import { dbDelete, dbInsert, dbSelectAll, dbUpdate, storageUploadOriginal } from '../lib/supabase';
import { useAdminAuthOptional } from './AdminAuthContext';

export type DbProduct = Product & { dbId: string; categoryId?: string; skuCode?: string; factoryRate?: number; mrpRate?: number; availableQuantity?: number; isBestseller?: boolean; isFeatured?: boolean; isGreenCracker?: boolean };
interface ProductsContextType {
  products: DbProduct[];
  isLoading: boolean;
  insertProduct: (product: Partial<DbProduct>) => Promise<void>;
  updateProduct: (product: number | DbProduct, patch?: Partial<DbProduct>) => Promise<void>;
  uploadProductImage: (file: File, productId?: number | string) => Promise<string>;
  deleteProduct: (product: number | DbProduct) => Promise<void>;
  refreshProducts: () => Promise<void>;
}
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function mapProduct(row: any): DbProduct {
  return {
    id: Number(row.product_code ?? row.s_no), dbId: String(row.id), categoryId: row.category_id || undefined, skuCode: row.sku_code || undefined, sNo: Number(row.s_no ?? row.product_code), name: row.name,
    category: row.category, unit: row.pack_type, rate: Number(row.factory_rate ?? row.rate ?? 0),
    description: row.description || '', pieces: row.pieces_per_pack ? String(row.pieces_per_pack) : undefined,
    imageUrl: row.image_url || row.product_image || undefined, stockStatus: row.stock_status,
    popular: !!row.is_bestseller, featured: !!row.is_featured, factoryRate: Number(row.factory_rate ?? row.rate ?? 0),
    mrpRate: Number(row.mrp_rate ?? row.rate ?? 0), availableQuantity: Number(row.available_quantity ?? 0),
    isBestseller: !!row.is_bestseller, isFeatured: !!row.is_featured, isGreenCracker: !!row.is_green_cracker,
  };
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminAuth = useAdminAuthOptional();
  const adminToken = adminAuth?.session?.access_token;
  const isAdmin = !!adminAuth?.admin && !!adminToken;
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = isAdmin ? 'select=*&order=s_no.asc' : 'select=*&is_active=eq.true&order=s_no.asc';
      const rows = await dbSelectAll<any>('products', query, adminToken);
      setProducts(rows.map(mapProduct));
    } catch (e) { console.error('Failed to load products from Supabase', e); /* keep the last good list instead of showing an empty catalog */ }
    finally { setIsLoading(false); }
  }, [isAdmin, adminToken]);

  useEffect(() => { refreshProducts(); }, [refreshProducts]);

  const insertProduct = async (p: Partial<DbProduct>) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    const sNo = Number(p.sNo ?? p.id ?? 0);
    if (!Number.isInteger(sNo) || sNo <= 0) throw new Error('S.No must be a positive whole number.');
    if (!p.name?.trim()) throw new Error('Product name is required.');
    const rate = Number(p.rate ?? p.factoryRate ?? 0);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('Product rate must be greater than zero.');
    const inserted = await dbInsert<any>('products', {
      product_code: sNo, s_no: sNo, sku_code: p.skuCode?.trim() || `RT-${String(sNo).padStart(3,'0')}`,
      name: p.name.trim(), category: p.category, category_id: p.categoryId || null, pack_type: p.unit || 'Box', rate,
      factory_rate: Number(p.factoryRate ?? rate), mrp_rate: Number(p.mrpRate ?? rate),
      description: p.description?.trim() || null, pieces_per_pack: p.pieces ? (parseInt(String(p.pieces), 10) || null) : null,
      stock_status: p.stockStatus || 'IN_STOCK', available_quantity: Number(p.availableQuantity ?? 0),
      image_url: p.imageUrl || null, is_bestseller: !!(p.isBestseller ?? p.popular), is_featured: !!(p.isFeatured ?? p.featured),
      is_green_cracker: !!p.isGreenCracker, is_active: true
    }, adminToken);
    if (!inserted?.length) throw new Error('Supabase did not confirm the product was inserted. Check table permissions and required columns.');
    await refreshProducts();
  };

  const updateProduct = async (input: number | DbProduct, patch?: Partial<DbProduct>) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    const existing = typeof input === 'number' ? products.find(p => p.id === input) : input;
    if (!existing) throw new Error('Product not found.');
    const delta = patch || {};
    const p = { ...existing, ...delta };
    const rate = Number(p.rate ?? p.factoryRate ?? 0);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('Product rate must be greater than zero.');
    const body: Record<string, any> = {
      product_code: Number(p.sNo), s_no: Number(p.sNo), sku_code: p.skuCode?.trim() || `RT-${String(p.sNo).padStart(3,'0')}`,
      name: p.name?.trim(), category: p.category, category_id: p.categoryId || null, pack_type: p.unit || 'Box',
      rate, factory_rate: Number(delta.rate !== undefined && delta.factoryRate === undefined ? delta.rate : (p.factoryRate ?? rate)),
      mrp_rate: Number(p.mrpRate ?? rate), description: p.description?.trim() || null,
      pieces_per_pack: p.pieces ? (parseInt(String(p.pieces), 10) || null) : null,
      stock_status: p.stockStatus || 'IN_STOCK', available_quantity: Number(p.availableQuantity ?? 0),
      image_url: p.imageUrl || null, is_bestseller: !!(p.isBestseller ?? p.popular), is_featured: !!(p.isFeatured ?? p.featured),
      is_green_cracker: !!p.isGreenCracker, updated_at: new Date().toISOString()
    };
    if (!p.name?.trim()) throw new Error('Product name is required.');
    const updated = await dbUpdate<any>('products', `id=eq.${encodeURIComponent(existing.dbId)}`, body, adminToken);
    if (!updated?.length) throw new Error('Supabase matched no product rows. The product may have been deleted, or your admin role may lack SELECT/UPDATE permission.');
    await refreshProducts();
  };

  const deleteProduct = async (input: number | DbProduct) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    const existing = typeof input === 'number' ? products.find(p => p.id === input) : input;
    if (!existing) throw new Error('Product not found.');
    const deleted = await dbUpdate<any>('products', `id=eq.${encodeURIComponent(existing.dbId)}`, { is_active: false, updated_at: new Date().toISOString() }, adminToken);
    if (!deleted?.length) throw new Error('Supabase matched no product rows. Check the product ID and admin permissions.');
    await refreshProducts();
  };

  const uploadProductImage = async (file: File, productId?: number | string) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `products/${productId || 'new'}/${crypto.randomUUID()}-${safeName}`;
    return storageUploadOriginal(file, 'rtcrackers-images', key, adminToken);
  };


  return <ProductsContext.Provider value={{ products, isLoading, refreshProducts, insertProduct, updateProduct, deleteProduct, uploadProductImage }}>{children}</ProductsContext.Provider>;
};
export const useProducts = () => { const c = useContext(ProductsContext); if (!c) throw new Error('useProducts must be used within ProductsProvider'); return c; };
