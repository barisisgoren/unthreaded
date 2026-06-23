# UnThreaded

Threads takipçi verilerinizi analiz edin. %100 istemci tarafında çalışır, hiçbir veri sunucuya gönderilmez.

## Özellikler

- **ZIP Yükleme** — Threads veri dışa aktarma ZIP'inizi sürükleyip bırakın
- **Geri Takip Etmeyenler** — Sizi takip etmeyenleri listeleyin
- **Hayranlar** — Sizi takip edip takip etmediğiniz kişiler
- **Karşılıklı Takipleşenler** — Ortak takipleştiğiniz hesaplar
- **Geçmiş Karşılaştırma** — Önceki analizlerle karşılaştırma yapın
- **Yan Yana Karşılaştırma** — İki farklı zaman dilimini karşılaştırın
- **Karanlık Tema** — Aydınlık/karanlık tema desteği
- **Renk Temaları** — 6 farklı renk preseti

## Kullanım

1. Meta Hesap Merkezi'nden Threads verinizi indirin (HTML formatı)
2. İndirdiğiniz ZIP dosyasını uygulamaya sürükleyin
3. Analiz sonuçlarını anında görün

## Teknolojiler

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [JSZip](https://stuk.github.io/jszip/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

## Geliştirme

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinde çalışır.

## Derleme

```bash
npm run build
```

Statik çıktı için `next.config.ts`'e `output: 'export'` ekleyin ve `npm run build` çalıştırın.

## Lisans

MIT
