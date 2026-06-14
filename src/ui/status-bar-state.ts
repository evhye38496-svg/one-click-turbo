export type PerfScopeStatusKind = 'idle' | 'scanning' | 'auditing' | 'fixing' | 'undoing' | 'exporting' | 'score' | 'error';

export interface PerfScopeStatusSnapshot {
  kind: PerfScopeStatusKind;
  score?: number;
  grade?: string;
  lastScanAt?: string;
  message?: string;
}

export interface PerfScopeStatusPresentation {
  text: string;
  tooltip: string;
}

export function createStatusPresentation(snapshot: PerfScopeStatusSnapshot): PerfScopeStatusPresentation {
  switch (snapshot.kind) {
    case 'scanning':
      return {
        text: '$(sync~spin) PerfScope',
        tooltip: 'PerfScope: full scan is running'
      };
    case 'auditing':
      return {
        text: '$(sync~spin) Audit',
        tooltip: 'PerfScope: extension audit is running'
      };
    case 'fixing':
      return {
        text: '$(sync~spin) Fix',
        tooltip: 'PerfScope: workspace safe fixes are being applied'
      };
    case 'undoing':
      return {
        text: '$(sync~spin) Undo',
        tooltip: 'PerfScope: last workspace fix is being undone'
      };
    case 'exporting':
      return {
        text: '$(sync~spin) Export',
        tooltip: 'PerfScope: Markdown report is being exported'
      };
    case 'score':
      return {
        text: `$(zap) ${snapshot.score ?? 'PerfScope'}`,
        tooltip: `PerfScope Score: ${snapshot.score ?? 'unknown'} (${snapshot.grade ?? 'unknown'})${snapshot.lastScanAt ? `; scanned ${snapshot.lastScanAt}` : ''}`
      };
    case 'error':
      return {
        text: '$(warning) PerfScope',
        tooltip: `PerfScope needs attention${snapshot.message ? `: ${snapshot.message}` : ''}`
      };
    case 'idle':
    default:
      return {
        text: '$(zap) PerfScope',
        tooltip: 'PerfScope: no scan has run yet'
      };
  }
}
