<!-- v3.1.0 | 2025-07-21 -->
# AI Agent Guide — Maranello Luce Design

Single source of truth for AI agents. Package: `maranello-luce-design-business` v3.0.0.

## Decision Tree

| I need… | Function | Import subpath | Render |
|---|---|---|---|
| Inline trend | `sparkline` | `/charts` | Canvas |
| Pie/donut | `donut` | `/charts` | Canvas |
| Vertical bars | `barChart` | `/charts` | Canvas |
| Horizontal bars | `hBarChart` | `.` | DOM |
| Time series | `areaChart` | `/charts` | Canvas |
| Real-time line | `liveGraph` | `/charts` | Canvas |
| Multi-axis scoring | `radar` | `/charts` | Canvas |
| 3D scatter | `bubble` | `/charts` | Canvas |
| Semicircular meter | `halfGauge` | `/charts` | Canvas |
| Progress circle | `progressRing` | `.` | SVG |
| Animated counter | `flipCounter` | `.` | DOM |
| KPI gauge | `FerrariGauge` / `createGauge` | `/gauge` | Canvas |
| Speed gauge | `speedometer` | `.` | Canvas |
| Project timeline | `gantt` | `/gantt` | Canvas+DOM |
| Pipeline | `funnel` | `.` | SVG+DOM |
| Data grid | `dataTable` | `.` | DOM |
| Record detail | `openDetailPanel` | `/controls` | DOM |
| OKR tracking | `okrPanel` | `.` | DOM |
| Geographic data | `mapView` | `.` | Canvas+DOM |
| Date input | `datePicker` | `.` | DOM |
| Notifications | `toast` | `.` | DOM |
| Dialog | `openModal` | `.` | DOM |
| Quick actions | `commandPalette` | `.` | DOM |
| AI assistant | `buildUI` | `.` | DOM |
| Login page | `loginScreen` | `.` | DOM |
| System health | `systemStatus` | `.` | DOM |
| User menu | `profileMenu` | `.` | DOM |
| Mode selector | `manettino` | `.` | DOM |
| On/off switch | `toggleLever` | `.` | DOM |
| Stepped dial | `steppedRotary` | `.` | DOM |
| Form validation | `initForms` / `forms` | `/forms` | DOM |
| Theme switching | `initThemeToggle` / `setTheme` | `.` | DOM |
| Org hierarchy | `initOrgTree` | `/controls` | DOM |
| Drawer | `openDrawer` | `/controls` | DOM |
| Accessibility | `a11yPanel` | `/controls` | DOM |
| Tabs | `initTabs` | `/controls` | DOM |
| Dropdown | `initDropdown` | `/controls` | DOM |
| Rotary knob | `initRotary` | `/controls` | DOM |
| Slider | `initSlider` | `/controls` | DOM |

## All Exports (87)

| # | Export | Signature | Category |
|---|---|---|---|
| 1 | `sparkline` | `(canvas, number[], opts?) → void` | Chart |
| 2 | `donut` | `(canvas, DonutSegment[]) → void` | Chart |
| 3 | `barChart` | `(canvas, BarDataItem[]) → void` | Chart |
| 4 | `hBarChart` | `(selector, HBarChartOptions) → ctrl` | Chart |
| 5 | `areaChart` | `(canvas, AreaDataset[]) → void` | Chart |
| 6 | `liveGraph` | `(canvas, LiveGraphOptions) → ctrl` | Chart |
| 7 | `halfGauge` | `(canvas, HalfGaugeOptions) → void` | Chart |
| 8 | `progressRing` | `(el, ProgressRingOptions) → void` | Chart |
| 9 | `flipCounter` | `(el, FlipCounterOptions) → ctrl` | Chart |
| 10 | `radar` | `(canvas, RadarDataItem[]) → void` | Chart |
| 11 | `bubble` | `(canvas, BubbleDataItem[]) → void` | Chart |
| 12 | `FerrariGauge` | `new (canvas) → FerrariGauge` | Gauge |
| 13 | `createGauge` | `(opts: GaugeFactoryOptions) → FerrariGauge\|null` | Gauge |
| 14 | `createGaugesInContainer` | `(container?, selector?) → GaugeEntry[]` | Gauge |
| 15 | `redrawAll` | `(entries: GaugeEntry[]) → void` | Gauge |
| 16 | `reinitAll` | `(entries: GaugeEntry[]) → void` | Gauge |
| 17 | `buildGaugePalette` | `() → GaugeRenderPalette` | Gauge |
| 18 | `GAUGE_SIZES` | `Record<string, number>` | Gauge |
| 19 | `speedometer` | `(canvas, SpeedometerOptions) → ctrl` | Gauge |
| 20 | `drawSpeedometer` | `(canvas, state) → void` | Gauge |
| 21 | `gantt` | `(el, GanttTask[], opts?) → GanttController\|null` | Gantt |
| 22 | `funnel` | `(selector, { data: SankeyData }) → ctrl` | Viz |
| 23 | `hexLum` | `(hex, lum) → string` | Viz |
| 24 | `autoTextColor` | `(bg) → string` | Viz |
| 25 | `resolveContainer` | `(sel) → HTMLElement` | Viz |
| 26 | `dataTable` | `(selector, DataTableOptions) → ctrl` | Table |
| 27 | `openDetailPanel` | `(id) → void` | Panel |
| 28 | `closeDetailPanel` | `(id) → void` | Panel |
| 29 | `createDetailPanel` | `(opts: DetailPanelOptions) → ctrl` | Panel |
| 30 | `openDrawer` | `(id) → void` | Panel |
| 31 | `closeDrawer` | `(id) → void` | Panel |
| 32 | `initOrgTree` | `(container) → void` | Panel |
| 33 | `toggleNotifications` | `(id) → void` | Panel |
| 34 | `initDrillDown` | `(container) → void` | Panel |
| 35 | `manettino` | `(el, opts) → ctrl` | Control |
| 36 | `steppedRotary` | `(el, opts) → ctrl` | Control |
| 37 | `cruiseLever` | `(el, opts) → ctrl` | Control |
| 38 | `toggleLever` | `(el, opts) → ctrl` | Control |
| 39 | `initDropdown` | `(el) → DropdownController` | Control |
| 40 | `initTabs` | `(el) → TabsController` | Control |
| 41 | `initRotary` | `(el) → RotaryController` | Control |
| 42 | `initSlider` | `(el) → SliderController` | Control |
| 43 | `openModal` | `(id) → void` | Dialog |
| 44 | `closeModal` | `(id) → void` | Dialog |
| 45 | `toast` | `(ToastOptions) → void` | Dialog |
| 46 | `commandPalette` | `(id) → void` | Dialog |
| 47 | `initForms` | `(root?) → void` | Form |
| 48 | `forms` | `object (facade)` | Form |
| 49 | `validateField` | `(input, validators) → boolean` | Form |
| 50 | `validateForm` | `(form) → boolean` | Form |
| 51 | `initLiveValidation` | `(form) → void` | Form |
| 52 | `addValidator` | `(name, fn) → void` | Form |
| 53 | `initAutoResize` | `(textarea) → void` | Form |
| 54 | `initTagInput` | `(el) → TagInputApi` | Form |
| 55 | `initPasswordToggle` | `(el) → void` | Form |
| 56 | `initFileUpload` | `(el) → FileUploadApi` | Form |
| 57 | `initFormSteps` | `(el) → FormStepsApi` | Form |
| 58 | `initInlineEdit` | `(el) → void` | Form |
| 59 | `emit` | `(event, data) → void` | Binding |
| 60 | `on` | `(event, cb) → void` | Binding |
| 61 | `off` | `(event, cb) → void` | Binding |
| 62 | `bind` | `(selector, event, key) → void` | Binding |
| 63 | `autoBind` | `() → void` | Binding |
| 64 | `onDrillDown` | `(handler) → void` | Binding |
| 65 | `updateGauge` | `(selector, value) → void` | Binding |
| 66 | `bindChart` | `(canvas, type, opts) → void` | Binding |
| 67 | `autoBindSliders` | `() → void` | Binding |
| 68 | `bindControl` | `(el, opts) → void` | Binding |
| 69 | `loginScreen` | `(el, LoginScreenOptions) → ctrl` | Screen |
| 70 | `buildUI` | `(el, AIChatOptions) → ctrl` | Screen |
| 71 | `systemStatus` | `(el, SystemStatusOptions) → ctrl` | Screen |
| 72 | `profileMenu` | `(el, ProfileMenuOptions) → ctrl` | Screen |
| 73 | `datePicker` | `(el, DatePickerOptions) → ctrl` | Screen |
| 74 | `okrPanel` | `(el, OkrPanelOptions) → ctrl` | Screen |
| 75 | `mapView` | `(el, MapViewOptions) → ctrl` | Screen |
| 76 | `attachEvents` | `(map, callbacks) → cleanup` | Map |
| 77 | `initGauges` | `(opts?) → FerrariGauge[]` | Observer |
| 78 | `initScrollReveal` | `(opts?) → void` | Observer |
| 79 | `initNavTracking` | `(opts?) → void` | Observer |
| 80 | `autoContrast` | `(selector, threshold?) → void` | Observer |
| 81 | `relativeLuminance` | `(bgColor) → number\|null` | Observer |
| 82 | `icons` | `Record<string, string>` (SVG map) | Icon |
| 83 | `renderIcon` | `(name, size?) → string` | Icon |
| 84 | `iconCatalog` | `string[]` | Icon |
| 85 | `initThemeToggle` | `() → ThemeToggleController` | Theme |
| 86 | `setTheme` | `(name) → void` | Theme |
| 87 | `getTheme` | `() → string` | Theme |

**Also exported**: `cycleTheme`, `getAccent`, `cssVar`, `debounce`, `throttle`, `createElement`, `formatNumber`, `formatDate`, `clamp`, `lerp`, `hiDpiCanvas`, `VERSION`, `EventBus`, `eventBus`, `a11yPanel`, `registerDatePicker`, `editors`, `renderers`, `navIcons`, `statusIcons`, `actionIcons`, `dataIcons`, `objectIcons`, `azIcons`, design token constants (`COLOR`, `FONT`, `TEXT_SIZE`, `SPACE`, `DURATION`, `EASE`, `RADIUS`, `SHADOW`, `SCOPE_COLOR`, `Z_INDEX`).

## Web Components (23)

| Tag | Observed Attributes | Wraps |
|---|---|---|
| `mn-chart` | `type` `data` `options` `width` `height` | sparkline/donut/bar/area/radar/bubble/liveGraph |
| `mn-hbar` | `data` `options` | hBarChart |
| `mn-gauge` | `value` `max` `unit` `label` `size` `config` | FerrariGauge |
| `mn-speedometer` | `value` `max` `size` `label` `unit` | speedometer |
| `mn-gantt` | `tasks` `zoom` `label-width` | gantt |
| `mn-funnel` | `stages` `show-conversion` `animate` | funnel |
| `mn-data-table` | `columns` `data` `page-size` `group-by` `selectable` `compact` | dataTable |
| `mn-detail-panel` | `title` `sections` `open` | openDetailPanel |
| `mn-okr` | `objectives` `options` | okrPanel |
| `mn-ferrari-control` | `type` `options` | manettino/steppedRotary/cruiseLever/toggleLever |
| `mn-date-picker` | `value` `min` `max` `disabled-dates` | datePicker |
| `mn-modal` | `open` `title` | openModal |
| `mn-toast` | `title` `message` `type` `duration` | toast |
| `mn-command-palette` | `items` `placeholder` | commandPalette |
| `mn-login` | `health-url` `title` `subtitle` | loginScreen |
| `mn-chat` | `title` `welcome-message` `avatar` `quick-actions` | buildUI |
| `mn-system-status` | `services` `poll-interval` `version` `environment` | systemStatus |
| `mn-profile` | `name` `email` `avatar-url` `sections` | profileMenu |
| `mn-map` | `markers` `zoom` `center` `theme` | mapView |
| `mn-theme-toggle` | `mode` | initThemeToggle |
| `mn-tabs` / `mn-tab` | `active` / `label` | initTabs |
| `mn-a11y` | — | a11yPanel |

## CSS Class Families

| Prefix | Purpose | CSS file |
|---|---|---|
| `mn-card`, `mn-stat-card` | Cards, stat tiles | `components.css` |
| `mn-sidebar` | App sidebar nav | `layouts-sidebar.css` |
| `mn-table`, `mn-dt-*` | Data tables | `layouts-data-table-*.css` |
| `mn-detail-panel` | Detail/edit panel | `layouts-detail-panel.css` |
| `mn-heatmap`, `mn-cap-grid`, `mn-cap-heatmap` | Heatmap grids | `layouts-heatmap.css`, `layouts-capacity-heatmap.css` |
| `mn-chat-*` | AI chat UI | `layouts-chat-login.css` |
| `mn-login` | Login screen | `layouts-chat-login.css` |
| `mn-drawer` | Slide drawer | `layouts-toolbar-drawer.css` |
| `mn-gantt` | Gantt chart | `charts-gantt-timeline.css` |
| `mn-funnel` | Funnel/sankey | `layouts-funnel.css` |
| `mn-org-tree` | Org chart | `layouts-org-tree.css` |
| `mn-section-*` | Section bg (dark/light/ivory/accent) | `base.css` |
| `mn-btn`, `mn-machined-btn` | Buttons | `components.css` |
| `mn-nav`, `mn-breadcrumb` | Navigation | `layouts-nav-controls.css` |
| `mn-form-*`, `mn-field`, `mn-input` | Forms | `forms-*.css` |
| `mn-ctrl-*` | Ferrari controls | `controls-*.css` |
| `mn-modal`, `mn-toast`, `mn-tooltip` | Overlays | `extended-*.css` |
| `mn-avatar`, `mn-badge`, `mn-tag`, `mn-chip` | Atoms | `extended-*.css`, `components.css` |
| `mn-sim-*` | Simulator panel | `layouts-sim-panel.css` |
| `mn-strip`, `mn-pod` | Strip/pod layout | `patterns-strip-pod.css` |
| `mn-signal-panel` | Signal panel | `patterns-signal-binnacle.css` |
| `mn-okr`, `mn-okr-host` | OKR panels | `layouts-detail-panel.css` |
| `mn-command-palette` | Command palette | `layouts-command-palette.css` |
| `mn-page-header` | Page header | `layouts-page-header.css` |
| `mn-filter-chip*` | Filter chips | `layouts-filter-chips.css` |
| `mn-network` | Network viz | `layouts-network.css` |

## Layer Selection

| Layer | When to use | Import |
|---|---|---|
| CSS-only | Static layouts, any framework, SSR-safe | `import '…/css'` + class names |
| Headless JS | Dynamic data, canvas charts, need controller | `import { fn } from '…/charts'` + `useRef` |
| Web Components | Declarative HTML, quick prototyping | `<mn-gauge value="75">` |

## Framework Patterns

| Framework | CSS | Headless JS | Web Components |
|---|---|---|---|
| Vanilla | `<link>` | Direct call | Native |
| React | `import '…/css'` | `useRef` + `useEffect` + `destroy()` | `useRef` + attribute setting |
| Vue | `import '…/css'` | `ref` + `onMounted` + `watch` | `isCustomElement: tag => tag.startsWith('mn-')` |
| Svelte | `import '…/css'` | `bind:this` + `onMount` | Native support |
| Next/Nuxt SSR | CSS ok | Client-only (`useEffect`/`onMounted`) | Client-only (`<ClientOnly>`) |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---|---|
| Import entire library for one chart | `import { sparkline } from '…/charts'` |
| Re-render React parent of DOM component | `useRef` + `useEffect` with `destroy()` cleanup |
| Set theme via CSS class directly | Use `setTheme()` for event propagation |
| Create `<canvas>` without ref | Pass canvas via `useRef` |
| Assume SSR for JS components | All JS needs browser DOM |
| Use `innerHTML` for charts | Use factory functions |
| Skip CSS import | All components need CSS |
| Mix theme classes on body | One theme class at a time |

## Quick Start

```ts
import 'maranello-luce-design-business/css';
import { sparkline, gantt, FerrariGauge } from 'maranello-luce-design-business';
```

```html
<script src="dist/iife/maranello.min.js"></script>
<!-- window.Maranello.sparkline(...) -->
```
