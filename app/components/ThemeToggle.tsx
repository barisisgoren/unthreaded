'use client';

import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { getSettings, saveSettings } from '../lib/settings';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getSettings();
    setTheme(s.theme);
  }, []);

  const toggle = () => {
    const s = getSettings();
    const newTheme: Theme = s.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveSettings({ ...s, theme: newTheme });
  };

  if (!mounted) {
    return <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="relative p-3 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ scale: theme === 'dark' ? 0 : 1, rotate: theme === 'dark' ? 180 : 0, opacity: theme === 'dark' ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-3"
      >
        <Sun className="w-full h-full text-yellow-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : -180, opacity: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-3"
      >
        <Moon className="w-full h-full text-primary" />
      </motion.div>
      <div className="w-6 h-6 opacity-0">
        <Sun className="w-full h-full" />
      </div>
    </motion.button>
  );
}
