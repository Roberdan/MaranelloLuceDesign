# Choosing a Starter

## Decision Matrix

| Use case | Recommended starter | Key differentiator |
|---|---|---|
| New app, need a shell frame only | `shared-shell` | Minimal — config + nav + content area |
| Multi-project SaaS tool | `workspace` | Project switcher (`ProjectEntry[]`), command palette (`cmd+k`) |
| IT ops / DevOps monitoring | `ops-dashboard` | Dashboard strip (`StripZoneConfig[]`), alert polling, service health board |
| CEO / CFO / board portal | `executive-cockpit` | Hero KPIs (`KpiCard[]`), narrative hero, board summaries, drill-down paths |
| Enterprise PMO / delivery | `program-management` | Command rail, KPI strip, portfolio table, Gantt / kanban board |

## Starter Profiles

### shared-shell

`WorkspaceConfig` is not involved. This is the lowest-level starter.

- Provides: `SharedShellConfig`, `SharedShellController`, all adapters, deploy generators.
- `renderSharedShell(host, config)` mounts header + nav + content + optional detail panel to any DOM element.
- Choose this when building a bespoke app that needs design system theming and nav rails but none of the domain opinions of the template starters.

### workspace

Extends `SharedShellConfig` with:

```ts
interface WorkspaceConfig extends SharedShellConfig {
  projects: ProjectEntry[];            // project switcher entries
  commandPalette: CommandPaletteConfig; // placeholder + hotkey ('cmd+k')
  activityFeed?: ActivityFeedConfig;   // { endpoint: string }
  taskContext?: TaskContextConfig;     // { showInDetailPanel: boolean }
}
```

- `createWorkspaceConfig(overrides?)` merges shallowly over defaults.
- Default themes: all six (`editorial`, `avorio`, `navy`, `sugar`, `colorblind`, `dim`).
- Best for: general delivery apps, multi-project SaaS, productivity tools.

### ops-dashboard

Extends `SharedShellConfig` (from `shared-shell`) with real-time monitoring surfaces:

```ts
interface OpsDashboardConfig extends SharedShellConfig {
  dashboardStrip: StripZoneConfig[];  // gauge | pipeline | trend | board
  alerts?: AlertConfig;              // { endpoint, refreshInterval: ms }
  statusBoard?: StatusBoardConfig;   // { columns, swimlanes }
  timelineView?: TimelineViewConfig; // { range: 'day' | 'week' | 'month' }
  filters?: FilterConfig[];          // select | daterange | search
}
```

- Default theme: `nero` (dark, high-contrast).
- Executive strip is enabled by default for this starter.
- Best for: service health portals, CI/CD dashboards, infrastructure monitoring.

### executive-cockpit

```ts
interface CockpitConfig extends ShellConfig {
  heroKpis: KpiCard[];                       // id, label, value, trend, unit
  narrativeHero?: NarrativeHero;             // headline + summary text
  boardSummaries?: BoardSummary[];           // tabular snapshots for board review
  drillDownPaths?: Record<string, string>;   // kpi.id -> route path
}
```

- Default theme: `editorial` (light, typography-forward).
- `featureFlags.agentPanel` is `true` — AI narrative summarisation is expected.
- `createCockpitConfig` returns a plain mutable object; spread if you prefer working with copies.
- Best for: investor portals, executive briefing tools, board-level dashboards.

### program-management

```ts
interface ProgramManagementConfig extends SharedShellConfig {
  commandRail: CommandRailItem[];   // navigate | filter | create | command actions
  kpiStrip: KpiStripEntry[];        // number | currency | percent formatted KPIs
  portfolioList: PortfolioListConfig; // columns, groupBy, sortBy
  timelineBoard?: TimelineBoardConfig; // gantt | kanban | calendar + dateRange
  entityDetail: EntityDetailConfig;  // tabs + defaultTab
}
```

- Default theme: `editorial`; `navy` also works well for dark environments.
- `commandRail` includes an `ai-summary` command entry by default.
- Best for: enterprise PMO offices, portfolio health tracking, delivery visibility tools.

## Customisation Boundaries

### Safe to override

| What | How |
|---|---|
| `appName`, `appDescription`, `currentPath` | Top-level fields in any config |
| `header.brandLabel`, `header.productLabel`, `header.primaryActions` | `SharedShellHeaderConfig` |
| `navigation` sections and items | Replace the `SharedShellNavSection[]` array |
| `content.title`, `content.eyebrow`, `content.body` | `SharedShellContentConfig` fields |
| `detailPanel.title`, `detailPanel.body` | `SharedShellDetailPanelConfig` |
| `themes` list | Any subset of the 6 theme ids |
| All domain extensions (e.g., `heroKpis`, `dashboardStrip`) | Shallow merge via `overrides` |
| All adapter fields (`AIAdapter`, `AuthAdapter`, etc.) | Passed separately as `SharedShellAdapters` |
| `featureFlags` (individual flags) | Deep-merged in all factories |

### Will break the shell

| Action | Why it breaks |
|---|---|
| Removing `SharedShellConfig` required fields (`appName`, `header`, `navigation`, `content`, `themes`) | `renderSharedShell` reads all of them unconditionally |
| Passing primitive CSS values (e.g., `#ff0000`) instead of semantic tokens to theme fields | Violates token contract; themes stop working |
| Replacing `renderSharedShell` return type | Consumers depend on `SharedShellController` (`destroy`, `getState`, `setActiveItem`) |
| Setting `themes` to an empty array | Theme toggle breaks; `data-themeModes` attribute is empty |
| Passing primitive CSS values (e.g., `#ff0000`) to cockpit theme fields | Violates token contract; themes stop working |
| Changing `content.body` to raw user-supplied HTML | Violates `no innerHTML with user data` rule; use sanitised markup only |

### Adapter independence

Adapters (`SharedShellAdapters`) are passed separately from `SharedShellConfig`. The shell
never imports concrete providers. Swap any adapter without touching the config:

```ts
// swap auth from NextAuth to Clerk
const adapters: SharedShellAdapters = {
  ...existingAdapters,
  auth: { provider: 'clerk', signInPath: '/sign-in', signOutPath: '/sign-out', sessionEndpoint: '/api/me' },
};
```

The `hasPermission(adapter, role, permissionId)` utility function is exported from
`@convergio/shared-shell-starter` for RBAC checks at the call site.
