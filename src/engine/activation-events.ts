export function normalizeActivationEvents(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((event): event is string => typeof event === 'string');
}

export function hasAlwaysOnActivation(events: readonly string[]): boolean {
  return events.includes('*');
}

export function hasStartupFinishedActivation(events: readonly string[]): boolean {
  return events.includes('onStartupFinished');
}
