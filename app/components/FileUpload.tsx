'use client';

import { useCallback, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  loading?: boolean;
}

export default function FileUpload({ onFileSelected, loading = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    const isZip = file.name.toLowerCase().endsWith('.zip') || 
                  file.type === 'application/zip' || 
                  file.type === 'application/x-zip-compressed';
    
    if (!isZip) {
      setError('Lütfen sadece ZIP dosyası yükleyin');
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setError('Dosya boyutu 50MB\'dan küçük olmalıdır');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleFileChange = (selectedFile: File) => {
    if (!validateFile(selectedFile)) return;
    setFile(selectedFile);
    onFileSelected(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileChange(files[0]);
  }, []);

  return (
    <div>
      <input
        type="file"
        id="zip-upload"
        accept=".zip"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) handleFileChange(files[0]);
        }}
        className="hidden"
        disabled={loading}
      />
      <label
        htmlFor="zip-upload"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          loading ? 'pointer-events-none opacity-50 border-gray-300 dark:border-gray-600' 
          : dragOver ? 'border-primary bg-primary-light'
          : file ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
          : 'border-gray-300 dark:border-gray-600 hover:border-primary bg-white dark:bg-gray-900'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Analiz ediliyor...</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--primary-light)' }}>
              <Upload className="h-8 w-8" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Threads ZIP dosyasını sürükle veya tıkla
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                followers.html ve following.html otomatik bulunacak
              </p>
            </div>
          </div>
        )}
      </label>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900"
          >
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
