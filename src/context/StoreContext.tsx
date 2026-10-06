import React, { createContext, useContext, useEffect, useState } from 'react';
import { dbSelect } from '../lib/supabase';
import { STORE_INFO as FALLBACK_INFO, StoreInfo } from '../data/products';

interface StoreContextValue { storeInfo: StoreInfo; loading: boolean; }
const StoreContext=createContext<StoreContextValue>({storeInfo:FALLBACK_INFO,loading:true});
export const StoreProvider:React.FC<{children:React.ReactNode}>=({children})=>{
  const [storeInfo,setStoreInfo]=useState<StoreInfo>(FALLBACK_INFO);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ dbSelect<any>('company_profile','select=company_name,tagline,physical_address,city,state,postal_code,country,mobile,whatsapp_number,logo_url&is_active=eq.true&limit=1').then(rows=>{const r=rows[0];if(r)setStoreInfo({...FALLBACK_INFO,name:r.company_name||FALLBACK_INFO.name,tagline:r.tagline||FALLBACK_INFO.tagline,phone:(r.whatsapp_number||r.mobile||FALLBACK_INFO.phone).replace(/^\+/,''),phoneDisplay:r.whatsapp_number||r.mobile||FALLBACK_INFO.phoneDisplay,address:r.physical_address||FALLBACK_INFO.address,city:r.city||FALLBACK_INFO.city,state:r.state||FALLBACK_INFO.state,pincode:r.postal_code||FALLBACK_INFO.pincode,logoUrl:r.logo_url||FALLBACK_INFO.logoUrl});}).catch(()=>{}).finally(()=>setLoading(false));},[]);
  return <StoreContext.Provider value={{storeInfo,loading}}>{children}</StoreContext.Provider>;
};
export const useStore=()=>useContext(StoreContext);
