<!-- v6.0.0 | 2026-03-27 -->
# Consumer Contract — Maranello Design System

Defines what consumer apps own vs what `@maranello/tokens` and `@maranello/elements` own. Violation = domain leak.

---

## What Consumer Apps Own

| Concern | Examples |
|---|---|
| **Data fetching** | REST/GraphQL calls, caching, polling, auth tokens |
| **Business rules** | Eligibility checks, access control, field derivation |
| **Permissions** | Which views/actions the current user may see |
| **Navigation state** | Active route, deep-link params, history push |
| **Actions / workflows** | Submit, approve, delete — the actual side-effects |
| **Domain-specific calculations** | Margin %, burn rate, custom KPI formulas |
| **Vocabulary** | Entity names, column labels, error messages |

Consumer code calls Maranello with pre-resolved data + pre-bound callbacks. It never renders DOM directly for views it has registered.

---

## What @maranello/tokens Owns

| Concern | APIs |
|---|---|
| **Design tokens** | CSS custom properties (`--mn-text`, `--mn-surface`, `--mn-accent`, etc.) |
| **Themes** | 5 themes (Editorial, Nero, Avorio, Colorblind, Sugar), `setTheme()`, `cycleTheme()`, `palette()` |
| **shadcn/ui bridge** | `@maranello/tokens/bridge-shadcn` — automatic mapping of Maranello tokens to shadcn CSS custom properties |

## What @maranello/elements Owns

| Concern | APIs |
|---|---|
| **Rendering** | `DashboardRenderer`, `FacetWorkbench`, `EntityWorkbench`, `DataTable` |
| **Layout** | `createLayout()` — 4-slot CSS grid with `:has()` auto-collapse + state machine |
| **Interaction patterns** | Keyboard navigation, drag handles, focus management |
| **Responsive adaptation** | CSS breakpoints, `autoResize()`, fluid canvas |
| **Accessibility** | WCAG 2.2 AA, `<mn-a11y>` FAB, focus trapping in modals |
| **Kanban rendering** | `kanbanBoard()` — column/card layout, drag-drop UX, keyboard navigation, WCAG compliance. Consumer owns: card data, action callbacks (`onMove`, `onCardClick`) |
| **Voice state machine** | `voiceManager()` — voice input lifecycle, adapter framework, aiChat integration. Consumer owns: speech recognition API keys, adapter implementations |
| **Realtime adapter** | `createRealtimeAdapter()` — GPT Realtime API reference adapter. Consumer owns: `apiKey`, custom `wsUrl`, event handlers |

Consumer code never writes CSS that overrides `mn-dashboard-*` internals.

### Theme Cycling Order

`cycleTheme()` rotates through themes in this fixed order:

Editorial > Nero > Avorio > Colorblind > Sugar > (loop)

The default theme is Editorial. Consumers testing theme cycling must account for all 5 themes.

---

## How to Use the Packages

### Step 1 — Import Tokens and Theme API

```ts
import { setTheme, cycleTheme, palette } from '@maranello/tokens';
import '@maranello/tokens/css';
import '@maranello/tokens/bridge-shadcn'; // optional: side-effect CSS import (works in Vite/Next.js bundlers)

setTheme('nero');
const tokens = palette(); // read live semantic token values
```

> `bridge-shadcn` is a CSS file. In plain CSS, use `@import '@maranello/tokens/bridge-shadcn';`. The JS `import` above is a side-effect import that bundlers (Vite, Next.js, Webpack) resolve as CSS injection.

### Step 2 — Use Elements

```ts
import { DashboardRenderer, kanbanBoard, gantt } from '@maranello/elements';
import '@maranello/elements/css';

// Render a dashboard
const renderer = new DashboardRenderer(container, { schema, data });

// Or use individual components
const board = kanbanBoard(el, { columns, cards, onMove });
```

### Step 3 — Register Web Components

```ts
// All 31 WC tags
import '@maranello/elements/register-all';

// Or individual components for tree-shaking
import '@maranello/elements/wc/mn-gauge';
import '@maranello/elements/wc/mn-gantt';
```

---

## Anti-Patterns

| Anti-Pattern | Why it's Wrong | Correct Alternative |
|---|---|---|
| `createElement`-heavy rendering inside views | Bypasses Maranello render pipeline | Use `DashboardRenderer`, `EntityWorkbench`, or `DataTable` |
| Importing tokens and elements from the same package | Packages are split for tree-shaking | `@maranello/tokens` for theme API, `@maranello/elements` for components |
| Using primitive CSS tokens in components | Breaks cross-theme compatibility | Use semantic tokens (`--mn-text`, `--mn-surface`, `--mn-accent`) |
| Hard-coding domain labels in `FacetConfig.type` | `FacetConfig` is generic — type is a UI concept | Keep labels in consumer-owned config objects |
| Using AppShellController, ViewRegistry, NavigationModel, PanelOrchestrator, StateScaffold | Removed in v6.0.0 | Use framework-native equivalents (Next.js layouts, SvelteKit, etc.) |

---

## Migration Guide

See [docs/migrations/v6.0.0.md](docs/migrations/v6.0.0.md) for the full v6.0.0 migration guide.
