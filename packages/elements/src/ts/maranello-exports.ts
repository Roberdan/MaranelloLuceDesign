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
  getDPR, TAU, CONTINENTS, detectTheme, getMarkerColors,
  project, hexToRgba, getVisibleProjected, clusterMarkers,
  markerRadius, drawMarker, renderLegend, hitTest,
} from './map-view-helpers';
import {
  showTip as showMapTip, hideTip as hideMapTip, attachEvents,
} from './map-view-events';
import { activityFeed } from './activity-feed';
import { bcgMatrix } from './charts-bcg-matrix';
import { nineBoxMatrix } from './nine-box-matrix';
import { swotMatrix } from './swot-matrix';
import { approvalChain } from './approval-chain';
import { agentTrace } from './agent-trace';
import { tokenMeter } from './token-meter';
import { streamingText } from './streaming-text';
import { riskMatrix } from './charts-risk-matrix';
import { kpiScorecard } from './kpi-scorecard';
import { cohortGrid } from './cohort-grid';
import { auditLog } from './audit-log';
import { agentCostBreakdown } from './agent-cost-breakdown';
import { costTimeline } from './charts-cost-timeline';
import { businessModelCanvas } from './business-model-canvas';
import { userTable } from './user-table';
import { customerJourney } from './customer-journey';
import { adminShell } from './admin-shell';
import { sectionCard } from './section-card';
import { settingsPanel } from './settings-panel';
import { dashboardStrip } from './dashboard-strip';
import { heatmap } from './heatmap';
import { dateRangePicker } from './date-range-picker';
import { bulletChart } from './charts-bullet';
import { notificationCenter } from './notification-center';
import { waterfallChart } from './charts-waterfall';
import { confidenceChart } from './charts-confidence';
import { decisionMatrix } from './decision-matrix';
import { renderSourceCards } from './source-card';
import { initForms, forms } from './forms';
import { validateField as validateFormField, validateForm, initLiveValidation, addValidator } from './forms-validate';
import { initPasswordToggle, initFileUpload, initFormSteps, initInlineEdit } from './forms-widgets';
import { toggleNotifications, initDrillDown } from './controls';
import { AsyncSelect } from './async-select';
import { FacetWorkbench } from './facet-workbench';
import { DashboardRenderer } from './dashboard-renderer';
import { EntityWorkbench } from './entity-workbench';

/** Register W3/W4 primitives + forms + missing controls on the window.Maranello namespace object. */
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
  M.MAP_DPR = getDPR();
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

  // Dashboard components (v4.6 / v4.7)
  M.activityFeed = activityFeed;
  M.dateRangePicker = dateRangePicker;
  M.bulletChart = bulletChart;
  M.notificationCenter = notificationCenter;
  M.waterfallChart = waterfallChart;
  M.confidenceChart = confidenceChart;
  M.decisionMatrix = decisionMatrix;
  M.renderSourceCards = renderSourceCards;

  // Strategy components (v4.8)
  M.bcgMatrix = bcgMatrix;
  M.nineBoxMatrix = nineBoxMatrix;
  M.swotMatrix = swotMatrix;
  M.approvalChain = approvalChain;

  // Agentic AI + BI (v4.9)
  M.agentTrace = agentTrace;
  M.tokenMeter = tokenMeter;
  M.streamingText = streamingText;
  M.riskMatrix = riskMatrix;
  M.kpiScorecard = kpiScorecard;
  M.cohortGrid = cohortGrid;

  // Admin & FinOps (v4.10)
  M.auditLog = auditLog;
  M.agentCostBreakdown = agentCostBreakdown;
  M.costTimeline = costTimeline;
  M.businessModelCanvas = businessModelCanvas;
  M.userTable = userTable;

  // Forms (v1 — missing from original IIFE registration)
  M.initForms = initForms;
  M.forms = forms;
  M.validateField = validateFormField;
  M.validateForm = validateForm;
  M.initLiveValidation = initLiveValidation;
  M.addValidator = addValidator;
  M.initPasswordToggle = initPasswordToggle;
  M.initFileUpload = initFileUpload;
  M.initFormSteps = initFormSteps;
  M.initInlineEdit = initInlineEdit;

  // Controls (missing)
  M.toggleNotifications = toggleNotifications;
  M.initDrillDown = initDrillDown;
  M.AsyncSelect = AsyncSelect;
  M.FacetWorkbench = FacetWorkbench;
  M.EntityWorkbench = EntityWorkbench;
  M.DashboardRenderer = DashboardRenderer;

  // v4.19 — Customer Journey + Admin Components
  M.customerJourney = customerJourney;
  M.adminShell = adminShell;
  M.sectionCard = sectionCard;
  M.settingsPanel = settingsPanel;

  // v5.10 — Dashboard Strip
  M.dashboardStrip = dashboardStrip;

  // Capacity Heatmap
  M.heatmap = heatmap;
}
