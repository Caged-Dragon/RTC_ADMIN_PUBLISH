import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, CATEGORIES, STORE_INFO } from './src/data/products.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory orders store for tracking
interface StoredOrder {
  orderId: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    state: string;
    pincode: string;
    transportPreference: string;
  };
  items: Array<{
    productId: number;
    sNo: number;
    name: string;
    unit: string;
    rate: number;
    quantity: number;
    lineTotal: number;
  }>;
  totalBoxes: number;
  subtotal: number;
  status: 'QUOTATION_CREATED' | 'WHATSAPP_SENT' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'DISPATCHED_SIVAKASI';
  trackingNumber?: string;
  lorryTransportName?: string;
}

const ordersStore: Map<string, StoredOrder> = new Map();

// Sample pre-seeded demo orders for instant order tracking demonstration
ordersStore.set('RT-2026-1088', {
  orderId: 'RT-2026-1088',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  customer: {
    name: 'Muthu Krishnan',
    phone: '9840123456',
    city: 'Chennai',
    address: 'No 45, Anna Nagar West',
    state: 'Tamil Nadu',
    pincode: '600040',
    transportPreference: 'Lorry Transport Parcel Office Pickup',
  },
  items: [
    { productId: 122, sNo: 122, name: 'Tulip ( 35 Items )', unit: 'Box', rate: 1000, quantity: 2, lineTotal: 2000 },
    { productId: 1, sNo: 1, name: '10 cm Electric Sparklers', unit: 'Box', rate: 24, quantity: 5, lineTotal: 120 },
    { productId: 25, sNo: 25, name: 'Flower Pot Big', unit: 'Box', rate: 91, quantity: 4, lineTotal: 364 },
    { productId: 97, sNo: 97, name: '30 Shot Multi colour', unit: 'Box', rate: 650, quantity: 1, lineTotal: 650 },
  ],
  totalBoxes: 12,
  subtotal: 3134,
  status: 'DISPATCHED_SIVAKASI',
  trackingNumber: 'SVKS-LR-782194',
  lorryTransportName: 'KPN / ARC Parcels Sivakasi Booking',
});

// Sivakasi Freight / Lorry Transport Rates by Destination Hub
const TRANSPORT_DESTINATIONS = [
  { city: 'Chennai', state: 'Tamil Nadu', approxDays: '1 - 2 Days', freightPerBox: '₹120 - ₹180', hubs: ['Koyambedu', 'Madhavaram', 'Guindy', 'Tambaram'] },
  { city: 'Madurai', state: 'Tamil Nadu', approxDays: 'Same Day / 1 Day', freightPerBox: '₹80 - ₹120', hubs: ['Mattuthavani', 'Arapalayam'] },
  { city: 'Coimbatore', state: 'Tamil Nadu', approxDays: '1 - 2 Days', freightPerBox: '₹110 - ₹160', hubs: ['Gandhipuram', 'Ukkadam', 'Singanallur'] },
  { city: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', approxDays: '1 Day', freightPerBox: '₹100 - ₹140', hubs: ['Central Bus Stand Hub', 'Palakarai'] },
  { city: 'Salem', state: 'Tamil Nadu', approxDays: '1 - 2 Days', freightPerBox: '₹110 - ₹150', hubs: ['New Bus Stand Hub', 'Seelanaickenpatti'] },
  { city: 'Tirunelveli', state: 'Tamil Nadu', approxDays: '1 Day', freightPerBox: '₹80 - ₹120', hubs: ['Vannarpettai', 'New Bus Stand'] },
  { city: 'Bangalore', state: 'Karnataka', approxDays: '2 - 3 Days', freightPerBox: '₹160 - ₹240', hubs: ['Kalasipalya', 'Yeshwanthpur', 'Bommasandra'] },
  { city: 'Hyderabad', state: 'Telangana', approxDays: '3 - 4 Days', freightPerBox: '₹220 - ₹320', hubs: ['Kukatpally', 'Afzal Gunj', 'Secunderabad'] },
  { city: 'Kochi / Ernakulam', state: 'Kerala', approxDays: '2 - 3 Days', freightPerBox: '₹180 - ₹260', hubs: ['Kaloor', 'Willingdon Island', 'Aluva'] },
  { city: 'Vijayawada', state: 'Andhra Pradesh', approxDays: '3 - 4 Days', freightPerBox: '₹240 - ₹340', hubs: ['Autonagar', 'Governorpet'] },
];

// Live in-memory mutable products array initialized from catalog
let liveProducts = [...PRODUCTS];

// API Routes
app.get('/api/info', (_req: Request, res: Response) => {
  res.json({
    ...STORE_INFO,
    totalProducts: liveProducts.length,
    categoriesCount: CATEGORIES.length - 1,
    catalogYear: 2026,
    dispatchedFrom: 'Sivakasi Factory Godown, Tamil Nadu',
    terms: 'Against payment receipt only, crackers will be dispatched from Sivakasi.',
  });
});

app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort } = req.query;
  let items = [...liveProducts];

  if (category && typeof category === 'string' && category !== 'All Items') {
    items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sNo.toString() === q ||
        `#${p.sNo}` === q
    );
  }

  if (sort === 'priceAsc') {
    items.sort((a, b) => a.rate - b.rate);
  } else if (sort === 'priceDesc') {
    items.sort((a, b) => b.rate - a.rate);
  } else if (sort === 'name') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    items.sort((a, b) => a.sNo - b.sNo);
  }

  res.json({
    total: items.length,
    products: items,
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = liveProducts.find((p) => p.id === id || p.sNo === id);
  if (!item) {
    return res.status(404).json({ error: 'Product not found in 2026 catalog' });
  }
  res.json(item);
});

// Admin Insert Product
app.post('/api/products', (req: Request, res: Response) => {
  const { name, category, unit, rate, description, pieces, popular, featured } = req.body;

  if (!name || typeof rate !== 'number') {
    return res.status(400).json({ error: 'Product name and numeric rate are required' });
  }

  const newId = liveProducts.length > 0 ? Math.max(...liveProducts.map((p) => p.id)) + 1 : 1;
  const newSNo = liveProducts.length > 0 ? Math.max(...liveProducts.map((p) => p.sNo)) + 1 : 1;

  const newProduct = {
    id: newId,
    sNo: req.body.sNo ? parseInt(req.body.sNo, 10) : newSNo,
    name: name.trim(),
    category: category ? category.trim() : 'Fountain Special',
    unit: unit || 'Box',
    rate: Math.max(1, rate),
    description: description ? description.trim() : 'Authentic Sivakasi festive fireworks item',
    pieces: pieces ? pieces.trim() : undefined,
    popular: !!popular,
    featured: !!featured,
    imageUrl: req.body.imageUrl || undefined,
    stockStatus: req.body.stockStatus || 'IN_STOCK',
  };

  liveProducts.push(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// Admin Update Product Details
app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const index = liveProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found to update' });
  }

  const current = liveProducts[index];
  const updatedProduct = {
    ...current,
    ...req.body,
    id: current.id, // prevent mutating id
    rate: typeof req.body.rate === 'number' ? Math.max(1, req.body.rate) : current.rate,
  };

  liveProducts[index] = updatedProduct;
  res.json({ success: true, product: updatedProduct });
});

// Admin Delete Product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const initialLen = liveProducts.length;
  liveProducts = liveProducts.filter((p) => p.id !== id);

  if (liveProducts.length === initialLen) {
    return res.status(404).json({ error: 'Product not found to delete' });
  }

  res.json({ success: true, message: `Product #${id} deleted successfully` });
});

// Admin Reset Catalog to Original 127 items from PDF
app.post('/api/products/reset', (_req: Request, res: Response) => {
  liveProducts = [...PRODUCTS];
  res.json({ success: true, count: liveProducts.length, message: 'Catalog reset to original 127 items' });
});

app.get('/api/categories', (_req: Request, res: Response) => {
  const stats = CATEGORIES.map((cat) => ({
    name: cat,
    count: cat === 'All Items' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length,
  }));
  res.json(stats);
});

app.get('/api/transport-rates', (_req: Request, res: Response) => {
  res.json({
    origin: 'Sivakasi, Tamil Nadu - 626189',
    notice: 'Freight charges are collected by the transport agency at the destination parcel office (To-Pay basis) or added to final quotation upon request.',
    destinations: TRANSPORT_DESTINATIONS,
  });
});

// Create Order / Quotation
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least 1 product item' });
  }

  const orderId = `RT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  let calculatedSubtotal = 0;
  let totalUnits = 0;

  const verifiedItems = items.map((cartItem: { productId: number; quantity: number }) => {
    const product = PRODUCTS.find((p) => p.id === cartItem.productId);
    if (!product) {
      throw new Error(`Product ID ${cartItem.productId} not found`);
    }
    const qty = Math.max(1, cartItem.quantity || 1);
    const lineTotal = product.rate * qty;
    calculatedSubtotal += lineTotal;
    totalUnits += qty;

    return {
      productId: product.id,
      sNo: product.sNo,
      name: product.name,
      unit: product.unit,
      rate: product.rate,
      quantity: qty,
      lineTotal,
    };
  });

  const newOrder: StoredOrder = {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: customer?.name || 'Valued Customer',
      phone: customer?.phone || '',
      city: customer?.city || 'Sivakasi Destination',
      address: customer?.address || '',
      state: customer?.state || 'Tamil Nadu',
      pincode: customer?.pincode || '',
      transportPreference: customer?.transportPreference || 'Lorry Transport Parcel Office Pickup',
    },
    items: verifiedItems,
    totalBoxes: totalUnits,
    subtotal: calculatedSubtotal,
    status: 'QUOTATION_CREATED',
  };

  ordersStore.set(orderId, newOrder);

  res.status(201).json({
    success: true,
    orderId,
    order: newOrder,
    whatsAppDirectUrl: `https://wa.me/${STORE_INFO.phone}?text=${encodeURIComponent(
      `💥 *REDTHUNDER CRACKERS - 2026 ORDER #${orderId}* 💥\n` +
      `Customer: ${newOrder.customer.name} (${newOrder.customer.phone})\n` +
      `City: ${newOrder.customer.city}, ${newOrder.customer.state}\n` +
      `Items: ${newOrder.items.length} varieties, ${totalUnits} units\n` +
      `Estimated Amount: ₹${calculatedSubtotal.toLocaleString('en-IN')}\n` +
      `Please confirm stock & transport freight from Sivakasi.`
    )}`,
  });
});

// List all orders (for My Orders query)
app.get('/api/orders', (_req: Request, res: Response) => {
  const allOrders = Array.from(ordersStore.values()).reverse();
  res.json(allOrders);
});

// Send Order or Quotation via Email API
app.post('/api/send-email', (req: Request, res: Response) => {
  const { toEmail, customerName, orderId, subtotal, itemsCount, message } = req.body;

  if (!toEmail) {
    return res.status(400).json({ error: 'Recipient email address is required' });
  }

  // Simulated email dispatch log
  console.log(`[Email Service] Sent Sivakasi Quotation #${orderId || 'NEW'} to ${toEmail}`);
  
  res.json({
    success: true,
    sentTo: toEmail,
    orderId: orderId || 'Direct Inquiry',
    deliveryStatus: 'Email quotation dispatched successfully',
    timestamp: new Date().toISOString(),
  });
});

// Track Order status
app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = ordersStore.get(orderId.trim());
  if (!order) {
    return res.status(404).json({ error: 'Order ID not found. Please verify the ID or check with our WhatsApp team at 8124100501.' });
  }
  res.json(order);
});

// Vite Middleware for Dev or Static Serving in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[RedThunder Crackers] Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
