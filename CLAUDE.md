<!-- v5.0.0 | 2026-03-21 -->
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
| CSS-only | `src/css/` (123 files) | Tokens, themes, components, layouts — zero JS | `./css` |
| Headless JS | `src/ts/` | Charts, gauge, controls, forms — framework-agnostic | `./charts` `./gantt` `./gauge` `./controls` `./forms` |
| Web Components | `src/wc/` (32 tags, 31 components) | `mn-*` custom elements wrapping headless JS | `./wc` |
| Runtime | `src/ts/` (app-shell, dashboard-renderer, etc.) | AppShell, DashboardRenderer, FacetWorkbench, EntityWorkbench, ViewRegistry, PanelOrchestrator, NavigationModel, AsyncSelect, StateScaffold | `./index` |

## File Tree

| Path | Content |
|---|---|
| `src/css/tokens.css` | Design tokens (colors, spacing, type) |
| `src/css/themes.css` | Theme barrel |
| `src/css/themes-*.css` | Per-theme overrides |
| `src/ts/index.ts` | Main public API (95+ exports) |
| `src/ts/charts.ts` | Chart sub-package entry |
| `src/ts/gantt.ts` | Gantt sub-package entry |
| `src/ts/gauge-engine*.ts` | Gauge sub-package |
| `src/ts/controls.ts` | Controls sub-package entry |
| `src/ts/forms.ts` | Forms sub-package entry |
| `src/ts/core/sanitize.ts` | Security utilities (escapeHtml, sanitizeAttr, sanitizeSvg, isValidColor) |
| `src/ts/auto-resize.ts` | ResizeObserver wrapper for responsive canvas charts |
| `src/ts/sidebar-toggle.ts` | Mobile sidebar hamburger toggle |
| `src/css/responsive-tokens.css` | Spacing token overrides at mobile/tablet breakpoints |
| `src/css/responsive-layouts.css` | Sidebar, panels, chat, notification mobile overrides |
| `src/css/responsive-data.css` | Data table, toolbar, strip-pod mobile overrides |
| `src/css/responsive-forms.css` | Form grid, touch targets mobile overrides |
| `src/css/responsive-charts.css` | Chart/gauge container mobile overrides |
| `src/ts/app-shell.ts` | AppShellController — 6-mode adaptive layout |
| `src/ts/view-registry.ts` | ViewRegistry singleton — view ID → factory map |
| `src/ts/panel-orchestrator.ts` | PanelOrchestrator — open/close/move views |
| `src/ts/navigation-model.ts` | NavigationModel — push/pop history stack |
| `src/ts/dashboard-renderer.ts` | DashboardRenderer — schema-driven 12-col widget grid |
| `src/ts/facet-workbench.ts` | FacetWorkbench — collapsible filter panel |
| `src/ts/entity-workbench.ts` | EntityWorkbench — tabbed entity editor with back-stack |
| `src/ts/async-select.ts` | AsyncSelect — debounced typeahead with ARIA combobox |
| `src/ts/state-scaffold.ts` | StateScaffold — 5-state async region manager |
| `src/css/layouts-app-shell.css` | AppShell 6-mode grid + slot layout |
| `src/css/layouts-dashboard-renderer.css` | Dashboard 12-col grid + widget cells |
| `src/css/layouts-facet-workbench.css` | Facet filter panel + chips strip |
| `src/css/layouts-entity-workbench.css` | Entity editor tabs + back-stack chrome |
| `src/css/layouts-state-scaffold.css` | Loading/empty/error/partial state banners |
| `esbuild.config.mjs` | JS build config |
| `scripts/build-css.mjs` | CSS build config |
| `dist/` | Build output (gitignored) |
| `demo/` | Interactive demo pages |
| `tests/` | Unit tests (vitest) |
| `e2e/` | E2E tests (playwright) |

## Responsive Mobile Adaptation

### Breakpoints

| Breakpoint | Query | Usage |
|---|---|---|
| Mobile | `max-width: 640px` | Single-column, off-canvas sidebar, 44px touch targets |
| Tablet | `641px – 1024px` | Intermediate spacing, 2-column where feasible |
| Desktop | `> 1024px` | Full layout (default, no @media needed) |

### Already Responsive (no work needed)

Gantt, Funnel, SocialGraph, NeuralNodes, MapView — these use fluid SVG/canvas or percentage-based layouts.

### Making Charts Responsive

```js
// Option A: autoResize() wrapper (any chart factory)
const cleanup = Maranello.autoResize(canvas, Maranello.sparkline, data);
// cleanup() to disconnect observer

// Option B: omit width/height on <mn-chart> — auto ResizeObserver
<mn-chart type="sparkline" data="[10,20,30]"></mn-chart>
```

### Making Gauges Responsive

```js
// Option A: size='fluid' on canvas data attribute
<canvas data-size="fluid" data-gauge='{"value":72}'></canvas>
const g = new Maranello.FerrariGauge(canvas);

// Option B: omit size on <mn-gauge> — auto ResizeObserver
<mn-gauge value="72" unit="%"></mn-gauge>

// Option C: explicit size='fluid' on WC
<mn-gauge size="fluid" value="72"></mn-gauge>
```

### Sidebar on Mobile

CSS auto-hides `.mn-sidebar` at ≤640px (off-canvas). To add hamburger toggle:
```js
Maranello.initSidebarToggleAuto(); // auto-finds .mn-sidebar + [data-sidebar-toggle]
// or manually:
Maranello.initSidebarToggle(sidebarEl, buttonEl);
```

### Responsive Utility Classes

| Class | Effect |
|---|---|
| `.mn-hide-mobile` | Hidden at ≤640px |
| `.mn-show-mobile` | Visible only at ≤640px |
| `.mn-hide-tablet` | Hidden at 641–1024px |
| `.mn-hide-desktop` | Hidden at ≥1025px |
| `.mn-stack-mobile` | `flex-direction: column` at ≤640px |
| `.mn-full-mobile` | `width: 100%` at ≤640px |

### Responsive CSS File Pattern

All responsive overrides live in `src/css/responsive-*.css` files, imported by `maranello.css` after `utilities.css`. Each file uses `@layer` matching its component domain and `@media` queries for breakpoints.

## IIFE Exports (104 functions/objects on `window.Maranello`)

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

### Responsive (4)
`autoResize` · `autoResizeAll` · `initSidebarToggle` · `initSidebarToggleAuto`

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

### Runtime (9)
`AppShellController` · `ViewRegistry` · `PanelOrchestrator` · `NavigationModel` · `DashboardRenderer` · `FacetWorkbench` · `EntityWorkbench` · `AsyncSelect` · `StateScaffold`

### Analytics & BI (11)
`waterfallChart` · `confidenceChart` · `costTimeline` · `riskMatrix` · `kpiScorecard` · `agentCostBreakdown` · `tokenMeter` · `cohortGrid` · `approvalChain` · `decisionMatrix` · `renderSourceCards`

### Chart Interaction (2)
`chartInteract` · `sparklineInteract`

### Admin & Journey (4)
`customerJourney` · `adminShell` · `sectionCard` · `settingsPanel`

## Web Components (32 tags, 31 components)

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
| `mn-section-nav` | `sections`, `current`, `data-theme`, `data-pos` |
| `mn-theme-rotary` | `size` |
| `mn-a11y` | (FAB + settings panel, auto-mounts by default) |
| `mn-app-shell` | `layout` (`full`\|`split`\|`stacked`\|`docked-bottom`\|`dual-panel`\|`side-detail`) |
| `mn-dashboard` | `schema` (JSON), `data` (JSON) |
| `mn-facet-workbench` | `facets` (JSON), `presets` (JSON) |
| `mn-entity-workbench` | `open`, `schema` (JSON), `data` (JSON), `editable` |
| `mn-async-select` | `placeholder`, `min-chars`, `debounce` |
| `mn-state-scaffold` | `state` (`loading`\|`empty`\|`error`\|`partial`\|`no-results`), `message`, `action-label` |
| `mn-customer-journey` | `phases` (JSON), `options` (JSON) |

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

| Token | Default (Editorial/Nero) | Meaning |
|---|---|---|
| `--mn-surface` | `#111111` | Primary surface |
| `--mn-surface-raised` | `#1a1a1a` | Elevated cards/modals |
| `--mn-surface-sunken` | `#0a0a0a` | Inset/deep surface |
| `--mn-text` | `#fafafa` | Primary text |
| `--mn-text-muted` | `#9e9e9e` | Secondary text |
| `--mn-border` | `#2a2a2a` | Default border |
| `--mn-accent` | `#FFC72C` | Primary accent |
| `--mn-error` | `#DC0000` | Error/danger |
| `--mn-success` | `#00A651` | Success |
| `--mn-info` | `#448AFF` | Info/interactive |
| `--mn-btn-radius` | `0` (Editorial/Nero), `var(--radius-sm)` (Sugar) | Button border-radius |

### Sugar Theme Token Overrides

| Token | Sugar Value | Notes |
|---|---|---|
| `--mn-surface` | `#f4f5f7` | Cool gray background |
| `--mn-surface-raised` | `#ffffff` | White cards |
| `--mn-surface-sunken` | `#ebedf0` | Inset areas |
| `--mn-text` | `#111111` | Black text |
| `--mn-text-muted` | `#6b7280` | Gray secondary text |
| `--mn-border` | `#d1d5db` | Light gray borders |
| `--mn-accent` | `#000000` | Black accent (buttons/links) |

## Themes (5)

| Theme | Body class | Accent |
|---|---|---|
| Editorial | (none) | `--mn-accent` |
| Nero | `mn-nero` | `--mn-accent` |
| Avorio | `mn-avorio` | `--mn-accent` |
| Colorblind | `mn-colorblind` | `--mn-accent` (Okabe-Ito blue) |
| Sugar | `mn-sugar` | `--mn-accent` (black #000) |

Sugar+Colorblind cross-theme: `body.mn-sugar.mn-colorblind` — cool gray surfaces with Okabe-Ito signals.

## API Notes

- `Maranello.palette()` returns semantic tokens by default (`surface`, `text`, `accent`, `signal*`, `hoverBg`, `focusRing`, etc.); pass `{ includePrimitives: true }` for legacy keys
- `loginScreen(el, { showStatus: false })` — pure login form; use `mn-system-status` WC separately for health panel
- `speedometer(canvas, { size: 'fluid' })` — fluid mode with ResizeObserver; call `controller.destroy()` to clean up observer + sr-only span
- `autoResize(canvas, factory, data)` — ResizeObserver wrapper; factory is called with `(canvas, data, { width, height })`
- `initSidebarToggleAuto()` — auto-finds `.mn-sidebar` + `[data-sidebar-toggle]`; returns cleanup fn
- `colorMode` gauge option: `'higher-better'` (green at high, red at low) or `'lower-better'` (green at low, red at high) — auto-generates arcBar colorStops
- `chartInteract(canvas, meta, colors)` — adds crosshair, hover dots, and tooltips to any canvas chart
- `costTimeline` and `waterfallChart` have built-in hover interaction (dots + bar highlight)

## CI / GitHub Actions

- `ci.yml` triggers on `push: [main, plan/**, fix/**, feat/**]` + `pull_request` + `workflow_dispatch`
- Dispatch manually: `gh api --method POST repos/Roberdan/MaranelloLuceDesign/actions/workflows/245666212/dispatches -f ref=<branch>`
- Constitution checks run in CI: no emoji, max 250 lines, mn- CSS prefix, no hardcoded colors (exceptions: gradients, conic, rgba, %, deg)
- Scrub check: `VirtualBPM`, `ISE Portfolio`, `MirrorDesign`, `MirrorBuddy` forbidden in src/demo
- `accessibility.css` high-contrast block must use `var(--mn-surface)` / `var(--mn-text)` not `#000`/`#fff`
- `scripts/check-semantic-design.sh` — WCAG AA contrast audit across 6 theme combinations (96 pairs), signal distinctness, danger-button contrast. Exit 1 on P0.
- `scripts/check-migration-docs.sh` — if CHANGELOG `## [X.Y.Z]` has `### Breaking Changes`, `docs/migrations/vX.Y.Z.md` must exist or CI fails.

## Releases & Breaking Changes

### When to bump

| Change | Version |
|---|---|
| Bug fix, refactor, WCAG fix | PATCH `x.y.Z` |
| New feature, backward-compatible | MINOR `x.Y.0` |
| API removal/rename, DOM change, token removal | MINOR `x.Y.0` + migration doc |
| Major paradigm shift | MAJOR `X.0.0` + migration doc |

### Process for breaking changes

1. Fix the code.
2. Add `### Breaking Changes` section to CHANGELOG under the new version entry.
3. Copy `docs/migrations/TEMPLATE.md` → `docs/migrations/vX.Y.Z.md`. Fill every `[BC-N]` block: **why changed**, **who is affected**, **before/after code**, **migration steps**.
4. `scripts/check-migration-docs.sh` runs in CI — build fails if migration doc is missing.
5. Bump version in `package.json`, run `npm run build`, commit, tag, push.

### Release checklist

```bash
# 1. Verify all tests + gates pass
npm run test:unit && bash scripts/check-semantic-design.sh && bash scripts/check-migration-docs.sh

# 2. Bump version in package.json (manually or with node -e)
# 3. Add ## [X.Y.Z] entry to CHANGELOG.md
# 4. npm run build  (updates demo footer via inject-version.mjs)
# 5. Commit
git add -A && git commit -m "chore: release vX.Y.Z — <summary>"
# 6. Tag + push
git tag vX.Y.Z -m "vX.Y.Z — <summary>" && git push origin main --tags
# 7. GitHub release
gh release create vX.Y.Z --title "vX.Y.Z — <title>" --notes "..."
```

### Migration guide format

```markdown
## [BC-N] Short title
**Why it changed:** root cause.
**Who is affected:** anyone using X.
**Before:** ```css ... ```
**After:** ```css ... ```
**Migrate:** step-by-step.
```

Full template: `docs/migrations/TEMPLATE.md`

## Conventions

- Max 250 lines/file — split if exceeds
- English only (code + comments)
- MPL-2.0 license, © Roberdan 2026
- CSS: all rules in `@layer` blocks
- TS: strict mode, no `any`, named exports only
- Comments: explain WHY, not WHAT, <5% density
- localStorage theme values: always whitelist `['nero', 'avorio', 'colorblind', 'editorial', 'sugar']` before applying

## AI Agent

NaSra — design system expert (tokens, themes, WCAG 2.2, responsive, CI).

@.github/agents/NaSra.agent.md
