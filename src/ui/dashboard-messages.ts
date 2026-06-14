export type DashboardCommand =
  | 'runFullScan'
  | 'quickAudit'
  | 'applySafeFixes'
  | 'undoLastFix'
  | 'exportReport'
  | 'openFullDashboard';

const commandMap: Record<DashboardCommand, string> = {
  runFullScan: 'perfscope.runFullScan',
  quickAudit: 'perfscope.quickAudit',
  applySafeFixes: 'perfscope.applySafeFixes',
  undoLastFix: 'perfscope.undoLastFix',
  exportReport: 'perfscope.exportReport',
  openFullDashboard: 'perfscope.showDashboard'
};

export function resolveDashboardCommand(message: unknown): string | undefined {
  if (!message || typeof message !== 'object' || !('command' in message)) {
    return undefined;
  }

  const command = (message as { command?: unknown }).command;
  if (typeof command !== 'string') {
    return undefined;
  }

  return Object.prototype.hasOwnProperty.call(commandMap, command)
    ? commandMap[command as DashboardCommand]
    : undefined;
}
