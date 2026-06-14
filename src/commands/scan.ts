import * as vscode from 'vscode';
import { runQuickAudit, runScan } from '../engine/scan-engine';
import type { ScanResult } from '../types';
import { PerfScopeDashboard } from '../ui/dashboard';
import { PerfScopeNotifier } from '../ui/notifications';
import { PerfScopeStatusBar } from '../ui/status-bar';

export interface ScanCommandDependencies {
  dashboard: PerfScopeDashboard;
  notifier: PerfScopeNotifier;
  statusBar: PerfScopeStatusBar;
  revealDashboard: boolean;
  setLastResult(result: ScanResult, kind: 'scan' | 'audit'): void;
}

export async function runFullScanCommand(deps: ScanCommandDependencies): Promise<void> {
  deps.statusBar.setScanning();

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'PerfScope scan is running',
        cancellable: false
      },
      async () => {
        const result = await runScan();
        deps.setLastResult(result, 'scan');
        deps.statusBar.updateScore(result.score, result.grade, result.generatedAt);
        deps.dashboard.update(result, 'scan');
        if (deps.revealDashboard) {
          deps.dashboard.show('scan');
        }
        deps.notifier.showScanComplete(result);
      }
    );
  } catch (error) {
    deps.statusBar.setError('Scan failed');
    deps.notifier.showError('scan', error);
  }
}

export async function quickAuditCommand(deps: ScanCommandDependencies): Promise<void> {
  deps.statusBar.setAuditing();

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'PerfScope extension audit is running',
        cancellable: false
      },
      async () => {
        const result = await runQuickAudit();
        deps.setLastResult(result, 'audit');
        deps.statusBar.updateScore(result.score, result.grade, result.generatedAt);
        deps.dashboard.update(result, 'audit');
        if (deps.revealDashboard) {
          deps.dashboard.show('audit');
        }
        deps.notifier.showAuditComplete(result);
      }
    );
  } catch (error) {
    deps.statusBar.setError('Audit failed');
    deps.notifier.showError('audit', error);
  }
}
