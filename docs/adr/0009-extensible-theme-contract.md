# ADR-0009: Extensible Theme Contract

**Date:** 2026-03-28
**Status:** Accepted
**Version:** 6.0.1

## Context

Maranello started with 5 fixed themes. Adding Navy as the 6th proved the system can grow. Community and team members want to create custom themes for both the DS and their IDE/terminal environments.

## Decision

Define a "Theme Contract" -- a checklist of required tokens that any valid Maranello theme must provide. If all tokens are defined, all 31 Web Components and headless TS components will work correctly.

### Required Tokens (minimum for a valid theme)

| Category | Count | Tokens |
|----------|-------|--------|
| Surfaces | 6 | `--mn-surface`, `--mn-surface-raised`, `--mn-surface-sunken`, `--mn-surface-input`, `--mn-surface-overlay`, `--mn-surface-hover` |
| Text | 5 | `--mn-text`, `--mn-text-muted`, `--mn-text-tertiary`, `--mn-text-disabled`, `--mn-text-inverse` |
| Borders | 5 | `--mn-border`, `--mn-border-subtle`, `--mn-border-strong`, `--mn-border-focus`, `--mn-border-error` |
| Accent | 5 | `--mn-accent`, `--mn-accent-hover`, `--mn-accent-text`, `--mn-accent-bg`, `--mn-accent-border` |
| Status | 8 | `--mn-error`, `--mn-error-bg`, `--mn-success`, `--mn-success-bg`, `--mn-warning`, `--mn-warning-bg`, `--mn-info`, `--mn-info-bg` |
| Focus | 4 | `--mn-focus-ring`, `--mn-focus-ring-offset`, `--mn-hover-bg`, `--mn-active-bg` |
| Overlay | 2 | `--mn-backdrop`, `--mn-scrim` |

**Total: 35 tokens**

### WCAG Requirements

| Pair | Minimum ratio |
|------|---------------|
| Text on surface | 4.5:1 |
| Muted text on surface | 4.5:1 |
| UI elements (accent, borders) | 3:1 |
| Error/success/warning on surface | 4.5:1 |

### IDE/Terminal Extension

Each theme can optionally provide derived configs for external tools:

| Target | Format | Location |
|--------|--------|----------|
| VS Code | JSON (tokenColorCustomizations) | `extras/vscode-themes/` |
| Warp | YAML (accent, background, foreground, terminal_colors) | `extras/warp-themes/` |
| Ghostty | Config (background, foreground, palette 0-15) | `extras/ghostty-themes/` |

Terminal themes map DS tokens to ANSI colors: surface to background, text to foreground, accent to yellow/cursor, error to red, success to green, info to blue.

## Consequences

- Community can create themes by filling the token checklist
- A `validate-theme.mjs` script can verify any theme meets the contract
- The theme count is no longer fixed -- "N themes" instead of "6 themes"
- Terminal/IDE themes stay in sync with the DS by deriving from the same token values
