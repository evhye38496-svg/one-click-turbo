import * as assert from 'assert';
import * as vscode from 'vscode';

export async function run(): Promise<void> {
  const extension = vscode.extensions.getExtension('Evhye.perfscope') ?? vscode.extensions.getExtension('evhye.perfscope');
  assert.ok(extension, 'PerfScope extension should be discoverable');

  await extension.activate();

  const commands = await vscode.commands.getCommands(true);
  assert.ok(commands.includes('perfscope.dashboard.focus'), 'perfscope.dashboard.focus should be contributed by the side bar view');
  assert.ok(commands.includes('perfscope.runFullScan'), 'perfscope.runFullScan should be registered');
  assert.ok(commands.includes('perfscope.showDashboard'), 'perfscope.showDashboard should be registered');
  assert.ok(commands.includes('perfscope.quickAudit'), 'perfscope.quickAudit should be registered');
  assert.ok(commands.includes('perfscope.exportReport'), 'perfscope.exportReport should be registered');
  assert.ok(commands.includes('perfscope.applySafeFixes'), 'perfscope.applySafeFixes should be registered');
  assert.ok(commands.includes('perfscope.undoLastFix'), 'perfscope.undoLastFix should be registered');
  assert.ok(commands.includes('perfscope.purge'), 'perfscope.purge should be registered');

  await vscode.commands.executeCommand('perfscope.purge');
  await vscode.commands.executeCommand('perfscope.exportReport');
  await vscode.commands.executeCommand('perfscope.showDashboard');
  await vscode.commands.executeCommand('perfscope.runFullScan');
  await vscode.commands.executeCommand('perfscope.quickAudit');
  await vscode.commands.executeCommand('perfscope.undoLastFix');
  assert.ok(extension.isActive, 'extension should be active after running a PerfScope command');
}
