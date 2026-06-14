export type PerfScopeCommandSource = 'dashboard' | 'sidebar' | 'command';

export interface PerfScopeCommandOptions {
  source: PerfScopeCommandSource;
}

export function createPerfScopeCommandOptions(source: PerfScopeCommandSource): PerfScopeCommandOptions {
  return { source };
}

export function shouldRevealDashboard(options?: PerfScopeCommandOptions): boolean {
  return options?.source !== 'sidebar';
}
