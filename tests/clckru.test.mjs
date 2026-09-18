import test from 'node:test';
import assert from 'node:assert/strict';

import clckru from '../services/clckru.js';

test('Clck.ru returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('https://clck.ru/aDSh\n'));

  assert.equal(await clckru.shorten('https://example.com/article'), 'https://clck.ru/aDSh');
});

test('Clck.ru reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    clckru.shorten('https://example.com/article'),
    { message: 'Clck.ru returned HTTP 503' },
  );
});

test('Clck.ru surfaces a plaintext error body', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('Error: bad url'));

  await assert.rejects(
    clckru.shorten('https://example.com/article'),
    { message: 'Error: bad url' },
  );
});

test('Clck.ru rejects an empty response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(''));

  await assert.rejects(
    clckru.shorten('https://example.com/article'),
    { message: 'Invalid response from Clck.ru' },
  );
});
