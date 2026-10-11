import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../data/products';
import { dbSelect, dbSelectAll, rpc } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductsContext';
import { useAdminAuthOptional } from './AdminAuthContext';

export interface CartItem { product: Product & { dbId?: string }; quantity: number; }
export interface CustomerDetails { name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string; transportPreference: string; notes: string; district?: string; }
export interface PlacedOrder { orderId: string; date: string; customer: CustomerDetails; items: CartItem[]; totalBoxes: number; subtotal: number; status: any; lorryTransport?: string; lrNumber?: string; dbId?: string; guestTrackingToken?: string; }

interface CartContextType {
  cart: CartItem[]; addToCart:(p:Product,q?:number)=>void; updateQuantity:(id:number,q:number)=>void; removeFromCart:(id:number)=>void; clearCart:()=>void; getItemQuantity:(id:number)=>number; totalItems:number; totalBoxes:number; subtotal:number; isCartOpen:boolean; setIsCartOpen:(v:boolean)=>void; customerDetails:CustomerDetails; updateCustomerDetails:(d:Partial<CustomerDetails>)=>void; ordersHistory:PlacedOrder[]; addPlacedOrder:(order?:PlacedOrder)=>Promise<PlacedOrder>; placeOrder:()=>Promise<PlacedOrder>; updateOrderStatus:(orderId:string,status:any,lrNumber?:string,lorryTransport?:string)=>void; reorder:(items:CartItem[])=>void;
}
const CartContext=createContext<CartContextType|undefined>(undefined);
const CART_KEY='redthunder_cart_v4';
const CUSTOMER_KEY='redthunder_customer_v4';

const defaultCustomer:CustomerDetails={name:'',phone:'',email:'',address:'',city:'Chennai',state:'Tamil Nadu',pincode:'',transportPreference:'Parcel Office Pickup in My City (Standard & Cheap)',notes:'',district:''};

function loadJson<T>(key:string,fallback:T):T { try { const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; } catch { return fallback; } }

export const CartProvider:React.FC<{children:React.ReactNode}>=({children})=>{
  const {user,session,isAuthenticated}=useAuth();
  const {products}=useProducts();
  const adminAuth = useAdminAuthOptional();
  const adminToken = adminAuth?.session?.access_token;
  const [cart,setCart]=useState<CartItem[]>(()=>loadJson(CART_KEY,[]));
  const [customerDetails,setCustomerDetails]=useState<CustomerDetails>(()=>loadJson(CUSTOMER_KEY,defaultCustomer));
  const [ordersHistory,setOrdersHistory]=useState<PlacedOrder[]>([]);
  const [isCartOpen,setIsCartOpen]=useState(false);

  useEffect(()=>{ localStorage.setItem(CART_KEY,JSON.stringify(cart)); },[cart]);
  useEffect(()=>{ localStorage.setItem(CUSTOMER_KEY,JSON.stringify(customerDetails)); },[customerDetails]);
  useEffect(()=>{ if(user) setCustomerDetails(p=>({...p,name:user.name||p.name,phone:user.phone||p.phone,email:user.email||p.email,city:user.city||p.city,address:user.address||p.address,state:user.state||p.state,pincode:user.pincode||p.pincode,district:user.district||p.district})); },[user]);

  const refreshOrders=async()=>{
    const token = adminAuth?.admin && adminToken ? adminToken : session?.access_token;
    if(!token || (!isAuthenticated && !adminAuth?.admin)) { setOrdersHistory([]); return; }
    try {
      const rows:any[]=await dbSelectAll<any>('orders','select=*,order_items(*),order_tracking(*)&order=created_at.desc',token);
      setOrdersHistory(rows.map(mapDbOrder));
    } catch(e){ console.error('Order history load failed',e); }
  };
  useEffect(()=>{refreshOrders();},[session?.access_token,isAuthenticated,adminToken,adminAuth?.admin]);

  const addToCart=(product:Product,q=1)=>setCart(prev=>{const found=prev.find(i=>i.product.id===product.id);return found?prev.map(i=>i.product.id===product.id?{...i,quantity:i.quantity+Math.max(1,q)}:i):[...prev,{product,quantity:Math.max(1,q)}];});
  const updateQuantity=(id:number,q:number)=>setCart(prev=>q<=0?prev.filter(i=>i.product.id!==id):prev.map(i=>i.product.id===id?{...i,quantity:q}:i));
  const removeFromCart=(id:number)=>setCart(prev=>prev.filter(i=>i.product.id!==id));
  const clearCart=()=>setCart([]);
  const getItemQuantity=(id:number)=>cart.find(i=>i.product.id===id)?.quantity||0;
  const updateCustomerDetails=(d:Partial<CustomerDetails>)=>setCustomerDetails(p=>({...p,...d}));
  const totalBoxes=useMemo(()=>cart.reduce((s,i)=>s+i.quantity,0),[cart]);
  const totalItems=cart.length;
  const subtotal=useMemo(()=>cart.reduce((s,i)=>s+i.product.rate*i.quantity,0),[cart]);

  const submitOrder=async(customer:CustomerDetails,lines:CartItem[],authToken?:string,asUserId?:string|null):Promise<PlacedOrder>=>{
    if(!lines.length) throw new Error('Your cart is empty.');
    if(!customer.name.trim() || !customer.phone.trim() || !customer.city.trim()) throw new Error('Please complete your name, phone and city.');
    const items=lines.map(i=>({product_id:(i.product as any).dbId || products.find(p=>p.id===i.product.id)?.dbId,quantity:i.quantity}));
    if(items.some(i=>!i.product_id)) throw new Error('A product in the cart is no longer available. Please refresh the product list.');
    const result:any=await rpc('create_order',{p_user_id:asUserId??null,p_customer_email:customer.email||null,p_customer_phone:customer.phone,p_shipping:{first_name:customer.name.split(/\s+/)[0],last_name:customer.name.split(/\s+/).slice(1).join(' '),phone:customer.phone,address_line_1:customer.address,city:customer.city,district:customer.district||'',state:customer.state,postal_code:customer.pincode,country:'India'},p_items:items,p_payment_method:'whatsapp_booking',p_customer_note:customer.notes||null},authToken);
    return {orderId:String(result.order_number),date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),customer,items:[...lines],totalBoxes:Number(result.total_boxes_count),subtotal:Number(result.subtotal),status:'pending',guestTrackingToken:result.guest_tracking_token,dbId:result.id};
  };

  const placeOrder=async():Promise<PlacedOrder>=>{
    if(!customerDetails.email.trim() && !isAuthenticated) throw new Error('Guest checkout requires an email address.');
    const order=await submitOrder(customerDetails,cart,session?.access_token,user?.id||null);
    setOrdersHistory(prev=>[order,...prev]);
    clearCart();
    return order;
  };

  // Admin / walk-in order: uses the order that was passed in (not the shopping cart) and saves it for real.
  const addPlacedOrder=async(order?:PlacedOrder):Promise<PlacedOrder>=>{
    if(!order) return placeOrder();
    if(!adminAuth?.admin || !adminToken) throw new Error('Admin session required to record an order.');
    const customer={...order.customer,email:order.customer.email||'walkin@redthunder.in'};
    const created=await submitOrder(customer,order.items,adminToken,null);
    if(order.status && order.status!=='pending'){
      await setStatusRpc(created.orderId,order.status);
    }
    const saved={...created,status:order.status||created.status};
    await refreshOrders();
    return saved;
  };
  const STATUS_MAP:any={'Payment Checked':'PAYMENT_VERIFIED','Packed in Sivakasi':'PACKED_AT_GODOWN','Sent via Lorry':'DISPATCHED_LORRY','Order Placed':'pending','WhatsApp Sent':'QUOTATION_SENT'};
  // One atomic database call updates the order and writes its tracking entry together.
  const setStatusRpc=async(orderId:string,status:any,lrNumber?:string,lorryTransport?:string)=>{
    if(!adminAuth?.admin || !adminToken) throw new Error('Admin session required to update orders.');
    const orderNumber=Number(orderId);
    if(!Number.isFinite(orderNumber)) throw new Error('Invalid order number.');
    const dbStatus=STATUS_MAP[status]||status;
    let transporterName:string|null=null;
    let note:string|null=null;
    const typed=lorryTransport?.trim();
    if(typed){
      const t=await dbSelect<any>('transporters',`select=transporter_name&transporter_name=eq.${encodeURIComponent(typed)}&limit=1`,adminToken);
      if(t[0]) transporterName=t[0].transporter_name;
      else note=`Status updated by admin • Transporter: ${typed}${lrNumber?` • LR ${lrNumber}`:''}`;
    }
    await rpc('admin_set_order_status',{p_order_number:orderNumber,p_status:dbStatus,p_lr_number:lrNumber!==undefined?lrNumber:null,p_transporter_name:transporterName,p_note:note},adminToken);
  };
  const updateOrderStatus=async(orderId:string,status:any,lrNumber?:string,lorryTransport?:string)=>{
    await setStatusRpc(orderId,status,lrNumber,lorryTransport);
    await refreshOrders();
  };
  const reorder=(items:CartItem[])=>setCart(items.map(i=>({...i}))); 

  return <CartContext.Provider value={{cart,addToCart,updateQuantity,removeFromCart,clearCart,getItemQuantity,totalItems,totalBoxes,subtotal,isCartOpen,setIsCartOpen,customerDetails,updateCustomerDetails,ordersHistory,addPlacedOrder,placeOrder,updateOrderStatus,reorder}}>{children}</CartContext.Provider>;
};

function mapDbOrder(o:any):PlacedOrder {
  return {orderId:String(o.order_number),date:new Date(o.created_at||o.placed_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),customer:{name:[o.shipping_first_name,o.shipping_last_name].filter(Boolean).join(' '),phone:o.shipping_phone||o.customer_phone||'',email:o.customer_email||'',address:o.shipping_address_line_1||'',city:o.shipping_city||'',state:o.shipping_state||'',pincode:o.shipping_postal_code||'',transportPreference:o.lorry_transporter_id||'',notes:o.customer_note||'',district:o.shipping_district||''},items:(o.order_items||[]).map((i:any)=>({product:{id:Number(i.product_code),dbId:i.product_id,sNo:Number(i.product_code),name:i.product_name,category:i.category,unit:i.pack_type,rate:Number(i.unit_price),description:'',imageUrl:i.product_image},quantity:Number(i.quantity)})),totalBoxes:Number(o.total_boxes_count||0),subtotal:Number(o.subtotal||0),status:({'PAYMENT_VERIFIED':'Payment Checked','PACKED_AT_GODOWN':'Packed in Sivakasi','DISPATCHED_LORRY':'Sent via Lorry','QUOTATION_SENT':'WhatsApp Sent'} as any)[o.status]||o.status,lrNumber:o.lr_number,dbId:o.id,guestTrackingToken:o.guest_tracking_token};
}
export const useCart=()=>{const c=useContext(CartContext);if(!c)throw new Error('useCart must be used within CartProvider');return c;};
