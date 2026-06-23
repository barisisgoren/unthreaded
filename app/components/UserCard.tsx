'use client';

import { ParsedUser } from '../types';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserCardProps {
  user: ParsedUser;
  isNew?: boolean;
  index?: number;
}

export default function UserCard({ user, isNew = false, index = 0 }: UserCardProps) {
  const handleClick = () => {
    window.open(user.profileUrl, '_blank', 'noopener,noreferrer');
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-all duration-200 hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'var(--primary)' }}>
            {getInitials(user.username)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              @{user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.displayName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isNew && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              YENİ
            </span>
          )}
          <div className="p-1.5 rounded-full text-gray-400 group-hover:text-primary transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
