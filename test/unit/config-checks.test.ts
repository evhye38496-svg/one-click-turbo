import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeConfiguration } from '../../src/engine/config-checks';

test('creates issues for missing performance-related configuration', () => {
  const issues = analyzeConfiguration({
    watcherExclude: undefined,
    searchExclude: undefined,
    searchFollowSymlinks: true,
    editorMinimapEnabled: true
  });

  assert.equal(issues.some((issue) => issue.id === 'config.watcher.node_modules'), true);
  assert.equal(issues.some((issue) => issue.id === 'config.search.exclude'), true);
  assert.equal(issues.some((issue) => issue.id === 'config.search.symlinks'), true);
  assert.equal(issues.some((issue) => issue.fixKind === 'suggestion-only'), true);
});

test('does not create watcher issues when expected exclusions exist', () => {
  const issues = analyzeConfiguration({
    watcherExclude: {
      '**/node_modules/**': true,
      '**/.git/objects/**': true
    },
    searchExclude: {
      '**/node_modules': true
    },
    searchFollowSymlinks: false,
    editorMinimapEnabled: false
  });

  assert.equal(issues.some((issue) => issue.id.startsWith('config.watcher.')), false);
  assert.equal(issues.some((issue) => issue.id === 'config.search.exclude'), false);
});
