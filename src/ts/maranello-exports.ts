/**
 * Maranello Luce Design - IIFE extra exports (W3/W4 draw primitives + map internals)
 * Called by maranello.ts to register lower-level APIs on window.Maranello.
 */

import {
  SPEEDO_FONT, SPEEDO_SIZES, SWEEP, START,
  easeOutCubic, valueToAngle, speedoPalette,
} from './speedometer-palette';
import { drawSpeedometer } from './speedometer-draw';
import {
  hexLum, createEl, clampVal, normalizeHex, buildTicks,
  cleanupTimers, addListener, showTip as showHBarTip,
  hideTip as hideHBarTip, normalizeBars, renderHBar,
} from './h-bar-chart-draw';
import {
  updateStatusSelectColor, renderPersonResults,
  renderers, getInitials, formatDateSimple,
} from './detail-panel-renderers';
import {
  showToast, renderSkeleton, validateField as validateDetailField,
  buildDOM, renderBody,
} from './detail-panel-ui';
import {
  DEFAULTS as A11Y_DEFAULTS, loadSettings, saveSettings,
  applySettings, buildPanel,
} from './a11y-panel-dom';
import {
  DPR, TAU, CONTINENTS, detectTheme, getMarkerColors,
  project, hexToRgba, getVisibleProjected, clusterMarkers,
  markerRadius, drawMarker, renderLegend, hitTest,
} from './map-view-helpers';
import {
  showTip as showMapTip, hideTip as hideMapTip, attachEvents,
} from './map-view-events';

/** Register W3/W4 primitives on the window.Maranello namespace object. */
export function registerExtras(M: Record<string, unknown>): void {
  // Speedometer palette & draw primitives
  M.SPEEDO_FONT = SPEEDO_FONT;
  M.SPEEDO_SIZES = SPEEDO_SIZES;
  M.SPEEDO_SWEEP = SWEEP;
  M.SPEEDO_START = START;
  M.easeOutCubic = easeOutCubic;
  M.valueToAngle = valueToAngle;
  M.speedoPalette = speedoPalette;
  M.drawSpeedometer = drawSpeedometer;

  // H-bar chart draw primitives
  M.hexLum = hexLum;
  M.createEl = createEl;
  M.clampVal = clampVal;
  M.normalizeHex = normalizeHex;
  M.buildTicks = buildTicks;
  M.cleanupTimers = cleanupTimers;
  M.addHBarListener = addListener;
  M.showHBarTip = showHBarTip;
  M.hideHBarTip = hideHBarTip;
  M.normalizeBars = normalizeBars;
  M.renderHBar = renderHBar;

  // Detail panel renderers/UI helpers
  M.updateStatusSelectColor = updateStatusSelectColor;
  M.renderPersonResults = renderPersonResults;
  M.renderers = renderers;
  M.getInitials = getInitials;
  M.formatDateSimple = formatDateSimple;
  M.showPanelToast = showToast;
  M.renderSkeleton = renderSkeleton;
  M.validateDetailField = validateDetailField;
  M.buildDetailDOM = buildDOM;
  M.renderPanelBody = renderBody;

  // A11y panel DOM primitives
  M.A11Y_DEFAULTS = A11Y_DEFAULTS;
  M.loadA11ySettings = loadSettings;
  M.saveA11ySettings = saveSettings;
  M.applyA11ySettings = applySettings;
  M.buildA11yPanel = buildPanel;

  // Map view helpers + events
  M.MAP_DPR = DPR;
  M.MAP_TAU = TAU;
  M.CONTINENTS = CONTINENTS;
  M.detectMapTheme = detectTheme;
  M.getMarkerColors = getMarkerColors;
  M.projectLatLon = project;
  M.hexToRgba = hexToRgba;
  M.getVisibleProjected = getVisibleProjected;
  M.clusterMarkers = clusterMarkers;
  M.markerRadius = markerRadius;
  M.drawMarker = drawMarker;
  M.renderMapLegend = renderLegend;
  M.hitTest = hitTest;
  M.showMapTip = showMapTip;
  M.hideMapTip = hideMapTip;
  M.attachMapEvents = attachEvents;
}
