# Convergio Starters

Starters are opinionated scaffolds that wire the design system into a deployable application.
Each starter provides a typed config factory, a shared-shell foundation, and deploy asset generators.

## Starter Catalog

| Starter | Package | Purpose | Best for |
|---|---|---|---|
| `shared-shell` | `@convergio/shared-shell-starter` | Config-driven app shell: header, nav, content, detail panel | Any new app needing a nav frame |
| `workspace` | `@convergio/workspace-starter` | SaaS workspace with project switcher and command palette | Multi-project tools, general delivery apps |
| `ops-dashboard` | `@convergio/ops-dashboard-starter` | Live metrics, dashboard strip, alert panels, service health | IT ops, DevOps, SRE monitoring tools |
| `executive-cockpit` | `@convergio/executive-cockpit-starter` | Hero KPIs, narrative summary, board summaries, drill-down paths | CEO / CFO / board-level views |
| `program-management` | `@convergio/program-management-starter` | Command rail, KPI strip, portfolio list, Gantt / kanban board | Enterprise PMO, delivery tracking |

## Quick Start

### 1. Pick a starter

See [choosing-a-starter.md](./choosing-a-starter.md) for the decision matrix.

### 2. Scaffold with create-starter

```ts
import { instantiateStarter, STARTER_MANIFESTS } from '@convergio/create-starter';

// List available starters
STARTER_MANIFESTS.forEach(m => console.log(m.id, '-', m.description));

// Dry-run: validate and get file list
const result = instantiateStarter('workspace', './my-app');
if (!result.success) throw new Error(result.errors.join(', '));
console.log('Files to create:', result.files);
```

The CLI binary (`create-convergio-app`) wraps `instantiateStarter` for terminal use.

### 3. Configure

Each starter exposes a typed config factory. Import and override only what you need:

```ts
// workspace example
import { createWorkspaceConfig } from '@convergio/workspace-starter';

const config = createWorkspaceConfig({
  appName: 'My Delivery Tool',
  header: { brandLabel: 'ACME', productLabel: 'Delivery', homeHref: '/', primaryActions: [] },
});
```

| Starter | Factory | Config type |
|---|---|---|
| shared-shell | `createSharedShellFiles(config)` | `SharedShellConfig` |
| workspace | `createWorkspaceConfig(overrides?)` | `WorkspaceConfig` |
| ops-dashboard | `createOpsDashboardConfig(overrides?)` | `OpsDashboardConfig` |
| executive-cockpit | `createCockpitConfig(overrides?)` | `CockpitConfig` |
| program-management | `createProgramManagementConfig(overrides?)` | `ProgramManagementConfig` |

### 4. Attach adapters (shared-shell only)

```ts
import type { SharedShellAdapters } from '@convergio/shared-shell-starter';

const adapters: SharedShellAdapters = {
  auth: { provider: 'nextauth', signInPath: '/auth/signin', signOutPath: '/auth/signout', sessionEndpoint: '/api/auth/session' },
  ai:   { routePath: '/api/ai/chat', model: 'claude-sonnet-4-6' },
};
```

See `adapters.ts` for the full `SharedShellAdapters` interface.

### 5. Deploy

```ts
import { generateDeployAssets } from '@convergio/shared-shell-starter';

const assets = generateDeployAssets('vercel', adapters);
// assets.files['vercel.json'] and assets.files['.env.example'] are ready to write
```

See [deployment.md](./deployment.md) for Vercel, Azure Container Apps, and Tauri details.

## Architecture

```
shared-shell (foundation)
  contracts.ts      SharedShellConfig, SharedShellController
  adapters.ts       AIAdapter, AuthAdapter, RBACAdapter, TelemetryAdapter, APIAdapter, FeatureFlagAdapter
  runtime.ts        renderSharedShell(host, config): SharedShellController
  next-template.ts  createSharedShellFiles(config): Record<string, string>
  deploy.ts         generateDeployAssets(target, adapters): DeployAssets
        |
        v
template starters (extend SharedShellConfig or ShellConfig)
  workspace          WorkspaceConfig  + projects, commandPalette, activityFeed, taskContext
  ops-dashboard      OpsDashboardConfig + dashboardStrip, alerts, statusBoard, filters
  executive-cockpit  CockpitConfig + heroKpis, narrativeHero, boardSummaries, drillDownPaths
  program-management ProgramManagementConfig + commandRail, kpiStrip, portfolioList, timelineBoard
        |
        v
deploy targets
  Vercel             vercel.json + .env.example
  Azure Container Apps  Dockerfile + deploy/k8s-deployment.yaml + .env.example
  Tauri              wrap the Next.js app — see deployment.md
```

## Demo Pages

Each starter has a self-contained HTML demo with realistic data and all 6 themes:

- [Workspace](../../demo/starter-workspace.html) — layout, kanban, data-table, command-palette
- [Ops Dashboard](../../demo/starter-ops-dashboard.html) — dashboard strip, system-status, charts
- [Executive Cockpit](../../demo/starter-executive-cockpit.html) — Ferrari gauges, heatmap, KPI strip
- [Program Management](../../demo/starter-program-management.html) — gantt, gauges, portfolio table
- [Hacker Terminal](../../demo/starter-hacker-terminal.html) — cybersecurity ops center, threat monitoring
- [App Template](../../demo/starter-app-template.html) — generic admin dashboard, starter scaffold

## Further Reading

- [choosing-a-starter.md](./choosing-a-starter.md) — decision matrix and customisation boundaries
- [deployment.md](./deployment.md) — Vercel, Azure, and Tauri deployment
- [agent-semantics.md](./agent-semantics.md) — how agents read and compose starters
- [../THEMING.md](../THEMING.md) — theme tokens and theme switching
- [../INTEGRATION.md](../INTEGRATION.md) — integrating design elements
