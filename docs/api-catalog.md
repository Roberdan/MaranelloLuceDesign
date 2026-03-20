<!-- Reference catalog — not loaded in context, use for lookup -->
# API Catalog — v4.19.2

## Themes (5)

| Theme | Body class | Accent | Notes |
|---|---|---|---|
| Editorial | (none) | `#FFC72C` | Default dark/light mix |
| Nero | `mn-nero` | `#FFC72C` | Pure dark |
| Avorio | `mn-avorio` | `#DC0000` | Warm ivory light — danger btn is outline |
| Colorblind | `mn-colorblind` | `#0072B2` | Okabe-Ito accessible palette |
| Sugar | `mn-sugar` | `#000000` | Light grey, rounded corners |
| Sugar + Colorblind | `mn-sugar mn-colorblind` | `#0072B2` | Cross-theme combination |

## IIFE Exports (107 on `window.Maranello`)

> v4.0.0: removed `getGlass`/`setGlass`/`toggleGlass` (glass theme dropped). Added `palette()`.

Charts (11): `sparkline` · `donut` · `barChart` · `hBarChart` · `areaChart` · `liveGraph` · `halfGauge` · `progressRing` · `flipCounter` · `radar` · `bubble`
Gauge (7): `FerrariGauge` · `createGauge` · `createGaugesInContainer` · `redrawAll` · `reinitAll` · `buildGaugePalette` · `GAUGE_SIZES`
Speedometer (2): `speedometer` · `drawSpeedometer`
Gantt (1): `gantt`
Funnel (4): `funnel` · `hexLum` · `autoTextColor` · `resolveContainer`
DataTable (1): `dataTable`
Controls — Panels & Nav (7): `openDetailPanel` · `closeDetailPanel` · `openDrawer` · `closeDrawer` · `initOrgTree` · `toggleNotifications` · `initDrillDown`
Controls — Ferrari (4): `manettino` · `steppedRotary` · `cruiseLever` · `toggleLever`
Controls — UI (4): `initDropdown` · `initTabs` · `initRotary` · `initSlider`
Dialogs (4): `openModal` · `closeModal` · `toast` · `commandPalette`
Forms (12): `initForms` · `forms` · `validateField` · `validateForm` · `initLiveValidation` · `addValidator` · `initAutoResize` · `initTagInput` · `initPasswordToggle` · `initFileUpload` · `initFormSteps` · `initInlineEdit`
Data Binding (10): `emit` · `on` · `off` · `bind` · `autoBind` · `onDrillDown` · `updateGauge` · `bindChart` · `autoBindSliders` · `bindControl`
UI Screens (5): `loginScreen` · `buildUI` · `systemStatus` · `profileMenu` · `datePicker`
Observers (5): `initGauges` · `initScrollReveal` · `initNavTracking` · `autoContrast` · `relativeLuminance`
Icons (7): `icons` · `renderIcon` · `iconCatalog` · `navIcons` · `statusIcons` · `actionIcons` · `dataIcons`
Theme & Utilities (9): `initThemeToggle` · `themeRotary` · `setTheme` · `getTheme` · `cycleTheme` · `getAccent` · `cssVar` · `palette` · `debounce` · `throttle`
Detail Panel (5): `createDetailPanel` · `registerDatePicker` · `editors` · `renderers` · `a11yPanel`
OKR (1): `okrPanel`
Map (2): `mapView` · `attachEvents`
Admin (2): `userTable` · `auditLog`
AI/Agent (4): `agentCostBreakdown` · `agentTrace` · `tokenMeter` · `streamingText`
Strategy (5): `businessModelCanvas` · `bcgMatrix` · `nineBoxMatrix` · `swotMatrix` · `decisionMatrix`
Analytics (4): `kpiScorecard` · `cohortGrid` · `riskMatrix` · `approvalChain`
Charts v4.11 (4): `costTimeline` · `waterfallChart` · `confidenceChart` · `bulletChart`
Inputs (1): `dateRangePicker`
Feed/Notify (2): `activityFeed` · `notificationCenter`

## Web Components (31)

| Tag | Attrs |
|---|---|
| `mn-chart` | `type`, `data`, `options`, `width`, `height` |
| `mn-hbar` | `data`, `options` |
| `mn-gauge` | `value`, `max`, `unit`, `label`, `size`, `config` |
| `mn-speedometer` | `value`, `max`, `size`, `label`, `unit` |
| `mn-gantt` | `tasks`, `zoom`, `label-width` |
| `mn-funnel` | `stages`, `show-conversion`, `animate` |
| `mn-data-table` | `columns`, `data`, `page-size`, `group-by`, `selectable`, `compact` |
| `mn-detail-panel` | `title`, `sections`, `open` |
| `mn-okr` | `objectives`, `options` |
| `mn-ferrari-control` | `type`, `options` |
| `mn-date-picker` | `value`, `min`, `max`, `disabled-dates` |
| `mn-modal` | `open`, `title` |
| `mn-toast` | `title`, `message`, `type`, `duration` |
| `mn-command-palette` | `items`, `placeholder` |
| `mn-login` | `health-url`, `title`, `subtitle` |
| `mn-chat` | `title`, `welcome-message`, `avatar`, `quick-actions` |
| `mn-system-status` | `services`, `poll-interval`, `version`, `environment` |
| `mn-profile` | `name`, `email`, `avatar-url`, `sections` |
| `mn-map` | `markers`, `zoom`, `center`, `theme` |
| `mn-mapbox` | `markers`, `zoom`, `center`, `theme`, `style` |
| `mn-theme-toggle` | `mode` |
| `mn-theme-rotary` | `size` |
| `mn-tabs` / `mn-tab` | `active` / `label` |
| `mn-section-nav` | `sections`, `current`, `data-theme`, `data-pos` |
| `mn-a11y` | (FAB + settings panel, auto-mounts by default) |
| `mn-app-shell` | `layout` (`full`\|`split`\|`stacked`\|`docked-bottom`\|`dual-panel`\|`side-detail`) |
| `mn-dashboard` | `schema` (JSON), `data` (JSON) |
| `mn-facet-workbench` | `facets` (JSON), `presets` (JSON) |
| `mn-entity-workbench` | `open`, `schema` (JSON), `data` (JSON), `editable` |
| `mn-async-select` | `placeholder`, `min-chars`, `debounce` |
| `mn-state-scaffold` | `state` (`loading`\|`empty`\|`error`\|`partial`\|`no-results`), `message`, `action-label` |

## Accessibility Helpers

### `applyChartA11y(canvas, label, data?)`

| Param | Type | Description |
|---|---|---|
| `canvas` | `HTMLCanvasElement` | Target canvas |
| `label` | `string` | Accessible label (also used for sr-only caption) |
| `data` | `A11yDataRow[]` | Optional data rows. When provided, injects sr-only `<table>` with `<caption>` |

`A11yDataRow`: `{ label: string; value: string | number }`

Backward compatible: omitting `data` uses text-only sr-only span (v4.0 behavior).

## CSS Class Families

| Prefix | Purpose | File(s) |
|---|---|---|
| `mn-card` | Content cards, stat cards | `components.css` |
| `mn-sidebar` | App sidebar navigation | `layouts-sidebar.css` |
| `mn-heatmap`, `mn-cap-grid`, `mn-cap-heatmap` | Heatmap / capacity grid | `layouts-heatmap.css`, `layouts-capacity-heatmap.css` |
| `mn-chat-*` | AI chat panel, messages | `layouts-chat-login.css` |
| `mn-login` | Login screen | `layouts-chat-login.css` |
| `mn-drawer` | Slide-out drawer | `layouts-toolbar-drawer.css` |
| `mn-table`, `mn-dt-*` | Data table | `layouts-data-table-*.css` |
| `mn-detail-panel` | Detail/edit panel | `layouts-detail-panel.css` |
| `mn-section-*` | Section backgrounds (dark/light/ivory/accent) | `base.css` |
| `mn-btn` | Buttons | `components.css` |
| `mn-nav`, `mn-breadcrumb` | Navigation | `layouts-nav-controls.css` |
| `mn-form-*`, `mn-field`, `mn-input` | Forms | `forms-*.css` |
| `mn-ctrl-*` | Ferrari controls (manettino, lever) | `controls-*.css` |
| `mn-gantt` | Gantt chart | `charts-gantt-timeline.css` |
| `mn-funnel` | Funnel/sankey | `layouts-funnel.css` |
| `mn-org-tree` | Org chart | `layouts-org-tree.css` |
| `mn-modal`, `mn-toast`, `mn-tooltip` | Overlays | `extended-*.css` |
| `mn-avatar`, `mn-badge`, `mn-tag` | Atoms | `extended-avatar-spinner.css`, `components.css` |
| `mn-sim-*` | Simulator panel | `layouts-sim-panel.css` |
| `mn-strip`, `mn-pod` | Strip layout, pods | `patterns-strip-pod.css` |
| `mn-signal-panel`, `mn-binnacle` | Signal/status | `patterns-signal-binnacle.css` |
