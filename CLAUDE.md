<!-- v5.15.1 | 2026-03-26 -->
# MaranelloLuceDesign

Ferrari Luce-inspired DS for dashboards. 5 themes. 115+ IIFE exports. 35 WC. WCAG 2.2 AA.

## Commands

`npm run build` full | `npm run test:unit` vitest | `npm run test:e2e` playwright (Chromium+WebKit) | `npx tsc --noEmit` typecheck | `npm run dev` demo :3000

## Architecture

`src/css/` tokens+themes+components (123 files) | `src/ts/` headless JS+runtime | `src/wc/` 35 `mn-*` WC | `dist/` build output

Key: `layout.ts`+`layout-slot.ts` (state machine) · `header.ts` (navbar) · `tokens.css` · `themes-*.css` · `layouts-mn-layout.css` (grid `:has()`)

## Layout State Machine

- `createLayout(el?, { onStateChange, initialState })` — 4-slot grid
- Auto-init: `data-mn-auto-layout` on `#mn-grid`, or call explicitly
- `showView(id)` toggles `data-view` children. NEVER touches strip
- `toggleLeft/Right/Strip` write ONLY their slot via `SlotState`
- Slot config: `left: { id, render }` (view-driven) | `left: false` (locked) | undefined (don't touch)
- View-driven slots close on switch; manual toggles persist
- `layout.state` returns `Object.freeze({...})`

## Header

`header.init(el, opts)` — 3-zone (brand+left+center+right). `onClick` + `header-button-click` CustomEvent. `HeaderButton.title` for icon-only tooltip+aria.

## Dashboard Strip

`dashboardStrip(container, { zones, ariaLabel })` — composite instrument nacelle. Zone types: `gauge` (FerrariGauge + complications), `pipeline` (colored bar rows), `trend` (2-col sparkline KPIs), `board` (stat cells). CSS Grid layout, container queries, all 5 themes. `updateZone(i, data)` + `destroy()`. Canvas class: `mn-strip-gauge__canvas` (not `mn-gauge__canvas`).

## Viz Components

All fill parent by default (100% width/height). Override via CSS vars: `--mn-gantt-height`, `--mn-heatmap-height`, `--mn-network-height`, `--mn-dt-width/height`.

| Component | Click handler | CustomEvent |
|---|---|---|
| `gantt` | `onClick(task, type)` | — |
| `dataTable` | `onRowClick(row, i)` + `onCellClick(row, col, val)` | `mn:table-cell-click` |
| `mapView` / `mapboxView` | `onClick(marker)` | — |
| `networkMessages` | `onNodeClick(node)` | `mn-network-node-click` |
| `socialGraph` | `onClick(node)` + `onHover(node)` | — |
| `heatmap` | `onCellClick(row, cell, ri, ci)` + `onCellHover` | `mn-heatmap-cell-click` |

## i18n

`setLocale(locale)` / `getLocale()` / `resetLocale()` — override default English strings for a11y panel, state scaffold, theme picker, filter panel.

## NON-NEGOTIABLE

**Safari:** No `structuredClone`/`Object.hasOwn`/`Array.at()`/`classList.toggle(name,force)`. Use `getElementById` not `querySelector('#id')` for slots. Target `es2020`.

**Tokens:** Semantic only (`--mn-text/surface/accent`). NEVER primitives in components.

**Themes:** All 5 must work. Avorio=light bg. Sugar accent=black. Colorblind=Okabe-Ito.

**WCAG:** 4.5:1 text, 3:1 UI, 24px targets, focus ring, `prefers-reduced-motion`, canvas `role="img"`+sr-only.

**Code:** Max 250 lines/file. `@layer` CSS. No `innerHTML` with user data. `isValidColor()` for colors.

**CI:** IIFE<450KB, no emoji, mn- prefix, no hardcoded colors, WCAG audit, migration docs gate, Chromium+WebKit.

## Releases

PATCH=fix | MINOR=feat or breaking+migration doc | Breaking: CHANGELOG `### Breaking Changes` + `docs/migrations/vX.Y.Z.md`

## State Machine Contracts

- `NavigationModel.current()/history()` return clones. `pop()` returns new current. `remove()/clear()` emit events.
- `PanelOrchestrator.move()` updates nav. `open(existing, data)` remounts.
- `ViewRegistry.get()/list()` return clones. `reset()` clears first.
- `StateScaffold` warns on invalid state. 6 states: loading/ready/empty/error/partial/no-results.
- WC `registerAll()` retryable on failure.

## Agent

NaSra — `@.github/agents/NaSra.agent.md`
