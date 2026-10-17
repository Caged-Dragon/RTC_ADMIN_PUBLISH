# Admin theme settings repair

## What changed

- The theme editor defaults to **Admin / Control Center**, matching this build's live admin portal instead of opening on the unrelated storefront theme.
- Page and component saves now check Supabase's returned rows. A zero-row update is reported as a failure rather than a false success.
- Saved component styles are re-applied after saving; route-theme requests are sequenced so an older request cannot overwrite a newer page's theme.
- Light-mode admin styling reads CSS variables populated from `theme_page_settings` and uses distinct page, surface, section, input, and banner backgrounds.
- Light-mode text is restricted to black, red, and orange brand colors. Text-color controls in the theme editor offer only those brand colors; background and border controls remain independently editable.
- Added the missing `admin/categories` page row so category management has its own database theme.
- Existing product editing and original image upload flows are untouched.

## Live database changes

The connected Supabase project's `public.theme_page_settings` rows for `website_key = 'admin'` were updated directly. The seven active admin pages now have six distinct page background shades and five distinct section background shades, using black text (`#171717`), RedThunder red (`#C62828` / `#9B1C1C`), and orange (`#EA580C` / `#F97316`) accents. Orange action buttons use `#FB923C` with black text. The active page colors were queried after the update and verified.

The repeatable SQL is at `supabase/theme_brand_palette_repair.sql`. It only touches theme settings; it does not modify product data, product images, or company records.

## Validation notes

- Transpilation/syntax validation passed for all 52 `.ts`/`.tsx` files.
- Database verification confirmed seven active admin theme rows, six distinct page background colors, five distinct section colors, and no off-palette text/secondary colors in the selected admin theme rows.
- A full production build/typecheck could not be completed in this environment because package installation timed out and left dependencies unavailable. Run `npm ci` followed by `npm run build` and `npm run lint` where the npm registry is reachable before deploying.

## Deployment

Deploy the extracted project with the same Supabase environment variables you already use. Do not overwrite your `.env.local` with a placeholder. The SQL has already been applied to the connected database; re-running the included idempotent SQL is optional.
