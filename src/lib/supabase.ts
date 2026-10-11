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

type SessionListener = (session: SupabaseSession | null) => void;
const sessionListeners = new Set<SessionListener>();
/** Subscribe to session changes (sign-in, token refresh, sign-out). Returns an unsubscribe function. */
export function onSessionChange(cb: SessionListener): () => void {
  sessionListeners.add(cb);
  return () => { sessionListeners.delete(cb); };
}

export function saveSession(session: SupabaseSession | null) {
  try {
    if (session) {
      const withExpiry = session.expires_at ? session : { ...session, expires_at: Math.floor(Date.now() / 1000) + (session.expires_in || 3600) };
      localStorage.setItem(SESSION_KEY, JSON.stringify(withExpiry));
      sessionListeners.forEach((cb) => cb(withExpiry));
      return;
    }
    localStorage.removeItem(SESSION_KEY);
  } catch { /* storage unavailable */ }
  sessionListeners.forEach((cb) => cb(null));
}

let refreshInFlight: Promise<SupabaseSession | null> | null = null;
/** Refresh the stored session once, even if many requests notice the expiry at the same time. */
function refreshStoredSession(): Promise<SupabaseSession | null> {
  if (refreshInFlight) return refreshInFlight;
  const current = getSession();
  if (!current?.refresh_token) return Promise.resolve(null);
  refreshInFlight = authRefresh(current)
    .catch(() => { saveSession(null); return null; })
    .finally(() => { refreshInFlight = null; });
  return refreshInFlight;
}

/** Returns a usable access token: the stored one if still valid, otherwise a refreshed one. */
async function resolveToken(accessToken?: string): Promise<string | undefined> {
  if (!accessToken) return undefined;
  const stored = getSession();
  if (!stored) return accessToken;
  const expiringSoon = !!stored.expires_at && stored.expires_at < Math.floor(Date.now() / 1000) + 30;
  if (expiringSoon) {
    const fresh = await refreshStoredSession();
    return fresh?.access_token || accessToken;
  }
  // A component may still hold an older token after a background refresh; prefer the newest one.
  return stored.access_token || accessToken;
}

async function request(path: string, init: RequestInit = {}, accessToken?: string, retried = false): Promise<any> {
  if (!SUPABASE_KEY) throw new Error('Supabase is not configured: set VITE_SUPABASE_PUBLISHABLE_KEY and redeploy.');
  const token = await resolveToken(accessToken);
  const headers = new Headers(init.headers || {});
  headers.set('apikey', SUPABASE_KEY);
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${token || SUPABASE_KEY}`);
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const isAuthEndpoint = path.startsWith('/auth/v1/token');
    if (res.status === 401 && accessToken && !retried && !isAuthEndpoint) {
      const fresh = await refreshStoredSession();
      if (fresh) return request(path, init, fresh.access_token, true);
    }
    throw new Error(data?.message || data?.error_description || data?.error || `Supabase request failed (${res.status})`);
  }
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

/** Reads every row of a query by paging, because the REST API returns at most 1000 rows per request. */
export async function dbSelectAll<T = any>(table: string, query: string, accessToken?: string, pageSize = 1000): Promise<T[]> {
  const all: T[] = [];
  for (let offset = 0; offset < 100000; offset += pageSize) {
    const page = await dbSelect<T>(table, `${query}&limit=${pageSize}&offset=${offset}`, accessToken);
    all.push(...page);
    if (page.length < pageSize) break;
  }
  return all;
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
export function saveSupabaseConfig(_url?: string, _anonKey?: string) { /* configuration is build-time via Vite env */ }
export function clearSupabaseConfig() { /* configuration is build-time via Vite env */ }
export function getSupabaseClient(): any { return null; }
export async function testSupabaseConnection(url?: string, anonKey?: string) {
  try { await dbSelect('products', 'select=id&limit=1'); return { success: true, message: 'Connected to Supabase.' }; }
  catch (e: any) { return { success: false, message: e.message || 'Connection failed.' }; }
}

export const SUPABASE_SQL_SETUP_SCRIPT = '';
