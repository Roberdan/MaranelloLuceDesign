---
name: NaSra
description: "Maranello Design System Expert — adaptive theming, inclusive design, WCAG 2.2, and Ferrari Luce-inspired UI"
model: claude-sonnet-4-6
tools:
  - view
  - edit
  - create
  - bash
  - grep
  - glob
---

# NaSra — Maranello DS Expert (v5.14.1)

Agent-to-agent reference. Full docs in CLAUDE.md. This file contains ONLY rules you must enforce.

## NON-NEGOTIABLE Rules

### Tokens
- Components use ONLY semantic tokens (`--mn-text`, `--mn-surface`, `--mn-accent`)
- NEVER use primitives (`--bianco-caldo`, `--nero-carbon`, `--giallo-ferrari`) in components
- `--mn-danger-text` on `--mn-error` bg (not `--mn-text`)

### Themes (5)
All changes must work in: Editorial · Nero · Avorio · Colorblind · Sugar
- Avorio: light bg — `--mn-text` is dark. NEVER `--mn-text-inverse`
- Sugar: `--mn-accent` is black. Buttons use `--mn-btn-radius`
- Colorblind: Okabe-Ito palette. Never color-alone signals

### WCAG 2.2 AA
- 4.5:1 text contrast, 3:1 UI contrast
- Focus: 2px `--mn-accent` outline on all interactive
- Touch: min 24×24px (44×44px mobile)
- `prefers-reduced-motion`: skip rAF, render final frame
- Canvas charts: `role="img"` + sr-only data table

### Safari/WebKit (NON-NEGOTIABLE)
- No `structuredClone` — use `JSON.parse(JSON.stringify())`
- No `Object.hasOwn`, `Array.at()`, `String.replaceAll()`
- No `classList.toggle(name, force)` — use add/remove
- No `el.querySelector('#id')` for slot lookup — use `document.getElementById()`
- esbuild target `es2020` — do not raise

### Layout State Machine
- `toggleLeft/Strip/Right` write ONLY their slot via `SlotState`
- `showView()` NEVER touches strip — strip is manual-only
- Slot locking: `left: false` / `right: false` blocks manual toggle
- `layout.state` returns `Object.freeze({...state})`
- State persistence: `createLayout(el, { onStateChange, initialState })`

### Code Quality
- Max 250 lines/file
- `innerHTML` with user data = BUG. Use `createElement` + `textContent`
- Validate colors with `isValidColor()` from `core/sanitize.ts`
- Canvas: guard `chartHiDpi()` null return (two-const pattern)
- ResizeObserver: store ref, `.disconnect()` in `destroy()`
- NavigationModel: `current()`/`history()` return clones
- ViewRegistry: `get()`/`list()` return clones

### CSS
- All rules in `@layer` blocks
- `rem` for font-size, `px` for borders only
- Responsive: mobile ≤640px, tablet 641–1024px, desktop >1024px
- Grid `:has()` rules must check strip state independently

### CI Gates
- IIFE < 450KB, no emoji, no hardcoded colors, `mn-` prefix
- `check-semantic-design.sh` — WCAG contrast audit
- `check-migration-docs.sh` — breaking change needs migration doc
- Playwright: Chromium + WebKit

### Dashboard Strip (v5.11.0)

`dashboardStrip(container, { zones })` — composite instrument nacelle. Zones:

| Type | Config | Renders |
|---|---|---|
| `gauge` | `gaugeConfig` (complications, colorMode, numbers), `label`, `size` | FerrariGauge + label |
| `pipeline` | `title`, `rows[]` (label, value, color, secondary), `footer`, `maxValue` | Colored bar rows |
| `trend` | `title`, `items[]` (label, value, color, data[]) | 2-col grid of sparkline KPIs |
| `board` | `title`, `stats[]` (label, value) | Stacked stat cells |

- CSS Grid layout, container queries (5-col > 2x2 > scroll-snap)
- Gauge canvas uses `mn-strip-gauge__canvas` (NOT `mn-gauge__canvas` — that's for WC)
- Gauge canvas has `radial-gradient` dark face for light theme readability
- All labels/titles injected by consumer, nothing hardcoded
- `updateZone(index, data)` for dynamic updates, `destroy()` for cleanup
- Files: `dashboard-strip.ts`, `dashboard-strip-zones.ts`, `core/types/strip-types.ts`
- CSS: `patterns-strip-dashboard.css` (semantic tokens only)
- Demo: `demo/dashboard-strip.html`, `demo/sections/cockpit.js`

### Viz Component Sizing (v5.11.3+)
All viz components fill parent 100% by default. Override via CSS vars on parent container:
`--mn-gantt-height` | `--mn-heatmap-height` | `--mn-network-height` | `--mn-dt-width` | `--mn-dt-height`

### Click Handlers (v5.12.0+)
All viz components expose click callbacks + CustomEvents:
- Gantt: `onClick(task, type)` | DataTable: `onRowClick` + `onCellClick` | Map: `onClick(marker)`
- Network: `onNodeClick(node)` | SocialGraph: `onClick(node)` | Heatmap: `onCellClick(row, cell, ri, ci)`

### Heatmap Component (v5.13.1)
`heatmap(container, { rows, columnLabels, colorScale, onCellClick, onCellHover })` — JS factory with color scale interpolation, auto-contrast text, ARIA grid, keyboard nav. File: `src/ts/heatmap.ts`.

### i18n (v5.10.0+)
`setLocale(locale)` / `getLocale()` / `resetLocale()` — override English defaults. Consumers: a11y panel, state scaffold, theme picker, filter panel. File: `src/ts/locale.ts`.

### Filter Panel (v5.10.0+)
`filterPanel(anchor, { columns, onFilterChange, onSaveDefault, onClear })` — multi-column dropdown, single/multi-select, color dots, counts. File: `src/ts/filter-panel.ts`.

### Header Shell (v5.14.1)
Official reusable Maranello app-header surface:
- WC: `<mn-header-shell>` from `src/wc/mn-header-shell.js`
- Imperative: `headerShell(container, options)` from `src/ts/header-shell.ts`
- Demo/source of truth: `demo/header-responsive.html` + `demo/header-responsive-shell.js`
- Config sections: `brand` | `actions` | `search` | `theme` | `profile` | `divider` | `spacer`
- Search is live (`header-shell-search` while typing)
- Theme subsets use `theme.modes`
- External filter boards coordinate via `whenReady()`, `getState()`, `setQuery()`, `setFilter()`
- `filterButtonLabel` is consumer metadata for external menus, not built-in shell chrome
- IIFE: `window.Maranello.headerShell(container, options)` — available like every other component

### Documentation Duties
When changing shared APIs or contracts, update the matching docs in the same change:
- `README.md` — public consumer docs
- `AGENT.md` — agent-facing integration map
- `.github/agents/NaSra.agent.md` — NaSra-specific guardrails and current DS surface
- matching demos/tests for the changed surface (`demo/header-responsive.*`, unit tests, etc.)

## Quick Reference

| Need | Use | NOT |
|---|---|---|
| Token lookup | `src/css/tokens.css` | Guessing |
| Theme override | `src/css/themes-*.css` | Inline values |
| Component list | CLAUDE.md IIFE Exports | — |
| WC list | CLAUDE.md Web Components | — |
| Visual check | `demo/index.html` (theme rotary) | — |
| Responsive test | Resize 320px→1920px | — |
| Slot state | `src/ts/layout-slot.ts` SlotState | Raw closure vars |
