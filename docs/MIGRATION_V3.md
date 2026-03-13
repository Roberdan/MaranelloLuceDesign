# Migration Guide: v2 → v3

## Overview

v3.0.0 introduces CSS `@layer` architecture, dual-mode Web Components, and new module paths. Most changes are additive. The IIFE CDN path is unchanged.

## Breaking Changes

### 1. CSS @layer

All 70 CSS source files are now wrapped in `@layer` blocks. This changes cascade precedence.

**Impact**: If you used high-specificity selectors to override system styles, those overrides may behave differently.

**Fix**: Remove `@layer` from consumer overrides (if any) — unlayered rules already win. Or increase specificity with `:where()` or `:is()`.

```css
/* v2: needed high specificity */
body.mn-nero .mn-btn { color: red; }

/* v3: unlayered rules win automatically */
.mn-btn { color: red; }
```

### 2. Web Components: no `window.Maranello` polling

All 22 WCs now use `async resolveEngine()` internally. The `window.Maranello` global is still set by the IIFE for backward compatibility, but WCs no longer depend on polling for it.

**Impact**: If you had code that waited for `window.Maranello` to be set before using WCs, that code is now unnecessary.

**Fix**: Remove any `window.Maranello` polling guards. WCs are self-contained.

```js
// v2: polling guard (remove this)
const interval = setInterval(() => {
  if (window.Maranello) { clearInterval(interval); init(); }
}, 50);

// v3: WCs are ready when registered — just use them
import 'maranello-luce-design-business/wc/mn-gauge';
```

### 3. Version string

`VERSION` exported from the main ESM entry point is now `'3.0.0'`.

## ESM Migration

### Per-component WC imports (new in v3)

```ts
// v2: only full bundle
import 'maranello-luce-design-business/wc';

// v3: per-component (preferred — better tree-shaking)
import 'maranello-luce-design-business/wc/mn-gauge';
import 'maranello-luce-design-business/wc/mn-chart';
```

Full bundle import still works unchanged.

### New sub-package paths

19 new modules are available as named exports from the main entry or sub-packages:

```ts
import { FerrariGauge, createGauge } from 'maranello-luce-design-business';
import { drawSpeedometer } from 'maranello-luce-design-business';
import { a11yPanel } from 'maranello-luce-design-business';
```

## CDN Migration

The IIFE path and `window.M` API are unchanged. Only the version tag changes:

```html
<!-- v2 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v2.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v2.0.0/dist/iife/maranello.min.js"></script>

<!-- v3 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
```

The IIFE bundle size threshold increased from 48 KB to 250 KB to accommodate the new modules.

## npm / Git Dependency

```bash
# v2
npm install github:Roberdan/MaranelloLuceDesign#v2.0.0

# v3
npm install github:Roberdan/MaranelloLuceDesign#v3.0.0
```
