<!-- v3.2.1 | 2026-03-13 -->
# MaranelloLuceDesign

Ferrari Luce-inspired design system for business dashboards. Part of Convergio.

## Commands

| Command | Purpose |
|---|---|
| `npm run build` | Full build: ESM + CJS + IIFE + CSS + WC + fonts + types |
| `npm run build:js` | JS bundles only (esbuild) |
| `npm run build:css` | CSS concat only |
| `npm run build:wc` | Web Components only |
| `npm run build:types` | `tsc --emitDeclarationOnly` |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E |
| `npm run dev` | Demo server at `localhost:3000` |
| `npm run clean` | `rm -rf dist` |
| `npx tsc --noEmit` | Type-check (no emit) |
| `scripts/check-tokens.sh` | No hardcoded secrets check |

## Architecture

| Layer | Path | Purpose | Import |
|---|---|---|---|
| CSS-only | `src/css/` (80 files) | Tokens, themes, components, layouts — zero JS | `./css` |
| Headless JS | `src/ts/` | Charts, gauge, controls, forms — framework-agnostic | `./charts` `./gantt` `./gauge` `./controls` `./forms` |
| Web Components | `src/wc/` (25 elements) | `mn-*` custom elements wrapping headless JS | `./wc` |

## File Tree

| Path | Content |
|---|---|
| `src/css/tokens.css` | Design tokens (colors, spacing, type) |
| `src/css/themes.css` | Theme barrel |
| `src/css/themes-*.css` | Per-theme overrides |
| `src/ts/index.ts` | Main public API (72+ exports) |
| `src/ts/charts.ts` | Chart sub-package entry |
| `src/ts/gantt.ts` | Gantt sub-package entry |
| `src/ts/gauge-engine*.ts` | Gauge sub-package |
| `src/ts/controls.ts` | Controls sub-package entry |
| `src/ts/forms.ts` | Forms sub-package entry |
| `src/ts/core/sanitize.ts` | Security utilities (escapeHtml, sanitizeAttr, sanitizeSvg, isValidColor) |
| `src/wc/index.ts` | WC registry (`registerAll()`) |
| `esbuild.config.mjs` | JS build config |
| `scripts/build-css.mjs` | CSS build config |
| `dist/` | Build output (gitignored) |
| `demo/` | Interactive demo pages |
| `tests/` | Unit tests (vitest) |
| `e2e/` | E2E tests (playwright) |

## IIFE Exports (87 functions/objects on `window.Maranello`)

### Charts (11)
`sparkline` · `donut` · `barChart` · `hBarChart` · `areaChart` · `liveGraph` · `halfGauge` · `progressRing` · `flipCounter` · `radar` · `bubble`

### Gauge (7)
`FerrariGauge` · `createGauge` · `createGaugesInContainer` · `redrawAll` · `reinitAll` · `buildGaugePalette` · `GAUGE_SIZES`

### Speedometer (2)
`speedometer` · `drawSpeedometer`

### Gantt (1)
`gantt`

### Funnel (4)
`funnel` · `hexLum` · `autoTextColor` · `resolveContainer`

### Data Table (1)
`dataTable`

### Controls — Panels & Nav (7)
`openDetailPanel` · `closeDetailPanel` · `openDrawer` · `closeDrawer` · `initOrgTree` · `toggleNotifications` · `initDrillDown`

### Controls — Ferrari (4)
`manettino` · `steppedRotary` · `cruiseLever` · `toggleLever`

### Controls — UI (4)
`initDropdown` · `initTabs` · `initRotary` · `initSlider`

### Dialogs & Notifications (4)
`openModal` · `closeModal` · `toast` · `commandPalette`

### Forms (12)
`initForms` · `forms` · `validateField` · `validateForm` · `initLiveValidation` · `addValidator` · `initAutoResize` · `initTagInput` · `initPasswordToggle` · `initFileUpload` · `initFormSteps` · `initInlineEdit`

### Data Binding (10)
`emit` · `on` · `off` · `bind` · `autoBind` · `onDrillDown` · `updateGauge` · `bindChart` · `autoBindSliders` · `bindControl`

### UI Screens (5)
`loginScreen` · `buildUI` (AI chat) · `systemStatus` · `profileMenu` · `datePicker`

### Observers (5)
`initGauges` · `initScrollReveal` · `initNavTracking` · `autoContrast` · `relativeLuminance`

### Icons (7)
`icons` · `renderIcon` · `iconCatalog` · `navIcons` · `statusIcons` · `actionIcons` · `dataIcons`

### Theme & Utilities (8)
`initThemeToggle` · `setTheme` · `getTheme` · `cycleTheme` · `getAccent` · `cssVar` · `debounce` · `throttle`

### Detail Panel (5)
`createDetailPanel` · `registerDatePicker` · `editors` · `renderers` · `a11yPanel`

### OKR (1)
`okrPanel`

### Map (2)
`mapView` · `attachEvents`

## Web Components (25)

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
| `mn-tabs` / `mn-tab` | `active` / `label` |
| `mn-a11y` | (FAB + settings panel) |

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

## Token System

| Token | Hex | Meaning |
|---|---|---|
| `--nero-profondo` | `#0a0a0a` | Dark background |
| `--nero-carbon` | `#111111` | Surface |
| `--grigio-alluminio` | `#c8c8c8` | Border |
| `--avorio-chiaro` | `#faf3e6` | Warm light bg |
| `--giallo-ferrari` | `#FFC72C` | Primary accent |
| `--rosso-corsa` | `#DC0000` | Danger / Avorio accent |
| `--verde-racing` | `#00A651` | Success |

## Themes

| Theme | Body class | Accent |
|---|---|---|
| Editorial | (none) | `--giallo-ferrari` |
| Nero | `mn-nero` | `--giallo-ferrari` |
| Avorio | `mn-avorio` | `--rosso-corsa` |
| Colorblind | `mn-colorblind` | `#0072B2` |

## Conventions

- Max 250 lines/file — split if exceeds
- English only (code + comments)
- MPL-2.0 license, © Roberdan 2026
- CSS: all rules in `@layer` blocks
- TS: strict mode, no `any`, named exports only
- Comments: explain WHY, not WHAT, <5% density
