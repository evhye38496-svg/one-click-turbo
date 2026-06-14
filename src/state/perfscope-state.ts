import * as vscode from 'vscode';
import type { ScanResult } from '../types';

export type PerfScopeOperationKind = 'scan' | 'audit' | 'fix' | 'undo' | 'export' | 'purge';
export type PerfScopeOperationStatus = 'success' | 'skipped' | 'failed' | 'canceled';

export interface PerfScopeOperationSummary {
  kind: PerfScopeOperationKind;
  status: PerfScopeOperationStatus;
  message: string;
  timestamp: string;
}

export interface PerfScopeUiState {
  lastResult?: ScanResult;
  lastOperation?: PerfScopeOperationSummary;
}

export class PerfScopeState implements vscode.Disposable {
  private readonly changeEmitter = new vscode.EventEmitter<PerfScopeUiState>();
  private snapshot: PerfScopeUiState = {};

  readonly onDidChange = this.changeEmitter.event;

  getLastResult(): ScanResult | undefined {
    return this.snapshot.lastResult;
  }

  getSnapshot(): PerfScopeUiState {
    return this.snapshot;
  }

  hasData(): boolean {
    return this.snapshot.lastResult !== undefined || this.snapshot.lastOperation !== undefined;
  }

  setLastResult(result: ScanResult, kind: 'scan' | 'audit' = 'scan'): void {
    this.snapshot = {
      ...this.snapshot,
      lastResult: result,
      lastOperation: {
        kind,
        status: 'success',
        message:
          kind === 'audit'
            ? `${result.audit.items.length} extensions audited; ${result.audit.knownHeavyCount} guidance matches. Workspace configuration and environment stats were not measured.`
            : `Score ${result.score}; ${result.issues.length} issues found.`,
        timestamp: result.generatedAt
      }
    };
    this.changeEmitter.fire(this.snapshot);
  }

  setLastOperation(operation: Omit<PerfScopeOperationSummary, 'timestamp'>): void {
    this.snapshot = {
      ...this.snapshot,
      lastOperation: {
        ...operation,
        timestamp: new Date().toISOString()
      }
    };
    this.changeEmitter.fire(this.snapshot);
  }

  clear(): void {
    this.snapshot = {};
    this.changeEmitter.fire(this.snapshot);
  }

  dispose(): void {
    this.changeEmitter.dispose();
  }
}
