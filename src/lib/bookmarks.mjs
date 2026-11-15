const slugAlphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const slugPattern = /^mona-[0-9a-zA-Z]{4}$/;

export function normalizeUrl(value) {
  const input = value.trim();
  if (!input) throw new Error('Enter a URL to save.');

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`;
  let url;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new Error('Enter a valid web URL.');
  }

  if ((url.protocol !== 'https:' && url.protocol !== 'http:') || !url.hostname) {
    throw new Error('Enter a valid web URL.');
  }

  return url.href;
}

export function loadBookmarks(rawValue) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') return [];

  let parsed;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((item) => {
    if (
      item === null ||
      typeof item !== 'object' ||
      typeof item.url !== 'string' ||
      typeof item.slug !== 'string' ||
      !slugPattern.test(item.slug)
    ) {
      return [];
    }

    try {
      const url = normalizeUrl(item.url);
      if (url !== item.url) return [];
      return [{ url, slug: item.slug }];
    } catch {
      return [];
    }
  });
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

export function createSlug(existingSlugs = []) {
  const used = new Set(existingSlugs);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let suffix = '';
    for (let index = 0; index < 4; index += 1) {
      suffix += slugAlphabet[Math.floor(Math.random() * slugAlphabet.length)];
    }
    const slug = `mona-${suffix}`;
    if (!used.has(slug)) return slug;
  }
  throw new Error('Could not generate a unique bookmark slug. Please try again.');
}
