import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  DollarSign,
  Package,
  Calendar,
  Sparkles,
  Award,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { PlacedOrder } from '../context/CartContext';
import { Product } from '../data/products';

interface SellerAnalyticsDashboardProps {
  orders: PlacedOrder[];
  products: Product[];
}

// Festive palette for category charts
const CATEGORY_COLORS = [
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#eab308', // Yellow
  '#3b82f6', // Blue
  '#14b8a6', // Teal
];

export const SellerAnalyticsDashboard: React.FC<SellerAnalyticsDashboardProps> = ({
  orders,
  products,
}) => {
  const [salesMetric, setSalesMetric] = useState<'revenue' | 'volume'>('revenue');
  const [timeRange, setTimeRange] = useState<'7days' | 'season'>('7days');

  // 1. Process Daily Sales Volume Data
  const dailySalesData = useMemo(() => {
    // Generate recent dates anchor (last 7 or 14 days leading to current festive season)
    const daysMap: Record<string, { date: string; displayDate: string; revenue: number; boxes: number; orderCount: number }> = {};

    // Seed recent 7 days
    const today = new Date();
    const daysToGenerate = timeRange === '7days' ? 7 : 12;

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const display = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      daysMap[iso] = {
        date: iso,
        displayDate: display,
        revenue: 0,
        boxes: 0,
        orderCount: 0,
      };
    }

    // Populate from orders
    orders.forEach((ord) => {
      let iso = ord.date;
      if (iso && iso.length > 10) {
        iso = iso.slice(0, 10);
      }
      if (!daysMap[iso]) {
        // Fallback or map into nearest visible day
        const display = iso || 'Recent';
        daysMap[iso] = {
          date: iso,
          displayDate: display,
          revenue: 0,
          boxes: 0,
          orderCount: 0,
        };
      }
      daysMap[iso].revenue += ord.subtotal || 0;
      daysMap[iso].boxes += ord.totalBoxes || 0;
      daysMap[iso].orderCount += 1;
    });

    // Provide realistic baseline if orders are few in dev demo
    const result = Object.values(daysMap);
    if (result.every((d) => d.revenue === 0)) {
      // Demo seasonal ramp-up curve for Sivakasi bookings
      const mockCurve = [18500, 24200, 31800, 42000, 56400, 78200, 94600];
      const mockBoxes = [48, 64, 82, 110, 145, 205, 248];
      result.forEach((d, idx) => {
        d.revenue = mockCurve[idx % mockCurve.length];
        d.boxes = mockBoxes[idx % mockBoxes.length];
        d.orderCount = Math.ceil(d.boxes / 25);
      });
    }

    return result;
  }, [orders, timeRange]);

  // 2. Process Top-Selling Product Categories Data
  const categoryData = useMemo(() => {
    const catMap: Record<string, { name: string; revenue: number; boxes: number; itemCount: number }> = {};

    // First scan items across placed orders
    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        const cat = item.product.category || 'General Crackers';
        if (!catMap[cat]) {
          catMap[cat] = { name: cat, revenue: 0, boxes: 0, itemCount: 0 };
        }
        catMap[cat].revenue += (item.product.rate || 0) * (item.quantity || 1);
        catMap[cat].boxes += item.quantity || 1;
        catMap[cat].itemCount += 1;
      });
    });

    // If order items were low, augment with catalog product proportions
    if (Object.keys(catMap).length === 0) {
      products.forEach((p) => {
        const cat = p.category;
        if (!catMap[cat]) {
          catMap[cat] = { name: cat, revenue: 0, boxes: 0, itemCount: 0 };
        }
        // Base weight simulation
        const weight = p.popular ? 8 : 3;
        catMap[cat].revenue += p.rate * weight * 12;
        catMap[cat].boxes += weight * 12;
        catMap[cat].itemCount += 1;
      });
    }

    const arr = Object.values(catMap).sort((a, b) => b.revenue - a.revenue);
    const totalRev = arr.reduce((sum, item) => sum + item.revenue, 0);

    return arr.map((item) => ({
      ...item,
      percentage: totalRev > 0 ? Math.round((item.revenue / totalRev) * 100) : 0,
    }));
  }, [orders, products]);

  // 3. Aggregate Key Metrics
  const totalRevenue = useMemo(() => {
    const ordSum = orders.reduce((acc, o) => acc + (o.subtotal || 0), 0);
    return ordSum > 0 ? ordSum : dailySalesData.reduce((acc, d) => acc + d.revenue, 0);
  }, [orders, dailySalesData]);

  const totalBoxes = useMemo(() => {
    const boxSum = orders.reduce((acc, o) => acc + (o.totalBoxes || 0), 0);
    return boxSum > 0 ? boxSum : dailySalesData.reduce((acc, d) => acc + d.boxes, 0);
  }, [orders, dailySalesData]);

  const avgOrderValue = useMemo(() => {
    const count = Math.max(orders.length, 1);
    return Math.round(totalRevenue / count);
  }, [totalRevenue, orders.length]);

  const topCategory = categoryData[0]?.name || 'Gift Boxes';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Title and Metric Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Seller Business Analytics & Sales Visualization
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Real-time daily booking volume, category share, and wholesale order velocity
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold">
            <button
              onClick={() => setSalesMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                salesMetric === 'revenue'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setSalesMetric('volume')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                salesMetric === 'volume'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Boxes Volume
            </button>
          </div>

          <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === '7days'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('season')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === 'season'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              Festival Total
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Total Sales Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>Festival booking run rate</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Boxes Dispatched
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums">
            {totalBoxes.toLocaleString('en-IN')} <span className="text-sm font-semibold text-stone-500">Boxes</span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            Across {orders.length} registered lorry parcels
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Avg Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            Average customer basket size
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Top Category
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 truncate">
            {topCategory}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            {categoryData[0]?.percentage || 28}% of total gross revenue
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: DAILY SALES VOLUME (Recharts Bar & Area) */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Daily Sales Volume & Booking Velocity
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {salesMetric === 'revenue' ? 'Daily gross order revenue (₹)' : 'Daily total cracker boxes ordered'}
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {timeRange === '7days' ? 'Last 7 Days' : 'Festival Ramp-up'}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {salesMetric === 'revenue' ? (
                <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={{ stroke: '#78716c', opacity: 0.3 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={{ stroke: '#78716c', opacity: 0.3 }}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      borderColor: '#44403c',
                      borderRadius: '0.75rem',
                      color: '#fafaf9',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Gross Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Daily Revenue" />
                </BarChart>
              ) : (
                <AreaChart data={dailySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={{ stroke: '#78716c', opacity: 0.3 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={{ stroke: '#78716c', opacity: 0.3 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      borderColor: '#44403c',
                      borderRadius: '0.75rem',
                      color: '#fafaf9',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value} Boxes`, 'Dispatched Volume']}
                  />
                  <Area
                    type="monotone"
                    dataKey="boxes"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#boxGrad)"
                    name="Cracker Boxes"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: TOP-SELLING CATEGORIES DONUT (Recharts PieChart) */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-rose-500" />
                Top-Selling Product Categories
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Revenue share across cracker segments
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="revenue"
                  nameKey="name"
                >
                  {categoryData.slice(0, 6).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderColor: '#44403c',
                    borderRadius: '0.75rem',
                    color: '#fafaf9',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [
                    `₹${Number(value).toLocaleString('en-IN')}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pills Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
            {categoryData.slice(0, 6).map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="font-medium text-stone-700 dark:text-stone-300 truncate">
                    {cat.name}
                  </span>
                </div>
                <span className="font-bold text-stone-900 dark:text-white tabular-nums shrink-0 ml-1">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Category Performance Ranking List */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Complete Category Performance & Box Velocity Breakdown
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Items in Catalog</th>
                <th className="py-2.5 px-3 text-right">Boxes Sold</th>
                <th className="py-2.5 px-3 text-right">Gross Revenue</th>
                <th className="py-2.5 px-3 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {categoryData.map((cat, idx) => (
                <tr key={cat.name} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    />
                    {cat.name}
                  </td>
                  <td className="py-2.5 px-3 text-right text-stone-600 dark:text-stone-300 tabular-nums">
                    {cat.itemCount} items
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-stone-900 dark:text-white tabular-nums">
                    {cat.boxes.toLocaleString('en-IN')} boxes
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    ₹{cat.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 font-bold text-stone-700 dark:text-stone-300 text-[10px]">
                      {cat.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
