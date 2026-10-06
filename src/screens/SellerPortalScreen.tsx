import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Save,
  X,
  RotateCcw,
  AlertTriangle,
  Phone,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Send,
  MessageCircle,
  Copy,
  Check,
  QrCode,
  User,
  MapPin,
  Calendar,
  ChevronRight,
  Eye,
  Store,
  Receipt,
  Image as ImageIcon,
  Upload,
  Users,
  Download,
  AlertCircle
} from 'lucide-react';
import { Product, CATEGORIES, STORE_INFO } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import { useCart, PlacedOrder } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PackingSlipModal } from '../components/PackingSlipModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { CustomerAnalysisDashboard } from '../components/CustomerAnalysisDashboard';
import { SellerAnalyticsDashboard } from '../components/SellerAnalyticsDashboard';

interface SellerPortalScreenProps {
  onSwitchToCustomer: () => void;
  onOpenInvoice: () => void;
}

// Sivakasi Festive Image Presets for Seller
const CRACKER_IMAGE_PRESETS = [
  { label: 'Sparklers', path: '/src/assets/images/redthunder_sparklers_1791297554442.jpg', tag: 'Light & Sparks' },
  { label: 'Flower Pots & Fountains', path: '/src/assets/images/redthunder_pots_fountains_1791299034674.jpg', tag: 'High Fountains' },
  { label: 'Spinning Chakkars', path: '/src/assets/images/redthunder_peacock_chakkars_1791301133347.jpg', tag: 'Ground Wheels' },
  { label: 'Sound Bombs & Bijili', path: '/src/assets/images/redthunder_sound_crackers_1791301117609.jpg', tag: 'Loud Sound' },
  { label: 'Repeating Aerial Shots', path: '/src/assets/images/redthunder_aerial_shots_1791299049699.jpg', tag: 'Sky Wonders' },
  { label: 'Festival Gift Boxes', path: '/src/assets/images/redthunder_gift_boxes_1791297541022.jpg', tag: 'Family Packs' },
  { label: 'Night Fireworks Celebration', path: '/src/assets/images/redthunder_hero_crackers_1791297525760.jpg', tag: 'Grand Finale' },
];

// Sivakasi Transporters Directory
const SIVAKASI_TRANSPORTERS = [
  { name: 'ARC Parcels Sivakasi Booking', phone: '+91 4562 278100', hub: 'Near Sivakasi Railway Feeder Rd', speed: '1-2 Days' },
  { name: 'KPN Speed Parcels Sivakasi', phone: '+91 4562 223400', hub: 'Pothigai Nagar Branch, Sivakasi', speed: '1 Day (TN) / 2 Days (KA)' },
  { name: 'ABT Parcel Service Sivakasi', phone: '+91 4562 230910', hub: 'Thiruthangal Main Road, Sivakasi', speed: '1-2 Days' },
  { name: 'VRL Logistics Road Cargo', phone: '+91 4562 245600', hub: 'Sivakasi Bypass Godown', speed: '2-3 Days (Interstate)' },
  { name: 'TAT Parcel Express', phone: '+91 4562 271234', hub: 'Satchiyapuram Hub, Sivakasi', speed: '1-2 Days' },
];

// Sivakasi Destination Rates Reference
const DESTINATION_RATES = [
  { city: 'Chennai', days: '1 - 2 Days', ratePerBox: '₹120 - ₹180', mainHubs: 'Koyambedu, Madhavaram, Guindy' },
  { city: 'Madurai', days: 'Same Day / 1 Day', ratePerBox: '₹80 - ₹120', mainHubs: 'Mattuthavani, Arapalayam' },
  { city: 'Coimbatore', days: '1 - 2 Days', ratePerBox: '₹110 - ₹160', mainHubs: 'Gandhipuram, Ukkadam' },
  { city: 'Tiruchirappalli (Trichy)', days: '1 Day', ratePerBox: '₹100 - ₹140', mainHubs: 'Central Bus Stand Hub' },
  { city: 'Salem', days: '1 - 2 Days', ratePerBox: '₹110 - ₹150', mainHubs: 'New Bus Stand Hub' },
  { city: 'Tirunelveli', days: '1 Day', ratePerBox: '₹80 - ₹120', mainHubs: 'Vannarpettai Hub' },
  { city: 'Bangalore', days: '2 - 3 Days', ratePerBox: '₹160 - ₹240', mainHubs: 'Kalasipalya, Bommasandra' },
  { city: 'Hyderabad', days: '3 - 4 Days', ratePerBox: '₹220 - ₹320', mainHubs: 'Kukatpally, Afzal Gunj' },
  { city: 'Kochi / Ernakulam', days: '2 - 3 Days', ratePerBox: '₹180 - ₹260', mainHubs: 'Kaloor, Aluva' },
];

export const SellerPortalScreen: React.FC<SellerPortalScreenProps> = ({
  onSwitchToCustomer,
}) => {
  const { products, insertProduct, updateProduct, deleteProduct, uploadProductImage, resetCatalog } = useProducts();
  const { ordersHistory, updateOrderStatus, addPlacedOrder } = useCart();
  const toast = useToast();

  // Active Seller Portal Tab
  const [sellerTab, setSellerTab] = useState<'inventory' | 'orders' | 'customers' | 'dispatch' | 'walkin' | 'analytics' | 'settings'>('inventory');

  // Search & Filters in Inventory
  const [productSearch, setProductSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Product CRUD Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form State
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
    imageUrl: '',
    stockStatus: 'IN_STOCK' as 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK',
  });

  // Orders State & Detailed Inspector
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PAYMENT_PENDING' | 'PAYMENT_RECEIVED' | 'PACKED' | 'DISPATCHED'>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<PlacedOrder | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<PlacedOrder | null>(null);
  const [selectedOrderForPacking, setSelectedOrderForPacking] = useState<PlacedOrder | null>(null);

  // Lorry LR Generator input
  const [lrInputOrder, setLrInputOrder] = useState<string>('RT-2026-2145');
  const [lrInputTransporter, setLrInputTransporter] = useState('ARC Parcels Sivakasi Booking');
  const [lrInputNumber, setLrInputNumber] = useState('SVKS-LR-891042');

  // Bulk Price Adjuster
  const [bulkPercent, setBulkPercent] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Walk-in / Phone Quotation Generator State
  const [walkinCustomer, setWalkinCustomer] = useState({
    name: 'Walk-in Factory Buyer',
    phone: '9840000000',
    city: 'Madurai',
    transport: 'Local Godown Direct Handover',
  });
  const [walkinCart, setWalkinCart] = useState<Array<{ product: Product; quantity: number }>>([
    { product: products[0] || { id: 1, sNo: 1, name: '10 cm Electric Sparklers', category: 'Colourful Sparklers', unit: 'Box', rate: 24, description: 'Bright sparklers' }, quantity: 5 },
    { product: products.find((p) => p.sNo === 118) || { id: 118, sNo: 118, name: 'Red Rose ( 15 Items )', category: 'Gift Boxes', unit: 'Box', rate: 400, description: 'Gift box' }, quantity: 2 },
  ]);
  const [walkinSearch, setWalkinSearch] = useState('');

  const showNotice = (msg: string) => {
    setNotification(msg);
    toast.success(msg, 'Seller Back-Office');
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to get product thumbnail
  const getProductThumbnail = (p: Product) => {
    if (p.imageUrl) return p.imageUrl;
    const cat = p.category;
    if (cat === 'Colourful Sparklers') return '/src/assets/images/redthunder_sparklers_1791297554442.jpg';
    if (cat === 'Flower Pots' || cat === 'Fountain Special' || cat === 'Colourfull Sandpots') return '/src/assets/images/redthunder_pots_fountains_1791299034674.jpg';
    if (cat === 'Multiple Repeating Shots' || cat === 'Mega Fancy Varieties' || cat === 'Fancy Rockets') return '/src/assets/images/redthunder_aerial_shots_1791299049699.jpg';
    if (cat === 'Gift Boxes') return '/src/assets/images/redthunder_gift_boxes_1791297541022.jpg';
    if (cat === 'Bombs' || cat === 'Paper Bombs' || cat === 'Single Sound Crackers' || cat === 'Bijili Crackers') return '/src/assets/images/redthunder_sound_crackers_1791301117609.jpg';
    if (cat === 'Ground Chakkar' || cat === 'Twinkling Stars') return '/src/assets/images/redthunder_peacock_chakkars_1791301133347.jpg';
    return '/src/assets/images/redthunder_hero_crackers_1791297525760.jpg';
  };

  // Filtered Products for Seller Inventory
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCat !== 'All' && p.category !== selectedCat) return false;
      if (stockFilter !== 'ALL') {
        const currentStock = p.stockStatus || 'IN_STOCK';
        if (currentStock !== stockFilter) return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSNo = p.sNo.toString() === q || `#${p.sNo}` === q;
        if (!matchName && !matchSNo) return false;
      }
      return true;
    }).sort((a, b) => a.sNo - b.sNo);
  }, [products, selectedCat, productSearch, stockFilter]);

  // Orders Filtered
  const filteredOrders = useMemo(() => {
    return ordersHistory.filter((o) => {
      if (orderFilter === 'PAYMENT_PENDING' && !(o.status === 'Order Placed' || o.status === 'WhatsApp Sent')) return false;
      if (orderFilter === 'PAYMENT_RECEIVED' && o.status !== 'Payment Checked') return false;
      if (orderFilter === 'PACKED' && o.status !== 'Packed in Sivakasi') return false;
      if (orderFilter === 'DISPATCHED' && o.status !== 'Sent via Lorry') return false;
      
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchId = o.orderId.toLowerCase().includes(q);
        const matchName = o.customer.name.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.includes(q);
        const matchCity = o.customer.city.toLowerCase().includes(q);
        const matchLR = o.lrNumber?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchCity && !matchLR) return false;
      }

      return true;
    });
  }, [ordersHistory, orderFilter, orderSearchQuery]);

  // Seller Performance Metrics
  const totalRevenue = ordersHistory.reduce((acc, o) => acc + o.subtotal, 0);
  const totalUnitsOrdered = ordersHistory.reduce((acc, o) => acc + o.totalBoxes, 0);
  const pendingDispatches = ordersHistory.filter((o) => o.status !== 'Sent via Lorry').length;
  const completedDispatches = ordersHistory.filter((o) => o.status === 'Sent via Lorry').length;

  // Open Add Product Form
  const handleOpenAdd = () => {
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
      imageUrl: '/src/assets/images/redthunder_sparklers_1791297554442.jpg',
      stockStatus: 'IN_STOCK',
    });
    setIsFormOpen(true);
  };

  // Open Edit Product Form
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
      imageUrl: p.imageUrl || getProductThumbnail(p),
      stockStatus: p.stockStatus || 'IN_STOCK',
    });
    setIsFormOpen(true);
  };

  // Image Upload File Handler (converts file to base64 Data URL)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadProductImage(file, editingProduct?.id);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      showNotice(`Uploaded original image: "${file.name}"`);
    } catch (error: any) {
      alert(error?.message || 'Image upload failed.');
    }
  };

  // Save Product (Insert or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(formData.rate);
    if (!formData.name.trim() || isNaN(rateNum) || rateNum <= 0) {
      alert('Please fill a valid product name and factory rate.');
      return;
    }

    if (editingProduct) {
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
        imageUrl: formData.imageUrl || undefined,
        stockStatus: formData.stockStatus,
      });
      showNotice(`Updated product #${formData.sNo} "${formData.name}".`);
    } else {
      const newSNo = parseInt(formData.sNo, 10) || (products.length + 1);
      await insertProduct({
        sNo: newSNo,
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit,
        rate: Math.round(rateNum),
        pieces: formData.pieces.trim() || undefined,
        description: formData.description.trim() || 'Sivakasi factory product',
        popular: formData.popular,
        featured: formData.featured,
        imageUrl: formData.imageUrl || undefined,
        stockStatus: formData.stockStatus,
      });
      showNotice(`Successfully added "${formData.name}" to catalog with photo!`);
    }
    setIsFormOpen(false);
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    showNotice(`Deleted product #${deletingProduct.sNo} "${deletingProduct.name}".`);
    setDeletingProduct(null);
  };

  // Quick Inline Rate Adjuster (+/- ₹5 or ₹10)
  const handleQuickAdjustRate = async (p: Product, delta: number) => {
    const newRate = Math.max(1, p.rate + delta);
    await updateProduct(p.id, { rate: newRate });
    showNotice(`Rate for #${p.sNo} "${p.name}" updated to ₹${newRate}.`);
  };

  // Quick Toggle Stock Status
  const handleToggleStock = async (p: Product) => {
    const nextStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' =
      !p.stockStatus || p.stockStatus === 'IN_STOCK'
        ? 'LOW_STOCK'
        : p.stockStatus === 'LOW_STOCK'
        ? 'OUT_OF_STOCK'
        : 'IN_STOCK';

    await updateProduct(p.id, { stockStatus: nextStatus });
    showNotice(`Stock for #${p.sNo} "${p.name}" set to ${nextStatus}.`);
  };

  // Bulk Price Update
  const handleApplyBulkPercent = async () => {
    const pct = parseFloat(bulkPercent);
    if (isNaN(pct) || pct === 0) return;
    const factor = 1 + pct / 100;
    for (const p of products) {
      const newRate = Math.max(1, Math.round(p.rate * factor));
      if (newRate !== p.rate) {
        await updateProduct(p.id, { rate: newRate });
      }
    }
    showNotice(`Applied ${pct > 0 ? `+${pct}%` : `${pct}%`} price change across ${products.length} products.`);
    setBulkPercent('');
  };

  // Export Product Catalog CSV
  const handleExportProductsCSV = () => {
    let csv = 'S.No,Cracker Name,Category,Unit,Factory Rate (INR),Pieces Pack,Stock Status,Bestseller\n';
    products.forEach((p) => {
      csv += `${p.sNo},"${p.name}","${p.category}","${p.unit}",${p.rate},"${p.pieces || ''}","${p.stockStatus || 'IN_STOCK'}",${p.popular ? 'YES' : 'NO'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RedThunder_2026_Catalog_Price_List.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Update Order Status as Seller
  const handleUpdateOrderStatus = (orderId: string, newStatus: PlacedOrder['status'], lr?: string, transporter?: string) => {
    updateOrderStatus(orderId, newStatus, lr, transporter);
    showNotice(`Order #${orderId} marked as "${newStatus}"!`);
    if (selectedOrderForDetails && selectedOrderForDetails.orderId === orderId) {
      setSelectedOrderForDetails({
        ...selectedOrderForDetails,
        status: newStatus,
        lrNumber: lr !== undefined ? lr : selectedOrderForDetails.lrNumber,
        lorryTransport: transporter !== undefined ? transporter : selectedOrderForDetails.lorryTransport,
      });
    }
  };

  // Send WhatsApp Message to Customer directly from Seller Console
  const handleWhatsAppCustomer = (order: PlacedOrder) => {
    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    let text = `*REDTHUNDER CRACKERS, SIVAKASI - ORDER UPDATE*\n`;
    text += `Dear ${order.customer.name},\n\n`;
    text += `Greetings from RedThunder Crackers Factory Godown, Sivakasi!\n`;
    text += `Your festive order *#${order.orderId}* status has been updated to: *${order.status.toUpperCase()}*.\n\n`;
    text += `*Order Summary:*\n`;
    text += `• Total Boxes/Units: ${order.totalBoxes} items\n`;
    text += `• Net Bill Amount: ₹${order.subtotal.toLocaleString('en-IN')}\n`;
    text += `• Destination City: ${order.customer.city}, ${order.customer.state}\n`;
    
    if (order.lrNumber) {
      text += `\n*🚚 Sivakasi Lorry Dispatch Details:*\n`;
      text += `• Transporter: ${order.lorryTransport || order.customer.transportPreference}\n`;
      text += `• Lorry Receipt (LR) No: *${order.lrNumber}*\n`;
      text += `• You can collect your consignment at your city parcel office by showing this LR number.\n`;
    }

    text += `\nThank you for choosing authentic Sivakasi fireworks. Wishing you a happy, prosperous and safe Diwali!\n`;
    text += `— RedThunder Crackers, Sivakasi (WhatsApp: ${STORE_INFO.phoneDisplay})`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Walk-in order subtotal
  const walkinSubtotal = walkinCart.reduce((sum, item) => sum + item.product.rate * item.quantity, 0);
  const walkinTotalBoxes = walkinCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSaveWalkinOrder = () => {
    if (walkinCart.length === 0) {
      alert('Please add at least 1 cracker product.');
      return;
    }
    const orderId = `RT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: PlacedOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      customer: {
        name: walkinCustomer.name,
        phone: walkinCustomer.phone,
        email: 'walkin@redthunder.in',
        address: 'Direct Factory Godown Delivery',
        city: walkinCustomer.city,
        state: 'Tamil Nadu',
        pincode: '626189',
        transportPreference: walkinCustomer.transport,
        notes: 'Walk-in cash/UPI settlement',
      },
      items: walkinCart,
      totalBoxes: walkinTotalBoxes,
      subtotal: walkinSubtotal,
      status: 'Payment Checked',
    };
    addPlacedOrder(newOrder);
    showNotice(`Created new walk-in order #${orderId} for ${walkinCustomer.name}!`);
    setSelectedOrderForInvoice(newOrder);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* SELLER PORTAL HERO HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 border border-amber-600/30 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              🏭 Sivakasi Merchant Factory Desk
            </span>
            <span className="text-stone-400 text-xs font-semibold">• 2026 Festival Operations Console</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            RedThunder Crackers <span className="text-amber-400">Seller Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Manage cracker product images and factory prices, inspect customer order details in depth, analyze customer lifetime value and city distribution, and dispatch lorry consignments with LR numbers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={onSwitchToCustomer}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Open Customer Facing Website"
          >
            <Store className="w-4 h-4" />
            <span>Open Customer Storefront</span>
            <ExternalLink className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-xs text-emerald-200 flex items-center gap-2.5 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* SELLER PERFORMANCE METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Catalog Inventory</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-white dark:text-white light:text-stone-900 mt-0.5 tabular-nums">
            {products.length} Items
          </div>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 block">Live with Image Uploads</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Customer Orders</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 tabular-nums">
            {ordersHistory.length} Bookings
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">{totalUnitsOrdered} total boxes/units</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Orders Pipeline</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Quotation Pipeline Total</span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">Lorry Dispatches</span>
          <div className="font-display text-2xl sm:text-3xl font-black text-rose-400 mt-0.5 tabular-nums">
            {pendingDispatches} Pending
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">{completedDispatches} Dispatched via LR</span>
        </div>
      </div>

      {/* SELLER NAVIGATION TABS */}
      <div className="flex border-b border-stone-800 dark:border-stone-800 light:border-stone-200 space-x-1 sm:space-x-2 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
        
        <button
          onClick={() => setSellerTab('inventory')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'inventory'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory & Images ({products.length})</span>
        </button>

        <button
          onClick={() => setSellerTab('orders')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'orders'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Customer Orders Queue ({ordersHistory.length})</span>
        </button>

        <button
          onClick={() => setSellerTab('customers')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'customers'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Analysis & LTV</span>
        </button>

        <button
          onClick={() => setSellerTab('dispatch')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'dispatch'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Lorry Transport & LR Desk</span>
        </button>

        <button
          onClick={() => setSellerTab('walkin')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'walkin'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Quick Bill / Walk-in Maker</span>
        </button>

        <button
          onClick={() => setSellerTab('analytics')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'analytics'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales & Analytics</span>
        </button>

        <button
          onClick={() => setSellerTab('settings')}
          className={`py-3 px-3.5 sm:px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            sellerTab === 'settings'
              ? 'border-amber-500 text-amber-400 dark:text-amber-400 light:text-amber-800'
              : 'border-transparent text-stone-400 hover:text-white dark:hover:text-white light:hover:text-stone-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Factory Profile & QR</span>
        </button>

      </div>

      {/* TAB 1: PRODUCT & INVENTORY MANAGEMENT (INSERT, UPDATE, DELETE, PHOTO UPLOAD, STOCK TOGGLE) */}
      {sellerTab === 'inventory' && (
        <div className="space-y-6">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Insert Cracker (With Photo)</span>
              </button>

              <button
                onClick={handleExportProductsCSV}
                className="px-3.5 py-2.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-300 dark:text-stone-300 light:text-stone-700 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                title="Download current catalog as CSV"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export CSV Price List</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset catalog back to the official 127 products from 2026 PDF list?')) {
                    resetCatalog();
                    showNotice('Catalog restored to original 127 items.');
                  }
                }}
                className="px-3.5 py-2.5 rounded-xl bg-stone-800 dark:bg-stone-800 light:bg-stone-100 hover:bg-stone-700 text-stone-300 dark:text-stone-300 light:text-stone-700 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to 127 PDF Items</span>
              </button>
            </div>

            {/* Quick Bulk % Modifier */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800">
              <span className="text-xs text-stone-400 font-semibold">Bulk % Surge/Discount:</span>
              <input
                type="number"
                placeholder="+5 or -10"
                value={bulkPercent}
                onChange={(e) => setBulkPercent(e.target.value)}
                className="w-20 px-2.5 py-1.5 text-xs rounded-lg bg-stone-950 border border-stone-700 text-white font-mono font-bold"
              />
              <button
                onClick={handleApplyBulkPercent}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Apply All
              </button>
            </div>
          </div>

          {/* Search, Category & Stock Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by S.No (e.g. 118) or Name (e.g. Sparklers)..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 cursor-pointer sm:w-60"
            >
              <option value="All">All 18 Categories ({products.length})</option>
              {categories.filter((c) => c.is_active).map((c) => (
                <option key={c.category_id} value={c.category_name}>{c.category_name}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 cursor-pointer sm:w-44"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock Only</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          {/* Products Table with Photo Thumbnails, Stock Toggles & Inline Rates */}
          <div className="w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/90 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-950 border-b border-stone-800 text-stone-400 font-bold uppercase">
                    <th className="py-3 px-3 w-12 text-center">Photo</th>
                    <th className="py-3 px-3 w-14 text-center">S.No</th>
                    <th className="py-3 px-4">Cracker Product Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-2 text-center w-16">Unit</th>
                    <th className="py-3 px-3 text-center w-28">Stock Status</th>
                    <th className="py-3 px-4 text-right w-44">Factory Rate (₹)</th>
                    <th className="py-3 px-3 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 text-stone-300">
                  {filteredProducts.map((p) => {
                    const thumb = getProductThumbnail(p);
                    const stock = p.stockStatus || 'IN_STOCK';

                    return (
                      <tr key={p.id} className="hover:bg-stone-850 transition-colors">
                        {/* Photo Thumbnail */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-500 transition-colors cursor-pointer group"
                            title="Click to view/change image"
                          >
                            <img
                              src={thumb}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            {p.imageUrl && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-tl" />
                            )}
                          </button>
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-500 tabular-nums">
                          #{p.sNo}
                        </td>

                        <td className="py-2.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.popular && <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">★ Bestseller</span>}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate max-w-xs">{p.description}</div>
                        </td>

                        <td className="py-2.5 px-3 text-stone-400">
                          {p.category}
                        </td>

                        <td className="py-2.5 px-2 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-stone-300 uppercase">
                            {p.unit}
                          </span>
                        </td>

                        {/* Stock Status Badge (Click to toggle) */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all active:scale-95 ${
                              stock === 'IN_STOCK'
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                                : stock === 'LOW_STOCK'
                                ? 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                                : 'bg-red-950/60 text-red-300 border-red-700/60'
                            }`}
                            title="Click to toggle stock status"
                          >
                            {stock === 'IN_STOCK' ? '✓ In Stock' : stock === 'LOW_STOCK' ? '⚡ Low Stock' : '✕ Out of Stock'}
                          </button>
                        </td>

                        {/* Rate with Quick Buttons */}
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleQuickAdjustRate(p, -5)}
                              className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                              title="Decrease rate by ₹5"
                            >
                              -
                            </button>
                            <span className="font-extrabold text-white tabular-nums text-sm min-w-14 text-center">
                              ₹{p.rate}
                            </span>
                            <button
                              onClick={() => handleQuickAdjustRate(p, +5)}
                              className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                              title="Increase rate by ₹5"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-white text-stone-300 transition-colors cursor-pointer"
                              title="Edit all product details & photo"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-600 hover:text-white text-stone-300 transition-colors cursor-pointer"
                              title="Delete product from catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INCOMING CUSTOMER ORDERS QUEUE & DESPATCH PROCESSING */}
      {sellerTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white dark:text-white light:text-stone-900">
                Customer Orders Queue & Booking Desk
              </h2>
              <p className="text-xs text-stone-400">
                Review bookings, inspect detailed breakdowns, print Sivakasi packing slips, and dispatch lorry consignments.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs font-bold">
              <button
                onClick={() => setOrderFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${orderFilter === 'ALL' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                All ({ordersHistory.length})
              </button>
              <button
                onClick={() => setOrderFilter('PAYMENT_PENDING')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${orderFilter === 'PAYMENT_PENDING' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Payment Pending
              </button>
              <button
                onClick={() => setOrderFilter('PAYMENT_RECEIVED')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${orderFilter === 'PAYMENT_RECEIVED' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Paid / Verified
              </button>
              <button
                onClick={() => setOrderFilter('PACKED')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${orderFilter === 'PACKED' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Packed
              </button>
              <button
                onClick={() => setOrderFilter('DISPATCHED')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${orderFilter === 'DISPATCHED' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Sent via Lorry
              </button>
            </div>
          </div>

          {/* Search Bar for Orders */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders by Order ID (e.g. 1088), customer name, phone, city, or LR number..."
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-stone-900/50 border border-stone-800 text-stone-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                <p>No orders found matching this search or filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-base font-bold text-amber-400">#{order.orderId}</span>
                        <span className="text-stone-500">•</span>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {order.date}
                        </span>
                      </div>
                      <div className="text-xs text-stone-300 mt-1 flex flex-wrap items-center gap-2">
                        <span>Customer: <strong className="text-white">{order.customer.name}</strong></span>
                        <span className="text-stone-500">|</span>
                        <span>Phone: <strong className="font-mono">{order.customer.phone}</strong></span>
                        <span className="text-stone-500">|</span>
                        <span>City: <strong className="text-amber-300">{order.customer.city}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        order.status === 'Sent via Lorry'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : order.status === 'Packed in Sivakasi'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                          : order.status === 'Payment Checked'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}>
                        {order.status}
                      </span>

                      <button
                        onClick={() => setSelectedOrderForDetails(order)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Open detailed order inspector"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Details</span>
                      </button>

                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Print proforma bill"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bill</span>
                      </button>

                      <button
                        onClick={() => setSelectedOrderForPacking(order)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Print godown warehouse packing slip"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Packing Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-stone-500 block">Varieties / Cartons:</span>
                      <strong className="text-stone-200 text-sm">
                        {order.items.length} types ({order.totalBoxes} total boxes)
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Total Amount:</span>
                      <strong className="text-amber-400 text-base font-bold tabular-nums">
                        ₹{order.subtotal.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Lorry Carrier:</span>
                      <span className="text-stone-300">
                        {order.lorryTransport || order.customer.transportPreference}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-500 block">Lorry Receipt (LR) No:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {order.lrNumber || 'Awaiting Lorry Booking'}
                      </span>
                    </div>
                  </div>

                  {/* Seller Action Controls */}
                  <div className="pt-2 border-t border-stone-800 flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleWhatsAppCustomer(order)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
                        title="Send pre-filled WhatsApp update to customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[11px] text-stone-400 font-semibold">Stage Workflow:</span>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.orderId, 'Payment Checked')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          order.status === 'Payment Checked'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        ✓ 1. Mark Paid
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.orderId, 'Packed in Sivakasi')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          order.status === 'Packed in Sivakasi'
                            ? 'bg-blue-600 text-white'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        📦 2. Mark Packed
                      </button>
                      <button
                        onClick={() => {
                          const lr = prompt('Enter Sivakasi Lorry Receipt (LR) Number:', order.lrNumber || ('SVKS-LR-' + Math.floor(100000 + Math.random() * 900000)));
                          if (lr) {
                            handleUpdateOrderStatus(order.orderId, 'Sent via Lorry', lr);
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                          order.status === 'Sent via Lorry'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-800 hover:bg-emerald-700 text-emerald-400'
                        }`}
                      >
                        🚚 3. Mark Dispatched (LR #)
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ANALYSIS & LTV INTELLIGENCE */}
      {sellerTab === 'customers' && (
        <CustomerAnalysisDashboard
          orders={ordersHistory}
          products={products}
          onOpenOrderDetails={(order) => setSelectedOrderForDetails(order)}
        />
      )}

      {/* TAB 4: LORRY TRANSPORT & DISPATCH DESK */}
      {sellerTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="font-display text-xl font-bold text-white dark:text-white light:text-stone-900">
              Sivakasi Lorry Transport & Parcel Dispatch Desk
            </h2>
            <p className="text-xs text-stone-400">
              Manage Sivakasi transport agencies, verify city hub freight charges, and generate official Lorry Receipt (LR) consignment records.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sivakasi Registered Transporters */}
            <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
              <span className="text-[11px] font-bold uppercase text-amber-500 block">Registered Sivakasi Transporters</span>
              <div className="space-y-3">
                {SIVAKASI_TRANSPORTERS.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-white">{t.name}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {t.speed}
                      </span>
                    </div>
                    <div className="text-stone-400 text-[11px]">{t.hub}</div>
                    <div className="text-stone-500 text-[11px] flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" />
                      {t.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick LR Consignment Generator */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
              <span className="text-[11px] font-bold uppercase text-amber-500 block">
                Assign & Book LR (Lorry Receipt) to Customer
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Select Customer Order:</label>
                  <select
                    value={lrInputOrder}
                    onChange={(e) => setLrInputOrder(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                  >
                    {ordersHistory.map((o) => (
                      <option key={o.orderId} value={o.orderId}>
                        #{o.orderId} - {o.customer.name} ({o.customer.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Select Transport Agency:</label>
                  <select
                    value={lrInputTransporter}
                    onChange={(e) => setLrInputTransporter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-white"
                  >
                    {SIVAKASI_TRANSPORTERS.map((t) => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 font-semibold mb-1">Lorry Receipt (LR) Number:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SVKS-LR-891042"
                      value={lrInputNumber}
                      onChange={(e) => setLrInputNumber(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-white font-mono font-bold"
                    />
                    <button
                      onClick={() => {
                        const gen = 'SVKS-LR-' + Math.floor(100000 + Math.random() * 900000);
                        setLrInputNumber(gen);
                        showNotice(`Generated LR: ${gen}`);
                      }}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Generate New
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 items-center justify-between border-t border-stone-800">
                <span className="text-stone-400 text-xs">
                  Updates customer order status to &ldquo;Sent via Lorry&rdquo; and persists LR for tracking.
                </span>
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(lrInputOrder, 'Sent via Lorry', lrInputNumber, lrInputTransporter);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Assign LR & Mark Dispatched</span>
                </button>
              </div>

              {/* City Freight Rates Reference Table */}
              <div className="pt-4 border-t border-stone-800">
                <span className="text-[11px] font-bold uppercase text-stone-400 block mb-2">
                  Sivakasi Freight Per Box Reference (To-Pay Lorry Basis)
                </span>
                <div className="overflow-x-auto rounded-xl border border-stone-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-950 text-stone-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">City Destination</th>
                        <th className="py-2 px-3">Estimated Transit</th>
                        <th className="py-2 px-3">Freight Per Box</th>
                        <th className="py-2 px-3">Primary Parcel Hubs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80 text-stone-300">
                      {DESTINATION_RATES.map((d, idx) => (
                        <tr key={idx} className="hover:bg-stone-850">
                          <td className="py-2 px-3 font-semibold text-white">{d.city}</td>
                          <td className="py-2 px-3 text-stone-400">{d.days}</td>
                          <td className="py-2 px-3 font-mono text-amber-400 font-bold">{d.ratePerBox}</td>
                          <td className="py-2 px-3 text-stone-400 text-[11px]">{d.mainHubs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 5: QUICK BILL / WALKIN QUOTATION MAKER */}
      {sellerTab === 'walkin' && (
        <div className="space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="font-display text-xl font-bold text-white dark:text-white light:text-stone-900">
              Quick Bill / Walk-in Quotation Maker
            </h2>
            <p className="text-xs text-stone-400">
              Create an instant bill or formal estimate for phone inquiries or customers walking directly into the Sivakasi godown.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Customer Information & Summary */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
              <span className="text-[11px] font-bold uppercase text-amber-500 block">Buyer Information</span>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Customer / Shop Name:</label>
                  <input
                    type="text"
                    value={walkinCustomer.name}
                    onChange={(e) => setWalkinCustomer({ ...walkinCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Phone / WhatsApp Number:</label>
                  <input
                    type="text"
                    value={walkinCustomer.phone}
                    onChange={(e) => setWalkinCustomer({ ...walkinCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Destination City:</label>
                  <input
                    type="text"
                    value={walkinCustomer.city}
                    onChange={(e) => setWalkinCustomer({ ...walkinCustomer, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              {/* Order Total & Action */}
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 text-xs space-y-2 pt-4">
                <div className="flex justify-between text-stone-400">
                  <span>Selected Items:</span>
                  <strong className="text-white">{walkinCart.length} varieties</strong>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Total Boxes:</span>
                  <strong className="text-white">{walkinTotalBoxes} units</strong>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-stone-800">
                  <span>Total (Net):</span>
                  <span className="font-display font-black text-amber-400 text-xl tabular-nums">
                    ₹{walkinSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveWalkinOrder}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Save Order & Print Sivakasi Bill</span>
              </button>
            </div>

            {/* Product Quick-Picker */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase text-amber-500 block">
                  Quick Add Products from 2026 Catalog
                </span>
                <span className="text-xs text-stone-400">
                  Click + to add items to walk-in cart
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products to add (e.g. 118, sparklers, 30 shot)..."
                  value={walkinSearch}
                  onChange={(e) => setWalkinSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                {products
                  .filter((p) => {
                    if (!walkinSearch.trim()) return true;
                    const q = walkinSearch.toLowerCase().trim();
                    return p.name.toLowerCase().includes(q) || p.sNo.toString() === q || p.category.toLowerCase().includes(q);
                  })
                  .slice(0, 30)
                  .map((p) => {
                    const existing = walkinCart.find((item) => item.product.id === p.id);
                    const qty = existing ? existing.quantity : 0;

                    return (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-500 font-bold w-10">#{p.sNo}</span>
                          <div>
                            <div className="font-semibold text-white">{p.name}</div>
                            <div className="text-[10px] text-stone-400">{p.category} • {p.unit}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-400 font-mono text-sm">₹{p.rate}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setWalkinCart((prev) => {
                                  const ex = prev.find((i) => i.product.id === p.id);
                                  if (!ex || ex.quantity <= 1) {
                                    return prev.filter((i) => i.product.id !== p.id);
                                  }
                                  return prev.map((i) => (i.product.id === p.id ? { ...i, quantity: i.quantity - 1 } : i));
                                });
                              }}
                              className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 text-white font-bold flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-bold font-mono w-6 text-center text-white">{qty}</span>
                            <button
                              onClick={() => {
                                setWalkinCart((prev) => {
                                  const ex = prev.find((i) => i.product.id === p.id);
                                  if (ex) {
                                    return prev.map((i) => (i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
                                  }
                                  return [...prev, { product: p, quantity: 1 }];
                                });
                              }}
                              className="w-6 h-6 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 6: SALES & ANALYTICS */}
      {sellerTab === 'analytics' && (
        <div className="space-y-8">
          <SellerAnalyticsDashboard orders={ordersHistory} products={products} />

          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white">
              Catalog Master Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400">Total Catalog Inventory</span>
                <div className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  {products.length} Products
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Covering 18 traditional and novelty cracker categories.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400">Bestseller Products</span>
                <div className="font-display text-2xl sm:text-3xl font-black text-amber-500">
                  {products.filter((p) => p.popular).length} Items
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Tagged with bestseller badges on the customer store.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400">Average Unit Rate</span>
                <div className="font-display text-2xl sm:text-3xl font-black text-emerald-500">
                  ₹{Math.round(products.reduce((a, b) => a + b.rate, 0) / products.length)}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Average price per box/packet across catalog.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FACTORY PROFILE & PAYMENT QR SETTINGS */}
      {sellerTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Sivakasi Booking Office Configuration & Payment QR
              </h3>
              <p className="text-xs text-stone-400">
                Customer quotations and WhatsApp messages automatically include these factory credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Payment QR Code Box */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col items-center text-center space-y-3">
                <div className="w-40 h-40 bg-white rounded-xl p-3 shadow-lg flex flex-col items-center justify-center">
                  <div className="w-full h-full border-2 border-dashed border-stone-300 rounded flex flex-col items-center justify-center p-2">
                    <QrCode className="w-20 h-20 text-stone-900" />
                    <span className="text-[9px] font-mono text-stone-700 mt-1 font-bold">UPI / GPAY / PHONPE</span>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="text-stone-400 block text-[11px]">Factory UPI ID:</span>
                  <span className="font-mono font-bold text-amber-400">8124100501@paytm</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Customers scan this QR code or use the mobile number to transfer order payments.
                </p>
              </div>

              {/* Office Details */}
              <div className="md:col-span-2 space-y-4 text-xs">
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Business Name:</label>
                  <input
                    type="text"
                    readOnly
                    value={STORE_INFO.name}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">WhatsApp Booking Number:</label>
                  <input
                    type="text"
                    readOnly
                    value={STORE_INFO.phoneDisplay}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-amber-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Factory Dispatch Address:</label>
                  <input
                    type="text"
                    readOnly
                    value={`${STORE_INFO.address}, ${STORE_INFO.city}, ${STORE_INFO.state} - ${STORE_INFO.pincode}`}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-300"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <strong>Sivakasi Dispatch Policy:</strong> Against payment receipt only, crackers will be dispatched from Sivakasi factory godown.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* INSERT / EDIT PRODUCT MODAL (WITH IMAGE UPLOADER & PRESETS) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5">
            
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {editingProduct ? `Edit Cracker #${editingProduct.sNo} "${editingProduct.name}"` : 'Insert New Cracker Variety'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Set cracker factory price, packaging unit, stock status, and add visual photos.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Product Photo Upload & Presets Section */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3">
                <span className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Cracker Product Photo (Upload or Choose Preset)</span>
                </span>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* Photo Preview Box */}
                  <div className="w-24 h-24 rounded-2xl bg-stone-900 border border-stone-700 overflow-hidden relative shrink-0 shadow">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-[9px]">No Photo</span>
                      </div>
                    )}
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute top-1 right-1 p-1 bg-stone-950/80 text-red-400 hover:text-white rounded-md cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Upload Controls & URL input */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-stone-500 text-[11px]">JPG, PNG, WebP and other image formats • original file preserved</span>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Or paste external image URL (https://...)..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Festive Preset Palette */}
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold mb-1.5">
                    Or select from authentic Sivakasi cracker photo presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CRACKER_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.path })}
                        className={`p-1.5 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                          formData.imageUrl === preset.path
                            ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                        }`}
                      >
                        <img
                          src={preset.path}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-lg object-cover shrink-0"
                        />
                        <div className="truncate">
                          <div className="font-semibold text-[10px] truncate">{preset.label}</div>
                          <div className="text-[9px] text-stone-500">{preset.tag}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    S.No
                  </label>
                  <input
                    type="number"
                    value={formData.sNo}
                    onChange={(e) => setFormData({ ...formData, sNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white font-mono"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-stone-300 font-bold mb-1">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 cm Green Sparklers"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white cursor-pointer"
                  >
                    {categories.filter((c) => c.is_active).map((c) => (
                      <option key={c.category_id} value={c.category_name}>{c.category_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Packaging Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white cursor-pointer"
                  >
                    <option value="Box">Box</option>
                    <option value="Pkt">Pkt</option>
                    <option value="Tube">Tube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white cursor-pointer"
                  >
                    <option value="IN_STOCK">In Stock (Available)</option>
                    <option value="LOW_STOCK">Low Stock (Few Left)</option>
                    <option value="OUT_OF_STOCK">Out of Stock (Sold Out)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Factory Rate (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 150"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Pieces / Pack info
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25 pcs or 15 items"
                    value={formData.pieces}
                    onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe visual effects, crackling sounds, duration..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0"
                  />
                  <span>Mark as Featured Sky Wonder</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-800">
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

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display text-lg font-bold text-white">
                Confirm Product Deletion
              </h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">#{deletingProduct.sNo} {deletingProduct.name}</strong> (₹{deletingProduct.rate}) from the live catalog?
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

      {/* DETAILED ORDER INSPECTOR MODAL */}
      <OrderDetailsModal
        isOpen={!!selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
        order={selectedOrderForDetails}
        onUpdateStatus={handleUpdateOrderStatus}
        onOpenInvoice={(order) => setSelectedOrderForInvoice(order)}
        onOpenPackingSlip={(order) => setSelectedOrderForPacking(order)}
      />

      {/* GODOWN PACKING SLIP MODAL */}
      <PackingSlipModal
        isOpen={!!selectedOrderForPacking}
        onClose={() => setSelectedOrderForPacking(null)}
        order={selectedOrderForPacking}
      />

      {/* PROFORMA INVOICE MODAL (SPECIFIC TO SELECTED ORDER) */}
      <InvoiceModal
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
      />

    </div>
  );
};
