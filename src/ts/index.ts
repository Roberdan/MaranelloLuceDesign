/**
 * Maranello Luce Design - Main ES module entry point
 * Re-exports the public API surface for library consumers.
 */

export const VERSION = '2.0.0';

// Core types (all shared interfaces)
export * from './core/types';

// Event system
export { EventBus, eventBus } from './core/events';
export type { EventCallback } from './core/events';

// Utilities
export {
  cssVar,
  getTheme,
  setTheme,
  cycleTheme,
  getAccent,
  debounce,
  throttle,
  createElement,
  formatNumber,
  formatDate,
  clamp,
  lerp,
  hiDpiCanvas,
} from './core/utils';

// Design tokens
export {
  COLOR,
  FONT,
  TEXT_SIZE,
  SPACE,
  DURATION,
  EASE,
  RADIUS,
  SHADOW,
  SCOPE_COLOR,
  Z_INDEX,
} from './core/tokens';
export type { TokenName } from './core/tokens';

// Icons
export { icons, renderIcon, iconCatalog } from './icons';
export { navIcons } from './icons-nav';
export { statusIcons } from './icons-status';
export { actionIcons } from './icons-actions';
export { dataIcons } from './icons-data';
export { objectIcons } from './icons-objects';

// Theme toggle
export { initThemeToggle } from './theme-toggle';
export type { ThemeGaugeInstance, ThemeToggleController } from './theme-toggle';

// Toast notifications
export { toast } from './toast';

// Modal dialogs
export { openModal, closeModal } from './modal';

// Command palette
export { commandPalette } from './command-palette';

// Login screen
export { loginScreen } from './login';
export type {
  LoginScreenOptions,
  LoginScreenController,
  LoginHealthData,
  LoginServiceCheck,
} from './login';

// AI Chat
export { buildUI, ICON_SPARK, getIcon, renderContent, formatTime } from './ai-chat-dom';
export type { AIChatOptions, AIChatMessage, AIChatAgent, AIChatResponse, AIChatController } from './ai-chat-dom';
export { initMessages } from './ai-chat-messages';

// System status
export { systemStatus } from './system-status';

// Profile menu
export { profileMenu } from './profile-menu';
export type { ProfileMenuUser, ProfileMenuOptions, ProfileMenuController } from './profile-menu';

// Charts (all chart types + helpers)
export * from './charts';

// Chart interaction (tooltips, crosshair, hover)
export { chartInteract, sparklineInteract } from './chart-interact';

// Gauge engine
export { FerrariGauge } from './gauge-engine';
export { buildGaugePalette } from './gauge-engine-palette';
export type { GaugeRenderPalette } from './gauge-engine-palette';
export type { GaugeDrawState } from './gauge-engine-draw';

// Speedometer
export { speedometer } from './speedometer';

// Gantt chart
export { gantt } from './gantt';

// Map view
export { mapView } from './map-view';

// Controls (panels, drawers, org tree)
export {
  openDetailPanel, closeDetailPanel,
  openDrawer, closeDrawer,
  initOrgTree, toggleNotifications, initDrillDown,
} from './controls';

// Ferrari controls (cruise lever, toggle lever, manettino, rotary)
export { cruiseLever, toggleLever } from './controls-ferrari';
export { manettino, steppedRotary } from './controls-ferrari-dials';

// Data binding
export {
  emit, on, updateGauge, bindChart,
  autoBindSliders, bindControl, bind, autoBind, onDrillDown,
} from './data-binding';

// Data table
export { dataTable } from './data-table';

// Date picker
export { datePicker } from './date-picker';

// Flip counter
export { flipCounter } from './flip-counter';

// Forms
export { initForms, forms } from './forms';
export {
  validateField, validateForm, initLiveValidation,
  addValidator, getFieldInput, validators, defaultMessages,
} from './forms-validate';
export type { FormInputElement, FormValidator, FormValidators, FormMessages } from './forms-validate';
export {
  initAutoResize, initTagInput, initPasswordToggle,
  initFileUpload, initFormSteps, initInlineEdit,
  initCharCounter, initSearchClear,
} from './forms-widgets';
export type { TagInputApi, FileUploadApi, FormStepsApi } from './forms-widgets';

// Progress ring
export { progressRing } from './progress-ring';

// Funnel / Sankey
export { funnel } from './funnel';
export { hexLum, autoTextColor, resolveContainer } from './funnel-helpers';

// Horizontal bar chart
export { hBarChart } from './charts-hbar';

// OKR panel
export { okrPanel } from './okr-panel';
export type { OkrPanelOptions, OkrPanelController } from './okr-panel';

// Maranello facade (auto-init)
export { Maranello } from './maranello';
