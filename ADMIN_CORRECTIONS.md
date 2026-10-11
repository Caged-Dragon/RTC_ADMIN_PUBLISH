# Admin corrections

- Product and category CRUD remains Supabase-backed; local catalog reset was removed.
- Category selectors now use the database category objects correctly.
- Supabase diagnostics helpers now match their callers.
- Dependency lockfile was regenerated so npm ci succeeds.
- Vite config uses import.meta.url rather than __dirname.
- Original assets and application screens are preserved.

## Review round 2
- Sessions now refresh automatically (and on a 401), so admins are no longer signed out after about an hour.
- Admin check matches `admin_access.auth_user_id`; login failures return one generic message.
- Walk-in orders are really saved (they previously read the empty customer cart and failed silently).
- Order status changes use one atomic database call (`admin_set_order_status`); failures are shown, not swallowed.
- Orders and products are read in pages, so lists are not cut off at 1000 rows; a failed reload keeps the last good list.
- The merchant UPI ID is read from `merchant_settings` instead of being hardcoded.
- Admin site is `noindex`, uses `rewrites` and sends security headers (see `vercel.json`).
- New additive database objects are documented in `supabase/rtc_admin_additive_fixes.sql`.

## Review round 3
- Added public wrappers `get_guest_order` (anon + signed-in) and `submit_customer_review` (signed-in only) so the shared sites can call them through the REST API. Private functions unchanged.

## Review round 4
- Fixed "access denied" (HTTP 401) on `merchant_settings`: the table had RLS policies but no GRANTs. Also granted the matching access on `offer_categories`, `offer_products`, `freight_rates` and `transporters` (anonymous read), in line with their existing policies.
