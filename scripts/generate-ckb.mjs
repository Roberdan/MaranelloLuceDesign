#!/usr/bin/env node
/**
 * generate-ckb.mjs — Generates the Component Knowledge Base from source.
 * Run: node scripts/generate-ckb.mjs
 * Output: packages/elements/dist/knowledge/ckb.json
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { workflowTemplates } from './ckb-workflow-templates.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const ELEMENTS = join(ROOT, 'packages/elements');
const WC_DIR = join(ELEMENTS, 'src/wc');
const TS_DIR = join(ELEMENTS, 'src/ts');
const OUT_DIR = join(ELEMENTS, 'dist/knowledge');
const PKG_JSON = join(ELEMENTS, 'package.json');
const KNOWLEDGE_SRC = join(ELEMENTS, 'src/knowledge');

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function read(path) {
  return readFileSync(path, 'utf8');
}

function extractObservedAttributes(source) {
  const match = source.match(
    /static\s+get\s+observedAttributes\s*\(\s*\)\s*\{\s*return\s+\[([^\]]*)\]/s
  );
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
}

function extractEvents(source) {
  const events = [];
  const seen = new Set();
  for (const m of source.matchAll(
    /new\s+CustomEvent\s*\(\s*['"]([^'"]+)['"]/g
  )) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      events.push({ name: m[1], bubbles: true });
    }
  }
  for (const m of source.matchAll(
    /dispatchEvent\s*\(\s*new\s+Event\s*\(\s*['"]([^'"]+)['"]/g
  )) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      events.push({ name: m[1], bubbles: false });
    }
  }
  return events;
}

function extractImports(source) {
  const imports = [];
  for (const m of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    if (m[1].startsWith('../ts/') || m[1].startsWith('./')) {
      imports.push(m[1]);
    }
  }
  return imports;
}

function inferAttrType(name) {
  if (['value', 'max', 'min', 'zoom', 'size', 'poll-interval',
       'duration', 'page-size', 'min-chars', 'debounce',
       'label-width'].includes(name)) return 'number';
  if (['open', 'selectable', 'compact', 'animate',
       'editable', 'show-conversion'].includes(name)) return 'boolean';
  if (['data', 'columns', 'tasks', 'markers', 'services',
       'items', 'stages', 'sections', 'objectives', 'options',
       'cards', 'phases', 'quick-actions', 'center',
       'disabled-dates', 'modes'].includes(name)) return 'json';
  return 'string';
}

/* ------------------------------------------------------------------ */
/*  WC Descriptions + bestFor mapping (curated knowledge)              */
/* ------------------------------------------------------------------ */

const WC_META = {
  'mn-a11y':              { desc: 'Accessibility FAB panel — settings for motion, contrast, font size', bestFor: ['accessibility settings', 'a11y compliance'] },
  'mn-async-select':      { desc: 'Async search dropdown — debounced search with provider-driven results', bestFor: ['search dropdowns', 'entity lookup', 'autocomplete'] },
  'mn-chart':             { desc: 'Multi-type chart — sparkline, area, bar, donut, radar, bubble', bestFor: ['data visualization', 'trends', 'KPI charts', 'time series'] },
  'mn-chat':              { desc: 'AI chat interface — streaming messages, quick actions, voice input', bestFor: ['AI chat', 'conversational UI', 'LLM interaction', 'SSE streaming'] },
  'mn-command-palette':   { desc: 'Command palette — fuzzy search, keyboard navigation, action dispatch', bestFor: ['quick actions', 'keyboard navigation', 'search commands'] },
  'mn-customer-journey':  { desc: 'Customer journey map — phases with engagements, connectors, selection', bestFor: ['journey visualization', 'pipeline stages', 'process flows'] },
  'mn-dashboard':         { desc: 'Schema-driven dashboard — rows/columns of widgets with auto loading states', bestFor: ['dashboards', 'KPI grids', 'monitoring views'] },
  'mn-data-table':        { desc: 'Sortable filterable data table — pagination, grouping, cell types', bestFor: ['data lists', 'CRUD tables', 'sortable records', 'admin views'] },
  'mn-date-picker':       { desc: 'Date picker — calendar popup with min/max and disabled dates', bestFor: ['date input', 'form fields', 'date range selection'] },
  'mn-detail-panel':      { desc: 'Slide-out detail panel — tabs, sections, fields, edit mode', bestFor: ['entity details', 'record editing', 'side panel CRUD'] },
  'mn-entity-workbench':  { desc: 'Entity editor — tabbed form with sections, fields, validation, save', bestFor: ['entity CRUD', 'complex forms', 'record editing'] },
  'mn-facet-workbench':   { desc: 'Multi-facet filter panel — select, multi-select, search, date-range', bestFor: ['data filtering', 'faceted search', 'filter bars'] },
  'mn-ferrari-control':   { desc: 'Ferrari-style controls — manettino, rotary, lever, toggle', bestFor: ['mode selection', 'settings dials', 'branded controls'] },
  'mn-funnel':            { desc: 'Funnel/pipeline chart — stages with counts, conversion rates', bestFor: ['sales funnels', 'conversion pipelines', 'stage progression'] },
  'mn-gantt':             { desc: 'Gantt timeline — tasks with hierarchy, zoom, scroll-to-today', bestFor: ['project timelines', 'task scheduling', 'plan visualization'] },
  'mn-gauge':             { desc: 'Ferrari-style gauge — value/max with arc, redline, complications', bestFor: ['KPI display', 'utilization meters', 'progress indicators', 'real-time monitoring'] },
  'mn-hbar':              { desc: 'Horizontal bar chart — sorted bars with tooltips and axis', bestFor: ['ranked comparisons', 'distribution charts', 'category bars'] },
  'mn-header-shell':      { desc: 'App header shell — brand, navigation, search, filters, theme, profile', bestFor: ['app headers', 'navigation bars', 'search + filter bars'] },
  'mn-kanban-board':      { desc: 'Kanban board — columns with draggable cards, move callbacks', bestFor: ['task boards', 'workflow management', 'drag-drop organization'] },
  'mn-map':               { desc: 'Geographic map — markers with clustering and click events', bestFor: ['location display', 'geographic data', 'marker maps'] },
  'mn-mapbox':            { desc: 'Mapbox-powered map — advanced styling, projections, stages overlay', bestFor: ['detailed maps', 'custom map styles', 'geographic analysis'] },
  'mn-modal':             { desc: 'Modal dialog — title, content slot, close events', bestFor: ['confirmations', 'forms in dialogs', 'detail overlays'] },
  'mn-okr':               { desc: 'OKR panel — objectives with key results, progress, scoping', bestFor: ['OKR tracking', 'goal management', 'progress hierarchies'] },
  'mn-profile':           { desc: 'Profile menu — name, email, avatar, section-based dropdown', bestFor: ['user profile', 'account menu', 'settings access'] },
  'mn-section-nav':       { desc: 'Section navigation — vertical/horizontal nav with active state', bestFor: ['page sections', 'anchor navigation', 'table of contents'] },
  'mn-speedometer':       { desc: 'Speedometer gauge — needle, arc, ticks, bar mode', bestFor: ['speed/rate display', 'performance meters', 'real-time values'] },
  'mn-system-status':     { desc: 'System status panel — services with health checks, polling', bestFor: ['system monitoring', 'service health', 'infrastructure status'] },
  'mn-tab':               { desc: 'Tab item — label for use inside mn-tabs', bestFor: ['tabbed content'] },
  'mn-tabs':              { desc: 'Tab container — manages tab switching with active state', bestFor: ['tabbed views', 'content sections', 'view switching'] },
  'mn-theme-rotary':      { desc: 'Theme rotary selector — Ferrari-style dial for theme switching', bestFor: ['theme switching', 'settings'] },
  'mn-theme-toggle':      { desc: 'Theme toggle — cycle or select themes with persistence', bestFor: ['theme switching', 'dark/light mode'] },
  'mn-toast':             { desc: 'Toast notification — success/error/warning/info with auto-dismiss', bestFor: ['notifications', 'alerts', 'feedback messages'] },
};

/* ------------------------------------------------------------------ */
/*  Parse Web Components                                               */
/* ------------------------------------------------------------------ */

function parseWebComponents() {
  const EXCLUDE = ['mn-a11y-fallback.js']; // helper, not a registered WC
  const files = readdirSync(WC_DIR)
    .filter(f => f.startsWith('mn-') && f.endsWith('.js') && !EXCLUDE.includes(f));

  return files.map(file => {
    const source = read(join(WC_DIR, file));
    const tag = file.replace('.js', '');
    const attrs = extractObservedAttributes(source);
    const events = extractEvents(source);
    const imports = extractImports(source);
    const meta = WC_META[tag] || { desc: tag, bestFor: [] };

    return {
      tag,
      sourceFile: `src/wc/${file}`,
      description: meta.desc,
      attributes: attrs.map(a => ({
        name: a,
        type: inferAttrType(a),
      })),
      events,
      imports,
      bestFor: meta.bestFor,
      ssrSafe: false,
      themeAware: true,
      importPath: `@convergio/design-elements/wc/${tag}`,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Parse TS module exports (from index.ts barrel)                     */
/* ------------------------------------------------------------------ */

function parseTsModules() {
  const indexSrc = read(join(TS_DIR, 'index.ts'));
  const modules = {};

  // Extract explicit named exports: export { name } from './module'
  for (const m of indexSrc.matchAll(
    /export\s*\{([^}]+)\}\s*from\s+['"]\.\/([^'"]+)['"]/g
  )) {
    const names = m[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    const mod = m[2];
    if (!modules[mod]) {
      modules[mod] = {
        sourceFile: `src/ts/${mod}.ts`,
        description: '',
        exports: {},
        importPath: '@convergio/design-elements',
      };
    }
    for (const name of names) {
      const isType = /^[A-Z]/.test(name) && !['FerrariGauge', 'EventBus', 'Maranello', 'GAUGE_SIZES'].includes(name);
      modules[mod].exports[name] = {
        kind: isType ? 'type' : 'function',
      };
    }
  }

  // Extract star re-exports: export * from './module'
  for (const m of indexSrc.matchAll(
    /export\s+\*\s+from\s+['"]\.\/([^'"]+)['"]/g
  )) {
    const mod = m[1];
    if (!modules[mod]) {
      modules[mod] = {
        sourceFile: `src/ts/${mod}.ts`,
        description: `Re-exported types/utilities from ${mod}`,
        exports: { '*': { kind: 'type', description: 'All exports (star re-export)' } },
        importPath: '@convergio/design-elements',
      };
    }
  }

  return modules;
}

/* ------------------------------------------------------------------ */
/*  Composition Rules (curated knowledge)                              */
/* ------------------------------------------------------------------ */

function compositionRules() {
  return [
    {
      id: 'filterable-table',
      pattern: 'Filterable Data Table',
      description: 'FacetWorkbench for filters + DataTable for data display. Filters drive table data via onFilterChange callback.',
      components: ['mn-facet-workbench', 'mn-data-table'],
      layout: 'stacked (filters above table)',
      apiPattern: 'GET /items with query params for filtering',
      example: 'const facets = new FacetWorkbench(el, { facets, onFilterChange: filters => table.setData(apply(data, filters)) });',
    },
    {
      id: 'crud-entity',
      pattern: 'CRUD Entity Editor',
      description: 'DataTable for list view + EntityWorkbench/DetailPanel for edit. Row click opens editor.',
      components: ['mn-data-table', 'mn-entity-workbench', 'mn-detail-panel'],
      layout: 'side-detail or modal',
      apiPattern: 'GET /items (list) + GET /items/:id (detail) + PUT/POST',
      example: 'table.onRowClick = (row) => editor.pushEntity(schema, row);',
    },
    {
      id: 'kpi-dashboard',
      pattern: 'KPI Dashboard',
      description: 'DashboardRenderer with gauge, chart, and kpi-strip widgets. Each widget auto-handles loading/error states.',
      components: ['mn-dashboard', 'mn-gauge', 'mn-chart'],
      layout: '4-slot grid (createLayout)',
      apiPattern: 'GET /overview or /metrics returning numeric KPIs',
      example: 'const dash = new DashboardRenderer(el, { schema }); dash.setData("kpis", data);',
    },
    {
      id: 'ai-chat',
      pattern: 'AI Chat Interface',
      description: 'mn-chat for the chat UI + streamingText for LLM output. Connects to POST endpoint with SSE streaming.',
      components: ['mn-chat'],
      layout: 'full page or side panel',
      apiPattern: 'POST /chat/message + SSE stream for response',
      example: '<mn-chat title="Assistant" welcome-message="Hello!"></mn-chat>',
    },
    {
      id: 'kanban-workflow',
      pattern: 'Kanban Workflow Board',
      description: 'mn-kanban-board for task management with drag-drop. Columns represent states, cards represent items.',
      components: ['mn-kanban-board'],
      layout: 'full width',
      apiPattern: 'GET /tasks (with status field) + POST /tasks/update (move)',
      example: 'kanbanBoard(el, { columns, cards, onMove: (id, col) => api.update(id, { status: col }) });',
    },
    {
      id: 'monitoring-strip',
      pattern: 'Monitoring Dashboard Strip',
      description: 'dashboardStrip with gauge, pipeline, trend, and board zones for real-time monitoring.',
      components: ['mn-gauge', 'mn-chart'],
      layout: 'strip (horizontal band)',
      apiPattern: 'GET /health + GET /metrics (polled)',
      example: 'dashboardStrip(el, { zones: [{ type: "gauge", ... }, { type: "trend", ... }] });',
    },
    {
      id: 'app-shell',
      pattern: 'Application Shell',
      description: 'mn-header-shell for navigation + createLayout for 4-slot grid + mn-theme-toggle for theme switching.',
      components: ['mn-header-shell', 'mn-theme-toggle'],
      layout: '4-slot grid',
      apiPattern: 'App-wide, no specific API',
      example: 'headerShell(el, { sections: [{ type: "brand" }, { type: "search" }, { type: "theme" }] });',
      prerequisites: ['@convergio/design-tokens/css', '@convergio/design-elements/css'],
    },
    {
      id: 'cost-tracking',
      pattern: 'AI Cost & Token Tracking',
      description: 'tokenMeter for budget + agentCostBreakdown for per-agent costs + costTimeline for trends.',
      components: ['mn-chart'],
      layout: 'dashboard grid',
      apiPattern: 'GET /metrics/cost returning cost breakdowns by model/date/project',
      example: 'tokenMeter(el, { used: 847200, total: 1000000 }); agentCostBreakdown(el, rows);',
    },
    {
      id: 'network-topology',
      pattern: 'Network Topology Graph',
      description: 'neuralNodes for force-directed graph visualization of nodes and connections.',
      components: ['mn-chart'],
      layout: 'full width canvas',
      apiPattern: 'GET /topology returning { nodes[], edges[] }',
      example: 'neuralNodes(canvas, { nodes, connections, onClick: (node) => showDetail(node) });',
    },
    {
      id: 'timeline-planning',
      pattern: 'Timeline / Project Planning',
      description: 'mn-gantt for task timelines with hierarchy, zoom, and scroll-to-today.',
      components: ['mn-gantt'],
      layout: 'full width',
      apiPattern: 'GET /plans or /tasks returning items with start/end dates',
      example: '<mn-gantt tasks=\'[{"id":1,"label":"Deploy","start":"2026-01","end":"2026-02"}]\'></mn-gantt>',
    },
    {
      id: 'system-health',
      pattern: 'System Health Monitor',
      description: 'mn-system-status for service health + toast for alerts. Polls services automatically.',
      components: ['mn-system-status', 'mn-toast'],
      layout: 'side panel or dedicated page',
      apiPattern: 'GET /health returning service statuses',
      example: '<mn-system-status services=\'[...]\' poll-interval="30"></mn-system-status>',
    },
    {
      id: 'geographic-data',
      pattern: 'Geographic Data Display',
      description: 'mn-map or mn-mapbox for location-based data with markers and click events.',
      components: ['mn-map', 'mn-mapbox'],
      layout: 'full width or split with detail',
      apiPattern: 'GET /items returning objects with lat/lon fields',
      example: '<mn-map markers=\'[{"id":"1","lat":45.46,"lon":9.19,"label":"Milan"}]\'></mn-map>',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Mapping Hints (curated knowledge)                                  */
/* ------------------------------------------------------------------ */

function mappingHints() {
  return [
    {
      id: 'list-to-table',
      apiPattern: 'GET endpoint returning array of objects with consistent keys',
      httpMethod: 'GET',
      responseShape: '{ items: Array<{ id, [key: string]: any }> } or Array<{...}>',
      suggestedComponent: 'mn-data-table',
      alternativeComponents: ['mn-kanban-board', 'mn-gantt'],
      updateStrategy: 'poll',
      dataTransform: 'Map array items to rows, object keys to column definitions',
    },
    {
      id: 'single-to-detail',
      apiPattern: 'GET endpoint returning single object with nested fields',
      httpMethod: 'GET',
      responseShape: '{ id, name, status, ...fields }',
      suggestedComponent: 'mn-detail-panel',
      alternativeComponents: ['mn-entity-workbench'],
      updateStrategy: 'static',
      dataTransform: 'Map object fields to DetailField[] with appropriate types',
    },
    {
      id: 'numeric-kpis',
      apiPattern: 'GET endpoint returning numeric summary values',
      httpMethod: 'GET',
      responseShape: '{ total: number, active: number, cost: number, ... }',
      suggestedComponent: 'mn-gauge',
      alternativeComponents: ['mn-chart', 'mn-dashboard'],
      updateStrategy: 'poll',
      compositionRule: 'kpi-dashboard',
      dataTransform: 'Each numeric field becomes a gauge or KPI card',
    },
    {
      id: 'time-series',
      apiPattern: 'GET endpoint returning arrays of values over time',
      httpMethod: 'GET',
      responseShape: '{ labels: string[], values: number[] } or { by_date: Array<{ date, value }> }',
      suggestedComponent: 'mn-chart',
      updateStrategy: 'poll',
      dataTransform: 'Map to sparkline data array or area chart datasets',
    },
    {
      id: 'streaming-chat',
      apiPattern: 'POST endpoint with SSE/streaming response for AI/LLM chat',
      httpMethod: 'SSE',
      responseShape: 'Stream of { content: string, done?: boolean }',
      suggestedComponent: 'mn-chat',
      updateStrategy: 'sse',
      compositionRule: 'ai-chat',
      dataTransform: 'Accumulate streamed tokens into message bubbles',
    },
    {
      id: 'task-statuses',
      apiPattern: 'GET endpoint returning items with status field (todo/doing/done)',
      httpMethod: 'GET',
      responseShape: '{ items: Array<{ id, title, status, ... }> }',
      suggestedComponent: 'mn-kanban-board',
      alternativeComponents: ['mn-data-table', 'mn-gantt'],
      updateStrategy: 'poll',
      compositionRule: 'kanban-workflow',
      dataTransform: 'Group items by status into columns, each item becomes a card',
    },
    {
      id: 'health-check',
      apiPattern: 'GET endpoint returning service health statuses',
      httpMethod: 'GET',
      responseShape: '{ ok: boolean, services?: Array<{ name, status }>, version?, uptime? }',
      suggestedComponent: 'mn-system-status',
      updateStrategy: 'poll',
      compositionRule: 'system-health',
      dataTransform: 'Map to SystemStatusService[] array',
    },
    {
      id: 'topology-graph',
      apiPattern: 'GET endpoint returning nodes and edges/connections',
      httpMethod: 'GET',
      responseShape: '{ nodes: Array<{ id, label }>, edges: Array<{ source, target }> }',
      suggestedComponent: 'neuralNodes',
      alternativeComponents: ['socialGraph'],
      updateStrategy: 'websocket',
      compositionRule: 'network-topology',
      dataTransform: 'Map to NeuralNodeData[] and NeuralConnection[]',
    },
    {
      id: 'date-range-items',
      apiPattern: 'GET endpoint returning items with start/end dates',
      httpMethod: 'GET',
      responseShape: '{ items: Array<{ id, title, start: ISO, end: ISO, children? }> }',
      suggestedComponent: 'mn-gantt',
      updateStrategy: 'static',
      compositionRule: 'timeline-planning',
      dataTransform: 'Map to GanttTask[] with ISO date strings',
    },
    {
      id: 'cost-breakdown',
      apiPattern: 'GET endpoint returning cost/token metrics by category',
      httpMethod: 'GET',
      responseShape: '{ by_model: Array<{ model, cost, tokens }>, by_date: Array<{ date, cost }> }',
      suggestedComponent: 'agentCostBreakdown',
      alternativeComponents: ['costTimeline', 'tokenMeter'],
      updateStrategy: 'poll',
      compositionRule: 'cost-tracking',
      dataTransform: 'Map by_model to breakdown rows, by_date to timeline series',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Themes                                                             */
/* ------------------------------------------------------------------ */

function themes() {
  return [
    { id: 'editorial', bodyClass: '', accent: '#FFC72C', surface: '#111111', variant: 'dark', description: 'Default dark dashboard' },
    { id: 'nero', bodyClass: 'mn-nero', accent: '#FFC72C', surface: '#050505', variant: 'dark', description: 'Pure dark, high contrast' },
    { id: 'avorio', bodyClass: 'mn-avorio', accent: '#DC0000', surface: '#FAF3E6', variant: 'light', description: 'Warm ivory light' },
    { id: 'colorblind', bodyClass: 'mn-colorblind', accent: '#0072B2', surface: '#111111', variant: 'dark', description: 'Okabe-Ito safe palette' },
    { id: 'sugar', bodyClass: 'mn-sugar', accent: '#000000', surface: '#E4E4E8', variant: 'light', description: 'Cool gray, rounded corners' },
    { id: 'navy', bodyClass: 'mn-navy', accent: '#FFC72C', surface: '#0d2045', variant: 'dark', description: 'Deep blue dark dashboard' },
  ];
}

/* ------------------------------------------------------------------ */
/*  Constraints                                                        */
/* ------------------------------------------------------------------ */

function constraints() {
  return {
    safari: [
      'No structuredClone — use JSON.parse(JSON.stringify())',
      'No Object.hasOwn — use Object.prototype.hasOwnProperty.call()',
      'No Array.at() — use bracket notation',
      'No String.replaceAll() — use split().join() or regex',
      'No classList.toggle(name, force) — use add/remove',
      'No querySelector("#id") for slots — use getElementById()',
    ],
    tokens: 'Components use ONLY semantic tokens (--mn-text, --mn-surface, --mn-accent). NEVER primitives.',
    wcag: 'WCAG 2.2 AA: 4.5:1 text contrast, 3:1 UI, 24px touch targets, focus ring, prefers-reduced-motion',
    maxFileLines: 250,
    cssLayers: true,
    noInnerHTML: true,
    ssrRequirements: 'All JS/WC APIs require DOM. For SSR frameworks: CSS imports work, JS must be client-only (use client, onMount, dynamic import with ssr: false).',
  };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function main() {
  const pkg = JSON.parse(read(PKG_JSON));
  const wcs = parseWebComponents();
  const tsModules = parseTsModules();

  const ckb = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    packageVersion: pkg.version,
    webComponents: wcs,
    tsModules,
    compositionRules: compositionRules(),
    mappingHints: mappingHints(),
    workflowTemplates: workflowTemplates(),
    themes: themes(),
    constraints: constraints(),
  };

  // Validate coverage
  const wcFiles = readdirSync(WC_DIR)
    .filter(f => f.startsWith('mn-') && f.endsWith('.js') && !['mn-a11y-fallback.js'].includes(f));
  const coveredTags = new Set(wcs.map(w => w.tag));
  const missing = wcFiles
    .map(f => f.replace('.js', ''))
    .filter(tag => !coveredTags.has(tag));

  if (missing.length > 0) {
    console.error(`CKB VALIDATION FAILED: Missing WC coverage for: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, 'ckb.json');
  writeFileSync(outPath, JSON.stringify(ckb, null, 2));
  const semanticFiles = [
    'component-semantic-recipes.json',
    'template-semantic-recipes.json',
  ];
  semanticFiles.forEach((file) => {
    const source = join(KNOWLEDGE_SRC, file);
    if (existsSync(source)) {
      writeFileSync(join(OUT_DIR, file), read(source));
    }
  });

  console.log(`CKB generated: ${outPath}`);
  console.log(`  Web Components: ${wcs.length}`);
  console.log(`  TS Modules: ${Object.keys(tsModules).length}`);
  console.log(`  Composition Rules: ${ckb.compositionRules.length}`);
  console.log(`  Mapping Hints: ${ckb.mappingHints.length}`);
  console.log(`  Workflow Templates: ${ckb.workflowTemplates.length}`);
  console.log(`  Themes: ${ckb.themes.length}`);
}

main();
