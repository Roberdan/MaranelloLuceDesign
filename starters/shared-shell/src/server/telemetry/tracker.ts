export interface TelemetryEvent {
  name: string;
  area: string;
  metadata?: Record<string, string | number | boolean>;
}

export function createTelemetryEvent(event: TelemetryEvent): TelemetryEvent {
  return {
    name: event.name,
    area: event.area,
    metadata: { ...(event.metadata || {}) },
  };
}
