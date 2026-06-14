# ⚡ PerfScope

**One-click health check for your VS Code performance.** Scan → Score → Fix, all in under 30 seconds.

[![Marketplace](https://img.shields.io/badge/Marketplace-v1.0-blue)](https://marketplace.visualstudio.com/items?itemName=Evhye.perfscope)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Evhye.perfscope?label=installs&color=green)](https://marketplace.visualstudio.com/items?itemName=Evhye.perfscope)

**Install:** [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Evhye.perfscope) · **Source:** [GitHub](https://github.com/evhye38496-svg/PerfScope) · **Feedback:** [Report an issue](https://github.com/evhye38496-svg/PerfScope/issues)

![PerfScope Dashboard](https://raw.githubusercontent.com/evhye38496-svg/PerfScope/main/docs/assets/turbo-score-dashboard.png)

## Why Do You Need It?

After installing too many VS Code extensions, startup can slow down, saving can stutter, and search can feel sluggish.
Most of the time, you do not even know which extension or setting is dragging things down.

PerfScope helps you:

- 🧪 **Scan in one click** across extension inventory, activation events, workspace settings, and memory hints
- 📊 **PerfScope Score** from 0 to 100 at a glance
- 🔧 **Fix safely in one click** with preview-first workspace settings changes
- ↩️ **Undo every fix** written by PerfScope
- 📄 **Export Markdown reports** for team sharing
- 🔒 **Stay fully offline** with no data uploads

PerfScope is for developers who have installed many VS Code extensions and want a local, preview-first way to understand what might be slowing their workspace down.

## V1.0

V1.0 is the first Marketplace release line, published under `Evhye`.

## Community

- [Contributing guide](https://github.com/evhye38496-svg/PerfScope/blob/main/CONTRIBUTING.md)
- [Support and safety policy](https://github.com/evhye38496-svg/PerfScope/blob/main/SUPPORT.md)
- [Growth playbook](https://github.com/evhye38496-svg/PerfScope/blob/main/docs/GROWTH_PLAYBOOK.md)
- [Content templates](https://github.com/evhye38496-svg/PerfScope/blob/main/docs/CONTENT_TEMPLATES.md)

## Features

- Manual PerfScope full scan
- Quick extension audit
- Activity Bar entry with a compact Side Bar dashboard
- Launcher-style full Dashboard and Side Bar UI
- Status Bar states for scan, audit, fix, undo, export, score, and error
- Gentle completion and error notifications
- Markdown report export through an explicit Save Dialog
- Git repository warning before Workspace or Workspace Folder settings writes
- Workspace safe fixes for watcher/search exclusions and `search.followSymlinks`
- Multi-root safe fixes using Workspace Folder scope
- Workspace Change Log rollback for PerfScope-written settings
- Safe purge for PerfScope-owned saved state

## Screenshots

### PerfScope Score Dashboard

Run a full scan to review your VS Code performance health score, extension inventory, activation signals, workspace configuration hints, and environment stats.

![PerfScope Score Dashboard](https://raw.githubusercontent.com/evhye38496-svg/PerfScope/main/docs/assets/turbo-score-dashboard.png)

### Quick Extension Audit

Use Quick Audit when you want an extension-focused review without workspace configuration and environment checks.

![Quick Extension Audit](https://raw.githubusercontent.com/evhye38496-svg/PerfScope/main/docs/assets/quick-extension-audit.png)

### Markdown Report Export

Export the latest scan as a Markdown report for team review, issue reports, or performance cleanup notes.

![Markdown Report Export](https://raw.githubusercontent.com/evhye38496-svg/PerfScope/main/docs/assets/markdown-report-export.png)

## Safety Boundaries

PerfScope is offline. It does not fetch remote databases, upload telemetry, read source file contents, disable extensions, uninstall extensions, or modify `.vscode/extensions.json`.

The only settings V1.0 can write are project-scoped settings, and only after explicit user confirmation:

- `files.watcherExclude`
- `search.exclude`
- `search.followSymlinks`

Single-root workspaces use Workspace scope. Multi-root workspaces use Workspace Folder scope for each selected folder. PerfScope does not write User settings.

If a target folder appears to be inside a Git repository, PerfScope warns before applying safe fixes because `.vscode/settings.json` may be committed.

## Purge Behavior

`PerfScope: Purge & Prepare for Uninstall` clears only PerfScope-owned saved state and recent UI report data. It does not modify settings, uninstall extensions, delete files, or change `.vscode/extensions.json`.

## Install the VSIX

After packaging, install the generated VSIX from VS Code:

1. Open the Command Palette.
2. Run `Extensions: Install from VSIX...`.
3. Select `dist/perfscope-1.0.0.vsix`.

You can also install from a terminal:

```powershell
code --install-extension dist/perfscope-1.0.0.vsix
```

## Development

Install dependencies once:

```powershell
npm install
```

Run checks:

```powershell
npm run compile
npm test
npm run test:vscode
```

Use the **Run Extension** launch configuration in VS Code to open an Extension Development Host. In that host window, the left Activity Bar shows the **PerfScope** entry with a compact launcher-style Dashboard view.

## Package a VSIX

```powershell
npm run package:vsix
```

This writes:

```text
dist/perfscope-1.0.0.vsix
```

## Release Checklist

- Run `npm run compile`.
- Run `npm test`.
- Run `npm run test:vscode`.
- Run `npm run verify:release`.
- Run `npm run package:vsix`.
- Install the VSIX into a clean VS Code profile.
- Confirm the Activity Bar entry appears.
- Run Full Scan and Quick Audit.
- Open the full Dashboard.
- Export a Markdown report.
- Verify Apply Safe Fixes shows a preview and Git warning where applicable.
- Verify Undo Last Fix is safe when no Change Log exists.
- Verify Purge clears only PerfScope-owned state.

## Known Limits

- V1.0 does not include Extended DB or remote database updates.
- V1.0 does not provide User-level settings writes.
- V1.0 does not perform background automatic scans.
- V1.0 does not programmatically disable, uninstall, or deactivate extensions.
- Core DB guidance is an offline seed dataset and should be expanded after 1.0.
