<!-- v6.0.0 | 2026-03-27 -->
# Consumer Contract — Maranello Design System

Defines what consumer apps own vs what `@convergio/design-tokens` and `@convergio/design-elements` own. Violation = domain leak.

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

## What @convergio/design-tokens Owns

| Concern | APIs |
|---|---|
| **Design tokens** | CSS custom properties (`--mn-text`, `--mn-surface`, `--mn-accent`, etc.) |
| **Themes** | 6 themes (Editorial, Nero, Avorio, Colorblind, Sugar, Navy), `setTheme()`, `cycleTheme()`, `palette()` |
| **shadcn/ui bridge** | `@convergio/design-tokens/bridge-shadcn` — automatic mapping of Maranello tokens to shadcn CSS custom properties |

## What @convergio/design-elements Owns

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

Editorial > Nero > Avorio > Colorblind > Sugar > Navy > (loop)

The default theme is Editorial. Consumers testing theme cycling must account for all 6 themes.

---

## How to Use the Packages

### Step 1 — Import Theme API and canonical app CSS

```ts
import { setTheme, cycleTheme, palette } from '@convergio/design-tokens';
import '@convergio/design-elements/css';
import '@convergio/design-tokens/bridge-shadcn'; // optional side-effect CSS import

setTheme('nero');
const tokens = palette();
```

> `@convergio/design-elements/css` already includes tokens + themes + component CSS. Import `@convergio/design-tokens/css` only when you need token CSS without component CSS.

### Step 2 — Use Elements

```ts
import { DashboardRenderer, kanbanBoard } from '@convergio/design-elements';
import { gantt } from '@convergio/design-elements/gantt';

const renderer = new DashboardRenderer(container, { schema, data });
const board = kanbanBoard(el, { columns, cards, onMove });
```

### Step 3 — Register Web Components

```ts
// All 31 WC tags
import '@convergio/design-elements/register-all';

// Or individual components for tree-shaking
import '@convergio/design-elements/wc/mn-gauge';
import '@convergio/design-elements/wc/mn-gantt';
```

### Step 4 — Use the starter platform when you need a full shell

For full Next.js application shells, prefer the starter platform under `starters/`:

- `shared-shell` owns app-shell composition, AI/auth/RBAC/telemetry/API seams, and deployment assets
- `template-workspace-app`
- `template-ops-dashboard`
- `template-executive-cockpit`
- `template-program-management`

Application repos still own data, security, roles, business logic, and provider secrets. The starter platform owns the shell structure and design-system wiring.

---

## Anti-Patterns

| Anti-Pattern | Why it's Wrong | Correct Alternative |
|---|---|---|
| `createElement`-heavy rendering inside views | Bypasses Maranello render pipeline | Use `DashboardRenderer`, `EntityWorkbench`, or `DataTable` |
| Importing tokens and elements from the same package | Packages are split for tree-shaking | `@convergio/design-tokens` for theme API, `@convergio/design-elements` for components |
| Using primitive CSS tokens in components | Breaks cross-theme compatibility | Use semantic tokens (`--mn-text`, `--mn-surface`, `--mn-accent`) |
| Hard-coding domain labels in `FacetConfig.type` | `FacetConfig` is generic — type is a UI concept | Keep labels in consumer-owned config objects |
| Using AppShellController, ViewRegistry, NavigationModel, PanelOrchestrator, StateScaffold | Removed in v6.0.0 | Use framework-native equivalents (Next.js layouts, SvelteKit, etc.) |

---

## Migration Guide

See [docs/migrations/v6.0.0.md](docs/migrations/v6.0.0.md) for the full v6.0.0 migration guide.
