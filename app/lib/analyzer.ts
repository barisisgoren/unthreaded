import { 
  ThreadsUser, 
  ThreadsFollower, 
  ParsedUser, 
  AnalysisResult, 
  DiffResult,
  HistoricalReport 
} from '../types';

/**
 * Threads JSON dosyasından kullanıcı listesini ayrıştırır
 */
export function parseThreadsUsers(data: ThreadsUser[] | ThreadsFollower[]): ParsedUser[] {
  if (!Array.isArray(data)) return [];
  
  const users: ParsedUser[] = [];
  
  data.forEach(item => {
    if (item.string_list_data && Array.isArray(item.string_list_data)) {
      item.string_list_data.forEach(entry => {
        if (entry.value && entry.href) {
          users.push({
            username: entry.value,
            displayName: item.title || entry.value,
            profileUrl: entry.href,
            timestamp: entry.timestamp || Date.now()
          });
        }
      });
    }
  });
  
  return users;
}

/**
 * İki kullanıcı listesini karşılaştırarak analiz oluşturur
 */
export function analyzeThreadsData(
  followersData: ThreadsFollower[],
  followingData: ThreadsUser[]
): AnalysisResult {
  const followers = parseThreadsUsers(followersData);
  const following = parseThreadsUsers(followingData);
  
  // Kullanıcı adlarını set'lere dönüştür (hızlı arama için)
  const followerUsernames = new Set(followers.map(u => u.username));
  const followingUsernames = new Set(following.map(u => u.username));
  
  // Geri takip etmeyenler: Takip ettiğim ama beni takip etmeyenler
  const unfollowers = following.filter(user => !followerUsernames.has(user.username));
  
  // Hayranlar: Beni takip eden ama ben takip etmediğim
  const fans = followers.filter(user => !followingUsernames.has(user.username));
  
  // Karşılıklı takipleşenler
  const mutuals = following.filter(user => followerUsernames.has(user.username));
  
  return {
    unfollowers: sortByUsername(unfollowers),
    fans: sortByUsername(fans),
    mutuals: sortByUsername(mutuals),
    followersCount: followers.length,
    followingCount: following.length,
    analysisDate: new Date().toISOString()
  };
}

/**
 * Kullanıcıları alfabetik sıraya göre sıralar
 */
export function sortByUsername(users: ParsedUser[]): ParsedUser[] {
  return [...users].sort((a, b) => 
    a.username.toLowerCase().localeCompare(b.username.toLowerCase())
  );
}

/**
 * Kullanıcı listesinde arama yapar
 */
export function searchUsers(users: ParsedUser[], query: string): ParsedUser[] {
  if (!query.trim()) return users;
  
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.username.toLowerCase().includes(lowerQuery)
  );
}

/**
 * İki analiz arasındaki farkları hesaplar
 */
export function calculateDiff(
  current: AnalysisResult,
  previous: AnalysisResult
): DiffResult {
  const currentUnfollowerNames = new Set(current.unfollowers.map(u => u.username));
  const previousUnfollowerNames = new Set(previous.unfollowers.map(u => u.username));
  
  const currentFollowerNames = new Set(
    [...current.fans, ...current.mutuals].map(u => u.username)
  );
  const previousFollowerNames = new Set(
    [...previous.fans, ...previous.mutuals].map(u => u.username)
  );
  
  // Yeni takipten çıkanlar
  const newUnfollowers = current.unfollowers.filter(
    user => !previousUnfollowerNames.has(user.username)
  );
  
  // Yeni takipçiler (daha önce takipçi değildi, şimdi takipçi)
  const newFollowers = [...current.fans, ...current.mutuals].filter(
    user => !previousFollowerNames.has(user.username)
  );
  
  // Yeni hayranlar
  const newFans = current.fans.filter(
    user => !new Set(previous.fans.map(u => u.username)).has(user.username)
  );
  
  // Kaybedilen takipçiler (takipten çıkanlar)
  const lostFollowers = [...previous.fans, ...previous.mutuals].filter(
    user => !currentFollowerNames.has(user.username)
  );

  // Takipten çıkılanlar (benim takibi bıraktıklarım)
  const previousFollowingNames = new Set(
    [...previous.unfollowers, ...previous.mutuals].map(u => u.username)
  );
  const currentFollowingNames = new Set(
    [...current.unfollowers, ...current.mutuals].map(u => u.username)
  );
  const lostFollowing = [...previous.unfollowers, ...previous.mutuals].filter(
    user => !currentFollowingNames.has(user.username)
  );
  
  return {
    newUnfollowers,
    newFollowers,
    newFans,
    lostFollowers,
    lostFollowing,
    followerChange: current.followersCount - previous.followersCount,
    followingChange: current.followingCount - previous.followingCount
  };
}

/**
 * LocalStorage'a rapor kaydeder
 */
export function saveReport(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  
  const reports = getReports();
  const newReport: HistoricalReport = {
    id: `report_${Date.now()}`,
    timestamp: Date.now(),
    date: new Date().toLocaleString('tr-TR'),
    result
  };
  
  reports.push(newReport);
  
  // Son 10 raporu sakla
  const limitedReports = reports.slice(-10);
  localStorage.setItem('threads_reports', JSON.stringify(limitedReports));
}

/**
 * LocalStorage'dan raporları okur
 */
export function getReports(): HistoricalReport[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('threads_reports');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Raporlar okunamadı:', error);
    return [];
  }
}

/**
 * En son raporu getirir
 */
export function getLatestReport(): HistoricalReport | null {
  const reports = getReports();
  return reports.length > 0 ? reports[reports.length - 1] : null;
}

/**
 * Tüm raporları temizler
 */
export function clearReports(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('threads_reports');
}
