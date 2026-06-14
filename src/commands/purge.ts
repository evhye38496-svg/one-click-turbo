import * as vscode from 'vscode';
import { PERFSCOPE_GLOBAL_STATE_KEYS, PERFSCOPE_WORKSPACE_STATE_KEYS } from '../fix/change-log-manager';
import type { PurgeResult } from '../types';
import { PerfScopeNotifier } from '../ui/notifications';
import { PerfScopeStatusBar } from '../ui/status-bar';
import type { PerfScopeOperationSummary } from '../state/perfscope-state';

export interface PurgeCommandDependencies {
  context: vscode.ExtensionContext;
  notifier: PerfScopeNotifier;
  statusBar: PerfScopeStatusBar;
  hasUiState(): boolean;
  clearUiState(): void;
  recordOperation(operation: Omit<PerfScopeOperationSummary, 'timestamp'>): void;
}

export async function purgeCommand(deps: PurgeCommandDependencies): Promise<void> {
  const hasWorkspaceState = PERFSCOPE_WORKSPACE_STATE_KEYS.some((key) => deps.context.workspaceState.get(key) !== undefined);
  const hasGlobalState = PERFSCOPE_GLOBAL_STATE_KEYS.some((key) => deps.context.globalState.get(key) !== undefined);
  const hasUiState = deps.hasUiState();

  if (!hasWorkspaceState && !hasGlobalState && !hasUiState) {
    deps.statusBar.setIdle();
    deps.recordOperation({
      kind: 'purge',
      status: 'skipped',
      message: 'No PerfScope state was available to purge.'
    });
    deps.notifier.showPurgeComplete({ clearedWorkspaceState: false, clearedGlobalState: false, clearedUiState: false, canceled: false });
    return;
  }

  const choice = await vscode.window.showWarningMessage(
    'PerfScope will clear only its own saved state and recent UI report data. It will not modify settings, uninstall extensions, or delete files. Continue?',
    { modal: true },
    'Continue',
    'Cancel'
  );

  if (choice !== 'Continue') {
    deps.statusBar.setIdle();
    deps.recordOperation({
      kind: 'purge',
      status: 'canceled',
      message: 'PerfScope purge was canceled before clearing state.'
    });
    deps.notifier.showPurgeComplete({ clearedWorkspaceState: false, clearedGlobalState: false, clearedUiState: false, canceled: true });
    return;
  }

  const result = await clearPerfScopeState(deps.context, hasUiState, deps.clearUiState);
  deps.statusBar.setIdle();
  deps.recordOperation({
    kind: 'purge',
    status: 'success',
    message: 'PerfScope saved state was cleared. Workspace settings were not modified.'
  });
  deps.notifier.showPurgeComplete(result);
}

export async function clearPerfScopeState(
  context: vscode.ExtensionContext,
  clearUiState: boolean,
  clearUiStateFn: () => void
): Promise<PurgeResult> {
  const hadWorkspaceState = PERFSCOPE_WORKSPACE_STATE_KEYS.some((key) => context.workspaceState.get(key) !== undefined);
  const hadGlobalState = PERFSCOPE_GLOBAL_STATE_KEYS.some((key) => context.globalState.get(key) !== undefined);

  await Promise.all([
    ...PERFSCOPE_WORKSPACE_STATE_KEYS.map((key) => context.workspaceState.update(key, undefined)),
    ...PERFSCOPE_GLOBAL_STATE_KEYS.map((key) => context.globalState.update(key, undefined))
  ]);

  if (clearUiState) {
    clearUiStateFn();
  }

  return {
    clearedWorkspaceState: hadWorkspaceState,
    clearedGlobalState: hadGlobalState,
    clearedUiState: clearUiState,
    canceled: false
  };
}
