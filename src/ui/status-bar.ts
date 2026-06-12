import * as vscode from 'vscode';

export class TurboStatusBar {
  private readonly item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'turbo.showDashboard';
    this.item.text = '$(zap) Turbo';
    this.item.tooltip = 'One-Click Turbo: no scan has run yet';
  }

  show(): void {
    this.item.show();
  }

  updateScore(score: number, grade: string): void {
    this.item.text = `$(zap) ${score}`;
    this.item.tooltip = `One-Click Turbo Score: ${score} (${grade})`;
  }

  setScanning(): void {
    this.item.text = '$(sync~spin) Turbo';
    this.item.tooltip = 'One-Click Turbo scan is running';
  }

  dispose(): void {
    this.item.dispose();
  }
}
