export interface FeatureFlagSet {
  agentPanel: boolean;
  telemetryBoard: boolean;
  executiveStrip: boolean;
}

export const defaultFeatureFlags: FeatureFlagSet = {
  agentPanel: true,
  telemetryBoard: true,
  executiveStrip: true,
};
