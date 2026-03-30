/** @convergio/design-elements - Headless UI components barrel. */

export const VERSION = '6.5.0';

// Core types (all shared interfaces)
export * from './core/types';

// Event system
export { EventBus, eventBus } from './core/events';
export type { EventCallback } from './core/events';

// Presentation runtime (v4.17.0)
export * from './index-runtime';

// Utilities
export {
  cssVar, palette, getTheme, setTheme, cycleTheme, getAccent,
  debounce, throttle, createElement, formatNumber, formatDate,
  clamp, lerp, hiDpiCanvas,
} from './core/utils';

// Network / neural visuals
export { networkMessages } from './network-messages';
export { neuralNodes } from './neural-nodes';
export type {
  NeuralNodeData, NeuralConnection, NeuralNodesOptions,
  NeuralNodesController,
} from './neural-nodes';

// Design tokens
export {
  COLOR, FONT, TEXT_SIZE, SPACE, DURATION, EASE,
  RADIUS, SHADOW, SCOPE_COLOR, Z_INDEX,
} from './core/tokens';
export type { TokenName } from './core/tokens';

// Icons
export { icons, renderIcon, iconCatalog } from './icons';
export { navIcons } from './icons-nav';
export { statusIcons } from './icons-status';
export { actionIcons } from './icons-actions';
export { dataIcons } from './icons-data';
export { objectIcons } from './icons-objects';
export { azIcons } from './icons-az';
export type { AzIconName } from './icons-az';

// Theme toggle
export { initThemeToggle } from './theme-toggle';
export type { ThemeGaugeInstance, ThemeToggleController } from './theme-toggle';

// Theme rotary
export { themeRotary } from './theme-rotary';
export type { ThemeRotaryOptions, ThemeRotaryController } from './theme-rotary';

// Theme picker
export { themePicker } from './theme-picker';
export type { ThemePickerOptions, ThemePickerController } from './theme-picker';

// Toast + Modal + Command palette
export { toast } from './toast';
export { openModal, closeModal } from './modal';
export { commandPalette } from './command-palette';

// AI Chat
export { buildUI, ICON_SPARK, getIcon, renderContent, formatTime } from './ai-chat-dom';
export type {
  AIChatOptions, AIChatMessage, AIChatAgent, AIChatResponse, AIChatController,
} from './ai-chat-dom';
export { aiChat } from './ai-chat-iife';
export { initMessages } from './ai-chat-messages';

// Kanban board
export { kanbanBoard } from './kanban-board';
export type {
  KanbanOptions, KanbanController, KanbanColumn, KanbanCard,
} from './kanban-board';

// Voice input
export { voiceManager, createRealtimeAdapter } from './voice-input';
export type {
  VoiceAdapter, VoiceState, VoiceManagerController,
  VoiceManagerOptions, VoiceStartConfig, VoiceEvents,
} from './voice-input';
export type { RealtimeAdapterOptions } from './voice-input-realtime';

// System status
export { systemStatus } from './system-status';

// Profile menu
export { profileMenu } from './profile-menu';
export type {
  ProfileMenuUser, ProfileMenuOptions, ProfileMenuController,
} from './profile-menu';

// Header (3-zone navbar)
export { header } from './header';
export type {
  HeaderOptions, HeaderController, HeaderBrand,
  HeaderButton, HeaderSearch, HeaderProfile,
} from './header';
export { headerShell } from './header-shell';
export type {
  HeaderShellOptions, HeaderShellController, HeaderShellSection,
  HeaderShellAction, HeaderShellFilterGroup, HeaderShellState,
} from './header-shell';

// Filter panel
export { filterPanel } from './filter-panel';
export type {
  FilterPanelOptions, FilterPanelColumn, FilterPanelItem,
  FilterPanelController,
} from './filter-panel';

// Locale (i18n)
export { setLocale, getLocale, resetLocale } from './locale';
export type { MnLocale } from './locale';

// Charts (all chart types + helpers)
export * from './charts';

// Chart interaction (tooltips, crosshair, hover)
export { chartInteract, sparklineInteract } from './chart-interact';

// Auto-resize for responsive charts
export { autoResize, autoResizeAll } from './auto-resize';

// Gauge engine + speedometer
export { FerrariGauge } from './gauge-engine';
export { buildGaugePalette } from './gauge-engine-palette';
export { createGauge, createGaugesInContainer, redrawAll, reinitAll, GAUGE_SIZES } from './gauge-engine-class';
export { speedometer } from './speedometer';
export { drawSpeedometer } from './speedometer-draw';
export type { GaugeRenderPalette } from './gauge-engine-palette';
export type { GaugeDrawState } from './gauge-engine-draw';
export type { GaugeFactoryOptions, GaugeEntry } from './gauge-engine-class';
export * from './speedometer-palette';

// Gantt + Map + Social
export { gantt } from './gantt';
export { mapView } from './map-view';
export { mapboxView } from './map-mapbox';
export { socialGraph } from './social-graph';
export type { MapboxMarker, MapboxViewOptions, MapboxViewController } from './map-mapbox';

// Controls (panels, drawers, org tree)
export {
  openDetailPanel, closeDetailPanel, openDrawer, closeDrawer,
  initOrgTree, toggleNotifications, initDrillDown,
} from './controls';

// Sidebar toggle (mobile)
export { initSidebarToggle, initSidebarToggleAuto } from './sidebar-toggle';

// Ferrari controls
export { cruiseLever, toggleLever } from './controls-ferrari';
export { manettino, steppedRotary } from './controls-ferrari-dials';

// Data binding
export { emit, on, bind, autoBind, onDrillDown } from './data-binding';
export { autoBindSliders, bindControl, updateGauge, bindChart } from './data-binding-ui';
export { off } from './data-binding-events';
export type { DrillDownContext, DrillDownHandler, ElementBindOptions } from './data-binding-events';

// Data table + date picker + flip counter
export { dataTable } from './data-table';
export { datePicker } from './date-picker';
export { flipCounter } from './flip-counter';

// Forms
export { initForms, forms } from './forms';
export {
  validateField, validateForm, initLiveValidation, addValidator,
  getFieldInput, validators, defaultMessages,
} from './forms-validate';
export type {
  FormInputElement, FormValidator, FormValidators, FormMessages,
} from './forms-validate';
export {
  initAutoResize, initTagInput, initPasswordToggle, initFileUpload,
  initFormSteps, initInlineEdit, initCharCounter, initSearchClear,
} from './forms-widgets';
export type { TagInputApi, FileUploadApi, FormStepsApi } from './forms-widgets';
export { initTagsField } from './forms-tags-field';
export type { TagsFieldOptions, TagsFieldApi } from './forms-tags-field';
export { initPersonField } from './forms-person-field';
export type {
  PersonResult, PersonFieldOptions, PersonFieldApi,
} from './forms-person-field';

// Progress ring
export { progressRing } from './progress-ring';

// Funnel / Sankey
export { funnel } from './funnel';
export { hexLum, autoTextColor, resolveContainer } from './funnel-helpers';

// Horizontal bar chart draw primitives
export * from './h-bar-chart-draw';
export { hBarChart } from './charts-hbar';

// OKR panel
export { okrPanel } from './okr-panel';
export type { OkrPanelOptions, OkrPanelController } from './okr-panel';

// Observers
export {
  initGauges, initScrollReveal, initNavTracking,
  relativeLuminance, autoContrast,
} from './observers';
export type {
  GaugeInitOptions, ScrollRevealOptions, NavTrackingOptions,
  ContrastResult,
} from './observers';

// Detail panel + A11y
export { createDetailPanel } from './detail-panel';
export { registerDatePicker, editors } from './detail-panel-editors';
export { updateStatusSelectColor, renderPersonResults, renderers, getInitials, formatDateSimple } from './detail-panel-renderers';
export * from './detail-panel-ui';
export { a11yPanel } from './a11y-panel';
export * from './a11y-panel-dom';

// Controls extras (dialogs + drag) + map internals
export { initDropdown, initTabs } from './controls-dialogs';
export type { DropdownController, TabsController } from './controls-dialogs';
export { initRotary, initSlider } from './controls-drag';
export { attachEvents } from './map-view-events';
export type { TipElements, MapEventState, MapEventCallbacks, EventCleanup } from './map-view-events';
export * from './map-view-helpers';

// Grid layout
export { gridLayout } from './grid-layout';
export type {
  GridTemplateName, GridLayoutOptions, GridLayoutController,
} from './grid-layout';

// Layout state machine
export { createLayout } from './layout';
export type { LayoutController, LayoutViewConfig, LayoutState } from './layout';

// v4.5-v4.9 components
export * from './index-extras';

// Semantic registry (agent-driven composition)
export { queryByWorkflow, queryByIntent, listWorkflows, getStarterForWorkflow } from './semantic-registry';
export type { WorkflowEntry, ComponentRef, StarterRef, SemanticQuery, SemanticResult } from './semantic-registry';

// Maranello facade (auto-init)

