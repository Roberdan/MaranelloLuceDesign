# Maranello Luce Design — Constitution

> Binding rules. Enforced by CI. No exceptions.
> Aligned with the [Agentic Manifesto](https://github.com/Roberdan/MyConvergio/blob/master/AgenticManifesto.md).

## Principles

| # | Principle | Manifesto Ref |
|---|-----------|---------------|
| P1 | Accessibility first — WCAG 2.2 AA minimum | "Design from the edge first" |
| P2 | Zero emoji — SVG icons only, stroke-based, consistent style | Visual coherence |
| P3 | Italian token naming — Ferrari heritage (nero, avorio, grigio, giallo, rosso) | Cultural provenance |
| P4 | mn- prefix on ALL CSS classes | Namespace isolation |
| P5 | 4 themes always — nero, avorio, editorial, colorblind | "Impact must reach every mind and body" |
| P6 | Max 250 lines per file — split if exceeds | Small loops, ship early |
| P7 | Zero runtime dependencies — vanilla TS + CSS only | Safety rails precede scale |
| P8 | Every component works without JS (CSS layer first) | Progressive enhancement |
| P9 | All text/comments in English | Universal accessibility |
| P10 | prefers-reduced-motion respected in ALL animations | Disability-first design |

## Accessibility Rules (WCAG 2.2 AA)

| Rule | Requirement | Test |
|------|-------------|------|
| A1 | All interactive elements keyboard-navigable | Tab/Enter/Escape |
| A2 | Color contrast ≥ 4.5:1 for text, ≥ 3:1 for UI | Automated check |
| A3 | All images/icons have aria-hidden="true" or alt text | CI lint |
| A4 | Form inputs have associated labels | CI lint |
| A5 | Focus indicators visible in all themes | Visual review |
| A6 | Skip navigation link on demo pages | CI check |
| A7 | prefers-reduced-motion disables ALL animations | CSS audit |
| A8 | prefers-color-scheme auto-detected | Theme system |
| A9 | Font sizes use rem/clamp, never fixed px for body text | CSS audit |
| A10 | Touch targets ≥ 44x44px on mobile | CSS review |

## Icon Rules

| Rule | Requirement |
|------|-------------|
| I1 | NO emoji characters (U+1F300–U+1FAFF) — EVER |
| I2 | All icons: inline SVG, viewBox="0 0 24 24" |
| I3 | Stroke-based: stroke="currentColor", fill="none", stroke-width="1.5" |
| I4 | Default size: 16x16px (md). Scale: xs=12, sm=16, md=20, lg=24, xl=32, 2xl=48 |
| I5 | Wrap in `<span aria-hidden="true">` |
| I6 | New icons registered in src/ts/icons-*.ts |

## Theme Rules

| Rule | Requirement |
|------|-------------|
| T1 | Every component must render correctly in ALL 4 themes |
| T2 | Use CSS custom properties (--var), never hardcoded colors |
| T3 | Theme applied via body class: mn-nero, mn-avorio, mn-colorblind |
| T4 | Colorblind theme must pass WCAG AA for deuteranopia + protanopia |
| T5 | New tokens added to src/css/tokens.css AND all theme files |

## CSS Rules

| Rule | Requirement |
|------|-------------|
| C1 | All classes prefixed with `mn-` |
| C2 | BEM naming: `mn-block__element--modifier` |
| C3 | All rules inside @layer blocks |
| C4 | No !important |
| C5 | No hardcoded color values (#hex, rgb, hsl) — use tokens |
| C6 | Responsive: mobile-first, breakpoints at 768px and 1200px |

## TypeScript Rules

| Rule | Requirement |
|------|-------------|
| TS1 | strict mode, no `any` |
| TS2 | Named exports only (no default) |
| TS3 | All public APIs have JSDoc |
| TS4 | Canvas rendering uses hiDpiCanvas() helper |

## File Structure Rules

| Rule | Requirement |
|------|-------------|
| F1 | Max 250 lines — split into sub-modules if exceeded |
| F2 | kebab-case file names |
| F3 | CSS barrel: import in parent barrel file |
| F4 | TS barrel: re-export from src/ts/index.ts |
| F5 | Tests: tests/unit/<name>.test.ts |

## New Component Checklist

| Step | Action |
|------|--------|
| 1 | CSS in src/css/<name>.css, wrapped in @layer |
| 2 | Import in barrel (layouts.css, components.css, etc.) |
| 3 | Works in all 4 themes — verify visually |
| 4 | TS logic in src/ts/<name>.ts if needed |
| 5 | Export from src/ts/index.ts |
| 6 | WC in src/wc/mn-<name>.js if needed |
| 7 | Unit test in tests/unit/<name>.test.ts |
| 8 | Demo section in demo/sections/<name>.js |
| 9 | ARIA attributes on interactive elements |
| 10 | npm run build + npm run test:unit passes |

## CI Enforcement

| Check | Fails on |
|-------|----------|
| Emoji scan | Any U+1F300–U+1FAFF in src/ or demo/ |
| File length | Any file > 250 lines |
| mn- prefix | CSS class without mn- prefix in src/css/ |
| Hardcoded colors | #hex or rgb() in src/css/ (except tokens.css) |
| TypeScript strict | Any TS error |
| Unit tests | Any failure |
| Bundle size | IIFE > 256KB |
| Scrub check | VirtualBPM, ISE, FightTheStroke (except donation) in src/demo |

## Versioning

Semver. CHANGELOG.md updated on every release. Breaking changes = major bump.

---

(c) Roberdan 2026 — Roberto D'Angelo · MPL-2.0 License
