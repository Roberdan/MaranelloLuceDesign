# Maranello v4.17.0 — Migration Guide for Consumer Apps

> **TL;DR**: Niente si rompe. v4.17.0 è 100% backward-compatible.
> Però ora puoi (e dovresti) smettere di scrivere layout/DOM manualmente e usare il Presentation Runtime.

---

## Cosa cambia per te

### Nessun breaking change

Tutte le API che usi oggi funzionano identiche. I tuoi `Maranello.dataTable()`, `Maranello.sparkline()`, `Maranello.openDetailPanel()`, `<mn-gauge>`, `<mn-chart>` etc. sono intatti.

### Cosa c'è di nuovo

Maranello ora è un **presentation runtime**: gli passi uno schema JSON e lui renderizza e orchestra l'intera UI. Tu possiedi solo dati, logica di business, permessi, e routing.

---

## Le 3 regole d'oro (da ora in poi)

| # | Regola | Perché |
|---|--------|--------|
| 1 | **Non creare layout con createElement** | Usa `AppShellController` + `PanelOrchestrator` |
| 2 | **Non scrivere CSS di layout custom** | Usa i 6 layout mode di AppShell |
| 3 | **Non gestire stati loading/error manualmente** | Usa `StateScaffold` o `DashboardRenderer` (lo fa automaticamente) |

---

## Priorità di migrazione

### P0 — Fai subito (massimo valore, minimo sforzo)

#### 1. Sostituisci gli stati loading/error fatti a mano

**Prima (v4.16):**
```js
container.innerHTML = '<div class="spinner"></div>';
try {
  const data = await fetch('/api/data').then(r => r.json());
  container.innerHTML = '';
  renderMyContent(container, data);
} catch (e) {
  container.innerHTML = `<div class="error">${e.message}<button onclick="retry()">Retry</button></div>`;
}
```

**Dopo (v4.17):**
```js
const scaffold = new Maranello.StateScaffold(container, {
  state: 'loading', message: 'Caricamento...'
});
try {
  const data = await fetch('/api/data').then(r => r.json());
  scaffold.setState(data.length ? 'partial' : 'empty');
  renderMyContent(container, data);
} catch (e) {
  scaffold.setState('error', e.message);
  // retry button incluso automaticamente
}
```

**O con Web Component:**
```html
<mn-state-scaffold state="loading" message="Caricamento..."></mn-state-scaffold>
```

#### 2. Usa le nuove colonne DataTable v2

**Prima:** colonna custom con `render` callback per mostrare avatar+nome, progress bar, trend:
```js
columns: [
  { key: 'user', label: 'User', type: 'custom', render: (val) => 
    `<div class="my-user-cell"><img src="${val.avatar}"/><span>${val.name}</span></div>` },
  { key: 'progress', label: 'Progress', type: 'custom', render: (val) =>
    `<div class="my-progress"><div style="width:${val}%"></div></div>` },
]
```

**Dopo:** tipi built-in, zero HTML custom:
```js
columns: [
  { key: 'user', label: 'User', type: 'person' },
  { key: 'progress', label: 'Progress', type: 'progress' },
  { key: 'revenue', label: 'Revenue', type: 'metric' },    // valore + trend arrow
  { key: 'actions', label: '', type: 'action', actions: [
    { label: 'Edit', onClick: 'edit' },
    { label: 'Delete', onClick: 'delete' }
  ]},
]
```

Nuovi tipi disponibili: `metric`, `person`, `progress`, `action`, `link`, `icon`.

#### 3. Usa AsyncSelect per le ricerche async

**Prima:** person field custom con fetch + dropdown manuale:
```js
input.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const results = await searchUsers(input.value);
    dropdown.innerHTML = results.map(u => `<div onclick="select('${u.id}')">${u.name}</div>`).join('');
  }, 300);
});
```

**Dopo:**
```js
const select = new Maranello.AsyncSelect(container, {
  provider: { search: (q) => searchUsers(q), getLabel: u => u.name, getId: u => u.id },
  onSelect: (user) => handleSelection(user),
  placeholder: 'Cerca utente...'
});
```
Keyboard nav, ARIA combobox, debounce, loading spinner — tutto incluso.

---

### P1 — Fai nel prossimo sprint (ristrutturazione layout)

#### 4. Sostituisci il layout custom con AppShell

**Prima:** layout a mano nel consumer:
```html
<div class="my-app">
  <nav class="my-sidebar">...</nav>
  <div class="my-toolbar">...</div>
  <div class="my-main">...</div>
  <div class="my-detail-panel" style="display:none">...</div>
</div>
```
```css
.my-app { display: grid; grid-template-columns: 250px 1fr 350px; }
.my-sidebar { ... }
/* 50+ righe di layout CSS custom per ogni app */
```

**Dopo:**
```html
<mn-app-shell layout="side-detail">
  <nav slot="nav">...</nav>
  <div slot="toolbar">...</div>
  <div slot="main">...</div>
  <div slot="detail">...</div>
</mn-app-shell>
```
```js
const shell = new Maranello.AppShellController(document.getElementById('app'), {
  layout: 'side-detail'
});
// Cambia layout senza riscrivere CSS:
shell.setLayout('split');      // main + secondary affiancati
shell.setLayout('full');       // solo main
shell.setLayout('docked-bottom'); // main + bottom panel
```

**Layout mode disponibili:** `full`, `split`, `stacked`, `docked-bottom`, `dual-panel`, `side-detail`

#### 5. Registra le view invece di montarle a mano

**Prima:** switch/case nel router del consumer:
```js
router.on('/dashboard', () => {
  clearMain();
  const container = document.createElement('div');
  container.className = 'dashboard-layout';
  // 30 righe di createElement per comporre la dashboard...
  mainArea.appendChild(container);
});
router.on('/team', () => {
  clearMain();
  // altre 40 righe di createElement...
});
```

**Dopo:**
```js
const registry = Maranello.ViewRegistry.getInstance();
const nav = new Maranello.NavigationModel();
const orch = new Maranello.PanelOrchestrator(registry, nav);

// Registra una volta
registry.register({
  id: 'dashboard', title: 'Dashboard', defaultPlacement: 'page',
  factory: (el, data) => new Maranello.DashboardRenderer(el, { schema: dashSchema, data })
});
registry.register({
  id: 'team', title: 'Team', defaultPlacement: 'page',
  factory: (el) => Maranello.dataTable(el, { columns: teamCols, data: teamData })
});

// Nel router:
router.on('/dashboard', () => orch.open('dashboard', 'page', dashboardData));
router.on('/team', () => orch.open('team'));

// Spostare una view da page a panel? Una riga:
orch.move('team', 'side-panel');
```

#### 6. Usa FacetWorkbench per i filtri

**Prima:** filtri custom per ogni pagina:
```js
const departmentFilter = createDropdown('Department', departments);
const statusFilter = createCheckboxGroup('Status', statuses);
const searchInput = createSearchInput();
// event listener per ognuno, logica di combinazione, chip rendering...
```

**Dopo:**
```js
const facets = new Maranello.FacetWorkbench(filterContainer, {
  facets: [
    { id: 'dept', label: 'Department', type: 'multi-select',
      dataProvider: () => fetch('/api/departments').then(r => r.json()) },
    { id: 'status', label: 'Status', type: 'select',
      dataProvider: () => Promise.resolve([
        { id: 'active', label: 'Active' }, { id: 'leave', label: 'On Leave' }
      ])},
    { id: 'q', label: 'Search', type: 'search',
      dataProvider: () => Promise.resolve([]) },
    { id: 'remote', label: 'Remote', type: 'boolean' },
  ],
  onFilterChange: (filters) => {
    const filtered = applyFilters(allData, filters);
    table.setData(filtered);
  }
});
// Chip, preset save/load, keyboard nav, mutual exclusion — tutto incluso
```

---

### P2 — Fai quando ristrutturi un modulo (entity editing)

#### 7. Usa EntityWorkbench per i form di edit

**Prima:** form HTML custom per ogni entità:
```html
<form class="employee-form">
  <div class="form-section">
    <label>Name</label><input name="name" required>
    <label>Department</label><select name="dept">...</select>
    <!-- 80 righe di form HTML per ogni tipo di entità -->
  </div>
  <div class="tabs"><!-- tab switching manuale --></div>
</form>
```

**Dopo:**
```js
const editor = new Maranello.EntityWorkbench(container, {
  schema: {
    tabs: [
      { id: 'profile', label: 'Profile', sections: [
        { fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'dept', label: 'Department', type: 'select', 
            options: { items: ['Engineering', 'Design', 'Sales'] } },
          { key: 'manager', label: 'Manager', type: 'async-select',
            provider: { search: (q) => searchManagers(q), getLabel: m => m.name } }
        ]}
      ]},
      { id: 'notes', label: 'Notes', sections: [
        { fields: [
          { key: 'bio', label: 'Bio', type: 'textarea' }
        ]}
      ]}
    ]
  },
  data: employeeRecord,
  onSave: (modified) => api.patch(`/employees/${id}`, modified),
  onClose: () => orch.close('employee-edit')
});
// Dirty tracking, validation, tab switching, back-stack — tutto incluso
```

#### 8. Usa DashboardRenderer per le dashboard

**Prima:**
```js
// 100+ righe di createElement per comporre una dashboard
const kpiStrip = document.createElement('div');
kpiStrip.className = 'kpi-strip';
metrics.forEach(m => {
  const card = document.createElement('div');
  card.innerHTML = `<span class="value">${m.value}</span><span class="label">${m.label}</span>`;
  kpiStrip.appendChild(card);
});
mainArea.appendChild(kpiStrip);

const chartRow = document.createElement('div');
chartRow.style.display = 'grid';
chartRow.style.gridTemplateColumns = '1fr 1fr';
// ... canvas creation, chart rendering, gauge creation...
```

**Dopo:**
```js
const dashboard = new Maranello.DashboardRenderer(container, {
  schema: {
    rows: [
      { columns: [
        { type: 'kpi-strip', dataKey: 'kpis', span: 12 }
      ]},
      { columns: [
        { type: 'chart', dataKey: 'sales', span: 6, options: { chartType: 'sparkline' } },
        { type: 'chart', dataKey: 'distribution', span: 6, options: { chartType: 'donut' } }
      ]},
      { columns: [
        { type: 'gauge', dataKey: 'serverLoad', span: 4 },
        { type: 'gauge', dataKey: 'apiLatency', span: 4 },
        { type: 'gauge', dataKey: 'errorRate', span: 4 }
      ]}
    ]
  }
});

// Bind data (StateScaffold automatico: null=loading, []=empty, Error=error)
dashboard.setData('kpis', await fetchKPIs());
dashboard.setData('sales', await fetchSalesHistory());
// Aggiorna un singolo widget senza re-render totale:
dashboard.setData('serverLoad', newCpuPercent);
```

---

## Checklist di migrazione per modulo

Per ogni modulo/pagina del tuo consumer app, verifica:

```
[ ] Layout usa AppShell (non CSS custom di layout)
[ ] View registrate in ViewRegistry (non createElement nel router)
[ ] Panel aperti via PanelOrchestrator (non toggle manuale di display)
[ ] Filtri via FacetWorkbench (non dropdown/checkbox custom per pagina)
[ ] Entity edit via EntityWorkbench (non form HTML per entità)
[ ] Dashboard via DashboardRenderer schema (non composizione manuale)
[ ] Stati loading/error via StateScaffold (non spinner/error HTML custom)
[ ] Ricerche async via AsyncSelect (non input+fetch+dropdown manuale)
[ ] DataTable usa tipi built-in (person, metric, progress, action, link, icon)
[ ] Zero createElement per UI di presentazione
[ ] Zero CSS inline (style="...") per layout
[ ] Zero CSS custom per struttura pagina
```

---

## Cosa NON migrare

| Tieni nel consumer | Perché |
|---|---|
| Chiamate API (fetch/axios) | Maranello non sa e non deve sapere le tue API |
| Business logic (calcoli, validazioni di dominio) | Non è un framework applicativo |
| Permessi/auth | Il consumer decide cosa mostrare |
| Router/URL | Maranello fornisce NavigationModel ma il consumer mappa URL↔viewId |
| Nomi di entità, label, messaggi | Il consumer possiede il vocabolario di dominio |
| Azioni (save, delete, approve) | Il consumer possiede i side-effect |

---

## Ordine di migrazione consigliato

```
1. StateScaffold (5 min per punto di loading/error)     ← massimo ROI
2. DataTable v2 column types (10 min per tabella)        ← elimina render custom
3. AsyncSelect (15 min per campo di ricerca)             ← elimina dropdown manuali
4. AppShell + layout (1h per app)                        ← elimina CSS layout custom
5. ViewRegistry + PanelOrchestrator (2h per app)         ← elimina routing DOM
6. FacetWorkbench (1h per pagina con filtri)             ← elimina filtri custom
7. DashboardRenderer (30min per dashboard)               ← elimina composizione manuale
8. EntityWorkbench (1h per tipo di entità)               ← elimina form HTML
```

---

## API Reference rapido

| Componente | IIFE | Web Component | Import |
|---|---|---|---|
| AppShell | `Maranello.AppShellController` | `<mn-app-shell>` | `import { AppShellController }` |
| ViewRegistry | `Maranello.ViewRegistry` | — | `import { ViewRegistry }` |
| PanelOrchestrator | `Maranello.PanelOrchestrator` | — | `import { PanelOrchestrator }` |
| FacetWorkbench | `Maranello.FacetWorkbench` | `<mn-facet-workbench>` | `import { FacetWorkbench }` |
| EntityWorkbench | `Maranello.EntityWorkbench` | `<mn-entity-workbench>` | `import { EntityWorkbench }` |
| DashboardRenderer | `Maranello.DashboardRenderer` | `<mn-dashboard>` | `import { DashboardRenderer }` |
| AsyncSelect | `Maranello.AsyncSelect` | `<mn-async-select>` | `import { AsyncSelect }` |
| StateScaffold | `Maranello.StateScaffold` | `<mn-state-scaffold>` | `import { StateScaffold }` |
| NavigationModel | `Maranello.NavigationModel` | — | `import { NavigationModel }` |

Docs completi: `docs/api-contracts-v4.md`
Ricette per agenti: `docs/agent-cookbook.md`
Demo interattive: `demo/runtime-*.html`
