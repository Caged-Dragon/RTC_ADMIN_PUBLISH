import React, { createContext, useContext, useEffect, useState } from 'react';
import { authPasswordSignIn, authGetUser, clearSession, dbSelect, getSession, SupabaseAuthUser, SupabaseSession } from '../lib/supabase';

export type AdminRole = 'primary_admin' | 'admin';
export interface AdminProfile { email: string; displayName: string; role: AdminRole; }
interface AdminAuthContextType {
  session: SupabaseSession | null;
  authUser: SupabaseAuthUser | null;
  admin: AdminProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const Ctx = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(getSession());
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(getSession()?.user || null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const verify = async (s: SupabaseSession | null) => {
    if (!s?.access_token || !s.user?.email) { setAdmin(null); return; }
    try {
      const rows = await dbSelect<any>('admin_access', `select=email,display_name,admin_role,is_active&email=eq.${encodeURIComponent(s.user.email)}&is_active=eq.true&limit=1`, s.access_token);
      if (!rows[0]) throw new Error('This account is not authorized for the admin website.');
      setAdmin({ email: rows[0].email, displayName: rows[0].display_name, role: rows[0].admin_role });
    } catch {
      clearSession();
      setSession(null);
      setAuthUser(null);
      setAdmin(null);
    }
  };

  useEffect(() => {
    const existing = getSession();
    if (!existing) { setLoading(false); return; }
    authGetUser(existing.access_token).then((u) => {
      setAuthUser(u);
      setSession(existing);
      return verify(existing);
    }).catch(() => { clearSession(); setSession(null); setAuthUser(null); setAdmin(null); }).finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const s = await authPasswordSignIn(email.trim().toLowerCase(), password);
    setSession(s); setAuthUser(s.user);
    try {
      const rows = await dbSelect<any>('admin_access', `select=email,display_name,admin_role,is_active&email=eq.${encodeURIComponent(s.user.email || email)}&is_active=eq.true&limit=1`, s.access_token);
      if (!rows[0]) { clearSession(); setSession(null); setAuthUser(null); throw new Error('Invalid admin ID. This account is not permitted to enter admin.rtcrackers.com.'); }
      setAdmin({ email: rows[0].email, displayName: rows[0].display_name, role: rows[0].admin_role });
    } catch (e) {
      if (!(e instanceof Error)) throw e;
      if (e.message.includes('Invalid admin ID')) throw e;
      clearSession(); setSession(null); setAuthUser(null); setAdmin(null);
      throw new Error('Admin authorization could not be verified.');
    }
  };

  const logout = () => { clearSession(); setSession(null); setAuthUser(null); setAdmin(null); };
  return <Ctx.Provider value={{ session, authUser, admin, loading, login, logout }}>{children}</Ctx.Provider>;
};
export const useAdminAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAdminAuth must be used within AdminAuthProvider'); return c; };
export const useAdminAuthOptional = () => useContext(Ctx) || null;
