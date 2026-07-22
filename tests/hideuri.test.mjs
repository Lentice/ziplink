import test from 'node:test';
import assert from 'node:assert/strict';

import hideuri from '../services/hideuri.js';

test('HideURI returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ result_url: 'https://hideuri.com/6zp3BV' }));

  const shortUrl = await hideuri.shorten('https://example.com/article');

  assert.equal(shortUrl, 'https://hideuri.com/6zp3BV');
});

test('HideURI reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    hideuri.shorten('https://example.com/article'),
    { message: 'HideURI returned HTTP 503' },
  );
});

test('HideURI rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ result_url: 'not-a-short-url' }));

  await assert.rejects(
    hideuri.shorten('https://example.com/article'),
    { message: 'HideURI returned no short URL' },
  );
});
