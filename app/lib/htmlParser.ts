/**
 * HTML içeriğinden benzersiz kullanıcı nesneleri oluşturur
 */
function buildUserEntry(username: string, href?: string, timestamp?: number) {
  return {
    title: username,
    media_list_data: [],
    string_list_data: [{
      href: href || `https://www.threads.com/${username}`,
      value: username,
      timestamp: timestamp || Date.now()
    }]
  };
}

/**
 * Kullanıcı listesinden tekrarlananları temizler
 */
function deduplicateUsers(users: ReturnType<typeof buildUserEntry>[]) {
  return Array.from(
    new Map(users.map(u => [u.string_list_data[0].value, u])).values()
  );
}

/**
 * HTML metninden @username kalıplarını ayıklar
 */
function extractUsernamesFromText(text: string): string[] {
  const regex = /@([a-zA-Z0-9._]+)/g;
  const usernames: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[1] && !usernames.includes(match[1])) {
      usernames.push(match[1]);
    }
  }
  return usernames;
}

/**
 * HTML içeriğinden threads.net veya threads.com bağlantılarını ayıklar
 */
function extractUsernamesFromLinks(html: string): { username: string; href: string }[] {
  const result: { username: string; href: string }[] = [];
  // threads.net/@username, threads.net/username veya threads.com/username
  const regex = /href="(https?:\/\/(?:www\.)?threads\.(?:net|com)\/@?([^"?]+))"/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const raw = match[2];
    // @ işaretini temizle
    const username = raw.startsWith('@') ? raw.slice(1) : raw;
    if (username && !result.some(r => r.username === username)) {
      result.push({ username, href });
    }
  }
  return result;
}

/**
 * HTML dosyasından Threads kullanıcı verilerini parse eder
 * followings.html ve followers.html formatlarını destekler
 */
export function parseThreadsHTML(htmlContent: string) {
  try {
    const users: ReturnType<typeof buildUserEntry>[] = [];

    // Yöntem 1: Linklerden username çıkar (en güvenilir)
    const linkEntries = extractUsernamesFromLinks(htmlContent);
    for (const entry of linkEntries) {
      users.push(buildUserEntry(entry.username, entry.href));
    }

    // Yöntem 2: DOM üzerinden parse et (tarayıcıda)
    if (users.length === 0 && typeof window !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // <a href="...threads.net/@..." veya <a href="...threads.com/...">
      const links = doc.querySelectorAll('a[href*="threads.net"], a[href*="threads.com"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          const match = href.match(/threads\.(?:net|com)\/@?([^/?]+)/);
          if (match && match[1]) {
            const raw = match[1];
            const username = raw.startsWith('@') ? raw.slice(1) : raw;
            let timestamp = Date.now();
            const parent = link.parentElement;
            if (parent) {
              const timeText = parent.textContent || '';
              const dateMatch = timeText.match(/\d{4}-\d{2}-\d{2}/);
              if (dateMatch) {
                timestamp = new Date(dateMatch[0]).getTime();
              }
            }
            if (!users.some(u => u.string_list_data[0].value === username)) {
              users.push(buildUserEntry(username, href, timestamp));
            }
          }
        }
      });
    }

    // Yöntem 3: @username metin kalıplarını ara
    if (users.length === 0) {
      const bodyText = typeof window !== 'undefined'
        ? (new DOMParser().parseFromString(htmlContent, 'text/html').body?.textContent || '')
        : htmlContent;
      const usernames = extractUsernamesFromText(bodyText);
      for (const username of usernames) {
        users.push(buildUserEntry(username));
      }
    }

    // Yöntem 4: Ham HTML'de doğrudan @username ara (son çare)
    if (users.length === 0) {
      const usernames = extractUsernamesFromText(htmlContent);
      for (const username of usernames) {
        users.push(buildUserEntry(username));
      }
    }

    return deduplicateUsers(users);
  } catch (error) {
    console.error('HTML parse hatası:', error);
    throw new Error('HTML dosyası parse edilemedi');
  }
}

/**
 * Dosyanın HTML mi JSON mu olduğunu kontrol eder
 */
export function isHTMLContent(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.startsWith('<') || trimmed.includes('<!DOCTYPE') || trimmed.includes('<html');
}

/**
 * Hem JSON hem de HTML formatlarını destekleyen universal parser
 */
export function parseThreadsData(content: string) {
  if (isHTMLContent(content)) {
    return parseThreadsHTML(content);
  }
  // JSON parse
  try {
    return JSON.parse(content);
  } catch {
    throw new Error('Geçersiz JSON formatı');
  }
}
