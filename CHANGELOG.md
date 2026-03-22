# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.9.1] - 2026-03-22

### Fixed
- Header buttons: `title` + `aria-label` from `btn.label` — icon-only buttons show tooltip + screen reader support

## [5.9.0] - 2026-03-22

### Changed
- **layout.ts refactored** — extracted `SlotState` class to `layout-slot.ts`. Each slot (strip/left/right) is now a self-contained object with `visible`, `viewDriven`, `manualRender`, `panelId`, `locked`. Eliminates 12 parallel closure variables. `layout.ts` 393→230 lines, `layout-slot.ts` 99 lines. Both under 250-line limit.
- All toggle/open/close operations delegate to `SlotState` methods — single source of truth per slot

## [5.8.0] - 2026-03-22

### Added
- `NavigationModel.remove()` and `clear()` emit navigate events (`'remove'` / `'clear'` actions)
- `NavigateAction` type: `'push' | 'pop' | 'replace' | 'remove' | 'clear'`
- `LayoutPersistState` includes `rightPanelId` and `stripPanelId` (symmetric with `leftPanelId`)

### Fixed
- Slot locking re-implemented — `left: false` / `right: false` blocks manual toggles
- StateScaffold warns on invalid constructor state (was silent fallback)
- `layout.state` getter returns frozen copy — external mutation no longer desyncs DOM
- `NavigationModel.current()` / `history()` return cloned entries — no mutable internal state leak
- `PanelOrchestrator.move()` updates navigation entry placement via `replace()`
- `PanelOrchestrator.open(existing, data)` remounts with new data instead of silently ignoring it
- `ViewRegistry.get()` / `list()` return cloned configs — no internal mutation leak
- `ViewRegistry.reset()` clears configs before nulling singleton — no split-brain
- WC `registerAll()` sets `_loaded` only after success — retryable on import failure
- `NavigationModel.pop()` JSDoc clarifies: returns new current, not the removed entry
- VERSION export: `4.20.0` → `5.8.0`; esbuild banner: `v4.14.1` → `5.8.0`
- Demo WC count: 26 → 33; `sideEffects` flag: `false` → IIFE+WC paths
- `NavigationModel.destroy()` no longer emits event on internal clear

## [5.7.0] - 2026-03-22

### Added
- State persistence hooks: `createLayout(el, { onStateChange, initialState })`
- `onStateChange` called on every state change with `{ view, strip, left, right, leftPanelId }`
- `initialState` restores layout from persistence layer at init

## [5.6.4] - 2026-03-22

### Fixed
- **`showView()` no longer touches strip** — strip removed from `syncDOM()` and `applySlotConfig()`. Only `toggleStrip()` and fullpage save/restore control strip. Strip is a global user toggle, not view-driven.

## [5.6.3] - 2026-03-22

### Fixed
- **Toggle functions no longer call `syncDOM()`** — `toggleLeft/Right/Strip` now write ONLY their own slot via `setSlotHidden()`. `syncDOM()` (which writes ALL slots) is called only by `showView()`. This is the definitive fix for strip being overwritten as side effect of `toggleLeft()`.

## [5.6.2] - 2026-03-22

### Fixed
- **Strip CSS grid independence** — `:has()` rules for left/right no longer force strip into `grid-template-areas` when strip is hidden. Root cause of strip appearing as side effect of `toggleLeft()`.

## [5.6.1] - 2026-03-22

### Fixed
- `toggleLeft/Right/Strip` accept optional `SlotConfig` — `toggleLeft({ render: fn })` opens + renders
- Manual toggle render callbacks persist across view switches — reopen re-renders same content
- `syncDOM()` only writes `hidden` when value differs from DOM — eliminates strip opening as side effect of toggleLeft

## [5.6.0] - 2026-03-22

### Added
- Independent slot state — `toggleLeft/Strip/Right` affect ONLY their slot
- View-driven vs manual toggle — manual toggles persist across view switches, view-driven slots close when switching away
- Slot render callbacks — `left: { render: (slot) => { ... } }` called on `showView()`
- Fullpage saves/restores all three slot states

### Changed
- `showView()` no longer resets strip or right unless view config declares them
- `SlotConfig.content` renamed to `SlotConfig.render`

## [5.5.0] - 2026-03-22

### Added
- Declarative view config with slot routing — `register()` accepts `left`, `right`, `strip`, `center` properties to control slot visibility and content rendering per view
- Slot content callbacks — `left: { content: (slot) => { ... } }` renders content into slots on `showView()`
- Slot locking — `right: false` forces slot closed and blocks manual `toggleRight()` for that view
- `center` callback — `center: (slot) => { ... }` renders center content on view switch

## [5.4.1] - 2026-03-22

### Fixed
- Add `background: var(--mn-surface)` to `#mn-slot-center` — center slot now has consistent background across all themes

## [5.4.0] - 2026-03-22

### Added
- Default slot styling in `layouts-mn-layout.css` — `#mn-slot-strip` (padding, raised bg, border-bottom), `#mn-slot-left/right` (padding, bg, border). Consumers no longer write generic slot CSS.
- Viewport setup: `html, body { height: 100%; margin: 0 }` + flex column for `body:has(> #mn-grid)` full-viewport apps.

### Changed
- `createLayout()` reads initial `hidden` state from DOM — if a slot has `hidden`, internal state starts accordingly. No flash, no sync override. Consumer HTML is source of truth.

## [5.3.4] - 2026-03-22

### Fixed
- `layout.syncDOM()` now uses ONLY `document.getElementById()` for slot lookup — removes `grid.querySelector('#id')` entirely. WebKit `querySelector` with ID selectors on container elements is unreliable; `getElementById` matches the consumer's proven working pattern.

## [5.3.3] - 2026-03-22

### Fixed
- `layout.toggleStrip()` / `toggleLeft()` / `toggleRight()` — Safari compat: `getSlot()` falls back to `document.getElementById()` when `grid.querySelector()` misses elements (WebKit ID selector timing quirk)
- Replace `classList.toggle(name, force)` with explicit `add/remove` — avoids Safari two-argument `toggle()` edge cases

## [5.3.2] - 2026-03-22

### Fixed
- `layout.showView()` now toggles `data-view` children inside `#mn-slot-center` — previously only updated internal state without switching visible view
- `layout.syncDOM()` re-queries slot elements from live DOM on every call — fixes stale ref bug when slots are added after `createLayout()`
- `layout.toggleStrip()` / `toggleLeft()` / `toggleRight()` now reliably manipulate DOM on Safari/WebKit

## [5.3.1] - 2026-03-22

### Fixed
- Replace `structuredClone` with JSON deep-clone in `decision-matrix.ts` — Safari < 15.4 compatibility
- Add WebKit to Playwright E2E test projects — prevents Safari-only regressions

### Added
- Cross-browser smoke test (`cross-browser-smoke.spec.ts`) — verifies IIFE core APIs on Chromium + WebKit

## [5.3.0] - 2026-03-22

### Breaking Changes
- [BC-1] Layout auto-init now requires `data-mn-auto-layout` attribute on `#mn-grid` — prevents state conflicts with framework consumers (Svelte, React, Next.js). See `docs/migrations/v5.3.0.md`.

### Added
- Header buttons emit `header-button-click` CustomEvent (bubbles) with `{ id, label }` detail
- `Maranello.sparkline` top-level IIFE export for sparkline chart factory

### Fixed
- `components-header.css` missing from `maranello.css` barrel — header had zero styles in `maranello.min.css`
- Header invisible on Safari/WebKit when using `maranello.min.css` (root cause: missing CSS above)

## [5.2.1] - 2026-03-21

### Fixed
- StateScaffold: `aria-busy` set consistently on all state transitions + removed in `destroy()`
- EntityWorkbench: tab switching uses `data-tab-id` instead of fragile `textContent` matching
- EntityWorkbench: breadcrumb updates incrementally on name/title field change
- mn-app-shell WC: orchestrator ownership tracking — only destroys if internally created
- Dashboard widgets test: color assertion accepts both keyword and rgb() formats
- CSS parity test: Windows-portable path resolution via `path.relative()`
- ESM tests: `__dirname` replaced with `import.meta.dirname` in 3 test files
- Sugar !important audit: threshold tightened from 77 to 15 (actual: 9)
- Demo launch.js: install snippet updated to v5.2.0

## [5.2.0] - 2026-03-21

### Added
- `createLayout()` / `Maranello.layout` — 4-slot CSS grid with `:has()` auto-collapse + state machine (view registry, fullpage mode, slot toggles, CSP-safe)
- `Maranello.header.init()` — 3-zone navbar component (brand, buttons, search, profile integration)
- `layouts-mn-layout.css` — responsive grid layout (stacks under 900px)
- `components-header.css` — header styling with semantic tokens
- 36 new unit tests (19 layout + 17 header)

## [5.1.0] - 2026-03-21

### Added
- Grafana-style `themePicker()` function with 5 preview cards, ARIA radiogroup, keyboard nav
- `profileMenu` supports `type: 'theme-switcher'` section for embedded theme selection
- `themePicker` registered on `window.Maranello` for IIFE consumers
- `components-theme-picker.css` in `@layer components`

## [5.0.0] - 2026-03-21

### Breaking Changes
- [BC-1] StateScaffold: new `ready` state for successful data loads; `partial` reserved for degraded content only
- [BC-2] PanelOrchestrator: accepts optional AppShellController for integrated slot-based rendering
- [BC-3] CSS entrypoint (`./css`): `index.css` now includes full system (Sugar themes, responsive, runtime layouts, integration)
- [BC-4] Sugar theme: `!important` declarations reduced from 128 to 9; replaced with higher-specificity selectors

### Added
- StateScaffold `ready` state with full CSS + WC support
- AppShellController `getSlotForPlacement()` method for placement-to-slot mapping
- CSS entrypoint parity: 51 missing imports added to index.css
- Sugar + Sugar+Colorblind test coverage across visual regression, E2E, and contrast suites
- AI Operations documentation sections in agent-cookbook.md and AGENT.md
- Dashboard widgets safe DOM construction with XSS prevention (isValidColor, escapeHtml)
- EntityWorkbench lazy tab rendering with CSS display toggle and tab cache
- CSS entrypoint parity test suite (10 tests)
- Migration guide: docs/migrations/v5.0.0.md

### Changed
- DashboardRenderer uses `setState('ready')` instead of `setState('partial')` after successful widget render
- PanelOrchestrator uses AppShell slots when shell provided; standalone mode preserved
- EntityWorkbench preserves DOM on tab switch instead of full rebuild
- Sugar theme uses higher-specificity selectors instead of !important (93% reduction)

### Fixed
- Metadata drift: AGENT.md, CLAUDE.md, NaSra.agent.md aligned to v5.0.0 (5 themes, 32 WC tags)
- Demo hero: MIT license to MPL-2.0, hardcoded hex colors to palette()
- Demo section counter aligned to actual count (43 sections)
- CSS injection vector in dashboard legend widget (isValidColor guard)
- StateScaffold warns on invalid state values (fail-loud)

## [4.20.0] - 2026-03-21

### Added
- **Theme toggle SVG icons** — `initThemeToggle` renders SVG icons from the icon catalog instead of unicode text characters; new icons: `moon`, `sun`, `contrast` in platform icon set
- **Sugar button states** — `:active`, `[aria-pressed="true"]`, `:focus-visible` styles for `.mn-btn` and `.mn-btn--ghost` on Sugar theme (fixes contrast collapse on pressed state)
- **Avorio `[aria-pressed]` / `[aria-selected]` buttons** — new pressed/selected states with stronger contrast on warm ivory background
- **Tab active background** — `.mn-tabs__tab--active` now gets a subtle background tint (`--mn-hover-bg`) for visual differentiation beyond underline alone
- **`adminShell` footer click** — `footer` accepts `{ label, onClick }` object; new `onFooterClick` callback for string footers

### Fixed
- **Sugar `:active` buttons** — `!important` on base Sugar button styles no longer clobbers `:active` pseudo-class from base CSS
- **Avorio `:active` buttons** — increased `box-shadow` depth and darkened background for stronger press feedback
- **Avorio active tabs** — added `background: rgba(0,0,0,0.05)` to active tab on Avorio theme

## [4.19.3] - 2026-03-21

### Fixed
- **`adminShell`** — string footer no longer crashes content area; `footer` accepts `string | HTMLElement`
- **`initThemeToggle`** — accepts `string | HTMLElement` (was string-only)
- **Avorio `:active` buttons** — stronger press feedback with visible `box-shadow` + darkened background (WCAG 3:1 UI)
- **Tabs CSS** — added `[aria-selected="true"]` selector alongside `--active` class
- **Icon aliases** — 6 common names mapped to existing icons: `fastForward`, `shuffle`, `target`, `share`, `trendingUp`, `pieChart`

## [4.19.2] - 2026-03-20

### Added
- **`docs/migrations/TEMPLATE.md`** — standard template for all future breaking-change migration guides
- **`docs/migrations/v4.19.1.md`** — full migration guide for v4.19.1 breaking changes (BC-1..BC-4)
- **`scripts/check-migration-docs.sh`** — CI gate: if CHANGELOG contains `Breaking Changes` in the current version entry, `docs/migrations/vX.Y.Z.md` must exist or build fails
- **CONTRIBUTING.md** — added Breaking Changes section: SemVer rules, process, CHANGELOG format convention
- **README** — updated to 5 themes, badges (v4.19.2, 973 tests), Sugar theme screenshots, install URLs
- **`docs/THEMING.md`** — added Sugar theme row, Sugar token overrides column, Sugar+Colorblind combined usage
- **`docs/api-catalog.md`** — updated to v4.19.2, 31 WCs (was 25), added Themes table with all 5+1 combinations
- **Screenshots** — `hero-sugar.png`, `hero-avorio.png`, `hero-editorial.png`, `dashboard-sugar.png`, `charts-sugar.png`

### Changed
- **CI** — added `check-migration-docs.sh` step after semantic design audit
- **v4.19.1 CHANGELOG** — retroactively added `### Breaking Changes` section with [BC-1..BC-4] refs and migration doc link

## [4.19.1] - 2026-03-20

### Breaking Changes

- **[BC-1] `--mn-danger-text` replaces `var(--mn-text)` on danger buttons** — Migration: [v4.19.1](docs/migrations/v4.19.1.md#bc-1-new-token---mn-danger-text--danger-button-text-color)
- **[BC-2] Avorio danger button is now outline** — Primary button keeps solid fill, danger button is outline/ghost. Migration: [v4.19.1](docs/migrations/v4.19.1.md#bc-2-avorio-theme--danger-button-is-now-outline-instead-of-filled)
- **[BC-3] Colorblind `--mn-error` darkened `#D55E00` → `#C94000`** — Migration: [v4.19.1](docs/migrations/v4.19.1.md#bc-3-colorblind-theme---mn-error-darkened-from-d55e00-to-c94000)
- **[BC-4] Sugar `--mn-text-muted` darkened `#767676` → `#5e5e5e`** — Migration: [v4.19.1](docs/migrations/v4.19.1.md#bc-4-sugar-theme---mn-text-muted-darkened-from-767676-to-5e5e5e)

Full migration guide: [`docs/migrations/v4.19.1.md`](docs/migrations/v4.19.1.md)

### Added
- **`scripts/check-semantic-design.sh`** — CI gate for semantic design audit: runs WCAG AA contrast check + signal token distinctness + danger-button contrast check across all 6 theme combinations (incl. Sugar+Colorblind)
- **`scripts/check-signal-semantics.mjs`** — machine-readable JSON report; exits 1 on P0 findings (meaning lost)
- **`--mn-danger-text`** — new semantic token (defaults to white) ensuring danger button text always has ≥4.5:1 contrast on `--mn-error` background
- **`src/css/themes-avorio-components.css`** — Avorio danger button rendered as outline/ghost red (distinct from solid red primary)

### Fixed
- **Danger button text contrast** — `color: var(--mn-text)` → `var(--mn-danger-text)` in `.mn-form-btn--danger`; fixes dark text on red (#111 on #DC0000 = 2.65:1) in Avorio and Sugar themes
- **Colorblind `--mn-error`** — darkened from `#D55E00` to `#C94000` so white danger-text achieves ≥4.5:1 contrast (was 3.71:1)
- **Sugar `--mn-text-muted`** — darkened from `#767676` to `#5e5e5e` to pass WCAG AA (3.15:1 → 4.91:1) on `#E4E4E8` surface
- **Avorio danger button border** — reverted to base `1.5px` width (was incorrectly set to `2px`, causing layout shifts)

### Changed
- **`scripts/check-contrast.mjs`** — now tests 6 theme combinations including `sugarColorblind` (was 5); 96 pairs checked (was 80)
- **`scripts/check-signal-semantics.mjs`** — audits 6 themes including `sugarColorblind`; threshold corrected to WCAG SC 1.4.3 (4.5:1)
- **CI** — standalone `check-contrast.mjs` step removed; superseded by `check-semantic-design.sh` (Phase 1)

## [4.19.0] - 2026-03-20

### Added
- **Sugar theme** — cool gray light theme inspired by SugarCRM: `body.mn-sugar` with white cards, black accent, rounded corners (16px), subtle shadows
- **customerJourney** — horizontal swimlane flow showing client engagement history with phase columns, SVG connectors, keyboard nav, ARIA
- **`<mn-customer-journey>`** — Web Component wrapper for customerJourney
- **adminShell** — full-screen admin layout with fixed overlay, collapsible sidebar, breadcrumb topbar, search with keyboard shortcut
- **sectionCard** — titled content card wrapper with action link, default/flat variants
- **settingsPanel** — structured settings form with 8 item types (toggle/text/select/range/radio/info/action/custom)

### Changed
- **Radius tokens** — adopted `var(--radius-*)` across 55 CSS files, replacing ~146 hardcoded values
- **Shadow tokens** — adopted `var(--shadow-*)` across 22 CSS files, replacing ~35 hardcoded values
- **Button radius** — all buttons use `var(--mn-btn-radius, var(--radius-sm))`; Sugar gets rounded corners, dark themes keep sharp edges
- **Theme rotary** — now cycles through 5 themes: Editorial, Nero, Avorio, Colorblind, Sugar
- **Sugar+Colorblind** cross-theme — `body.mn-sugar.mn-colorblind` combines cool gray surfaces with Okabe-Ito accessible signals
- **DATA_CONTRACTS.md** — added customerJourney, adminShell, sectionCard, settingsPanel interfaces
- **Unit tests** — added runtime tests for Sugar theme token resolution, customerJourney, adminShell, sectionCard, settingsPanel

## [4.18.0] - 2026-03-19

### Added
- **createDetailPanel** — `mode: 'inline'` option for embedding panel in layout (no backdrop, `position: relative`, fills parent, `border-left`)
- **profileMenu** — `maxWidth` option (default 320px) to constrain dropdown width

### Fixed
- **externalLinks** buttons in detail panel header now render as ghost-style `<a>` tags with `target="_blank" rel="noopener"`, matching Edit/Close button style (16px icon, `aria-label`)
- **profileMenu** avatar clamped to 48x48px (was unconstrained), name/email ellipsis on reasonable width, email forced to `0.75rem`
- **profileMenu** fixed orphaned `.mn-profile-dropdown__avatar-lg` CSS selector that caused avatar styles to not apply

## [4.17.0] - 2026-03-18

### Added — Presentation Runtime
- **AppShell** (`mn-app-shell`): 8-slot layout shell with 6 modes (full, split, stacked, docked-bottom, dual-panel, side-detail), responsive
- **ViewRegistry**: singleton view registration with Placement types (page, side-panel, bottom-dock, modal, overlay, workspace)
- **PanelOrchestrator**: open/close/move/stack/swap views — DOM-preserving move, event-driven lifecycle
- **FacetWorkbench** (`mn-facet-workbench`): schema-driven multi-facet filters (select, multi-select, search, date-range, boolean), presets, chips, exclusion rules, keyboard nav
- **EntityWorkbench** (`mn-entity-workbench`): schema-driven entity edit panel with tabs, sections, async-select fields, dirty tracking, validation, back-stack navigation
- **DashboardRenderer** (`mn-dashboard`): schema-driven dashboard composition (KPI strip, stat cards, charts, gauges, legends) with automatic StateScaffold per widget
- **DataTable v2**: 6 new cell types (metric, person, progress, action, link, icon), collapsible row grouping, row drill-down — backward-compatible
- **AsyncSelect** (`mn-async-select`): generic async searchable control with ARIA combobox, debounce, keyboard nav; PersonField refactored to use it
- **StateScaffold** (`mn-state-scaffold`): 5 standard states (loading, empty, error, partial, no-results) with theme-aware CSS
- **NavigationModel**: back-stack with push/pop/replace, onNavigate hook for consumer routing
- 6 interactive demo pages: runtime-shell, runtime-dashboard, runtime-facets, runtime-entity, runtime-table-v2, runtime-integration
- `CONSUMER_CONTRACT.md`: consumer vs Maranello ownership, anti-patterns, migration guide
- `docs/agent-cookbook.md`: 6 recipes + anti-patterns + schema reference for AI agents
- Full API documentation in `docs/api-contracts-v4.md` for all runtime components
- NaSra agent updated with runtime knowledge, layout modes, schema patterns, WCAG

### Changed
- IIFE bundle size limit: 410 KB → 450 KB (9 new runtime components)
- `DATA_CONTRACTS.md`: 13 new interface entries for runtime APIs
- `README.md`: Presentation Runtime section with architecture diagram, Quick Start, Before/After
- `CLAUDE.md`: runtime exports, WCs, CSS files, architecture layer
- 31 Web Components (was 25), 96+ IIFE exports

## [4.16.0] - 2026-03-18

### Added
- Visual regression tests: 28 Playwright screenshot tests across all 4 themes (Editorial, Nero, Avorio, Colorblind)
- Per-section snapshots: hero, cards, charts, gauges, forms, icons + full-page smoke per theme
- `npm run test:e2e:visual` — run visual regression against baselines
- `npm run test:e2e:visual:update` — regenerate baselines after intentional visual changes
- Playwright config: standardized viewport (1280×720), snapshot defaults, `expect.toHaveScreenshot` config

### Fixed
- E2E test suite: `test:e2e` now uses `--ignore-snapshots` so CI doesn't fail on cross-platform pixel diffs

## [4.15.1] - 2026-03-18

### Added
- CI: `check-theme-semantics.sh` now blocks `var(--mn-text-inverse)` in Avorio CSS overrides (prevents invisible text regression)

### Changed
- Version bump for CI guard addition

## [4.15.0] - 2026-03-18

### Added
- Gauge `colorMode` option: `'higher-better'` (red→yellow→green) or `'lower-better'` (green→yellow→red) — auto-generates arcBar colorStops
- Dashboard Strip: right-side pods replaced with second gauge (latency, lower-better demo)
- `costTimeline`: hover dots at each series intersection on mouseover
- `waterfallChart`: bar highlight glow on hover
- 13 missing APIs documented in CLAUDE.md, AGENT.md, NaSra, DATA_CONTRACTS (waterfallChart, costTimeline, confidenceChart, riskMatrix, kpiScorecard, agentCostBreakdown, tokenMeter, cohortGrid, approvalChain, decisionMatrix, renderSourceCards, chartInteract, sparklineInteract)

### Fixed
- **Avorio theme: 24 color fixes** — `var(--mn-text-inverse)` (#fff) replaced with `var(--mn-text)` (#111) across 17 CSS files (buttons, tooltips, modals, toasts, dropdowns, filter chips, forms, icons, map popups, nav tooltips, panels)
- Avorio tooltip: background changed from nearly-invisible `var(--mn-hover-bg)` to `var(--mn-surface-raised)`
- Avorio ghost-light buttons: added explicit `background: transparent` (specificity fix)
- Avorio hover states: 4 files changed from `var(--mn-hover-bg)` (0.06 opacity) to `rgba(0,0,0,0.08)`
- Avorio chart panel title: white → dark text
- Avorio treemap cell: wrong token (`--mn-hover-bg` as color) → `--mn-text`

### ⚠️ Migration Notes (for consumers of Maranello CSS)
- If you have custom CSS with `body.mn-avorio` selectors using `color: var(--mn-text-inverse)`, change to `color: var(--mn-text)` — `--mn-text-inverse` is `#fff` (invisible on light bg)
- Ghost button variants (`.mn-btn--ghost`, `.mn-btn--ghost-light`) in Avorio now correctly show transparent bg — remove any custom workarounds
- Gauge configs can now use `"colorMode": "higher-better"` or `"lower-better"` instead of manual `colorStops` arrays

## [4.14.1] - 2026-03-17

### Fixed
- NaSra: aligned a11y class model docs (body.mn-a11y-* not html), reduced-motion JS, forced-colors, demo compositions, WC patterns

## [4.14.0] - 2026-03-17

### Added
- Dashboard Strip: restored nacelle with gauge + gradient bars + secondary board + pods
- KPI Instrument Cluster: binnacle with hero gauge, subdials, crosshair, arc-bar, sparkline complications
- Dashboard Classic: full BI prototype with search, filter tags, 4 gauge cards, data table with progress bars
- WC catalog: added mn-theme-rotary + mn-section-nav cards, replaced mn-theme-toggle mock with real WC
- mn-theme-rotary WC: role=radiogroup, keyboard nav (Arrow/Home/End), aria-checked, roving tabindex
- Reduced motion: gauge-engine + speedometer skip rAF when prefers-reduced-motion or mn-a11y-reduced-motion
- Forced-colors: @media (forced-colors: active) rules for buttons, focus, status, gauges, toasts, modals
- Avorio: mn-card-dark border+shadow, mn-section-ivory text color override

### Fixed
- A11y: class model aligned — applySettings uses body.mn-a11y-* matching CSS selectors
- A11y: WC catalog no longer duplicates mn-a11y FAB (static mock preview)
- A11y: demo accessibility section uses real mn-a11y storage key + class model
- Colorblind: nav inline style overrides removed — CSS cascade handles all themes
- Colorblind: CSS syntax error )) in themes-colorblind-layouts.css
- WC tokens: mn-theme-toggle, mn-date-picker, mn-ferrari-control, mn-tabs use --mn-accent (not --mn-error) for focus/active
- CSS: hardcoded rgba accent glows replaced with color-mix() in accessibility, charts-base, controls-rotary-slider, data-table, integration-reset
- NaSra: added forced-colors, color-mix, ghost-light, heatmap patterns

## [4.13.4] - 2026-03-17

### Fixed
- Heatmap: text unreadable on red/green cells — added explicit `color:#fff` + `--mn-accent-text` per theme
- Colorblind: heatmap cell text colors for Okabe-Ito palette
- Demo: ghost buttons invisible on dark sections — `mn-btn--ghost` → `mn-btn--ghost-light` (overlays + WC cards)
- Demo: WC catalog spinners — pre-load mn-profile, mn-login, mn-tabs, mn-modal, mn-hbar, mn-date-picker, mn-section-nav
- Demo: WC catalog title 24 → 26
- NaSra: added heatmap, ghost-light, WC preload patterns to Common Mistakes

## [4.13.3] - 2026-03-17

### Fixed
- Docs: aligned all version refs (README, AGENT, CONTRIBUTING, DATA_CONTRACTS, demo) to current release
- Docs: CSS file count 80 → 123, WC tags 24/25 → 26, exports 87 → 150+
- Docs: added mn-section-nav + mn-theme-rotary to WC tables
- Docs: NaSra agent aligned to v4.13 (token migration notes, a11y auto-mount, CI gates)
- Docs: esbuild banner updated from v4.11.0
- Demo: API count in hero and api-reference section updated

## [4.13.2] - 2026-03-17

### Fixed
- Buttons: ghost button invisible in Avorio (white text on cream)
- Buttons: added full Avorio theme overrides for all button variants
- Buttons: `--giallo-hover` → `var(--mn-accent-hover)` on accent button hover

## [4.13.1] - 2026-03-17

### Added
- A11y FAB auto-mounts by default (IIFE + ESM `registerAll()`)
- `.mn-strip__section--wide` modifier (flex:2) for wider strip sections
- Avorio theme overrides for profile dropdown component
- CSS fallback styling for broken chat avatar images

### Fixed
- Strip: removed aluminum nacelle border, lighter inner shadow
- Strip: gauge clipping (`overflow:visible`, wrap 150→170px)
- Strip: KPI min-width 64→80px
- Strip Avorio: labels invisible (contrast 1.2:1→4.5:1), board cells same-color bg
- Sim panel: removed `max-height:240px` on choose step (cards cut off)
- Sim grid: fixed `repeat(4,1fr)` → `auto-fit minmax(140px,1fr)`
- Profile: double `))` syntax error in `var(--mn-accent))`
- Profile: `--status-danger` → `var(--mn-error)` (undefined token)
- Profile: avatar fallback colors (border→accent)
- Accent tokens: 47 replacements of `--giallo-ferrari` → `--mn-accent` across 25+ CSS files
- Bot default avatar set to Roberdan profile photo

### Changed
- Strip label/dim colors use semantic tokens (`--mn-text-tertiary`, `--mn-text-muted`) instead of `--avorio-scuro`
- Avorio strip inner background uses `--avorio-caldo` for contrast

## [4.11.0] - 2026-03-16

### Added
- Colorblind theme: themes-colorblind-components.css + themes-colorblind-layouts.css (Okabe-Ito palette)
- Unit tests for 22 new components (bcg, 9box, swot, decision, waterfall, confidence, activity-feed, bullet, notification-center, date-range-picker, user-table, audit-log, agent-cost, cost-timeline, bmc, agent-trace, token-meter, streaming-text, risk-matrix, kpi-scorecard, cohort-grid, approval-chain)
- DATA_CONTRACTS.md v4.11.0 + docs/api-contracts-v4.md (22 component API contracts)
- components.json v4.11.0 with 22 new entries
- prefers-contrast media query mirroring .mn-high-contrast in accessibility.css
- mn-section-nav registered in WC registerAll()

### Fixed
- XSS: isValidColor guard for badgeColor in search-drawer.ts
- Strategy section rendering: bcgMatrix/nineBoxMatrix/decisionMatrix now init inside requestAnimationFrame; canvas pixel dims set before render
- initOrgTree() returns { destroy() } with AbortController cleanup
- mn-theme-toggle disconnectedCallback removes click listener
- RGBA hardcoded values replaced with color-mix() across ai-chat-messages, integration-status, themes-avorio-layouts, forms-themes-misc
- ai-chat-messages: try/catch around synchronous onSend handler

## [4.10.2] - 16 Mar 2026

### Fixed
- P2-A: `chartHiDpi` return type is `CanvasRenderingContext2D | null`; all 12 chart factories + speedometer + neural-nodes + network-messages + gantt + chart-interact guard the returned context
- P2-B: `gantt-events` stores `ResizeObserver` in state for cleanup; `gantt.destroy()` calls `.disconnect()`
- P2-C: Replaced unscoped `var(--bianco-caldo)` / `var(--nero-carbon)` with semantic tokens (`--mn-text`, `--mn-text-muted`, `--mn-surface`, `--mn-border`) in toast, dropdown and chat-fab CSS — Avorio theme now renders correctly

## [4.10.1] - 16 Mar 2026

### Fixed
- `auditLog`: container sets `role="log"` + `aria-label="Audit log"` (WCAG ARIA landmark, P1)
- `activityFeed`: container sets `role="feed"` + `aria-label="Activity feed"` (WCAG ARIA landmark, P1)
- CI bundle size gate raised to 410 KB for v4.10.0 additions (was 360 KB)

## [4.10.0] - 16 Mar 2026

### Added
- `userTable(el, users, opts)` — Stripe-quality admin user table with search, avatar initials, status/role/team badges, inline row actions, select-all, keyboard nav; `M.userTable` on IIFE
- `auditLog(el, entries, opts)` — GitHub-style audit timeline with severity filter tabs, expandable metadata, live `prepend()`, `clear()`, aria-live; `M.auditLog` on IIFE
- `agentCostBreakdown(el, rows, opts)` — Datadog-quality FinOps table with per-agent token attribution, budget mini-bars (alert at 80%), sortable columns, cost delta indicators; `M.agentCostBreakdown` on IIFE
- `costTimeline(canvas, opts)` — multi-series stacked/overlaid area chart for LLM cost over time, animated, hover tooltips; `M.costTimeline` on IIFE
- `businessModelCanvas(el, opts)` — Osterwalder 9-block BMC with CSS named-grid, inline-editable items, export; `M.businessModelCanvas` on IIFE
- Demo: new sections `#platform-admin` and `#finops` added to header nav; `#strategy` extended with Business Model Canvas
- `src/ts/index-extras.ts` barrel consolidates all v4.5–v4.10 exports, keeping `index.ts` under 250-line limit

## [4.9.0] - 16 Mar 2026

### Added
- `agentTrace(el, steps, opts)` — expandable AI agent step timeline with status icons, duration, input/output; `M.agentTrace` on IIFE
- `tokenMeter(el, usage, opts)` — token budget meter with prompt/completion/cached breakdown, cost estimate, onAlert; `M.tokenMeter` on IIFE
- `streamingText(el, opts)` — markdown streaming renderer with citation markers, bold/code, onDone; `M.streamingText` on IIFE
- `riskMatrix(canvas, opts)` — canvas risk scatter (probability × impact) with animated bubbles, quadrant shading, hover/click; `M.riskMatrix` on IIFE
- `kpiScorecard(el, rows, opts)` — KPI tracking table with sparkline trends, status badges, delta %; `M.kpiScorecard` on IIFE
- `cohortGrid(canvas/el, rows, opts)` — cohort retention heatmap, percent/absolute toggle; `M.cohortGrid` on IIFE
- `approvalChain(el, steps, opts)` — multi-step approval workflow with setStatus, editable actions; `M.approvalChain` on IIFE
- Demo: new sections `#agentic` (agent trace, token meter, streaming output, approval chain) and `#bi-dashboard` (risk matrix, KPI scorecard, approval, cohort) added to header nav

## [4.8.0] - 16 Mar 2026

### Added
- `bcgMatrix(canvas, opts)` — BCG portfolio matrix (Stars/Cash Cows/Q-Marks/Dogs), animated bubbles, hover/click; `M.bcgMatrix` on IIFE
- `nineBoxMatrix(el, opts)` — GE-McKinsey 9-box grid, drag-to-cell, arrow key navigation, Invest/Selective/Divest zones; `M.nineBoxMatrix` on IIFE
- `swotMatrix(el, opts)` — editable SWOT 2×2 grid, add/delete items, export, onChange; `M.swotMatrix` on IIFE
- Demo: new section `#strategy` with BCG, Nine-Box, SWOT, BMC, Decision Matrix

## [4.7.0] - 16 Mar 2026

### Added
- `waterfallChart(canvas, opts)` — canvas waterfall chart with positive/negative segments, running totals, connector lines, animated; `M.waterfallChart` on IIFE
- `confidenceChart(canvas, opts)` — canvas forecast chart with central line + shaded confidence band, animated left-to-right reveal; `M.confidenceChart` on IIFE
- `decisionMatrix(el, opts)` — weighted criteria × alternatives table, inline editable scores, auto-ranking, color-coded cells, full keyboard nav + aria; `M.decisionMatrix` on IIFE
- `renderSourceCards(container, cards, opts)` — RAG source citation cards with relevance score badge, excerpt clamp, maxVisible/show-more, onSelect callback, full a11y; `M.renderSourceCards` on IIFE
- `bulletChart` redesigned: proper Stephen Few layering (tonal bands → narrow value bar → target marker), theme-adaptive colors resolved at draw time, `getBoundingClientRect` sizing
- Demo: new sections `#dashboard-widgets` and `#analytics` added to header nav
- CSS: `layouts-decision-matrix.css`, `components-source-card.css` — all `@layer`, `mn-` prefix, theme-responsive

### Fixed
- `bulletChart` canvas sizing used `offsetWidth` (often 0 before layout) → now uses `parentElement.getBoundingClientRect()`
- `bulletChart` range bands now use neutral tonal shades instead of saturated signal colors

## [4.6.0] - 16 Mar 2026

### Added
- `activityFeed(el, items?, opts?)` — vertical timeline/audit log widget with typed indicator dots, animate-on-add, maxItems trim, prepend/add/clear API; `M.activityFeed` on IIFE
- `dateRangePicker(el, opts?)` — from/to calendar picker with single-month view, range highlight, disabled days, `getValue/setValue/open/close` API; `M.dateRangePicker` on IIFE
- `bulletChart(canvas, opts)` — canvas target-vs-actual bar chart with qualitative background bands, animated value bar, target marker, label/unit; `M.bulletChart` on IIFE
- `notificationCenter(triggerEl, opts?)` — persistent notification panel with unread badge, mark-all-read, type dots, action buttons, Escape/backdrop close; `M.notificationCenter` on IIFE
- CSS: `patterns-activity-feed.css`, `forms-date-range.css`, `layouts-notification-center.css` — all in `@layer`, all `mn-` prefixed, theme-responsive

## [4.5.1] - 15 Mar 2026

### Added
- `M.openSearchDrawer(opts)` registered on IIFE bundle (`window.Maranello`) — search/command drawer with debounced async results, custom sections, focus trap
- `M.initTagsField(el, opts)` registered on IIFE bundle — tag chip input aligned to VirtualBPM spec: `value` initial tags, `suggestions` autocomplete dropdown, comma-adds, Backspace-removes-last, `setValue(tags[])` controller method

## [4.5.0] - 15 Mar 2026

### Added
- `neuralNodes()` data-driven API (Convergio spec): pass `nodes: NeuralNodeData[]` with id, label, sublabel, color, size, group, badge, energy — backward-compatible, existing `nodeCount` usage unchanged
- Explicit connections via `connections: NeuralConnection[]` with `from`, `to`, `strength`
- Force-directed layout (`forceLayout: true`): node repulsion, connection attraction, group clustering, smooth damping
- Canvas label rendering: label, sublabel, badge pill — energy-based fade, always visible on hover
- Extended controller: `setNodes()`, `setConnections()`, `addNode()`, `removeNode()`, `updateNode()`, `highlightNode()`
- `pulse()` now accepts string node id alongside numeric index
- Exported types: `NeuralNodeData`, `NeuralConnection`, `NeuralNodesOptions`, `NeuralNodesController`

## [4.4.0] - 15 Mar 2026

### Added
- 9 new semantic CSS tokens: `--sfondo`, `--superficie-card`, `--superficie-input`, `--backdrop`, `--grigio-30`, `--signal-ok-dim`, `--signal-danger-bg`, `--mn-accent-bg`, `--mn-accent-border` — last 4 via `color-mix()` for automatic theme adaptation
- `--shadow-heavy` shadow token (0 24px 80px rgba(0,0,0,0.5))
- 5 nav icon aliases: `funnel`, `gantt`, `table`, `heatmap`, `grid`
- DetailPanel: `tabRenderers` option for custom tab content renderers
- DetailPanel: `parentLink` option renders `← back` button above title
- DetailPanel: `externalLinks` option renders icon buttons in header
- DetailPanel: `person` field type with async `searchFn`, avatar initials dropdown, XSS-safe
- DetailPanel: `country` field type with 2-letter code badge
- `initTagsField(el, opts)` — tag chip input widget with add/remove/getTags API
- `initPersonField(el, opts)` — async person search input with debounce + dropdown
- `openSearchDrawer(opts)` — search drawer template wrapping `openDrawer()` with results, loading, sections
- Layout CSS: `mn-heatmap__cell/filter-bar/legend/header` + avorio/colorblind overrides
- Layout CSS: `layouts-sim-panel-2.css` — guided simulator flow classes (`mn-sim-card`, `mn-sim-step-header`, `mn-sim-kpi-delta`, `mn-sim-stepper`, mutations, talent cards, insights)
- Layout CSS: `patterns-strip-dashboard.css` — dashboard strip classes (`mn-strip-pipeline`, `mn-strip-gauge-wrap`, `mn-strip-kpi__spark`, `mn-strip-legend`, `mn-strip-board`) with container queries

### Fixed
- `--grigio-chiaro` avorio override to `#707070` (WCAG AA on ivory background, was #9e9e9e ~2.5:1)
- FerrariGauge `arcBar` conic gradient: start angle aligned to arc start, colorStops scaled by `arcFrac` (totalSweep/360) — colors now map correctly to value range

## [4.3.0] - 15 Mar 2026

### Added
- `--grigio-10` token (#e8e8e8) for divider and tertiary text consumers
- `--testo-primario` / `--testo-secondario` aliases for `--mn-text` / `--mn-text-muted` with dark overrides on avorio

### Fixed
- `--superficie-1/2/3` avorio values → warm-gray neutrals (#f5f0e8/ede8df/e5e0d7) instead of yellow-ivory
- `--bordo` avorio → #c8c0b4 (neutral warm-gray, was yellow-beige)
- FerrariGauge: full avorio bezel palette — warm-silver `capOuter`/`capInner`, dark text/numbers, darker gold ticks
- Funnel SVG: `font-family` now uses CSS variables (`var(--font-display)`, `var(--font-body)`) — adapts to theme
- Dashboard sparkline hover dot aligned to chart line (dimensions read after `chartHiDpi` runs)
- `applyChartA11y` innerHTML: `escapeHtml()` applied to label/value (XSS P1)
- `mn-chart`: `aria-busy` always cleared via `try-finally` even when chart factory throws
- Theme rotary: `aria-activedescendant` + IDs on radio items for screen reader support
- `contrast.test.ts`: `__dirname` → `fileURLToPath(import.meta.url)` for ESM compatibility
- CSS var parser in `check-contrast.mjs` + `contrast.test.ts`: capture vars before `}` to handle one-line rules
- Demo sections: heatmap/tables/accessibility theme-adaptive (removed `mn-card-dark`, semantic token colors)
- Arrow-key navigation (←/→) between demo sections
- Demo footer version bump to v4.2.0

## [4.2.0] - 15 Mar 2026

### Added
- Demo: all 33 sections now have a collapsible `⟨/⟩ Usage` snippet showing minimal component code

## [4.1.0] - 15 Mar 2026

### Added
- **WCAG 2.2 AA compliance** — full accessibility overhaul
- `scripts/check-contrast.mjs` — CI Constitution step validates contrast ratios across all 4 themes
- `applyChartA11y(canvas, label, data?)` — optional data param injects sr-only table for screen readers
- Focus trap on `<mn-a11y>` panel (Tab/Shift+Tab cycle when open)
- Theme rotary: `role=radiogroup`, Arrow/Home/End keyboard navigation
- Cruise lever: `role=slider`, `aria-value*`, Arrow/Home/End keyboard
- Drawer: `role=dialog`, `aria-modal` on open
- liveGraph: `aria-live=polite` region with throttled 5s trend announcements
- Toast: differentiated `role=alert`/`role=status` based on severity
- `<mn-chart>`: `aria-busy` during render
- Dynamic `aria-label` with node/edge counts on social-graph and neural-nodes
- `aria-required` on form fields with `data-validate="required"`
- 58 new accessibility unit tests (contrast, keyboard-nav, charts-a11y, forms-a11y, live-regions)

### Changed
- All 8 chart types pass meaningful data summaries to `applyChartA11y`

## [4.0.3] - 15 Mar 2026

### Fixed
- `<mn-a11y>` FAB: moved `position:fixed` to `:host` (light DOM) — shadow DOM fixed positioning unreliable cross-browser
- `<mn-a11y>` FAB: 52px, rosso-corsa background, sliders SVG icon — visible on all themes
- `<mn-a11y>` reset: `data-a11y-key` on toggles — dyslexiaFont and all toggles now reset correctly
- `<mn-a11y>` fallback: Escape key closes panel and returns focus to FAB

### Changed
- Language selector removed from demo nav (no strings were translated — misleading UX)
- README: removed EN/IT language claim from demo description

### Added
- Canvas a11y baseline: `role="img"`, `aria-label`, `tabindex="0"` on social-graph, map-view, neural-nodes, network-messages (charts-* already covered)

## [4.0.2] - 15 Mar 2026

### Added
- **NaSra agent** — built-in AI expert for the design system; covers adaptive token rules, WCAG 2.2, color blindness prevention, and responsive checklist. Auto-loads in Claude Code; one-line adoption for any consumer project.
- `scripts/check-theme-semantics.sh` — CI gate blocking unscoped `var(--bianco-caldo)` as text color in CSS and JS inline styles

### Fixed
- Replaced 40+ instances of `var(--bianco-caldo)` / `var(--grigio-chiaro)` with adaptive `var(--mn-text)` / `var(--mn-text-muted)` in 19 CSS files and 23 demo section JS files
- Dashboard KPI values invisible on Avorio theme (inline style fallback `var(--bianco-caldo,#f5f5f5)`)
- Demo footer version auto-synced from `package.json` via `scripts/inject-version.mjs`

## [4.0.0] - 15 Mar 2026

### Added
- **Semantic CSS token system** — 7 `--mn-surface/text/border` tokens that cascade into shadow DOM, enabling automatic WC theming across all themes without per-component overrides
- **`Maranello.palette()`** — live CSS token reader; returns 20 named tokens read from `getComputedStyle()` on each call so colors auto-adapt to runtime theme changes (replaces hardcoded `GROUP_COLORS`/`STAGE_COLORS` patterns)
- **A11y scaling system** — `--mn-a11y-font-scale` / `--mn-a11y-space-scale` multipliers: all text/spacing tokens wrapped in `calc()`, single var scales entire design system including shadow DOM
- **`--font-dyslexic`** token (`'OpenDyslexic'`, CDN-loaded on demand via a11y panel)
- **A11y body class rules** in CSS — `body.mn-a11y-*` classes now produce real effects: large-text (×1.2 font), high-spacing (×1.3 spacing), dyslexia-font (OpenDyslexic), high-contrast (WCAG AAA black/white), focus (3px ring), reduced-motion
- **Theme persistence** — `mn-theme-toggle` / `mn-theme-rotary` WCs save/restore theme via `localStorage`; inline early-restore script in demo prevents flash on reload
- Responsive mobile adaptation: breakpoints at 640px (mobile) and 1024px (tablet)
- `responsive-tokens.css` — spacing/layout token overrides per breakpoint
- `responsive-layouts.css` — sidebar off-canvas, detail panel/chat/notification/login full-width on mobile
- `responsive-data.css` — compact data table, toolbar wrap, strip-pod/binnacle stack on mobile
- `responsive-forms.css` — single-column grids, 44px touch targets, full-width buttons
- `responsive-charts.css` — chart/gauge container max-width, gantt scroll constraint
- `autoResize()` / `autoResizeAll()` — ResizeObserver wrapper for canvas charts
- `initSidebarToggle()` / `initSidebarToggleAuto()` — mobile hamburger sidebar toggle
- 6 responsive utility classes: `mn-hide-mobile`, `mn-show-mobile`, `mn-hide-tablet`, `mn-hide-desktop`, `mn-stack-mobile`, `mn-full-mobile`
- Footer copyright `© Roberdan 2026`

### Changed
- 47 CSS component files migrated from primitive tokens to semantic `--mn-*` tokens
- `body.mn-avorio` redefines all 7 semantic surface tokens (light palette)
- Demo uses hash-based SPA routing with lazy dynamic imports

### Fixed
- Avorio drawer background overridden by inline style (removed inline background)
- Chart tooltips always dark in Avorio mode (added `--mn-chart-tooltip-*` token overrides)
- Tooltip overflow on narrow screens (`white-space: nowrap` → `normal` + `max-width`)
- `<mn-chart>` ResizeObserver leak on attribute change (disconnect before rebuild)
- `speedometer` fluid mode creating recursive ResizeObserver on each resize

### Breaking
- **Glass theme removed** (`mn-glass`, `setGlass()`, `toggleGlass()`, `getGlass()`, all `themes-glass-*.css`)
- **`<mn-theme-rotary>` simplified** — glass toggle center button removed; center is now decorative hub
- **`mn-theme-change` event** no longer includes `glass` in detail payload

## [3.3.0] - 14 Mar 2026

### Added
- **Liquid Glass theme overlay** — translucent `backdrop-filter` surfaces via `body.mn-glass` class
  - `tokens-glass.css` — glass material tokens (blur, tint, border, shadow, overlay)
  - `themes-glass-base.css` — section-level glass surfaces with `@supports` fallback
  - `themes-glass-components.css` — glass overrides for card, btn, input, tag, accordion, signal-panel
  - `themes-glass-layouts.css` — glass overrides for sidebar, nav, modal, drawer, detail-panel, data-table, toast
  - `themes-glass-variants.css` — per-theme glass combos (nero+glass, avorio+glass, colorblind+glass)
- **Glass JS API**: `setGlass()`, `toggleGlass()`, `getGlass()` in core utils
- **Dual-level theme rotary** (`themeRotary`) — outer ring: 4 theme positions, center: glass toggle
- **`<mn-theme-rotary>`** Web Component with shadow DOM, keyboard accessible
- Glass demo section in demo pages
- ADR-0005: Liquid Glass Theme architecture decision record
- Body `background`/`color` for `mn-nero` and `mn-avorio` theme classes — full-page theme support
- Nero overrides: sim panel, network graph, filter chips, column layout, binnacle, strip/pod
- Avorio overrides: Ferrari control labels, detail panel comments, slide-out shadows, spinner, sim panel, network graph
- Colorblind overrides: sim panel status tags, OKR bar gradients, capacity heatmap cells, binnacle/strip-pod accents
- Avorio speedometer palette (warm ivory bg, rosso-corsa needle, dark text for contrast)
- 4 new color tokens: `--verde-racing-light`, `--giallo-ferrari-light`, `--rosso-corsa-light`, `--arancio-ambra`

### Changed
- 27 hardcoded hex values in TS canvas code replaced with `cssVar()` calls (theme-reactive at runtime)
- 14 remaining CSS hardcoded colors tokenized across 8 source files
- CI hardcoded color check upgraded from WARNING to blocking FAIL
- Social graph edges: cubic bezier curves with glow effects (replaces straight lines)

### Fixed
- Complete theme coverage matrix: all major components now covered across 4 themes
- OKR bar gradients now use Okabe-Ito palette in colorblind mode
- Capacity heatmap cells remap green/red to blue/orange in colorblind mode

## [3.2.1] - 14 Mar 2026

### Security
- **XSS hardening** — `sanitize.ts` module: `escapeHtml`, `sanitizeHtml`, `isValidColor`, `sanitizeAttr`, `sanitizeSvg`, `ALLOWED_BIND_PROPERTIES`
- All innerHTML/setHTML paths sanitized across 15 modules (map, charts, chat, table, forms, icons, gantt, okr, funnel, login, profile, system-status)
- SVG injection blocked via `sanitizeSvg()` (strips `<script>`, event handlers, external `<use>` href)
- Color values validated with `isValidColor()` before inline styles
- Data binding property whitelist (`ALLOWED_BIND_PROPERTIES`) with warn on non-whitelisted

### Accessibility
- Canvas charts: text alternatives with `role="img"`, `aria-label`, `mn-sr-only` fallback (11 chart modules + gauge + speedometer)
- Forms: `aria-invalid`, `aria-describedby`, `aria-required`, `aria-live="assertive"` on validation
- Keyboard navigation: date picker (arrows/Home/End/PgUp/PgDn), command palette (combobox pattern), detail panel (focus trap), drawer (Escape/focus trap), tabs (Home/End), org tree (arrow keys)
- Data table: `role="row"`, `scope="col"`, `aria-current="page"`, live region for sort/filter/pagination
- Binding: `aria-label` updated on gauge/chart after value change

### Themes
- **CRITICAL** Avorio gauge contrast fix — dark text on light backgrounds (was 1.2:1, now >4.5:1)
- Colorblind overrides for climate controls, live/donut/bar charts, gauge/temp badges (Okabe-Ito palette)
- 29 hardcoded hex colors tokenized with `var(--token, fallback)` pattern across 5 CSS files

### Performance
- Scroll handler throttled (100ms) in `initNavTracking`
- Resize handler throttled (300ms) in `profileMenu`
- Observer cleanup: `ResizeObserver`/`MutationObserver` disconnect in `mapView.destroy()`

### Quality
- Version synced to 3.2.1 across package.json, index.ts, esbuild banner
- CSS `!important` reduced from 48 to 26 (remaining are a11y/utility, documented)
- 6 silent failures fixed with `console.warn('[Maranello] ...')`
- Files >250 lines split: `tokens.css`, `layouts-data-table-compact-2.css`
- `any` types removed from `map-mapbox.ts`
- CLAUDE.md aligned: 25 WC, sanitize module, v3.2.1

### Testing
- 354 unit tests (sanitize, data-binding, forms-validate, map-view, ai-chat, detail-panel, wc-lifecycle)
- 4 E2E spec files (a11y with axe-core, keyboard, security XSS payloads, themes)

### Demo
- Overlays section (modal, toast, drawer, command palette)
- Org tree section with expand/collapse and keyboard nav
- Keyboard chart access (tabindex + Enter/Space on 15 canvases)
- Theme switcher shows active theme name
- Form validation demo with visible error states
- Data binding section with sliders → gauges + event bus log

### Migration Notes
- `data-binding.ts`: property whitelist is warn-only (non-blocking for backward compat)
- `escapeHtml` re-exported from `core/utils.ts` for backward compat

## [3.2.0] - 13 Mar 2026

### Added
- **Integration CSS layer** — 4-module drop-in theming for external SPAs (`@layer integration`)
  - `integration-theme-bridge.css` — `[data-theme="maranello"]` activates full token palette
  - `integration-reset.css` — body/heading/input/table/scrollbar resets
  - `integration-utilities.css` — `mn-panel`, `mn-badge-*`, `mn-btn-*`, `mn-status-dot-*`, `mn-gradient-text`, `mn-fade-in`
  - `integration-status.css` — Gantt/pipeline status: done/in-progress/pending/blocked/merging
- **Widget container** — `mn-widget` with title bar, action buttons, collapse, loading shimmer
- **Grid templates** — 6 responsive presets: `overview-4col`, `sidebar-main`, `triple-equal`, `dashboard-kpi`, `focus-detail`, `masonry-auto`
- **`gridLayout(container, template)`** — JS helper for dynamic grid template switching with staggered entry animation
- **Mapbox component** — `mapboxView()` JS API + `<mn-mapbox>` WC with dark globe, cluster markers, stage colors, choropleth
- **`escapeHtml()`** utility — shared XSS sanitization for all tooltip/innerHTML paths

### Fixed
- **5 XSS vulnerabilities** — `ai-chat-dom.ts` (avatar injection), `ai-chat-messages.ts` (SVG injection), `chart-interact.ts` (label injection), `gantt-events.ts` (task field injection), `map-view.ts` (marker injection)
- **`aiChat` IIFE wrapper** — now returns full controller with `open()`, `close()`, `addMessage()`, `setTyping()` (was returning raw DOM elements)
- **`flipCounter` button** — `set()` → `setValue()` (matching actual API)
- **`commandPalette`** — now creates proper DOM with ID string (was passing object)
- **`openDrawer`** — now creates drawer element with proper backdrop (was passing object)
- **`profileMenu`** — fixed trigger element + `sections` options (was passing wrong shape)
- **`loginScreen`** — fixed option names (`appTitle`, `subtitle`, `checks`, not `title`/`providers`)
- **Org tree** — proper `ul > li > .mn-org-tree__node > .mn-org-tree__toggle + .mn-org-tree__label` structure
- **`initDragRotary`** — `positions` → `steps` parameter name
- **Sliders** — added `mn-slider` CSS class + track/fill/thumb DOM structure
- **Map markers** — spread markers to prevent over-clustering, added `id`/`detail`/`color` fields
- **Funnel pipeline** — added `holdCount`, `withdrawnCount`, `onHold`/`withdrawn` exit data

### Changed
- CI hardened: removed `|| true` from tests, added `npm audit`, added Playwright e2e, added scrub check
- Bumped to v3.2.0

## [3.0.0] - 13 Mar 2026

### Added
- CSS @layer architecture (11 layers: tokens, base, themes, typography, layouts, components, forms, controls, charts, animations, utilities)
- 19 new TypeScript modules: observers, gauge-engine-class, speedometer-palette, speedometer-draw, h-bar-chart-draw, data-binding-events, data-binding-ui, icons-az, detail-panel system, a11y-panel system, controls-dialogs, controls-drag, map-view-events, map-view-helpers
- Dual-mode Web Components: ESM per-component import (`/wc/mn-*`) + CDN IIFE fallback — no `window.Maranello` polling
- `components.json` + `components-detail.json` AI-discoverable component catalog
- `maranello-exports.ts` IIFE facade split for tree-shakeable sub-package exports

### Changed
- All 22 WCs refactored from `window.Maranello` polling to `async resolveEngine()`
- IIFE bundle size threshold raised to 250 KB
- 70 CSS source files wrapped in `@layer` blocks for predictable cascade ordering

### Fixed
- CSS cascade ordering: previously unlayered rules now in correct `@layer` blocks

## [2.0.0] - 13 Mar 2026

### Added
- Initial extraction from VirtualBPM as standalone npm package
- Ferrari Luce-inspired design system with 4 themes (nero, avorio, editorial, colorblind)
- 84 CSS files with 390+ design tokens (generic, no domain-specific references)
- 61 TypeScript modules migrated from IIFE to ES modules
- 22 Web Components with Shadow DOM + CSS token inheritance
- esbuild toolchain: ESM, CJS, IIFE (48KB) bundles
- TypeScript declarations for full API
- Framework integration guides (Vanilla JS, React, Vue, Svelte, Vite)
- AI agent discoverability (components.json, AGENT_GUIDE.md, DATA_CONTRACTS.md)
- Demo page with fictional data (fightthestroke)
- GitHub Actions CI/CD + Pages deployment
- `prefers-color-scheme` auto theme detection
- WCAG 2.2 AA accessibility compliance
- Token override system for consumer customization

### Changed
- All `window.Maranello` IIFE patterns replaced with proper ES module exports
- Domain-specific tokens (prospect, exploration, sprint, etc.) replaced with generic `--stage-1` through `--stage-7`
- Scope tokens genericized (studio→local, org→team)
- mn-login web component scrubbed (Microsoft auth → generic SSO)

### Removed
- All VirtualBPM/ISE/Microsoft/Azure references
- app-*.ts application-level files (stay in VirtualBPM)
- Domain-specific icon sets (engagement, studio)
