<!-- v3.1.0 | 2025-07-21 -->
# Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Token override not working | Consumer CSS loads before DS CSS | Load DS CSS first, then overrides: `import 'maranello…/css'; import './my-theme.css';` |
| WC not registering (`mn-*` unknown) | `registerAll()` not called | Call `registerAll()` in entry point: `import { registerAll } from '…/wc'; registerAll();` |
| `window.Maranello` undefined (IIFE) | Script tag order wrong | Place IIFE `<script>` before dependent code, or use `DOMContentLoaded` |
| TS can't find module | `moduleResolution` not set | Set `"moduleResolution": "bundler"` and `"module": "ESNext"` in `tsconfig.json` |
| Theme not switching | Theme CSS not imported | Import full CSS bundle (`./css`) which includes all themes |
| Shadow DOM ignores CSS vars | Variable not on `:root` | Define vars on `:root`, not class selectors. CSS custom properties pierce shadow DOM. |
| `@layer` overrides not winning | Consumer CSS wrapped in `@layer` | Remove `@layer` from consumer overrides — unlayered rules always win over layered |
| Canvas charts blank | HiDPI not handled | Use `chartHiDpi(canvas)` or let chart functions handle it (they do by default) |
| Gauge not rendering | Canvas not in DOM yet | Call `FerrariGauge` or `createGauge` after DOM ready, or use `initGauges()` observer |

## v3.2.1 Issues

| Problem | Cause | Fix |
|---|---|---|
| Custom table cell renderer XSS | Raw HTML in cell renderer | Use `escapeHtml()` from `core/sanitize` on user content before innerHTML |
| Data binding warn on property | Property not in `ALLOWED_BIND_PROPERTIES` | Add property to whitelist or use `textContent`/`value` instead |
| CSS `!important` override needed | Theme rule in lower `@layer` | Move override to higher layer or increase specificity with doubled class |
| Avorio gauge unreadable | Light text on light background | Fixed in v3.2.1 — gauge text uses `var(--nero-assoluto)` in Avorio theme |
| Colorblind palette not applied | Missing `body.mn-colorblind` class | Add `mn-colorblind` class to body element via theme toggle |
| Chart canvas not keyboard accessible | Missing tabindex | Add `tabindex="0"` and handle Enter/Space for tooltip activation |

## TS Resolution Fix

```json
{ "compilerOptions": { "moduleResolution": "bundler", "module": "ESNext" } }
```

## CSS Load Order

```html
<link rel="stylesheet" href="maranello…/dist/css/index.css" />
<link rel="stylesheet" href="./my-overrides.css" />
```
