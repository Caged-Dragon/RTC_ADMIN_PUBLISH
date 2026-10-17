-- RedThunder admin theme repair (idempotent)
-- Project: ypmiinmkyvzdpakbkers
-- Distinct low-contrast light backgrounds and black/red/orange typography/actions.
-- This migration changes only theme configuration rows; it does not touch products or images.

insert into public.theme_page_settings (website_key, page_key, page_name)
values ('admin', 'categories', 'Category Management')
on conflict (website_key, page_key) do update
set page_name = excluded.page_name, updated_at = now();

update public.theme_page_settings
set
  mode = 'light',
  background_color = case page_key
    when 'operations' then '#FFF7ED'
    when 'categories' then '#FFF1F2'
    when 'banners' then '#FFF8F0'
    when 'company' then '#FFFBEB'
    when 'login' then '#FFF4E6'
    when 'supabase' then '#FFF3E7'
    when 'theme' then '#FFF8F0'
    else '#FFF7ED'
  end,
  surface_color = '#FFFFFF',
  surface_elevated_color = case page_key
    when 'operations' then '#FFFCF7'
    when 'categories' then '#FFF9F8'
    when 'banners' then '#FFFCF5'
    when 'company' then '#FFFDF8'
    when 'login' then '#FFFFFB'
    when 'supabase' then '#FFF9F2'
    when 'theme' then '#FFFCF5'
    else '#FFFCF7'
  end,
  section_color = case page_key
    when 'operations' then '#FFEDD5'
    when 'categories' then '#FFE4E6'
    when 'banners' then '#FFEAD5'
    when 'company' then '#FFEDD5'
    when 'login' then '#FFE4D6'
    when 'supabase' then '#FED7AA'
    when 'theme' then '#FFE4E6'
    else '#FFEDD5'
  end,
  header_color = '#FFFFFF',
  footer_color = case page_key
    when 'categories' then '#FECACA'
    when 'login' then '#FFE4D6'
    when 'supabase' then '#FED7AA'
    else '#FFE4D6'
  end,
  text_color = '#171717',
  muted_text_color = '#171717',
  heading_color = '#C62828',
  primary_color = '#C62828',
  primary_dark_color = '#9B1C1C',
  secondary_color = '#F97316',
  accent_color = '#EA580C',
  link_color = '#B91C1C',
  button_background_color = '#FB923C',
  button_text_color = '#171717',
  border_color = '#FECACA',
  border_strong_color = '#EA580C',
  input_background_color = '#FFFFFF',
  input_border_color = '#FB923C',
  card_shadow_color = 'rgba(110,30,20,.12)',
  hero_background_color = '#FFEDD5',
  banner_background_color = '#FFE4E6',
  nav_background_color = case page_key
    when 'categories' then '#FFF1F2'
    when 'company' then '#FFFBEB'
    when 'login' then '#FFF4E6'
    else '#FFF7ED'
  end,
  nav_text_color = '#171717',
  updated_at = now()
where website_key = 'admin';

-- Normalize any pre-existing admin component text overrides to the allowed brand palette.
update public.theme_component_settings
set text_color = '#171717', updated_at = now()
where website_key = 'admin'
  and text_color is not null
  and upper(text_color) not in ('#171717', '#000000', '#C62828', '#9B1C1C', '#EA580C', '#F97316');
