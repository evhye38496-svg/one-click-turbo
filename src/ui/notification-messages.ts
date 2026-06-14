import type { ApplyFixResult, PurgeResult, RollbackResult, ScanResult } from '../types';

export function scanCompleteMessage(result: ScanResult): string {
  return `PerfScope scan complete - Score: ${result.score}. ${result.issues.length} issues found.`;
}

export function auditCompleteMessage(result: ScanResult): string {
  return `PerfScope audit complete - ${result.audit.items.length} extensions, ${result.audit.knownHeavyCount} guidance matches. Workspace configuration and environment stats were not measured.`;
}

export function fixCompleteMessage(result: ApplyFixResult): string {
  const retained = result.retainedPreviousChangeLog
    ? ' No new Change Log was created; the previous undo record is still retained.'
    : '';
  return `PerfScope fix complete - applied ${result.applied}, skipped ${result.skipped}, failed ${result.failed}.${retained}`;
}

export function rollbackCompleteMessage(result: RollbackResult): string {
  const remaining = result.remainingChangeLog
    ? ` ${result.remainingChangeLog.entries.length} Change Log entries remain for a future undo attempt.`
    : '';
  return `PerfScope undo complete - restored ${result.restored}, skipped ${result.skipped}, failed ${result.failed}.${remaining}`;
}

export function exportCompleteMessage(filePath: string): string {
  return `PerfScope report exported - ${filePath}`;
}

export function exportCanceledMessage(): string {
  return 'PerfScope report export canceled.';
}

export function purgeCompleteMessage(result: PurgeResult): string {
  if (result.canceled) {
    return 'PerfScope purge canceled.';
  }

  const cleared = [
    result.clearedWorkspaceState ? 'workspace state' : '',
    result.clearedGlobalState ? 'global state' : '',
    result.clearedUiState ? 'UI report state' : ''
  ].filter(Boolean);

  return cleared.length > 0
    ? `PerfScope purge complete - cleared ${cleared.join(', ')}. Settings were not modified.`
    : 'PerfScope purge complete - no saved PerfScope state was found.';
}

export function noReportMessage(): string {
  return 'PerfScope: Run a scan before exporting a Markdown report.';
}

export function noFixesMessage(): string {
  return 'PerfScope: No workspace safe fixes are available.';
}

export function noChangeLogMessage(): string {
  return 'PerfScope: No workspace fix Change Log found.';
}

export function errorMessage(action: string, error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error);
  return `PerfScope ${action} failed${detail ? `: ${detail}` : '.'}`;
}
