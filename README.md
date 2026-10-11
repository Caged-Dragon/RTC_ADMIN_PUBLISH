# RedThunder Crackers — Admin Portal

Vite + React admin site for `admin.rtcrackers.com`, backed by the shared Supabase project
(`ypmiinmkyvzdpakbkers`). The customer site is a separate project; see `DEPLOYMENT.md`.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_PUBLISHABLE_KEY` (publishable key only — never a service-role key).
3. `npm run dev`

## Build
`npm run build` (output in `dist`). `npm run lint` runs the TypeScript check.

## Database
This project shares one Supabase database with other websites, so database changes here are **additive only**.
See `supabase/rtc_admin_additive_fixes.sql` for the latest changes and their rollback statements.

## Access
Sign-in uses Supabase Auth; `public.admin_access` (matched on the user's id) decides who is an administrator.
