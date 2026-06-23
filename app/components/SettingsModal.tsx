'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorPreset, Theme } from '../types';
import { getSettings, saveSettings } from '../lib/settings';

const presets: { key: ColorPreset; label: string; color: string }[] = [
  { key: 'indigo', label: 'İndigo', color: '#4f46e5' },
  { key: 'emerald', label: 'Zümrüt', color: '#10b981' },
  { key: 'rose', label: 'Gül', color: '#f43f5e' },
  { key: 'amber', label: 'Kehribar', color: '#f59e0b' },
  { key: 'violet', label: 'Menekşe', color: '#8b5cf6' },
  { key: 'sky', label: 'Gök', color: '#0ea5e9' },
];

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [preset, setPreset] = useState<ColorPreset>('indigo');

  useEffect(() => {
    if (open) {
      const s = getSettings();
      setTheme(s.theme);
      setPreset(s.colorPreset);
    }
  }, [open]);

  const apply = (newTheme: Theme, newPreset: ColorPreset) => {
    setTheme(newTheme);
    setPreset(newPreset);
    saveSettings({ theme: newTheme, colorPreset: newPreset });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ayarlar</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Görünüm</p>
                <div className="flex gap-2">
                  {(['light', 'dark'] as Theme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => apply(t, preset)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        theme === t
                          ? 'border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {t === 'light' ? '☀️ Açık' : '🌙 Koyu'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Renk Teması</p>
                <div className="grid grid-cols-3 gap-3">
                  {presets.map(p => (
                    <button
                      key={p.key}
                      onClick={() => apply(theme, p.key)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200"
                      style={{
                        borderColor: preset === p.key ? p.color : 'transparent',
                        backgroundColor: preset === p.key ? `${p.color}15` : 'transparent',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: p.color }}
                      >
                        {preset === p.key && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
