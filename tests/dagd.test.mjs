import test from 'node:test';
import assert from 'node:assert/strict';

import dagd from '../services/dagd.js';

test('da.gd returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('https://da.gd/aDSh\n'));

  assert.equal(await dagd.shorten('https://example.com/article'), 'https://da.gd/aDSh');
});

test('da.gd reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    dagd.shorten('https://example.com/article'),
    { message: 'da.gd returned HTTP 503' },
  );
});

test('da.gd rejects a plaintext http:// short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('http://da.gd/aDSh'));

  await assert.rejects(
    dagd.shorten('https://example.com/article'),
    { message: 'http://da.gd/aDSh' },
  );
});

test('da.gd rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(''));

  await assert.rejects(
    dagd.shorten('https://example.com/article'),
    { message: 'Invalid response from da.gd' },
  );
});
