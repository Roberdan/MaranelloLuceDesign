<!-- v6.5.1 | 2026-03-29 -->
# convergio-design

Ferrari Luce-inspired DS monorepo: `@convergio/design-tokens` + `@convergio/design-elements`. 6 themes. 32 WC. WCAG 2.2 AA.

## Commands

`pnpm build` full | `pnpm test:unit` vitest | `pnpm test:e2e` playwright (Chromium+WebKit) | `pnpm typecheck` tsc --noEmit | `pnpm dev` demo :3000

## Architecture

`packages/tokens/` design tokens, themes, setTheme/cycleTheme, shadcn bridge | `packages/elements/` headless viz/domain JS + 32 `mn-*` WC + component CSS | `dist/` build output

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

`dashboardStrip(container, { zones, ariaLabel })` — composite instrument nacelle. Zone types: `gauge` (FerrariGauge + complications), `pipeline` (colored bar rows), `trend` (2-col sparkline KPIs), `board` (stat cells). CSS Grid layout, container queries, all 6 themes. `updateZone(i, data)` + `destroy()`. Canvas class: `mn-strip-gauge__canvas` (not `mn-gauge__canvas`).

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

**Themes:** All 6 must work. Avorio=light bg. Sugar accent=black. Colorblind=Okabe-Ito. Navy=deep blue+gold.

**WCAG:** 4.5:1 text, 3:1 UI, 24px targets, focus ring, `prefers-reduced-motion`, canvas `role="img"`+sr-only.

**Code:** Max 250 lines/file. `@layer` CSS. No `innerHTML` with user data. `isValidColor()` for colors.

**CI:** IIFE<450KB, no emoji, mn- prefix, no hardcoded colors, WCAG audit, migration docs gate, Chromium+WebKit.

## Releases

PATCH=fix | MINOR=feat or breaking+migration doc | Breaking: CHANGELOG `### Breaking Changes` + `docs/migrations/vX.Y.Z.md`

## Starter Platform

`starters/shared-shell/` — configuration-driven app shell foundation (typed contracts, adapters, deploy assets)
`starters/workspace/` — general SaaS workspace (project switching, command palette)
`starters/ops-dashboard/` — IT operations center (strip zones, status boards, alerts)
`starters/executive-cockpit/` — CEO/CFO view (hero KPIs, narrative, board summaries)
`starters/program-management/` — PMO shell (command rail, portfolio list, gantt board)
`starters/create-starter/` — instantiation workflow + manifests for all templates

Key contracts: `SharedShellConfig` -> template-specific configs (`WorkspaceConfig`, `OpsDashboardConfig`, `CockpitConfig`, `ProgramManagementConfig`). `SharedShellAdapters` bundles AI, auth, RBAC, telemetry, API, feature flag adapters. `generateDeployAssets('vercel'|'azure-container-apps')`. `createDefaultAISurfaces()` for command palette + agent panel + action routes.

Docs: `docs/starters/` — selection guide, deployment, agent semantics.

## State Machine Contracts

- WC `registerAll()` retryable on failure.

## SSR Safety

Root barrel imports are SSR-safe (v6.5.0+). No `document`/`window` at module scope.
`registerAll()` no-ops in Node. Call it in `useEffect` / client boundary only.
Starter demos: `demo/starter-workspace.html`, `demo/starter-ops-dashboard.html`, `demo/starter-executive-cockpit.html`, `demo/starter-program-management.html`, `demo/starter-hacker-terminal.html`, `demo/starter-app-template.html`.

## Agent

NaSra — `@.github/agents/NaSra.agent.md`
