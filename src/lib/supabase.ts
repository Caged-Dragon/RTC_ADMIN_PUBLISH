export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type?: string;
  user: SupabaseAuthUser;
};

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: Record<string, any>;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://ypmiinmkyvzdpakbkers.supabase.co').replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SESSION_KEY = 'redthunder_supabase_session_v1';

export const supabaseConfig = { url: SUPABASE_URL, publishableKey: SUPABASE_KEY };

export function getSession(): SupabaseSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSession(session: SupabaseSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

async function request(path: string, init: RequestInit = {}, accessToken?: string) {
  const headers = new Headers(init.headers || {});
  headers.set('apikey', SUPABASE_KEY);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  else headers.set('Authorization', `Bearer ${SUPABASE_KEY}`);
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.error_description || data?.error || `Supabase request failed (${res.status})`);
  return data;
}


export async function storageUploadOriginal(file: File, bucket: string, path: string, accessToken: string): Promise<string> {
  if (!file || !accessToken) throw new Error('Admin authorization required.');
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
      'cache-control': '31536000',
    },
    body: file,
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.error || `Image upload failed (${res.status})`);
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
}

export async function dbSelect<T = any>(table: string, query: string, accessToken?: string): Promise<T[]> {
  return request(`/rest/v1/${table}?${query}`, { method: 'GET' }, accessToken);
}

export async function dbInsert<T = any>(table: string, body: any, accessToken?: string): Promise<T[]> {
  return request(`/rest/v1/${table}`, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(body) }, accessToken);
}

export async function dbUpdate<T = any>(table: string, query: string, body: any, accessToken: string): Promise<T[]> {
  return request(`/rest/v1/${table}?${query}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(body) }, accessToken);
}

export async function dbDelete<T = any>(table: string, query: string, accessToken: string): Promise<T[]> {
  return request(`/rest/v1/${table}?${query}`, { method: 'DELETE', headers: { Prefer: 'return=representation' } }, accessToken);
}

export async function rpc<T = any>(fn: string, body: any, accessToken?: string): Promise<T> {
  return request(`/rest/v1/rpc/${fn}`, { method: 'POST', body: JSON.stringify(body) }, accessToken);
}


export async function authGetUser(accessToken: string): Promise<SupabaseAuthUser> {
  return request('/auth/v1/user', { method: 'GET' }, accessToken);
}

export async function authPasswordSignIn(email: string, password: string): Promise<SupabaseSession> {
  const session = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(session);
  return session;
}

export async function authSignUp(email: string, password: string, metadata: Record<string, any> = {}): Promise<{ session: SupabaseSession | null; user: SupabaseAuthUser | null }> {
  const data = await request('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: metadata }) });
  if (data?.session) saveSession(data.session);
  return data;
}

export async function authRefresh(session: SupabaseSession): Promise<SupabaseSession> {
  const data = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: session.refresh_token }) });
  saveSession(data);
  return data;
}

export async function authResetPassword(email: string) {
  await request('/auth/v1/recover', { method: 'POST', body: JSON.stringify({ email }) });
}

export function authProviderUrl(provider: 'google' | 'apple' | 'azure', redirectTo = window.location.origin) {
  return `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
}

export function clearSession() { saveSession(null); }

export function getStoredSupabaseConfig() { return { url: SUPABASE_URL, anonKey: SUPABASE_KEY }; }
export function saveSupabaseConfig() { /* configuration is build-time via Vite env */ }
export function clearSupabaseConfig() { /* configuration is build-time via Vite env */ }
export function getSupabaseClient() { return null; }
export async function testSupabaseConnection() {
  try { await dbSelect('products', 'select=id&limit=1'); return { success: true, message: 'Connected to Supabase.' }; }
  catch (e: any) { return { success: false, message: e.message || 'Connection failed.' }; }
}

export const SUPABASE_SQL_SETUP_SCRIPT = '';
