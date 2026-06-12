import assert from 'node:assert/strict';
import test from 'node:test';
import {
  errorMessage,
  fixCompleteMessage,
  noChangeLogMessage,
  noFixesMessage,
  rollbackCompleteMessage
} from '../../src/ui/notification-messages';

test('notification summaries are concise and stable', () => {
  assert.equal(fixCompleteMessage({ applied: 2, skipped: 1, failed: 0 }), 'Turbo fix complete - applied 2, skipped 1, failed 0.');
  assert.equal(rollbackCompleteMessage({ restored: 1, skipped: 0, failed: 1 }), 'Turbo undo complete - restored 1, skipped 0, failed 1.');
  assert.equal(noFixesMessage(), 'Turbo: No workspace safe fixes are available.');
  assert.equal(noChangeLogMessage(), 'Turbo: No workspace fix Change Log found.');
});

test('notification error message includes action and error detail', () => {
  assert.equal(errorMessage('scan', new Error('boom')), 'Turbo scan failed: boom');
});
