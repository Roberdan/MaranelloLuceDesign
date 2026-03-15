<!-- v4.0.0 | 2026-03-15 -->
# Theming

## Themes

| Theme | Body class | Accent | Background |
|---|---|---|---|
| Editorial | (none) | `--giallo-ferrari` `#FFC72C` | Mixed dark/light sections |
| Nero | `mn-nero` | `--giallo-ferrari` `#FFC72C` | `--nero-profondo` `#0a0a0a` |
| Avorio | `mn-avorio` | `--rosso-corsa` `#DC0000` | `--avorio-chiaro` `#faf3e6` |
| Colorblind | `mn-colorblind` | `#0072B2` | Inherits Editorial |

## Apply Theme

```html
<body class="mn-nero">
```

```ts
import { setTheme } from 'maranello-luce-design-business';
setTheme('nero');
```

## Color Tokens

| Token | Default | Category |
|---|---|---|
| `--nero-assoluto` | `#000000` | Base black |
| `--nero-profondo` | `#0a0a0a` | Dark background |
| `--nero-carbon` | `#111111` | Surface |
| `--nero-soft` | `#1a1a1a` | Elevated surface |
| `--grigio-alluminio` | `#c8c8c8` | Border |
| `--grigio-medio` | `#616161` | Muted text |
| `--grigio-scuro` | `#2a2a2a` | Dark border |
| `--avorio-caldo` | `#f5e5c7` | Warm background |
| `--avorio-chiaro` | `#faf3e6` | Light warm bg |
| `--giallo-ferrari` | `#FFC72C` | Primary accent |
| `--rosso-corsa` | `#DC0000` | Danger / Avorio accent |
| `--verde-racing` | `#00A651` | Success |

## Semantic Tokens

These 7 tokens redefine per-theme and cascade into shadow DOM — use them in components instead of hardcoded primitives.

| Token | Nero default | Avorio override | Usage |
|---|---|---|---|
| `--mn-surface` | `--nero-carbon` | `--bianco-puro` | Card / panel background |
| `--mn-surface-raised` | `--nero-soft` | `--avorio-chiaro` | Modal / dropdown / overlay |
| `--mn-surface-sunken` | `--nero-profondo` | `--avorio-medio` | Code blocks / inset areas |
| `--mn-text` | `--bianco-caldo` | `--nero-assoluto` | Primary body text |
| `--mn-text-muted` | `--grigio-chiaro` | `--grigio-medio` | Secondary / muted text |
| `--mn-border` | `--grigio-scuro` | `--avorio-scuro` | Default borders |
| `--mn-border-subtle` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.06)` | Hairline dividers |
| `--mn-accent` | `--giallo-ferrari` | `--rosso-corsa` | Primary interactive color |
| `--mn-accent-hover` | `--giallo-hover` | `#b30000` | Hover state |
| `--mn-accent-text` | `#111` | `#fff` | Text on accent bg |
| `--signal-ok` / `--signal-warning` / `--signal-danger` / `--signal-info` | — | — | Status indicators |

### `Maranello.palette()` — Live Token Reader

Call inside render functions (never at module load) so colors reflect the current theme:

```js
// Wrong: captured once at IIFE load — doesn't update on theme change
const COLORS = [Maranello.cssVar('--giallo-ferrari'), ...];

// Correct: read on every render call
function renderChart(canvas, data) {
  const p = Maranello.palette();
  // p.giallo, p.rosso, p.verde, p.accent, p.text, p.surface, p.statusOk …
}
```

Returns `{ surface, surfaceRaised, surfaceSunken, text, textMuted, border, accent, giallo, rosso, verde, azzurro, biancoCaldo, grigioChiaro, grigioMedio, neroAssoluto, signalOk, signalWarning, signalDanger, signalInfo }`.

## Section Classes

| Class | Editorial | Nero | Avorio |
|---|---|---|---|
| `.mn-section-dark` | Dark bg | Dark bg | Dark bg |
| `.mn-section-light` | Light bg | Dark bg | Ivory bg |
| `.mn-section-ivory` | Warm bg | Dark bg | Ivory bg |
| `.mn-section-accent` | Accent bg | Accent bg | Accent bg |

## Override Tokens

```css
:root {
  --giallo-ferrari: #0066CC;    /* brand color */
  --mn-accent: var(--giallo-ferrari);
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --space-xs: 4px; --space-sm: 8px; --space-md: 16px; --space-lg: 24px; --space-xl: 32px;
}
```

## Custom Theme

```css
body.mn-oceano {
  --mn-accent: #0077B6;
  --mn-accent-hover: #005f94;
}
body.mn-oceano .mn-section-dark { background: #03045E; color: #CAF0F8; }
body.mn-oceano .mn-section-light { background: #CAF0F8; color: #023E8A; }
```

Load after DS CSS: `<link href="…/css"> <link href="my-theme.css">`

## OS Auto-Switch

`initThemeToggle()` respects `prefers-color-scheme`:

| OS setting | Theme |
|---|---|
| Dark | `mn-nero` |
| Light | Editorial |

Override: `localStorage.setItem('mn-theme', 'avorio')`
