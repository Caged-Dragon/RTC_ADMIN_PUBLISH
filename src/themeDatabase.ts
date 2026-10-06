import { dbSelect } from './lib/supabase';

export type ThemePage = Record<string, any>;

const FALLBACK = {
  background_color: '#fff8f5', surface_color: '#fffaf7', surface_elevated_color: '#ffffff', section_color: '#fff1ec',
  header_color: '#ffffff', footer_color: '#3a0808', text_color: '#241716', muted_text_color: '#756a67', heading_color: '#c92b26',
  primary_color: '#d92d27', primary_dark_color: '#a91f1b', secondary_color: '#7b4cc7', accent_color: '#e7ad21', link_color: '#b72b26',
  button_background_color: '#d92d27', button_text_color: '#ffffff', border_color: '#ead8d1', border_strong_color: '#d9bcb3',
  input_background_color: '#ffffff', input_border_color: '#decac3', card_shadow_color: 'rgba(80,20,15,.10)', hero_background_color: '#fff2dc',
  banner_background_color: '#fff0e9', nav_background_color: '#ffffff', nav_text_color: '#241716', font_heading: 'system-ui', font_body: 'system-ui',
  radius_small: '10px', radius_medium: '16px', radius_large: '24px',
};

export async function loadThemePage(website: string, page: string): Promise<ThemePage> {
  try {
    const rows = await dbSelect<ThemePage>('theme_page_settings', `select=*&website_key=eq.${encodeURIComponent(website)}&page_key=eq.${encodeURIComponent(page)}&is_active=eq.true&limit=1`);
    return { ...FALLBACK, ...(rows[0] || {}) };
  } catch { return FALLBACK; }
}

export function applyThemeVars(theme: ThemePage) {
  const root = document.documentElement;
  const map: Record<string,string> = {
    '--rtc-background': theme.background_color, '--rtc-surface': theme.surface_color, '--rtc-surface-elevated': theme.surface_elevated_color,
    '--rtc-section': theme.section_color, '--rtc-header': theme.header_color, '--rtc-footer': theme.footer_color,
    '--rtc-text': theme.text_color, '--rtc-muted': theme.muted_text_color, '--rtc-heading': theme.heading_color,
    '--rtc-primary': theme.primary_color, '--rtc-primary-dark': theme.primary_dark_color, '--rtc-secondary': theme.secondary_color,
    '--rtc-accent': theme.accent_color, '--rtc-link': theme.link_color, '--rtc-button': theme.button_background_color,
    '--rtc-button-text': theme.button_text_color, '--rtc-border': theme.border_color, '--rtc-border-strong': theme.border_strong_color,
    '--rtc-input': theme.input_background_color, '--rtc-input-border': theme.input_border_color, '--rtc-hero': theme.hero_background_color,
    '--rtc-banner': theme.banner_background_color, '--rtc-nav': theme.nav_background_color, '--rtc-nav-text': theme.nav_text_color,
    '--rtc-radius-sm': theme.radius_small, '--rtc-radius-md': theme.radius_medium, '--rtc-radius-lg': theme.radius_large,
  };
  for (const [k,v] of Object.entries(map)) if (v) root.style.setProperty(k,v);
  if (theme.font_heading) root.style.setProperty('--rtc-font-heading', theme.font_heading);
  if (theme.font_body) root.style.setProperty('--rtc-font-body', theme.font_body);
  root.dataset.rtcWebsite = 'admin'; root.dataset.rtcPage = theme.page_key || '';
}


export function applyComponentStyles(rows: ThemePage[]) {
  const root = document.documentElement;
  const cssProps = ['font_family','font_size','font_weight','line_height','letter_spacing','text_color','background_color','border_color','border_width','border_radius','box_shadow','padding','margin','width','max_width','text_align'];
  const safe = (v: unknown) => typeof v === 'string' && v.length < 500 && !/[<>]/.test(v) ? v : '';
  const old = document.getElementById('rtc-component-theme');
  if (old) old.remove();
  const style = document.createElement('style'); style.id='rtc-component-theme';
  const rules: string[] = [];
  for (const row of rows || []) {
    const key = String(row.component_key || '').replace(/[^a-zA-Z0-9_-]/g,''); if (!key) continue;
    const vars: string[] = [];
    for (const prop of cssProps) { const v=safe(row[prop]); if (v) vars.push(`--rtc-c-${key}-${prop.replace(/_/g,'-')}:${v};`); }
    if (vars.length) {
      root.setAttribute(`data-rtc-component-${key}`, '1');
      rules.push(`[data-rtc-component=\"${key}\"]{${vars.join('')}}`);
      const direct = ['font-size','font-weight','line-height','letter-spacing','color','background','border-color','border-width','border-radius','box-shadow','padding','margin','width','max-width','text-align'];
      const map:any = {font_family:'font-family',font_size:'font-size',font_weight:'font-weight',line_height:'line-height',letter_spacing:'letter-spacing',text_color:'color',background_color:'background-color',border_color:'border-color',border_width:'border-width',border_radius:'border-radius',box_shadow:'box-shadow',padding:'padding',margin:'margin',width:'width',max_width:'max-width',text_align:'text-align'};
      const decls:string[]=[]; for(const prop of cssProps){const v=safe(row[prop]); if(v) decls.push(`${map[prop]}:${v}`)}
      if(decls.length) rules.push(`[data-rtc-component=\"${key}\"]{${decls.join(';')}}`);
    }
  }
  style.textContent=rules.join(''); document.head.appendChild(style);
}
