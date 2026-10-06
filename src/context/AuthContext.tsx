import React, { createContext, useContext, useEffect, useState } from 'react';
import { authGetUser, authPasswordSignIn, authProviderUrl, authRefresh, authResetPassword, authSignUp, clearSession, dbSelect, dbUpdate, getSession, SupabaseAuthUser, SupabaseSession } from '../lib/supabase';

export interface UserProfile { id?: string; authUserId?: string; name: string; phone: string; email: string; city?: string; address?: string; district?: string; state?: string; pincode?: string; }
interface AuthContextType { user: UserProfile | null; authUser: SupabaseAuthUser | null; session: SupabaseSession | null; isAuthenticated: boolean; loading: boolean; login: (name: string, phone: string, email?: string, password?: string) => Promise<void>; signup: (name: string, phone: string, email: string, password: string) => Promise<void>; loginWithProvider: (provider: 'google'|'apple'|'azure') => void; resetPassword: (email: string) => Promise<void>; logout: () => void; updateProfile: (details: Partial<UserProfile>) => Promise<void>; refreshProfile: () => Promise<void>; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function profileFromRow(row: any, authUser?: SupabaseAuthUser | null): UserProfile {
  return { id: row?.id, authUserId: row?.auth_user_id || authUser?.id, name: row?.full_name || [row?.first_name, row?.last_name].filter(Boolean).join(' ') || authUser?.user_metadata?.full_name || '', phone: row?.phone_number || row?.phone || authUser?.phone || '', email: row?.email || authUser?.email || '', city: row?.city, address: row?.street_address || row?.address_line_1, district: row?.district, state: row?.state, pincode: row?.pincode || row?.postal_code };
}

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [session, setSession] = useState<SupabaseSession | null>(getSession());
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(getSession()?.user || null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!session?.user?.id) { setUser(null); return; }
    try {
      const rows = await dbSelect<any>('users', `select=*&auth_user_id=eq.${session.user.id}&limit=1`, session.access_token);
      if (rows[0]) setUser(profileFromRow(rows[0], session.user));
    } catch (e) { console.error('Profile load failed', e); }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let s = getSession();
        if (!s && window.location.hash.includes('access_token=')) {
          const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
          const access_token = hash.get('access_token');
          const refresh_token = hash.get('refresh_token');
          if (access_token && refresh_token) {
            const u = await authGetUser(access_token);
            s = { access_token, refresh_token, expires_in: Number(hash.get('expires_in') || 3600), expires_at: Math.floor(Date.now()/1000) + Number(hash.get('expires_in') || 3600), token_type: hash.get('token_type') || 'bearer', user: u };
            localStorage.setItem('redthunder_supabase_session_v1', JSON.stringify(s));
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
        }
        if (s?.refresh_token && s.expires_at && s.expires_at < Date.now()/1000 + 60) s = await authRefresh(s);
        if (active) { setSession(s); setAuthUser(s?.user || null); }
      } catch { clearSession(); if (active) { setSession(null); setAuthUser(null); } }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => { if (session) refreshProfile(); else setUser(null); }, [session?.access_token]);

  const login = async (name: string, phone: string, email = '', password = '') => {
    if (!email || !password) throw new Error('Email and password are required for customer sign in.');
    const s = await authPasswordSignIn(email.trim(), password);
    setSession(s); setAuthUser(s.user);
    await refreshProfile();
  };
  const signup = async (name: string, phone: string, email: string, password: string) => {
    const data = await authSignUp(email.trim(), password, { full_name: name.trim(), phone: phone.trim() });
    if (data.session) { setSession(data.session); setAuthUser(data.session.user); }
    else throw new Error('Account created. Please verify your email, then sign in.');
  };
  const loginWithProvider = (provider: 'google'|'apple'|'azure') => { window.location.href = authProviderUrl(provider); };
  const resetPassword = (email: string) => authResetPassword(email.trim());
  const logout = () => { clearSession(); setSession(null); setAuthUser(null); setUser(null); };
  const updateProfile = async (details: Partial<UserProfile>) => {
    if (!session?.user?.id) throw new Error('Please sign in first.');
    const rows = await dbSelect<any>('users', `select=id&auth_user_id=eq.${session.user.id}&limit=1`, session.access_token);
    if (!rows[0]) throw new Error('Customer profile not found.');
    const body: any = {};
    if (details.name !== undefined) { body.full_name = details.name; const [f,...rest]=details.name.trim().split(/\s+/); body.first_name=f||null; body.last_name=rest.join(' ')||null; }
    if (details.phone !== undefined) { body.phone = details.phone; body.phone_number = details.phone; }
    if (details.city !== undefined) body.city = details.city;
    if (details.address !== undefined) { body.street_address = details.address; body.address_line_1 = details.address; }
    if (details.district !== undefined) body.district = details.district;
    if (details.state !== undefined) body.state = details.state;
    if (details.pincode !== undefined) { body.pincode = details.pincode; body.postal_code = details.pincode; }
    const updated = await dbUpdate<any>('users', `id=eq.${rows[0].id}`, body, session.access_token);
    if (updated[0]) setUser(profileFromRow(updated[0], session.user));
  };

  return <AuthContext.Provider value={{user, authUser, session, isAuthenticated: !!session, loading, login, signup, loginWithProvider, resetPassword, logout, updateProfile, refreshProfile}}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const c=useContext(AuthContext); if(!c) throw new Error('useAuth must be used within AuthProvider'); return c; };
