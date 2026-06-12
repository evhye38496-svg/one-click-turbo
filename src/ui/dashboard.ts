import * as vscode from 'vscode';
import type { ScanResult } from '../types';
import { escapeHtml } from '../utils/html-escape';

export class TurboDashboard {
  private panel: vscode.WebviewPanel | undefined;
  private lastResult: ScanResult | undefined;

  constructor(private readonly extensionUri: vscode.Uri) {}

  show(): void {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'turboDashboard',
        'One-Click Turbo',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [this.extensionUri]
        }
      );

      this.panel.onDidDispose(() => {
        this.panel = undefined;
      });
    }

    this.render();
    this.panel.reveal(vscode.ViewColumn.One);
  }

  update(result: ScanResult): void {
    this.lastResult = result;
    if (this.panel) {
      this.render();
    }
  }

  private render(): void {
    if (!this.panel) {
      return;
    }

    const nonce = createNonce();
    this.panel.webview.html = this.getHtml(this.panel.webview, nonce);
  }

  private getHtml(webview: vscode.Webview, nonce: string): string {
    const cspSource = webview.cspSource;
    const content = this.lastResult ? renderResult(this.lastResult) : renderEmptyState();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${cspSource}; script-src 'nonce-${nonce}' ${cspSource}; img-src ${cspSource} data:; font-src ${cspSource}; connect-src 'none';">
  <title>One-Click Turbo</title>
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); margin: 0; }
    main { padding: 20px; max-width: 880px; }
    h1 { font-size: 22px; margin: 0 0 16px; }
    .score { display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px; }
    .score strong { font-size: 56px; line-height: 1; }
    .grade { color: var(--vscode-descriptionForeground); font-size: 18px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin: 18px 0; }
    .stat, .issue { border: 1px solid var(--vscode-panel-border); border-radius: 6px; padding: 10px; }
    .stat span { display: block; color: var(--vscode-descriptionForeground); font-size: 12px; }
    .issues { display: grid; gap: 8px; }
    .issue h3 { margin: 0 0 4px; font-size: 14px; }
    .issue p { margin: 0; color: var(--vscode-descriptionForeground); }
    .critical { border-left: 4px solid var(--vscode-errorForeground); }
    .warning { border-left: 4px solid var(--vscode-editorWarning-foreground); }
    .info { border-left: 4px solid var(--vscode-editorInfo-foreground); }
    .empty { color: var(--vscode-descriptionForeground); }
  </style>
</head>
<body>
  <main>${content}</main>
  <script nonce="${nonce}">
    // Reserved for V0.2 interactions. V0.1 dashboard is render-only.
  </script>
</body>
</html>`;
  }
}

function renderEmptyState(): string {
  return `<h1>One-Click Turbo</h1><p class="empty">Run <strong>Turbo: Run Full Scan</strong> to generate a read-only performance report.</p>`;
}

function renderResult(result: ScanResult): string {
  const issues = result.issues.length
    ? result.issues
        .map(
          (issue) => `<article class="issue ${issue.severity}">
  <h3>${escapeHtml(issue.title)}</h3>
  <p>${escapeHtml(issue.description)}</p>
</article>`
        )
        .join('')
    : '<p class="empty">No issues found in the V0.1 read-only scan.</p>';

  return `<h1>One-Click Turbo</h1>
<section class="score">
  <strong>${result.score}</strong>
  <span class="grade">${escapeHtml(result.grade)}</span>
</section>
<section class="stats">
  <div class="stat"><span>Extensions</span>${result.stats.totalExtensions}</div>
  <div class="stat"><span>Active</span>${result.stats.activeExtensions}</div>
  <div class="stat"><span>Always-on</span>${result.stats.alwaysOnExtensions}</div>
  <div class="stat"><span>Heap</span>${result.stats.extensionHostHeapMB} MB</div>
</section>
<h2>Issues (${result.issues.length})</h2>
<section class="issues">${issues}</section>`;
}

function createNonce(): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
