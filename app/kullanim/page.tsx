'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users as UsersIcon } from 'lucide-react';

export default function KullanimPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="UnThreaded" width={28} height={28} className="rounded" priority />
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">UnThreaded</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🧵 Verilerimi Threads&apos;ten Nasıl İndiririm?
        </h2>
        <p className="text-lg">
          Uygulamanın çalışabilmesi için Meta&apos;nın sizin için hazırladığı veri dosyasını yüklemeniz gerekir. Bu işlem tamamen ücretsizdir ve şifrenizi paylaşmanızı gerektirmez.
        </p>

        <section>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">1. Adım: Veri Talebi Sayfasına Gidin</h3>
          <p className="mb-3">Aşağıdaki bağlantıya tıklayarak Threads veri indirme sayfasına gidin:</p>
          <a
            href="https://accountscenter.threads.com/info_and_permissions/dyi/?show_frameless=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-3 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Threads Veri İndirme Sayfasına Git →
          </a>
          <p className="mt-2 text-sm text-gray-500">Giriş yapmadıysanız Threads hesabınızla oturum açmanız istenebilir.</p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">2. Adım: Bilgi İndirme Talebinde Bulunun</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Açılan sayfada <strong>&quot;Bilgi indirme veya aktarma talebinde bulun&quot;</strong> butonuna tıklayın.</li>
            <li>Karşınıza çıkan hesap listesinden <strong>sadece Threads</strong> hesabınızı seçip &quot;İleri&quot; deyin.</li>
            <li><strong>&quot;Tümünü&quot;</strong> seçeneğini seçip &quot;İleri&quot; deyin.</li>
            <li><strong>&quot;Cihaza indir&quot;</strong> seçeneğini işaretleyip &quot;İleri&quot; deyin.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">3. Adım: Format Ayarlarını Yapın</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Format:</strong> <span className="text-red-600 dark:text-red-400 font-bold">HTML</span> seçin.</li>
            <li><strong>Medya Kalitesi:</strong> Düşük seçin.</li>
          </ul>
          <p className="mt-3"><strong>&quot;Dosya Oluştur&quot;</strong> butonuna tıklayın.</p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">4. Adım: ZIP Dosyasını İndirin ve Yükleyin</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Meta verileri hazırlayınca (5-10 dk) e-posta alacaksınız.</li>
            <li>Aynı sayfadaki <strong>&quot;Kullanılabilir İndirmeler&quot;</strong> sekmesine gelin.</li>
            <li><strong>.zip</strong> dosyasını indirin.</li>
            <li>Hiçbir şeye dokunmadan doğrudan ana sayfadaki yükleme alanına sürükleyin.</li>
          </ol>
        </section>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-5">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🔒 Gizlilik Notu</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Yüklediğiniz ZIP dosyasındaki <code>followers.html</code> ve <code>following.html</code> tamamen tarayıcınız içinde işlenir. Hiçbir veri sunucuya gönderilmez.
          </p>
        </div>
      </main>
    </div>
  );
}
