import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadThemePage, applyThemeVars, applyComponentStyles } from '../themeDatabase';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('redthunder_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('redthunder_theme', theme);
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
        document.body.className = 'bg-stone-950 text-stone-100 antialiased selection:bg-amber-500 selection:text-black';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
        document.body.className = 'bg-[#faf7f2] text-stone-900 antialiased selection:bg-amber-500 selection:text-white';
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    const load = async (page: string) => { const target = page || 'operations'; const t = await loadThemePage('admin', target); applyThemeVars(t); try { const rows = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/theme_component_settings?select=*&website_key=eq.admin&page_key=eq.${encodeURIComponent(target)}&is_active=eq.true&order=sort_order`, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '' } }).then(r=>r.json()); applyComponentStyles(Array.isArray(rows)?rows:[]); } catch {} };
    load(document.documentElement.dataset.rtcPage || 'operations');
    const handler = (e: Event) => load((e as CustomEvent<string>).detail || 'operations');
    window.addEventListener('rt-theme-page', handler);
    return () => window.removeEventListener('rt-theme-page', handler);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
