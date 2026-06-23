import JSZip from 'jszip';
import { parseThreadsData } from './htmlParser';

/**
 * Bir dosya adının followers veya following dosyası olup olmadığını kontrol eder
 */
function matchFileName(fileName: string, type: 'followers' | 'following'): boolean {
  const name = fileName.toLowerCase();
  if (!name.endsWith('.html') && !name.endsWith('.htm')) return false;

  // Sadece dosya adını al (klasör yolunu kırp)
  const basename = name.split('/').pop() || name;
  // Uzantıyı kaldır
  const stem = basename.replace(/\.(html|htm)$/, '');

  if (type === 'followers') {
    // followers, follower, takipciler vb.
    return stem === 'followers' || stem === 'follower' ||
           stem.includes('followers') || stem.includes('follower');
  }

  if (type === 'following') {
    // following, followings, takip vb.
    return stem === 'following' || stem === 'followings' ||
           stem.includes('following') || stem.includes('followings');
  }

  return false;
}

/**
 * Zip dosyasını okur ve içindeki followers ve following HTML dosyalarını bulur
 * threads/followings.html, following.html, threads/followers.html vb. yolları destekler
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonData = any;

export async function extractThreadsDataFromZip(zipFile: File): Promise<{
  followersData: JsonData;
  followingData: JsonData;
}> {
  try {
    const zip = await JSZip.loadAsync(zipFile);

    let followersData = null;
    let followingData = null;

    // Debug: ZIP içindeki tüm dosyaları logla
    const allFiles: string[] = [];
    zip.forEach((relativePath) => { allFiles.push(relativePath); });
    console.log('[ZipHandler] ZIP içindeki dosyalar:', allFiles);

    const filePromises: Promise<void>[] = [];

    zip.forEach((relativePath, file) => {
      const fileName = relativePath.toLowerCase();

      // Followers HTML dosyası
      if (matchFileName(fileName, 'followers') && !file.dir) {
        console.log('[ZipHandler] Followers dosyası bulundu:', relativePath);
        filePromises.push(
          file.async('string').then(content => {
            followersData = parseThreadsData(content);
          })
        );
      }

      // Following HTML dosyası
      if (matchFileName(fileName, 'following') && !file.dir) {
        console.log('[ZipHandler] Following dosyası bulundu:', relativePath);
        filePromises.push(
          file.async('string').then(content => {
            followingData = parseThreadsData(content);
          })
        );
      }
    });

    // Tüm dosyaları bekle
    await Promise.all(filePromises);

    // Dosyalar bulunamadıysa hata fırlat
    if (!followersData || !followingData) {
      const missing = [];
      if (!followersData) missing.push('followers.html (followers, follower)');
      if (!followingData) missing.push('following.html (following, followings)');
      throw new Error(
        `Zip dosyasında gerekli dosyalar bulunamadı: ${missing.join(', ')}. ` +
        `Mevcut dosyalar: ${allFiles.join(', ')}`
      );
    }

    return { followersData, followingData };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Zip dosyası okunamadı: ${error.message}`);
    }
    throw new Error('Zip dosyası okunamadı');
  }
}

/**
 * Dosyanın zip olup olmadığını kontrol eder
 */
export function isZipFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.zip') || 
         file.type === 'application/zip' || 
         file.type === 'application/x-zip-compressed';
}
