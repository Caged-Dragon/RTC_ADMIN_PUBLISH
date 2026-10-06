import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Box,
  Layers,
  Save,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Product, CATEGORIES } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import { ScreenId } from '../components/Navbar';

interface AdminManagerScreenProps {
  onNavigateToCustomerSite: (screen: ScreenId) => void;
}

export const AdminManagerScreen: React.FC<AdminManagerScreenProps> = ({
  onNavigateToCustomerSite,
}) => {
  const { products, insertProduct, updateProduct, deleteProduct, resetCatalog, isLoading } = useProducts();
  const { categories } = useCategories();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  // Insert/Edit Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    sNo: '',
    name: '',
    category: 'Colourful Sparklers',
    unit: 'Box' as 'Box' | 'Pkt' | 'Tube',
    rate: '',
    pieces: '',
    description: '',
    popular: false,
    featured: false,
  });

  // Delete confirmation
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Bulk Price Adjuster
  const [bulkPercent, setBulkPercent] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCat !== 'All' && p.category !== selectedCat) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSNo = p.sNo.toString() === q || `#${p.sNo}` === q;
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchSNo && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => a.sNo - b.sNo);
  }, [products, selectedCat, search]);

  const handleOpenInsert = () => {
    const nextSNo = products.length > 0 ? Math.max(...products.map((p) => p.sNo)) + 1 : 1;
    setEditingProduct(null);
    setFormData({
      sNo: nextSNo.toString(),
      name: '',
      category: 'Colourful Sparklers',
      unit: 'Box',
      rate: '',
      pieces: '',
      description: '',
      popular: false,
      featured: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      sNo: p.sNo.toString(),
      name: p.name,
      category: p.category,
      unit: p.unit,
      rate: p.rate.toString(),
      pieces: p.pieces || '',
      description: p.description,
      popular: !!p.popular,
      featured: !!p.featured,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(formData.rate);
    if (!formData.name.trim() || isNaN(rateNum) || rateNum <= 0) {
      alert('Please provide a valid name and price rate greater than 0.');
      return;
    }

    if (editingProduct) {
      // Update
      await updateProduct(editingProduct.id, {
        sNo: parseInt(formData.sNo, 10) || editingProduct.sNo,
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit,
        rate: Math.round(rateNum),
        pieces: formData.pieces.trim() || undefined,
        description: formData.description.trim() || editingProduct.description,
        popular: formData.popular,
        featured: formData.featured,
      });
      showNotice(`Updated details for "${formData.name}" (S.No #${formData.sNo})`);
    } else {
      // Insert
      const newSNo = parseInt(formData.sNo, 10) || (products.length + 1);
      await insertProduct({
        sNo: newSNo,
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit,
        rate: Math.round(rateNum),
        pieces: formData.pieces.trim() || undefined,
        description: formData.description.trim() || 'Sivakasi festive firework item',
        popular: formData.popular,
        featured: formData.featured,
      });
      showNotice(`Successfully added "${formData.name}" to catalog!`);
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    showNotice(`Deleted product #${deletingProduct.sNo} "${deletingProduct.name}".`);
    setDeletingProduct(null);
  };

  const handleApplyBulkPercentage = async () => {
    const pct = parseFloat(bulkPercent);
    if (isNaN(pct) || pct === 0) {
      alert('Enter a valid percentage (e.g. +10 for +10% or -5 for 5% discount)');
      return;
    }

    const factor = 1 + pct / 100;
    for (const p of products) {
      const newRate = Math.max(1, Math.round(p.rate * factor));
      if (newRate !== p.rate) {
        await updateProduct(p.id, { rate: newRate });
      }
    }
    showNotice(`Applied ${pct > 0 ? `+${pct}%` : `${pct}%`} price adjustment to all ${products.length} products.`);
    setBulkPercent('');
  };

  const handleResetCatalog = async () => {
    if (window.confirm('Reset catalog back to the original 127 products from the 2026 PDF catalog?')) {
      await resetCatalog();
      showNotice('Catalog restored to original 127 items from 2026 PDF list.');
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner: Parallel Site Title & Mode Switcher */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 border border-stone-800 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 text-amber-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Parallel Admin Website • Catalog Manager</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
            RedThunder Product Management Desk
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Directly insert new crackers, update rates and descriptions, or delete items. All updates sync instantly with the customer storefront and cart!
          </p>
        </div>

        <button
          onClick={() => onNavigateToCustomerSite('products')}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <span>View Live Customer Storefront</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-200 flex items-center gap-2.5 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Admin Metrics & Quick Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Total Active Products</span>
          <div className="font-display text-2xl font-black text-white dark:text-white light:text-stone-900 mt-0.5 tabular-nums">
            {products.length} Items
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Live in Customer Storefront</span>
        </div>

        <div className="p-4 rounded-xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Lowest Price Item</span>
          <div className="font-display text-2xl font-black text-amber-400 mt-0.5 tabular-nums">
            ₹{products.length > 0 ? Math.min(...products.map((p) => p.rate)) : 0}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Highest: ₹{products.length > 0 ? Math.max(...products.map((p) => p.rate)) : 0}</span>
        </div>

        {/* Bulk Percentage Modifier */}
        <div className="sm:col-span-2 p-4 rounded-xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Bulk Price Adjustment (+/- %)</span>
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder="e.g. 5 for +5%, -10 for -10%"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-800 dark:border-stone-800 light:border-stone-300 text-white dark:text-white light:text-stone-900"
            />
            <button
              onClick={handleApplyBulkPercentage}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Apply All
            </button>
          </div>
        </div>

      </div>

      {/* Control Actions & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Add New Button */}
          <button
            onClick={handleOpenInsert}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Insert New Product</span>
          </button>

          {/* Reset Catalog Button */}
          <button
            onClick={handleResetCatalog}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-300 dark:text-stone-300 light:text-stone-700 border border-stone-700 dark:border-stone-700 light:border-stone-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset catalog back to initial 127 items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore 127 PDF Items</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by S.No or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 text-xs text-white dark:text-white light:text-stone-900 w-full sm:w-56"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="py-2 px-3 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 text-xs text-stone-200 dark:text-stone-200 light:text-stone-800 cursor-pointer"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.filter((c) => c.is_active).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Main Products Management Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-stone-800 dark:border-stone-800 light:border-stone-200 bg-stone-900/90 dark:bg-stone-900/90 light:bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-950 dark:bg-stone-950 light:bg-stone-100 border-b border-stone-800 dark:border-stone-800 light:border-stone-200 text-stone-400 font-bold uppercase">
                <th className="py-3 px-3 w-16 text-center">S.No</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-3 text-center w-20">Unit</th>
                <th className="py-3 px-4 text-right w-24">Rate (₹)</th>
                <th className="py-3 px-4">Pack Info</th>
                <th className="py-3 px-4 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 dark:divide-stone-800/80 light:divide-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-850 dark:hover:bg-stone-850 light:hover:bg-stone-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-500 tabular-nums">
                    #{p.sNo}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-white dark:text-white light:text-stone-900">
                    <div>{p.name}</div>
                    {p.popular && <span className="text-[10px] text-amber-400 font-bold">★ Bestseller</span>}
                  </td>
                  <td className="py-2.5 px-4 text-stone-400 dark:text-stone-400 light:text-stone-600">
                    {p.category}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 dark:bg-stone-800 light:bg-stone-200 text-stone-300 dark:text-stone-300 light:text-stone-800 uppercase">
                      {p.unit}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-white dark:text-white light:text-stone-900 tabular-nums text-sm">
                    ₹{p.rate}
                  </td>
                  <td className="py-2.5 px-4 text-stone-400 text-[11px]">
                    {p.pieces || '-'}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-300 dark:text-stone-300 light:text-stone-700 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(p)}
                        className="p-1.5 rounded-lg bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-red-600 hover:text-white text-stone-300 dark:text-stone-300 light:text-stone-700 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-stone-400">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Insert / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex justify-between items-center border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-3">
              <h3 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900">
                {editingProduct ? `Edit Product #${editingProduct.sNo}` : 'Insert New Cracker Product'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    S.No
                  </label>
                  <input
                    type="number"
                    value={formData.sNo}
                    onChange={(e) => setFormData({ ...formData, sNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900 font-mono"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 cm Green Sparklers"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900 cursor-pointer"
                  >
                    {categories.filter((c) => c.is_active).map((c) => (
                      <option key={c.category_id} value={c.category_name}>{c.category_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Packaging Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900 cursor-pointer"
                  >
                    <option value="Box">Box</option>
                    <option value="Pkt">Pkt</option>
                    <option value="Tube">Tube</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Rate (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 150"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                    Pieces / Pack info
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25 pcs or 15 items"
                    value={formData.pieces}
                    onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 dark:text-stone-300 light:text-stone-700 font-bold mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe sparkling effect, sound, duration..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 dark:bg-stone-950 light:bg-stone-50 border border-stone-700 text-white dark:text-white light:text-stone-900"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300 dark:text-stone-300 light:text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-300 dark:text-stone-300 light:text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as Featured Sky Wonder</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-800 dark:border-stone-800 light:border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Insert Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display text-lg font-bold text-white dark:text-white light:text-stone-900">
                Confirm Product Deletion
              </h3>
            </div>
            <p className="text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 leading-relaxed">
              Are you sure you want to delete <strong className="text-white dark:text-white light:text-stone-900">#{deletingProduct.sNo} {deletingProduct.name}</strong> (₹{deletingProduct.rate}) from the catalog?
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
