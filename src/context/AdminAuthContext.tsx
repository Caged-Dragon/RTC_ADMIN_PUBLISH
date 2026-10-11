import React, { createContext, useContext, useEffect, useState } from 'react';
import { authPasswordSignIn, authGetUser, clearSession, dbSelect, getSession, onSessionChange, SupabaseAuthUser, SupabaseSession } from '../lib/supabase';

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

// Same message for a wrong password and for a valid non-admin account, so the login form
// cannot be used to find out which accounts or passwords exist.
const LOGIN_FAILED = 'Invalid admin ID or password.';

/** Looks the signed-in user up in public.admin_access. RLS only returns the caller's own active row. */
async function fetchAdminProfile(s: SupabaseSession): Promise<AdminProfile | null> {
  if (!s.access_token || !s.user?.id) return null;
  const rows = await dbSelect<any>(
    'admin_access',
    `select=email,display_name,admin_role,is_active&auth_user_id=eq.${encodeURIComponent(s.user.id)}&is_active=eq.true&limit=1`,
    s.access_token,
  );
  const row = rows[0];
  if (!row) return null;
  return { email: row.email, displayName: row.display_name, role: row.admin_role };
}

export const AdminAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(getSession());
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(getSession()?.user || null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep React state in step with the stored session: token refreshes update it, sign-out clears it.
  useEffect(() => onSessionChange((s) => {
    setSession(s);
    setAuthUser(s?.user || null);
    if (!s) setAdmin(null);
  }), []);

  useEffect(() => {
    let active = true;
    (async () => {
      const existing = getSession();
      if (!existing) { setLoading(false); return; }
      try {
        await authGetUser(existing.access_token); // refreshes an expired token automatically
        const current = getSession();
        if (!current) throw new Error('Session ended');
        const profile = await fetchAdminProfile(current);
        if (!profile) throw new Error('Not an administrator');
        if (active) { setSession(current); setAuthUser(current.user); setAdmin(profile); }
      } catch {
        clearSession();
        if (active) { setSession(null); setAuthUser(null); setAdmin(null); }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const login = async (email: string, password: string) => {
    let s: SupabaseSession;
    try {
      s = await authPasswordSignIn(email.trim().toLowerCase(), password);
    } catch (e: any) {
      const msg = String(e?.message || '');
      if (/failed to fetch|network|not configured/i.test(msg)) throw new Error(msg || 'Network error. Please try again.');
      throw new Error(LOGIN_FAILED);
    }
    try {
      const profile = await fetchAdminProfile(s);
      if (!profile) { clearSession(); throw new Error(LOGIN_FAILED); }
      setSession(s); setAuthUser(s.user); setAdmin(profile);
    } catch (e: any) {
      clearSession();
      setAdmin(null);
      if (e?.message === LOGIN_FAILED) throw e;
      throw new Error('Admin authorization could not be verified. Please try again.');
    }
  };

  const logout = () => { clearSession(); setSession(null); setAuthUser(null); setAdmin(null); };
  return <Ctx.Provider value={{ session, authUser, admin, loading, login, logout }}>{children}</Ctx.Provider>;
};
export const useAdminAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAdminAuth must be used within AdminAuthProvider'); return c; };
export const useAdminAuthOptional = () => useContext(Ctx) || null;
