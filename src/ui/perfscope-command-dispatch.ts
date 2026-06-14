import * as vscode from 'vscode';
import { createPerfScopeCommandOptions, type PerfScopeCommandSource } from './perfscope-command-options';

export function executePerfScopeCommand(command: string, source: PerfScopeCommandSource): void {
  const options = createPerfScopeCommandOptions(source);
  switch (command) {
    case 'perfscope.runFullScan':
      void vscode.commands.executeCommand('perfscope.runFullScan', options);
      return;
    case 'perfscope.quickAudit':
      void vscode.commands.executeCommand('perfscope.quickAudit', options);
      return;
    case 'perfscope.applySafeFixes':
      void vscode.commands.executeCommand('perfscope.applySafeFixes', options);
      return;
    case 'perfscope.undoLastFix':
      void vscode.commands.executeCommand('perfscope.undoLastFix', options);
      return;
    case 'perfscope.exportReport':
      void vscode.commands.executeCommand('perfscope.exportReport', options);
      return;
    case 'perfscope.showDashboard':
      void vscode.commands.executeCommand('perfscope.showDashboard', options);
      return;
    default:
      return;
  }
}
