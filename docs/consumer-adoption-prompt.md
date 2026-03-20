# Maranello v4.17.0 — Consumer Adoption Prompt

> Copy-paste this into any repo that consumes Maranello (as CLAUDE.md section, issue, or agent prompt).

## Context

Maranello (`maranello-luce-design-business`) is now v4.17.0. It evolved from a CSS+component library into a **presentation runtime**. Consumer apps must stop owning layout/rendering and delegate to Maranello's schema-driven APIs.

## Task

Audit this codebase and migrate UI orchestration code to Maranello v4.17.0 runtime APIs. Zero breaking changes — all existing Maranello APIs still work. New capabilities are additive.

## What to migrate (priority order)

### 1. Loading/error states → StateScaffold

Find: manual spinner/loading divs, custom error containers, `innerHTML = '<div class="spinner">'`

```js
// Before
container.innerHTML = '<div class="spinner"></div>';
// After
const scaffold = new Maranello.StateScaffold(container, { state: 'loading' });
scaffold.setState('error', message);  // retry button auto-included
scaffold.setState('empty', 'No data');
```

### 2. Custom cell renderers → DataTable v2 types

Find: columns with `type: 'custom'` and `render` callbacks for avatar+name, progress bars, trend arrows, action buttons.

```js
// Before: { key: 'user', type: 'custom', render: (v) => `<img src="${v.avatar}"><span>${v.name}</span>` }
// After:  { key: 'user', type: 'person' }
```

Built-in types: `person`, `metric`, `progress`, `action`, `link`, `icon`.

### 3. Manual search dropdowns → AsyncSelect

Find: `input` + `setTimeout` + `fetch` + manual dropdown DOM.

```js
new Maranello.AsyncSelect(el, {
  provider: { search: (q) => api.search(q), getLabel: x => x.name, getId: x => x.id },
  onSelect: (item) => handleSelect(item)
});
```

### 4. Custom app layout CSS → AppShell

Find: CSS grid/flex for app layout, manual sidebar toggle, inline `style="display:grid"`.

```html
<mn-app-shell layout="side-detail">
  <nav slot="nav">...</nav>
  <div slot="toolbar">...</div>
  <div slot="main">...</div>
  <div slot="detail">...</div>
</mn-app-shell>
```

Modes: `full`, `split`, `stacked`, `docked-bottom`, `dual-panel`, `side-detail`.

### 5. Manual view switching → ViewRegistry + PanelOrchestrator

Find: router callbacks with `clearMain()` + `createElement` + `appendChild`.

```js
const registry = Maranello.ViewRegistry.getInstance();
registry.register({ id: 'dashboard', title: 'Dashboard', defaultPlacement: 'page',
  factory: (el, data) => new Maranello.DashboardRenderer(el, { schema, data }) });

const nav = new Maranello.NavigationModel();
const orch = new Maranello.PanelOrchestrator(registry, nav);
orch.open('dashboard', 'page', data);
orch.move('dashboard', 'side-panel'); // move without rewrite
```

### 6. Per-page filter UI → FacetWorkbench

Find: custom dropdown/checkbox/date-range filter groups built per-page.

```js
new Maranello.FacetWorkbench(el, {
  facets: [
    { id: 'status', label: 'Status', type: 'multi-select', dataProvider: () => fetchStatuses() },
    { id: 'search', label: 'Search', type: 'search', dataProvider: () => Promise.resolve([]) },
    { id: 'date', label: 'Date', type: 'date-range', dataProvider: () => Promise.resolve([]) },
  ],
  onFilterChange: (filters) => table.setData(applyFilters(allData, filters))
});
```

### 7. Manual dashboard composition → DashboardRenderer

Find: `createElement` soup building KPI cards + charts + gauges.

```js
new Maranello.DashboardRenderer(el, {
  schema: { rows: [
    { columns: [{ type: 'kpi-strip', dataKey: 'kpis', span: 12 }] },
    { columns: [
      { type: 'chart', dataKey: 'sales', span: 6, options: { chartType: 'sparkline' } },
      { type: 'gauge', dataKey: 'load', span: 6 }
    ]}
  ]}
});
// null = loading skeleton, Error = error+retry, [] = empty (automatic)
```

### 8. Custom entity forms → EntityWorkbench

Find: hand-written `<form>` HTML per entity type with manual tabs, dirty tracking, validation.

```js
new Maranello.EntityWorkbench(el, {
  schema: { tabs: [{ id: 'main', label: 'Details', sections: [{ fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'manager', label: 'Manager', type: 'async-select', provider: managerSearch },
  ]}]}]},
  data: record,
  onSave: (modified) => api.patch(url, modified)
});
```

## Hard rules

| DO NOT | DO |
|---|---|
| `createElement` for layout/presentation | Maranello schema-driven APIs |
| CSS for app shell structure | `<mn-app-shell layout="...">` |
| Inline styles for layout | `shell.setLayout('split')` |
| Custom loading/error UI | `StateScaffold` |
| `render` callbacks in DataTable | Built-in column types |
| Keep in consumer: data fetching, business rules, permissions, routing URLs, actions, domain logic | Pass to Maranello: schemas, configs, data, callbacks |

## Verification

After migration, grep for anti-patterns (should return 0 in UI code):

```bash
grep -rn 'createElement' src/ --include='*.ts' --include='*.js' | grep -v node_modules | grep -v test
grep -rn 'innerHTML.*<div' src/ --include='*.ts' --include='*.js' | grep -v node_modules | grep -v test
grep -rn 'grid-template-columns\|display:\s*grid\|display:\s*flex' src/ --include='*.css' | grep -v node_modules | grep -v maranello
```

## Reference

| Doc | URL |
|---|---|
| Migration guide | `docs/migration-guide-v4.17.md` |
| API contracts | `docs/api-contracts-v4.md` |
| Agent cookbook | `docs/agent-cookbook.md` |
| Consumer contract | `CONSUMER_CONTRACT.md` |
| Demo pages | `demo/runtime-*.html` |
