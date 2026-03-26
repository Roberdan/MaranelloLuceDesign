# Maranello Luce Design — Agent Reference

> Ferrari Luce-inspired design system. Zero deps. 5 themes. 150+ APIs. 35 WC tags. v5.15.2
> Repo: github.com/Roberdan/MaranelloLuceDesign
> Demo: roberdan.github.io/MaranelloLuceDesign/
> AI Expert: @NaSra (see `.github/agents/NaSra.agent.md`)

## Install

```bash
npm install maranello-luce-design-business
```

## Import Paths

| Path | What |
|------|------|
| `maranello-luce-design-business` | Full bundle (charts, gauge, controls, forms, icons, utils) |
| `maranello-luce-design-business/css` | All CSS (tokens + themes + components) |
| `maranello-luce-design-business/charts` | sparkline, donut, barChart, areaChart, radar, bubble, halfGauge, liveGraph, hBarChart |
| `maranello-luce-design-business/gauge` | FerrariGauge, speedometer, createGauge |
| `maranello-luce-design-business/controls` | manettino, cruiseLever, toggleLever, steppedRotary, initRotary, initSlider, openDrawer, openDetailPanel |
| `maranello-luce-design-business/forms` | initForms, validateField, validateForm, initTagInput, initFileUpload, initFormSteps |
| `maranello-luce-design-business/gantt` | Gantt timeline renderer |
| `maranello-luce-design-business/wc` | All 35 Web Component tags |
| `maranello-luce-design-business/wc/mn-*` | Individual Web Components |

CDN (no build):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v5.15.2/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v5.15.2/dist/iife/maranello.min.js"></script>
```
IIFE attaches the public browser namespace to `window.Maranello`.

## Header Shell API

Official rich app-header surface for Maranello.

- Web Component: `import 'maranello-luce-design-business/wc/mn-header-shell'`
- Imperative: `import { headerShell } from 'maranello-luce-design-business'`
- IIFE: `window.Maranello.headerShell(container, options)`
- Demo/reference: `demo/header-responsive.html`

### Sections

`config.sections` accepts:

- `brand` → `{ label?, logo?, logoSrc?, logoAlt?, href? }`
- `actions` → `{ role: 'pre'|'post', presentation?: 'segmented'|'cluster', items[] }`
- `search` → `{ placeholder?, shortcut?, filterButtonLabel?, filters? }`
- `theme` → `{ modes?: ThemeMode[] }`
- `profile` → `{ name, avatarUrl?, sections? }`
- `divider`
- `spacer`

### Host/controller methods

- `controller` → current `HeaderShellController` instance after mount
- `whenReady()` → wait until the internal controller is mounted
- `getState()` → `{ query, filters, activeActionId, themeMode }`
- `setQuery(query)` → update live search state
- `setFilter(groupId, values)` → normalize and apply a filter group
- `destroy()` → available on the imperative controller returned by `headerShell(...)`
- `mn-header-shell-ready` → fires with `{ controller }`

### Composition rules

- Search is live: `header-shell-search` fires while typing
- Filters are consumer-owned; external filter menus should coordinate through `getState()`, `setQuery()`, and `setFilter()`
- `filterButtonLabel` is metadata for external filter-board UIs, not a built-in rendered button
- Keep `README.md`, `AGENT.md`, `.github/agents/NaSra.agent.md`, and `demo/header-responsive.*` aligned when changing the shell contract

## Themes

| Class | Style | Accent |
|-------|-------|--------|
| (default) | Editorial (dark, mixed surfaces) | Giallo Ferrari (#FFC72C) |
| `mn-nero` | Pure dark (#0a0a0a) | Giallo Ferrari (#FFC72C) |
| `mn-avorio` | Warm ivory light (#faf3e6) | Rosso Corsa (#DC0000) |
| `mn-colorblind` | Dark, Wong palette | Blue (#0072B2) |
| `mn-sugar` | Light grey, rounded | Black (#000000) |

Apply: `<body class="mn-nero">`. Toggle: `Maranello.cycleTheme()` or `Maranello.setTheme('nero')`.
Persist: `<mn-theme-toggle>` or `<mn-theme-rotary>` (saves to localStorage).

**CRITICAL — Token safety:** Always use `var(--mn-text)` / `var(--mn-surface)` for component
text/backgrounds. Never use `var(--bianco-caldo)` directly — it is `#fafafa` white, invisible
on Avorio. CI blocks violations. Ask `@NaSra` if unsure which token to use.

## Charts API

All chart functions: `(canvas: HTMLCanvasElement, data, options?) → void`

| Function | Data Format | Key Options |
|----------|-------------|-------------|
| `sparkline(canvas, data, opts)` | `number[]` | `{color, lineWidth, fill, height}` |
| `donut(canvas, segments, opts)` | `{label, value, color}[]` | `{innerRadius, showLabels, animate}` |
| `barChart(canvas, data, opts)` | `{label, value, color?}[]` | `{horizontal, stacked, maxValue}` |
| `areaChart(canvas, data, opts)` | `{x, y}[]` | `{color, fill, gradient, smooth}` |
| `radar(canvas, data, opts)` | `{axis, value}[]` | `{maxValue, showGrid, fillOpacity}` |
| `bubble(canvas, data, opts)` | `{x, y, r, label?, color?}[]` | `{maxRadius, showLabels}` |
| `halfGauge(canvas, data, opts)` | `{value, max}` | `{color, label, ticks}` |
| `liveGraph(canvas, data, opts)` | `number[]` | `{color, speed, maxPoints}` |
| `hBarChart(el, data, opts)` | `{label, value, color?}[]` | `{maxValue, showValues, barHeight}` |
| `progressRing(el, opts)` | — | `{value, size, color, strokeWidth}` |
| `flipCounter(el, opts)` | — | `{value, digits, prefix}` |

## Gauge API

| Function | Signature | Notes |
|----------|-----------|-------|
| `FerrariGauge(canvas)` | Returns `{init(), draw(pct), animate(), rad(deg)}` | Complex needle gauge with complications |
| `speedometer(canvas, opts)` | `{value, max, label, color?}` | Simpler arc gauge |
| `createGauge(el, opts)` | `{value, max, size?, palette?}` | Auto-configured gauge |
| `initGauges()` | Scans `[data-gauge]` attributes | Batch init from DOM |
| `buildGaugePalette(accent?)` | Returns render palette | Custom theming |

`data-gauge` JSON: `{"value":75,"max":100,"color":"#FFC72C","ticks":5}`

## Controls API

| Function | Returns | Usage |
|----------|---------|-------|
| `manettino(el, opts)` | ManettinoController | Ferrari dial selector |
| `cruiseLever(el, opts)` | CruiseLeverController | Cruise control lever |
| `toggleLever(el, opts)` | — | On/off toggle |
| `steppedRotary(el, opts)` | — | Multi-step rotary |
| `initRotary(el)` | — | General rotary knob |
| `initSlider(el)` | — | Slider control |
| `initDragRotary(el)` | — | Drag-to-rotate |
| `openDetailPanel(id)` | — | Show detail panel |
| `closeDetailPanel(id)` | — | Hide detail panel |
| `openDrawer(id)` | — | Show drawer |
| `closeDrawer(id)` | — | Hide drawer |
| `initOrgTree(container)` | — | Init org tree |

## Responsive API (v4.0.0)

| Function | Signature | Notes |
|----------|-----------|-------|
| `autoResize(canvas, factory, data)` | `(canvas, data, {width,height}) => void` | ResizeObserver; re-renders on width change |
| `autoResizeAll(selector?)` | scans `[data-chart]` | Batch init |
| `initSidebarToggleAuto()` | — | Auto-finds `.mn-sidebar` + `[data-sidebar-toggle]`; returns cleanup fn |
| `initSidebarToggle(sidebar, btn)` | explicit elements | Manual init |

Fluid gauge: `speedometer(canvas, { size: 'fluid' })` — call `controller.destroy()` on cleanup.
Fluid WCs: `<mn-gauge size="fluid">` · `<mn-speedometer size="fluid">` · `<mn-chart>` (no width/height).

## Forms API

| Function | Signature | Returns |
|----------|-----------|---------|
| `initForms(root?)` | Container element | — |
| `validateField(input, opts?)` | HTMLInputElement | `{valid, errors[]}` |
| `validateForm(form)` | HTMLFormElement | `boolean` |
| `initTagInput(el)` | HTMLElement | `{addTag, removeTag, getTags, onUpdate}` |
| `initFileUpload(el)` | HTMLElement | `{getFiles, reset, onUpload}` |
| `initFormSteps(el)` | HTMLElement | `{next, prev, goTo, onComplete}` |
| `initAutoResize(el)` | HTMLTextAreaElement | — |
| `initPasswordToggle(el)` | HTMLElement | — |
| `initLiveValidation(form)` | HTMLFormElement | — |

## Dialogs & Panels

| Function | Signature |
|----------|-----------|
| `toast(message, opts?)` | `{type: 'success'\|'danger'\|'warning'\|'info', duration: 3000}` |
| `openModal(id)` | Show modal by id |
| `closeModal(id)` | Hide modal by id |
| `commandPalette(opts)` | `{commands: [{label, action, shortcut}]}` |
| `loginScreen(opts)` | `{title, actionUrl, onSubmit}` |
| `profileMenu(opts)` | `{user, options: [{label, action}]}` |
| `systemStatus(container, opts)` | `{services: [{name, status, detail}]}` |

## Data Binding

| Function | Usage |
|----------|-------|
| `emit(event, data)` | Emit custom event |
| `on(event, handler)` | Listen to event |
| `off(event, handler)` | Remove listener |
| `bind(source, target, transform?)` | Two-way bind |
| `autoBind()` | Auto-bind `[data-bind]` attrs |
| `onDrillDown(handler)` | Handle detail drill-down |
| `updateGauge(id, value)` | Update gauge by data-id |
| `bindChart(id, source)` | Live-bind chart data |

## Analytics & BI APIs

| Function | Signature | Description |
|---|---|---|
| `waterfallChart` | `(canvas, {segments, unit?, animate?})` | Sequential variance chart |
| `confidenceChart` | `(canvas, {labels, values, lower, upper})` | Forecast with confidence bands |
| `costTimeline` | `(canvas, {labels, series, stacked?, unit?})` | Multi-series cost area (hover dots) |
| `riskMatrix` | `(canvas, {items, onHover?, onClick?})` | Impact×probability grid |
| `kpiScorecard` | `(el, rows, {currency?, onSelect?})` | KPI table with trends |
| `agentCostBreakdown` | `(el, rows, {sortable?, onBudgetAlert?})` | Per-agent cost table |
| `tokenMeter` | `(el, {used, total, label})` | Budget usage meter |
| `cohortGrid` | `(el, rows, {periodLabels?})` | Retention cohort heatmap |
| `approvalChain` | `(el, steps, {editable?, onAction?})` | Workflow approval chain |
| `decisionMatrix` | `(el, {criteria, alternatives})` | Weighted scoring matrix |
| `renderSourceCards` | `(el, cards, {maxVisible?, layout?})` | RAG citation cards |
| `chartInteract` | `(canvas, meta, colors?)` | Crosshair + hover dots + tooltip |
| `sparklineInteract` | `(canvas, data, opts?)` | Sparkline hover dot + tooltip |

### Gauge colorMode

Set `colorMode` in `data-gauge` JSON to auto-generate arcBar colorStops:
- `'higher-better'` — green at high values (quality, uptime)
- `'lower-better'` — green at low values (latency, errors)

## Web Components (32 tags, 31 components)

All use `mn-` prefix. Attributes are kebab-case. Events: `mn-{name}-ready`, `mn-{name}-change`.

| Tag | Key Attributes | Event |
|-----|---------------|-------|
| `<mn-chart>` | `type, data, options, theme` | `mn-chart-change` |
| `<mn-gauge>` | `value, max, unit, size, label` | `mn-gauge-change` |
| `<mn-speedometer>` | `value, max, label` | — |
| `<mn-gantt>` | `data, options, theme` | `mn-gantt-change` |
| `<mn-data-table>` | `data, columns, sortable, paginate` | `mn-table-change` |
| `<mn-hbar>` | `data, options` | — |
| `<mn-funnel>` | `data, options` | `mn-funnel-click` |
| `<mn-detail-panel>` | `id, title` | `mn-panel-open` |
| `<mn-okr>` | `objectives, options` | — |
| `<mn-ferrari-control>` | `type, options` | — |
| `<mn-modal>` | `title, open` | `mn-modal-close` |
| `<mn-toast>` | `type, message, duration` | `mn-toast-dismiss` |
| `<mn-login>` | `title, action-url` | `mn-login-submit` |
| `<mn-command-palette>` | `commands, placeholder` | `mn-command-select` |
| `<mn-date-picker>` | `value, min, max` | `mn-date-change` |
| `<mn-profile>` | `user, options` | `mn-profile-action` |
| `<mn-theme-toggle>` | `theme` | `mn-theme-change` |
| `<mn-theme-rotary>` | `size` | `mn-theme-change` |
| `<mn-tabs>` / `<mn-tab>` | `value` / `label, value` | `mn-tab-change` |
| `<mn-section-nav>` | `sections, current, data-theme, data-pos` | — |
| `<mn-map>` | `data, center, zoom` | `mn-map-click` |
| `<mn-mapbox>` | `access-token, style, center, zoom` | `mn-mapbox-click` |
| `<mn-chat>` | `placeholder, title, agents` | `mn-chat-send` |
| `<mn-system-status>` | `services, environment` | `mn-status-change` |
| `<mn-a11y>` | — (auto-mounts by default) | `mn-a11y-change` |
| `<mn-ferrari-control>` | `type, value, min, max` | `mn-control-change` |
| `<mn-okr>` | `data, options` | `mn-okr-change` |

## Icons (149+)

Access: `Maranello.renderIcon(el, 'iconName', {size, class})` or `Maranello.icons.nav.dashboard`

| Category | Icons |
|----------|-------|
| **nav** | dashboard, home, menu, chevronRight, chevronDown, chevronLeft, arrowUp, arrowDown, arrowLeft, arrowRight, sidebar, expand, collapse, externalLink, dotsHorizontal, dotsVertical |
| **status** | checkCircle, alertTriangle, infoCircle, xCircle, completed, blocked, loader, clock, shield, shieldCheck |
| **actions** | refresh, settings, close, edit, copy, trash, download, upload, plus, minus, filter, sort, search, eye, eyeOff, link |
| **data** | gauge, trendUp, trendDown, trendFlat, barChart, pieChart, kpi, impact, pipeline, orgChart, table |
| **objects** | user, users, briefcase, lock, unlock, bell, mail, calendar, file, folder, clock, globe, bolt, terminal, activity, heart, star, bookmark, flag, tag, hash, code, database, cloud, server, cpu, zap, map, phone, camera, image, award, gift, package, truck, creditCard, shoppingCart, key, compass, layers, grid, list, maximize, minimize, paperclip |
| **platform** | apple, windows, linux, ubuntu, cpu, ram, disk, network, terminal, shell, git, gitBranch, gitMerge, gitPullRequest, docker, kubernetes, aws, azure, gcp, brain, robot, sparkle, nightAgent, autopilot, delegate, monitor, scale, orchestrate, mesh, coordinator, worker, session, synapse, idea, optimize, deploy, pipeline, webhook, api, sdk, cli, plugin, extension, config, env, log, metric, alert, health, uptime, latency, throughput |

Sizes: `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px), `2xl` (48px)

## CSS Classes (Key)

### Layout

| Class | Usage |
|-------|-------|
| `mn-section-dark` | Dark section wrapper |
| `mn-section-light` | Light section wrapper |
| `mn-container` | Max-width centered container |
| `mn-grid-2` / `mn-grid-3` / `mn-grid-4` | Column grids |
| `mn-grid-template--overview-4col` | Dashboard 4-col layout |
| `mn-grid-template--sidebar-main` | Sidebar + main |
| `mn-sidebar` | Sidebar nav (add `--collapsed` to collapse) |
| `mn-drawer` | Slide-out drawer (add `--open`) |
| `mn-split-layout` | Two-pane split |

### Components

| Class | Usage |
|-------|-------|
| `mn-card-dark` | Dark card container |
| `mn-card-light` | Light card container |
| `mn-stat` | Stat card (contains `mn-stat__value`, `mn-stat__label`, `mn-stat__delta`) |
| `mn-btn` | Button (variants: `--accent`, `--ghost`, `--danger`, `--sm`, `--lg`) |
| `mn-tag` | Tag/badge (variants: `--success`, `--danger`, `--warning`, `--info`) |
| `mn-table` | Data table (wrap in `mn-table-wrap`) |
| `mn-rich-table` | Enhanced table with filters |
| `mn-avatar` | User avatar (sizes: `--sm`, `--md`, `--lg`) |
| `mn-status` | Status dot (`--online`, `--offline`, `--warning`) |
| `mn-progress` | Progress bar (set width via `style`) |
| `mn-divider-gold` | Gold accent divider |
| `mn-signal-panel` | Signal/status panel |
| `mn-breadcrumb` | Breadcrumb nav |
| `mn-tabs` | Tab container |
| `mn-modal` | Modal dialog |
| `mn-toast` | Toast notification |
| `mn-spinner` | Loading spinner |
| `mn-tooltip` | Tooltip |
| `mn-dropdown` | Dropdown menu |

### Typography

| Class | Usage |
|-------|-------|
| `mn-title-hero` | Hero title (clamp 2.5-4.5rem) |
| `mn-title-section` | Section heading |
| `mn-label` | Label text (uppercase, tracking) |
| `mn-body` | Body text |
| `mn-micro` | Small text |
| `mn-section-number` | Section number label |

### Forms

| Class | Usage |
|-------|-------|
| `mn-form` | Form wrapper |
| `mn-field` | Field group (contains label + input) |
| `mn-input` | Text input |
| `mn-select` | Select dropdown |
| `mn-checkbox` | Checkbox |
| `mn-radio` | Radio button |
| `mn-toggle` | Toggle switch |
| `mn-wizard-*` | Multi-step wizard |
| `mn-tag-input` | Tag input field |
| `mn-search-bar` | Search bar |

### Convergio / AI

| Class | Usage |
|-------|-------|
| `mn-mesh-network` | Mesh network container |
| `mn-mesh-node` | Individual mesh node card |
| `mn-mesh-bar` | Resource bar (CPU/RAM) |
| `mn-mesh-badge` | Agent badge (`--claude`, `--copilot`, `--ollama`) |
| `mn-mesh-status` | Status dot (`--on`, `--off`, `--sync`, `--drift`) |
| `mn-mission-card` | Mission tracking card |
| `mn-mission-status` | Status badge (`--progress`, `--done`, `--failed`) |
| `mn-night-agent` | Night agent job card |
| `mn-convergio-toolbar` | Pill navigation toolbar |
| `mn-convergio-pill` | Toolbar pill button (add `--active`) |
| `mn-idea-jar` | Idea collection widget |
| `mn-optimize-badge` | Optimize action badge |

### Animations

| Class | Effect |
|-------|--------|
| `mn-anim-fadeIn` | Fade in |
| `mn-anim-fadeInUp` | Fade in from below |
| `mn-anim-fadeInLeft` | Fade in from left |
| `mn-anim-scaleIn` | Scale in |
| `mn-anim-pulse` | Pulse attention |
| `mn-shimmer` | Shimmer loading |
| `mn-skeleton` | Skeleton placeholder |
| `mn-hover-lift` | Lift on hover |
| `mn-hover-glow` | Glow on hover |

## Tokens (Key CSS Variables)

### Colors

| Variable | Value | Use |
|----------|-------|-----|
| `--mn-accent` | Theme accent | Primary action color |
| `--giallo-ferrari` | #FFC72C | Ferrari yellow |
| `--rosso-corsa` | #DC0000 | Ferrari red |
| `--verde-racing` | #00A651 | Success green |
| `--nero-assoluto` | #0a0a0a | Darkest black |
| `--grigio-medio` | varies | Secondary text |
| `--grigio-scuro` | varies | Borders |
| `--grigio-chiaro` | varies | Subtle text |
| `--superficie-1` | varies | Card background |
| `--superficie-2` | varies | Elevated surface |
| `--signal-ok` | green | Healthy status |
| `--signal-warn` | amber | Warning status |
| `--signal-danger` | red | Error status |

### Typography

| Variable | Value |
|----------|-------|
| `--font-display` | 'Outfit', sans-serif |
| `--font-body` | 'Inter', sans-serif |
| `--font-mono` | 'Barlow Condensed', monospace |
| `--text-hero` | clamp(2.5rem, 5vw, 4.5rem) |
| `--text-h1` → `--text-micro` | Heading scale |

### Spacing

`--space-2xs` (2px) → `--space-5xl` (128px). Base unit: 4px.

### Borders & Shadows

| Variable | Use |
|----------|-----|
| `--radius-sm` | Small radius (6px) |
| `--radius-md` | Medium radius (8px) |
| `--radius-lg` | Large radius (12px) |
| `--radius-pill` | Pill shape |
| `--shadow-sm` → `--shadow-deep` | Elevation levels |

## AI Operations

First-class components for AI/LLM monitoring dashboards. All accessible (WCAG AA), themed, responsive.

| Component | API | Purpose |
|-----------|-----|---------|
| `tokenMeter` | `(el, {used, total, label})` | Token budget usage with `role=meter` and `aria-valuenow` |
| `agentCostBreakdown` | `(el, rows, {sortable?, onBudgetAlert?})` | Per-agent cost attribution table, sortable columns |
| `agentTrace` | `(el, steps, {onSelect?})` | Step-by-step agent execution trace with status indicators |
| `costTimeline` | `(canvas, {labels, series, stacked?, unit?})` | Multi-series cost area chart with built-in hover |
| `streamingText` | `(el, {onCitationClick?})` | Streaming LLM output renderer with citation support |

See `docs/agent-cookbook.md` for a full integration recipe combining all five components.
Demo: `demo/sections/agentic.js` (trace, meter, streaming) and `demo/sections/finops.js` (costs, timeline, meter).

## Decision Tree

| I need... | Use |
|-----------|-----|
| Dashboard page | `mn-section-dark` + `mn-container` + `mn-stat` cards + `<mn-chart>` |
| Data table | `<mn-data-table data="..." sortable paginate>` or `mn-table` + `mn-rich-table` (CSS-only) |
| Form | `mn-form` + `mn-field` + `mn-input` + `initForms()` for validation |
| Chart | `<mn-chart type="donut" data="[...]">` (WC) or `Maranello.charts.donut(canvas, data)` (JS) |
| Gauge/speedometer | `<mn-gauge value="72" max="100">` or `Maranello.speedometer(canvas, {value, max})` |
| Navigation | `mn-sidebar` + `mn-breadcrumb` + `mn-tabs` |
| Modal/dialog | `<mn-modal title="...">content</mn-modal>` + `openModal(id)` |
| Toast notification | `Maranello.toast('Saved!', {type: 'success'})` |
| AI agent mesh | `mn-mesh-network` + `mn-mesh-node` cards |
| Mission tracking | `mn-mission-card` + `mn-mission-status` |
| Gantt chart | `<mn-gantt data="[...]">` |
| Login page | `<mn-login title="Sign In">` or `Maranello.loginScreen(opts)` |
| Icons | `Maranello.renderIcon(el, 'dashboard', {size: 'lg'})` |
| Dark theme | `<body class="mn-nero">` |
| Light theme | `<body class="mn-avorio">` |
| Night job card | `mn-night-agent` + `mn-night-agent__header/schedule/actions` |
| Command palette | `<mn-command-palette>` or `Maranello.commandPalette(opts)` |
| Accessibility | `<mn-a11y>` — adds font/contrast/motion controls |
| A11y focus trap | `openDrawer()`, `<mn-modal>`, `<mn-a11y>` — Tab traps, Escape closes |
| Chart SR data | `applyChartA11y(canvas, label, data?)` — sr-only table for screen readers |
| Keyboard nav | Theme rotary (Arrow), Ferrari controls (Arrow/Home/End), command palette |
| Contrast CI | `node scripts/check-contrast.mjs` — WCAG AA ratio check in CI |
| Controls (Ferrari) | `<mn-ferrari-control type="rotary" value="65">` |
| Funnel chart | `<mn-funnel data="[...]">` or `Maranello.funnel(el, data)` |
| Org tree | `Maranello.initOrgTree(container)` |
| Responsive canvas chart | `Maranello.autoResize(canvas, Maranello.sparkline, data)` |
| Fluid gauge | `<mn-gauge size="fluid">` or `speedometer(canvas, {size:'fluid'})` |
| Theme rotary | `<mn-theme-rotary>` — dual-level base+overlay selector |
| Live color tokens | `Maranello.palette()` — reads 20 semantic tokens from active theme |
| Mobile sidebar | `Maranello.initSidebarToggleAuto()` |

## Recipes

### Minimal dashboard

```html
<body class="mn-nero">
<link rel="stylesheet" href="maranello-luce-design-business/css">
<div class="mn-section-dark"><div class="mn-container">
  <h2 class="mn-title-section">Ops</h2>
  <div class="mn-grid-3">
    <div class="mn-stat"><span class="mn-stat__value">1,247</span><span class="mn-stat__label">Users</span></div>
    <div class="mn-stat"><span class="mn-stat__value">98.7%</span><span class="mn-stat__label">Uptime</span></div>
    <mn-gauge value="72" label="CPU"></mn-gauge>
  </div>
</div></div>
</body>
```

### Agent mesh + mission

```html
<div class="mn-mesh-network">
  <div class="mn-mesh-network__grid">
    <article class="mn-mesh-node">
      <div class="mn-mesh-node__header">
        <h4 class="mn-mesh-node__name">WORKER-1</h4>
        <span class="mn-mesh-status mn-mesh-status--on"></span>
      </div>
      <div class="mn-mesh-badges">
        <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
      </div>
      <div class="mn-mesh-bar">
        <span class="mn-mesh-bar__label">CPU</span>
        <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill" style="width:45%"></span></span>
      </div>
    </article>
  </div>
</div>
<article class="mn-mission-card">
  <div class="mn-mission-card__header">
    <p class="mn-mission-card__title">Deploy v3</p>
    <span class="mn-mission-status mn-mission-status--progress">In Progress</span>
  </div>
</article>
```

### Form with validation

```html
<form class="mn-form" id="myForm">
  <div class="mn-field">
    <label class="mn-label">Email</label>
    <input class="mn-input" type="email" required>
  </div>
  <button class="mn-btn mn-btn--accent" type="submit">Submit</button>
</form>
<script>Maranello.initForms(document.getElementById('myForm'))</script>
```

## Modifying This Design System

Read [CONSTITUTION.md](CONSTITUTION.md) first. All rules are enforced by CI.

### Add a CSS component
1. Create `src/css/<name>.css` inside appropriate `@layer`
2. Import in barrel file (`layouts.css`, `components.css`, etc.)
3. Use `mn-` prefix, BEM naming, token variables only
4. Verify in all 5 themes

### Add a JS API
1. Create `src/ts/<name>.ts` with named exports
2. Re-export from `src/ts/index.ts`
3. Add unit test in `tests/unit/<name>.test.ts`
4. JSDoc on all public functions

### Add an icon
1. Add SVG to appropriate `src/ts/icons-*.ts` file
2. viewBox="0 0 24 24", stroke="currentColor", fill="none", stroke-width="1.5"
3. Re-export from `src/ts/icons.ts`
4. NO EMOJI — ever

### Add a Web Component
1. Create `src/wc/mn-<name>.js`
2. Register in WC barrel
3. Add demo in `demo/sections/`
4. Include `aria-*` attributes on interactive parts

### Validation
```bash
npm run build && npm run test:unit && npx tsc --noEmit
```
