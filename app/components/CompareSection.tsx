'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileArchive, UserMinus, Heart, Users as UsersIcon, UserCheck } from 'lucide-react';
import { AnalysisResult, DiffResult, ParsedUser } from '../types';
import { analyzeThreadsData, calculateDiff } from '../lib/analyzer';
import { extractThreadsDataFromZip } from '../lib/zipHandler';
import StatCard from './StatCard';
import UserList from './UserList';

interface SlotState {
  file: File | null;
  result: AnalysisResult | null;
  loading: boolean;
  error: string;
}

function initSlot(): SlotState {
  return { file: null, result: null, loading: false, error: '' };
}

function UploadSlot({
  slot,
  label,
  onFile,
}: {
  slot: SlotState;
  label: string;
  onFile: (f: File) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFile(files[0]);
    },
    [onFile],
  );

  return (
    <div className="flex-1">
      <label className="block mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="file"
        id={`zip-${label}`}
        accept=".zip"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) onFile(files[0]);
        }}
        className="hidden"
        disabled={slot.loading}
      />
      <label
        htmlFor={`zip-${label}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          slot.loading
            ? 'pointer-events-none opacity-50 border-gray-300 dark:border-gray-600'
            : dragOver
              ? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-800'
              : slot.file
                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900'
        }`}
      >
        {slot.loading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">İşleniyor...</p>
          </div>
        ) : slot.file ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <FileArchive className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                {slot.file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(slot.file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sürükle veya tıkla
            </p>
          </div>
        )}
      </label>
      {slot.error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{slot.error}</p>
      )}
    </div>
  );
}

function DiffSummary({ diff, selected, onSelect }: { diff: DiffResult; selected: string | null; onSelect: (key: string | null) => void }) {
  const lists: { key: string; label: string; count: number; icon: typeof Heart; color: string; bg: string }[] = [
    { key: 'newFollowers', label: 'Yeni Takipçiler', count: diff.newFollowers.length, icon: Heart, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950' },
    { key: 'lostFollowers', label: 'Takipten Çıkaranlar', count: diff.lostFollowers.length, icon: UserMinus, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950' },
    { key: 'lostFollowing', label: 'Takipten Çıkılanlar', count: diff.lostFollowing.length, icon: UserMinus, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {lists.filter(l => l.count > 0).map(item => {
          const Icon = item.icon;
          const isOpen = selected === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(isOpen ? null : item.key)}
              className={`text-left rounded-lg p-3 cursor-pointer transition-all duration-200 border ${
                isOpen
                  ? `${item.bg} border-gray-900 dark:border-gray-100 shadow-sm`
                  : `${item.bg} border-transparent hover:border-gray-300 dark:hover:border-gray-600`
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
              </div>
              <p className={`text-lg font-bold ${item.color}`}>{item.count}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UserDiffList({
  users,
  title,
  emptyMessage,
  icon,
}: {
  users: ParsedUser[];
  title: string;
  emptyMessage: string;
  icon: React.ReactNode;
}) {
  if (users.length === 0) return null;
  return (
    <UserList
      users={users}
      title={title}
      emptyMessage={emptyMessage}
      icon={icon}
    />
  );
}

export default function CompareSection() {
  const [slotA, setSlotA] = useState<SlotState>(initSlot);
  const [slotB, setSlotB] = useState<SlotState>(initSlot);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [diffUsers, setDiffUsers] = useState<{
    newFollowers: ParsedUser[];
    lostFollowers: ParsedUser[];
    lostFollowing: ParsedUser[];
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const processSlot = async (file: File, slot: 'a' | 'b') => {
    const setSlot = slot === 'a' ? setSlotA : setSlotB;
    setSlot(prev => ({ ...prev, file, loading: true, error: '' }));

    try {
      const { followersData, followingData } = await extractThreadsDataFromZip(file);
      const result = analyzeThreadsData(followersData, followingData);
      setSlot(prev => ({ ...prev, result, loading: false }));

      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Dosya okunamadı';
      setSlot(prev => ({ ...prev, loading: false, error: msg }));
      return null;
    }
  };

  const handleSlotA = async (file: File) => {
    setDiffResult(null);
    setDiffUsers(null);
    const result = await processSlot(file, 'a');
    if (result) {
      const other = slotB.result;
      if (other) {
        const diff = calculateDiff(result, other);
        setDiffResult(diff);
        setDiffUsers({
          newFollowers: diff.newFollowers,
          lostFollowers: diff.lostFollowers,
          lostFollowing: diff.lostFollowing,
        });
      }
    }
  };

  const handleSlotB = async (file: File) => {
    setDiffResult(null);
    setDiffUsers(null);
    const result = await processSlot(file, 'b');
    if (result) {
      const other = slotA.result;
      if (other) {
        const diff = calculateDiff(result, other);
        setDiffResult(diff);
        setDiffUsers({
          newFollowers: diff.newFollowers,
          lostFollowers: diff.lostFollowers,
          lostFollowing: diff.lostFollowing,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <UploadSlot slot={slotA} label="ZIP 1 (önceki)" onFile={handleSlotA} />
        <UploadSlot slot={slotB} label="ZIP 2 (yeni)" onFile={handleSlotB} />
      </div>

      {slotA.result && slotB.result && diffResult && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ZIP 1 (önceki)</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {slotA.result.followersCount} takipçi · {slotA.result.followingCount} takip
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ZIP 2 (yeni)</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {slotB.result.followersCount} takipçi · {slotB.result.followingCount} takip
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Takipçiler" value={slotB.result.followersCount} icon={UsersIcon} change={diffResult.followerChange} index={0} />
            <StatCard title="Takip Edilenler" value={slotB.result.followingCount} icon={UserCheck} change={diffResult.followingChange} index={1} />
            <StatCard title="Geri Takip Etmeyenler" value={slotB.result.unfollowers.length} icon={UserMinus} index={2} />
            <StatCard title="Hayranlar" value={slotB.result.fans.length} icon={Heart} index={3} />
          </div>

          <DiffSummary diff={diffResult} selected={selectedCategory} onSelect={setSelectedCategory} />

          {diffUsers && selectedCategory && (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedCategory === 'newFollowers' && (
                <UserDiffList
                  users={diffUsers.newFollowers}
                  title="Yeni Takipçiler"
                  emptyMessage="Yeni takipçi yok"
                  icon={<Heart className="h-5 w-5 text-white" />}
                />
              )}
              {selectedCategory === 'lostFollowers' && (
                <UserDiffList
                  users={diffUsers.lostFollowers}
                  title="Takipten Çıkaranlar"
                  emptyMessage="Takipten çıkaran yok"
                  icon={<UserMinus className="h-5 w-5 text-white" />}
                />
              )}
              {selectedCategory === 'lostFollowing' && (
                <UserDiffList
                  users={diffUsers.lostFollowing}
                  title="Takipten Çıkılanlar"
                  emptyMessage="Takipten çıkılan yok"
                  icon={<UserMinus className="h-5 w-5 text-white" />}
                />
              )}
            </motion.div>
          )}

        </motion.div>
      )}

      {!slotA.file && !slotB.file && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            İki farklı Threads ZIP dosyanızı yükleyerek aradaki farkı görün.
          </p>
        </div>
      )}
    </div>
  );
}
