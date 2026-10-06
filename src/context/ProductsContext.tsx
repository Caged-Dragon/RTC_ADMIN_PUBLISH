import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product } from '../data/products';
import { dbDelete, dbInsert, dbSelect, dbUpdate, storageUploadOriginal } from '../lib/supabase';
import { useAdminAuthOptional } from './AdminAuthContext';

export type DbProduct = Product & { dbId: string; skuCode?: string; factoryRate?: number; mrpRate?: number; availableQuantity?: number; isBestseller?: boolean; isFeatured?: boolean; isGreenCracker?: boolean };
interface ProductsContextType {
  products: DbProduct[];
  isLoading: boolean;
  insertProduct: (product: Partial<DbProduct>) => Promise<void>;
  updateProduct: (product: number | DbProduct, patch?: Partial<DbProduct>) => Promise<void>;
  uploadProductImage: (file: File, productId?: number | string) => Promise<string>;
  deleteProduct: (product: number | DbProduct) => Promise<void>;
  resetCatalog: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function mapProduct(row: any): DbProduct {
  return {
    id: Number(row.product_code), dbId: row.id, sNo: Number(row.s_no ?? row.product_code), name: row.name,
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
      const rows = await dbSelect<any>('products', query, adminToken);
      setProducts(rows.map(mapProduct));
    } catch (e) { console.error('Failed to load products from Supabase', e); setProducts([]); }
    finally { setIsLoading(false); }
  }, [isAdmin, adminToken]);

  useEffect(() => { refreshProducts(); }, [refreshProducts]);

  const insertProduct = async (p: Partial<DbProduct>) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    const sNo = Number(p.sNo || p.id || 0);
    if (!sNo) throw new Error('S.No is required.');
    await dbInsert('products', {
      product_code: sNo, s_no: sNo, sku_code: `RT-${String(sNo).padStart(3,'0')}`,
      name: p.name, category: p.category, pack_type: p.unit || 'Box', rate: Number(p.rate || 0),
      factory_rate: Number(p.factoryRate ?? p.rate ?? 0), mrp_rate: Number(p.mrpRate ?? p.rate ?? 0),
      description: p.description || null, pieces_per_pack: p.pieces ? parseInt(String(p.pieces), 10) || null : null,
      stock_status: p.stockStatus || 'IN_STOCK', available_quantity: Number(p.availableQuantity || 0),
      image_url: p.imageUrl || null, is_bestseller: !!p.popular, is_featured: !!p.featured,
      is_green_cracker: !!p.isGreenCracker, is_active: true
    }, adminToken);
    await refreshProducts();
  };

  const updateProduct = async (input: number | DbProduct, patch?: Partial<DbProduct>) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    const existing = typeof input === 'number' ? products.find(p => p.id === input) : input;
    if (!existing) throw new Error('Product not found.');
    const p = { ...existing, ...(patch || {}) };
    await dbUpdate('products', `id=eq.${existing.dbId}`, {
      product_code: Number(p.sNo), s_no: Number(p.sNo), name: p.name, category: p.category, pack_type: p.unit,
      rate: Number(p.rate), factory_rate: Number(p.factoryRate ?? p.rate), mrp_rate: Number(p.mrpRate ?? p.rate),
      description: p.description || null, pieces_per_pack: p.pieces ? parseInt(String(p.pieces), 10) || null : null,
      stock_status: p.stockStatus || 'IN_STOCK', available_quantity: Number(p.availableQuantity || 0),
      image_url: p.imageUrl || null, is_bestseller: !!p.popular, is_featured: !!p.featured,
      is_green_cracker: !!p.isGreenCracker, updated_at: new Date().toISOString()
    }, adminToken);
    await refreshProducts();
  };

  const deleteProduct = async (input: number | DbProduct) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    const existing = typeof input === 'number' ? products.find(p => p.id === input) : input;
    if (!existing) throw new Error('Product not found.');
    await dbUpdate('products', `id=eq.${existing.dbId}`, { is_active: false, updated_at: new Date().toISOString() }, adminToken);
    await refreshProducts();
  };

  const uploadProductImage = async (file: File, productId?: number | string) => {
    if (!isAdmin || !adminToken) throw new Error('Admin authorization required.');
    if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `products/${productId || 'new'}/${crypto.randomUUID()}-${safeName}`;
    return storageUploadOriginal(file, 'rtcrackers-images', key, adminToken);
  };

  const resetCatalog = async () => { throw new Error('Catalog reset is intentionally disabled. Use individual product changes to protect the live database.'); };

  return <ProductsContext.Provider value={{ products, isLoading, refreshProducts, insertProduct, updateProduct, deleteProduct, uploadProductImage, resetCatalog }}>{children}</ProductsContext.Provider>;
};
export const useProducts = () => { const c = useContext(ProductsContext); if (!c) throw new Error('useProducts must be used within ProductsProvider'); return c; };
