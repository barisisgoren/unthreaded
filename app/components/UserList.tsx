'use client';

import { useState, useMemo } from 'react';
import { ParsedUser } from '../types';
import { Search, Users, Sparkles } from 'lucide-react';
import UserCard from './UserCard';
import { searchUsers } from '../lib/analyzer';
import { motion, AnimatePresence } from 'framer-motion';

interface UserListProps {
  users: ParsedUser[];
  title: string;
  emptyMessage: string;
  newUsers?: Set<string>;
  icon?: React.ReactNode;
}

export default function UserList({ 
  users, 
  title, 
  emptyMessage,
  newUsers = new Set(),
  icon
}: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    return searchUsers(users, searchQuery);
  }, [users, searchQuery]);

  const newUsersCount = Array.from(newUsers).length;

  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-10 text-center"
      >
        <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--primary-light)' }}>
          <Users className="h-10 w-10" style={{ color: 'var(--primary)' }} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary)' }}>
                {users.length} kişi
              </span>
              {newUsersCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {newUsersCount} yeni
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Kullanıcı adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-all duration-200 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-colors" style={{ color: 'var(--primary)' }}
          >
            Temizle
          </button>
        )}
      </div>

      {searchQuery && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold" style={{ color: 'var(--primary)' }}>{filteredUsers.length}</span> sonuç bulundu
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, index) => (
            <UserCard
              key={user.username}
              user={user}
              isNew={newUsers.has(user.username)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredUsers.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 text-center"
        >
          <Search className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Sonuç Bulunamadı</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &quot;<span className="font-semibold" style={{ color: 'var(--primary)' }}>{searchQuery}</span>&quot; için sonuç bulunamadı
          </p>
        </motion.div>
      )}
    </div>
  );
}
