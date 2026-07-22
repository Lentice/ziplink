import test from 'node:test';
import assert from 'node:assert/strict';

import { services } from '../services/registry.js';

test('replacement services are appended to the registry', () => {
  assert.deepEqual(services.slice(-2).map(({ id }) => id), ['hideuri', 'clcis']);
});

test('removed services are absent from the registry', () => {
  assert.deepEqual(services.filter(({ id }) => ['tinyurl', 'cleanuri'].includes(id)), []);
});
