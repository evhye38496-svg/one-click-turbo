export type IssueSeverity = 'critical' | 'warning' | 'info';

export type FixKind = 'safe-auto-fix' | 'manual-guided-fix' | 'suggestion-only';

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  fixKind: FixKind;
  source: 'extension' | 'configuration' | 'environment' | 'knowledge-base';
}

export interface ScoreBreakdown {
  startup: number;
  configuration: number;
  extensionInventory: number;
  environment: number;
}

export interface ScanStats {
  totalExtensions: number;
  activeExtensions: number;
  alwaysOnExtensions: number;
  startupFinishedExtensions: number;
  knownHeavyExtensions: number;
  extensionHostHeapMB: number;
  extensionHostRssMB: number;
  osFreeMemoryMB: number;
}

export interface ScanResult {
  score: number;
  grade: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  generatedAt: string;
  stats: ScanStats;
  breakdown: ScoreBreakdown;
  issues: Issue[];
}

export interface ExtensionSnapshot {
  id: string;
  displayName: string;
  isActive: boolean;
  activationEvents: string[];
}

export interface ConfigSnapshot {
  watcherExclude: Record<string, unknown> | undefined;
  searchExclude: Record<string, unknown> | undefined;
  searchFollowSymlinks: boolean | undefined;
  editorMinimapEnabled: boolean | undefined;
}

export interface KnownExtensionRecord {
  id: string;
  safeWording: string;
  confidence: 'low' | 'medium' | 'high';
  lastVerified: string;
  severity: IssueSeverity;
}
