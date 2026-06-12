import * as vscode from 'vscode';
import { runScan } from '../engine/scan-engine';
import type { ScanResult } from '../types';
import { TurboDashboard } from '../ui/dashboard';
import { TurboStatusBar } from '../ui/status-bar';

export interface ScanCommandDependencies {
  dashboard: TurboDashboard;
  statusBar: TurboStatusBar;
  setLastResult(result: ScanResult): void;
}

export async function runFullScanCommand(deps: ScanCommandDependencies): Promise<void> {
  deps.statusBar.setScanning();

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Turbo scan is running',
      cancellable: false
    },
    async () => {
      const result = await runScan();
      deps.setLastResult(result);
      deps.statusBar.updateScore(result.score, result.grade);
      deps.dashboard.update(result);
      deps.dashboard.show();
      void vscode.window.showInformationMessage(`Turbo Scan Complete — Score: ${result.score}. ${result.issues.length} issues found.`);
    }
  );
}
