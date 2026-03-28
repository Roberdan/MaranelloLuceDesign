/**
 * Maranello Luce Design - Misc component type definitions
 * Extracted from: ai-chat, system-status, login, profile-menu,
 *   map-view, funnel, icons, a11y-panel, forms, observers, theme-toggle
 */

// --- AI Chat ---

export type ChatRole = 'user' | 'ai';

export interface AIChatMessage {
  role: ChatRole;
  content: string;
  time?: string;
}

export interface AIChatAgent {
  id: string;
  name: string;
  avatar?: string;
}

export interface AIChatOptions {
  onSend?: (message: string) => void;
  onQuickAction?: (action: string) => void;
  quickActions?: string[];
  placeholder?: string;
  title?: string;
  welcomeMessage?: string;
  avatar?: string;
  agents?: AIChatAgent[];
  activeAgent?: string;
  onAgentChange?: (agentId: string) => void;
  onVoice?: () => void;
}

export interface AIChatController {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  addMessage: (msg: AIChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clear: () => void;
  showPulse: () => void;
  destroy: () => void;
}

// --- System Status ---

export interface SystemStatusService {
  name: string;
  check?: () => Promise<SystemStatusCheckResult>;
}

export interface SystemStatusCheckResult {
  ok?: boolean;
  ms?: number;
}

export interface SystemStatusRenderedResult {
  name: string;
  ok: boolean;
  ms: number;
}

export interface SystemStatusOptions {
  version?: string;
  environment?: string;
  services?: SystemStatusService[];
  pollInterval?: number;
  onClick?: (service: SystemStatusService, result: SystemStatusRenderedResult) => void;
}

export interface SystemStatusController {
  refresh: () => Promise<void>;
  destroy: () => void;
}

// --- Login ---

export interface LoginServiceCheck {
  name: string;
  status: string;
  latency_ms: number;
}

export interface LoginScreenOptions {
  subtitle?: string;
  version?: string;
  env?: string;
  error?: string;
  checks?: LoginServiceCheck[];
  onLogin?: (username: string, password: string) => void;
  healthUrl?: string;
  autoHealth?: boolean;
  pollInterval?: number;
}

// --- Profile Menu ---

export interface ProfileMenuUser {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ProfileMenuItem {
  label?: string;
  icon?: string;
  action?: () => void;
  badge?: string | number;
  variant?: string;
}

export interface ProfileMenuSection {
  title?: string;
  divider?: boolean;
  type?: string;
  items?: ProfileMenuItem[];
}

// --- Map View ---

export interface MapMarker {
  id: string | number;
  lat: number;
  lon: number;
  label: string;
  detail?: string;
  size?: number;
  color?: string;
  count?: number;
}

export interface MapViewOptions {
  markers?: MapMarker[];
  onClick?: (marker: MapMarker) => void;
  showLegend?: boolean;
  padding?: number;
  clusterRadius?: number;
  minClusterSize?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  initialZoom?: number;
  initialCenter?: { lat: number; lon: number };
}

export interface MapViewController {
  setMarkers: (markers: MapMarker[]) => void;
  addMarker: (marker: MapMarker) => void;
  removeMarker: (id: string | number) => void;
  highlight: (id: string | number) => void;
  setZoom: (zoom: number) => void;
  panTo: (lat: number, lon: number) => void;
  fitBounds: () => void;
  destroy: () => void;
}

export interface ThemePalette {
  land: string;
  water: string;
  border: string;
  grid: string;
  text: string;
  muted: string;
}

// --- Funnel / Sankey ---

export interface PipelineStage {
  label: string;
  count: number;
  color: string;
  holdCount?: number;
  withdrawnCount?: number;
}

export interface BranchInfo {
  label: string;
  count: number;
  color: string;
  icon?: string;
}

export interface SankeyData {
  pipeline: PipelineStage[];
  onHold?: BranchInfo;
  withdrawn?: BranchInfo;
  total?: number;
}

export interface SankeyOptions {
  animate?: boolean;
  showLabels?: boolean;
  showCounts?: boolean;
  onClick?: (stage: PipelineStage) => void;
}

export interface SankeyController {
  update: (data: SankeyData) => void;
  destroy: () => void;
}

// --- Icons ---

export interface IconCatalog {
  [iconName: string]: () => string;
}

export interface RenderIconOptions {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  /** When set, marks the icon as meaningful with this label instead of decorative. */
  ariaLabel?: string;
}

// --- Accessibility Panel ---

export interface A11ySettings {
  fontSize: string;
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  lineSpacing: string;
  dyslexiaFont: boolean;
}

export interface A11yPanelController {
  getSettings: () => A11ySettings;
  reset: () => void;
  destroy: () => void;
}

// --- Theme ---

export type ThemeMode = 'editorial' | 'nero' | 'avorio' | 'colorblind' | 'sugar';
