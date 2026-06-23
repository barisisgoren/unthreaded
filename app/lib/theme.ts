import { Theme } from '../types';

const THEME_KEY = 'threads_theme';

/**
 * Mevcut temayı localStorage'dan okur
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return (stored === 'dark' || stored === 'light') ? stored : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Temayı kaydeder ve DOM'a uygular
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_KEY, theme);
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Temayı toggle eder
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
}
