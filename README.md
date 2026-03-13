# Maranello Luce Design System

**A Ferrari Luce-inspired design system for business dashboards and data-rich applications.**

Inspired by the interior design language of the [Ferrari Luce](https://www.ferrari.com/it-IT/auto/ferrari-luce) -- warm leather tones, precise instrument typography, and cockpit-grade controls translated into CSS tokens, Web Components, and headless Canvas/SVG engines.

Part of the [Convergio](https://github.com/Roberdan/MyConvergio) project ecosystem.

## Features

- **3-layer architecture**: CSS-only primitives, Web Components, Headless JS (Canvas/SVG)
- **CSS @layer architecture**: 11 cascade layers (`tokens` through `utilities`) for predictable specificity
- **4 themes**: Nero (dark), Avorio (warm light), Editorial (mixed default), Colorblind (WCAG high-contrast)
- **Dual-mode Web Components**: ESM import or CDN IIFE fallback — zero `window.Maranello` polling
- **WCAG 2.2 AA**: keyboard navigation, contrast ratios, `prefers-color-scheme` auto-switching
- **AI-discoverable**: `components.json` + `components-detail.json` catalogs, semantic class names
- **Zero runtime dependencies**: pure CSS + vanilla TypeScript (optional peer dep: `mapbox-gl` for maps)
- **Multiple output formats**: ESM, CJS, IIFE, standalone CSS

## Quick Start

### Git dependency (primary)

```bash
npm install github:Roberdan/MaranelloLuceDesign#v3.0.0
```

### CDN (no build step)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">

<!-- JS (IIFE -- attaches to window.M) -->
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
```

### ESM import (per-component, tree-shakeable)

```js
// Full bundle
import { charts, gantt, gauge } from 'maranello-luce-design-business';
import 'maranello-luce-design-business/css';

// Per-component sub-package imports
import { charts } from 'maranello-luce-design-business/charts';
import { gauge } from 'maranello-luce-design-business/gauge';
import { gantt } from 'maranello-luce-design-business/gantt';
import { controls } from 'maranello-luce-design-business/controls';
```

## Themes

| Theme | Class | Accent | Background |
|-------|-------|--------|------------|
| Editorial | (default) | Giallo Ferrari | Mixed dark/light sections |
| Nero | `mn-nero` | Giallo Ferrari | Full dark (`#0a0a0a`) |
| Avorio | `mn-avorio` | Rosso Corsa | Warm ivory (`#f5e5c7`) |
| Colorblind | `mn-colorblind` | High-contrast blue | Inherits base |

Apply a theme by adding the class to `<body>`:

```html
<body class="mn-nero">
```

Auto-switching with `prefers-color-scheme`:

```js
import { initThemeToggle } from 'maranello-luce-design-business';
initThemeToggle(); // Respects OS dark/light preference
```

See [docs/THEMING.md](docs/THEMING.md) for custom themes and token overrides.

## Token System

All visual properties are CSS custom properties (tokens) defined in `tokens.css`. Override any token for custom branding:

```css
:root {
  --giallo-ferrari: #your-brand-color;
  --mn-accent: var(--giallo-ferrari);
  --font-display: 'YourBrandFont', var(--font-display);
}
```

Key token categories: colors (nero, grigio, avorio, accento, semantic), typography (display, body, mono), spacing (4px base scale), borders, shadows, transitions, z-index layers.

## CSS @layer Architecture

v3.0.0 wraps all 70 CSS source files in explicit `@layer` blocks. The 11 layers, in cascade order:

| Layer | Contents |
|-------|----------|
| `tokens` | CSS custom properties — colors, spacing, typography |
| `base` | Reset, root, font-face |
| `themes` | Nero, Avorio, Colorblind overrides |
| `typography` | Heading, body, mono styles |
| `layouts` | Grid, flex, section containers |
| `components` | Buttons, cards, tags, tables, nav |
| `forms` | Inputs, selects, checkboxes |
| `controls` | Ferrari dials, sliders, rotary |
| `charts` | Chart containers and legends |
| `animations` | Transitions, keyframes |
| `utilities` | Helpers, overrides |

Consumer styles added without `@layer` automatically win over all system layers.

## Architecture

```
Layer 1: CSS-Only          Layer 2: Web Components       Layer 3: Headless JS
(tokens, layouts,          (mn-* custom elements,        (Canvas/SVG renderers,
 components, forms)         declarative API)              full programmatic control)
```

### Layer 1 -- CSS-Only

Import just the CSS for layout primitives, typography, forms, and component styling. No JavaScript required.

```html
<link rel="stylesheet" href="maranello-luce-design-business/css">
<div class="mn-section-dark">
  <h2 class="mn-title-section">Dashboard</h2>
  <div class="mn-stat-card">
    <span class="mn-stat-value">142</span>
    <span class="mn-stat-label">Active projects</span>
  </div>
</div>
```

### Layer 2 -- Web Components (Dual-mode)

Custom elements with `mn-` prefix. Work in any framework or plain HTML. v3 uses `async resolveEngine()` — no `window.Maranello` polling required.

**ESM mode** (recommended — per-component import):

```html
<script type="module">
  import 'maranello-luce-design-business/wc/mn-gauge';
  import 'maranello-luce-design-business/wc/mn-chart';
</script>
<mn-gauge value="72" label="CPU" theme="nero"></mn-gauge>
<mn-chart type="donut" data='[{"label":"A","value":30},{"label":"B","value":70}]'></mn-chart>
```

**CDN mode** (all WCs via IIFE, no build step):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
<mn-gauge value="72" label="CPU" theme="nero"></mn-gauge>
<mn-data-table src="/api/data" sortable paginate></mn-data-table>
<mn-toast message="Saved" type="success" duration="3000"></mn-toast>
```

### Layer 3 -- Headless JS

Full programmatic control over Canvas/SVG renderers. Tree-shakeable ESM exports.

```js
import { charts } from 'maranello-luce-design-business/charts';
import { gantt } from 'maranello-luce-design-business/gantt';
import { gauge } from 'maranello-luce-design-business/gauge';

charts.renderDonut(canvas, data, options);
gantt.render(container, tasks, { palette: 'nero' });
gauge.create(canvas, { value: 72, label: 'RPM' });
```

## Component Catalog

### CSS Components
Buttons, stat cards, tags, dividers, tables, status indicators, navigation bars, footers, input groups, form controls, filter chips, page headers, sidebars, toolbars, drawers, notification panels

### Web Components (`mn-*`)
`mn-gauge`, `mn-chart`, `mn-gantt`, `mn-data-table`, `mn-date-picker`, `mn-funnel`, `mn-map`, `mn-hbar`, `mn-speedometer`, `mn-toast`, `mn-modal`, `mn-tabs`, `mn-theme-toggle`, `mn-command-palette`, `mn-login`, `mn-profile`, `mn-chat`, `mn-detail-panel`, `mn-system-status`, `mn-ferrari-control`, `mn-okr`, `mn-a11y`

### Headless JS Engines
Charts (donut, area, bar, bubble, sparkline, sparkbar, radar, half-gauge, live), Gantt timeline, Gauge/Speedometer (Ferrari instrument cluster), Funnel/Sankey, Data Table (sort/filter/paginate), Map View (Mapbox), HBar charts, OKR panels, Forms validation, Controls (rotary, slider, Ferrari dials)

### Layouts
Data tables (standard, compact, panel), detail panels (base, comments, Gantt), org trees, heatmaps, capacity heatmaps, network graphs, command palette, chat, login, sim panels, horizontal bars, funnels

## Integration Guides

| Framework | Guide |
|-----------|-------|
| Vanilla JS | [docs/INTEGRATION_VANILLA.md](docs/INTEGRATION_VANILLA.md) |
| React | [docs/INTEGRATION_REACT.md](docs/INTEGRATION_REACT.md) |
| Svelte | [docs/INTEGRATION_SVELTE.md](docs/INTEGRATION_SVELTE.md) |
| Vue | [docs/INTEGRATION_VUE.md](docs/INTEGRATION_VUE.md) |
| Vite | [docs/INTEGRATION_VITE.md](docs/INTEGRATION_VITE.md) |
| Theming | [docs/THEMING.md](docs/THEMING.md) |

## Development

```bash
npm install          # Install dev dependencies
npm run build        # Full build (JS + CSS + WC + fonts + assets + types)
npm run dev          # Serve demo page at localhost:3000
npm run test:unit    # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
```

## Project Structure

```
src/
  css/       CSS tokens, themes, components, layouts, forms, controls
  ts/        Headless JS engines (charts, gantt, gauge, controls, etc.)
  wc/        Web Components (mn-* custom elements)
  fonts/     GT Walsheim Pro, JetBrains Mono
  assets/    SVG icons, brand assets
dist/
  css/       Compiled CSS (individual + index.css bundle)
  esm/       ES modules
  cjs/       CommonJS modules
  iife/      IIFE bundle (maranello.min.js)
  types/     TypeScript declarations
  wc/        Web Component bundles
  fonts/     Font files
```

## Screenshots

See the demo page (`npm run dev`) for a live component gallery with all themes.

## Copyright

(c) Roberdan 2026

## License

[MIT](LICENSE)
