import test from 'node:test';
import assert from 'node:assert/strict';

import ulvis from '../services/ulvis.js';

test('Ulvis returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('https://ulvis.net/aDSh'));

  const shortUrl = await ulvis.shorten('https://example.com/article');

  assert.equal(shortUrl, 'https://ulvis.net/aDSh');
});

test('Ulvis reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    ulvis.shorten('https://example.com/article'),
    { message: 'Ulvis returned HTTP 503' },
  );
});

test('Ulvis rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('not-a-short-url'));

  await assert.rejects(
    ulvis.shorten('https://example.com/article'),
    { message: 'Ulvis returned no short URL' },
  );
});
