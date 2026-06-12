import assert from 'node:assert/strict';
import test from 'node:test';
import { hasAlwaysOnActivation, hasStartupFinishedActivation, normalizeActivationEvents } from '../../src/engine/activation-events';

test('normalizes activationEvents safely', () => {
  assert.deepEqual(normalizeActivationEvents(['*', 123, 'onStartupFinished', null]), ['*', 'onStartupFinished']);
  assert.deepEqual(normalizeActivationEvents(undefined), []);
});

test('detects always-on activation', () => {
  assert.equal(hasAlwaysOnActivation(['*']), true);
  assert.equal(hasAlwaysOnActivation(['onLanguage:typescript']), false);
});

test('detects onStartupFinished activation', () => {
  assert.equal(hasStartupFinishedActivation(['onStartupFinished']), true);
  assert.equal(hasStartupFinishedActivation(['onCommand:example']), false);
});
