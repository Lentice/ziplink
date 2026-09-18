import test from 'node:test';
import assert from 'node:assert/strict';

import isgd from '../services/isgd.js';

test('is.gd returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ shorturl: 'https://is.gd/aDSh' })));

  assert.equal(await isgd.shorten('https://example.com/article'), 'https://is.gd/aDSh');
});

test('is.gd reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    isgd.shorten('https://example.com/article'),
    { message: 'is.gd returned HTTP 503' },
  );
});

test('is.gd surfaces the API error message', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ errorcode: 2, errormessage: 'Please enter a valid URL' })));

  await assert.rejects(
    isgd.shorten('https://example.com/article'),
    { message: 'Please enter a valid URL' },
  );
});

test('is.gd rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));

  await assert.rejects(
    isgd.shorten('https://example.com/article'),
    { message: 'is.gd returned no short URL' },
  );
});

test('is.gd reports a non-JSON body as an invalid response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('  Rate limit exceeded  '));

  await assert.rejects(
    isgd.shorten('https://example.com/article'),
    { message: 'Rate limit exceeded' },
  );
});
