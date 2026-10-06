# RT Crackers split deployment

## Customer
Deploy `/cart` as a Vercel project.
- Domain: `cart.rtcrackers.com`
- Build command: `npm run build`
- Output: `dist`
- Environment:
  - `VITE_SUPABASE_URL=https://ypmiinmkyvzdpakbkers.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key>`

## Admin
Deploy `/admin` as a separate Vercel project.
- Domain: `admin.rtcrackers.com`
- Build command: `npm run build`
- Output: `dist`
- Same Supabase environment variables.

The admin app shows its login screen before any admin UI. Supabase Auth verifies the password, then `public.admin_access` verifies that the signed-in email is one of the two allowlisted administrator IDs.

Authorized IDs:
- `developer@rtcrackers.com` — Primary Admin
- `admin@rtcrackers.com` — Admin

If these two email identities do not yet exist in Supabase Auth, create them in Authentication > Users and set their passwords there. The split does not invent or expose passwords.

## Company editor
The admin Company Control screen updates `public.company_profile`. The customer website reads that row at runtime. Logo changes are made through the `logo_url` field using a public HTTPS image URL.
