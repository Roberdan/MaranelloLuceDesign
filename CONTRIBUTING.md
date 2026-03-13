# Contributing to Maranello Luce Design

## Dev Environment Setup

```bash
git clone https://github.com/Roberdan/MaranelloLuceDesign.git
cd MaranelloLuceDesign
npm install
npm run build    # full build: JS + CSS + WC + fonts + types
npm run dev      # demo server at localhost:3000
```

Requirements: Node 20+, npm 10+.

## Running Tests

```bash
npm run test:unit   # Vitest unit tests
npm run test:e2e    # Playwright E2E tests (requires npm run build first)
npx vitest run      # single-run without watch
```

## Code Style

- **TypeScript**: strict mode, no `any`, max 250 lines/file — split by responsibility
- **CSS**: all rules must be inside an `@layer` block (one of the 11 system layers)
- **File naming**: kebab-case, match the module it exports
- **Exports**: named exports only — no default exports except for framework-specific patterns
- **Comments**: explain *why*, not *what* — keep under 5% comment density

## Project Structure

```
src/
  css/      CSS source — one file per concern, each wrapped in @layer
  ts/       Headless JS/TS engines
  wc/       Web Components (mn-* custom elements)
esbuild.config.mjs    JS bundle config
scripts/build-css.mjs CSS bundle config
```

## Adding a New Component

1. CSS: create `src/css/<name>.css`, wrap all rules in the appropriate `@layer`
2. TS: create `src/ts/<name>.ts`, export from `src/ts/index.ts`
3. WC (optional): create `src/wc/mn-<name>.ts`, register in `src/wc/index.ts`
4. Tests: add `src/ts/<name>.test.ts` for any logic
5. Run `npm run build` and verify no errors

## PR Process

1. Fork → feature branch → PR against `main`
2. All CI checks must pass (build, unit tests, E2E, type check)
3. Keep PRs focused — one feature or fix per PR
4. Update CHANGELOG.md under `[Unreleased]` with a one-line entry
5. PRs are squash-merged

## Commit Convention

```
feat: add mn-badge web component
fix: gauge needle misaligned at value=0
chore: bump esbuild to 0.25
```

## License

MIT — by contributing you agree your changes are licensed under MIT.
