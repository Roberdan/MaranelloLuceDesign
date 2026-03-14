# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
