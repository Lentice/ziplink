import test from 'node:test';
import assert from 'node:assert/strict';

import vgd from '../services/vgd.js';

test('v.gd returns the short URL from a successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ shorturl: 'https://v.gd/aDSh' })));

  assert.equal(await vgd.shorten('https://example.com/article'), 'https://v.gd/aDSh');
});

test('v.gd reports an HTTP failure with service context', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));

  await assert.rejects(
    vgd.shorten('https://example.com/article'),
    { message: 'v.gd returned HTTP 503' },
  );
});

test('v.gd surfaces the API error message', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ errorcode: 2, errormessage: 'Please enter a valid URL' })));

  await assert.rejects(
    vgd.shorten('https://example.com/article'),
    { message: 'Please enter a valid URL' },
  );
});

test('v.gd rejects a response that does not contain a short URL', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));

  await assert.rejects(
    vgd.shorten('https://example.com/article'),
    { message: 'v.gd returned no short URL' },
  );
});

test('v.gd reports a non-JSON body as an invalid response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('  Rate limit exceeded  '));

  await assert.rejects(
    vgd.shorten('https://example.com/article'),
    { message: 'Rate limit exceeded' },
  );
});
