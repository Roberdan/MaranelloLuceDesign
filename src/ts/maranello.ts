/**
 * Maranello Luce Design - IIFE namespace bootstrap
 * Provides backward compatibility with window.Maranello for legacy consumers.
 * W3/W4 module registrations are in maranello-exports.ts.
 */

import { VERSION, eventBus, cssVar, palette, getTheme, setTheme, cycleTheme } from './index';
import { getAccent, clamp, lerp, hiDpiCanvas, createElement, escapeHtml } from './core/utils';
import { formatNumber, formatDate, debounce, throttle } from './core/utils';
import { icons, renderIcon, iconCatalog } from './icons';
import { navIcons } from './icons-nav';
import { statusIcons } from './icons-status';
import { actionIcons } from './icons-actions';
import { dataIcons } from './icons-data';
import { objectIcons } from './icons-objects';
import { azIcons } from './icons-az';
import { initThemeToggle } from './theme-toggle';
import { themeRotary } from './theme-rotary';
import { toast } from './toast';
import { openModal, closeModal } from './modal';
import { commandPalette } from './command-palette';
import { loginScreen } from './login';
import { systemStatus } from './system-status';
import { profileMenu } from './profile-menu';
import { FerrariGauge } from './gauge-engine';
import { buildGaugePalette } from './gauge-engine-palette';
import { createGauge, createGaugesInContainer, redrawAll, reinitAll, GAUGE_SIZES } from './gauge-engine-class';
import { speedometer } from './speedometer';
import { gantt } from './gantt';
import { dataTable } from './data-table';
import { datePicker } from './date-picker';
import { mapView } from './map-view';
import { mapboxView } from './map-mapbox';
import { funnel } from './funnel';
import { hBarChart } from './charts-hbar';
import {
  sparkline, donut, barChart, areaChart, radar, halfGauge, bubble, liveGraph,
} from './charts';
import { chartInteract, sparklineInteract } from './chart-interact';
import { autoResize, autoResizeAll } from './auto-resize';
import { openDetailPanel, closeDetailPanel, openDrawer, closeDrawer, initOrgTree } from './controls';
import { initSidebarToggle, initSidebarToggleAuto } from './sidebar-toggle';
import { createDetailPanel } from './detail-panel';
import { registerDatePicker, editors } from './detail-panel-editors';
import { buildUI } from './ai-chat-dom';
import { initMessages } from './ai-chat-messages';
import type { AIChatOptions, AIChatController } from './ai-chat-dom';

function aiChat(container: HTMLElement, opts?: Partial<AIChatOptions>): AIChatController {
  const full: Required<AIChatOptions> = {
    onSend: opts?.onSend ?? null,
    onQuickAction: opts?.onQuickAction ?? null,
    quickActions: opts?.quickActions ?? [],
    placeholder: opts?.placeholder ?? 'Type a message…',
    title: opts?.title ?? 'AI Assistant',
    welcomeMessage: opts?.welcomeMessage ?? null,
    avatar: opts?.avatar ?? null,
    agents: opts?.agents ?? [],
    activeAgent: opts?.activeAgent ?? null,
    onAgentChange: opts?.onAgentChange ?? (() => {}),
    onVoice: opts?.onVoice ?? (() => {}),
  } as Required<AIChatOptions>;
  const els = buildUI(container, full);
  initMessages(els.state, els, full);
  const { state, fab, panel, closeBtn } = els;

  function open() { panel.classList.add('mn-chat-panel--open'); panel.style.display = 'flex'; state.isOpen = true; }
  function close() { panel.classList.remove('mn-chat-panel--open'); panel.style.display = 'none'; state.isOpen = false; }
  function toggle() { state.isOpen ? close() : open(); }

  fab.addEventListener('click', toggle);
  closeBtn.addEventListener('click', close);

  return {
    open, close, toggle,
    isOpen: () => state.isOpen,
    addMessage: (role, content) => state.addMessage!(role, content),
    setTyping: (show) => state.setTyping!(show),
    clear: () => state.clear!(),
    showPulse: () => { els.pulse.classList.add('mn-chat-fab__pulse--active'); },
    destroy: () => { container.innerHTML = ''; },
  };
}
import { flipCounter } from './flip-counter';
import { progressRing } from './progress-ring';
import { cruiseLever, toggleLever } from './controls-ferrari';
import { manettino, steppedRotary } from './controls-ferrari-dials';
import { initDropdown, initTabs } from './controls-dialogs';
import { initRotary, initSlider } from './controls-drag';
import { a11yPanel } from './a11y-panel';
import { okrPanel } from './okr-panel';
import { emit, on, off, bind, autoBind, onDrillDown } from './data-binding-events';
import { updateGauge, bindChart, autoBindSliders, bindControl } from './data-binding-ui';
import { initGauges, initScrollReveal, initNavTracking, relativeLuminance, autoContrast } from './observers';
import { gridLayout } from './grid-layout';
import { socialGraph } from './social-graph';
import { networkMessages } from './network-messages';
import { neuralNodes } from './neural-nodes';
import { registerExtras } from './maranello-exports';

declare global {
  interface Window {
    Maranello: Record<string, unknown>;
  }
}

const M: Record<string, unknown> = (window.Maranello = window.Maranello || {});

// Version & event system
M.VERSION = VERSION;
M.emit = emit;
M.on = on;
M.off = off;
M.eventBus = eventBus;

// Theme utilities
M.getTheme = getTheme;
M.setTheme = setTheme;
M.cycleTheme = cycleTheme;
M.initThemeToggle = initThemeToggle;
M.themeRotary = themeRotary;
M.getAccent = getAccent;
M.cssVar = cssVar;
M.palette = palette;

// Shared helpers
M.clamp = clamp;
M.lerp = lerp;
M.hiDpiCanvas = hiDpiCanvas;
M.createElement = createElement;
M.escapeHtml = escapeHtml;
M.formatNumber = formatNumber;
M.formatDate = formatDate;
M.debounce = debounce;
M.throttle = throttle;

// Icons
M.icons = icons;
M.renderIcon = renderIcon;
M.iconCatalog = iconCatalog;
M.navIcons = navIcons;
M.statusIcons = statusIcons;
M.actionIcons = actionIcons;
M.dataIcons = dataIcons;
M.objectIcons = objectIcons;
M.azIcons = azIcons;

// Components
M.toast = toast;
M.openModal = openModal;
M.closeModal = closeModal;
M.commandPalette = commandPalette;
M.loginScreen = loginScreen;
M.systemStatus = systemStatus;
M.profileMenu = profileMenu;

// Gauge
M.FerrariGauge = FerrariGauge;
M.buildGaugePalette = buildGaugePalette;
M.createGauge = createGauge;
M.createGaugesInContainer = createGaugesInContainer;
M.redrawAll = redrawAll;
M.reinitAll = reinitAll;
M.GAUGE_SIZES = GAUGE_SIZES;

// Visualization components
M.speedometer = speedometer;
M.gantt = gantt;
M.dataTable = dataTable;
M.datePicker = datePicker;
M.mapView = mapView;
M.mapboxView = mapboxView;
M.funnel = funnel;
M.aiChat = aiChat;
M.flipCounter = flipCounter;
M.progressRing = progressRing;
M.networkMessages = networkMessages;
M.neuralNodes = neuralNodes;
M.hBarChart = hBarChart;
M.okrPanel = okrPanel;
M.gridLayout = gridLayout;
M.socialGraph = socialGraph;
M.chartInteract = chartInteract;
M.sparklineInteract = sparklineInteract;

// Detail panel
M.openDetailPanel = openDetailPanel;
M.closeDetailPanel = closeDetailPanel;
M.detailPanel = openDetailPanel;
M.createDetailPanel = createDetailPanel;
M.registerDatePicker = registerDatePicker;
M.editors = editors;

// Drawer / org
M.openDrawer = openDrawer;
M.closeDrawer = closeDrawer;
M.initOrgTree = initOrgTree;

// Ferrari controls
M.cruiseLever = cruiseLever;
M.toggleLever = toggleLever;
M.manettino = manettino;
M.steppedRotary = steppedRotary;
M.initRotary = manettino; // alias for mn-ferrari-control WC

// Dialog / drag controls
M.initDropdown = initDropdown;
M.initTabs = initTabs;
M.initDragRotary = initRotary;
M.initSlider = initSlider;

// A11y panel
M.a11yPanel = a11yPanel;

// Data binding
M.bind = bind;
M.autoBind = autoBind;
M.onDrillDown = onDrillDown;
M.updateGauge = updateGauge;
M.bindChart = bindChart;
M.autoBindSliders = autoBindSliders;
M.bindControl = bindControl;

// Observers
M.initGauges = initGauges;
M.initScrollReveal = initScrollReveal;
M.initNavTracking = initNavTracking;
M.relativeLuminance = relativeLuminance;
M.autoContrast = autoContrast;

// Responsive
M.autoResize = autoResize;
M.autoResizeAll = autoResizeAll;
M.initSidebarToggle = initSidebarToggle;
M.initSidebarToggleAuto = initSidebarToggleAuto;

// Charts namespace (mn-chart WC looks up M.charts[type])
M.charts = {
  sparkline, donut, barChart, areaChart, radar, halfGauge, bubble, liveGraph, hBarChart,
};

// W3/W4 draw primitives and map internals
registerExtras(M);

export { M as Maranello };
