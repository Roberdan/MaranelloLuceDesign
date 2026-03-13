/**
 * Maranello Luce Design - IIFE namespace bootstrap
 * Provides backward compatibility with window.Maranello for legacy consumers.
 */

import { VERSION, eventBus, cssVar, getTheme, setTheme, cycleTheme } from './index';
import { getAccent, clamp, lerp, hiDpiCanvas, createElement } from './core/utils';
import { formatNumber, formatDate, debounce, throttle } from './core/utils';
import { icons, renderIcon, iconCatalog } from './icons';
import { initThemeToggle } from './theme-toggle';
import { toast } from './toast';
import { openModal, closeModal } from './modal';
import { commandPalette } from './command-palette';
import { loginScreen } from './login';
import { systemStatus } from './system-status';
import { profileMenu } from './profile-menu';
import { FerrariGauge } from './gauge-engine';
import { speedometer } from './speedometer';
import { gantt } from './gantt';
import { dataTable } from './data-table';
import { datePicker } from './date-picker';
import { mapView } from './map-view';
import { funnel } from './funnel';
import { hBarChart } from './charts-hbar';
import {
  sparkline, donut, barChart, areaChart, radar, halfGauge, bubble, liveGraph,
} from './charts';
import { openDetailPanel, closeDetailPanel } from './controls';
import { buildUI as aiChat } from './ai-chat-dom';
import { flipCounter } from './flip-counter';
import { progressRing } from './progress-ring';
import { cruiseLever, toggleLever } from './controls-ferrari';
import { manettino, steppedRotary } from './controls-ferrari-dials';
import { okrPanel } from './okr-panel';

declare global {
  interface Window {
    Maranello: Record<string, unknown>;
  }
}

const M: Record<string, unknown> = (window.Maranello = window.Maranello || {});

// Version
M.VERSION = VERSION;

// Event system (backward-compatible M.emit / M.on / M.off)
M.emit = (name: string, detail: unknown) => eventBus.emit(name, detail);
M.on = (name: string, handler: (detail: unknown) => void) => eventBus.on(name, handler);
M.off = (name: string, handler: (detail: unknown) => void) => eventBus.off(name, handler);

// Theme utilities
M.getTheme = getTheme;
M.setTheme = setTheme;
M.cycleTheme = cycleTheme;
M.initThemeToggle = initThemeToggle;
M.getAccent = getAccent;
M.cssVar = cssVar;

// Shared helpers
M.clamp = clamp;
M.lerp = lerp;
M.hiDpiCanvas = hiDpiCanvas;
M.createElement = createElement;
M.formatNumber = formatNumber;
M.formatDate = formatDate;
M.debounce = debounce;
M.throttle = throttle;

// Icons
M.icons = icons;
M.renderIcon = renderIcon;
M.iconCatalog = iconCatalog;

// Components
M.toast = toast;
M.openModal = openModal;
M.closeModal = closeModal;
M.commandPalette = commandPalette;
M.loginScreen = loginScreen;
M.systemStatus = systemStatus;
M.profileMenu = profileMenu;

// Visualization components (used by Web Components via window.Maranello)
M.FerrariGauge = FerrariGauge;
M.speedometer = speedometer;
M.gantt = gantt;
M.dataTable = dataTable;
M.datePicker = datePicker;
M.mapView = mapView;
M.funnel = funnel;
M.aiChat = aiChat;
M.flipCounter = flipCounter;
M.progressRing = progressRing;
M.openDetailPanel = openDetailPanel;
M.closeDetailPanel = closeDetailPanel;
M.detailPanel = openDetailPanel;
M.hBarChart = hBarChart;
M.okrPanel = okrPanel;

// Ferrari controls (used by mn-ferrari-control WC)
M.cruiseLever = cruiseLever;
M.toggleLever = toggleLever;
M.manettino = manettino;
M.steppedRotary = steppedRotary;
M.initRotary = manettino; // alias: mn-ferrari-control uses M.initRotary for rotary type

// Charts namespace (mn-chart WC looks up M.charts[type])
M.charts = {
  sparkline, donut, barChart, areaChart, radar, halfGauge, bubble, liveGraph, hBarChart,
};

export { M as Maranello };
