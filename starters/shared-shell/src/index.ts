export type {
  SharedShellAction,
  SharedShellConfig,
  SharedShellContentConfig,
  SharedShellController,
  SharedShellDetailPanelConfig,
  SharedShellHeaderConfig,
  SharedShellNavItem,
  SharedShellNavSection,
  SharedShellState,
} from './contracts';
export type {
  AgentAction,
  AIAdapter,
  APIAdapter,
  APIEndpoint,
  AuthAdapter,
  AuthSession,
  FeatureFlagAdapter,
  Permission,
  RBACAdapter,
  SharedShellAdapters,
  TelemetryAdapter,
  TelemetryEvent,
} from './adapters';
export { hasPermission } from './adapters';
export type {
  AIActionSurface,
  AICommandPalette,
  AICommandSurfaces,
  AIPanel,
  AISuggestion,
} from './ai-surfaces';
export { createDefaultAISurfaces } from './ai-surfaces';
export type { DeployAssets, DeployTarget, EnvVar } from './deploy';
export { generateDeployAssets, listDeployTargets } from './deploy';
export { createSharedShellFiles } from './next-template';
export { renderSharedShell } from './runtime';
