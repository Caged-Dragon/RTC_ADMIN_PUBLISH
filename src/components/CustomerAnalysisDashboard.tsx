import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  MapPin,
  DollarSign,
  Download,
  Search,
  Filter,
  MessageCircle,
  Phone,
  ArrowUpRight,
  Sparkles,
  PieChart,
  ShoppingBag,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';
import { PlacedOrder } from '../context/CartContext';
import { Product, CATEGORIES } from '../data/products';

interface CustomerAnalysisDashboardProps {
  orders: PlacedOrder[];
  products: Product[];
  onOpenOrderDetails: (order: PlacedOrder) => void;
}

export const CustomerAnalysisDashboard: React.FC<CustomerAnalysisDashboardProps> = ({
  orders,
  products,
  onOpenOrderDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');
  const [spendTierFilter, setSpendTierFilter] = useState<'ALL' | 'VIP' | 'REGULAR'>('ALL');

  // Aggregated Customer Profiles
  const customerProfiles = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      email: string;
      city: string;
      state: string;
      totalOrders: number;
      totalSpend: number;
      totalBoxes: number;
      latestOrderDate: string;
      preferredTransport: string;
      orders: PlacedOrder[];
    }>();

    orders.forEach((order) => {
      const key = order.customer.phone.trim() || order.customer.name.trim();
      if (!map.has(key)) {
        map.set(key, {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email,
          city: order.customer.city,
          state: order.customer.state,
          totalOrders: 0,
          totalSpend: 0,
          totalBoxes: 0,
          latestOrderDate: order.date,
          preferredTransport: order.lorryTransport || order.customer.transportPreference,
          orders: [],
        });
      }

      const prof = map.get(key)!;
      prof.totalOrders += 1;
      prof.totalSpend += order.subtotal;
      prof.totalBoxes += order.totalBoxes;
      prof.orders.push(order);
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  // City-wise Aggregation
  const cityAnalytics = useMemo(() => {
    const cityMap = new Map<string, { count: number; revenue: number; boxes: number }>();
    orders.forEach((o) => {
      const c = o.customer.city || 'Other Hub';
      const existing = cityMap.get(c) || { count: 0, revenue: 0, boxes: 0 };
      cityMap.set(c, {
        count: existing.count + 1,
        revenue: existing.revenue + o.subtotal,
        boxes: existing.boxes + o.totalBoxes,
      });
    });

    const totalRev = orders.reduce((sum, o) => sum + o.subtotal, 0) || 1;

    return Array.from(cityMap.entries())
      .map(([city, data]) => ({
        city,
        count: data.count,
        revenue: data.revenue,
        boxes: data.boxes,
        percent: Math.round((data.revenue / totalRev) * 100),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Category Demand Breakdown
  const categoryDemand = useMemo(() => {
    const catMap = new Map<string, { unitsSold: number; revenue: number }>();
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.product.category || 'General';
        const existing = catMap.get(cat) || { unitsSold: 0, revenue: 0 };
        catMap.set(cat, {
          unitsSold: existing.unitsSold + item.quantity,
          revenue: existing.revenue + item.product.rate * item.quantity,
        });
      });
    });

    return Array.from(catMap.entries())
      .map(([cat, val]) => ({ category: cat, ...val }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Overall KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalBoxes = orders.reduce((sum, o) => sum + o.totalBoxes, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const uniqueCustomersCount = customerProfiles.length;
  const repeatBuyersCount = customerProfiles.filter((c) => c.totalOrders > 1).length;
  const repeatRate = uniqueCustomersCount > 0 ? Math.round((repeatBuyersCount / uniqueCustomersCount) * 100) : 0;

  // Filtered customer list
  const filteredCustomers = customerProfiles.filter((c) => {
    if (selectedCityFilter !== 'ALL' && c.city.toLowerCase() !== selectedCityFilter.toLowerCase()) return false;
    if (spendTierFilter === 'VIP' && c.totalSpend < 5000) return false;
    if (spendTierFilter === 'REGULAR' && c.totalSpend >= 5000) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchCity = c.city.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  // Export Customer CSV
  const handleExportCSV = () => {
    let csv = 'Order ID,Date,Customer Name,Phone,Email,City,State,Total Boxes,Subtotal (INR),Status,Transporter,LR Number\n';
    orders.forEach((o) => {
      csv += `"${o.orderId}","${o.date}","${o.customer.name}","${o.customer.phone}","${o.customer.email || ''}","${o.customer.city}","${o.customer.state}",${o.totalBoxes},${o.subtotal},"${o.status}","${o.lorryTransport || ''}","${o.lrNumber || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RedThunder_Customer_Orders_Report_2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Export Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Customer Analysis & Buyer Intelligence Dashboard</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Analyze customer lifetime value (LTV), city-level order distribution, category demand, and festival buying patterns.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-500 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow active:scale-95 shrink-0"
          title="Download orders report in CSV"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Customer CSV (Excel)</span>
        </button>
      </div>

      {/* Customer Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Total Buyers</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-white dark:text-white light:text-stone-900 mt-0.5 tabular-nums">
            {uniqueCustomersCount} Buyers
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            {repeatBuyersCount} Repeat Customers ({repeatRate}%)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Average Order Value (AOV)</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 tabular-nums">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Per customer booking</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Carton Volume</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 tabular-nums">
            {totalBoxes} Boxes
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Shipped from Sivakasi</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Top Demand Hub</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-rose-400 mt-0.5 truncate">
            {cityAnalytics[0]?.city || 'Chennai'}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {cityAnalytics[0]?.percent || 0}% of all customer sales
          </span>
        </div>
      </div>

      {/* Visual City Distribution & Category Demand Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* City Destination Breakdown */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Customer City Geographical Distribution</span>
            </span>
            <span className="text-[11px] text-stone-400 font-semibold">{cityAnalytics.length} Cities</span>
          </div>

          <div className="space-y-3">
            {cityAnalytics.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {c.city} ({c.count} orders)
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    ₹{c.revenue.toLocaleString('en-IN')} <span className="text-stone-500 font-normal">({c.percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, c.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Demand Heatmap */}
        <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Cracker Category Demand & Revenue Share</span>
            </span>
            <span className="text-[11px] text-stone-400 font-semibold">{categoryDemand.length} Categories</span>
          </div>

          <div className="space-y-3">
            {categoryDemand.slice(0, 6).map((cat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white dark:text-white light:text-stone-900">{cat.category}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{cat.unitsSold} boxes/packets ordered</div>
                </div>
                <div className="text-right font-mono font-bold text-amber-400 text-sm">
                  ₹{cat.revenue.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top High-Value Customer Accounts Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-white dark:text-white light:text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Customer Accounts Directory & Lifetime Value (LTV)</span>
            </h3>
            <p className="text-xs text-stone-400">
              Direct contacts and historical spend of your festival buyers.
            </p>
          </div>

          {/* Search & Spend Tier Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search buyer by name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-white"
              />
            </div>

            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-white cursor-pointer"
            >
              <option value="ALL">All Cities</option>
              {cityAnalytics.map((c) => (
                <option key={c.city} value={c.city}>{c.city}</option>
              ))}
            </select>

            <select
              value={spendTierFilter}
              onChange={(e) => setSpendTierFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-white cursor-pointer"
            >
              <option value="ALL">All Spend Tiers</option>
              <option value="VIP">VIP (₹5,000+)</option>
              <option value="REGULAR">Standard (&lt; ₹5,000)</option>
            </select>
          </div>
        </div>

        {/* Customer Accounts Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-950 text-stone-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Customer Buyer</th>
                <th className="py-2.5 px-3">City & Hub</th>
                <th className="py-2.5 px-2 text-center">Orders</th>
                <th className="py-2.5 px-2 text-center">Boxes</th>
                <th className="py-2.5 px-3 text-right">Lifetime Spend (₹)</th>
                <th className="py-2.5 px-3">Lorry Preference</th>
                <th className="py-2.5 px-3 text-center">Direct Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {filteredCustomers.map((c, idx) => (
                <tr key={idx} className="hover:bg-stone-850 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {c.totalSpend >= 5000 && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">{c.phone}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-amber-300 font-semibold">{c.city}</span>
                    <span className="text-stone-500 text-[11px] block">{c.state}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-white">
                    {c.totalOrders}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-stone-300">
                    {c.totalBoxes}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-amber-400 text-sm">
                    ₹{c.totalSpend.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-stone-400 text-[11px] max-w-xs truncate">
                    {c.preferredTransport}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${c.name}! Greetings from RedThunder Crackers Sivakasi. How can we assist you today?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${c.phone}`}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      {c.orders[0] && (
                        <button
                          onClick={() => onOpenOrderDetails(c.orders[0])}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 cursor-pointer"
                          title="View Latest Order"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
