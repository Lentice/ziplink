import test from 'node:test';
import assert from 'node:assert/strict';

import { services, getService } from '../services/registry.js';

test('every registered service satisfies the contract', () => {
  for (const svc of services) {
    assert.equal(typeof svc.id, 'string', `${svc.name}: id must be a string`);
    assert.ok(svc.id, `${svc.name}: id must not be empty`);
    assert.ok(svc.name, `${svc.id}: name must not be empty`);
    assert.equal(typeof svc.shorten, 'function', `${svc.id}: shorten must be a function`);
  }
});

test('service ids are unique', () => {
  const ids = services.map(s => s.id);
  assert.deepEqual([...new Set(ids)], ids);
});

test('getService resolves a known id', () => {
  for (const svc of services) assert.equal(getService(svc.id), svc);
});

test('getService falls back to the first service for an unknown id', () => {
  assert.equal(getService('no-such-service'), services[0]);
});
