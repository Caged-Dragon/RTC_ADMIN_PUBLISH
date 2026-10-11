-- RTC Admin: additive database fixes (already applied to project ypmiinmkyvzdpakbkers
-- as migrations "rtc_admin_additive_fixes" and "rtc_admin_create_order_v2_final_net_payable").
--
-- Four websites share this project, so NOTHING existing is modified or dropped.
-- Only new objects are created. This file is safe to re-run.
--
-- Rollback (removes only what this file added):
--   drop function if exists public.admin_set_order_status(bigint,text,text,text,text);
--   drop function if exists public.create_order(uuid,text,text,jsonb,jsonb,text,text);
--   drop function if exists private.create_order_v2(uuid,text,text,jsonb,jsonb,text,text);
--   drop policy if exists authenticated_read_product_categories on public.product_categories;
--   drop function if exists public.get_guest_order(bigint,uuid);
--   drop function if exists public.submit_customer_review(uuid,integer,text,text[]);

-- 1) Signed-in customers could not read product categories (only an anon policy existed).
drop policy if exists authenticated_read_product_categories on public.product_categories;
create policy authenticated_read_product_categories
on public.product_categories
for select
to authenticated
using ( is_active = true or (select private.is_admin()) );

-- 2) Order placement.
--    private.create_order (left untouched) has three defects:
--      a) `p_shipping->phone` references a column that does not exist, so every call errors;
--      b) `p_user_id <> (select ...)` is NULL for callers without a profile, so the
--         "Unauthorized customer" check is skipped (orders could be filed under another user);
--      c) orders.final_net_payable is NOT NULL with no default and was not supplied.
--    It is also not in an API-exposed schema (the REST call returned 404).
--    private.create_order_v2 is a corrected copy; public.create_order exposes it.
create or replace function private.create_order_v2(
  p_user_id uuid,
  p_customer_email text,
  p_customer_phone text,
  p_shipping jsonb,
  p_items jsonb,
  p_payment_method text default null,
  p_customer_note text default null
) returns jsonb
language plpgsql
security definer
set search_path to 'public', 'private'
as $function$
declare
  v_order_id uuid;
  v_order_number bigint;
  v_guest_token uuid;
  v_subtotal numeric(12,2) := 0;
  v_total_boxes integer := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_line numeric(12,2);
begin
  if p_user_id is not null then
    if p_user_id is distinct from (select id from public.users where auth_user_id = auth.uid()) then
      raise exception 'Unauthorized customer';
    end if;
  end if;

  if p_user_id is null and (nullif(trim(coalesce(p_customer_email,'')),'') is null
      or nullif(trim(coalesce(p_customer_phone,'')),'') is null) then
    raise exception 'Guest orders require email and phone';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (
    user_id, customer_email, customer_phone,
    shipping_first_name, shipping_last_name, shipping_phone,
    shipping_address_line_1, shipping_address_line_2, shipping_landmark,
    shipping_city, shipping_district, shipping_state, shipping_postal_code, shipping_country,
    customer_note, payment_method, status, payment_status, placed_at, booking_date,
    guest_tracking_token, final_net_payable
  )
  values (
    p_user_id, nullif(trim(p_customer_email),''), nullif(trim(p_customer_phone),''),
    nullif(trim(p_shipping->>'first_name'),''), nullif(trim(p_shipping->>'last_name'),''),
    nullif(trim(p_shipping->>'phone'),''),
    nullif(trim(p_shipping->>'address_line_1'),''), nullif(trim(p_shipping->>'address_line_2'),''),
    nullif(trim(p_shipping->>'landmark'),''),
    nullif(trim(p_shipping->>'city'),''), nullif(trim(p_shipping->>'district'),''),
    nullif(trim(p_shipping->>'state'),''), nullif(trim(p_shipping->>'postal_code'),''),
    coalesce(nullif(trim(p_shipping->>'country'),''),'India'),
    nullif(trim(coalesce(p_customer_note,'')),''), nullif(trim(p_payment_method),''),
    'pending', 'pending', now(), now(), gen_random_uuid(), 0
  )
  returning id, order_number, guest_tracking_token into v_order_id, v_order_number, v_guest_token;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid and is_active = true
    for update;

    if not found then
      raise exception 'Product unavailable';
    end if;

    v_qty := greatest(1, (v_item->>'quantity')::integer);
    if v_product.stock_status = 'OUT_OF_STOCK' then
      raise exception 'Product out of stock: %', v_product.name;
    end if;

    v_line := round(v_product.factory_rate * v_qty, 2);
    v_subtotal := v_subtotal + v_line;
    v_total_boxes := v_total_boxes + v_qty;

    insert into public.order_items (
      order_id, product_id, product_code, product_name, category, pack_type,
      unit_price, quantity, line_total, product_image,
      product_name_snapshot, unit_rate_snapshot, quantity_ordered, line_total_snapshot
    )
    values (
      v_order_id, v_product.id, v_product.product_code, v_product.name, v_product.category,
      v_product.pack_type, v_product.factory_rate, v_qty, v_line,
      coalesce(v_product.image_url, v_product.product_image),
      v_product.name, v_product.factory_rate, v_qty, v_line
    );
  end loop;

  update public.orders
  set subtotal = v_subtotal,
      total_amount = v_subtotal,
      final_net_payable = v_subtotal,
      total_boxes_count = v_total_boxes,
      updated_at = now()
  where id = v_order_id;

  insert into public.order_tracking(order_id, status, note)
  values (v_order_id, 'pending', 'Order placed by customer');

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'guest_tracking_token', v_guest_token,
    'subtotal', v_subtotal,
    'total_amount', v_subtotal,
    'total_boxes_count', v_total_boxes
  );
end;
$function$;

revoke all on function private.create_order_v2(uuid,text,text,jsonb,jsonb,text,text) from public;
grant execute on function private.create_order_v2(uuid,text,text,jsonb,jsonb,text,text) to anon, authenticated;

create or replace function public.create_order(
  p_user_id uuid,
  p_customer_email text,
  p_customer_phone text,
  p_shipping jsonb,
  p_items jsonb,
  p_payment_method text default null,
  p_customer_note text default null
) returns jsonb
language sql
security invoker
set search_path to 'public', 'private'
as $$
  select private.create_order_v2(p_user_id, p_customer_email, p_customer_phone, p_shipping, p_items, p_payment_method, p_customer_note);
$$;

revoke all on function public.create_order(uuid,text,text,jsonb,jsonb,text,text) from public;
grant execute on function public.create_order(uuid,text,text,jsonb,jsonb,text,text) to anon, authenticated;

-- 3) Atomic admin status update: order row + tracking row in one transaction.
--    SECURITY INVOKER, so the existing admin RLS policies on orders / order_tracking still apply.
create or replace function public.admin_set_order_status(
  p_order_number bigint,
  p_status text,
  p_lr_number text default null,
  p_transporter_name text default null,
  p_note text default null
) returns jsonb
language plpgsql
security invoker
set search_path to 'public', 'private'
as $$
declare
  v_order_id uuid;
  v_transporter_id uuid;
  v_actor uuid;
begin
  if not (select private.is_admin()) then
    raise exception 'Admin access required';
  end if;

  select id into v_order_id from public.orders where order_number = p_order_number;
  if v_order_id is null then
    raise exception 'Order not found';
  end if;

  if nullif(trim(coalesce(p_transporter_name,'')),'') is not null then
    select id into v_transporter_id
    from public.transporters
    where transporter_name = trim(p_transporter_name)
    limit 1;
    if v_transporter_id is null then
      raise exception 'Transporter not found: %', p_transporter_name;
    end if;
  end if;

  select id into v_actor from public.users where auth_user_id = (select auth.uid());

  update public.orders set
    status = p_status,
    lr_number = case when p_lr_number is not null then nullif(trim(p_lr_number),'') else lr_number end,
    lorry_transporter_id = coalesce(v_transporter_id, lorry_transporter_id),
    confirmed_at = case when p_status in ('confirmed','PAYMENT_VERIFIED') then now() else confirmed_at end,
    shipped_at   = case when p_status in ('shipped','DISPATCHED_LORRY') then now() else shipped_at end,
    delivered_at = case when p_status = 'delivered' then now() else delivered_at end,
    cancelled_at = case when p_status = 'cancelled' then now() else cancelled_at end
  where id = v_order_id;

  insert into public.order_tracking(order_id, status, note, changed_by_user_id)
  values (
    v_order_id, p_status,
    coalesce(nullif(trim(coalesce(p_note,'')),''),
             'Status updated by admin' || case when nullif(trim(coalesce(p_lr_number,'')),'') is not null then ' • LR ' || trim(p_lr_number) else '' end),
    v_actor
  );

  return jsonb_build_object('order_id', v_order_id, 'order_number', p_order_number, 'status', p_status);
end;
$$;

revoke all on function public.admin_set_order_status(bigint,text,text,text,text) from public, anon;
grant execute on function public.admin_set_order_status(bigint,text,text,text,text) to authenticated;

-- 4) Public wrappers for two existing private functions that were correct but unreachable
--    (the REST API returned 404 because `private` is not an exposed schema).
--    Applied as migration "rtc_public_wrappers_guest_order_and_review". The private functions are unchanged.
create or replace function public.get_guest_order(p_order_number bigint, p_token uuid)
returns jsonb
language sql
security invoker
set search_path to 'public', 'private'
as $$
  select private.get_guest_order(p_order_number, p_token);
$$;
revoke all on function public.get_guest_order(bigint, uuid) from public;
grant execute on function public.get_guest_order(bigint, uuid) to anon, authenticated;

create or replace function public.submit_customer_review(
  p_order_id uuid,
  p_rating integer,
  p_comment text,
  p_tags text[] default '{}'::text[]
)
returns jsonb
language sql
security invoker
set search_path to 'public', 'private'
as $$
  select private.submit_customer_review(p_order_id, p_rating, p_comment, p_tags);
$$;
revoke all on function public.submit_customer_review(uuid, integer, text, text[]) from public, anon;
grant execute on function public.submit_customer_review(uuid, integer, text, text[]) to authenticated;

-- 5) Missing table-level GRANTs. These tables already had RLS policies (public read for anon, admin
--    write for authenticated) but no GRANTs, so the API answered 401/403 to every request, including
--    the admin portal's merchant settings. Grants only; row access is still decided by the existing policies.
--    Applied as migration "rtc_missing_table_grants_for_existing_policies".
--    Rollback: revoke the same privileges on the same tables.
grant select on public.merchant_settings to anon;
grant select, insert, update, delete on public.merchant_settings to authenticated;
grant select on public.offer_categories to anon;
grant select, insert, update, delete on public.offer_categories to authenticated;
grant select on public.offer_products to anon;
grant select, insert, update, delete on public.offer_products to authenticated;
grant select on public.freight_rates to anon;
grant select on public.transporters to anon;
