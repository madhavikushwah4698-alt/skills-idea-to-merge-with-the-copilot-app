import test from 'node:test';
import assert from 'node:assert/strict';
import { createSlug, formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.mjs';

test('normalizes URLs with and without https to the same saved value', () => {
  assert.equal(normalizeUrl('https://www.example.com'), 'https://www.example.com/');
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com/');
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage', () => {
  for (const stored of ['', 'not json', '{"url":"https://example.com","slug":"mona-7fk2"}', '"legacy"']) {
    assert.deepEqual(loadBookmarks(stored), []);
  }

  assert.deepEqual(
    loadBookmarks(JSON.stringify([
      { url: 'https://www.example.com/', slug: 'mona-7fk2' },
      { url: 'javascript:alert(1)', slug: 'mona-8gL0' },
      { url: 'https://example.org/', slug: 'legacy-slug' },
      { url: 42, slug: 'mona-abCD' },
      null,
    ])),
    [{ url: 'https://www.example.com/', slug: 'mona-7fk2' }],
  );
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});

test('creates a short base62 slug with the mona prefix', () => {
  const slug = createSlug(['mona-0000']);
  assert.match(slug, /^mona-[0-9a-zA-Z]{4}$/);
  assert.notEqual(slug, 'mona-0000');
});
