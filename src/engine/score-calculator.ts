import type { Issue, ScanStats, ScoreBreakdown } from '../types';

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateBreakdown(stats: ScanStats, issues: readonly Issue[]): ScoreBreakdown {
  const startup = clampScore(
    100 -
      Math.max(0, stats.activeExtensions - 30) -
      stats.alwaysOnExtensions * 5 -
      stats.startupFinishedExtensions * 3
  );

  const configurationPenalty = issues
    .filter((issue) => issue.source === 'configuration' && issue.fixKind === 'safe-auto-fix')
    .reduce((total, issue) => total + (issue.severity === 'warning' ? 10 : 4), 0);

  const extensionInventory = clampScore(100 - stats.knownHeavyExtensions * 8);
  const configuration = clampScore(100 - configurationPenalty);
  const environment = clampScore(100 - (stats.extensionHostHeapMB > 200 ? 3 : 0));

  return {
    startup,
    configuration,
    extensionInventory,
    environment
  };
}

export function calculateTurboScore(breakdown: ScoreBreakdown): number {
  return clampScore(
    breakdown.startup * 0.35 +
      breakdown.configuration * 0.35 +
      breakdown.extensionInventory * 0.25 +
      breakdown.environment * 0.05
  );
}

export function gradeScore(score: number): 'Excellent' | 'Good' | 'Needs Attention' | 'Critical' {
  if (score >= 90) {
    return 'Excellent';
  }

  if (score >= 70) {
    return 'Good';
  }

  if (score >= 50) {
    return 'Needs Attention';
  }

  return 'Critical';
}
