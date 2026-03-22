# Maranello Luce Design System

Ferrari Luce-inspired design system for AI agent dashboards. Zero runtime dependencies. 5 adaptive themes. WCAG 2.2 AA. Framework-agnostic.

**v5.3.1** | [Live Demo](https://roberdan.github.io/MaranelloLuceDesign/) | [Migration Guide](docs/migrations/v5.3.0.md) | [CHANGELOG](CHANGELOG.md)

## Install

```bash
npm install maranello-luce-design-business
```

## Quick Start

### 1. CSS (one import, full system)

```css
/* All tokens, themes, components, responsive, layouts — 506KB */
@import 'maranello-luce-design-business/css';
```

Or cherry-pick individual files:

```css
@import 'maranello-luce-design-business/css/tokens.css';
@import 'maranello-luce-design-business/css/components-buttons-stats.css';
```

### 2. JS (ESM, tree-shakeable)

```ts
import { sparkline, palette, FerrariGauge, toast } from 'maranello-luce-design-business';
import { AppShellController, StateScaffold } from 'maranello-luce-design-business';
import { gantt } from 'maranello-luce-design-business/gantt';
import { barChart, donut } from 'maranello-luce-design-business/charts';
```

### 3. Web Components (zero boilerplate)

```html
<script type="module">
  import 'maranello-luce-design-business/wc';
</script>

<mn-gauge value="72" unit="%"></mn-gauge>
<mn-chart type="sparkline" data="[10,20,30]"></mn-chart>
<mn-data-table columns='[{"key":"name","label":"Name"}]' data='[{"name":"Alpha"}]'></mn-data-table>
```

### 4. IIFE (CDN, no bundler)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v5.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v5.0.0/dist/iife/maranello.min.js"></script>
<script>
  Maranello.sparkline(document.getElementById('chart'), [10, 20, 15, 30]);
  new Maranello.FerrariGauge(document.getElementById('gauge'));
</script>
```

## Architecture

Three independent layers. Use together or separately.

| Layer | Import | What you get |
|---|---|---|
| CSS-only | `maranello-luce-design-business/css` | Tokens, 5 themes, 120+ component stylesheets, responsive breakpoints |
| Headless JS | `maranello-luce-design-business` | 96+ exports: charts, gauges, controls, forms, data binding, runtime |
| Web Components | `maranello-luce-design-business/wc` | 32 `mn-*` tags that self-initialize, auto-resize, emit DOM events |

### Package Exports

| Path | Content |
|---|---|
| `.` | Main ESM/CJS entry (96+ exports) with TypeScript types |
| `./css` | Full CSS system (tokens + themes + components + responsive + integration) |
| `./css/*` | Individual CSS files for selective imports |
| `./wc` | All 32 Web Components with auto-registration |
| `./wc/*` | Individual Web Components |
| `./charts` | Chart sub-package (sparkline, donut, bar, area, radar, bubble, etc.) |
| `./gantt` | Gantt chart |
| `./gauge` | FerrariGauge engine |
| `./controls` | Ferrari controls (manettino, rotary, lever, slider) |
| `./forms` | Form validation, live validation, tag input, file upload, steps |

## Themes

Set theme via body class. All components adapt automatically.

| Theme | Body class | Surface | Accent | Use case |
|---|---|---|---|---|
| Editorial | (none) | `#111111` dark | `#FFC72C` gold | Default dark dashboard |
| Nero | `mn-nero` | `#050505` deep black | `#FFC72C` gold | High-contrast dark |
| Avorio | `mn-avorio` | `#FAF3E6` warm ivory | `#DC0000` red | Light/warm |
| Colorblind | `mn-colorblind` | `#111111` dark | `#0072B2` blue | Okabe-Ito safe palette |
| Sugar | `mn-sugar` | `#E4E4E8` cool gray | `#000000` black | Modern light, rounded corners |

Cross-theme: `body.mn-sugar.mn-colorblind` combines cool gray + Okabe-Ito signals.

```js
// JS theme API
Maranello.setTheme('sugar');           // apply theme
Maranello.cycleTheme();                // rotate through all 5
const tokens = Maranello.palette();    // read live semantic tokens
```

## Framework Integration

All JS APIs are **imperative DOM-first**: acquire a DOM ref, init on mount, destroy on unmount. This works with any framework.

### React

```tsx
import { useRef, useEffect } from 'react';
import { gantt } from 'maranello-luce-design-business/gantt';

function GanttView({ tasks }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const w = gantt(ref.current!, tasks);
    return () => w.destroy();
  }, [tasks]);
  return <div ref={ref} />;
}
```

### Svelte 5

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { gantt } from 'maranello-luce-design-business/gantt';

  let el; let w;
  onMount(() => { w = gantt(el, tasks); });
  onDestroy(() => w?.destroy());
</script>
<div bind:this={el}></div>
```

### Vue 3

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gantt } from 'maranello-luce-design-business/gantt';

const el = ref();
let w;
onMounted(() => { w = gantt(el.value, tasks); });
onUnmounted(() => w?.destroy());
</script>
<template><div ref="el"></div></template>
```

### Next.js / SSR

```tsx
'use client';
import dynamic from 'next/dynamic';
// Maranello requires DOM — use dynamic import with ssr: false
const GanttView = dynamic(() => import('./GanttView'), { ssr: false });
```

### Web Components (any framework, zero adapter)

```html
<!-- Works in React, Vue, Svelte, Angular, Astro, plain HTML -->
<mn-gantt tasks='[{"id":1,"label":"Deploy","start":"2026-01-01","end":"2026-01-15"}]'></mn-gantt>
<mn-gauge value="72" unit="%" size="fluid"></mn-gauge>
<mn-state-scaffold state="loading" message="Fetching data..."></mn-state-scaffold>
```

Web Components self-register, handle resize, and fire standard DOM events. No adapter needed.

### Important: SSR Limitation

Maranello is a **client-side** design system. All JS APIs require a DOM (`document`, `canvas`, `ResizeObserver`). For SSR frameworks (Next.js, Nuxt, SvelteKit, Astro):

- CSS imports work in SSR (static stylesheet)
- JS/WC must be client-only (`'use client'`, `onMount`, dynamic import with `ssr: false`)
- Web Components hydrate on the client after page load

## Presentation Runtime

Schema-driven layout system for dashboards and entity editors.

```
Consumer App                    Maranello Runtime
+-------------+                +-----------------+
| Data fetch  |--schema------->| AppShell        |
| Biz rules   |--data--------->| ViewRegistry    |
| Permissions |--actions------->| PanelOrchestrator|
| Navigation  |--callbacks---->| DashboardRenderer|
+-------------+                | FacetWorkbench  |
                               | EntityWorkbench |
                               | StateScaffold   |
                               +-----------------+
```

```js
// 1. Create shell
const shell = new Maranello.AppShellController(document.getElementById('app'), {
  layout: 'side-detail',
});

// 2. Register views
const registry = Maranello.ViewRegistry.getInstance();
registry.register({
  id: 'dashboard',
  title: 'Dashboard',
  defaultPlacement: 'page',
  factory: (el, data) => new Maranello.DashboardRenderer(el, { schema, data }),
});

// 3. Orchestrate (pass shell for integrated slot rendering)
const nav = new Maranello.NavigationModel();
const orch = new Maranello.PanelOrchestrator(registry, nav, shell);
orch.open('dashboard', 'page', await fetchData());

// 4. State management
const scaffold = new Maranello.StateScaffold(container, { state: 'loading' });
// On data loaded:
scaffold.setState('ready');
// On degraded (some data missing):
scaffold.setState('partial', 'Historical data unavailable');
```

### StateScaffold States

| State | When | Consumer action |
|---|---|---|
| `loading` | Initial fetch in progress | Show immediately |
| `ready` | Data loaded successfully | Content renders, status hidden |
| `empty` | Fetch succeeded, zero records | Add CTA via `onAction` |
| `error` | Fetch failed | Provide `onRetry` callback |
| `partial` | Degraded — some data unavailable | Content renders with warning banner |
| `no-results` | Filters applied, zero matches | Offer "Clear filters" via `onAction` |

### Layout Modes

| Mode | Use case |
|---|---|
| `full` | Single page, landing, login |
| `split` | Master-detail, compare views |
| `stacked` | Mobile-first flows, wizards |
| `docked-bottom` | Data + timeline, chat + canvas |
| `dual-panel` | Side-by-side editors, diff views |
| `side-detail` | Full apps with nav + drill-in |

## App Layout (Simple Dashboard Framework)

Lightweight alternative to AppShellController — 4-slot CSS grid with `:has()` auto-collapse + state machine.

```html
<!-- Option A: auto-init layout on DOMContentLoaded (add data-mn-auto-layout) -->
<div id="mn-grid" data-mn-auto-layout>
  <div id="mn-slot-strip" hidden></div>
  <div id="mn-slot-left" hidden></div>
  <div id="mn-slot-center"></div>
  <div id="mn-slot-right" hidden></div>
</div>

<!-- Option B: CSS-only grid (no auto-init, call createLayout() yourself) -->
<div id="mn-grid">
  <div id="mn-slot-strip" hidden></div>
  <div id="mn-slot-left" hidden></div>
  <div id="mn-slot-center"></div>
  <div id="mn-slot-right" hidden></div>
</div>
```

```js
// Option A: auto-init — Maranello.layout is ready after DOMContentLoaded
Maranello.layout.register('dashboard', { label: 'Dashboard', buttonId: 'btn-dash' });
Maranello.layout.register('settings', { label: 'Settings', fullpage: true });

// Option B: explicit init — for framework consumers (Svelte, React, etc.)
const layout = Maranello.createLayout(document.getElementById('mn-grid'));
layout.register('dashboard', { label: 'Dashboard' });

// Switch views + toggle slots
layout.showView('dashboard');
layout.toggleLeft();
layout.openRight();
layout.wireButtons();

// Listen for changes
document.addEventListener('layout-changed', (e) => console.log(e.detail));
```

Features: fullpage mode (saves/restores sidebar state), responsive stacking under 900px, CSP-safe, `layout-changed` events.

## Header (3-Zone Navbar)

```js
Maranello.header.init(navbar, {
  brand: { label: 'MyApp', logo: svgString },
  left: [
    { id: 'dash', label: 'Dashboard', active: true, onClick: () => showView('dash') },
    'separator',
    { id: 'reports', label: 'Reports', onClick: () => showView('reports') }
  ],
  center: { type: 'search', placeholder: 'Search...', shortcut: 'Cmd+K' },
  right: [{ id: 'settings', label: 'Settings' }, { type: 'profile', name: 'User', sections: [{ title: 'Theme', type: 'theme-switcher' }] }]
});

// Buttons support both onClick callbacks and bubbling CustomEvents:
document.addEventListener('header-button-click', (e) => {
  console.log(e.detail.id, e.detail.label);
});
```

## Theme Picker (Grafana-Style)

```js
// Standalone
const picker = Maranello.themePicker(container, {
  onChange: (theme) => console.log(theme)
});

// Or embedded in profile menu
Maranello.profileMenu(el, {
  name: 'User',
  sections: [{ title: 'Theme', type: 'theme-switcher' }]
});
```

5 preview cards with surface/card/accent dots. ARIA radiogroup, keyboard nav (Tab/Enter/Space).

## AI Operations Components

Purpose-built for AI agent dashboards and LLM operations.

| Component | API | Purpose |
|---|---|---|
| `tokenMeter` | `tokenMeter(el, opts)` | LLM token budget meter with usage tracking |
| `agentCostBreakdown` | `agentCostBreakdown(el, rows, opts)` | Agent cost attribution table with budget alerts |
| `agentTrace` | `agentTrace(el, steps, opts)` | AI agent step-by-step execution trace |
| `costTimeline` | `costTimeline(canvas, opts)` | LLM cost over time with hover interaction |
| `streamingText` | `streamingText(el, opts)` | Streaming AI output with cursor animation |
| `approvalChain` | `approvalChain(el, steps, opts)` | Multi-step approval workflow visualization |

## NaSra — AI Design System Expert

Maranello ships with **NaSra**, an AI agent that knows every token, theme, WCAG rule, and responsive pattern.

**Use NaSra in your project** (add to your `CLAUDE.md`):

```
@node_modules/maranello-luce-design-business/.github/agents/NaSra.agent.md
```

NaSra covers: adaptive token rules, all 5 themes, WCAG 2.2 AA, color blindness prevention, responsive checklist, CI constitution, v5.0.0 breaking changes.

## Token System

3-layer architecture. Components always use semantic tokens (layer 3).

```
Primitive:  --bianco-caldo: #fafafa          (defined in tokens.css only)
Semantic:   --mn-text: var(--bianco-caldo)   (auto-inverts per theme)
Component:  color: var(--mn-text)            (always use this)
```

| Token | Dark themes | Sugar (light) | Purpose |
|---|---|---|---|
| `--mn-surface` | `#111111` | `#E4E4E8` | Primary surface |
| `--mn-text` | `#fafafa` | `#111111` | Primary text |
| `--mn-accent` | `#FFC72C` | `#000000` | Primary accent |
| `--mn-error` | `#DC0000` | `#DC0000` | Error/danger |
| `--mn-success` | `#00A651` | `#00A651` | Success |

Read tokens at runtime: `Maranello.palette()` returns all semantic tokens live.

## Development

```bash
npm run build          # Full build: ESM + CJS + IIFE + CSS + WC + fonts + types
npm run test:unit      # Vitest unit tests (1047 tests)
npm run test:e2e       # Playwright E2E
npm run dev            # Demo server at localhost:3000
npx tsc --noEmit       # Type-check
```

## License

[MPL-2.0](LICENSE) | (c) Roberdan 2026 | Roberto D'Angelo
