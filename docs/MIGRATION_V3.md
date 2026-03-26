<!-- v3.1.0 | 2025-07-21 -->
# Migration v2 → v3

## Breaking Changes

| Change | Impact | Fix |
|---|---|---|
| CSS `@layer` on all 70 files | Cascade precedence changed | Remove `@layer` from consumer overrides — unlayered rules win |
| WC uses `async resolveEngine()` | No more `window.Maranello` polling needed | Remove polling guards; WCs are self-contained |
| `VERSION` → `'3.0.0'` | Version string updated | Update checks |

## CSS @layer Migration

```css
/* v2: high specificity needed */
body.mn-nero .mn-btn { color: red; }
/* v3: unlayered rules win automatically */
.mn-btn { color: red; }
```

## WC Migration

```js
// v2: polling guard (remove)
const interval = setInterval(() => { if (window.Maranello) { clearInterval(interval); init(); } }, 50);
// v3: just use WCs directly
import 'maranello-luce-design-business/wc/mn-gauge';
```

## New in v3

| Feature | Example |
|---|---|
| Per-component WC imports | `import '…/wc/mn-gauge'` (better tree-shaking) |
| 19 new named exports | `FerrariGauge`, `createGauge`, `drawSpeedometer`, `a11yPanel`, etc. |
| Sub-package paths | `./charts`, `./gantt`, `./gauge`, `./controls`, `./forms` |

## CDN Update

```html
<!-- v2 → v3: change version tag only -->
<link href="…@v3.0.0/dist/css/index.css">
<script src="…@v3.0.0/dist/iife/maranello.min.js"></script>
```

IIFE bundle size: 48 KB → 250 KB (new modules).

## npm Update

```bash
npm install github:Roberdan/convergio-design#v3.0.0
```
