import assert from 'node:assert/strict';
import test from 'node:test';
import {
  errorMessage,
  exportCanceledMessage,
  exportCompleteMessage,
  fixCompleteMessage,
  noChangeLogMessage,
  noFixesMessage,
  noReportMessage,
  purgeCompleteMessage,
  rollbackCompleteMessage,
  auditCompleteMessage
} from '../../src/ui/notification-messages';

test('notification summaries are concise and stable', () => {
  assert.equal(fixCompleteMessage({ applied: 2, skipped: 1, failed: 0 }), 'PerfScope fix complete - applied 2, skipped 1, failed 0.');
  assert.equal(
    fixCompleteMessage({ applied: 0, skipped: 2, failed: 0, retainedPreviousChangeLog: true }),
    'PerfScope fix complete - applied 0, skipped 2, failed 0. No new Change Log was created; the previous undo record is still retained.'
  );
  assert.equal(
    rollbackCompleteMessage({
      restored: 1,
      skipped: 1,
      failed: 0,
      remainingChangeLog: {
        workspaceId: 'workspace',
        timestamp: 1,
        entries: [
          {
            key: 'search.exclude',
            target: 'workspace',
            existedBefore: false,
            newValue: {},
            workspaceId: 'workspace',
            timestamp: 1
          }
        ]
      }
    }),
    'PerfScope undo complete - restored 1, skipped 1, failed 0. 1 Change Log entries remain for a future undo attempt.'
  );
  assert.equal(exportCompleteMessage('C:\\report.md'), 'PerfScope report exported - C:\\report.md');
  assert.equal(exportCanceledMessage(), 'PerfScope report export canceled.');
  assert.equal(
    purgeCompleteMessage({ clearedWorkspaceState: true, clearedGlobalState: false, clearedUiState: true, canceled: false }),
    'PerfScope purge complete - cleared workspace state, UI report state. Settings were not modified.'
  );
  assert.equal(purgeCompleteMessage({ clearedWorkspaceState: false, clearedGlobalState: false, clearedUiState: false, canceled: true }), 'PerfScope purge canceled.');
  assert.equal(noReportMessage(), 'PerfScope: Run a scan before exporting a Markdown report.');
  assert.equal(noFixesMessage(), 'PerfScope: No workspace safe fixes are available.');
  assert.equal(noChangeLogMessage(), 'PerfScope: No workspace fix Change Log found.');
  assert.equal(
    auditCompleteMessage({
      kind: 'quick-audit',
      score: 100,
      grade: 'Excellent',
      generatedAt: '2026-06-12T06:30:00.000Z',
      stats: {
        totalExtensions: 3,
        activeExtensions: 1,
        alwaysOnExtensions: 0,
        startupFinishedExtensions: 0,
        knownHeavyExtensions: 1,
        alternativeSuggestions: 0,
        redundancyHints: 0,
        extensionHostHeapMB: 0,
        extensionHostRssMB: 0,
        osFreeMemoryMB: 0
      },
      breakdown: {
        startup: 100,
        configuration: 100,
        extensionInventory: 100,
        environment: 100
      },
      issues: [],
      audit: {
        items: [],
        categoryCounts: {
          'theme-icon': 0,
          'lint-format': 0,
          'language-support': 0,
          'ai-completion': 0,
          'git-version-control': 0,
          snippets: 0,
          'utility-productivity': 0,
          'build-task-debug': 0,
          unknown: 0
        },
        knownHeavyCount: 1,
        alternativeCount: 0,
        redundancyHints: []
      }
    }),
    'PerfScope audit complete - 0 extensions, 1 guidance matches. Workspace configuration and environment stats were not measured.'
  );
});

test('notification error message includes action and error detail', () => {
  assert.equal(errorMessage('scan', new Error('boom')), 'PerfScope scan failed: boom');
});
