# One-Click Turbo

One-Click Turbo is a VS Code performance health scanner and optimization guide.

V0.1 provides a safe, offline skeleton:

- Manual Turbo scan command
- Dashboard webview shell
- Status bar score display
- Read-only extension/configuration checks
- Core DB seed data

It does not modify settings, disable extensions, read source files, upload data, or fetch remote databases.

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

Use the **Run Extension** launch configuration in VS Code to open an Extension Development Host.
