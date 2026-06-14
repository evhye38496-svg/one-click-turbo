import * as vscode from 'vscode';
import { createStatusPresentation, type PerfScopeStatusSnapshot } from './status-bar-state';

export class PerfScopeStatusBar {
  private readonly item: vscode.StatusBarItem;
  private lastScore: PerfScopeStatusSnapshot | undefined;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'perfscope.showDashboard';
    this.apply({ kind: 'idle' });
  }

  show(): void {
    this.item.show();
  }

  setIdle(): void {
    this.apply(this.lastScore ?? { kind: 'idle' });
  }

  updateScore(score: number, grade: string, lastScanAt = new Date().toISOString()): void {
    this.lastScore = { kind: 'score', score, grade, lastScanAt };
    this.apply(this.lastScore);
  }

  setScanning(): void {
    this.apply({ kind: 'scanning' });
  }

  setAuditing(): void {
    this.apply({ kind: 'auditing' });
  }

  setFixing(): void {
    this.apply({ kind: 'fixing' });
  }

  setUndoing(): void {
    this.apply({ kind: 'undoing' });
  }

  setExporting(): void {
    this.apply({ kind: 'exporting' });
  }

  setError(message: string): void {
    this.apply({ kind: 'error', message });
  }

  dispose(): void {
    this.item.dispose();
  }

  private apply(snapshot: PerfScopeStatusSnapshot): void {
    const presentation = createStatusPresentation(snapshot);
    this.item.text = presentation.text;
    this.item.tooltip = presentation.tooltip;
  }
}
