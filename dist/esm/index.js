/* Maranello Luce Design v3.0.0 | MIT | github.com/Roberdan/MaranelloLuceDesign */
import {
  SERIES,
  areaChart,
  barChart,
  bubble,
  buildSeries,
  chartHiDpi,
  chartInteract,
  donut,
  flipCounter,
  getCanvasSize,
  hBarChart,
  halfGauge,
  liveGraph,
  progressRing,
  radar,
  sparkline,
  sparklineInteract
} from "./chunks/chunk-GGDXFXC4.js";
import {
  FerrariGauge,
  buildGaugePalette,
  speedometer
} from "./chunks/chunk-KFMFGHHF.js";
import {
  gantt
} from "./chunks/chunk-4A2PGFMH.js";
import {
  closeDetailPanel,
  closeDrawer,
  cruiseLever,
  initDrillDown,
  initOrgTree,
  manettino,
  openDetailPanel,
  openDrawer,
  steppedRotary,
  toggleLever,
  toggleNotifications
} from "./chunks/chunk-AYY2TTQH.js";
import {
  clamp,
  createElement,
  cssVar,
  cycleTheme,
  debounce,
  formatDate,
  formatNumber,
  getAccent,
  getTheme,
  hiDpiCanvas,
  lerp,
  setTheme,
  throttle
} from "./chunks/chunk-4CM7AZ7E.js";
import {
  addValidator,
  defaultMessages,
  forms,
  getFieldInput,
  initAutoResize,
  initCharCounter,
  initFileUpload,
  initFormSteps,
  initForms,
  initInlineEdit,
  initLiveValidation,
  initPasswordToggle,
  initSearchClear,
  initTagInput,
  validateField,
  validateForm,
  validators
} from "./chunks/chunk-MPTZIPPR.js";
import {
  EventBus,
  eventBus
} from "./chunks/chunk-RR55JKRT.js";

// src/ts/core/tokens.ts
var COLOR = {
  ROSSO_CORSA: "--rosso-corsa",
  GIALLO_FERRARI: "--giallo-ferrari",
  VERDE_BANDIERA: "--verde-bandiera",
  NERO_ASSOLUTO: "--nero-assoluto",
  NERO_SOFT: "--nero-soft",
  BIANCO_PURO: "--bianco-puro",
  BIANCO_CALDO: "--bianco-caldo",
  GRIGIO_CHIARO: "--grigio-chiaro",
  GRIGIO_MEDIO: "--grigio-medio",
  GRIGIO_SCURO: "--grigio-scuro",
  SIGNAL_DANGER: "--signal-danger",
  SIGNAL_WARNING: "--signal-warning",
  SIGNAL_SUCCESS: "--signal-success",
  SIGNAL_INFO: "--signal-info",
  CHART_DEFAULT: "--chart-default"
};
var FONT = {
  BODY: "--font-body",
  MONO: "--font-mono",
  DISPLAY: "--font-display"
};
var TEXT_SIZE = {
  NANO: "--text-nano",
  MICRO: "--text-micro",
  SMALL: "--text-small",
  BASE: "--text-base",
  LARGE: "--text-large",
  XL: "--text-xl",
  XXL: "--text-xxl"
};
var SPACE = {
  XXS: "--space-xxs",
  XS: "--space-xs",
  SM: "--space-sm",
  MD: "--space-md",
  LG: "--space-lg",
  XL: "--space-xl",
  XXL: "--space-xxl"
};
var DURATION = {
  FAST: "--duration-fast",
  SM: "--duration-sm",
  MD: "--duration-md",
  LG: "--duration-lg"
};
var EASE = {
  IN: "--ease-in",
  OUT: "--ease-out",
  IN_OUT: "--ease-in-out"
};
var RADIUS = {
  SM: "--radius-sm",
  MD: "--radius-md",
  LG: "--radius-lg",
  FULL: "--radius-full"
};
var SHADOW = {
  SM: "--shadow-sm",
  MD: "--shadow-md",
  LG: "--shadow-lg"
};
var SCOPE_COLOR = {
  LOCAL: "--scope-local",
  TEAM: "--scope-team",
  GLOBAL: "--scope-global"
};
var Z_INDEX = {
  DROPDOWN: "--z-dropdown",
  MODAL: "--z-modal",
  TOAST: "--z-toast",
  TOOLTIP: "--z-tooltip"
};

// src/ts/icons-nav.ts
var navIcons = {
  dashboard: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  home: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
  menu: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  chevronRight: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevronDown: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronLeft: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronUp: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  arrowUp: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  arrowDown: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  arrowLeft: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  arrowRight: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  externalLink: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  sidebar: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
  panelRight: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  columns: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  maximize: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  minimize: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  expand: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  collapse: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
};

// src/ts/icons-status.ts
var statusIcons = {
  checkCircle: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertTriangle: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  alertCircle: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  info: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  atRisk: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>',
  completed: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>',
  blocked: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
  loader: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>',
  shield: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  shieldCheck: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'
};

// src/ts/icons-actions.ts
var actionIcons = {
  refresh: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
  settings: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  close: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  edit: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  copy: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  trash: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  download: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  plus: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  filter: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  sort: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  search: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  sliders: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
  eye: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
};

// src/ts/icons-data.ts
var dataIcons = {
  gauge: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/><path d="M12 12l4-8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  trendUp: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  trendDown: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  barChart: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  toggleOn: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="4" fill="currentColor"/></svg>',
  toggleOff: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="4"/></svg>',
  kpi: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="2" r="1" fill="currentColor"/></svg>',
  impact: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  pipeline: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/><path d="M8 6h1l3 3"/><path d="M15 12h1l3 3"/></svg>',
  orgChart: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="9" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="5" y1="14" x2="5" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="19" y1="14" x2="19" y2="18"/></svg>',
  treeView: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="18" x2="10" y2="18"/><rect x="10" y="3" width="10" height="6" rx="1"/><rect x="10" y="9" width="10" height="6" rx="1"/><rect x="10" y="15" width="10" height="6" rx="1"/></svg>'
};

// src/ts/icons-objects.ts
var objectIcons = {
  user: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  users: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  userGroup: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  briefcase: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
  admin: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  key: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  lock: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  unlock: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
  bell: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  bellDot: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="18" cy="4" r="3" fill="currentColor" stroke="none"/></svg>',
  mail: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>',
  message: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  calendar: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  link: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  tag: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  star: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  file: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
  folder: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  image: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  clock: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  globe: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  compass: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.15" stroke="currentColor"/></svg>',
  bolt: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  zap: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  command: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>',
  terminal: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  // Generic domain icons (renamed from ISE-specific)
  activity: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  qualityCheck: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  report: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>',
  capacity: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="15" r="1" fill="currentColor"/><rect x="12" y="12" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.3"/></svg>',
  agent: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 15c0 0 1.5 2 3 2s3-2 3-2"/></svg>',
  accelerator: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  deliverable: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  layers: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  experiment: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v7.4a2 2 0 01-.6 1.4L4 17.2a2 2 0 00-.6 1.4V20a1 1 0 001 1h15.2a1 1 0 001-1v-1.4a2 2 0 00-.6-1.4L14.6 11.8a2 2 0 01-.6-1.4V3"/><circle cx="10" cy="16" r="1" fill="currentColor"/><circle cx="14" cy="18" r="1" fill="currentColor"/></svg>',
  mic: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0014 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>'
};

// src/ts/icons.ts
var icons = {
  ...navIcons,
  ...statusIcons,
  ...actionIcons,
  ...dataIcons,
  ...objectIcons
};
function renderIcon(target, name, opts) {
  const el4 = typeof target === "string" ? document.querySelector(target) : target;
  if (!el4 || !icons[name]) return;
  const sizeClass = opts?.size ? ` mn-icon--${opts.size}` : "";
  const extraClass = opts?.class ? ` ${opts.class}` : "";
  const svg = icons[name]();
  const ariaAttr = opts?.ariaLabel ? `role="img" aria-label="${opts.ariaLabel}"` : 'aria-hidden="true"';
  const a11ySvg = svg.replace("<svg ", `<svg ${ariaAttr} `);
  el4.innerHTML = `<span class="mn-icon${sizeClass}${extraClass}">${a11ySvg}</span>`;
}
function iconCatalog() {
  return Object.keys(icons);
}

// src/ts/theme-toggle.ts
var ICONS = {
  editorial: "\u25D1",
  nero: "\u25CF",
  avorio: "\u25CB",
  colorblind: "\u25D0"
};
var LABELS = {
  editorial: "Editorial (mixed)",
  nero: "Full Nero",
  avorio: "Full Avorio",
  colorblind: "Colorblind-safe"
};
function initThemeToggle(toggleId, gaugeInstances = [], onAutoContrast) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) {
    return {
      getMode: () => getTheme(),
      setMode: (m) => setTheme(m),
      destroy: () => {
      }
    };
  }
  let current = getTheme();
  toggle.textContent = ICONS[current];
  toggle.title = LABELS[current];
  function applyTheme() {
    toggle.textContent = ICONS[current];
    toggle.title = LABELS[current];
    requestAnimationFrame(() => {
      gaugeInstances.forEach((g) => g.redraw());
      if (onAutoContrast) onAutoContrast(".mn-treemap__cell");
    });
  }
  const onClick = () => {
    current = cycleTheme();
    applyTheme();
  };
  toggle.addEventListener("click", onClick);
  return {
    getMode: () => current,
    setMode: (mode) => {
      current = mode;
      setTheme(mode);
      applyTheme();
    },
    destroy: () => {
      toggle.removeEventListener("click", onClick);
    }
  };
}

// src/ts/toast.ts
function toast(options) {
  const opts = {
    title: "",
    message: "",
    type: "info",
    duration: 4e3,
    container: "mn-toast-container",
    ...options
  };
  let container = document.getElementById(opts.container);
  if (!container) {
    container = document.createElement("div");
    container.id = opts.container;
    container.className = "mn-toast-container";
    document.body.appendChild(container);
  }
  const toastEl = document.createElement("div");
  toastEl.className = `mn-toast mn-toast--${opts.type}`;
  toastEl.setAttribute("role", "alert");
  const msgWrap = document.createElement("div");
  msgWrap.className = "mn-toast__message";
  if (opts.title) {
    const titleEl = document.createElement("div");
    titleEl.className = "mn-toast__title";
    titleEl.textContent = opts.title;
    msgWrap.appendChild(titleEl);
  }
  const textEl = document.createElement("div");
  textEl.className = "mn-toast__text";
  textEl.textContent = opts.message;
  msgWrap.appendChild(textEl);
  toastEl.appendChild(msgWrap);
  const closeBtn = document.createElement("button");
  closeBtn.className = "mn-toast__close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "\u2715";
  toastEl.appendChild(closeBtn);
  function dismiss() {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateX(100%)";
    setTimeout(() => toastEl.remove(), 300);
  }
  closeBtn.addEventListener("click", dismiss);
  container.appendChild(toastEl);
  if (opts.duration > 0) {
    setTimeout(() => {
      if (toastEl.parentNode) dismiss();
    }, opts.duration);
  }
  return toastEl;
}

// src/ts/modal.ts
function openModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  const modal = backdrop.querySelector(".mn-modal");
  if (!modal) return;
  backdrop.classList.add("mn-modal-backdrop--open");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (first) first.focus();
  function trapFocus(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === "Escape") {
      closeModal(id);
    }
  }
  modal._mnTrapFocus = trapFocus;
  document.addEventListener("keydown", trapFocus);
}
function closeModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  const modal = backdrop.querySelector(".mn-modal");
  backdrop.classList.remove("mn-modal-backdrop--open");
  if (modal?._mnTrapFocus) {
    document.removeEventListener("keydown", modal._mnTrapFocus);
    delete modal._mnTrapFocus;
  }
}

// src/ts/command-palette.ts
function commandPalette(id) {
  const palette = document.getElementById(id);
  if (!palette) return { open: () => {
  }, close: () => {
  } };
  const input = palette.querySelector(".mn-command-palette__input");
  const items = palette.querySelectorAll(".mn-command-palette__item");
  function open() {
    palette.classList.add("mn-command-palette--open");
    if (input) {
      input.value = "";
      input.focus();
    }
    filterItems("");
  }
  function close() {
    palette.classList.remove("mn-command-palette--open");
  }
  function filterItems(query) {
    const q = query.toLowerCase();
    items.forEach((item) => {
      const text = item.querySelector(".mn-command-palette__item-text");
      const match = !q || (text?.textContent?.toLowerCase().includes(q) ?? false);
      item.style.display = match ? "" : "none";
    });
  }
  if (input) {
    input.addEventListener("input", () => filterItems(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      palette.classList.contains("mn-command-palette--open") ? close() : open();
    }
  });
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const text = item.querySelector(".mn-command-palette__item-text");
      eventBus.emit("command-select", { text: text?.textContent ?? "" });
      close();
    });
  });
  return { open, close };
}

// src/ts/login-dom.ts
var STATUS_COLORS = {
  healthy: cssVar("--signal-ok", "#00A651"),
  degraded: cssVar("--signal-warning", "#FFC72C"),
  unhealthy: cssVar("--signal-danger", "#DC0000")
};
var STATUS_LABELS = {
  healthy: "ONLINE",
  degraded: "SLOW",
  unhealthy: "OFFLINE"
};
function arc(cx, cy, r, sa, ea) {
  const x1 = cx + Math.cos(sa) * r, y1 = cy + Math.sin(sa) * r;
  const x2 = cx + Math.cos(ea) * r, y2 = cy + Math.sin(ea) * r;
  const large = ea - sa > Math.PI ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
function miniGaugeSVG(status, latencyMs, label) {
  const color = STATUS_COLORS[status] ?? cssVar("--stage-completed", "#6B7280");
  const pct2 = status === "healthy" ? 95 : status === "degraded" ? 55 : 10;
  const sz = 56, cx = sz / 2, cy = sz - 4, r = 22;
  const startAngle = Math.PI, needleAngle = startAngle + clamp(pct2, 0, 100) / 100 * Math.PI;
  let ticks = "";
  for (let i = 0; i <= 6; i++) {
    const a = startAngle + i / 6 * Math.PI;
    const tx1 = cx + Math.cos(a) * (r - 4), ty1 = cy + Math.sin(a) * (r - 4);
    const tx2 = cx + Math.cos(a) * r, ty2 = cy + Math.sin(a) * r;
    ticks += `<line x1="${tx1.toFixed(1)}" y1="${ty1.toFixed(1)}" x2="${tx2.toFixed(1)}" y2="${ty2.toFixed(1)}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
  }
  const nx = cx + Math.cos(needleAngle) * (r - 8);
  const ny = cy + Math.sin(needleAngle) * (r - 8);
  const latencyText = latencyMs != null ? `${latencyMs}ms` : "";
  return `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-label="${label}"><path d="${arc(cx, cy, r, startAngle, 2 * Math.PI)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/><path d="${arc(cx, cy, r, startAngle, needleAngle)}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" style="filter:drop-shadow(0 0 4px ${color}60)"/>` + ticks + `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="1" fill="#111"/>` + (latencyText ? `<text x="${cx}" y="${cy - r - 6}" text-anchor="middle" fill="${color}" font-family="var(--font-mono)" font-size="7" font-weight="600">${latencyText}</text>` : "") + "</svg>";
}
function compassSVG(size) {
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#666"/><stop offset="100%" stop-color="#1a1a1a"/></linearGradient><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFD85C"/><stop offset="50%" stop-color="#FFC72C"/><stop offset="100%" stop-color="#E8A838"/></linearGradient><linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF4444"/><stop offset="100%" stop-color="#CC0000"/></linearGradient><filter id="lg2"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="32" cy="32" r="31" fill="url(#lb)" stroke="#555" stroke-width=".5"/><circle cx="32" cy="32" r="27" fill="#0d0d0d"/><g stroke="url(#lg)" stroke-width="1.5" stroke-linecap="round" filter="url(#lg2)"><line x1="32" y1="6" x2="32" y2="11"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(90,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(180,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(270,32,32)"/></g><g stroke="rgba(255,255,255,.4)" stroke-width="1" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="10" transform="rotate(45,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(135,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(225,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(315,32,32)"/></g><text x="32" y="16" text-anchor="middle" dominant-baseline="middle" fill="#FFC72C" font-family="'Barlow Condensed',sans-serif" font-weight="700" font-size="7" filter="url(#lg2)">N</text><polygon points="32,10 29,32 32,30 35,32" fill="url(#ln)" filter="url(#lg2)"/><polygon points="32,54 29,32 32,34 35,32" fill="#999"/><circle cx="32" cy="32" r="4" fill="url(#lg)" filter="url(#lg2)"/><circle cx="32" cy="32" r="2" fill="#1a1a1a"/></svg>`;
}
function createServiceCard(check) {
  const card = createElement("div", "mn-login__service");
  const gaugeWrap = createElement("div", "mn-login__service-gauge");
  gaugeWrap.innerHTML = miniGaugeSVG(check.status, check.latency_ms, check.name);
  const info = createElement("div", "mn-login__service-info");
  const name = createElement("div", "mn-login__service-name", { text: check.name.toUpperCase() });
  const statusEl = createElement("div", `mn-login__service-status mn-login__service-status--${check.status}`, {
    text: STATUS_LABELS[check.status] ?? check.status
  });
  info.appendChild(name);
  info.appendChild(statusEl);
  card.appendChild(gaugeWrap);
  card.appendChild(info);
  return card;
}

// src/ts/login.ts
function render(container, state, opts) {
  container.innerHTML = "";
  const root = createElement("div", "mn-login");
  root.appendChild(createElement("div", "mn-login__glow"));
  const card = createElement("div", "mn-login__card");
  const logoWrap = createElement("div", "mn-login__logo");
  logoWrap.innerHTML = compassSVG(80);
  card.appendChild(logoWrap);
  const title = createElement("h1", "mn-login__title", { text: opts.appTitle ?? "Maranello" });
  title.appendChild(createElement("span", "mn-login__title-accent", { text: opts.appTitleAccent ?? "Luce" }));
  card.appendChild(title);
  card.appendChild(createElement("p", "mn-login__subtitle", {
    text: state.subtitle ?? "Design System"
  }));
  const btn = createElement("button", "mn-login__btn");
  btn.type = "button";
  btn.appendChild(createElement("span", "", { text: opts.buttonLabel ?? "Sign in with SSO" }));
  if (state.onLogin) btn.addEventListener("click", state.onLogin);
  card.appendChild(btn);
  if (state.error) {
    card.appendChild(createElement("div", "mn-login__error", { text: state.error }));
    const errorEl = card.lastElementChild;
    errorEl.setAttribute("role", "alert");
  }
  const statusSection = createElement("div", "mn-login__status");
  statusSection.appendChild(createElement("div", "mn-login__status-title", { text: "SYSTEM STATUS" }));
  const gaugeRow = createElement("div", "mn-login__status-gauges");
  if (state.checks?.length) {
    state.checks.forEach((c) => gaugeRow.appendChild(createServiceCard(c)));
  } else {
    ["Database", "Cache", "API"].forEach((name) => {
      gaugeRow.appendChild(createServiceCard({ name, status: "healthy", latency_ms: null }));
    });
  }
  statusSection.appendChild(gaugeRow);
  let overall = "healthy";
  if (state.checks) {
    for (const c of state.checks) {
      if (c.status === "unhealthy") {
        overall = "unhealthy";
        break;
      }
      if (c.status === "degraded" && overall !== "unhealthy") overall = "degraded";
    }
  }
  statusSection.appendChild(createElement("div", `mn-login__overall mn-login__overall--${overall}`, {
    text: overall === "healthy" ? "All systems operational" : overall === "degraded" ? "Some services degraded" : "Service disruption detected"
  }));
  card.appendChild(statusSection);
  const footer = createElement("div", "mn-login__footer");
  footer.appendChild(createElement("span", "mn-login__version", { text: state.version ?? "" }));
  const envValue = state.env ?? "production";
  footer.appendChild(createElement("span", `mn-login__env mn-login__env--${envValue}`, {
    text: state.env ?? "Production"
  }));
  card.appendChild(footer);
  root.appendChild(card);
  container.appendChild(root);
}
function loginScreen(container, opts) {
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) return null;
  const options = opts ?? {};
  const state = {
    subtitle: options.subtitle,
    version: options.version,
    env: options.env,
    error: options.error ?? null,
    checks: options.checks ?? null,
    onLogin: options.onLogin ?? null
  };
  render(host, state, options);
  let disposed = false;
  let pollTimer = null;
  function fetchHealth() {
    if (disposed) return;
    const url = options.healthUrl ?? "/api/health/deep";
    fetch(url, { credentials: "same-origin" }).then((r) => r.ok ? r.json() : Promise.resolve(null)).then((data) => {
      if (data?.checks) {
        state.checks = data.checks;
        render(host, state, options);
      }
    }).catch(() => {
    });
  }
  if (options.autoHealth !== false && typeof fetch !== "undefined") {
    fetchHealth();
    pollTimer = setInterval(fetchHealth, options.pollInterval ?? 3e4);
  }
  return {
    updateStatus(healthData) {
      if (disposed) return;
      if (healthData?.checks) state.checks = healthData.checks;
      if (healthData?.error) state.error = healthData.error;
      render(host, state, options);
    },
    setError(msg) {
      if (disposed) return;
      state.error = msg;
      render(host, state, options);
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      if (pollTimer) clearInterval(pollTimer);
      host.innerHTML = "";
    }
  };
}

// src/ts/ai-chat-dom.ts
var ICON_SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/><path d="M18 14l1 3.5L22.5 18l-3.5 1L18 22.5l-1-3.5L13.5 18l3.5-1L18 14z" opacity=".6"/></svg>';
var FALLBACK_ICONS = {
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0014 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
  expandHorizontal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8 3 3 8 3"/><line x1="3" y1="3" x2="10" y2="10"/><polyline points="21 16 21 21 16 21"/><line x1="14" y1="14" x2="21" y2="21"/><polyline points="16 3 21 3 21 8"/><line x1="14" y1="10" x2="21" y2="3"/><polyline points="8 21 3 21 3 16"/><line x1="10" y1="14" x2="3" y2="21"/></svg>'
};
function getIcon(name) {
  if (icons[name]) return icons[name]();
  return FALLBACK_ICONS[name] ?? "";
}
function el(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
  }
  return e;
}
function formatTime(date) {
  const h = date.getHours(), m = date.getMinutes();
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}
function renderContent(text) {
  const container = document.createDocumentFragment();
  const parts = text.split(/(```[\s\S]*?```)/g);
  for (const part of parts) {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\w*\n/, "");
      const block = el("div", "mn-chat-msg__code");
      const pre = el("pre", "");
      pre.textContent = code;
      block.appendChild(pre);
      const copyBtn = el("button", "mn-chat-msg__copy", { "aria-label": "Copy code" });
      copyBtn.innerHTML = getIcon("copy");
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = getIcon("checkCircle");
          setTimeout(() => {
            copyBtn.innerHTML = getIcon("copy");
          }, 1500);
        });
      });
      block.appendChild(copyBtn);
      container.appendChild(block);
    } else if (part) {
      const span = el("span", "");
      span.innerHTML = part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/`([^`]+)`/g, '<code class="mn-chat-msg__code">$1</code>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
      container.appendChild(span);
    }
  }
  return container;
}
function buildUI(container, opts) {
  const state = {
    isOpen: false,
    isTyping: false,
    messages: [],
    panelHeight: 520,
    isListening: false,
    panelWidthMode: "normal",
    isAgentGridOpen: false,
    activeAgentId: opts.activeAgent ?? (opts.agents?.[0]?.id ?? null)
  };
  const fab = el("button", "mn-chat-fab", { "aria-label": "Open AI assistant", title: "AI Assistant" });
  fab.innerHTML = opts.avatar ? `<img src="${opts.avatar}" class="mn-chat-fab__avatar" alt="AI">` : ICON_SPARK;
  const pulse = el("span", "mn-chat-fab__pulse");
  fab.appendChild(pulse);
  container.appendChild(fab);
  const panel = el("div", "mn-chat-panel", { role: "dialog", "aria-label": "AI assistant chat" });
  panel.appendChild(el("div", "mn-chat-panel__accent"));
  const resizeHandle = el("div", "mn-chat-panel__resize");
  panel.appendChild(resizeHandle);
  const header = el("div", "mn-chat-panel__header");
  const headerLeft = el("div", "mn-chat-panel__header-left");
  if (opts.avatar) {
    const ha = el("img", "mn-chat-panel__header-avatar");
    ha.src = opts.avatar;
    ha.alt = "";
    headerLeft.appendChild(ha);
  }
  const titleEl = el("span", "mn-chat-panel__title", { text: opts.avatar ? "" : opts.title ?? "" });
  const agentSelector = el("button", "mn-chat-agent-selector", { type: "button", "aria-label": "Select AI agent" });
  const agentSelectorLabel = el("span", "mn-chat-agent-selector__label");
  agentSelector.appendChild(agentSelectorLabel);
  agentSelector.appendChild(el("span", "mn-chat-agent-selector__chevron", { html: getIcon("chevronDown") }));
  const headerActions = el("div", "mn-chat-panel__header-actions");
  const closeBtn = el("button", "mn-chat-panel__close", { "aria-label": "Close chat" });
  closeBtn.innerHTML = getIcon("close");
  const widthBtn = el("button", "mn-chat-panel__resize", { "aria-label": "Toggle panel width" });
  widthBtn.innerHTML = getIcon("expandHorizontal");
  headerActions.appendChild(widthBtn);
  headerActions.appendChild(closeBtn);
  headerLeft.appendChild(titleEl);
  if (opts.agents?.length) headerLeft.appendChild(agentSelector);
  header.appendChild(headerLeft);
  header.appendChild(headerActions);
  panel.appendChild(header);
  const agentGrid = el("div", "mn-chat-agent-grid", { "aria-hidden": "true" });
  panel.appendChild(agentGrid);
  const messagesEl = el("div", "mn-chat-panel__messages");
  panel.appendChild(messagesEl);
  const typingEl = el("div", "mn-chat-typing");
  typingEl.style.display = "none";
  for (let d = 0; d < 3; d++) typingEl.appendChild(el("span", "mn-chat-typing__dot"));
  messagesEl.appendChild(typingEl);
  const quickBar = el("div", "mn-chat-panel__quick");
  panel.appendChild(quickBar);
  const inputArea = el("div", "mn-chat-panel__input-area");
  const inputEl = el("textarea", "mn-chat-panel__input", { placeholder: opts.placeholder ?? "", rows: "1" });
  const sendBtn = el("button", "mn-chat-panel__send", { "aria-label": "Send message" });
  sendBtn.innerHTML = getIcon("arrowUp");
  const voiceBtn = el("button", "mn-chat-voice", { "aria-label": "Toggle voice input" });
  voiceBtn.innerHTML = getIcon("mic");
  inputArea.appendChild(inputEl);
  inputArea.appendChild(voiceBtn);
  inputArea.appendChild(sendBtn);
  panel.appendChild(inputArea);
  container.appendChild(panel);
  return {
    state,
    fab,
    pulse,
    panel,
    resizeHandle,
    closeBtn,
    widthBtn,
    agentSelector,
    agentSelectorLabel,
    agentGrid,
    messagesEl,
    typingEl,
    quickBar,
    inputEl,
    sendBtn,
    voiceBtn
  };
}

// src/ts/ai-chat-messages.ts
function initMessages(state, els, opts) {
  const { messages } = state;
  const { messagesEl, typingEl, inputEl, sendBtn, voiceBtn, quickBar } = els;
  const { agentSelector, agentSelectorLabel, agentGrid } = els;
  function addMessage(role, content) {
    const msg = { role, content, time: /* @__PURE__ */ new Date() };
    messages.push(msg);
    renderMessage(msg);
    scrollToBottom();
    return msg;
  }
  function renderMessage(msg) {
    const wrap = el("div", `mn-chat-msg mn-chat-msg--${msg.role}`);
    if (msg.role === "ai") {
      const iconWrap = el("span", "mn-chat-msg__icon");
      iconWrap.innerHTML = ICON_SPARK;
      const body = el("div", "mn-chat-msg__body");
      body.appendChild(iconWrap);
      const contentEl = el("span", "mn-chat-msg__content");
      contentEl.appendChild(renderContent(msg.content));
      body.appendChild(contentEl);
      wrap.appendChild(body);
    } else {
      if (opts.avatar) {
        const body = el("div", "mn-chat-msg__body");
        const contentEl = el("span", "mn-chat-msg__content");
        contentEl.appendChild(renderContent(msg.content));
        body.appendChild(contentEl);
        body.appendChild(el("img", "mn-chat-msg__avatar", { src: opts.avatar ?? "", alt: "You" }));
        wrap.appendChild(body);
      } else {
        const contentEl = el("span", "mn-chat-msg__content");
        contentEl.appendChild(renderContent(msg.content));
        wrap.appendChild(contentEl);
      }
    }
    wrap.appendChild(el("div", "mn-chat-msg__time", { text: formatTime(msg.time) }));
    messagesEl.insertBefore(wrap, typingEl);
    return wrap;
  }
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }
  function setTyping(show) {
    state.isTyping = show;
    typingEl.style.display = show ? "flex" : "none";
    if (show) scrollToBottom();
  }
  function resetInputHeight() {
    inputEl.style.height = "auto";
    inputEl.rows = 1;
  }
  function autoResize() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + "px";
  }
  function updateSendVisibility() {
    sendBtn.classList.toggle("mn-chat-panel__send--visible", inputEl.value.trim().length > 0);
  }
  function handleResult(result) {
    if (!result) return;
    if (typeof result.then === "function") {
      result.then((r) => {
        setTyping(false);
        if (r) addMessage("ai", typeof r === "string" ? r : r.content ?? String(r));
      }).catch((e) => {
        setTyping(false);
        addMessage("ai", `Error: ${e.message ?? String(e)}`);
      });
    } else {
      setTyping(false);
      const r = result;
      addMessage("ai", typeof r === "string" ? r : r.content ?? String(r));
    }
  }
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage("user", text);
    inputEl.value = "";
    resetInputHeight();
    updateSendVisibility();
    if (opts.onSend) {
      setTyping(true);
      handleResult(opts.onSend(text));
    }
  }
  function handleQuickAction(action) {
    if (!opts.onQuickAction) return;
    let lastAi = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "ai") {
        lastAi = messages[i].content;
        break;
      }
    }
    addMessage("user", action);
    setTyping(true);
    handleResult(opts.onQuickAction(action, lastAi));
  }
  function getActiveAgent() {
    const agents = opts.agents ?? [];
    for (const agent of agents) {
      if (agent.id === state.activeAgentId) return agent;
    }
    return agents[0] ?? null;
  }
  function updateAgentSelectorLabel() {
    const active = getActiveAgent();
    agentSelectorLabel.textContent = active ? active.label : "Select Agent";
  }
  function renderAgentGrid() {
    const agents = opts.agents ?? [];
    if (!agents.length) return;
    agentGrid.innerHTML = "";
    for (const agent of agents) {
      const card = el("button", "mn-chat-agent-card", { type: "button" });
      if (agent.id === state.activeAgentId) card.classList.add("mn-chat-agent-card--active");
      const iconEl = el("span", "mn-chat-agent-card__icon");
      if (agent.icon && /<svg/i.test(agent.icon)) iconEl.innerHTML = agent.icon;
      else iconEl.textContent = agent.icon ?? "\u{1F916}";
      card.appendChild(iconEl);
      card.appendChild(el("span", "mn-chat-agent-card__label", { text: agent.label ?? agent.id }));
      card.addEventListener("click", () => {
        state.activeAgentId = agent.id;
        updateAgentSelectorLabel();
        renderAgentGrid();
        toggleAgentGrid(false);
        if (typeof opts.onAgentChange === "function") opts.onAgentChange(agent.id, agent);
      });
      agentGrid.appendChild(card);
    }
  }
  function toggleAgentGrid(forceState) {
    if (!(opts.agents ?? []).length) return;
    state.isAgentGridOpen = typeof forceState === "boolean" ? forceState : !state.isAgentGridOpen;
    agentGrid.classList.toggle("mn-chat-agent-grid--open", state.isAgentGridOpen);
    agentSelector.classList.toggle("mn-chat-agent-selector--open", state.isAgentGridOpen);
    agentGrid.setAttribute("aria-hidden", state.isAgentGridOpen ? "false" : "true");
  }
  function cyclePanelWidth() {
    const next = state.panelWidthMode === "normal" ? "wide" : state.panelWidthMode === "wide" ? "full" : "normal";
    state.panelWidthMode = next;
    els.panel.classList.toggle("mn-chat-panel--wide", next === "wide");
    els.panel.classList.toggle("mn-chat-panel--full", next === "full");
  }
  function toggleVoice() {
    state.isListening = !state.isListening;
    voiceBtn.classList.toggle("mn-chat-voice--active", state.isListening);
    if (typeof opts.onVoice === "function") opts.onVoice(state.isListening);
  }
  function clear() {
    state.messages.length = 0;
    messagesEl.querySelectorAll(".mn-chat-msg").forEach((n) => n.remove());
    setTyping(false);
  }
  for (const action of opts.quickActions ?? []) {
    const btn = el("button", "mn-chat-panel__quick-btn", { text: action });
    btn.addEventListener("click", () => handleQuickAction(action));
    quickBar.appendChild(btn);
  }
  if ((opts.agents ?? []).length) {
    updateAgentSelectorLabel();
    renderAgentGrid();
    agentSelector.addEventListener("click", () => toggleAgentGrid());
  }
  inputEl.addEventListener("input", () => {
    autoResize();
    updateSendVisibility();
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  sendBtn.addEventListener("click", sendMessage);
  voiceBtn.addEventListener("click", toggleVoice);
  els.widthBtn.addEventListener("click", cyclePanelWidth);
  state.addMessage = addMessage;
  state.setTyping = setTyping;
  state.clear = clear;
  state.toggleAgentGrid = toggleAgentGrid;
  state.onDocumentClick = (e) => {
    if (!state.isAgentGridOpen) return;
    if (!(e.target instanceof Node) || !els.panel.contains(e.target)) return;
    if (agentSelector.contains(e.target) || agentGrid.contains(e.target)) return;
    toggleAgentGrid(false);
  };
}

// src/ts/system-status.ts
function statusClass(ok, ms) {
  if (!ok) return "danger";
  if (ms > 1e3) return "warning";
  return "active";
}
function overallStatus(results) {
  if (results.some((r) => !r.ok)) return { label: "Degraded Performance", cls: "danger" };
  if (results.some((r) => r.ms > 1e3)) return { label: "Partial Degradation", cls: "warning" };
  return { label: "All Systems Operational", cls: "active" };
}
function systemStatus(container, opts) {
  const options = {
    version: "",
    environment: "",
    services: [],
    pollInterval: 3e4,
    onClick: void 0,
    ...opts
  };
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) return null;
  host.innerHTML = "";
  host.classList.add("mn-sys-status");
  const pill = createElement("button", "mn-sys-status__pill", {
    "aria-label": "System status",
    "aria-expanded": "false"
  });
  const dot = createElement("span", "mn-sys-status__dot mn-sys-status__dot--active");
  const verSpan = createElement("span", "mn-sys-status__version", { text: options.version });
  const envSpan = createElement("span", "mn-sys-status__env", { text: options.environment });
  pill.appendChild(dot);
  pill.appendChild(verSpan);
  if (options.environment) {
    pill.appendChild(document.createTextNode(" \xB7 "));
    pill.appendChild(envSpan);
  }
  host.appendChild(pill);
  const panel = createElement("div", "mn-sys-status__panel", { role: "status", "aria-live": "polite" });
  const headerRow = createElement("div", "mn-sys-status__header");
  const headerDot = createElement("span", "mn-sys-status__dot mn-sys-status__dot--active");
  const headerLabel = createElement("span", "mn-sys-status__header-label", { text: "Checking\u2026" });
  headerRow.appendChild(headerDot);
  headerRow.appendChild(headerLabel);
  panel.appendChild(headerRow);
  const serviceList = createElement("div", "mn-sys-status__services");
  panel.appendChild(serviceList);
  host.appendChild(panel);
  let isOpen = false;
  let results = [];
  let pollTimer = null;
  pill.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("mn-sys-status__panel--open", isOpen);
    pill.setAttribute("aria-expanded", String(isOpen));
    if (isOpen && results.length === 0) void refresh();
  });
  function onDocClick2(e) {
    const target = e.target;
    if (target && isOpen && !host.contains(target)) {
      isOpen = false;
      panel.classList.remove("mn-sys-status__panel--open");
      pill.setAttribute("aria-expanded", "false");
    }
  }
  function onDocKey2(e) {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      panel.classList.remove("mn-sys-status__panel--open");
      pill.setAttribute("aria-expanded", "false");
    }
  }
  document.addEventListener("click", onDocClick2);
  document.addEventListener("keydown", onDocKey2);
  function renderResults() {
    serviceList.innerHTML = "";
    results.forEach((r, i) => {
      const row = createElement("div", "mn-sys-status__service");
      row.appendChild(createElement("span", `mn-sys-status__dot mn-sys-status__dot--${statusClass(r.ok, r.ms)}`));
      row.appendChild(createElement("span", "mn-sys-status__service-name", { text: r.name }));
      const sMs = createElement("span", "mn-sys-status__service-ms", { text: r.ok ? `${r.ms}ms` : "DOWN" });
      if (!r.ok) sMs.classList.add("mn-sys-status__service-ms--down");
      row.appendChild(sMs);
      if (options.onClick) {
        row.style.cursor = "pointer";
        row.addEventListener("click", () => options.onClick?.(options.services[i], r));
      }
      serviceList.appendChild(row);
    });
    const overall = overallStatus(results);
    headerDot.className = `mn-sys-status__dot mn-sys-status__dot--${overall.cls}`;
    headerLabel.textContent = overall.label;
    dot.className = `mn-sys-status__dot mn-sys-status__dot--${overall.cls}`;
  }
  async function refresh() {
    headerLabel.textContent = "Checking\u2026";
    results = await Promise.all(
      options.services.map(async (svc) => {
        const start = performance.now();
        try {
          if (svc.check) {
            const res = await svc.check();
            return { name: svc.name, ok: res.ok !== false, ms: Math.round(res.ms ?? performance.now() - start) };
          }
          await new Promise((r) => setTimeout(r, 50 + Math.random() * 300));
          return { name: svc.name, ok: true, ms: Math.round(performance.now() - start) };
        } catch {
          return { name: svc.name, ok: false, ms: Math.round(performance.now() - start) };
        }
      })
    );
    renderResults();
  }
  if (options.pollInterval > 0) {
    pollTimer = setInterval(() => void refresh(), options.pollInterval);
  }
  void refresh();
  return {
    refresh,
    destroy() {
      if (pollTimer) clearInterval(pollTimer);
      document.removeEventListener("click", onDocClick2);
      document.removeEventListener("keydown", onDocKey2);
      host.innerHTML = "";
      host.classList.remove("mn-sys-status");
    }
  };
}

// src/ts/profile-menu-dom.ts
function getIcon3(name) {
  if (icons[name]) return icons[name]();
  return "";
}
function initials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}
function buildAvatarSpan(cls, name, url) {
  const el4 = document.createElement("span");
  el4.className = cls;
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = name || "User avatar";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%";
    img.onerror = () => {
      img.remove();
      el4.textContent = initials(name);
    };
    el4.appendChild(img);
  } else {
    el4.textContent = initials(name);
  }
  return el4;
}
function buildTriggerAvatar(name, url) {
  return buildAvatarSpan("mn-profile-trigger__avatar", name, url);
}
function buildLargeAvatar(name, url) {
  return buildAvatarSpan("mn-profile-dropdown__avatar-lg", name, url);
}
function buildDropdown(opts, closeFn) {
  const itemEls = [];
  const dd = document.createElement("div");
  dd.className = "mn-profile-dropdown";
  dd.setAttribute("role", "menu");
  dd.setAttribute("aria-label", "User menu");
  const header = document.createElement("div");
  header.className = "mn-profile-dropdown__header";
  header.appendChild(buildLargeAvatar(opts.name, opts.avatarUrl));
  const info = document.createElement("div");
  info.className = "mn-profile-dropdown__info";
  const nameEl = document.createElement("div");
  nameEl.className = "mn-profile-dropdown__name";
  nameEl.textContent = opts.name || "User";
  info.appendChild(nameEl);
  if (opts.email) {
    const emailEl = document.createElement("div");
    emailEl.className = "mn-profile-dropdown__email";
    emailEl.textContent = opts.email;
    info.appendChild(emailEl);
  }
  header.appendChild(info);
  dd.appendChild(header);
  for (const section of opts.sections) {
    if (section.divider) {
      dd.appendChild(document.createElement("div")).className = "mn-profile-dropdown__divider";
      continue;
    }
    const sectionEl = document.createElement("div");
    sectionEl.className = "mn-profile-dropdown__section";
    if (section.title) {
      const titleEl = document.createElement("div");
      titleEl.className = "mn-profile-dropdown__section-title";
      titleEl.textContent = section.title;
      sectionEl.appendChild(titleEl);
    }
    for (const item of section.items ?? []) {
      const row = document.createElement("div");
      row.className = "mn-profile-dropdown__item";
      if (item.variant === "danger") row.classList.add("mn-profile-dropdown__item--danger");
      row.setAttribute("role", "menuitem");
      row.setAttribute("tabindex", "-1");
      if (item.icon) {
        const ic = document.createElement("span");
        ic.className = "mn-profile-dropdown__item-icon";
        ic.innerHTML = getIcon3(item.icon);
        row.appendChild(ic);
      }
      row.appendChild(document.createTextNode(item.label ?? ""));
      if (item.badge != null && Number(item.badge) > 0) {
        const badge = document.createElement("span");
        badge.className = "mn-profile-dropdown__item-badge";
        badge.textContent = Number(item.badge) > 99 ? "99+" : String(item.badge);
        row.appendChild(badge);
      }
      row.addEventListener("click", () => {
        if (typeof item.action === "function") item.action();
        closeFn();
      });
      sectionEl.appendChild(row);
      itemEls.push(row);
    }
    dd.appendChild(sectionEl);
  }
  return { el: dd, itemEls };
}

// src/ts/profile-menu.ts
function profileMenu(trigger, options) {
  const opts = {
    name: "",
    email: "",
    avatarUrl: null,
    sections: [],
    ...options
  };
  let dropdown = null;
  let isOpen = false;
  let focusIdx = -1;
  let itemEls = [];
  const btn = document.createElement("button");
  btn.className = "mn-profile-trigger";
  btn.type = "button";
  btn.setAttribute("aria-haspopup", "true");
  btn.setAttribute("aria-expanded", "false");
  btn.appendChild(buildTriggerAvatar(opts.name, opts.avatarUrl));
  trigger.appendChild(btn);
  function positionDropdown() {
    if (!dropdown) return;
    const rect = btn.getBoundingClientRect();
    dropdown.style.position = "fixed";
    dropdown.style.top = `${rect.bottom + 4}px`;
    const menuWidth = dropdown.offsetWidth || 260;
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
    dropdown.style.left = `${left}px`;
    const ddRect = dropdown.getBoundingClientRect();
    if (ddRect.bottom > window.innerHeight - 8) {
      dropdown.style.top = `${rect.top - ddRect.height - 4}px`;
    }
  }
  function setFocus(idx) {
    if (!itemEls.length) return;
    focusIdx = (idx % itemEls.length + itemEls.length) % itemEls.length;
    itemEls.forEach((el4, i) => el4.classList.toggle("mn-profile-dropdown__item--focused", i === focusIdx));
    itemEls[focusIdx].focus();
  }
  function onKeyDown(e) {
    if (!isOpen) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        btn.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocus(focusIdx + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocus(focusIdx - 1);
        break;
      case "Enter":
      case " ":
        if (focusIdx >= 0 && itemEls[focusIdx]) {
          e.preventDefault();
          itemEls[focusIdx].click();
        }
        break;
      case "Tab":
        close();
        break;
    }
  }
  function open() {
    if (isOpen) return;
    isOpen = true;
    focusIdx = -1;
    const result = buildDropdown(opts, close);
    dropdown = result.el;
    itemEls = result.itemEls;
    document.body.appendChild(dropdown);
    positionDropdown();
    btn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      dropdown?.classList.add("mn-profile-dropdown--open");
    });
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onOutsideClick, true);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("mousedown", onOutsideClick, true);
    if (dropdown) {
      dropdown.classList.remove("mn-profile-dropdown--open");
      const dd = dropdown;
      setTimeout(() => {
        dd.parentNode?.removeChild(dd);
      }, 180);
      dropdown = null;
    }
    itemEls = [];
  }
  function onOutsideClick(e) {
    const target = e.target;
    if (target && dropdown && !dropdown.contains(target) && !btn.contains(target)) close();
  }
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? close() : open();
  });
  function onResize() {
    if (isOpen) positionDropdown();
  }
  window.addEventListener("resize", onResize);
  const setUser = (uOrName, email, avatarUrl) => {
    if (typeof uOrName === "string") {
      opts.name = uOrName;
      opts.email = email ?? "";
      opts.avatarUrl = avatarUrl ?? null;
    } else {
      Object.assign(opts, uOrName);
    }
    btn.innerHTML = "";
    btn.appendChild(buildTriggerAvatar(opts.name, opts.avatarUrl));
    if (isOpen) {
      close();
      open();
    }
  };
  return {
    open,
    close,
    setUser,
    destroy() {
      close();
      window.removeEventListener("resize", onResize);
      btn.parentNode?.removeChild(btn);
    }
  };
}

// src/ts/map-view-helpers.ts
var DPR = window.devicePixelRatio || 1;
var TAU = Math.PI * 2;
var SIZE_PX = { sm: 6, md: 10, lg: 14 };
var THEMES = {
  editorial: { land: "#1a1a1a", water: "#0a0a0a", border: "#2a2a2a", grid: "rgba(200,200,200,0.04)", text: "#c8c8c8", muted: "#616161" },
  nero: { land: "#1a1a1a", water: "#050505", border: "#2a2a2a", grid: "rgba(200,200,200,0.03)", text: "#c8c8c8", muted: "#555" },
  avorio: { land: "#e8d5b0", water: "#faf3e6", border: "#d7c39a", grid: "rgba(0,0,0,0.05)", text: "#1a1a1a", muted: "#888" },
  colorblind: { land: "#1a1a1a", water: "#0a0a0a", border: "#2a2a2a", grid: "rgba(200,200,200,0.04)", text: "#c8c8c8", muted: "#616161" }
};
function ll(lon, lat) {
  return [(lon + 180) / 360, (90 - lat) / 180];
}
var CONTINENTS = {
  northAmerica: [ll(-130, 55), ll(-125, 60), ll(-115, 62), ll(-100, 63), ll(-95, 68), ll(-88, 65), ll(-80, 62), ll(-65, 60), ll(-60, 50), ll(-65, 45), ll(-70, 42), ll(-75, 35), ll(-80, 30), ll(-85, 28), ll(-90, 28), ll(-97, 25), ll(-100, 20), ll(-105, 20), ll(-110, 23), ll(-115, 30), ll(-120, 34), ll(-125, 40), ll(-125, 48), ll(-130, 55)],
  southAmerica: [ll(-80, 10), ll(-75, 5), ll(-70, 8), ll(-60, 5), ll(-50, 0), ll(-45, -3), ll(-35, -5), ll(-35, -12), ll(-38, -18), ll(-42, -22), ll(-48, -26), ll(-50, -30), ll(-55, -34), ll(-58, -38), ll(-65, -42), ll(-68, -50), ll(-72, -48), ll(-75, -42), ll(-72, -35), ll(-70, -28), ll(-70, -18), ll(-75, -12), ll(-78, -2), ll(-80, 2), ll(-80, 10)],
  europe: [ll(-10, 36), ll(-8, 42), ll(-5, 44), ll(0, 44), ll(3, 48), ll(5, 52), ll(8, 55), ll(12, 56), ll(15, 58), ll(20, 60), ll(25, 62), ll(28, 65), ll(30, 62), ll(32, 58), ll(35, 55), ll(40, 52), ll(38, 48), ll(35, 45), ll(30, 42), ll(28, 38), ll(25, 36), ll(20, 36), ll(15, 38), ll(10, 38), ll(5, 40), ll(0, 40), ll(-5, 38), ll(-10, 36)],
  africa: [ll(-15, 15), ll(-17, 20), ll(-15, 28), ll(-5, 35), ll(5, 36), ll(10, 37), ll(15, 33), ll(25, 32), ll(30, 30), ll(32, 28), ll(35, 25), ll(40, 15), ll(42, 12), ll(50, 10), ll(48, 5), ll(42, 0), ll(38, -5), ll(35, -10), ll(32, -15), ll(35, -25), ll(30, -32), ll(25, -34), ll(20, -34), ll(18, -30), ll(15, -25), ll(12, -18), ll(12, -10), ll(10, -2), ll(8, 4), ll(5, 5), ll(0, 5), ll(-5, 5), ll(-10, 8), ll(-15, 10), ll(-15, 15)],
  asia: [ll(40, 52), ll(45, 55), ll(55, 55), ll(60, 58), ll(70, 62), ll(80, 65), ll(100, 68), ll(120, 65), ll(130, 60), ll(135, 55), ll(140, 50), ll(142, 45), ll(140, 40), ll(135, 35), ll(130, 32), ll(122, 28), ll(115, 25), ll(110, 20), ll(105, 15), ll(100, 12), ll(98, 8), ll(100, 5), ll(105, 0), ll(95, 5), ll(88, 22), ll(82, 18), ll(75, 15), ll(72, 20), ll(68, 24), ll(62, 25), ll(55, 25), ll(50, 28), ll(45, 32), ll(42, 38), ll(40, 42), ll(38, 48), ll(40, 52)],
  oceania: [ll(115, -12), ll(120, -15), ll(130, -12), ll(135, -15), ll(140, -18), ll(145, -20), ll(148, -22), ll(150, -25), ll(152, -28), ll(150, -32), ll(148, -35), ll(142, -38), ll(138, -35), ll(135, -32), ll(130, -30), ll(125, -28), ll(120, -25), ll(118, -22), ll(115, -18), ll(115, -12)]
};
function detectTheme() {
  const b = document.body.classList;
  const name = b.contains("mn-colorblind") ? "colorblind" : b.contains("mn-nero") ? "nero" : b.contains("mn-avorio") ? "avorio" : "editorial";
  const t = THEMES[name];
  return { ...t, coast: t.border, bg: t.water };
}
function getMarkerColors() {
  return {
    editorial: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#FFC72C"), danger: cssVar("--signal-danger", "#DC0000") },
    nero: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#FFC72C"), danger: cssVar("--signal-danger", "#DC0000") },
    avorio: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--arancio", "#D4622B"), danger: cssVar("--signal-danger", "#DC0000") },
    colorblind: { active: "#0072B2", warning: "#FFB000", danger: "#D55E00" }
  };
}
function project(lat, lon, w, h, pad2, vs) {
  const baseW = Math.max(1, w - pad2 * 2), baseH = Math.max(1, h - pad2 * 2);
  if (!vs) return { x: (lon + 180) / 360 * baseW + pad2, y: (90 - lat) / 180 * baseH + pad2 };
  const zoom = vs.zoom || 1;
  const worldW = baseW * zoom, worldH = baseH * zoom;
  const cx = w / 2 * zoom, cy = h / 2 * zoom;
  const wx = (lon + 180) / 360 * worldW, wy = (90 - lat) / 180 * worldH;
  return { x: wx - cx + w * 0.5 + (vs.panX || 0), y: wy - cy + h * 0.5 + (vs.panY || 0) };
}
function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
function getVisibleProjected(source, vw, vh, padding, viewState) {
  const out = [];
  for (let i = 0; i < source.length; i++) {
    const m = source[i];
    const p = project(m.lat, m.lon, vw, vh, padding, viewState);
    if (p.x >= -120 && p.x <= vw + 120 && p.y >= -120 && p.y <= vh + 120) {
      out.push({ ...m, _x: p.x, _y: p.y });
    }
  }
  return out;
}
function clusterMarkers(source, zoom, markerColors, clusterRadius, minClusterSize) {
  const cellSize = Math.max(16, clusterRadius / Math.max(0.5, zoom));
  const buckets = {};
  for (const m of source) {
    const key = Math.floor(m._x / cellSize) + ":" + Math.floor(m._y / cellSize);
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(m);
  }
  let clustered = [];
  for (const key of Object.keys(buckets)) {
    const group = buckets[key];
    if (group.length >= minClusterSize) {
      let xAcc = 0, yAcc = 0;
      for (const g of group) {
        xAcc += g._x;
        yAcc += g._y;
      }
      clustered.push({
        id: "cluster-" + key,
        isCluster: true,
        clusterCount: group.length,
        count: group.length,
        lat: group[0].lat,
        lon: group[0].lon,
        label: group.length + " locations",
        detail: "Grouped nearby markers",
        color: "active",
        mixedColor: mixClusterColor(group, markerColors),
        _x: xAcc / group.length,
        _y: yAcc / group.length,
        _members: group,
        size: 10
      });
    } else {
      clustered = clustered.concat(group);
    }
  }
  return clustered;
}
function mixClusterColor(items, mc) {
  let rAcc = 0, gAcc = 0, bAcc = 0, total = 0;
  const counts = { active: 0, warning: 0, danger: 0 };
  for (const m of items) {
    const key = m.color || "active";
    counts[key] = (counts[key] || 0) + 1;
    total++;
    const col = mc[key] || mc.active;
    rAcc += parseInt(col.slice(1, 3), 16);
    gAcc += parseInt(col.slice(3, 5), 16);
    bAcc += parseInt(col.slice(5, 7), 16);
  }
  let dom = "active";
  if (counts.warning > counts[dom]) dom = "warning";
  if (counts.danger > counts[dom]) dom = "danger";
  const dh = mc[dom];
  const dr = parseInt(dh.slice(1, 3), 16), dg = parseInt(dh.slice(3, 5), 16), db = parseInt(dh.slice(5, 7), 16);
  const ar = total ? Math.round(rAcc / total) : dr, ag = total ? Math.round(gAcc / total) : dg, ab = total ? Math.round(bAcc / total) : db;
  return "rgb(" + Math.round(dr * 0.65 + ar * 0.35) + "," + Math.round(dg * 0.65 + ag * 0.35) + "," + Math.round(db * 0.65 + ab * 0.35) + ")";
}
function markerRadius(m) {
  const base = SIZE_PX[m.size || "md"] || SIZE_PX.md;
  const count = Math.max(1, parseInt(String(m.count || 1), 10) || 1);
  if ("isCluster" in m && m.isCluster) return clamp(10 + Math.sqrt(Math.max(1, m.clusterCount || count)) * 2.4, 12, 30);
  if (count > 1) return clamp(base + Math.sqrt(count) * 1.6, 8, 26);
  return base;
}
function drawMarker(ctx, m, mc, pulse, highlighted, hovered) {
  const x = m._x, y = m._y, r = markerRadius(m);
  const isCluster = "isCluster" in m && m.isCluster;
  const col = isCluster ? m.mixedColor || mc.active : mc[m.color || "active"] || mc.active;
  const isHl = highlighted === m.id;
  const isHov = hovered === m.id;
  const count = Math.max(1, parseInt(String(m.count || 1), 10) || 1);
  const showCount = count > 1 || isCluster;
  const pScale = 1 + Math.sin(pulse + m.lat * 0.1) * 0.25;
  const outerR = r * pScale * (isHl ? 1.6 : 1.3);
  ctx.beginPath();
  ctx.arc(x, y, outerR, 0, TAU);
  ctx.fillStyle = hexToRgba(col, 0.15);
  ctx.fill();
  const coreR = showCount ? isHov ? r * 1.05 : r : isHov ? r * 1.2 : r * 0.5;
  ctx.beginPath();
  ctx.arc(x, y, coreR, 0, TAU);
  ctx.fillStyle = col;
  ctx.fill();
  if (showCount) {
    ctx.fillStyle = isCluster ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.arc(x, y, coreR * 0.72, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "600 " + Math.max(11, Math.round(coreR * 0.85)) + 'px "Barlow Condensed",sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(count), x, y + 0.5);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, coreR * 0.4, 0, TAU);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  }
}
function renderLegend(legendEl, mc) {
  if (!legendEl) return;
  legendEl.innerHTML = "";
  const cats = ["active", "warning", "danger"];
  const labels = ["Active", "Warning", "Danger"];
  for (let i = 0; i < cats.length; i++) {
    const item = document.createElement("div");
    item.className = "mn-map__legend-item";
    const dot = document.createElement("span");
    dot.className = "mn-map__legend-dot";
    dot.style.background = mc[cats[i]];
    item.appendChild(dot);
    item.appendChild(document.createTextNode(labels[i]));
    legendEl.appendChild(item);
  }
}
function hitTest(clientX, clientY, canvas, markers) {
  const cr = canvas.getBoundingClientRect();
  const mx = clientX - cr.left, my = clientY - cr.top;
  for (let i = markers.length - 1; i >= 0; i--) {
    const m = markers[i], r = markerRadius(m);
    const dx = mx - m._x, dy = my - m._y;
    if (dx * dx + dy * dy <= (r + 4) * (r + 4)) return m;
  }
  return null;
}

// src/ts/map-view.ts
function mapView(container, opts) {
  if (!container) return null;
  const o = { markers: [], padding: 40, zoom: 1, ...opts };
  let markers = o.markers;
  const viewState = { zoom: o.zoom || 1, panX: 0, panY: 0 };
  container.innerHTML = "";
  container.style.position = "relative";
  container.style.overflow = "hidden";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;";
  container.appendChild(canvas);
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip";
  tip.style.position = "absolute";
  tip.style.pointerEvents = "none";
  container.appendChild(tip);
  const legend = document.createElement("div");
  legend.className = "mn-map__legend";
  legend.style.cssText = "position:absolute;bottom:8px;left:8px;display:flex;gap:8px;font-size:0.65rem;";
  container.appendChild(legend);
  let renderedMarkers = [];
  let highlighted = null;
  let hovered = null;
  const pulse = 0;
  function render3() {
    const rect = container.getBoundingClientRect();
    const vw = rect.width, vh = rect.height;
    canvas.width = vw * DPR;
    canvas.height = vh * DPR;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(DPR, DPR);
    const th = detectTheme();
    const mc = getMarkerColors();
    const themeName = document.body.classList.contains("mn-colorblind") ? "colorblind" : document.body.classList.contains("mn-nero") ? "nero" : document.body.classList.contains("mn-avorio") ? "avorio" : "editorial";
    const colors = mc[themeName];
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, vw, vh);
    ctx.strokeStyle = th.coast;
    ctx.lineWidth = 0.8;
    ctx.fillStyle = th.land;
    Object.values(CONTINENTS).forEach((pts) => {
      if (!pts || !pts.length) return;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const proj = project(p[1], p[0], vw, vh, o.padding, viewState);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    const visible = getVisibleProjected(markers, vw, vh, o.padding, viewState);
    const clustered = clusterMarkers(visible, viewState.zoom, colors, 40, 3);
    renderedMarkers = [];
    clustered.forEach((m) => {
      drawMarker(ctx, m, colors, pulse, highlighted, hovered);
      renderedMarkers.push(m);
    });
    renderLegend(legend, colors);
  }
  canvas.addEventListener("mousemove", (e) => {
    const hit = hitTest(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit) {
      canvas.style.cursor = "pointer";
      hovered = hit.id;
      showTip3(hit);
    } else {
      canvas.style.cursor = "default";
      hovered = null;
      tip.classList.remove("mn-chart-tooltip--visible");
    }
  });
  canvas.addEventListener("click", (e) => {
    const hit = hitTest(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit && o.onClick) o.onClick(hit);
  });
  canvas.addEventListener("mouseleave", () => {
    hovered = null;
    tip.classList.remove("mn-chart-tooltip--visible");
  });
  function showTip3(m) {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + (m.label || "Marker") + "</div>" + (m.detail ? '<div style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">' + m.detail + "</div>" : "");
    tip.classList.add("mn-chart-tooltip--visible");
    const tipW = tip.offsetWidth || 120;
    let left = m._x - tipW / 2;
    if (left < 4) left = 4;
    const rect = container.getBoundingClientRect();
    if (left + tipW > rect.width - 4) left = rect.width - tipW - 4;
    let top = m._y - (tip.offsetHeight || 40) - 12;
    if (top < 4) top = m._y + 12;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  if (window.ResizeObserver) new ResizeObserver(() => render3()).observe(container);
  new MutationObserver(() => render3()).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  render3();
  return {
    setMarkers: (m) => {
      markers = m;
      render3();
    },
    addMarker: (m) => {
      markers.push(m);
      render3();
    },
    removeMarker: (id) => {
      markers = markers.filter((m) => m.id !== id);
      render3();
    },
    highlight: (id) => {
      highlighted = id;
      render3();
    },
    setZoom: (z) => {
      viewState.zoom = z;
      render3();
    },
    panTo: (lat, lon) => {
      render3();
    },
    fitBounds: () => {
      viewState.zoom = 1;
      viewState.panX = 0;
      viewState.panY = 0;
      render3();
    },
    destroy: () => {
      container.innerHTML = "";
    }
  };
}

// src/ts/data-binding.ts
function emit(name, detail) {
  eventBus.emit(name, detail);
}
function on(name, handler) {
  eventBus.on(name, handler);
}
function toElementArray(selector) {
  if (typeof selector === "string") return Array.from(document.querySelectorAll(selector));
  return [selector];
}
function setElementProperty(el4, property, value) {
  if (property === "textContent") {
    el4.textContent = value == null ? "" : String(value);
  } else if (property === "innerHTML") {
    el4.innerHTML = value == null ? "" : String(value);
  } else if (property.startsWith("style.")) {
    if (el4 instanceof HTMLElement) {
      el4.style[property.slice(6)] = value == null ? "" : String(value);
    }
  } else if (property.startsWith("data-")) {
    const attrValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
    el4.setAttribute(property, attrValue);
  } else {
    el4[property] = value;
  }
}
function bind(selector, options) {
  const elements = toElementArray(selector);
  const opts = {
    property: "textContent",
    interval: 0,
    map: (data) => data,
    ...options
  };
  function update() {
    const fetchFn = opts.fetch ?? (() => {
      if (!opts.url) return Promise.reject(new Error("bind: missing URL"));
      return fetch(opts.url).then((r) => r.json());
    });
    fetchFn().then((data) => {
      for (const el4 of elements) {
        const value = opts.map(data, el4);
        setElementProperty(el4, opts.property, value);
        el4.classList.add("mn-anim-count");
        setTimeout(() => el4.classList.remove("mn-anim-count"), 300);
        if (opts.onUpdate) opts.onUpdate(el4, value);
      }
    }).catch((err) => {
      if (opts.onError) {
        for (const el4 of elements) opts.onError(el4, err);
      }
    });
  }
  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return void 0;
}
function autoBind() {
  document.querySelectorAll("[data-mn-bind]").forEach((el4) => {
    const config = {};
    const rawBind = el4.dataset.mnBind;
    if (!rawBind) return;
    rawBind.split(";").forEach((pair) => {
      const kv = pair.split(":");
      if (kv.length === 2) config[kv[0].trim()] = kv[1].trim();
    });
    if (config.url) {
      bind(el4, {
        url: config.url,
        property: config.prop ?? "textContent",
        interval: parseInt(config.refresh ?? "", 10) || 0
      });
    }
  });
}
function onDrillDown(selector, handler) {
  document.querySelectorAll(selector).forEach((el4) => {
    if (el4 instanceof HTMLElement) el4.style.cursor = "pointer";
    el4.setAttribute("role", "button");
    el4.setAttribute("tabindex", "0");
    el4.classList.add("mn-hover-lift");
    function trigger() {
      const context = {};
      Array.from(el4.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          context[attr.name.slice(5)] = attr.value;
        }
      });
      context.text = el4.textContent;
      handler(el4, context);
    }
    el4.addEventListener("click", trigger);
    el4.addEventListener("keydown", (e) => {
      const keyEvent = e;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        trigger();
      }
    });
  });
}

// src/ts/data-binding-ui.ts
function updateGauge(canvas, newConfig, gaugeMap) {
  const gauge = gaugeMap?.get(canvas);
  if (!gauge) return;
  Object.assign(gauge.config, newConfig);
  if (newConfig.complications && gauge.config.complications) {
    Object.assign(gauge.config.complications, newConfig.complications);
  } else if (newConfig.complications) {
    gauge.config.complications = { ...newConfig.complications };
  }
  gauge.animate();
}
function bindChart(canvas, chartType, options, chartRegistry) {
  const opts = {
    interval: 0,
    map: (d) => d,
    ...options
  };
  const maybeFn = chartRegistry?.[chartType];
  if (!maybeFn) {
    console.warn("bindChart: unknown chart type", chartType);
    return void 0;
  }
  const chartFn = maybeFn;
  function update() {
    const fetchFn = opts.fetch ?? (() => {
      if (!opts.url) return Promise.reject(new Error("missing URL"));
      return fetch(opts.url).then((r) => r.json());
    });
    fetchFn().then((raw) => {
      const data = opts.map(raw);
      chartFn(canvas, data, opts.chartOpts ?? {});
      eventBus.emit("chart-update", { canvas, type: chartType, data });
    }).catch((err) => {
      console.warn("bindChart error:", err);
    });
  }
  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return void 0;
}
function autoBindSliders(initSlider2) {
  document.querySelectorAll("[data-mn-slider]").forEach((el4) => {
    const config = {};
    const rawSlider = el4.dataset.mnSlider;
    if (!rawSlider) return;
    rawSlider.split(";").forEach((pair) => {
      const kv = pair.split(":");
      if (kv.length === 2) {
        const key = kv[0].trim();
        const rawValue = kv[1].trim();
        const numericValue = Number(rawValue);
        config[key] = isNaN(numericValue) ? rawValue : numericValue;
      }
    });
    if (initSlider2) initSlider2(el4, config);
  });
}
function bindControl(el4, options) {
  const opts = {
    mapRead: (d) => d.value,
    mapWrite: (v) => JSON.stringify({ value: v }),
    ...options
  };
  if (opts.url) {
    fetch(opts.url).then((r) => r.json()).then((data) => {
      const val = opts.mapRead(data);
      if (el4._mnSlider) el4._mnSlider.setValue(val);
    }).catch((err) => {
      console.warn("bindControl: failed to read initial value", err);
    });
  }
  eventBus.on("slider-change", (detail) => {
    const d = detail;
    if (d.element !== el4) return;
    if (opts.url) {
      fetch(opts.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: opts.mapWrite(d.value)
      }).catch((err) => {
        console.warn("bindControl: failed to write value", err);
      });
    }
  });
}

// src/ts/data-table-render.ts
var STATUS_MAP = {
  "active": { cls: "active", icon: "\u25CF" },
  "stage 3": { cls: "active", icon: "\u25CF" },
  "completed": { cls: "active", icon: "\u2713" },
  "at risk": { cls: "warning", icon: "\u25CF" },
  "warning": { cls: "warning", icon: "\u25B2" },
  "blocked": { cls: "danger", icon: "\u25CF" },
  "on hold": { cls: "danger", icon: "\u25A0" },
  "stage 1": { cls: "info", icon: "\u25CF" },
  "stage 2": { cls: "info", icon: "\u25CF" },
  "planned": { cls: "info", icon: "\u25CB" },
  "stage 4": { cls: "warning", icon: "\u25CF" }
};
function el2(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
  }
  return e;
}
function escHtml(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var cellRenderers = {
  text: (val) => '<span class="mn-dt__cell-text">' + escHtml(val) + "</span>",
  number: (val) => '<span class="mn-dt__cell-number">' + escHtml(val) + "</span>",
  status: (val) => {
    const key = String(val ?? "").toLowerCase();
    const st = STATUS_MAP[key] ?? { cls: "info", icon: "\u25CF" };
    return '<span class="mn-status mn-status--' + st.cls + '"><span class="mn-status__dot"></span> ' + escHtml(val) + "</span>";
  },
  progress: (val) => {
    const pct2 = typeof val === "number" ? val : parseFloat(String(val)) || 0;
    const cls = pct2 >= 80 ? "green" : pct2 >= 50 ? "yellow" : "red";
    return '<div class="mn-dt__cell-progress"><div class="mn-progress" style="width:64px"><div class="mn-progress__fill mn-progress__fill--' + cls + '" style="width:' + pct2 + '%"></div></div><span class="mn-dt__cell-pct">' + Math.round(pct2) + "%</span></div>";
  },
  date: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const d = new Date(String(val));
    return '<span class="mn-dt__cell-date">' + String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getFullYear()).slice(2) + "</span>";
  },
  tag: (val) => !val ? "" : '<span class="mn-tag mn-tag--light mn-tag--xs">' + escHtml(val) + "</span>",
  person: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const initials2 = String(val).split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    return '<div class="mn-dt__cell-person"><span class="mn-dt__avatar">' + initials2 + '</span><span class="mn-dt__cell-text">' + escHtml(val) + "</span></div>";
  },
  badge: (val) => {
    if (val == null) return '<span class="mn-dt__cell-text">\u2014</span>';
    const num = Number(val);
    const cls = num >= 7 ? "green" : num >= 4 ? "yellow" : "red";
    return '<span class="mn-dt__badge mn-dt__badge--' + cls + '">' + escHtml(val) + "</span>";
  },
  custom: (val, row, col) => {
    const c = col;
    if (c?.render) return String(c.render(val, row));
    return escHtml(val);
  }
};
function buildRow(row, rowIdx, opts, state, tbody) {
  const tr = el2("tr", "mn-dt__row");
  tr.setAttribute("role", "row");
  tr.setAttribute("data-row-idx", String(rowIdx));
  if (opts.selectable) {
    tr.classList.add("mn-dt__row--selectable");
    tr.setAttribute("tabindex", "0");
  }
  if (state.selected === rowIdx) tr.classList.add("mn-dt__row--selected");
  if (opts.stripedRows && rowIdx % 2 === 1) tr.classList.add("mn-dt__row--striped");
  opts.columns.forEach((col, ci) => {
    const td = el2("td", "mn-dt__td");
    td.setAttribute("role", "gridcell");
    td.setAttribute("data-col", String(ci));
    if (col.align === "right") td.style.textAlign = "right";
    if (col.align === "center") td.style.textAlign = "center";
    const renderer = cellRenderers[col.type ?? "text"] ?? cellRenderers.text;
    td.innerHTML = renderer(row[col.key], row, col);
    tr.appendChild(td);
  });
  tr.addEventListener("click", () => {
    state.selected = rowIdx;
    tbody.querySelectorAll(".mn-dt__row--selected").forEach((r) => r.classList.remove("mn-dt__row--selected"));
    tr.classList.add("mn-dt__row--selected");
    if (opts.onRowClick) opts.onRowClick(row, rowIdx);
  });
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tr.click();
    }
  });
  if (opts.crosshair) {
    tr.addEventListener("mouseenter", () => {
      const prev = tbody.querySelector(".mn-dt__row--hovered");
      if (prev) prev.classList.remove("mn-dt__row--hovered");
      tr.classList.add("mn-dt__row--hovered");
    });
  }
  return tr;
}
function buildGroupHeader(groupName, count, isExpanded, colSpan, state, renderFn) {
  const tr = el2("tr", "mn-dt__group-row");
  tr.setAttribute("role", "row");
  const td = el2("td", "mn-dt__group-cell");
  td.setAttribute("colspan", String(colSpan));
  td.setAttribute("role", "gridcell");
  const chevron = el2("span", "mn-dt__group-chevron" + (isExpanded ? " mn-dt__group-chevron--open" : ""));
  chevron.innerHTML = "\u25B8";
  const statusDot = el2("span", "mn-dt__group-dot");
  const st = STATUS_MAP[groupName.toLowerCase()];
  if (st) statusDot.classList.add("mn-dt__group-dot--" + st.cls);
  const label = el2("span", "mn-dt__group-label", { text: groupName.toUpperCase() });
  const badge = el2("span", "mn-dt__group-count", { text: String(count) });
  [chevron, statusDot, label, badge].forEach((n) => {
    td.appendChild(document.createTextNode(" "));
    td.appendChild(n);
  });
  tr.appendChild(td);
  tr.style.cursor = "pointer";
  tr.setAttribute("tabindex", "0");
  tr.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  tr.addEventListener("click", () => {
    state.expandedGroups[groupName] = !state.expandedGroups[groupName];
    renderFn();
  });
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tr.click();
    }
  });
  return tr;
}
function buildPagination(totalRows, paginationEl, pageSize, state, renderFn) {
  if (!paginationEl || pageSize <= 0) return;
  paginationEl.innerHTML = "";
  const totalPages = Math.ceil(totalRows / pageSize);
  if (totalPages <= 1) return;
  const info = el2("span", "mn-dt__page-info", { text: `Page ${state.page + 1} of ${totalPages}  \xB7  ${totalRows} rows` });
  const prevBtn = el2("button", "mn-dt__page-btn", { text: "\u2190", "aria-label": "Previous page" });
  prevBtn.disabled = state.page === 0;
  prevBtn.addEventListener("click", () => {
    if (state.page > 0) {
      state.page--;
      renderFn();
    }
  });
  const nextBtn = el2("button", "mn-dt__page-btn", { text: "\u2192", "aria-label": "Next page" });
  nextBtn.disabled = state.page >= totalPages - 1;
  nextBtn.addEventListener("click", () => {
    if (state.page < totalPages - 1) {
      state.page++;
      renderFn();
    }
  });
  paginationEl.appendChild(prevBtn);
  paginationEl.appendChild(info);
  paginationEl.appendChild(nextBtn);
}
function buildEmptyRow(emptyMessage, colSpan) {
  const tr = el2("tr", "mn-dt__empty-row");
  const td = el2("td", "mn-dt__empty-cell", { text: emptyMessage });
  td.setAttribute("colspan", String(colSpan));
  tr.appendChild(td);
  return tr;
}
function positionColHighlight(ci, headerRow, scrollWrap, colHighlightEl) {
  const ths = headerRow.querySelectorAll(".mn-dt__th");
  if (ci < 0 || ci >= ths.length) {
    colHighlightEl.style.display = "none";
    return;
  }
  const th = ths[ci];
  const scrollRect = scrollWrap.getBoundingClientRect();
  const thRect = th.getBoundingClientRect();
  colHighlightEl.style.display = "block";
  colHighlightEl.style.left = thRect.left - scrollRect.left + scrollWrap.scrollLeft + "px";
  colHighlightEl.style.width = thRect.width + "px";
  colHighlightEl.style.top = "0";
  colHighlightEl.style.height = scrollWrap.scrollHeight + "px";
}

// src/ts/data-table-logic.ts
function compare(a, b, dir) {
  if (a == null && b == null) return 0;
  if (a == null) return dir;
  if (b == null) return -dir;
  if (typeof a === "number" && typeof b === "number") return (a - b) * dir;
  return String(a).localeCompare(String(b)) * dir;
}
function matchFilter(val, query) {
  if (!query) return true;
  return String(val ?? "").toLowerCase().indexOf(query.toLowerCase()) !== -1;
}
function handleSort(key, ci, state, headerRow, renderFn, onSort) {
  if (state.sortKey === key) {
    state.sortDir = state.sortDir === 1 ? -1 : 1;
  } else {
    state.sortKey = key;
    state.sortDir = 1;
  }
  headerRow.querySelectorAll(".mn-dt__th").forEach((th, i) => {
    if (i === ci) {
      th.setAttribute("aria-sort", state.sortDir === 1 ? "ascending" : "descending");
      th.classList.add("mn-dt__th--sorted");
      th.classList.toggle("mn-dt__th--desc", state.sortDir === -1);
    } else {
      th.setAttribute("aria-sort", "none");
      th.classList.remove("mn-dt__th--sorted", "mn-dt__th--desc");
    }
  });
  if (onSort) onSort(key, state.sortDir === 1 ? "asc" : "desc");
  renderFn();
}
function handleFilter(key, val, state, renderFn, onFilter) {
  if (val) state.filters[key] = val;
  else delete state.filters[key];
  state.page = 0;
  if (onFilter) onFilter({ ...state.filters });
  renderFn();
}
function getProcessedData(state) {
  let rows = state.data.slice();
  const filterKeys = Object.keys(state.filters);
  if (filterKeys.length > 0) {
    rows = rows.filter(
      (row) => filterKeys.every((k) => matchFilter(row[k], state.filters[k]))
    );
  }
  if (state.sortKey !== null) {
    const sk = state.sortKey;
    const sd = state.sortDir;
    rows.sort((a, b) => compare(a[sk], b[sk], sd));
  }
  return rows;
}
function getGroupedData(rows, groupBy, groupOrder) {
  if (!groupBy) return null;
  const groups = {};
  const order = [];
  for (const row of rows) {
    const gv = String(row[groupBy] ?? "Other");
    if (!groups[gv]) {
      groups[gv] = [];
      order.push(gv);
    }
    groups[gv].push(row);
  }
  if (groupOrder) {
    order.sort((a, b) => {
      let ia = groupOrder.indexOf(a);
      let ib = groupOrder.indexOf(b);
      if (ia === -1) ia = 999;
      if (ib === -1) ib = 999;
      return ia - ib;
    });
  }
  return { groups, order };
}
function render2(state, opts, tbody, paginationEl) {
  tbody.innerHTML = "";
  const rows = getProcessedData(state);
  const grouped = getGroupedData(rows, opts.groupBy, opts.groupOrder);
  const colSpan = opts.columns.length;
  const renderFn = () => render2(state, opts, tbody, paginationEl);
  if (rows.length === 0) {
    tbody.appendChild(buildEmptyRow(opts.emptyMessage ?? "No data found", colSpan));
    buildPagination(0, paginationEl, opts.pageSize ?? 0, state, renderFn);
    return;
  }
  if (grouped !== null) {
    let rowIdx = 0;
    for (const gname of grouped.order) {
      const grow = grouped.groups[gname];
      const isExpanded = state.expandedGroups[gname] !== false;
      tbody.appendChild(buildGroupHeader(gname, grow.length, isExpanded, colSpan, state, renderFn));
      if (isExpanded) {
        for (const row of grow) {
          tbody.appendChild(buildRow(row, rowIdx++, opts, state, tbody));
        }
      } else {
        rowIdx += grow.length;
      }
    }
    buildPagination(rows.length, paginationEl, opts.pageSize ?? 0, state, renderFn);
  } else {
    const pageSize = opts.pageSize ?? 0;
    let start = 0;
    let end = rows.length;
    if (pageSize > 0) {
      start = state.page * pageSize;
      end = Math.min(start + pageSize, rows.length);
    }
    for (let i = start; i < end; i++) {
      tbody.appendChild(buildRow(rows[i], i, opts, state, tbody));
    }
    buildPagination(rows.length, paginationEl, pageSize, state, renderFn);
  }
  announce("Table updated: " + rows.length + " rows");
}
function announce(msg) {
  const announcer = document.getElementById("mn-announcer");
  if (announcer) announcer.textContent = msg;
}

// src/ts/data-table.ts
function dataTable(container, opts) {
  const resolved = {
    data: [],
    pageSize: 0,
    selectable: true,
    crosshair: true,
    stickyHeader: true,
    compact: false,
    emptyMessage: "No data found",
    showFilters: true,
    stripedRows: false,
    resizableColumns: false,
    ...opts
  };
  let containerEl;
  if (typeof container === "string") {
    const found = document.querySelector(container);
    if (!(found instanceof HTMLElement)) return null;
    containerEl = found;
  } else {
    containerEl = container;
  }
  const state = {
    data: (resolved.data ?? []).slice(),
    sortKey: null,
    sortDir: 1,
    filters: {},
    page: 0,
    expandedGroups: {},
    selected: null,
    colHighlight: -1
  };
  containerEl.innerHTML = "";
  containerEl.classList.add("mn-dt");
  if (resolved.compact) containerEl.classList.add("mn-dt--compact");
  if (resolved.crosshair) containerEl.classList.add("mn-dt--crosshair");
  const scrollWrap = el2("div", "mn-dt__scroll");
  const table = el2("table", "mn-dt__table");
  table.setAttribute("role", "grid");
  table.setAttribute("aria-label", resolved.ariaLabel ?? "Data table");
  const thead = el2("thead", "mn-dt__head");
  const headerRow = el2("tr", "mn-dt__header-row");
  headerRow.setAttribute("role", "row");
  const filterRow = resolved.showFilters ? el2("tr", "mn-dt__filter-row") : null;
  if (filterRow) filterRow.setAttribute("role", "row");
  const tbody = el2("tbody", "mn-dt__body");
  tbody.setAttribute("role", "rowgroup");
  function doRender() {
    render2(state, resolved, tbody, paginationEl);
  }
  resolved.columns.forEach((col, ci) => {
    const th = el2("th", "mn-dt__th");
    th.setAttribute("role", "columnheader");
    th.setAttribute("scope", "col");
    th.setAttribute("data-col", String(ci));
    if (col.width) th.style.width = typeof col.width === "number" ? col.width + "px" : String(col.width);
    if (col.minWidth) th.style.minWidth = typeof col.minWidth === "number" ? col.minWidth + "px" : String(col.minWidth);
    if (col.align === "right") th.style.textAlign = "right";
    if (col.align === "center") th.style.textAlign = "center";
    const label = el2("span", "mn-dt__th-label", { text: col.label ?? col.key });
    if (col.sortable) {
      th.classList.add("mn-dt__th--sortable");
      th.setAttribute("tabindex", "0");
      th.setAttribute("aria-sort", "none");
      th.appendChild(label);
      th.appendChild(el2("span", "mn-dt__sort-icon", { html: "\u21C5" }));
      th.addEventListener("click", () => handleSort(col.key, ci, state, headerRow, doRender, resolved.onSort));
      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSort(col.key, ci, state, headerRow, doRender, resolved.onSort);
        }
      });
    } else {
      th.appendChild(label);
    }
    headerRow.appendChild(th);
    if (filterRow) {
      const ftd = el2("th", "mn-dt__filter-cell");
      ftd.setAttribute("data-col", String(ci));
      if (col.filterable) {
        const input = el2("input", "mn-dt__filter-input");
        input.type = "text";
        input.placeholder = "Filter\u2026";
        input.setAttribute("aria-label", "Filter " + (col.label ?? col.key));
        input.addEventListener("input", () => {
          handleFilter(col.key, input.value, state, doRender, resolved.onFilter);
        });
        ftd.appendChild(input);
      }
      filterRow.appendChild(ftd);
    }
  });
  thead.appendChild(headerRow);
  if (filterRow) thead.appendChild(filterRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  scrollWrap.appendChild(table);
  containerEl.appendChild(scrollWrap);
  let paginationEl = null;
  if ((resolved.pageSize ?? 0) > 0) {
    paginationEl = el2("div", "mn-dt__pagination");
    containerEl.appendChild(paginationEl);
  }
  const colHighlightEl = el2("div", "mn-dt__col-highlight");
  colHighlightEl.style.display = "none";
  scrollWrap.appendChild(colHighlightEl);
  if (resolved.crosshair) {
    tbody.addEventListener("mousemove", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const td = target.closest("td");
      if (!td) return;
      const ci = td.cellIndex;
      if (ci !== state.colHighlight) {
        state.colHighlight = ci;
        positionColHighlight(ci, headerRow, scrollWrap, colHighlightEl);
      }
    });
    tbody.addEventListener("mouseleave", () => {
      state.colHighlight = -1;
      colHighlightEl.style.display = "none";
      const prev = tbody.querySelector(".mn-dt__row--hovered");
      if (prev) prev.classList.remove("mn-dt__row--hovered");
    });
  }
  if (resolved.groupBy) {
    for (const row of state.data) {
      const v = row[resolved.groupBy];
      if (v) state.expandedGroups[String(v)] = true;
    }
  }
  doRender();
  return {
    setData: (data) => {
      state.data = data.slice();
      state.page = 0;
      doRender();
    },
    addRow: (row) => {
      state.data.push(row);
      doRender();
    },
    removeRow: (idx) => {
      state.data.splice(idx, 1);
      doRender();
    },
    setFilter: (key, val) => handleFilter(key, val, state, doRender, resolved.onFilter),
    clearFilters: () => {
      state.filters = {};
      containerEl.querySelectorAll(".mn-dt__filter-input").forEach((inp) => {
        inp.value = "";
      });
      doRender();
    },
    setGroup: (key) => {
      resolved.groupBy = key;
      doRender();
    },
    getSelected: () => state.selected != null ? [state.data[state.selected]] : [],
    getFilteredData: () => getProcessedData(state),
    refresh: () => doRender(),
    destroy: () => {
      containerEl.innerHTML = "";
      containerEl.classList.remove("mn-dt", "mn-dt--compact", "mn-dt--crosshair");
    }
  };
}

// src/ts/date-picker.ts
var MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
var activePicker = null;
function closePicker() {
  if (activePicker) {
    activePicker.remove();
    activePicker = null;
  }
  document.removeEventListener("mousedown", onDocClick);
  document.removeEventListener("keydown", onDocKey);
}
function onDocClick(e) {
  if (activePicker && e.target instanceof Node && !activePicker.contains(e.target)) closePicker();
}
function onDocKey(e) {
  if (e.key === "Escape") closePicker();
}
function pad(n) {
  return n < 10 ? "0" + n : String(n);
}
function toDateStr(y, m, d) {
  return y + "-" + pad(m + 1) + "-" + pad(d);
}
function parseVal(s) {
  if (!s) return null;
  const p = String(s).split("-");
  return { y: Number(p[0]), m: Number(p[1]) - 1, d: Number(p[2]) || 1 };
}
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDayOfWeek(y, m) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function datePicker(anchor, opts) {
  closePicker();
  const options = opts ?? {};
  let sel = parseVal(options.value);
  let viewY = sel ? sel.y : (/* @__PURE__ */ new Date()).getFullYear();
  let viewM = sel ? sel.m : (/* @__PURE__ */ new Date()).getMonth();
  const minD = parseVal(options.min);
  const maxD = parseVal(options.max);
  const todayY = (/* @__PURE__ */ new Date()).getFullYear();
  const todayM = (/* @__PURE__ */ new Date()).getMonth();
  const todayD = (/* @__PURE__ */ new Date()).getDate();
  const picker = document.createElement("div");
  picker.className = "mn-date-picker";
  activePicker = picker;
  function isDisabled(y, m, d) {
    const ds = toDateStr(y, m, d);
    if (minD && ds < toDateStr(minD.y, minD.m, minD.d)) return true;
    if (maxD && ds > toDateStr(maxD.y, maxD.m, maxD.d)) return true;
    return false;
  }
  function renderCalendar() {
    picker.innerHTML = "";
    const nav = document.createElement("div");
    nav.className = "mn-date-picker__nav";
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "mn-date-picker__nav-btn";
    prevBtn.innerHTML = "\u25C0";
    prevBtn.title = "Previous month";
    prevBtn.addEventListener("click", () => {
      viewM--;
      if (viewM < 0) {
        viewM = 11;
        viewY--;
      }
      renderCalendar();
    });
    const title = document.createElement("span");
    title.className = "mn-date-picker__month-title";
    title.textContent = MONTHS[viewM] + " " + viewY;
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "mn-date-picker__nav-btn";
    nextBtn.innerHTML = "\u25B6";
    nextBtn.title = "Next month";
    nextBtn.addEventListener("click", () => {
      viewM++;
      if (viewM > 11) {
        viewM = 0;
        viewY++;
      }
      renderCalendar();
    });
    nav.appendChild(prevBtn);
    nav.appendChild(title);
    nav.appendChild(nextBtn);
    picker.appendChild(nav);
    const dayHeaders = document.createElement("div");
    dayHeaders.className = "mn-date-picker__days-header";
    DAYS.forEach((d) => {
      const dh = document.createElement("span");
      dh.className = "mn-date-picker__day-name";
      dh.textContent = d;
      dayHeaders.appendChild(dh);
    });
    picker.appendChild(dayHeaders);
    const grid = document.createElement("div");
    grid.className = "mn-date-picker__grid";
    const startDay = firstDayOfWeek(viewY, viewM);
    const totalDays = daysInMonth(viewY, viewM);
    for (let e = 0; e < startDay; e++) {
      const empty = document.createElement("span");
      empty.className = "mn-date-picker__day mn-date-picker__day--empty";
      grid.appendChild(empty);
    }
    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "mn-date-picker__day";
      cell.textContent = String(d);
      const disabled = isDisabled(viewY, viewM, d);
      if (disabled) cell.classList.add("mn-date-picker__day--disabled");
      cell.disabled = disabled;
      if (d === todayD && viewM === todayM && viewY === todayY) {
        cell.classList.add("mn-date-picker__day--today");
      }
      if (sel && d === sel.d && viewM === sel.m && viewY === sel.y) {
        cell.classList.add("mn-date-picker__day--selected");
      }
      const day = d;
      cell.addEventListener("click", () => {
        sel = { y: viewY, m: viewM, d: day };
        if (options.onSelect) options.onSelect(toDateStr(viewY, viewM, day));
        closePicker();
      });
      grid.appendChild(cell);
    }
    picker.appendChild(grid);
    const todayBtn = document.createElement("button");
    todayBtn.type = "button";
    todayBtn.className = "mn-date-picker__today-btn";
    todayBtn.textContent = "Today";
    todayBtn.addEventListener("click", () => {
      viewY = todayY;
      viewM = todayM;
      sel = { y: todayY, m: todayM, d: todayD };
      if (options.onSelect) options.onSelect(toDateStr(todayY, todayM, todayD));
      closePicker();
    });
    picker.appendChild(todayBtn);
  }
  renderCalendar();
  anchor.style.position = "relative";
  anchor.appendChild(picker);
  setTimeout(() => {
    const first = picker.querySelector(".mn-date-picker__day:not(.mn-date-picker__day--empty)");
    if (first instanceof HTMLElement) first.focus();
  }, 50);
  setTimeout(() => {
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onDocKey);
  }, 0);
  return { close: closePicker };
}

// src/ts/funnel-helpers.ts
function hexLum(hex) {
  let h = (hex || "#888888").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function autoTextColor(bg) {
  return hexLum(bg) > 0.35 ? "#111" : "#fff";
}
function resolveContainer(c) {
  if (typeof c === "string") return document.querySelector(c);
  return c instanceof Element ? c : null;
}
function svgEl(tag, attrs) {
  const el4 = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) el4.setAttribute(k, String(attrs[k]));
  }
  return el4;
}
function svgText(attrs, text) {
  const el4 = svgEl("text", attrs);
  el4.textContent = text;
  return el4;
}
function trapPath(x1, w1, x2, w2, y1, y2) {
  const l1 = x1, r1 = x1 + w1, l2 = x2, r2 = x2 + w2, my = (y1 + y2) / 2;
  return "M" + l1 + "," + y1 + " C" + l1 + "," + my + " " + l2 + "," + my + " " + l2 + "," + y2 + " L" + r2 + "," + y2 + " C" + r2 + "," + my + " " + r1 + "," + my + " " + r1 + "," + y1 + " Z";
}
function cumulativeReach(counts) {
  const reach = new Array(counts.length);
  let sum = 0;
  for (let i = counts.length - 1; i >= 0; i--) {
    sum += counts[i];
    reach[i] = sum;
  }
  return reach;
}

// src/ts/funnel.ts
var BAR_H = 38;
var GAP = 24;
var RAD = 6;
var VB_W = 420;
var PAD = 16;
var MIN_BAR = 0.35;
var EXIT_R = 12;
var EXIT_GAP = 6;
var PIPE_L = 80;
var PIPE_R = 340;
var PIPE_W = PIPE_R - PIPE_L;
function funnel(container, options) {
  const target = resolveContainer(container);
  if (!target) throw new Error("funnel: container not found.");
  const host = target;
  const opts = { animate: true, ...options };
  let destroyed = false;
  const root = document.createElement("div");
  root.className = "mn-funnel";
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", "Pipeline funnel");
  function render3(data) {
    if (destroyed) return;
    root.innerHTML = "";
    if (!data || !data.pipeline || !data.pipeline.length) {
      root.innerHTML = '<p class="mn-funnel__empty">No pipeline stages available.</p>';
      return;
    }
    const pipe = data.pipeline;
    const maxC = Math.max(...pipe.map((s) => s.count || 1));
    const total = data.total || pipe.reduce((a, s) => a + s.count, 0);
    const reach = cumulativeReach(pipe.map((s) => s.count));
    const rows = pipe.length;
    const svgH = PAD * 2 + rows * BAR_H + (rows - 1) * GAP;
    const svg = svgEl("svg", { viewBox: "0 0 " + VB_W + " " + svgH, preserveAspectRatio: "xMidYMid meet" });
    svg.style.width = "100%";
    svg.style.height = "auto";
    pipe.forEach((stage, i) => {
      const barW = Math.max(PIPE_W * MIN_BAR, stage.count / maxC * PIPE_W);
      const barX = PIPE_L + (PIPE_W - barW) / 2;
      const y = PAD + i * (BAR_H + GAP);
      if (i < rows - 1) {
        const ns = pipe[i + 1];
        const nW = Math.max(PIPE_W * MIN_BAR, ns.count / maxC * PIPE_W);
        const nX = PIPE_L + (PIPE_W - nW) / 2;
        svg.appendChild(svgEl("path", { d: trapPath(barX, barW, nX, nW, y + BAR_H, y + BAR_H + GAP), fill: stage.color, opacity: "0.12" }));
        const rate = reach[i] > 0 ? Math.round(reach[i + 1] / reach[i] * 100) : 0;
        svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + BAR_H + GAP / 2 + 1, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": 9, "font-family": "'Barlow Condensed',sans-serif", fill: "var(--grigio-medio,#777)", "font-weight": "500" }, "\u2193 " + rate + "%"));
      }
      const bar = svgEl("rect", { x: barX, y, width: barW, height: BAR_H, rx: RAD, fill: stage.color });
      bar.classList.add("mn-funnel__bar");
      bar.setAttribute("data-stage", stage.label);
      if (opts.animate) {
        bar.style.opacity = "0";
        bar.style.transform = "translateX(-12px)";
      }
      svg.appendChild(bar);
      const tc = autoTextColor(stage.color);
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + 14, "text-anchor": "middle", "font-size": 11, "font-family": "'Inter',sans-serif", fill: tc, "font-weight": "600" }, stage.label));
      let cTxt = String(stage.count);
      if (total > 0) cTxt += " (" + Math.round(stage.count / total * 100) + "%)";
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + 29, "text-anchor": "middle", "font-size": 14, "font-family": "'Barlow Condensed',sans-serif", fill: tc, "font-weight": "700" }, cTxt));
      if (stage.holdCount && stage.holdCount > 0) renderExitPill(svg, barX, y, "left", stage.holdCount, data.onHold?.color || "#ea580c", "\u23F8");
      if (stage.withdrawnCount && stage.withdrawnCount > 0) renderExitPill(svg, barX + barW, y, "right", stage.withdrawnCount, data.withdrawn?.color || "#666", "\u2715");
      if (opts.onClick) {
        const hit = svgEl("rect", { x: barX, y, width: barW, height: BAR_H, fill: "transparent", cursor: "pointer" });
        hit.addEventListener("click", () => {
          if (opts.onClick) opts.onClick(stage);
        });
        svg.appendChild(hit);
      }
      if (opts.animate) {
        setTimeout(() => {
          bar.style.transition = "opacity 0.35s ease, transform 0.35s ease";
          bar.style.opacity = "1";
          bar.style.transform = "none";
        }, 60 * i + 30);
      }
    });
    const legendY = svgH - 4;
    if (data.onHold && data.onHold.count > 0) {
      svg.appendChild(svgEl("circle", { cx: PIPE_L, cy: legendY, r: 4, fill: data.onHold.color, opacity: "0.8" }));
      svg.appendChild(svgText({ x: PIPE_L + 8, y: legendY + 3, "font-size": 9, "font-family": "'Inter',sans-serif", fill: "var(--grigio-medio,#999)", "font-weight": "500" }, "\u23F8 On Hold: " + data.onHold.count));
    }
    if (data.withdrawn && data.withdrawn.count > 0) {
      svg.appendChild(svgEl("circle", { cx: PIPE_L + PIPE_W / 2 + 20, cy: legendY, r: 4, fill: data.withdrawn.color, opacity: "0.8" }));
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2 + 28, y: legendY + 3, "font-size": 9, "font-family": "'Inter',sans-serif", fill: "var(--grigio-medio,#999)", "font-weight": "500" }, "\u2715 Withdrawn: " + data.withdrawn.count));
    }
    root.appendChild(svg);
  }
  function renderExitPill(svg, anchorX, barY, side, count, color, icon) {
    const isLeft = side === "left";
    const cy = barY + BAR_H / 2;
    const pillX = isLeft ? anchorX - EXIT_GAP - EXIT_R * 2 - 20 : anchorX + EXIT_GAP;
    const lineEnd = isLeft ? pillX + EXIT_R * 2 + 20 : pillX;
    svg.appendChild(svgEl("line", { x1: anchorX, y1: cy, x2: lineEnd, y2: cy, stroke: color, "stroke-width": "1.5", "stroke-dasharray": "3 2", opacity: "0.5" }));
    const pw = EXIT_R * 2 + 20, ph = 20;
    svg.appendChild(svgEl("rect", { x: pillX, y: cy - ph / 2, width: pw, height: ph, rx: ph / 2, fill: color, opacity: "0.18" }));
    svg.appendChild(svgText({ x: pillX + pw / 2, y: cy + 3.5, "text-anchor": "middle", "font-size": 10, "font-family": "'Barlow Condensed',sans-serif", fill: color, "font-weight": "600" }, icon + " " + count));
  }
  host.innerHTML = "";
  host.appendChild(root);
  render3(opts.data);
  return {
    update: (d) => {
      render3(d);
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      root.innerHTML = "";
      if (root.parentNode === host) host.removeChild(root);
    }
  };
}

// src/ts/okr-panel-utils.ts
var STATUS_COLORS2 = {
  "on-track": cssVar("--signal-ok", "#00A651"),
  "at-risk": cssVar("--signal-warning", "#FFC72C"),
  behind: cssVar("--signal-danger", "#DC0000")
};
var SCOPE_COLORS = {
  LOCAL: cssVar("--scope-local", "#4EA8DE"),
  TEAM: cssVar("--scope-team", "#7C3AED"),
  GLOBAL: cssVar("--scope-global", "#FFC72C")
};
function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pct(current, target) {
  const c = safeNumber(current), t = safeNumber(target);
  return t <= 0 ? 0 : clamp(c / t * 100, 0, 100);
}
function statusFromProgress(p) {
  const v = safeNumber(p);
  return v >= 75 ? "on-track" : v >= 40 ? "at-risk" : "behind";
}
function statusLabel(s) {
  return s === "on-track" ? "ON TRACK" : s === "at-risk" ? "AT RISK" : "BEHIND";
}
function formatKR(current, target, unit) {
  return String(current) + "/" + String(target) + (unit || "");
}
function el3(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) Object.keys(attrs).forEach((key) => {
    if (key === "text") node.textContent = attrs[key];
    else if (key === "html") node.innerHTML = attrs[key];
    else node.setAttribute(key, attrs[key]);
  });
  return node;
}
function describeArc(cx, cy, r, sa, ea) {
  const x1 = cx + Math.cos(sa) * r, y1 = cy + Math.sin(sa) * r;
  const x2 = cx + Math.cos(ea) * r, y2 = cy + Math.sin(ea) * r;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${ea - sa > Math.PI ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}
function ringTemplate(size, stroke, percent, color, centerText, trackClass, progressClass) {
  const radius = (size - stroke) / 2, cx = size / 2;
  const circ = 2 * Math.PI * radius;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const off2 = circ - bounded / 100 * circ;
  let svg = `<svg class="mn-okr__ring" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="${trackClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}"></circle><circle class="${progressClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}" stroke="${color}" data-circumference="${circ.toFixed(2)}" data-target-offset="${off2.toFixed(2)}" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${circ.toFixed(2)}"></circle>`;
  if (centerText != null) svg += `<text class="mn-okr__ring-text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${centerText}</text>`;
  return svg + "</svg>";
}
function heroGaugeSVG(percent, color) {
  const w = 240, h = 140, cx = w / 2, cy = h - 10, r = 100;
  const startAngle = Math.PI;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const needleAngle = startAngle + bounded / 100 * Math.PI;
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const a = startAngle + i / 10 * Math.PI;
    const isMajor = i % 2 === 0, len = isMajor ? 14 : 8;
    const x1 = cx + Math.cos(a) * (r - len), y1 = cy + Math.sin(a) * (r - len);
    const x2 = cx + Math.cos(a) * r, y2 = cy + Math.sin(a) * r;
    ticks.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${isMajor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}" stroke-width="${isMajor ? 2 : 1}"/>`);
    if (isMajor) {
      const lx = cx + Math.cos(a) * (r - 22), ly = cy + Math.sin(a) * (r - 22);
      ticks.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.45)" font-size="9" font-family="var(--font-mono)">${i * 10}</text>`);
    }
  }
  const trackPath = describeArc(cx, cy, r, startAngle, 2 * Math.PI);
  const progressEnd = startAngle + bounded / 100 * Math.PI;
  const progressPath = describeArc(cx, cy, r, startAngle, progressEnd);
  const nx = cx + Math.cos(needleAngle) * (r - 28), ny = cy + Math.sin(needleAngle) * (r - 28);
  return `<svg class="mn-okr__gauge" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><filter id="okr-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="${trackPath}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8" stroke-linecap="round"/><path class="mn-okr__gauge-progress" d="${progressPath}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" filter="url(#okr-glow)" stroke-dasharray="${(Math.PI * r).toFixed(1)}" stroke-dashoffset="${(Math.PI * r).toFixed(1)}" data-target="0"/>` + ticks.join("") + `<line class="mn-okr__needle" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" filter="url(#okr-glow)" data-cx="${cx}" data-cy="${cy}" data-r="${r - 28}" data-target-angle="${needleAngle.toFixed(4)}"/><circle cx="${cx}" cy="${cy}" r="5" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#111"/></svg>`;
}
function animateRings(container) {
  const rings = Array.from(container.querySelectorAll(".mn-okr__ring-progress"));
  if (!rings.length) return;
  requestAnimationFrame(() => {
    rings.forEach((ring) => {
      ring.style.strokeDashoffset = String(safeNumber(ring.getAttribute("data-target-offset")));
    });
  });
}
function animateSummaryRings(container) {
  const rings = Array.from(container.querySelectorAll(".mn-okr__summary-ring"));
  if (!rings.length) return;
  requestAnimationFrame(() => {
    rings.forEach((ring) => {
      ring.style.strokeDashoffset = String(safeNumber(ring.getAttribute("data-target")));
    });
  });
}
function animateBars(container) {
  const bars = Array.from(container.querySelectorAll(".mn-okr__kr-bar"));
  if (!bars.length) return;
  requestAnimationFrame(() => {
    bars.forEach((bar) => {
      bar.style.width = clamp(safeNumber(bar.dataset.target), 0, 100) + "%";
    });
  });
}
function animateGauge(container) {
  const progress = container.querySelector(".mn-okr__gauge-progress");
  const needle = container.querySelector(".mn-okr__needle");
  if (!progress) return;
  requestAnimationFrame(() => {
    progress.style.strokeDashoffset = "0";
    progress.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.2, 1, 0.2, 1)";
    if (!needle) return;
    const ncx = parseFloat(needle.getAttribute("data-cx") || "0");
    const ncy = parseFloat(needle.getAttribute("data-cy") || "0");
    const nr = parseFloat(needle.getAttribute("data-r") || "0");
    const targetAngle = parseFloat(needle.getAttribute("data-target-angle") || String(Math.PI));
    const sa = Math.PI;
    needle.setAttribute("x2", (ncx + Math.cos(sa) * nr).toFixed(1));
    needle.setAttribute("y2", (ncy + Math.sin(sa) * nr).toFixed(1));
    let start = null;
    const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      const a = sa + (1 - Math.pow(1 - t, 3)) * (targetAngle - sa);
      needle.setAttribute("x2", (ncx + Math.cos(a) * nr).toFixed(1));
      needle.setAttribute("y2", (ncy + Math.sin(a) * nr).toFixed(1));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// src/ts/okr-panel-cards.ts
function normalizeObjective(item) {
  const obj = item || {};
  const progress = clamp(safeNumber(obj.progress), 0, 100);
  const status = obj.status || statusFromProgress(progress);
  const keyResults = Array.isArray(obj.keyResults) ? obj.keyResults : [];
  return {
    title: obj.title || "Untitled objective",
    scope: obj.scope || "LOCAL",
    progress,
    status,
    keyResults
  };
}
function calculateStats(objectives) {
  const counts = { "on-track": 0, "at-risk": 0, behind: 0 };
  let total = 0;
  objectives.forEach((o) => {
    counts[statusFromProgress(o.progress)] += 1;
    total += o.progress;
  });
  const average = objectives.length ? total / objectives.length : 0;
  return { counts, average: clamp(average, 0, 100) };
}
function createSummaryCard(status, count, description, total) {
  const color = STATUS_COLORS2[status] || "#00A651";
  const p = total > 0 ? count / total * 100 : 0;
  const card = el3("div", `mn-okr__summary-card mn-okr__summary-card--${status}`);
  const arcWrap = el3("div", "mn-okr__summary-arc");
  const sz = 64, sw = 5, r = (sz - sw) / 2, cx = sz / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - p / 100 * circ;
  arcWrap.innerHTML = `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/><circle class="mn-okr__summary-ring" cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${circ.toFixed(1)}" data-target="${offset.toFixed(1)}" transform="rotate(-90,${cx},${cx})" style="filter:drop-shadow(0 0 6px ${color}40);transition:stroke-dashoffset 900ms cubic-bezier(0.2,1,0.2,1)"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-family="var(--font-mono)" font-size="18" font-weight="700">${count}</text></svg>`;
  const info = el3("div", "mn-okr__summary-info");
  const head = el3("div", "mn-okr__summary-head");
  head.appendChild(el3("span", `mn-okr__status-dot mn-okr__status-dot--${status}`));
  head.appendChild(el3("span", "mn-okr__summary-label", { text: statusLabel(status) }));
  info.appendChild(head);
  info.appendChild(el3("div", "mn-okr__summary-threshold", { text: description }));
  card.appendChild(arcWrap);
  card.appendChild(info);
  return card;
}
function createHero(stats, period) {
  const status = statusFromProgress(stats.average);
  const color = STATUS_COLORS2[status];
  const section = el3("section", "mn-okr__hero");
  const gaugeBlock = el3("div", "mn-okr__gauge-wrap");
  gaugeBlock.innerHTML = heroGaugeSVG(stats.average, color);
  const gaugeValue = el3("div", "mn-okr__gauge-value", { text: Math.round(stats.average) + "%" });
  gaugeValue.style.color = color;
  gaugeBlock.appendChild(gaugeValue);
  const avgBlock = el3("div", "mn-okr__average");
  avgBlock.appendChild(el3("div", "mn-okr__average-label", { text: "Average completion" }));
  const avgVal = el3("div", "mn-okr__average-value", { text: Math.round(stats.average) + "%" });
  avgVal.style.color = color;
  avgBlock.appendChild(avgVal);
  const badge = el3("div", `mn-okr__status-badge mn-okr__status-badge--${status}`, { text: statusLabel(status) });
  badge.style.setProperty("--badge-color", color);
  avgBlock.appendChild(badge);
  avgBlock.appendChild(el3("span", "mn-okr__period-tag", { text: period || "Current period" }));
  section.appendChild(gaugeBlock);
  section.appendChild(avgBlock);
  return section;
}
function createKRRow(kr, objectiveStatus) {
  const current = safeNumber(kr.current), target = safeNumber(kr.target);
  const completion = pct(current, target);
  const status = statusFromProgress(completion);
  const row = el3("li", "mn-okr__kr");
  const top = el3("div", "mn-okr__kr-head");
  top.appendChild(el3("span", "mn-okr__kr-title", { text: kr.title || "Untitled KR" }));
  top.appendChild(el3("span", "mn-okr__kr-metric", { text: formatKR(current, target, kr.unit || "") }));
  const track = el3("div", "mn-okr__kr-track");
  const bar = el3("div", `mn-okr__kr-bar mn-okr__kr-bar--${status}`);
  bar.dataset.target = completion.toFixed(2);
  bar.style.width = "0%";
  track.appendChild(bar);
  row.appendChild(top);
  row.appendChild(track);
  if (objectiveStatus === "behind") row.classList.add("mn-okr__kr--urgent");
  return row;
}
function createObjectiveCard(objective, index) {
  const scopeColor = SCOPE_COLORS[objective.scope] || (getComputedStyle(document.documentElement).getPropertyValue("--scope-local").trim() || "#4EA8DE");
  const status = objective.status in STATUS_COLORS2 ? objective.status : statusFromProgress(objective.progress);
  const card = el3("article", `mn-okr__objective mn-okr__objective--${status}`, {
    role: "article",
    "aria-label": `${objective.title} status ${status.replace("-", " ")}`
  });
  card.style.setProperty("--mn-okr-scope", scopeColor);
  card.style.setProperty("--mn-okr-status", STATUS_COLORS2[status]);
  card.style.animationDelay = index * 45 + "ms";
  const header = el3("div", "mn-okr__objective-header");
  const left = el3("div", "mn-okr__objective-main");
  left.appendChild(el3("span", "mn-okr__scope-badge", { text: objective.scope }));
  left.appendChild(el3("h3", "mn-okr__objective-title", { text: objective.title }));
  const right = el3("div", "mn-okr__objective-ring-wrap");
  right.innerHTML = ringTemplate(
    56,
    6,
    objective.progress,
    STATUS_COLORS2[status],
    Math.round(objective.progress) + "%",
    "mn-okr__ring-track",
    "mn-okr__ring-progress"
  );
  header.appendChild(left);
  header.appendChild(right);
  const krList = el3("ul", "mn-okr__kr-list");
  objective.keyResults.forEach((kr) => krList.appendChild(createKRRow(kr, status)));
  card.appendChild(header);
  card.appendChild(krList);
  return card;
}

// src/ts/okr-panel.ts
function okrPanel(container, opts) {
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) return null;
  const el_host = host;
  const title = opts?.title ?? "OKR Dashboard";
  const period = opts?.period ?? "";
  let objectives = (opts?.objectives ?? []).map(normalizeObjective);
  function render3() {
    el_host.innerHTML = "";
    const root = el3("div", "mn-okr");
    const header = el3("div", "mn-okr__header");
    header.appendChild(el3("h2", "mn-okr__title", { text: title }));
    root.appendChild(header);
    const stats = calculateStats(objectives);
    root.appendChild(createHero(stats, period));
    const summaryRow = el3("div", "mn-okr__summary-row");
    const total = objectives.length;
    const descriptions = {
      "on-track": "\u2265 75% progress",
      "at-risk": "40-74% progress",
      behind: "< 40% progress"
    };
    ["on-track", "at-risk", "behind"].forEach((s) => {
      summaryRow.appendChild(createSummaryCard(s, stats.counts[s], descriptions[s], total));
    });
    root.appendChild(summaryRow);
    const grid = el3("div", "mn-okr__grid");
    objectives.forEach((obj, i) => grid.appendChild(createObjectiveCard(obj, i)));
    root.appendChild(grid);
    el_host.appendChild(root);
    requestAnimationFrame(() => {
      animateRings(root);
      animateSummaryRings(root);
      animateBars(root);
      animateGauge(root);
    });
  }
  render3();
  return {
    update(newObjectives) {
      objectives = newObjectives.map(normalizeObjective);
      render3();
    },
    destroy() {
      el_host.innerHTML = "";
    }
  };
}

// src/ts/observers.ts
function initGauges(opts) {
  const selector = opts?.selector ?? ".mn-gauge__canvas";
  const threshold = opts?.threshold ?? 0.2;
  const instances = [];
  document.querySelectorAll(selector).forEach((canvas) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gauge = new FerrariGauge(canvas);
            instances.push(gauge);
            obs.unobserve(canvas);
          }
        });
      },
      { threshold }
    );
    obs.observe(canvas);
  });
  return instances;
}
function initScrollReveal(opts) {
  const selector = opts?.selector ?? ".mn-reveal";
  const threshold = opts?.threshold ?? 0.1;
  const rootMargin = opts?.rootMargin ?? "0px 0px -50px 0px";
  const visibleClass = opts?.visibleClass ?? "mn-reveal--visible";
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
        }
      });
    },
    { threshold, rootMargin }
  );
  document.querySelectorAll(selector).forEach((el4) => observer.observe(el4));
}
function initNavTracking(opts) {
  const sectionSelector = opts?.sectionSelector ?? "section[id]";
  const linkSelector = opts?.linkSelector ?? ".mn-nav__link";
  const offsetPx = opts?.offsetPx ?? 100;
  const activeClass = opts?.activeClass ?? "mn-nav__link--active";
  const sections = document.querySelectorAll(sectionSelector);
  const navLinks = document.querySelectorAll(linkSelector);
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offsetPx) {
        current = section.getAttribute("id") ?? "";
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        activeClass,
        link.getAttribute("href") === `#${current}`
      );
    });
  });
}
function linearize(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relativeLuminance(bgColor) {
  const matches = bgColor.match(/\d+/g);
  if (!matches || matches.length < 3) return null;
  const r = linearize(parseInt(matches[0], 10) / 255);
  const g = linearize(parseInt(matches[1], 10) / 255);
  const b = linearize(parseInt(matches[2], 10) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function autoContrast(selector, threshold = 0.35) {
  document.querySelectorAll(selector).forEach((el4) => {
    const bg = getComputedStyle(el4).backgroundColor;
    const lum = relativeLuminance(bg);
    if (lum === null) return;
    if (el4 instanceof HTMLElement) {
      el4.style.color = lum > threshold ? "#111" : "rgba(255,255,255,0.95)";
      el4.style.textShadow = lum > threshold ? "none" : "0 1px 3px rgba(0,0,0,0.5)";
    }
  });
}

// src/ts/gauge-engine-class.ts
var GAUGE_SIZES = {
  sm: 120,
  md: 220,
  lg: 320
};
function resolveCanvas(target) {
  if (typeof target === "string") {
    const el4 = document.querySelector(target);
    return el4 instanceof HTMLCanvasElement ? el4 : null;
  }
  return target instanceof HTMLCanvasElement ? target : null;
}
function createGauge(opts) {
  const canvas = resolveCanvas(opts.target);
  if (!canvas) return null;
  if (opts.config) {
    canvas.dataset.gauge = JSON.stringify(opts.config);
  }
  if (opts.size) {
    canvas.dataset.size = opts.size;
  }
  return new FerrariGauge(canvas);
}
function createGaugesInContainer(container = document.body, selector = ".mn-gauge__canvas") {
  const root = typeof container === "string" ? document.querySelector(container) : container;
  if (!root) return [];
  const entries = [];
  root.querySelectorAll(selector).forEach((canvas) => {
    const gauge = new FerrariGauge(canvas);
    entries.push({ gauge, canvas });
  });
  return entries;
}
function redrawAll(entries) {
  for (const entry of entries) {
    entry.gauge.redraw();
  }
}
function reinitAll(entries) {
  for (const entry of entries) {
    entry.gauge.init();
  }
}

// src/ts/speedometer-palette.ts
var SPEEDO_FONT = "'Barlow Condensed', 'Outfit', sans-serif";
var SPEEDO_SIZES = { sm: 120, md: 220, lg: 320 };
var SWEEP = Math.PI * 1.5;
var START = Math.PI * 0.75;
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function valueToAngle(v, max) {
  return START + Math.min(Math.max(v, 0), max) / max * SWEEP;
}
function speedoPalette() {
  const cl = document.body.classList;
  const isCB = cl.contains("mn-colorblind");
  const isNero = cl.contains("mn-nero");
  const D = {
    needle: null,
    arc: null,
    barStops: null,
    bg: ["#0d0d0d", "#1a1a1a", "#2c2c2c"],
    border: "#3a3a3a",
    minorTick: "#444",
    majStroke: "#aaa",
    majText: "#c8c8c8",
    capFill: "#2a2a2a",
    capStroke: "#555",
    value: "#fafafa",
    unit: "#888",
    subLabel: "#666",
    barBg: "#1a1a1a",
    barDim: "#666",
    barBright: "#aaa"
  };
  if (isCB) {
    return {
      ...D,
      needle: "#4D9DE0",
      arc: "#7EC8E3",
      barStops: ["#E15759", "#EDC948", "#59A14F"]
    };
  }
  if (isNero) {
    return {
      ...D,
      bg: ["#050505", "#111", "#1a1a1a"],
      border: "#2a2a2a",
      minorTick: "#333",
      capFill: "#1a1a1a",
      capStroke: "#444",
      barBg: "#111"
    };
  }
  return D;
}

// src/ts/speedometer-draw.ts
function drawSpeedometer(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, opts) {
  const p = speedoPalette();
  const needleCol = p.needle || opts.needleColor;
  const arcCol = p.arc || opts.arcColor;
  ctx.save();
  ctx.clearRect(0, 0, dim, dim);
  drawBackground(ctx, cx, cy, R, s, p);
  drawArc(ctx, cx, cy, R, s, curVal, arcCol, opts);
  drawTicks(ctx, cx, cy, R, s, p, opts);
  drawMajorTicks(ctx, cx, cy, R, s, p, opts);
  drawNeedle(ctx, cx, cy, R, s, curAngle, needleCol);
  drawCenterCap(ctx, cx, cy, s, p);
  drawValueText(ctx, cx, cy, s, curVal, p, opts);
  if (opts.bar) drawBarIndicator(ctx, cx, cy, R, s, barVal, p, opts.bar);
  ctx.restore();
}
function drawBackground(ctx, cx, cy, R, s, p) {
  const bg = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
  bg.addColorStop(0, p.bg[0]);
  bg.addColorStop(0.82, p.bg[1]);
  bg.addColorStop(1, p.bg[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
}
function drawArc(ctx, cx, cy, R, s, curVal, arcCol, opts) {
  const aEnd = opts.arcEnd != null ? opts.arcEnd : curVal;
  if (aEnd <= opts.arcStart) return;
  ctx.beginPath();
  ctx.arc(
    cx,
    cy,
    R * 1.03,
    valueToAngle(opts.arcStart, opts.max),
    valueToAngle(aEnd, opts.max)
  );
  ctx.strokeStyle = arcCol;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineCap = "butt";
}
function drawTicks(ctx, cx, cy, R, s, p, opts) {
  const tOut = R * 0.95;
  const minL = 6 * s;
  const segs = opts.ticks.length - 1;
  const totalMinor = segs * (opts.minorTicks + 1);
  ctx.strokeStyle = p.minorTick;
  ctx.lineWidth = 1 * s;
  for (let i = 0; i <= totalMinor; i++) {
    const mv = i / totalMinor * opts.max;
    if (opts.ticks.indexOf(Math.round(mv)) !== -1) continue;
    const ma = valueToAngle(mv, opts.max);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ma) * tOut, cy + Math.sin(ma) * tOut);
    ctx.lineTo(cx + Math.cos(ma) * (tOut - minL), cy + Math.sin(ma) * (tOut - minL));
    ctx.stroke();
  }
}
function drawMajorTicks(ctx, cx, cy, R, s, p, opts) {
  const tOut = R * 0.95;
  const majL = 12 * s;
  ctx.strokeStyle = p.majStroke;
  ctx.lineWidth = 2.5 * s;
  ctx.fillStyle = p.majText;
  ctx.font = "bold " + Math.round(11 * s) + "px " + SPEEDO_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const tv of opts.ticks) {
    const ta = valueToAngle(tv, opts.max);
    const c1 = Math.cos(ta), s1 = Math.sin(ta);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * tOut, cy + s1 * tOut);
    ctx.lineTo(cx + c1 * (tOut - majL), cy + s1 * (tOut - majL));
    ctx.stroke();
    ctx.fillText(
      String(tv),
      cx + c1 * (tOut - majL - 10 * s),
      cy + s1 * (tOut - majL - 10 * s)
    );
  }
}
function drawNeedle(ctx, cx, cy, R, s, curAngle, needleCol) {
  const nLen = R * 0.78, nTail = R * 0.18, nW = 4 * s;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(curAngle);
  ctx.beginPath();
  ctx.moveTo(nLen, 0);
  ctx.lineTo(-nTail, -nW);
  ctx.lineTo(-nTail, nW);
  ctx.closePath();
  ctx.fillStyle = needleCol;
  ctx.shadowColor = needleCol;
  ctx.shadowBlur = 8 * s;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}
function drawCenterCap(ctx, cx, cy, s, p) {
  ctx.beginPath();
  ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
  ctx.fillStyle = p.capFill;
  ctx.fill();
  ctx.strokeStyle = p.capStroke;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
}
function drawValueText(ctx, cx, cy, s, curVal, p, opts) {
  ctx.fillStyle = p.value;
  ctx.font = "bold " + Math.round(32 * s) + "px " + SPEEDO_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.round(curVal)), cx, cy + 20 * s);
  ctx.fillStyle = p.unit;
  ctx.font = Math.round(11 * s) + "px " + SPEEDO_FONT;
  ctx.fillText(opts.unit, cx, cy + 37 * s);
  if (opts.subLabel) {
    ctx.fillStyle = p.subLabel;
    ctx.font = Math.round(9 * s) + "px " + SPEEDO_FONT;
    ctx.fillText(opts.subLabel, cx, cy + 50 * s);
  }
}
function drawBarIndicator(ctx, cx, cy, R, s, barVal, p, bar) {
  const bW = R * 1.2, bH = 6 * s, bR = bH / 2;
  const bX = cx - bW / 2, bY = cy + R * 0.72;
  const stops = p.barStops || bar.colorStops || [
    cssVar("--signal-danger", "#DC0000"),
    cssVar("--signal-warning", "#FFC72C"),
    cssVar("--signal-ok", "#00A651")
  ];
  ctx.beginPath();
  ctx.roundRect?.(bX, bY, bW, bH, bR);
  ctx.fillStyle = p.barBg;
  ctx.fill();
  const fW = bW * Math.max(0, Math.min(1, barVal));
  if (fW > 1) {
    const gr = ctx.createLinearGradient(bX, 0, bX + bW, 0);
    stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
    ctx.save();
    ctx.beginPath();
    ctx.roundRect?.(bX, bY, fW, bH, bR);
    ctx.clip();
    ctx.fillStyle = gr;
    ctx.fillRect(bX, bY, bW, bH);
    ctx.restore();
  }
  ctx.font = Math.round(8 * s) + "px " + SPEEDO_FONT;
  ctx.textBaseline = "top";
  const lY = bY + bH + 3 * s;
  if (bar.labelLeft) {
    ctx.fillStyle = p.barDim;
    ctx.textAlign = "left";
    ctx.fillText(bar.labelLeft, bX, lY);
  }
  if (bar.labelRight) {
    ctx.fillStyle = p.barDim;
    ctx.textAlign = "right";
    ctx.fillText(bar.labelRight, bX + bW, lY);
  }
  if (bar.label) {
    ctx.fillStyle = p.barBright;
    ctx.textAlign = "center";
    ctx.fillText(bar.label, cx, lY);
  }
}

// src/ts/h-bar-chart-draw.ts
function hexLum2(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function createEl(tag, cls, text) {
  const el4 = document.createElement(tag);
  if (cls) el4.className = cls;
  if (text != null) el4.textContent = text;
  return el4;
}
function clampVal(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function normalizeHex(color) {
  if (typeof color !== "string") return cssVar("--chart-bar", "#4EA8DE");
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return cssVar("--chart-bar", "#4EA8DE");
}
function buildTicks(maxValue) {
  const ticks = [];
  const step = maxValue / 4;
  for (let i = 0; i <= 4; i++) ticks.push(Math.round(step * i * 100) / 100);
  return ticks;
}
function cleanupTimers(state) {
  while (state.timers.length) {
    const t = state.timers.pop();
    if (t != null) window.clearTimeout(t);
  }
}
function addListener(state, el4, evt, handler) {
  el4.addEventListener(evt, handler);
  state.listeners.push({ el: el4, evt, handler });
}
function showTip(tooltip, frame, text, evt) {
  tooltip.textContent = text;
  tooltip.classList.add("is-visible");
  const rect = frame.getBoundingClientRect();
  let x = evt.clientX - rect.left + 12;
  let y = evt.clientY - rect.top - 30;
  if (x > rect.width - 140) x = rect.width - 140;
  if (y < 6) y = evt.clientY - rect.top + 14;
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}
function hideTip(tooltip) {
  tooltip.classList.remove("is-visible");
}
function normalizeBars(bars, sortDescending) {
  const result = bars.map((bar, idx) => ({
    label: bar?.label != null ? String(bar.label) : "Item " + (idx + 1),
    value: Number(bar?.value ?? 0),
    color: normalizeHex(bar?.color)
  }));
  if (sortDescending) result.sort((a, b) => b.value - a.value);
  return result;
}
function renderHBar(ctx) {
  const { state } = ctx;
  if (state.disposed) return;
  cleanupTimers(state);
  ctx.rowsLayer.innerHTML = "";
  ctx.gridLayer.innerHTML = "";
  ctx.axisLabels.innerHTML = "";
  let maxValue = Number(state.opts.maxValue) || 100;
  if (maxValue <= 0) maxValue = 100;
  const bars = normalizeBars(state.opts.bars || [], !!state.opts.sortDescending);
  const ticks = buildTicks(maxValue);
  ctx.titleEl.style.display = state.opts.title ? "" : "none";
  ctx.titleEl.textContent = state.opts.title || "";
  ctx.root.setAttribute("role", "img");
  ctx.root.setAttribute("aria-label", state.opts.title || "Horizontal bar chart");
  ctx.frame.style.setProperty(
    "--mn-hbar-bar-height",
    (state.opts.barHeight || 28) + "px"
  );
  renderGrid(ctx, ticks, maxValue);
  renderAxis(ctx, ticks, maxValue);
  renderRows(ctx, bars, maxValue);
}
function renderGrid(ctx, ticks, maxValue) {
  if (!ctx.state.opts.showGrid) return;
  ticks.forEach((tick) => {
    const line = createEl("div", "mn-hbar__grid-line");
    line.style.left = tick / maxValue * 100 + "%";
    ctx.gridLayer.appendChild(line);
  });
}
function renderAxis(ctx, ticks, maxValue) {
  const unit = ctx.state.opts.unit || "";
  ticks.forEach((tick) => {
    const aLabel = createEl("div", "mn-hbar__axis-label", tick + unit);
    aLabel.style.left = tick / maxValue * 100 + "%";
    ctx.axisLabels.appendChild(aLabel);
  });
}
function renderRows(ctx, bars, maxValue) {
  const { state } = ctx;
  bars.forEach((bar, index) => {
    const row = createEl("div", "mn-hbar__row");
    const label = createEl("div", "mn-hbar__label", bar.label);
    const track = createEl("div", "mn-hbar__track");
    const fill = createEl("div", "mn-hbar__fill");
    const valueEl = createEl("div", "mn-hbar__value");
    const pct2 = clampVal(bar.value / maxValue * 100, 0, 100);
    const txtColor = hexLum2(bar.color) > 0.55 ? "#111111" : "#FFFFFF";
    fill.style.background = bar.color;
    fill.style.height = (state.opts.barHeight || 28) + "px";
    fill.style.width = state.opts.animate ? "0%" : pct2 + "%";
    valueEl.style.color = txtColor;
    valueEl.textContent = bar.value + (state.opts.unit || "");
    valueEl.style.display = state.opts.showValues ? "" : "none";
    fill.appendChild(valueEl);
    track.appendChild(fill);
    row.appendChild(label);
    row.appendChild(track);
    ctx.rowsLayer.appendChild(row);
    const tipText = bar.label + ": " + bar.value + (state.opts.unit || "");
    addListener(
      state,
      row,
      "mouseenter",
      (evt) => showTip(ctx.tooltip, ctx.frame, tipText, evt)
    );
    addListener(
      state,
      row,
      "mousemove",
      (evt) => showTip(ctx.tooltip, ctx.frame, tipText, evt)
    );
    addListener(state, row, "mouseleave", () => hideTip(ctx.tooltip));
    addListener(state, row, "click", () => {
      const prev = ctx.rowsLayer.querySelector(".mn-hbar__row.is-active");
      if (prev) prev.classList.remove("is-active");
      row.classList.add("is-active");
      state.activeIndex = index;
      if (typeof state.opts.onClick === "function") {
        state.opts.onClick(bar, index);
      }
    });
    if (state.opts.animate) {
      const t = window.setTimeout(() => {
        fill.style.width = pct2 + "%";
      }, index * 50);
      state.timers.push(t);
    }
  });
}

// src/ts/data-binding-events.ts
function emit2(name, detail) {
  eventBus.emit(name, detail);
}
function on2(name, handler) {
  eventBus.on(name, handler);
}
function off(name, handler) {
  eventBus.off(name, handler);
}

// src/ts/icons-az.ts
var azIcons = {
  /** Generic project board icon (was: engagement). */
  project: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M3 9h6"/><path d="M3 14h6"/><circle cx="16" cy="12" r="3"/><path d="M16 9v0"/></svg>',
  /** Generic workspace/location icon (was: studio). */
  workspace: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/></svg>',
  /** Now/Next dual-panel icon. */
  nowNext: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="8" height="14" rx="1"/><rect x="14" y="5" width="8" height="14" rx="1"/><circle cx="6" cy="10" r="2" fill="currentColor" opacity="0.4"/><path d="M17 10l2 2-2 2"/></svg>'
};

// src/ts/detail-panel-renderers.ts
var DASH = "\u2014";
function getInitials(name) {
  if (!name) return "?";
  return name.split(/[\s.]+/).map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join("");
}
function formatDateSimple(s) {
  if (!s) return "";
  const str = String(s);
  const parts = str.split("-");
  if (parts.length < 3) return str;
  const MONTHS2 = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return `${parseInt(parts[2], 10)} ${MONTHS2[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}
function updateStatusSelectColor(sel, colors) {
  if (!colors) return;
  const c = colors[sel.value];
  if (c) {
    sel.style.borderColor = c;
    sel.style.color = c;
  } else {
    sel.style.borderColor = "";
    sel.style.color = "";
  }
}
function renderPersonResults(container, items, input, onChange) {
  container.innerHTML = "";
  if (!items || !items.length) {
    container.classList.remove("mn-detail-panel__person-results--open");
    return;
  }
  items.forEach((item) => {
    const row = createElement("div", "mn-detail-panel__person-result");
    const itemName = typeof item === "string" ? item : item.name;
    const avatar = createElement("span", "mn-detail-panel__avatar mn-detail-panel__avatar--sm");
    avatar.textContent = getInitials(itemName);
    row.appendChild(avatar);
    const nameSpan = createElement("span");
    nameSpan.textContent = itemName;
    row.appendChild(nameSpan);
    if (typeof item !== "string" && item.email) {
      const email = createElement("span", "mn-detail-panel__person-email");
      email.textContent = item.email;
      row.appendChild(email);
    }
    row.addEventListener("mousedown", (e) => {
      e.preventDefault();
      input.value = itemName;
      onChange(itemName);
      container.classList.remove("mn-detail-panel__person-results--open");
    });
    container.appendChild(row);
  });
  container.classList.add("mn-detail-panel__person-results--open");
}
var renderers = {
  text(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  number(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--mono");
    span.textContent = val !== void 0 && val !== null ? String(val) : DASH;
    return span;
  },
  date(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? formatDateSimple(val) : DASH;
    return span;
  },
  badge(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const color = field.badgeColors?.[String(val)] ?? "";
    if (color) span.style.background = color;
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  status(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const colors = field.statusColors ?? {};
    const c = colors[String(val)];
    if (c) {
      span.style.background = c;
      span.style.color = "#fff";
    }
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  person(val) {
    const wrap = createElement("span", "mn-detail-panel__field-value mn-detail-panel__person");
    if (val) {
      const avatar = createElement("span", "mn-detail-panel__avatar");
      avatar.textContent = getInitials(String(val));
      wrap.appendChild(avatar);
      const name = createElement("span");
      name.textContent = String(val);
      wrap.appendChild(name);
    } else {
      wrap.textContent = DASH;
    }
    return wrap;
  },
  score(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--mono");
    span.textContent = val !== void 0 && val !== null ? String(val) : DASH;
    return span;
  },
  select(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  textarea(val) {
    const div = createElement("div", "mn-detail-panel__field-value mn-detail-panel__field-value--block");
    div.textContent = val ? String(val) : DASH;
    return div;
  },
  readonly(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--muted");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  custom(val, field, data) {
    if (field.render) return field.render(val, data);
    return renderers.text(val, field, data);
  }
};

// src/ts/detail-panel-editors.ts
var datePickerFn = null;
function registerDatePicker(fn) {
  datePickerFn = fn;
}
var editors = {
  text(val, field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.maxLength) input.maxLength = field.maxLength;
    input.addEventListener("input", () => onChange(input.value));
    return input;
  },
  number(val, field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "number";
    input.value = val !== void 0 && val !== null ? String(val) : "";
    if (field.min !== void 0) input.min = String(field.min);
    if (field.max !== void 0) input.max = String(field.max);
    if (field.step) input.step = String(field.step);
    input.addEventListener("input", () => onChange(parseFloat(input.value) || 0));
    return input;
  },
  date(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__date-wrap");
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "YYYY-MM-DD";
    wrap.appendChild(input);
    const calBtn = createElement("button", "mn-detail-panel__cal-btn");
    calBtn.type = "button";
    calBtn.innerHTML = "\u{1F4C5}";
    calBtn.title = "Open calendar";
    wrap.appendChild(calBtn);
    input.addEventListener("input", () => onChange(input.value));
    calBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (datePickerFn) {
        datePickerFn(wrap, {
          value: input.value,
          min: field.min != null ? String(field.min) : void 0,
          max: field.max != null ? String(field.max) : void 0,
          onSelect(dateStr) {
            input.value = dateStr;
            onChange(dateStr);
          }
        });
      }
    });
    return wrap;
  },
  select(val, field, onChange) {
    const sel = createElement("select", "mn-form-select mn-form-select--sm mn-detail-panel__edit-input");
    for (const opt of field.options ?? []) {
      const o = createElement("option");
      const optVal = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? "")) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  },
  status(val, field, onChange) {
    const sel = createElement(
      "select",
      "mn-form-select mn-form-select--sm mn-detail-panel__edit-input mn-detail-panel__status-select"
    );
    for (const opt of field.options ?? []) {
      const o = createElement("option");
      const optVal = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? "")) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => {
      updateStatusSelectColor(sel, field.statusColors);
      onChange(sel.value);
    });
    setTimeout(() => updateStatusSelectColor(sel, field.statusColors), 0);
    return sel;
  },
  person(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__person-edit");
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "Search people\u2026";
    wrap.appendChild(input);
    const results = createElement("div", "mn-detail-panel__person-results");
    wrap.appendChild(results);
    let debounceTimer = null;
    input.addEventListener("input", () => {
      onChange(input.value);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      const query = input.value.trim();
      if (query.length < 2 || !field.onSearch) {
        results.innerHTML = "";
        results.classList.remove("mn-detail-panel__person-results--open");
        return;
      }
      debounceTimer = setTimeout(() => {
        const searchFn = field.onSearch;
        if (!searchFn) return;
        const res = searchFn(query);
        if (res && typeof res.then === "function") {
          res.then((items) => {
            renderPersonResults(results, items, input, (v) => onChange(v));
          });
        } else if (Array.isArray(res)) {
          renderPersonResults(results, res, input, (v) => onChange(v));
        }
      }, 300);
    });
    input.addEventListener("blur", () => {
      setTimeout(() => results.classList.remove("mn-detail-panel__person-results--open"), 200);
    });
    return wrap;
  },
  score(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__score-stepper");
    const btnMinus = createElement("button", "mn-detail-panel__score-btn");
    btnMinus.type = "button";
    btnMinus.textContent = "\u2212";
    const display = createElement("span", "mn-detail-panel__score-value");
    let current = parseInt(String(val ?? ""), 10) || (field.min ?? 0);
    display.textContent = String(current);
    const btnPlus = createElement("button", "mn-detail-panel__score-btn");
    btnPlus.type = "button";
    btnPlus.textContent = "+";
    function update(delta) {
      current = Math.max(field.min ?? 0, Math.min(field.max ?? 5, current + delta));
      display.textContent = String(current);
      onChange(current);
    }
    btnMinus.addEventListener("click", () => update(-1));
    btnPlus.addEventListener("click", () => update(1));
    wrap.appendChild(btnMinus);
    wrap.appendChild(display);
    wrap.appendChild(btnPlus);
    return wrap;
  },
  textarea(val, field, onChange) {
    const ta = createElement("textarea", "mn-form-textarea mn-form-textarea--sm mn-detail-panel__edit-textarea");
    ta.value = val != null ? String(val) : "";
    ta.rows = field.rows ?? 3;
    if (field.maxLength) ta.maxLength = field.maxLength;
    if (field.placeholder) ta.placeholder = field.placeholder;
    ta.addEventListener("input", () => onChange(ta.value));
    return ta;
  }
};

// src/ts/detail-panel-ui.ts
function showToast(panel, message, type = "info") {
  const existing = panel.querySelector(".mn-detail-panel__toast");
  if (existing) existing.remove();
  const toast2 = createElement("div", `mn-detail-panel__toast mn-detail-panel__toast--${type}`);
  toast2.textContent = message;
  const body = panel.querySelector(".mn-detail-panel__body") ?? panel;
  body.insertBefore(toast2, body.firstChild);
  setTimeout(() => toast2.classList.add("mn-detail-panel__toast--visible"), 16);
  setTimeout(() => {
    toast2.classList.remove("mn-detail-panel__toast--visible");
    setTimeout(() => toast2.remove(), 300);
  }, 4e3);
}
function renderSkeleton(body) {
  body.innerHTML = "";
  for (let s = 0; s < 3; s++) {
    const section = createElement("div", "mn-detail-panel__section");
    const title = createElement("div", "mn-detail-panel__skeleton mn-detail-panel__skeleton--title");
    section.appendChild(title);
    for (let f = 0; f < 4; f++) {
      const field = createElement("div", "mn-detail-panel__field");
      field.appendChild(createElement("span", "mn-detail-panel__skeleton mn-detail-panel__skeleton--label"));
      field.appendChild(createElement("span", "mn-detail-panel__skeleton mn-detail-panel__skeleton--value"));
      section.appendChild(field);
    }
    body.appendChild(section);
  }
}
function validateField2(value, field) {
  if (!field.validate) return null;
  const rules = field.validate;
  if (rules.required && (!value || typeof value === "string" && !value.trim())) {
    return `${field.label} is required`;
  }
  if (rules.min !== void 0 && Number(value) < rules.min) {
    return `${field.label} must be at least ${rules.min}`;
  }
  if (rules.max !== void 0 && Number(value) > rules.max) {
    return `${field.label} must be at most ${rules.max}`;
  }
  if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
    return `${field.label} must be ${rules.maxLength} characters or less`;
  }
  if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
    return rules.patternMessage ?? `${field.label} has an invalid format`;
  }
  if (rules.custom) return rules.custom(value);
  return null;
}
function buildDOM(container, opts, activeTab, onTabClick) {
  container.innerHTML = "";
  container.classList.add("mn-detail-panel");
  const backdrop = createElement("div", "mn-detail-panel__backdrop");
  container.parentNode.insertBefore(backdrop, container);
  const header = createElement("div", "mn-detail-panel__header");
  const titleEl = createElement("div", "mn-detail-panel__title");
  titleEl.textContent = opts.title ?? "";
  const headerActions = createElement("div", "mn-detail-panel__header-actions");
  const editBtn = createElement("button", "mn-detail-panel__action-btn mn-detail-panel__edit-btn");
  editBtn.textContent = "Edit";
  editBtn.style.display = opts.editable !== false ? "" : "none";
  const saveBtn = createElement("button", "mn-detail-panel__action-btn mn-detail-panel__save-btn");
  saveBtn.textContent = "Save";
  saveBtn.style.display = "none";
  const cancelBtn = createElement("button", "mn-detail-panel__action-btn mn-detail-panel__cancel-btn");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.display = "none";
  const closeBtn = createElement("button", "mn-detail-panel__close");
  closeBtn.innerHTML = "\u2715";
  closeBtn.title = "Close panel";
  headerActions.append(editBtn, saveBtn, cancelBtn, closeBtn);
  header.append(titleEl, headerActions);
  container.appendChild(header);
  let tabBar = null;
  if (opts.tabs && opts.tabs.length > 1) {
    tabBar = createElement("div", "mn-detail-panel__tabs");
    for (const tab of opts.tabs) {
      const btn = createElement("button", "mn-detail-panel__tab");
      btn.textContent = tab;
      btn.dataset.tab = tab;
      if (tab === activeTab) btn.classList.add("mn-detail-panel__tab--active");
      btn.addEventListener("click", () => onTabClick(tab));
      tabBar.appendChild(btn);
    }
    container.appendChild(tabBar);
  }
  const body = createElement("div", "mn-detail-panel__body");
  container.appendChild(body);
  const footer = createElement("div", "mn-detail-panel__footer");
  if (opts.footerActions) {
    for (const action of opts.footerActions) {
      const btn = createElement("button", `mn-btn mn-btn--sm${action.ghost ? " mn-btn--ghost" : ""}`);
      btn.textContent = action.label;
      if (action.onClick) btn.addEventListener("click", action.onClick);
      footer.appendChild(btn);
    }
  }
  container.appendChild(footer);
  return { backdrop, titleEl, editBtn, saveBtn, cancelBtn, closeBtn, tabBar, body, footer };
}
function renderBody(body, state, opts) {
  body.innerHTML = "";
  state.errors = {};
  if (state.activeTab && opts.subComponents?.[state.activeTab]) {
    opts.subComponents[state.activeTab](body, state.data, {
      isEditing: state.isEditing,
      changes: state.changes
    });
    return;
  }
  const sections = state.schema.filter(
    (s) => !s.tab || s.tab === state.activeTab || !state.activeTab
  );
  for (const section of sections) {
    const sectionEl = createElement("div", "mn-detail-panel__section");
    if (section.section) {
      const title = createElement("div", "mn-detail-panel__section-title");
      title.textContent = section.section;
      sectionEl.appendChild(title);
    }
    for (const field of section.fields ?? []) {
      const fieldEl = createElement("div", "mn-detail-panel__field");
      if (field.type === "textarea" || field.type === "custom") {
        fieldEl.classList.add("mn-detail-panel__field--block");
      }
      const label = createElement("span", "mn-detail-panel__field-label");
      label.textContent = field.label;
      fieldEl.appendChild(label);
      const val = Object.prototype.hasOwnProperty.call(state.changes, field.key) ? state.changes[field.key] : state.data[field.key];
      if (state.isEditing && field.type !== "readonly" && field.editable !== false) {
        const editor = editors[field.type ?? "text"] ?? editors.text;
        const editorEl = editor(val, field, (newVal) => {
          state.changes[field.key] = newVal;
          state.isDirty = true;
          const err = validateField2(newVal, field);
          const errEl = fieldEl.querySelector(".mn-detail-panel__field-error");
          if (err) {
            state.errors[field.key] = err;
            if (!errEl) {
              const newErr = createElement("div", "mn-detail-panel__field-error");
              newErr.textContent = err;
              fieldEl.appendChild(newErr);
            } else {
              errEl.textContent = err;
            }
            fieldEl.classList.add("mn-detail-panel__field--error");
          } else {
            delete state.errors[field.key];
            if (errEl) errEl.remove();
            fieldEl.classList.remove("mn-detail-panel__field--error");
          }
        });
        fieldEl.appendChild(editorEl);
      } else {
        const renderer = renderers[field.type ?? "text"] ?? renderers.text;
        fieldEl.appendChild(renderer(val, field, state.data));
      }
      sectionEl.appendChild(fieldEl);
    }
    body.appendChild(sectionEl);
  }
}

// src/ts/detail-panel.ts
function createDetailPanel(container, opts = {}) {
  const state = {
    activeTab: opts.tabs?.[0] ?? null,
    isEditing: false,
    isSaving: false,
    changes: {},
    errors: {},
    isDirty: false,
    isOpen: false,
    data: opts.data ?? {},
    schema: opts.schema ?? []
  };
  const dom = buildDOM(container, opts, state.activeTab, (tab) => {
    state.activeTab = tab;
    if (dom.tabBar) {
      dom.tabBar.querySelectorAll(".mn-detail-panel__tab").forEach((btn) => {
        btn.classList.toggle("mn-detail-panel__tab--active", btn.dataset.tab === tab);
      });
    }
    renderBody(dom.body, state, opts);
  });
  renderBody(dom.body, state, opts);
  dom.closeBtn.addEventListener("click", () => {
    doClose();
    opts.onClose?.();
  });
  dom.backdrop.addEventListener("click", () => {
    doClose();
    opts.onClose?.();
  });
  dom.editBtn.addEventListener("click", () => startEdit());
  dom.cancelBtn.addEventListener("click", () => cancelEdit());
  dom.saveBtn.addEventListener("click", () => save());
  function startEdit() {
    state.isEditing = true;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = "none";
    dom.saveBtn.style.display = "";
    dom.cancelBtn.style.display = "";
    renderBody(dom.body, state, opts);
  }
  function cancelEdit() {
    state.isEditing = false;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = "";
    dom.saveBtn.style.display = "none";
    dom.cancelBtn.style.display = "none";
    renderBody(dom.body, state, opts);
  }
  function save() {
    if (Object.keys(state.errors).length) return;
    const payload = {};
    for (const k in state.changes) payload[k] = state.changes[k];
    opts.onSave?.(payload, state.data);
    cancelEdit();
  }
  function doClose() {
    state.isOpen = false;
    container.classList.remove("mn-detail-panel--open");
    const bd = container.previousElementSibling;
    if (bd && bd.classList.contains("mn-detail-panel__backdrop")) {
      bd.classList.remove("mn-detail-panel__backdrop--visible");
    }
  }
  function doOpen() {
    state.isOpen = true;
    container.classList.add("mn-detail-panel--open");
    const bd = container.previousElementSibling;
    if (bd && bd.classList.contains("mn-detail-panel__backdrop")) {
      bd.classList.add("mn-detail-panel__backdrop--visible");
    }
  }
  return {
    open: doOpen,
    close: doClose,
    isOpen: () => state.isOpen,
    startEdit,
    cancelEdit,
    save,
    isEditing: () => state.isEditing,
    isDirty: () => state.isDirty,
    setData(newData) {
      state.data = newData;
      renderBody(dom.body, state, opts);
    },
    getData: () => ({ ...state.data }),
    setTitle(t) {
      dom.titleEl.textContent = t;
    },
    showLoading() {
      renderSkeleton(dom.body);
    },
    setTab(tab) {
      state.activeTab = tab;
      if (dom.tabBar) {
        dom.tabBar.querySelectorAll(".mn-detail-panel__tab").forEach((btn) => {
          btn.classList.toggle("mn-detail-panel__tab--active", btn.dataset.tab === tab);
        });
      }
      renderBody(dom.body, state, opts);
    },
    render() {
      renderBody(dom.body, state, opts);
    },
    showToast(msg, type) {
      showToast(container, msg, type);
    },
    destroy() {
      container.innerHTML = "";
    }
  };
}

// src/ts/a11y-panel-dom.ts
var STORAGE_KEY = "mn-a11y";
var DEFAULTS = {
  fontSize: "md",
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
  lineSpacing: "normal"
};
var SIZES = {
  sm: { label: "S", scale: 0.875 },
  md: { label: "M", scale: 1 },
  lg: { label: "L", scale: 1.125 },
  xl: { label: "XL", scale: 1.25 }
};
var LINE_SPACINGS = {
  normal: { label: "1\xD7", value: "normal" },
  relaxed: { label: "1.5\xD7", value: "1.75" },
  loose: { label: "2\xD7", value: "2.0" }
};
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
  }
  return { ...DEFAULTS };
}
function saveSettings(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
  }
}
function applySettings(settings) {
  const root = document.documentElement;
  const sz = SIZES[settings.fontSize] ?? SIZES.md;
  root.style.fontSize = `${sz.scale * 16}px`;
  root.classList.toggle("mn-reduced-motion", settings.reducedMotion);
  root.classList.toggle("mn-high-contrast", settings.highContrast);
  root.classList.toggle("mn-no-focus-ring", !settings.focusVisible);
  const ls = LINE_SPACINGS[settings.lineSpacing] ?? LINE_SPACINGS.normal;
  if (ls.value === "normal") {
    root.style.removeProperty("--mn-line-height");
    document.body.style.removeProperty("line-height");
  } else {
    root.style.setProperty("--mn-line-height", ls.value);
    document.body.style.lineHeight = ls.value;
  }
}
function slidersIcon() {
  return icons.sliders ? icons.sliders() : "";
}
function makeToggle(settings, label, key) {
  const row = createElement("div", "mn-a11y-panel__row");
  row.appendChild(createElement("span", "mn-a11y-panel__row-label", { text: label }));
  const on3 = settings[key];
  const toggle = createElement("button", `mn-a11y-toggle${on3 ? " mn-a11y-toggle--on" : ""}`, {
    role: "switch",
    "aria-checked": String(on3),
    "aria-label": label
  });
  toggle.appendChild(createElement("span", "mn-a11y-toggle__thumb"));
  toggle.addEventListener("click", () => {
    settings[key] = !settings[key];
    const nowOn = settings[key];
    toggle.classList.toggle("mn-a11y-toggle--on", nowOn);
    toggle.setAttribute("aria-checked", String(nowOn));
    applySettings(settings);
    saveSettings(settings);
  });
  row.appendChild(toggle);
  return row;
}
function buildPanel(settings) {
  const fab = createElement("button", "mn-a11y-fab", {
    "aria-label": "Display settings",
    title: "Display settings"
  });
  fab.innerHTML = slidersIcon();
  const panel = createElement("div", "mn-a11y-panel", {
    role: "dialog",
    "aria-label": "Accessibility settings"
  });
  const title = createElement("div", "mn-a11y-panel__title");
  title.innerHTML = `${slidersIcon()} Display`;
  panel.appendChild(title);
  const fsGroup = createElement("div", "mn-a11y-panel__group");
  fsGroup.appendChild(createElement("div", "mn-a11y-panel__label", { text: "Text Size" }));
  const fsRow = createElement("div", "mn-a11y-panel__size-btns");
  const sizeButtons = {};
  for (const key of Object.keys(SIZES)) {
    const btn = createElement("button", "mn-a11y-panel__size-btn", {
      text: SIZES[key].label,
      "aria-label": `Font size ${SIZES[key].label}`
    });
    if (settings.fontSize === key) btn.classList.add("mn-a11y-panel__size-btn--active");
    btn.addEventListener("click", () => {
      settings.fontSize = key;
      for (const k of Object.keys(sizeButtons)) {
        sizeButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === key);
      }
      applySettings(settings);
      saveSettings(settings);
    });
    sizeButtons[key] = btn;
    fsRow.appendChild(btn);
  }
  fsGroup.appendChild(fsRow);
  panel.appendChild(fsGroup);
  const lsGroup = createElement("div", "mn-a11y-panel__group");
  lsGroup.appendChild(createElement("div", "mn-a11y-panel__label", { text: "Line Spacing" }));
  const lsRow = createElement("div", "mn-a11y-panel__size-btns");
  const lsButtons = {};
  for (const key of Object.keys(LINE_SPACINGS)) {
    const btn = createElement("button", "mn-a11y-panel__size-btn", {
      text: LINE_SPACINGS[key].label,
      "aria-label": `Line spacing ${LINE_SPACINGS[key].label}`
    });
    if (settings.lineSpacing === key) btn.classList.add("mn-a11y-panel__size-btn--active");
    btn.addEventListener("click", () => {
      settings.lineSpacing = key;
      for (const k of Object.keys(lsButtons)) {
        lsButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === key);
      }
      applySettings(settings);
      saveSettings(settings);
    });
    lsButtons[key] = btn;
    lsRow.appendChild(btn);
  }
  lsGroup.appendChild(lsRow);
  panel.appendChild(lsGroup);
  panel.appendChild(createElement("div", "mn-a11y-panel__divider"));
  panel.appendChild(makeToggle(settings, "Reduced Motion", "reducedMotion"));
  panel.appendChild(makeToggle(settings, "High Contrast", "highContrast"));
  panel.appendChild(makeToggle(settings, "Focus Indicators", "focusVisible"));
  panel.appendChild(createElement("div", "mn-a11y-panel__divider"));
  const resetBtn = createElement("button", "mn-a11y-panel__reset", { text: "Reset to Defaults" });
  panel.appendChild(resetBtn);
  return { fab, panel, sizeButtons, lsButtons, resetBtn };
}

// src/ts/a11y-panel.ts
function a11yPanel() {
  const settings = loadSettings();
  const refs = buildPanel(settings);
  const { fab, panel } = refs;
  refs.resetBtn.addEventListener("click", () => {
    settings.fontSize = DEFAULTS.fontSize;
    settings.reducedMotion = DEFAULTS.reducedMotion;
    settings.highContrast = DEFAULTS.highContrast;
    settings.focusVisible = DEFAULTS.focusVisible;
    settings.lineSpacing = DEFAULTS.lineSpacing;
    saveSettings(settings);
    applySettings(settings);
    for (const k of Object.keys(refs.sizeButtons)) {
      refs.sizeButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === "md");
    }
    for (const k of Object.keys(refs.lsButtons)) {
      refs.lsButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === "normal");
    }
    panel.querySelectorAll(".mn-a11y-toggle").forEach((t) => {
      const label = t.getAttribute("aria-label");
      const isDefault = label === "Focus Indicators";
      t.classList.toggle("mn-a11y-toggle--on", isDefault);
      t.setAttribute("aria-checked", String(isDefault));
    });
  });
  let isOpen = false;
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("mn-a11y-panel--open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
  });
  const onKeydown = (e) => {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      panel.classList.remove("mn-a11y-panel--open");
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
    }
  };
  document.addEventListener("keydown", onKeydown);
  const onDocClick2 = (e) => {
    const target = e.target;
    if (target && isOpen && !panel.contains(target) && !fab.contains(target)) {
      isOpen = false;
      panel.classList.remove("mn-a11y-panel--open");
      fab.setAttribute("aria-expanded", "false");
    }
  };
  document.addEventListener("click", onDocClick2);
  document.body.appendChild(fab);
  document.body.appendChild(panel);
  applySettings(settings);
  return {
    getSettings: () => ({ ...settings }),
    reset: () => refs.resetBtn.click(),
    destroy: () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("click", onDocClick2);
      fab.remove();
      panel.remove();
    }
  };
}

// src/ts/controls-dialogs.ts
function initDropdown(el4) {
  const trigger = el4.querySelector(".mn-dropdown__trigger");
  const menu = el4.querySelector(".mn-dropdown__menu");
  const items = el4.querySelectorAll(".mn-dropdown__item");
  if (!trigger) throw new Error("Dropdown: missing .mn-dropdown__trigger");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  if (menu) menu.setAttribute("role", "listbox");
  items.forEach((item) => item.setAttribute("role", "option"));
  function openMenu() {
    el4.classList.add("mn-dropdown--open");
    trigger.setAttribute("aria-expanded", "true");
    if (items[0]) items[0].focus();
  }
  function closeMenu() {
    el4.classList.remove("mn-dropdown--open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (el4.classList.contains("mn-dropdown--open")) closeMenu();
    else openMenu();
  });
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  });
  items.forEach((item, idx) => {
    item.setAttribute("tabindex", "-1");
    item.addEventListener("click", () => {
      items.forEach((i) => {
        i.classList.remove("mn-dropdown__item--active");
        i.setAttribute("aria-selected", "false");
      });
      item.classList.add("mn-dropdown__item--active");
      item.setAttribute("aria-selected", "true");
      if (trigger.childNodes[0]) {
        trigger.childNodes[0].textContent = `${item.textContent ?? ""} `;
      }
      closeMenu();
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items[idx + 1]) items[idx + 1].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) items[idx - 1].focus();
        else trigger.focus();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
  document.addEventListener("click", () => {
    if (el4.classList.contains("mn-dropdown--open")) closeMenu();
  });
  return { open: openMenu, close: closeMenu };
}
function initTabs(el4) {
  const tabs = el4.querySelectorAll(".mn-tabs__tab");
  const panels = el4.querySelectorAll(".mn-tabs__panel");
  function activate(idx) {
    tabs.forEach((t, i) => {
      const active = i === idx;
      t.classList.toggle("mn-tabs__tab--active", active);
      t.setAttribute("aria-selected", String(active));
      t.setAttribute("tabindex", active ? "0" : "-1");
    });
    panels.forEach((p, i) => {
      p.classList.toggle("mn-tabs__panel--active", i === idx);
    });
  }
  tabs.forEach((tab, i) => {
    tab.setAttribute("role", "tab");
    if (panels[i]) {
      const panelId = panels[i].id || `mn-tabpanel-${Math.random().toString(36).slice(2, 8)}`;
      panels[i].id = panelId;
      tab.setAttribute("aria-controls", panelId);
    }
    tab.addEventListener("click", () => activate(i));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (i + 1) % tabs.length;
        activate(next);
        tabs[next].focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (i - 1 + tabs.length) % tabs.length;
        activate(prev);
        tabs[prev].focus();
      }
    });
  });
  let activeIdx = 0;
  tabs.forEach((t, i) => {
    if (t.classList.contains("mn-tabs__tab--active")) activeIdx = i;
  });
  activate(activeIdx);
  return { activate };
}

// src/ts/controls-drag.ts
function initRotary(el4, options) {
  const opts = {
    steps: ["WET", "COMFORT", "SPORT", "RACE", "ESC OFF"],
    initial: 2,
    snap: true,
    ...options
  };
  const housing = el4.querySelector(".mn-rotary__housing");
  const pointer = el4.querySelector(".mn-rotary__pointer");
  const valueEl = el4.querySelector(".mn-rotary__value");
  if (!housing || !pointer) throw new Error("Rotary: missing .mn-rotary__housing or __pointer");
  let current = opts.initial;
  const totalSteps = opts.steps.length;
  const angleRange = 240, startAngle = -120;
  function setStep(idx) {
    idx = clamp(idx, 0, totalSteps - 1);
    current = idx;
    const angle = startAngle + idx / (totalSteps - 1) * angleRange;
    pointer.style.transform = `rotate(${angle}deg)`;
    if (valueEl) valueEl.textContent = opts.steps[idx];
    opts.onChange?.(opts.steps[idx], idx);
  }
  setStep(current);
  let dragging = false, centerX = 0, centerY = 0;
  function getCenter() {
    const rect = housing.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }
  function getClientPoint(e) {
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }
  function angleFromEvent(e) {
    const point = getClientPoint(e);
    return Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI) + 90;
  }
  function stepFromAngle(deg) {
    const norm = ((deg - startAngle) % 360 + 360) % 360;
    const idx = Math.round(norm / angleRange * (totalSteps - 1));
    return clamp(idx, 0, totalSteps - 1);
  }
  function onStart(e) {
    e.preventDefault();
    dragging = true;
    getCenter();
    housing.style.cursor = "grabbing";
  }
  function onMove(e) {
    if (!dragging) return;
    const deg = angleFromEvent(e);
    if (opts.snap) setStep(stepFromAngle(deg));
    else pointer.style.transform = `rotate(${deg - 90}deg)`;
  }
  function onEnd() {
    dragging = false;
    housing.style.cursor = "pointer";
  }
  housing.addEventListener("mousedown", onStart);
  housing.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
  housing.addEventListener("click", () => {
    if (!dragging) setStep((current + 1) % totalSteps);
  });
  el4.setAttribute("tabindex", "0");
  el4.setAttribute("role", "slider");
  el4.setAttribute("aria-valuemin", "0");
  el4.setAttribute("aria-valuemax", String(totalSteps - 1));
  el4.setAttribute("aria-valuenow", String(current));
  el4.setAttribute("aria-valuetext", opts.steps[current]);
  el4.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setStep(current + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setStep(current - 1);
    }
    el4.setAttribute("aria-valuenow", String(current));
    el4.setAttribute("aria-valuetext", opts.steps[current]);
  });
  return {
    setStep,
    getValue: () => opts.steps[current],
    destroy: () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchend", onEnd);
    }
  };
}
function initSlider(el4, options) {
  const opts = {
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    onChange: void 0,
    label: null,
    unit: "",
    ...options
  };
  const track = el4.querySelector(".mn-slider__track") ?? el4;
  let fill = el4.querySelector(".mn-slider__fill");
  let thumb = el4.querySelector(".mn-slider__thumb");
  const valueEl = el4.querySelector(".mn-slider__value");
  if (!fill) {
    fill = document.createElement("div");
    fill.className = "mn-slider__fill";
    track.appendChild(fill);
  }
  if (!thumb) {
    thumb = document.createElement("div");
    thumb.className = "mn-slider__thumb";
    track.appendChild(thumb);
  }
  const fillEl = fill, thumbEl = thumb;
  let current = opts.value, dragging = false;
  el4.setAttribute("tabindex", "0");
  el4.setAttribute("role", "slider");
  el4.setAttribute("aria-valuemin", String(opts.min));
  el4.setAttribute("aria-valuemax", String(opts.max));
  el4.setAttribute("aria-valuenow", String(current));
  if (opts.label) el4.setAttribute("aria-label", opts.label);
  function pctFromValue(v) {
    return (v - opts.min) / (opts.max - opts.min) * 100;
  }
  function valueFromPct(pct2) {
    const raw = opts.min + pct2 / 100 * (opts.max - opts.min);
    return Math.round(raw / opts.step) * opts.step;
  }
  function render3() {
    const pct2 = pctFromValue(current);
    fillEl.style.width = `${pct2}%`;
    thumbEl.style.left = `${pct2}%`;
    if (valueEl) valueEl.textContent = String(current);
    el4.setAttribute("aria-valuenow", String(current));
    if (opts.label) el4.setAttribute("aria-valuetext", `${current}${opts.unit}`);
  }
  function getPointerX(e) {
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return touch.clientX;
    }
    return e.clientX;
  }
  function setFromX(clientX) {
    const rect = track.getBoundingClientRect();
    const pct2 = clamp((clientX - rect.left) / rect.width * 100, 0, 100);
    const newVal = valueFromPct(pct2);
    if (newVal !== current) {
      current = newVal;
      render3();
      opts.onChange?.(current);
      eventBus.emit("slider-change", { element: el4, value: current });
    }
  }
  function onStart(e) {
    e.preventDefault();
    dragging = true;
    el4.classList.add("mn-slider--active");
    setFromX(getPointerX(e));
  }
  function onMove(e) {
    if (!dragging) return;
    setFromX(getPointerX(e));
  }
  function onEnd() {
    dragging = false;
    el4.classList.remove("mn-slider--active");
  }
  track.addEventListener("mousedown", onStart);
  track.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
  el4.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      current = Math.min(opts.max, current + opts.step);
      render3();
      opts.onChange?.(current);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      current = Math.max(opts.min, current - opts.step);
      render3();
      opts.onChange?.(current);
    }
  });
  render3();
  return {
    getValue: () => current,
    setValue: (v) => {
      current = clamp(v, opts.min, opts.max);
      render3();
    }
  };
}

// src/ts/map-view-events.ts
function showTip2(m, els, padding, viewState) {
  els.tipLabel.textContent = m.label || "Marker";
  els.tipDetail.textContent = m.detail || "";
  els.tip.classList.add("mn-map__tooltip--visible");
  els.tip.setAttribute("aria-hidden", "false");
  const cr = els.wrap.getBoundingClientRect();
  const pos = typeof m._x === "number" && typeof m._y === "number" ? { x: m._x, y: m._y } : project(m.lat, m.lon, cr.width, cr.height, padding, viewState);
  const tipW = els.tip.offsetWidth || 120;
  const tipH = els.tip.offsetHeight || 40;
  let left = pos.x - tipW / 2;
  if (left < 4) left = 4;
  if (left + tipW > cr.width - 4) left = cr.width - tipW - 4;
  let top = pos.y - tipH - 12;
  if (top < 4) top = pos.y + 12;
  els.tip.style.left = left + "px";
  els.tip.style.top = top + "px";
}
function hideTip2(tip) {
  tip.classList.remove("mn-map__tooltip--visible");
  tip.setAttribute("aria-hidden", "true");
}
function attachEvents(canvas, tipEls, state, callbacks) {
  function handleWheel(e) {
    if (!state.enableZoom) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    callbacks.setZoomInternal(state.zoomLevel * factor);
  }
  function startDrag(clientX, clientY) {
    if (!state.enablePan) return;
    state.isDragging = true;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    state.hovered = null;
    hideTip2(tipEls.tip);
    canvas.style.cursor = "grabbing";
  }
  function moveDrag(clientX, clientY) {
    if (!state.isDragging) return;
    const dx = clientX - state.dragStartX;
    const dy = clientY - state.dragStartY;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    callbacks.panByPixels(dx, dy);
  }
  function endDrag() {
    state.isDragging = false;
    canvas.style.cursor = state.enablePan ? "grab" : "default";
  }
  canvas.addEventListener("mousemove", (e) => {
    if (state.isDragging) return;
    const m = hitTest(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m) {
      state.hovered = m.id;
      canvas.style.cursor = "pointer";
      showTip2(m, tipEls, state.padding, state.viewState);
    } else {
      state.hovered = null;
      canvas.style.cursor = state.enablePan ? "grab" : "default";
      hideTip2(tipEls.tip);
    }
  });
  canvas.addEventListener("mouseleave", () => {
    state.hovered = null;
    if (!state.isDragging) {
      canvas.style.cursor = state.enablePan ? "grab" : "default";
    }
    hideTip2(tipEls.tip);
  });
  canvas.addEventListener("click", (e) => {
    if (state.isDragging) return;
    const m = hitTest(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m && state.onClick) state.onClick(m);
  });
  let onWindowMouseMove = null;
  let onWindowMouseUp = null;
  if (state.enableZoom) {
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.style.touchAction = "none";
  }
  if (state.enablePan) {
    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      startDrag(e.clientX, e.clientY);
    });
    onWindowMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    onWindowMouseUp = () => {
      if (state.isDragging) endDrag();
    };
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2 && state.enableZoom) {
        const t1 = e.touches[0], t2 = e.touches[1];
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        state.touchPinchStartDist = Math.sqrt(dx * dx + dy * dy);
        state.touchPinchStartZoom = state.zoomLevel;
        return;
      }
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && state.enableZoom && state.touchPinchStartDist > 0) {
        e.preventDefault();
        const p1 = e.touches[0], p2 = e.touches[1];
        const dx = p2.clientX - p1.clientX;
        const dy = p2.clientY - p1.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          callbacks.setZoomInternal(state.touchPinchStartZoom * (dist / state.touchPinchStartDist));
        }
        return;
      }
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener("touchend", () => {
      state.touchPinchStartDist = 0;
      if (state.isDragging) endDrag();
    }, { passive: true });
  }
  return {
    cleanup() {
      if (state.enableZoom) canvas.removeEventListener("wheel", handleWheel);
      if (onWindowMouseMove) window.removeEventListener("mousemove", onWindowMouseMove);
      if (onWindowMouseUp) window.removeEventListener("mouseup", onWindowMouseUp);
    }
  };
}

// src/ts/maranello-exports.ts
function registerExtras(M2) {
  M2.SPEEDO_FONT = SPEEDO_FONT;
  M2.SPEEDO_SIZES = SPEEDO_SIZES;
  M2.SPEEDO_SWEEP = SWEEP;
  M2.SPEEDO_START = START;
  M2.easeOutCubic = easeOutCubic;
  M2.valueToAngle = valueToAngle;
  M2.speedoPalette = speedoPalette;
  M2.drawSpeedometer = drawSpeedometer;
  M2.hexLum = hexLum2;
  M2.createEl = createEl;
  M2.clampVal = clampVal;
  M2.normalizeHex = normalizeHex;
  M2.buildTicks = buildTicks;
  M2.cleanupTimers = cleanupTimers;
  M2.addHBarListener = addListener;
  M2.showHBarTip = showTip;
  M2.hideHBarTip = hideTip;
  M2.normalizeBars = normalizeBars;
  M2.renderHBar = renderHBar;
  M2.updateStatusSelectColor = updateStatusSelectColor;
  M2.renderPersonResults = renderPersonResults;
  M2.renderers = renderers;
  M2.getInitials = getInitials;
  M2.formatDateSimple = formatDateSimple;
  M2.showPanelToast = showToast;
  M2.renderSkeleton = renderSkeleton;
  M2.validateDetailField = validateField2;
  M2.buildDetailDOM = buildDOM;
  M2.renderPanelBody = renderBody;
  M2.A11Y_DEFAULTS = DEFAULTS;
  M2.loadA11ySettings = loadSettings;
  M2.saveA11ySettings = saveSettings;
  M2.applyA11ySettings = applySettings;
  M2.buildA11yPanel = buildPanel;
  M2.MAP_DPR = DPR;
  M2.MAP_TAU = TAU;
  M2.CONTINENTS = CONTINENTS;
  M2.detectMapTheme = detectTheme;
  M2.getMarkerColors = getMarkerColors;
  M2.projectLatLon = project;
  M2.hexToRgba = hexToRgba;
  M2.getVisibleProjected = getVisibleProjected;
  M2.clusterMarkers = clusterMarkers;
  M2.markerRadius = markerRadius;
  M2.drawMarker = drawMarker;
  M2.renderMapLegend = renderLegend;
  M2.hitTest = hitTest;
  M2.showMapTip = showTip2;
  M2.hideMapTip = hideTip2;
  M2.attachMapEvents = attachEvents;
}

// src/ts/maranello.ts
var M = window.Maranello = window.Maranello || {};
M.VERSION = VERSION;
M.emit = emit2;
M.on = on2;
M.off = off;
M.eventBus = eventBus;
M.getTheme = getTheme;
M.setTheme = setTheme;
M.cycleTheme = cycleTheme;
M.initThemeToggle = initThemeToggle;
M.getAccent = getAccent;
M.cssVar = cssVar;
M.clamp = clamp;
M.lerp = lerp;
M.hiDpiCanvas = hiDpiCanvas;
M.createElement = createElement;
M.formatNumber = formatNumber;
M.formatDate = formatDate;
M.debounce = debounce;
M.throttle = throttle;
M.icons = icons;
M.renderIcon = renderIcon;
M.iconCatalog = iconCatalog;
M.navIcons = navIcons;
M.statusIcons = statusIcons;
M.actionIcons = actionIcons;
M.dataIcons = dataIcons;
M.objectIcons = objectIcons;
M.azIcons = azIcons;
M.toast = toast;
M.openModal = openModal;
M.closeModal = closeModal;
M.commandPalette = commandPalette;
M.loginScreen = loginScreen;
M.systemStatus = systemStatus;
M.profileMenu = profileMenu;
M.FerrariGauge = FerrariGauge;
M.buildGaugePalette = buildGaugePalette;
M.createGauge = createGauge;
M.createGaugesInContainer = createGaugesInContainer;
M.redrawAll = redrawAll;
M.reinitAll = reinitAll;
M.GAUGE_SIZES = GAUGE_SIZES;
M.speedometer = speedometer;
M.gantt = gantt;
M.dataTable = dataTable;
M.datePicker = datePicker;
M.mapView = mapView;
M.funnel = funnel;
M.aiChat = buildUI;
M.flipCounter = flipCounter;
M.progressRing = progressRing;
M.hBarChart = hBarChart;
M.okrPanel = okrPanel;
M.chartInteract = chartInteract;
M.sparklineInteract = sparklineInteract;
M.openDetailPanel = openDetailPanel;
M.closeDetailPanel = closeDetailPanel;
M.detailPanel = openDetailPanel;
M.createDetailPanel = createDetailPanel;
M.registerDatePicker = registerDatePicker;
M.editors = editors;
M.openDrawer = openDrawer;
M.closeDrawer = closeDrawer;
M.initOrgTree = initOrgTree;
M.cruiseLever = cruiseLever;
M.toggleLever = toggleLever;
M.manettino = manettino;
M.steppedRotary = steppedRotary;
M.initRotary = manettino;
M.initDropdown = initDropdown;
M.initTabs = initTabs;
M.initDragRotary = initRotary;
M.initSlider = initSlider;
M.a11yPanel = a11yPanel;
M.bind = bind;
M.autoBind = autoBind;
M.onDrillDown = onDrillDown;
M.updateGauge = updateGauge;
M.bindChart = bindChart;
M.autoBindSliders = autoBindSliders;
M.bindControl = bindControl;
M.initGauges = initGauges;
M.initScrollReveal = initScrollReveal;
M.initNavTracking = initNavTracking;
M.relativeLuminance = relativeLuminance;
M.autoContrast = autoContrast;
M.charts = {
  sparkline,
  donut,
  barChart,
  areaChart,
  radar,
  halfGauge,
  bubble,
  liveGraph,
  hBarChart
};
registerExtras(M);

// src/ts/index.ts
var VERSION = "3.0.0";
export {
  COLOR,
  CONTINENTS,
  DEFAULTS,
  DPR,
  DURATION,
  EASE,
  EventBus,
  FONT,
  FerrariGauge,
  GAUGE_SIZES,
  ICON_SPARK,
  M as Maranello,
  RADIUS,
  SCOPE_COLOR,
  SERIES,
  SHADOW,
  SPACE,
  SPEEDO_FONT,
  SPEEDO_SIZES,
  START,
  SWEEP,
  TAU,
  TEXT_SIZE,
  VERSION,
  Z_INDEX,
  a11yPanel,
  actionIcons,
  addListener,
  addValidator,
  applySettings,
  areaChart,
  attachEvents,
  autoBind,
  autoBindSliders,
  autoContrast,
  autoTextColor,
  azIcons,
  barChart,
  bind,
  bindChart,
  bindControl,
  bubble,
  buildDOM,
  buildGaugePalette,
  buildPanel,
  buildSeries,
  buildTicks,
  buildUI,
  chartHiDpi,
  chartInteract,
  clamp,
  clampVal,
  cleanupTimers,
  closeDetailPanel,
  closeDrawer,
  closeModal,
  clusterMarkers,
  commandPalette,
  createDetailPanel,
  createEl,
  createElement,
  createGauge,
  createGaugesInContainer,
  cruiseLever,
  cssVar,
  cycleTheme,
  dataIcons,
  dataTable,
  datePicker,
  debounce,
  defaultMessages,
  detectTheme,
  donut,
  drawMarker,
  drawSpeedometer,
  easeOutCubic,
  editors,
  emit,
  eventBus,
  flipCounter,
  formatDate,
  formatDateSimple,
  formatNumber,
  formatTime,
  forms,
  funnel,
  gantt,
  getAccent,
  getCanvasSize,
  getFieldInput,
  getIcon,
  getInitials,
  getMarkerColors,
  getTheme,
  getVisibleProjected,
  hBarChart,
  halfGauge,
  hexLum,
  hexToRgba,
  hiDpiCanvas,
  hideTip,
  hitTest,
  iconCatalog,
  icons,
  initAutoResize,
  initCharCounter,
  initDrillDown,
  initDropdown,
  initFileUpload,
  initFormSteps,
  initForms,
  initGauges,
  initInlineEdit,
  initLiveValidation,
  initMessages,
  initNavTracking,
  initOrgTree,
  initPasswordToggle,
  initRotary,
  initScrollReveal,
  initSearchClear,
  initSlider,
  initTabs,
  initTagInput,
  initThemeToggle,
  lerp,
  liveGraph,
  loadSettings,
  loginScreen,
  manettino,
  mapView,
  markerRadius,
  navIcons,
  normalizeBars,
  normalizeHex,
  objectIcons,
  off,
  okrPanel,
  on,
  onDrillDown,
  openDetailPanel,
  openDrawer,
  openModal,
  profileMenu,
  progressRing,
  project,
  radar,
  redrawAll,
  registerDatePicker,
  reinitAll,
  relativeLuminance,
  renderBody,
  renderContent,
  renderHBar,
  renderIcon,
  renderLegend,
  renderPersonResults,
  renderSkeleton,
  renderers,
  resolveContainer,
  saveSettings,
  setTheme,
  showTip,
  showToast,
  sparkline,
  sparklineInteract,
  speedoPalette,
  speedometer,
  statusIcons,
  steppedRotary,
  systemStatus,
  throttle,
  toast,
  toggleLever,
  toggleNotifications,
  updateGauge,
  updateStatusSelectColor,
  validateField,
  validateForm,
  validators,
  valueToAngle
};
//# sourceMappingURL=index.js.map
