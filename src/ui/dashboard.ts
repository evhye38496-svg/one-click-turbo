import * as vscode from 'vscode';
import type { ScanResult } from '../types';
import type { PerfScopeUiState } from '../state/perfscope-state';
import { createCspNonce } from '../utils/csp-nonce';
import { resolveDashboardCommand } from './dashboard-messages';
import { renderDashboardHtml, type DashboardViewMode } from './dashboard-renderer';
import { executePerfScopeCommand } from './perfscope-command-dispatch';

export class PerfScopeDashboard {
  private panel: vscode.WebviewPanel | undefined;
  private lastResult: ScanResult | undefined;
  private lastState: PerfScopeUiState = {};
  private viewMode: DashboardViewMode = 'scan';

  constructor(private readonly extensionUri: vscode.Uri) {}

  show(viewMode: DashboardViewMode = this.viewMode): void {
    this.viewMode = viewMode;
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'perfscopeDashboard',
        'PerfScope',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [this.extensionUri]
        }
      );

      this.panel.webview.onDidReceiveMessage((message) => {
        const command = resolveDashboardCommand(message);
        if (command) {
          executePerfScopeCommand(command, 'dashboard');
        }
      });

      this.panel.onDidDispose(() => {
        this.panel = undefined;
      });
    }

    this.render();
    this.panel.reveal(vscode.ViewColumn.One);
  }

  update(result: ScanResult, viewMode: DashboardViewMode = this.viewMode): void {
    this.lastResult = result;
    this.lastState = {
      ...this.lastState,
      lastResult: result
    };
    this.viewMode = viewMode;
    if (this.panel) {
      this.render();
    }
  }

  updateState(state: PerfScopeUiState, viewMode: DashboardViewMode = this.viewMode): void {
    this.lastState = state;
    this.lastResult = state.lastResult;
    this.viewMode = viewMode;
    if (this.panel) {
      this.render();
    }
  }

  private render(): void {
    if (!this.panel) {
      return;
    }

    this.panel.webview.html = renderDashboardHtml({
      cspSource: this.panel.webview.cspSource,
      nonce: createCspNonce(),
      result: this.lastResult,
      operation: this.lastState.lastOperation,
      viewMode: this.viewMode
    });
  }
}
