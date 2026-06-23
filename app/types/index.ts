// Threads JSON dosya formatları
export interface ThreadsUser {
  title: string;
  media_list_data: any[];
  string_list_data: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

export interface ThreadsFollower {
  title: string;
  media_list_data: any[];
  string_list_data: Array<{
    href: string;
    value: string;
    timestamp: number;
  }>;
}

// Ayrıştırılmış kullanıcı bilgisi
export interface ParsedUser {
  username: string;
  displayName: string;
  profileUrl: string;
  timestamp: number;
}

// Analiz sonuçları
export interface AnalysisResult {
  unfollowers: ParsedUser[];      // Geri takip etmeyenler
  fans: ParsedUser[];              // Sadece beni takip edenler
  mutuals: ParsedUser[];           // Karşılıklı takipleşenler
  followersCount: number;
  followingCount: number;
  analysisDate: string;
}

// Geçmiş rapor
export interface HistoricalReport {
  id: string;
  timestamp: number;
  date: string;
  result: AnalysisResult;
}

// Diff sonuçları (önceki raporla karşılaştırma)
export interface DiffResult {
  newUnfollowers: ParsedUser[];    // Yeni takipten çıkanlar
  newFollowers: ParsedUser[];      // Yeni takipçiler
  newFans: ParsedUser[];           // Yeni hayranlar
  lostFollowers: ParsedUser[];     // Takipten çıkanlar
  lostFollowing: ParsedUser[];     // Takipten çıkılanlar
  followerChange: number;          // +5 veya -3 gibi
  followingChange: number;
}

// UI için liste modu
export type ListMode = 'unfollowers' | 'fans' | 'mutuals';

// Tema
export type Theme = 'light' | 'dark';

// Renk teması
export type ColorPreset = 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'sky';

export interface AppSettings {
  theme: Theme;
  colorPreset: ColorPreset;
}
