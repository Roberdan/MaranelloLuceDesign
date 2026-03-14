<!-- v3.2.0 | 2026-03-14 -->
# Contributing

## Constitution

**All contributions must comply with [CONSTITUTION.md](CONSTITUTION.md).** CI enforces these rules automatically.

Key rules:
- WCAG 2.2 AA accessibility
- Zero emoji (SVG icons only)
- All CSS classes use `mn-` prefix
- All CSS rules inside `@layer` blocks
- Max 250 lines per file
- No hardcoded colors — use tokens from `tokens.css`
- Works in all 4 themes (nero, avorio, editorial, colorblind)
- `prefers-reduced-motion` respected

## Setup

```bash
git clone https://github.com/Roberdan/MaranelloLuceDesign.git && cd MaranelloLuceDesign
npm install
npm run build
npm run dev
```

Requirements: Node 20+, npm 10+.

## Build and Validation

| Command | Purpose |
|---|---|
| `npm run build` | Full build (JS + CSS + WC + assets + types) |
| `npm run test:unit` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npx tsc --noEmit` | Type-check |
| `scripts/check-tokens.sh` | Verify token hygiene |

## Modifying Components

1. Add CSS in `src/css/<name>.css` inside the proper `@layer`.
2. Import it in the correct barrel (`components.css`, `layouts.css`, etc.).
3. Add/extend JS API in `src/ts/<name>.ts`, re-export from `src/ts/index.ts`.
4. Add/extend Web Component in `src/wc/mn-<name>.js` when needed.
5. Add unit tests in `tests/unit/` and update `demo/` if behavior is visible.

## Adding Icons

| Rule | Value |
|------|-------|
| Format | Inline SVG |
| ViewBox | `0 0 24 24` |
| Style | `stroke="currentColor" fill="none" stroke-width="1.5"` |
| Size classes | xs=12px sm=16px md=20px lg=24px xl=32px 2xl=48px |
| Registration | Add to `src/ts/icons-*.ts`, re-export from `icons.ts` |
| Accessibility | Wrap in `<span aria-hidden="true">` |
| NO EMOJI | Any emoji character = instant PR rejection |

## Theme Compliance

Every component must work in all 4 themes. Test by switching `<body>` class:
- `mn-nero` — dark mode
- `mn-avorio` — warm light
- (default) — editorial mixed
- `mn-colorblind` — high-contrast accessible

Use only CSS custom properties for colors. NEVER hardcode #hex values (except in tokens.css).

## Accessibility Checklist

Before submitting a PR:
- [ ] All interactive elements are keyboard-navigable (Tab/Enter/Escape)
- [ ] Color contrast ≥ 4.5:1 (text) / 3:1 (UI components)
- [ ] Decorative elements have `aria-hidden="true"`
- [ ] Form inputs have `<label>` elements
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets ≥ 44x44px
- [ ] Tested in screen reader (VoiceOver / NVDA)

## Pull Request Checklist

- [ ] One feature/fix per PR
- [ ] Build, unit tests, and typecheck pass
- [ ] Works across all 4 themes
- [ ] Accessibility checklist is complete
- [ ] `CHANGELOG.md` updated under `[Unreleased]`

## License

MPL-2.0 — contributions licensed under the Mozilla Public License 2.0.
