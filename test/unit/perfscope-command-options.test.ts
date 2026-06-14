import assert from 'node:assert/strict';
import test from 'node:test';
import { createPerfScopeCommandOptions, shouldRevealDashboard } from '../../src/ui/perfscope-command-options';

test('webview command options preserve source', () => {
  assert.deepEqual(createPerfScopeCommandOptions('sidebar'), { source: 'sidebar' });
  assert.deepEqual(createPerfScopeCommandOptions('dashboard'), { source: 'dashboard' });
});

test('sidebar commands do not reveal the full Dashboard automatically', () => {
  assert.equal(shouldRevealDashboard(createPerfScopeCommandOptions('sidebar')), false);
  assert.equal(shouldRevealDashboard(createPerfScopeCommandOptions('dashboard')), true);
  assert.equal(shouldRevealDashboard(undefined), true);
});
