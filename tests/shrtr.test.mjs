import test from 'node:test';
import assert from 'node:assert/strict';

import shrtr from '../services/shrtr.js';

test('Shrtr returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ short_url: 'https://shrtr.top/aDSh' })));

  assert.equal(await shrtr.shorten('https://example.com/article'), 'https://shrtr.top/aDSh');
});

test('Shrtr reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    shrtr.shorten('https://example.com/article'),
    { message: 'Shrtr returned HTTP 503' },
  );
});

test('Shrtr reports a rate limit distinctly from other HTTP failures', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 429 }));

  await assert.rejects(
    shrtr.shorten('https://example.com/article'),
    { message: 'Shrtr rate limit reached (30/window)' },
  );
});

test('Shrtr rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));

  await assert.rejects(
    shrtr.shorten('https://example.com/article'),
    { message: 'Shrtr returned no short_url' },
  );
});
