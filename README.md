# Convergio Design System

Ferrari Luce-inspired design system for AI agent dashboards. Zero runtime dependencies. 6 adaptive themes. WCAG 2.2 AA. Framework-agnostic.

**v6.3.2** | [Live Demo](https://roberdan.github.io/convergio-design/) | [CHANGELOG](CHANGELOG.md)

## Install

```bash
npm install @convergio/design-tokens @convergio/design-elements
```

## Quick Start

### 1. CSS (canonical app setup)

```css
/* Complete design system CSS: tokens + themes + components */
@import '@convergio/design-elements/css';

/* Optional: shadcn/ui bridge */
@import '@convergio/design-tokens/bridge-shadcn';
```

If you need theme tokens without component CSS, import `@convergio/design-tokens/css` separately.

### 2. JS (ESM, tree-shakeable)

```ts
// Tokens package — theme API
import { setTheme, cycleTheme, palette } from '@convergio/design-tokens';

// Elements package — components
import { sparkline, FerrariGauge, toast } from '@convergio/design-elements';
import { gantt } from '@convergio/design-elements/gantt';
import { barChart, donut } from '@convergio/design-elements/charts';
```

### 3. Web Components (zero boilerplate)

```html
<script type="module">
  import '@convergio/design-elements/register-all';
</script>

<mn-gauge value="72" unit="%"></mn-gauge>
<mn-chart type="sparkline" data="[10,20,30]"></mn-chart>
<mn-data-table columns='[{"key":"name","label":"Name"}]' data='[{"name":"Alpha"}]'></mn-data-table>
```

Per-element tree-shaking:

```ts
import '@convergio/design-elements/wc/mn-gauge';
import '@convergio/design-elements/wc/mn-gantt';
```

### 4. IIFE (CDN, no bundler)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@convergio/design-tokens@6.3.2/dist/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@convergio/design-elements@6.3.2/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/npm/@convergio/design-elements@6.3.2/dist/iife/maranello.min.js"></script>
<script>
  Maranello.sparkline(document.getElementById('chart'), [10, 20, 15, 30]);
  new Maranello.FerrariGauge(document.getElementById('gauge'));
</script>
```

## Architecture

Two packages in a pnpm monorepo. Use together or separately.

| Package | Import | What you get |
|---|---|---|
| `@convergio/design-tokens` | `@convergio/design-tokens` | CSS variables, 6 themes, setTheme/cycleTheme/palette, shadcn/ui bridge |
| `@convergio/design-elements` | `@convergio/design-elements` | 100+ exports: charts, gauges, controls, forms, data binding + 31 `mn-*` WC tags |

### @convergio/design-tokens Exports

| Path | Content |
|---|---|
| `.` | Theme API (setTheme, cycleTheme, palette) with TypeScript types |
| `./css` | Full token + theme CSS system |
| `./bridge-shadcn` | shadcn/ui automatic color integration |

### @convergio/design-elements Exports

| Path | Content |
|---|---|
| `.` | Main ESM/CJS entry (100+ exports) with TypeScript types |
| `./css` | Component CSS (responsive + layouts) |
| `./register-all` | All 31 Web Component tags with auto-registration |
| `./wc/*` | Individual Web Components (per-element tree-shaking) |
| `./charts` | Chart sub-package (sparkline, donut, bar, area, radar, bubble, etc.) |
| `./gantt` | Gantt chart |
| `./gauge` | FerrariGauge engine |
| `./controls` | Ferrari controls (manettino, rotary, lever, slider) |
| `./forms` | Form validation, live validation, tag input, file upload, steps |
| `./knowledge` | Component Knowledge Base (CKB) — machine-readable catalog |
| `./knowledge/components` | Semantic component recipes for agent/human component selection |
| `./knowledge/templates` | Semantic starter-template recipes for shell selection |

## Component Knowledge Base (CKB)

The CKB is a machine-readable JSON catalog of every component, data shape, composition pattern, and API-to-component mapping hint. It enables AI agents to automatically select and compose the right components for any backend.

```ts
// Import the CKB programmatically
import ckb from '@convergio/design-elements/knowledge';

console.log(ckb.webComponents.length);        // 31 Web Components
console.log(ckb.compositionRules.length);      // 12 composition patterns
console.log(ckb.mappingHints.length);          // 10 API→component mappings
console.log(ckb.themes.length);               // 6 themes
```

The CKB is auto-generated from source at build time via `scripts/generate-ckb.mjs`. See [ADR-0010](docs/adr/0010-component-knowledge-base.md) for the design rationale.

In addition to the main CKB, the package now publishes:

```ts
import componentRecipes from '@convergio/design-elements/knowledge/components';
import templateRecipes from '@convergio/design-elements/knowledge/templates';
```

These semantic recipe files are intended for starter generation, agent selection, and higher-level shell composition.

### CKB Contents

| Section | What | Use case |
|---------|------|----------|
| `webComponents` | 31 WC tags with attributes, events, bestFor | Component selection |
| `tsModules` | 79 TS modules with exports and types | API integration |
| `compositionRules` | 12 patterns (e.g., Filterable Table, AI Chat) | Component composition |
| `mappingHints` | 10 API shape → component heuristics | Automated UI generation |
| `themes` | 6 themes with accent/surface/variant | Theme configuration |
| `constraints` | Safari compat, WCAG, SSR rules | Quality guardrails |

## Convergio Ecosystem

This design system is part of the [Convergio](https://github.com/Roberdan/convergio) platform:

| Component | Role |
|-----------|------|
| **convergio-design** (this repo) | Design system — tokens, components, CKB |
| **ConvergioPlatform** | Control plane — daemon, agents, MCP, orchestration |
| **convergio-web** | Web + desktop UI (Next.js + Tauri) |

The `nasra-app-builder` agent in ConvergioPlatform uses the CKB to analyze any repo's backend, map APIs to design system components, and generate/fix/rebuild UIs automatically.

## Agent / Automation Notes

- Start from `AGENT.md` when you need the package map, import paths, or repo-safe integration rules.
- Use `mn-header-shell` as the official reusable Maranello app header surface. It is the same shell used in `demo/header-responsive.html`.
- The imperative `headerShell(container, options)` API is available everywhere: ESM/CJS import, Web Component `<mn-header-shell>`, and IIFE via `window.Maranello.headerShell(container, options)`.
- Treat header shell data as consumer-owned: the shell emits query/filter/action/theme state, while the app decides what records to filter, count, persist, and render.
- If you change the shell contract, keep `README.md`, `AGENT.md`, `.github/agents/NaSra.agent.md`, `demo/header-responsive.html`, and `demo/header-responsive-shell.js` aligned.

## Themes

Set theme via body class. All components adapt automatically.

| Theme | Body class | Surface | Accent | Use case |
|---|---|---|---|---|
| Editorial | (none) | `#111111` dark | `#FFC72C` gold | Default dark dashboard |
| Nero | `mn-nero` | `#050505` deep black | `#FFC72C` gold | High-contrast dark |
| Avorio | `mn-avorio` | `#FAF3E6` warm ivory | `#DC0000` red | Light/warm |
| Colorblind | `mn-colorblind` | `#111111` dark | `#0072B2` blue | Okabe-Ito safe palette |
| Sugar | `mn-sugar` | `#E4E4E8` cool gray | `#000000` black | Modern light, rounded corners |
| Navy | `mn-navy` | `#0d2045` deep blue | `#FFC72C` gold | Deep blue dark dashboard |

Cross-theme: `body.mn-sugar.mn-colorblind` combines cool gray + Okabe-Ito signals.

```js
// JS theme API
Maranello.setTheme('sugar');           // apply theme
Maranello.cycleTheme();                // rotate through all 6
const tokens = Maranello.palette();    // read live semantic tokens
```

## IDE & Terminal Themes

Maranello ships matching themes for your editor and terminal.

### VS Code

```
1. Copy the entire extras/vscode-themes/ folder to ~/.vscode/extensions/maranello-themes/
2. Ensure package.json and the *.json theme files are at the extension root
3. Reload VS Code (Developer: Reload Window)
4. Select theme: Cmd+K Cmd+T > search "Maranello"
```

### Warp

```
1. Copy the desired .yaml file from extras/warp-themes/ to ~/.warp/themes/
2. Open Warp > Settings > Appearance > Themes > select "Maranello [theme]"
```

### Ghostty

```
1. Copy the desired config from extras/ghostty-themes/
2. Append to ~/.config/ghostty/config (or use Ghostty's theme directory)
3. Restart Ghostty
```

## Theme Contract

Themes are extensible. Community themes must implement the 35-token checklist defined in [ADR-0009](docs/adr/0009-extensible-theme-contract.md). Any theme passing all 35 tokens + WCAG contrast checks is compatible with every Maranello component.

## NaSra -- AI Design System Expert

For AI-assisted development with Maranello, reference the NaSra agent: `@.github/agents/NaSra.agent.md`

NaSra knows every token, theme, WCAG rule, and responsive pattern in the system.

## Framework Integration

All JS APIs are **imperative DOM-first**: acquire a DOM ref, init on mount, destroy on unmount. This works with any framework.

### React

```tsx
import { useRef, useEffect } from 'react';
import { gantt } from '@convergio/design-elements/gantt';

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
  import { gantt } from '@convergio/design-elements/gantt';

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
import { gantt } from '@convergio/design-elements/gantt';

const el = ref();
let w;
onMounted(() => { w = gantt(el.value, tasks); });
onUnmounted(() => w?.destroy());
</script>
<template><div ref="el"></div></template>
```

### Next.js / SSR

Next.js App Router is now a first-class supported consumer path. The package root and documented subpaths are safe to import in SSR, but any DOM work still belongs in client components.

**1. Root layout CSS** — import the design system once in `app/layout.tsx`:

```tsx
import '@convergio/design-elements/css';
import '@convergio/design-tokens/bridge-shadcn'; // optional

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`@convergio/design-elements/css` already inlines tokens and themes. Import `@convergio/design-tokens/css` only if you want token CSS without component CSS.

**2. Client components for DOM APIs** — keep imperative widgets inside `'use client'` files:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gantt } from '@convergio/design-elements/gantt';

export function GanttView({ tasks }: { tasks: unknown[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const widget = gantt(ref.current, tasks);
    return () => widget.destroy();
  }, [tasks]);

  return <div ref={ref} />;
}
```

**3. Web Components in React/Next** — register them in a client boundary and add JSX typings once:

```ts
/// <reference types="@convergio/design-elements/react" />
```

```tsx
'use client';

import '@convergio/design-elements/register-all';

export function GaugeCard() {
  return <mn-gauge value="72" unit="%" />;
}
```

Only use a `postcss-import` resolver if you insist on importing package CSS from inside your own CSS files. For standard Next.js JS-side-effect imports, no resolver is required.

**4. Starter platform** — the repository now includes a shared starter foundation plus four Next.js starters under `starters/`:

- `template-workspace-app`
- `template-ops-dashboard`
- `template-executive-cockpit`
- `template-program-management`

Each starter imports `@convergio/design-elements/css`, exposes `app/api/agent/route.ts`, and is designed to be Tauri-friendly and deployable on Vercel or Azure containers.

### Web Components (any framework, zero adapter)

```html
<!-- Works in React, Vue, Svelte, Angular, Astro, plain HTML -->
<mn-gantt tasks='[{"id":1,"label":"Deploy","start":"2026-01-01","end":"2026-01-15"}]'></mn-gantt>
<mn-gauge value="72" unit="%" size="fluid"></mn-gauge>
<mn-data-table columns='[{"key":"name","label":"Name"}]' data='[{"name":"Alpha"}]'></mn-data-table>
```

Web Components self-register, handle resize, and fire standard DOM events. No adapter needed.

#### `mn-header-shell` (rich responsive header shell)

```html
<mn-header-shell id="ops-header"></mn-header-shell>
<script type="module">
  import '@convergio/design-elements/wc/mn-header-shell';

  const shell = document.getElementById('ops-header');
  shell.config = {
    sections: [
      {
        type: 'brand',
        label: 'Maranello Luce',
        logoSrc: '/logo.svg',
        logoAlt: 'Maranello Luce mark',
        href: '#',
      },
      {
        type: 'actions',
        role: 'pre',
        presentation: 'segmented',
        items: [
          { id: 'gantt', label: 'Gantt', active: true },
          { id: 'table', label: 'Table' },
        ],
      },
      {
        type: 'search',
        placeholder: 'Filter by name, owner, account…',
        shortcut: '⌘K',
        filters: [
          { id: 'status', label: 'Status', multi: true, options: [{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' }] },
        ],
      },
      { type: 'divider' },
      { type: 'theme' },
      { type: 'profile', name: 'Roberdan D.' },
    ],
  };

  await shell.whenReady();
  shell.addEventListener('header-shell-action', (event) => {
    console.log('clicked shell action:', event.detail.id);
  });
</script>
```

- `config.sections` controls order, spacing, and composition of brand, pre/post button groups, search, divider/spacer, theme, and profile.
- Buttons are consumer-defined: `id`, `label`, `title`, `icon`, `active`, `pressed`, `disabled`, and whether they live before or after search.
- Brand image and brand text are independently optional via `logoSrc`/`logo` and `label`.
- Search is live: `onSearch` and `header-shell-search` fire while the user types.
- Filters are injected by the consumer through `search.filters`; external filter menus can coordinate with `whenReady()`, `getState()`, `setQuery()`, and `setFilter()`.
- `search.filterButtonLabel` is consumer metadata for external filter-board UIs; the core shell does not render that trigger itself.
- Colors remain Maranello-native via semantic tokens and can be themed by body theme classes or scoped CSS variables on the consumer side.
- Data is consumer-owned by design: the shell emits state, and the app decides what to filter, count, persist, and render.
- See `demo/header-responsive.html` for the header-only demo using the same `mn-header-shell` plus an external grouped filter menu.
- The imperative `headerShell(container, options)` API is available via ESM/CJS imports and as `window.Maranello.headerShell` in the IIFE bundle.

##### `mn-header-shell` host API

| Member | Type | Description |
|---|---|---|
| `config` | property | Full `HeaderShellOptions` object; assign in JS, not via HTML attributes |
| `controller` | property | Live `HeaderShellController` instance after mount, or `null` before ready |
| `whenReady()` | method | Resolves once the internal shell controller has mounted |
| `getState()` | method | Returns `{ query, filters, activeActionId, themeMode }` |
| `setQuery(query)` | method | Updates the live search input and controller state |
| `setFilter(groupId, values)` | method | Normalizes and applies one filter group |
| `mn-header-shell-ready` | event | Fires with `{ controller }` when the component is mounted |

##### `headerShell(container, options)` section types

| Section type | Config |
|---|---|
| `brand` | `{ label?, logo?, logoSrc?, logoAlt?, href? }` |
| `actions` | `{ role: 'pre' \| 'post', presentation?: 'segmented' \| 'cluster', items[] }` |
| `search` | `{ placeholder?, shortcut?, filterButtonLabel?, filters? }` |
| `theme` | `{ modes?: ThemeMode[] }` |
| `profile` | `{ name, avatarUrl?, sections? }` |
| `divider` | visual separator |
| `spacer` | flexible gap in the shell layout |

##### Shell callbacks and DOM events

| Callback / event | Payload |
|---|---|
| `callbacks.onAction` / `header-shell-action` | `{ id, role }` |
| `callbacks.onSearch` / `header-shell-search` | `{ query }` |
| `callbacks.onFilter` / `header-shell-filter` | `{ groupId, values }` |
| `callbacks.onTheme` / `header-shell-theme` | `{ mode }` |

##### Imperative API

```ts
import { headerShell } from '@convergio/design-elements';

const controller = headerShell(document.getElementById('header-root')!, {
  sections: [
    { type: 'brand', label: 'Maranello Luce' },
    { type: 'search', placeholder: 'Search…' },
    { type: 'theme', modes: ['nero', 'avorio'] },
  ],
});

controller.setQuery('north');
controller.setFilter('status', ['active']);
console.log(controller.getState());
controller.destroy();
```

Use the imperative API for framework wrappers or direct DOM integrations. Use `<mn-header-shell>` when you want the light-DOM Web Component wrapper plus `whenReady()` host ergonomics. The returned controller supports `getState()`, `setQuery()`, `setFilter()`, and `destroy()`.

### Important: SSR Limitation

Maranello is a **client-side** design system. All JS APIs require a DOM (`document`, `canvas`, `ResizeObserver`). For SSR frameworks (Next.js, Nuxt, SvelteKit, Astro):

- CSS imports work in SSR (static stylesheet)
- JS/WC must be client-only (`'use client'`, `onMount`, dynamic import with `ssr: false`)
- Web Components hydrate on the client after page load

## App Layout (4-Slot Dashboard Framework)

4-slot CSS grid with `:has()` auto-collapse + state machine.

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

6 preview cards with surface/card/accent dots. ARIA radiogroup, keyboard nav (Tab/Enter/Space).

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
@node_modules/@convergio/design-elements/.github/agents/NaSra.agent.md
```

NaSra covers: adaptive token rules, all 6 themes, WCAG 2.2 AA, color blindness prevention, responsive checklist, CI constitution, v5.0.0 breaking changes.

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
pnpm build             # Full build: ESM + CJS + IIFE + CSS + WC + fonts + types
pnpm test:unit         # Vitest unit tests
pnpm test:e2e          # Playwright E2E
pnpm dev               # Demo server at localhost:3000
pnpm typecheck         # Type-check all packages
```

## License

This project is licensed under the [Mozilla Public License 2.0](./LICENSE).
You can use it, modify it, and ship it subject to the MPL-2.0 terms
(file-level copyleft: keep MPL-covered files under MPL and preserve
license notices). We want `convergio-design` adopted as widely as possible.

The rest of the Convergio ecosystem uses the
[Convergio Community License](https://github.com/Roberdan/convergio/blob/main/LICENSE).

---

*Built for solopreneurs who dare to build alone.*
