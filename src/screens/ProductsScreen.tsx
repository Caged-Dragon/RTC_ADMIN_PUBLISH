import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Minus, Box, Sparkles, Filter, ShoppingBag } from 'lucide-react';
import { Product, CATEGORIES } from '../data/products';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export const ProductsScreen: React.FC = () => {
  const { getItemQuantity, addToCart, updateQuantity, totalBoxes, subtotal, setIsCartOpen } = useCart();
  const { products } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'default' | 'low' | 'high'>('default');

  // Helper to pick product picture (supports custom product imageUrl or festive preset)
  const getProductImage = (item: Product) => {
    if (item.imageUrl) return item.imageUrl;
    const category = item.category;
    if (category === 'Colourful Sparklers') {
      return '/src/assets/images/redthunder_sparklers_1791297554442.jpg';
    }
    if (category === 'Flower Pots' || category === 'Fountain Special' || category === 'Colourfull Sandpots') {
      return '/src/assets/images/redthunder_pots_fountains_1791299034674.jpg';
    }
    if (category === 'Multiple Repeating Shots' || category === 'Mega Fancy Varieties' || category === 'Fancy Rockets') {
      return '/src/assets/images/redthunder_aerial_shots_1791299049699.jpg';
    }
    if (category === 'Gift Boxes') {
      return '/src/assets/images/redthunder_gift_boxes_1791297541022.jpg';
    }
    if (category === 'Bombs' || category === 'Paper Bombs' || category === 'Single Sound Crackers' || category === 'Bijili Crackers') {
      return '/src/assets/images/redthunder_sound_crackers_1791301117609.jpg';
    }
    if (category === 'Ground Chakkar' || category === 'Twinkling Stars') {
      return '/src/assets/images/redthunder_peacock_chakkars_1791301133347.jpg';
    }
    // Default fallback to sparks hero
    return '/src/assets/images/redthunder_hero_crackers_1791297525760.jpg';
  };

  const filtered = useMemo(() => {
    return products.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSNo = item.sNo.toString() === q || `#${item.sNo}` === q;
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchSNo && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (priceSort === 'low') return a.rate - b.rate;
      if (priceSort === 'high') return b.rate - a.rate;
      return a.sNo - b.sNo;
    });
  }, [products, search, selectedCategory, priceSort]);

  // Simplified friendly categories
  const friendlyCategories = [
    { label: 'All Crackers', value: 'All', count: products.length },
    { label: 'Sparklers', value: 'Colourful Sparklers', count: products.filter(p => p.category === 'Colourful Sparklers').length },
    { label: 'Flower Pots', value: 'Flower Pots', count: products.filter(p => p.category === 'Flower Pots').length },
    { label: 'Ground Chakkars', value: 'Ground Chakkar', count: products.filter(p => p.category === 'Ground Chakkar').length },
    { label: 'Bombs & Sound', value: 'Bombs', count: products.filter(p => p.category === 'Bombs' || p.category === 'Paper Bombs').length },
    { label: 'Fountains Special', value: 'Fountain Special', count: products.filter(p => p.category === 'Fountain Special').length },
    { label: 'Sky Repeating Shots', value: 'Multiple Repeating Shots', count: products.filter(p => p.category === 'Multiple Repeating Shots').length },
    { label: 'Mega Aerial Shells', value: 'Mega Fancy Varieties', count: products.filter(p => p.category === 'Mega Fancy Varieties').length },
    { label: 'Wala & Garlands', value: 'Chorsa & Wala', count: products.filter(p => p.category === 'Chorsa & Wala').length },
    { label: 'Gift Boxes (Hampers)', value: 'Gift Boxes', count: products.filter(p => p.category === 'Gift Boxes').length },
    { label: 'Kids Novelties', value: 'Kids Special', count: products.filter(p => p.category === 'Kids Special').length },
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Title & Easy Description */}
      <div className="border-b border-stone-800 dark:border-stone-800 light:border-stone-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Photo Gallery</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
            All 127 Crackers with Photos
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 max-w-xl">
            Browse crackers with clear pictures and factory rates. Click <strong>"+"</strong> to add items to your cart.
          </p>
        </div>

        {totalBoxes > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({totalBoxes} items · ₹{subtotal.toLocaleString('en-IN')})</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Simple Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name (e.g. Sparklers, Flower Pot, Lakshmi, 30 Shot, or S.No)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 text-xs sm:text-sm text-white dark:text-white light:text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Simple Sort */}
          <div className="sm:w-48">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 dark:bg-stone-900 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-300 text-xs text-stone-200 dark:text-stone-200 light:text-stone-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="default">Sort: Catalog Order</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {friendlyCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer text-xs font-semibold ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-900 dark:bg-stone-900 light:bg-white text-stone-300 dark:text-stone-300 light:text-stone-700 hover:border-stone-700 border border-stone-800 dark:border-stone-800 light:border-stone-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1.5 opacity-70 text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards with Pictures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => {
          const qty = getItemQuantity(product.id);
          const imgSrc = getProductImage(product);

          return (
            <div
              key={product.id}
              className="group rounded-2xl overflow-hidden bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 hover:border-amber-500/50 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Product Picture */}
              <div className="relative h-44 overflow-hidden bg-stone-950">
                <img
                  src={imgSrc}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* S.No Badge on Picture */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                    #{product.sNo}
                  </span>
                </div>

                {/* Unit Tag on Picture */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md text-stone-200 text-[10px] font-bold uppercase border border-stone-700/60">
                    {product.unit}
                  </span>
                </div>

                {/* Category label bottom */}
                <div className="absolute bottom-2 left-3 right-3 text-[11px] text-stone-300 font-medium truncate">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-400 dark:text-stone-400 light:text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {product.pieces && (
                    <div className="mt-2 text-[11px] font-semibold text-amber-400 dark:text-amber-400 light:text-amber-800 flex items-center gap-1">
                      <Box className="w-3 h-3" />
                      <span>Pack has: {product.pieces}</span>
                    </div>
                  )}
                </div>

                {/* Price and Cart Stepper */}
                <div className="mt-4 pt-3 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Rate / {product.unit}</span>
                    <div className="font-display text-xl font-extrabold text-white dark:text-white light:text-stone-900 tabular-nums">
                      ₹{product.rate}
                    </div>
                  </div>

                  <div>
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-200 dark:text-stone-200 light:text-stone-800 text-xs font-bold border border-stone-700 dark:border-stone-700 light:border-stone-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 bg-stone-950 dark:bg-stone-950 light:bg-stone-100 border border-amber-500/60 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(product.id, qty - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-amber-400 dark:text-amber-400 light:text-amber-800 tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 dark:text-stone-300 light:text-stone-700 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {qty > 0 && (
                  <div className="mt-2 text-[11px] font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 flex justify-between bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <span>{qty} {product.unit} selected</span>
                    <span>₹{qty * product.rate}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-stone-900/40 dark:bg-stone-900/40 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 p-8">
          <p className="text-stone-400 text-sm">No crackers match your search word.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="mt-3 px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl"
          >
            Show All Crackers
          </button>
        </div>
      )}

    </div>
  );
};
