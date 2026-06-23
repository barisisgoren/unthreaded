'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  index?: number;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change,
  index = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change !== undefined && change !== 0 && (
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
            change > 0 
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' 
              : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
          }`}>
            {change > 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value.toLocaleString('tr-TR')}
      </p>
    </motion.div>
  );
}
