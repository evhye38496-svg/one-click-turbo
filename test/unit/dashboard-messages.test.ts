import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveDashboardCommand } from '../../src/ui/dashboard-messages';

test('dashboard message allowlist resolves only supported PerfScope commands', () => {
  assert.equal(resolveDashboardCommand({ command: 'runFullScan' }), 'perfscope.runFullScan');
  assert.equal(resolveDashboardCommand({ command: 'quickAudit' }), 'perfscope.quickAudit');
  assert.equal(resolveDashboardCommand({ command: 'applySafeFixes' }), 'perfscope.applySafeFixes');
  assert.equal(resolveDashboardCommand({ command: 'undoLastFix' }), 'perfscope.undoLastFix');
  assert.equal(resolveDashboardCommand({ command: 'exportReport' }), 'perfscope.exportReport');
  assert.equal(resolveDashboardCommand({ command: 'openFullDashboard' }), 'perfscope.showDashboard');
});

test('dashboard message allowlist ignores unknown or malformed messages', () => {
  assert.equal(resolveDashboardCommand({ command: 'workbench.extensions.action.disableExtension' }), undefined);
  assert.equal(resolveDashboardCommand({ command: 'perfscope.purge' }), undefined);
  assert.equal(resolveDashboardCommand({}), undefined);
  assert.equal(resolveDashboardCommand(undefined), undefined);
});
