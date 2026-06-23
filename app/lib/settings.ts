import { AppSettings, ColorPreset, Theme } from '../types';

const SETTINGS_KEY = 'unthreaded_settings';

const defaults: AppSettings = {
  theme: 'light',
  colorPreset: 'indigo',
};

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return defaults;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaults, ...parsed };
    }
  } catch {}
  return defaults;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applySettings(settings);
}

export function applySettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // Theme
  if (settings.theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Color preset
  root.setAttribute('data-theme', settings.colorPreset);
}
