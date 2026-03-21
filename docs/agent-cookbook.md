# Maranello Presentation Runtime — Agent Cookbook

## Quick reference

### AppShellController

```js
const shell = new Maranello.AppShellController(el, { layout: 'side-detail' });
shell.setLayout('split');
shell.toggleSidebar();
```

### ViewRegistry

```js
const registry = Maranello.ViewRegistry.getInstance();
registry.register({ id: 'home', title: 'Home', defaultPlacement: 'page', factory: renderHome });
registry.get('home');
```

### PanelOrchestrator

```js
const orch = new Maranello.PanelOrchestrator(registry, nav);
orch.open('detail', 'side-panel', { id: 42 });
orch.move('detail', 'modal');
```

### NavigationModel

```js
const nav = new Maranello.NavigationModel();
nav.push('detail', { id: 42 });
const unsubscribe = nav.onNavigate((entry, action) => router.navigate(entry.viewId));
```

### DashboardRenderer

```js
const dash = new Maranello.DashboardRenderer(el, { schema });
dash.setData('kpis', data.kpis);
dash.setSchema(newSchema);
```

### FacetWorkbench

```js
const wb = new Maranello.FacetWorkbench(filterEl, { facets, onFilterChange });
wb.clearAll();
wb.savePreset('default');
```

### EntityWorkbench

```js
const editor = new Maranello.EntityWorkbench(el, { schema, data, onSave });
editor.validate();
editor.pushEntity(childSchema, childData);
```

### AsyncSelect

```js
const sel = new Maranello.AsyncSelect(el, { provider, onSelect, placeholder: 'Search...' });
sel.clear();
sel.setProvider(newProvider);
```

### StateScaffold

```js
const scaffold = new Maranello.StateScaffold(el, { state: 'loading' });
scaffold.setState('ready');    // data loaded successfully — content visible
scaffold.setState('partial');  // degraded content — shows warning banner
scaffold.setState('error', 'Connection failed');
```

---

## AI Operations Components

Maranello provides four dedicated components for building AI/LLM operations dashboards.
These are available in both the IIFE bundle (`window.Maranello`) and ESM imports.

| Component | Purpose |
|-----------|---------|
| `tokenMeter` | Visualizes LLM token budget usage (used/total) with optional cost display |
| `agentCostBreakdown` | Per-agent cost attribution table with sorting and budget alerts |
| `agentTrace` | Step-by-step trace of an AI agent's execution with status indicators |
| `costTimeline` | Multi-series area chart for tracking LLM spend over time |
| `streamingText` | Renders streaming LLM output with citation support |

**Demo coverage:** `demo/sections/agentic.js` showcases `agentTrace`, `tokenMeter`, and
`streamingText`. `demo/sections/finops.js` showcases `agentCostBreakdown`, `costTimeline`,
and `tokenMeter`.

### Recipe: Agent operations dashboard

Combines all four core AI components into a single monitoring view.

```js
// 1. Layout: use AppShell with side-detail for drill-in
const shell = new Maranello.AppShellController(appEl, { layout: 'side-detail' });

// 2. Token budget meter — prominent at the top
const meter = Maranello.tokenMeter(
  document.getElementById('token-budget'),
  { used: 847_200, total: 1_000_000, label: 'GPT-4o budget' },
  { showCost: true, showBreakdown: true }
);

// 3. Cost breakdown table — per-agent attribution
const costs = Maranello.agentCostBreakdown(
  document.getElementById('cost-table'),
  [
    { agent: 'Planner',    model: 'claude-opus-4', tokens: 420_000, cost: 6.30 },
    { agent: 'Executor',   model: 'claude-opus-4', tokens: 310_000, cost: 4.65 },
    { agent: 'Reviewer',   model: 'gpt-4o',       tokens: 117_200, cost: 0.59 }
  ],
  { sortable: true, onBudgetAlert: (row) => Maranello.toast(`${row.agent} over budget`, { type: 'warning' }) }
);

// 4. Cost over time — canvas area chart with hover interaction
const timeline = Maranello.costTimeline(
  document.getElementById('cost-canvas'),
  {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      { label: 'Planner',  values: [1.20, 1.50, 1.80, 0.90, 0.90] },
      { label: 'Executor', values: [0.80, 1.10, 1.00, 0.85, 0.90] }
    ],
    stacked: true,
    unit: '$'
  }
);

// 5. Agent trace — step-by-step execution log
const trace = Maranello.agentTrace(
  document.getElementById('trace-panel'),
  [
    { id: '1', label: 'Plan generated',   status: 'done',       duration: 2400 },
    { id: '2', label: 'Code written',     status: 'done',       duration: 8100 },
    { id: '3', label: 'Tests running',    status: 'in-progress' },
    { id: '4', label: 'Review pending',   status: 'pending' }
  ],
  { onSelect: (step) => console.log('Selected step:', step.id) }
);
```

---

## Common recipes

### Recipe 1: Build a dashboard from API data

```js
const schema = {
  rows: [
    {
      columns: [
        { type: 'kpi-strip', dataKey: 'kpis', span: 12 },
        { type: 'chart',     dataKey: 'sales', span: 6, options: { chartType: 'sparkline' } },
        { type: 'gauge',     dataKey: 'uptime', span: 6 }
      ]
    }
  ]
};

const dash = new Maranello.DashboardRenderer(el, { schema });

fetch('/api/metrics')
  .then(r => r.json())
  .then(data => {
    dash.setData('kpis',   data.kpis);
    dash.setData('sales',  data.salesHistory);
    dash.setData('uptime', data.uptimePercent);
  });
```

### Recipe 2: Filterable data table

```js
const allData = await fetch('/api/records').then(r => r.json());

const table = Maranello.dataTable(tableEl, { columns, data: allData });

const facets = new Maranello.FacetWorkbench(filterEl, {
  facets: [
    {
      id: 'status',
      label: 'Status',
      type: 'multi-select',
      dataProvider: () => Promise.resolve([
        { value: 'active',   label: 'Active' },
        { value: 'archived', label: 'Archived' }
      ])
    },
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      dataProvider: () => Promise.resolve([])
    }
  ],
  onFilterChange: (filters) => table.setData(applyFilters(allData, filters))
});
```

### Recipe 3: CRUD entity editor

```js
const managerSearch = {
  search: async (q) => fetch(`/api/users?q=${encodeURIComponent(q)}`).then(r => r.json()),
  getLabel: (u) => u.name,
  getId:    (u) => String(u.id)
};

const editor = new Maranello.EntityWorkbench(el, {
  schema: {
    tabs: [{
      id: 'main',
      label: 'Details',
      sections: [{
        fields: [
          { key: 'name',    label: 'Name',    type: 'text',         required: true },
          { key: 'manager', label: 'Manager', type: 'async-select', provider: managerSearch }
        ]
      }]
    }]
  },
  data: currentRecord,
  onSave: (modified) => api.patch(`/records/${id}`, modified)
});
```

### Recipe 4: App shell with navigation

```js
const registry = Maranello.ViewRegistry.getInstance();

registry.register({
  id: 'home',
  title: 'Home',
  defaultPlacement: 'page',
  factory: (container) => { renderHome(container); }
});

registry.register({
  id: 'detail',
  title: 'Detail',
  defaultPlacement: 'side-panel',
  factory: (container, data) => { renderDetail(container, data); }
});

const shell = new Maranello.AppShellController(appEl, { layout: 'side-detail' });
const nav   = new Maranello.NavigationModel();
const orch  = new Maranello.PanelOrchestrator(registry, nav);

orch.open('home');
// Later, when user selects a row:
// orch.open('detail', 'side-panel', { id: 42 });
```

### Recipe 5: Loading/error states

```js
const scaffold = new Maranello.StateScaffold(el, {
  state: 'loading',
  message: 'Fetching data...'
});

try {
  const data = await fetch('/api/data').then(r => r.json());
  if (data.length === 0) {
    scaffold.setState('empty', 'No records found');
  } else {
    scaffold.setState('ready'); // data loaded — content slot becomes visible
    renderContent(el, data);
  }
} catch (e) {
  scaffold.setState('error', e.message);
}
```

### Recipe 6: Move view between placements

```js
orch.open('detail', 'page');        // opens as full page
orch.move('detail', 'side-panel');  // moves to side panel — same DOM node, state preserved
orch.move('detail', 'modal');       // moves to modal overlay
```

---

## Anti-patterns

| Don't | Do Instead |
|-------|-----------|
| `document.createElement('div')` soup for layouts | `new DashboardRenderer(el, { schema })` |
| Inline CSS: `el.style.display = 'grid'` for app layout | `shell.setLayout('split')` |
| Custom filter UI reimplemented per page | `new FacetWorkbench(el, { facets })` |
| Manual loading spinner / blank container | `new StateScaffold(el, { state: 'loading' })` |
| Feature-specific layout CSS in page JS | `orch.move(viewId, 'side-panel')` |
| Re-mounting a view to change its placement | `orch.move(viewId, newPlacement)` — DOM preserved |
| Custom back-navigation stack | `EntityWorkbench.pushEntity()` + `NavigationModel` |

---

## Minimal schema reference

### DashboardSchema

```json
{
  "rows": [
    {
      "columns": [
        { "type": "kpi-strip", "dataKey": "kpis",   "span": 12 },
        { "type": "chart",     "dataKey": "sales",  "span": 6  },
        { "type": "gauge",     "dataKey": "uptime", "span": 6  }
      ]
    }
  ]
}
```

Widget `type` values: `kpi-strip` · `chart` · `gauge` · `data-table` · `text` · `html`

### EntitySchema

```json
{
  "tabs": [
    {
      "id": "main",
      "label": "Details",
      "sections": [
        {
          "title": "Basic Info",
          "fields": [
            { "key": "name",   "label": "Name",    "type": "text",         "required": true },
            { "key": "status", "label": "Status",  "type": "select",       "options": { "values": ["active","archived"] } },
            { "key": "owner",  "label": "Owner",   "type": "async-select", "provider": "<AsyncDataProvider>" }
          ]
        }
      ]
    }
  ]
}
```

Field `type` values: `text` · `number` · `textarea` · `select` · `async-select` · `date` · `boolean` · `computed` · `group`

### FacetConfig[]

```json
[
  {
    "id": "status",
    "label": "Status",
    "type": "multi-select",
    "dataProvider": "<() => Promise<FacetOption[]>>"
  },
  {
    "id": "date",
    "label": "Date Range",
    "type": "date-range",
    "dataProvider": "<() => Promise<[]>>"
  },
  {
    "id": "active",
    "label": "Active Only",
    "type": "boolean",
    "dataProvider": "<() => Promise<[]>>"
  }
]
```

Facet `type` values: `select` · `multi-select` · `search` · `date-range` · `boolean`

### DataTable columns (v2 types)

```json
[
  { "key": "name",   "label": "Name",   "type": "text",     "sortable": true },
  { "key": "status", "label": "Status", "type": "badge" },
  { "key": "score",  "label": "Score",  "type": "sparkbar", "max": 100 },
  { "key": "action", "label": "",       "type": "actions",  "actions": [{ "id": "edit", "label": "Edit" }] }
]
```

---

## Event wiring

```js
// FacetWorkbench → DataTable
const wb = new Maranello.FacetWorkbench(filterEl, {
  facets,
  onFilterChange: (filters) => table.setData(applyFilters(allData, filters))
});

// DataTable drilldown → EntityWorkbench
Maranello.onDrillDown((row) => {
  editor.pushEntity(detailSchema, row);
});

// PanelOrchestrator custom events (dispatched on document)
// 'mn:panel-opened'  — { detail: { viewId, placement } }
// 'mn:panel-closed'  — { detail: { viewId } }
// 'mn:panel-moved'   — { detail: { viewId, from, to } }
document.addEventListener('mn:panel-opened', ({ detail }) => {
  console.log(`${detail.viewId} opened in ${detail.placement}`);
});

// NavigationModel → consumer router
const unsubscribe = nav.onNavigate((entry, action) => {
  if (action === 'push') router.push(`/${entry.viewId}`);
  if (action === 'pop')  router.back();
});
```
