import * as vscode from 'vscode';
import type { FixPreviewItem, FixProposal } from '../types';
import { createWorkspaceFixProposals, type WorkspaceConfigValues } from '../fix/fix-engine';
import { loadWorkspaceChangeLog } from '../fix/change-log-manager';
import { applyWorkspaceFixes } from '../fix/settings-writer';
import { rollbackWorkspaceChangeLog } from '../fix/rollback';
import { TurboNotifier } from '../ui/notifications';
import { TurboStatusBar } from '../ui/status-bar';

export interface FixCommandDependencies {
  context: vscode.ExtensionContext;
  notifier: TurboNotifier;
  statusBar: TurboStatusBar;
}

function inspectWorkspaceValue<T>(key: string): T | undefined {
  return vscode.workspace.getConfiguration().inspect<T>(key)?.workspaceValue;
}

function readWorkspaceConfigValues(): WorkspaceConfigValues {
  return {
    watcherExclude: inspectWorkspaceValue<Record<string, unknown>>('files.watcherExclude'),
    searchExclude: inspectWorkspaceValue<Record<string, unknown>>('search.exclude'),
    searchFollowSymlinks: inspectWorkspaceValue<boolean>('search.followSymlinks')
  };
}

function toPreviewItem(proposal: FixProposal): FixPreviewItem {
  const added = proposal.addedKeys.length === 1 ? '1 change' : `${proposal.addedKeys.length} changes`;
  return {
    label: proposal.title,
    description: `Workspace - ${proposal.key}`,
    detail: `${added}; Deep Merge + User Wins. ${proposal.description}`,
    proposal
  };
}

export async function applySafeFixesCommand(deps: FixCommandDependencies): Promise<void> {
  const proposals = createWorkspaceFixProposals(readWorkspaceConfigValues());

  if (proposals.length === 0) {
    deps.statusBar.setIdle();
    deps.notifier.showNoFixes();
    return;
  }

  const selected = await vscode.window.showQuickPick(proposals.map(toPreviewItem), {
    canPickMany: true,
    title: 'Turbo Fix - Workspace Safe Fixes',
    placeHolder: 'Select workspace configuration fixes to apply'
  });

  if (!selected || selected.length === 0) {
    deps.statusBar.setIdle();
    return;
  }

  deps.statusBar.setFixing();

  try {
    const result = await applyWorkspaceFixes(
      deps.context,
      selected.map((item) => item.proposal)
    );
    deps.statusBar.setIdle();
    deps.notifier.showFixComplete(result);
  } catch (error) {
    deps.statusBar.setError('Fix failed');
    deps.notifier.showError('fix', error);
  }
}

export async function undoLastFixCommand(deps: FixCommandDependencies): Promise<void> {
  const changeLog = loadWorkspaceChangeLog(deps.context);

  if (!changeLog) {
    deps.statusBar.setIdle();
    deps.notifier.showNoChangeLog();
    return;
  }

  deps.statusBar.setUndoing();

  try {
    const result = await rollbackWorkspaceChangeLog(deps.context, changeLog);
    deps.statusBar.setIdle();
    deps.notifier.showRollbackComplete(result);
  } catch (error) {
    deps.statusBar.setError('Undo failed');
    deps.notifier.showError('undo', error);
  }
}
