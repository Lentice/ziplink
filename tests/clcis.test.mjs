import test from 'node:test';
import assert from 'node:assert/strict';

import clcis from '../services/clcis.js';

test('clc.is returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json([{ url: 'https://clc.is/Em4GZ' }]));

  const shortUrl = await clcis.shorten('https://example.com/article');

  assert.equal(shortUrl, 'https://clc.is/Em4GZ');
});

test('clc.is reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    clcis.shorten('https://example.com/article'),
    { message: 'clc.is returned HTTP 503' },
  );
});

test('clc.is rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json([]));

  await assert.rejects(
    clcis.shorten('https://example.com/article'),
    { message: 'clc.is returned no short URL' },
  );
});
