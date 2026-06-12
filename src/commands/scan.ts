import * as vscode from 'vscode';
import { runScan } from '../engine/scan-engine';
import type { ScanResult } from '../types';
import { TurboDashboard } from '../ui/dashboard';
import { TurboNotifier } from '../ui/notifications';
import { TurboStatusBar } from '../ui/status-bar';

export interface ScanCommandDependencies {
  dashboard: TurboDashboard;
  notifier: TurboNotifier;
  statusBar: TurboStatusBar;
  setLastResult(result: ScanResult): void;
}

export async function runFullScanCommand(deps: ScanCommandDependencies): Promise<void> {
  deps.statusBar.setScanning();

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Turbo scan is running',
        cancellable: false
      },
      async () => {
        const result = await runScan();
        deps.setLastResult(result);
        deps.statusBar.updateScore(result.score, result.grade, result.generatedAt);
        deps.dashboard.update(result, 'scan');
        deps.dashboard.show('scan');
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
        title: 'Turbo extension audit is running',
        cancellable: false
      },
      async () => {
        const result = await runScan();
        deps.setLastResult(result);
        deps.statusBar.updateScore(result.score, result.grade, result.generatedAt);
        deps.dashboard.update(result, 'audit');
        deps.dashboard.show('audit');
        deps.notifier.showAuditComplete(result);
      }
    );
  } catch (error) {
    deps.statusBar.setError('Audit failed');
    deps.notifier.showError('audit', error);
  }
}
