-- RT Crackers customer website database integration
-- This file documents the database-side integration already applied to project:
-- ypmiinmkyvzdpakbkers
-- It exposes only safe customer/public reads and validated RPCs.
-- Do not put a service-role key in the frontend.

-- The live database already contains these objects:
-- public.products (127 catalogue products)
-- public.users (customer-only identity)
-- public.orders / public.order_items / public.order_tracking
-- public.company_profile / public.merchant_settings
-- public.transporters / public.freight_rates
-- public.offers / public.offer_banners / public.offer_products / public.offer_categories / public.offer_usage
-- public.reviews

-- The live database also contains private RPCs used by the website:
-- private.create_order(...)
-- private.get_guest_order(...)
-- private.submit_customer_review(...)
-- and an auth.users trigger that links each Supabase Auth user to public.users.

-- Apply the equivalent live migrations through the Supabase migration history,
-- not by exposing private tables directly to anon users.
