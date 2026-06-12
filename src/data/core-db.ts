import type { KnownExtensionRecord } from '../types';

export const knownHeavyExtensions: KnownExtensionRecord[] = [
  {
    id: 'eamodio.gitlens',
    safeWording: 'GitLens CodeLens, blame, and history features may add Git query and rendering overhead in large repositories.',
    confidence: 'medium',
    lastVerified: '2026-06-12',
    severity: 'warning'
  },
  {
    id: 'dbaeumer.vscode-eslint',
    safeWording: 'ESLint can add save and diagnostics latency when type-aware rules are enabled in large JavaScript or TypeScript projects.',
    confidence: 'medium',
    lastVerified: '2026-06-12',
    severity: 'warning'
  },
  {
    id: 'ms-vscode.cpptools',
    safeWording: 'C/C++ IntelliSense can use significant memory while indexing large codebases.',
    confidence: 'medium',
    lastVerified: '2026-06-12',
    severity: 'warning'
  },
  {
    id: 'ms-python.vscode-pylance',
    safeWording: 'Pylance type analysis may increase memory use in large Python workspaces.',
    confidence: 'medium',
    lastVerified: '2026-06-12',
    severity: 'info'
  }
];
