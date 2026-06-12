export type DashboardCommand = 'runFullScan' | 'quickAudit' | 'applySafeFixes' | 'undoLastFix';

const commandMap: Record<DashboardCommand, string> = {
  runFullScan: 'turbo.runFullScan',
  quickAudit: 'turbo.quickAudit',
  applySafeFixes: 'turbo.applySafeFixes',
  undoLastFix: 'turbo.undoLastFix'
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
