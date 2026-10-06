import { CartItem, CustomerDetails } from '../context/CartContext';
import { STORE_INFO } from '../data/products';

export function formatWhatsAppMessage(
  cart: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  orderId: string
): string {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let message = `💥 *${STORE_INFO.name} - 2026 ORDER* 💥\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔖 *Order ID:* ${orderId}\n`;
  message += `📅 *Date:* ${dateStr}\n\n`;

  message += `👤 *CUSTOMER DETAILS:*\n`;
  message += `• Name: ${customer.name || 'Valued Customer'}\n`;
  message += `• Phone: ${customer.phone || 'Not provided'}\n`;
  if (customer.address) message += `• Address: ${customer.address}\n`;
  if (customer.city) message += `• City / Town: ${customer.city}\n`;
  if (customer.pincode) message += `• Pincode: ${customer.pincode}\n`;
  if (customer.state) message += `• State: ${customer.state}\n`;
  if (customer.transportPreference) message += `• Transport: ${customer.transportPreference}\n`;
  if (customer.notes) message += `• Notes: ${customer.notes}\n`;

  message += `\n📦 *ORDER ITEMS (${cart.length} varieties, ${cart.reduce((s, i) => s + i.quantity, 0)} units):*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;

  cart.forEach((item, index) => {
    const lineTotal = item.product.rate * item.quantity;
    message += `${index + 1}. [S.No ${item.product.sNo}] *${item.product.name}*\n`;
    message += `   └ ${item.quantity} ${item.product.unit} @ ₹${item.product.rate} = *₹${lineTotal.toLocaleString('en-IN')}*\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🧾 *SUBTOTAL: ₹${subtotal.toLocaleString('en-IN')}*\n`;
  message += `\n📍 *Dispatch Location:* Sivakasi, Tamil Nadu\n`;
  message += `⚠️ *Note:* Please confirm product availability & transport delivery charges to ${customer.city || 'my location'} before payment.\n`;
  message += `\nThank you! 🙏`;

  return message;
}

export function getWhatsAppUrl(
  cart: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  orderId: string
): string {
  const text = formatWhatsAppMessage(cart, customer, subtotal, orderId);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${STORE_INFO.phone}?text=${encodedText}`;
}
