import assert from 'node:assert/strict';
import test from 'node:test';
import { sortIssues } from '../../src/engine/issue-sort';
import type { Issue } from '../../src/types';

function issue(id: string, title: string, severity: Issue['severity']): Issue {
  return {
    id,
    title,
    description: title,
    severity,
    fixKind: 'suggestion-only',
    source: 'configuration'
  };
}

test('sorts issues by severity then title', () => {
  const sorted = sortIssues([
    issue('1', 'Z info', 'info'),
    issue('2', 'B warning', 'warning'),
    issue('3', 'A warning', 'warning'),
    issue('4', 'Critical', 'critical')
  ]);

  assert.deepEqual(
    sorted.map((item) => item.id),
    ['4', '3', '2', '1']
  );
});
