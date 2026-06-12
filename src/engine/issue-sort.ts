import type { Issue } from '../types';

const severityRank: Record<Issue['severity'], number> = {
  critical: 0,
  warning: 1,
  info: 2
};

export function sortIssues(issues: readonly Issue[]): Issue[] {
  return [...issues].sort((left, right) => {
    const severityDelta = severityRank[left.severity] - severityRank[right.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }

    return left.title.localeCompare(right.title);
  });
}
