import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UnThreaded",
  description: "Threads takipçilerinizi analiz edin. %100 güvenli, istemci tarafında çalışan analiz aracı.",
  keywords: ["threads", "takipçi", "analiz", "follower", "unfollower"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                var s = JSON.parse(localStorage.getItem('unthreaded_settings') || '{}');
                var theme = s.theme || 'light';
                var preset = s.colorPreset || 'indigo';
                if (theme === 'dark') document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', preset);
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600">
          by Barış İşgören made with ❤
        </footer>
      </body>
    </html>
  );
}
