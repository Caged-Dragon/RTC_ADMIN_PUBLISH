# Admin corrections

- Product and category CRUD remains Supabase-backed; local catalog reset was removed.
- Category selectors now use the database category objects correctly.
- Supabase diagnostics helpers now match their callers.
- Dependency lockfile was regenerated so npm ci succeeds.
- Vite config uses import.meta.url rather than __dirname.
- Original assets and application screens are preserved.
