import * as vscode from 'vscode';
import type { PerfScopeUiState } from '../state/perfscope-state';
import { createCspNonce } from '../utils/csp-nonce';
import { resolveDashboardCommand } from './dashboard-messages';
import { renderSidebarHtml } from './sidebar-renderer';
import { executePerfScopeCommand } from './perfscope-command-dispatch';

export class PerfScopeSidebarProvider implements vscode.WebviewViewProvider {
  private view: vscode.WebviewView | undefined;
  private state: PerfScopeUiState = {};

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly getState: () => PerfScopeUiState
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    this.state = this.getState();
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };

    webviewView.webview.onDidReceiveMessage((message) => {
      const command = resolveDashboardCommand(message);
      if (command) {
        executePerfScopeCommand(command, 'sidebar');
      }
    });

    this.render();
  }

  update(state: PerfScopeUiState): void {
    this.state = state;
    this.render();
  }

  private render(): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = renderSidebarHtml({
      cspSource: this.view.webview.cspSource,
      nonce: createCspNonce(),
      result: this.state.lastResult,
      operation: this.state.lastOperation
    });
  }
}
