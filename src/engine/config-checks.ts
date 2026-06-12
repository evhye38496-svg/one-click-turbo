import type { ConfigSnapshot, Issue } from '../types';

function hasTruthyPattern(config: Record<string, unknown> | undefined, candidates: readonly string[]): boolean {
  if (!config) {
    return false;
  }

  return candidates.some((candidate) => config[candidate] === true);
}

export function analyzeConfiguration(config: ConfigSnapshot): Issue[] {
  const issues: Issue[] = [];

  if (!hasTruthyPattern(config.watcherExclude, ['**/node_modules/**', '**/node_modules'])) {
    issues.push({
      id: 'config.watcher.node_modules',
      title: 'Watcher exclude is missing node_modules',
      description: 'Adding node_modules to files.watcherExclude can reduce background file watching pressure in large projects.',
      severity: 'warning',
      fixKind: 'safe-auto-fix',
      source: 'configuration'
    });
  }

  if (!hasTruthyPattern(config.watcherExclude, ['**/.git/objects/**', '**/.git'])) {
    issues.push({
      id: 'config.watcher.git',
      title: 'Watcher exclude is missing .git objects',
      description: 'Excluding Git object folders can avoid unnecessary file watcher work.',
      severity: 'info',
      fixKind: 'safe-auto-fix',
      source: 'configuration'
    });
  }

  if (!config.searchExclude || Object.keys(config.searchExclude).length === 0) {
    issues.push({
      id: 'config.search.exclude',
      title: 'Search exclude is not configured',
      description: 'Search exclusions can reduce search scope for generated or dependency folders.',
      severity: 'info',
      fixKind: 'safe-auto-fix',
      source: 'configuration'
    });
  }

  if (config.searchFollowSymlinks === true) {
    issues.push({
      id: 'config.search.symlinks',
      title: 'Search follows symbolic links',
      description: 'Following symlinks can expand search scope unexpectedly in some repositories.',
      severity: 'info',
      fixKind: 'safe-auto-fix',
      source: 'configuration'
    });
  }

  if (config.editorMinimapEnabled === true) {
    issues.push({
      id: 'config.editor.minimap',
      title: 'Minimap is enabled',
      description: 'The minimap is a personal preference. On low-powered machines, disabling it may reduce rendering work.',
      severity: 'info',
      fixKind: 'suggestion-only',
      source: 'configuration'
    });
  }

  return issues;
}
