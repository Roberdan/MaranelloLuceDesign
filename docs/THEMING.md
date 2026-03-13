<!-- v3.1.0 | 2025-07-21 -->
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

| Token | Usage |
|---|---|
| `--mn-accent` | Primary interactive color |
| `--mn-accent-hover` | Hover state |
| `--mn-accent-text` | Text on accent bg |
| `--status-active` | Success indicator |
| `--status-warning` | Warning indicator |
| `--status-danger` | Error indicator |
| `--status-info` | Info indicator |

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
