# Contributing to One-Click Turbo

Thanks for considering a contribution. One-Click Turbo is intentionally conservative: it is offline, preview-first, and avoids modifying user or extension state without explicit confirmation.

## Local Setup

```powershell
npm install
npm run compile
npm test
npm run test:vscode
```

To run the extension manually, open this repository in VS Code and press `F5` to start an Extension Development Host.

## Safety Rules

- Do not add telemetry, network calls, CDN loading, or background auto-scans.
- Do not disable, uninstall, or mutate other extensions.
- Do not write User settings.
- Workspace settings writes must stay preview-first and undoable.
- Webviews must keep nonce-based CSP and escape third-party manifest strings.

## Pull Request Checklist

- Explain the user-visible behavior change.
- Keep changes scoped to the issue.
- Add or update tests for behavior changes.
- Run `npm run compile`.
- Run `npm test`.
- Run `npm run test:vscode` when commands, VS Code APIs, or webviews are affected.
- Update `README.md` or `CHANGELOG.md` when the change affects users.

## Good First Issues

Good first issues should have:

- A short problem statement.
- Clear files or areas to inspect.
- Acceptance criteria.
- Test commands.

Suggested starter tasks:

- Improve Marketplace screenshots and README placement.
- Add more safe wording to the offline Core DB.
- Improve Markdown report examples.
- Add docs for multi-root workspace behavior.
- Improve issue labels and templates.
