# Vite Integration

How to configure Vite for optimal use of Maranello Luce Design System.

## Install

```bash
npm install github:Roberdan/MaranelloLuceDesign#v3.0.0
```

## Basic Setup

### CSS @layer import

v3.0.0 uses CSS `@layer` — all 70 CSS source files are wrapped in cascade layers. Vite handles the import natively.

```ts
// main.ts — full bundle (all 11 layers)
import 'maranello-luce-design-business/css';

// Or selective layers for smaller bundles
import 'maranello-luce-design-business/css/tokens.css';
import 'maranello-luce-design-business/css/base.css';
import 'maranello-luce-design-business/css/components.css';
import 'maranello-luce-design-business/css/charts.css';
import 'maranello-luce-design-business/css/forms.css';
import 'maranello-luce-design-business/css/themes.css';
```

Consumer styles without `@layer` automatically take precedence over system layers — no `!important` needed.

Vite handles CSS imports natively. The full `index.css` bundle is automatically included in your build.

### ESM imports (tree-shakeable)

```ts
// Import only what you need
import { charts } from 'maranello-luce-design-business/charts';
import { gantt } from 'maranello-luce-design-business/gantt';
import { gauge } from 'maranello-luce-design-business/gauge';
import { controls } from 'maranello-luce-design-business/controls';
import { forms } from 'maranello-luce-design-business/forms';
```

Vite's ESM resolution uses the `exports` field in `package.json` -- only the modules you import are bundled.

## vite.config.ts

### Vanilla / React / Svelte

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  // No special config needed for CSS-only or Headless JS usage
  optimizeDeps: {
    // Pre-bundle the design system for faster dev server startup
    include: ['maranello-luce-design-business']
  }
});
```

### Vue (custom elements)

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat mn-* tags as Web Components, not Vue components
          isCustomElement: (tag) => tag.startsWith('mn-')
        }
      }
    })
  ]
});
```

### React (custom elements)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
  // React handles custom elements via ref pattern (see INTEGRATION_REACT.md)
});
```

## Selective CSS Imports

For smaller bundles, import only the CSS modules you use:

```ts
// Core (required)
import 'maranello-luce-design-business/css/tokens.css';
import 'maranello-luce-design-business/css/base.css';

// Pick what you need
import 'maranello-luce-design-business/css/components.css';  // buttons, cards, tags
import 'maranello-luce-design-business/css/charts.css';      // chart containers
import 'maranello-luce-design-business/css/forms.css';       // form controls
import 'maranello-luce-design-business/css/layouts.css';     // data tables, panels
import 'maranello-luce-design-business/css/controls.css';    // Ferrari dials, sliders
import 'maranello-luce-design-business/css/themes.css';      // Nero, Avorio, Colorblind

// Optional
import 'maranello-luce-design-business/css/animations.css';
import 'maranello-luce-design-business/css/utilities.css';
```

## Web Components Registration

### Per-component ESM import (v3, recommended)

Import only the WCs your app uses — no full WC bundle required. v3 uses `async resolveEngine()` internally, so no `window.Maranello` polling.

```ts
// Individual WC imports (best tree-shaking)
import 'maranello-luce-design-business/wc/mn-gauge';
import 'maranello-luce-design-business/wc/mn-chart';
import 'maranello-luce-design-business/wc/mn-data-table';

// Or all WCs in one import
import 'maranello-luce-design-business/wc';
```

### Standalone WC via CDN (no Vite build needed)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
<mn-gauge value="72" label="CPU" theme="nero"></mn-gauge>
```

## Fonts

The design system includes GT Walsheim Pro and JetBrains Mono. Vite resolves font files from `dist/fonts/` automatically when imported via CSS `@font-face` in the design system's stylesheet.

If fonts fail to resolve, configure an alias:

```ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'maranello-fonts': path.resolve(
        __dirname,
        'node_modules/maranello-luce-design-business/dist/fonts'
      )
    }
  }
});
```

## Production Build

Vite automatically handles:
- CSS minification and extraction
- Tree-shaking of unused ESM exports
- Code splitting for dynamic imports

```bash
vite build
```

### Chunk strategy

For large apps, split design system code into its own chunk:

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'maranello-core': ['maranello-luce-design-business'],
          'maranello-charts': ['maranello-luce-design-business/charts'],
          'maranello-gantt': ['maranello-luce-design-business/gantt']
        }
      }
    }
  }
});
```

## Dev Server

```bash
# Start Vite dev server
vite

# The design system's CSS hot-reloads automatically
# Canvas/SVG renderers require a page refresh after code changes
```

## Mapbox (Optional)

The `mn-map` component requires `mapbox-gl` as a peer dependency:

```bash
npm install mapbox-gl
```

```ts
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapView } from 'maranello-luce-design-business';
```

Configure the Mapbox token via environment variable:

```env
VITE_MAPBOX_TOKEN=pk.your_token_here
```
