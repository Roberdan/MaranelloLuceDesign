<!-- v3.1.0 | 2025-07-21 -->
# Contributing

## Setup

```bash
git clone https://github.com/Roberdan/MaranelloLuceDesign.git && cd MaranelloLuceDesign
npm install && npm run build && npm run dev  # localhost:3000
```

Requirements: Node 20+, npm 10+.

## Commands

| Command | Purpose |
|---|---|
| `npm run build` | Full build (JS+CSS+WC+fonts+types) |
| `npm run test:unit` | Vitest |
| `npm run test:e2e` | Playwright (build first) |
| `npx tsc --noEmit` | Type-check |

## Code Rules

| Rule | Detail |
|---|---|
| Max file size | 250 lines — split if exceeds |
| Language | English only (code + comments) |
| TypeScript | `strict`, no `any`, named exports only |
| CSS | All rules inside `@layer` block |
| File naming | `kebab-case`, match exported module |
| Comments | WHY not WHAT, <5% density |

## New Component Checklist

- [ ] CSS: `src/css/<name>.css` wrapped in `@layer`
- [ ] TS: `src/ts/<name>.ts`, export from `src/ts/index.ts`
- [ ] WC (optional): `src/wc/mn-<name>.ts`, register in `src/wc/index.ts`
- [ ] Test: `tests/<name>.test.ts`
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes

## PR Process

- [ ] Fork → feature branch → PR against `main`
- [ ] All CI green (build, unit, E2E, typecheck)
- [ ] One feature/fix per PR
- [ ] Update `CHANGELOG.md` under `[Unreleased]`
- [ ] Squash-merge

## Commits

```
feat: add mn-badge web component
fix: gauge needle misaligned at value=0
chore: bump esbuild to 0.25
```

## License

MIT — contributions licensed under MIT.
