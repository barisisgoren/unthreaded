'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMinus, Heart, Users as UsersIcon, BarChart3, GitCompare, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import UserList from './components/UserList';
import ThemeToggle from './components/ThemeToggle';
import CompareSection from './components/CompareSection';
import SettingsModal from './components/SettingsModal';
import { AnalysisResult, ListMode } from './types';
import { analyzeThreadsData } from './lib/analyzer';
import { extractThreadsDataFromZip } from './lib/zipHandler';
import { getSettings, applySettings } from './lib/settings';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ListMode>('unfollowers');
  const [pageTab, setPageTab] = useState<'analysis' | 'compare'>('analysis');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    applySettings(getSettings());
  }, []);

  const handleFileSelected = async (zipFile: File) => {
    setLoading(true);
    setError('');

    try {
      const { followersData, followingData } = await extractThreadsDataFromZip(zipFile);
      const result = analyzeThreadsData(followersData, followingData);
      setAnalysisResult(result);

      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      
    } catch (err) {
      console.error('Analiz hatası:', err);
      setError(err instanceof Error ? err.message : 'Dosya analiz edilirken bir hata oluştu.');
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'analysis' as const, label: 'Analiz', icon: BarChart3 },
    { id: 'compare' as const, label: 'Karşılaştırma', icon: GitCompare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/icon.png" alt="UnThreaded" width={36} height={36} className="rounded-lg" priority />
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                UnThreaded
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Ayarlar"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex gap-1 mt-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = pageTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPageTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center mt-2">
            <Link
              href="/kullanim"
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <HelpCircle className="h-4 w-4" />
              Nasıl Kullanılır
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {pageTab === 'analysis' && (
          <>
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileUpload onFileSelected={handleFileSelected} loading={loading} />
            </motion.section>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-4"
                >
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {analysisResult && !loading && (
                <motion.div
                  id="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <AnalysisDashboard result={analysisResult} />

                  <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                    {[
                      { id: 'unfollowers', label: 'Takip Etmeyenler', icon: UserMinus, count: analysisResult.unfollowers.length },
                      { id: 'fans', label: 'Hayranlar', icon: Heart, count: analysisResult.fans.length },
                      { id: 'mutuals', label: 'Karşılıklı', icon: UsersIcon, count: analysisResult.mutuals.length }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as ListMode)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            activeTab === tab.id
                              ? 'bg-gray-200 dark:bg-gray-600'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'unfollowers' && (
                        <UserList
                          users={analysisResult.unfollowers}
                          title="Seni Takip Etmeyenler"
                          emptyMessage="Harika! Takip ettiğiniz herkes sizi takip ediyor 🎉"
                          icon={<UserMinus className="h-5 w-5 text-white" />}
                        />
                      )}
                      {activeTab === 'fans' && (
                        <UserList
                          users={analysisResult.fans}
                          title="Hayranlarınız"
                          emptyMessage="Henüz sadece sizi takip eden kimse yok"
                          icon={<Heart className="h-5 w-5 text-white" />}
                        />
                      )}
                      {activeTab === 'mutuals' && (
                        <UserList
                          users={analysisResult.mutuals}
                          title="Karşılıklı Takipleşenler"
                          emptyMessage="Karşılıklı takipleştiğiniz kimse yok"
                          icon={<UsersIcon className="h-5 w-5 text-white" />}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {!analysisResult && !loading && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verileriniz %100 tarayıcınızda işlenir, hiçbir sunucuya gönderilmez.
                </p>
              </div>
            )}
          </>
        )}

        {pageTab === 'compare' && (
          <CompareSection />
        )}
      </main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
