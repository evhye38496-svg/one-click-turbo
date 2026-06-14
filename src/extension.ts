import * as vscode from 'vscode';
import { exportReportCommand } from './commands/export-report';
import { applySafeFixesCommand, undoLastFixCommand } from './commands/fix';
import { purgeCommand } from './commands/purge';
import { quickAuditCommand, runFullScanCommand } from './commands/scan';
import { PerfScopeState } from './state/perfscope-state';
import { PerfScopeDashboard } from './ui/dashboard';
import { PerfScopeNotifier } from './ui/notifications';
import { PerfScopeSidebarProvider } from './ui/sidebar';
import { PerfScopeStatusBar } from './ui/status-bar';
import { shouldRevealDashboard, type PerfScopeCommandOptions } from './ui/perfscope-command-options';

export function activate(context: vscode.ExtensionContext): void {
  const dashboard = new PerfScopeDashboard(context.extensionUri);
  const notifier = new PerfScopeNotifier();
  const state = new PerfScopeState();
  const sidebar = new PerfScopeSidebarProvider(context.extensionUri, () => state.getSnapshot());
  const statusBar = new PerfScopeStatusBar();
  statusBar.show();

  context.subscriptions.push(
    state,
    state.onDidChange((snapshot) => {
      sidebar.update(snapshot);
      dashboard.updateState(snapshot);
    }),
    vscode.window.registerWebviewViewProvider('perfscope.dashboard', sidebar)
  );

  context.subscriptions.push(
    statusBar,
    vscode.commands.registerCommand('perfscope.runFullScan', (options?: PerfScopeCommandOptions) =>
      runFullScanCommand({
        dashboard,
        notifier,
        statusBar,
        revealDashboard: shouldRevealDashboard(options),
        setLastResult(result, kind) {
          state.setLastResult(result, kind);
        }
      })
    ),
    vscode.commands.registerCommand('perfscope.showDashboard', () => {
      dashboard.updateState(state.getSnapshot());
      dashboard.show();
    }),
    vscode.commands.registerCommand('perfscope.quickAudit', (options?: PerfScopeCommandOptions) =>
      quickAuditCommand({
        dashboard,
        notifier,
        statusBar,
        revealDashboard: shouldRevealDashboard(options),
        setLastResult(result, kind) {
          state.setLastResult(result, kind);
        }
      })
    ),
    vscode.commands.registerCommand('perfscope.exportReport', () =>
      exportReportCommand({
        context,
        getLastResult() {
          return state.getLastResult();
        },
        notifier,
        statusBar,
        recordOperation(operation) {
          state.setLastOperation(operation);
        }
      })
    ),
    vscode.commands.registerCommand('perfscope.applySafeFixes', () =>
      applySafeFixesCommand({
        context,
        notifier,
        statusBar,
        recordOperation(operation) {
          state.setLastOperation(operation);
        }
      })
    ),
    vscode.commands.registerCommand('perfscope.undoLastFix', () =>
      undoLastFixCommand({
        context,
        notifier,
        statusBar,
        recordOperation(operation) {
          state.setLastOperation(operation);
        }
      })
    ),
    vscode.commands.registerCommand('perfscope.purge', () =>
      purgeCommand({
        context,
        notifier,
        statusBar,
        hasUiState() {
          return state.hasData();
        },
        clearUiState() {
          state.clear();
        },
        recordOperation(operation) {
          state.setLastOperation(operation);
        }
      })
    )
  );
}

export function deactivate(): void {
}
