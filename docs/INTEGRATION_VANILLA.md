# Vanilla JS Integration

How to use Maranello Luce Design System without any framework.

## Script Tag (IIFE)

The simplest approach. The IIFE bundle attaches everything to `window.M`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">
</head>
<body class="mn-nero">
  <canvas id="gauge" width="200" height="200"></canvas>
  <div id="chart"></div>

  <script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
  <script>
    // IIFE exposes window.M
    M.gauge.create(document.getElementById('gauge'), {
      value: 72,
      label: 'RPM'
    });

    M.charts.renderDonut(document.getElementById('chart'), [
      { label: 'Active', value: 45 },
      { label: 'Pending', value: 30 },
      { label: 'Done', value: 25 }
    ]);
  </script>
</body>
</html>
```

## ESM Import (Modern Browsers)

Use native ES modules with `type="module"` for tree-shaking.

```html
<script type="module">
  import { charts, gantt, gauge } from './node_modules/maranello-luce-design-business/dist/esm/index.js';

  gauge.create(document.querySelector('#gauge'), { value: 85 });
</script>
```

Or with an import map:

```html
<script type="importmap">
{
  "imports": {
    "maranello": "./node_modules/maranello-luce-design-business/dist/esm/index.js"
  }
}
</script>
<script type="module">
  import { charts } from 'maranello';
  charts.renderDonut(document.querySelector('#chart'), data);
</script>
```

## Web Components

Web Components work natively in the browser. Import the registration script and use the elements.

```html
<link rel="stylesheet" href="dist/css/index.css">
<script type="module" src="dist/esm/wc/index.js"></script>

<!-- Use declaratively -->
<mn-gauge value="72" label="CPU Load" theme="nero"></mn-gauge>

<mn-chart type="donut" data='[{"label":"A","value":30},{"label":"B","value":70}]'></mn-chart>

<mn-data-table src="/api/data" sortable paginate></mn-data-table>

<mn-toast message="Operation complete" type="success" duration="3000"></mn-toast>

<mn-theme-toggle></mn-theme-toggle>
```

Update Web Component attributes dynamically:

```js
const gauge = document.querySelector('mn-gauge');
gauge.setAttribute('value', '95');

// Or use the element's JS API if available
gauge.value = 95;
```

## CSS-Only Usage

No JavaScript needed for layout primitives, typography, forms, and static components.

```html
<link rel="stylesheet" href="dist/css/index.css">

<body class="mn-nero">
  <nav class="mn-nav">
    <span class="mn-nav-brand">My App</span>
  </nav>

  <section class="mn-section-dark">
    <h2 class="mn-title-section">Metrics</h2>
    <div class="mn-stat-card">
      <span class="mn-stat-value">142</span>
      <span class="mn-stat-label">Active</span>
    </div>
  </section>

  <div class="mn-table-wrap">
    <table class="mn-table">
      <thead><tr><th>Name</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td>Project Alpha</td><td><span class="mn-status mn-status--active">Active</span></td></tr>
      </tbody>
    </table>
  </div>
</body>
```

## CSS @layer Import

v3.0.0 uses CSS `@layer` for predictable cascade ordering. Import the full bundle or individual layers:

```html
<!-- Full bundle (all 11 layers) -->
<link rel="stylesheet" href="dist/css/index.css">

<!-- Or selective layers -->
<link rel="stylesheet" href="dist/css/tokens.css">
<link rel="stylesheet" href="dist/css/base.css">
<link rel="stylesheet" href="dist/css/components.css">
<link rel="stylesheet" href="dist/css/charts.css">
<link rel="stylesheet" href="dist/css/forms.css">
<link rel="stylesheet" href="dist/css/themes.css">
```

Consumer styles added without `@layer` automatically win over all system layers — no `!important` needed.

## Standalone Web Components (ESM, no IIFE)

Import only the WCs you need — no IIFE bundle required:

```html
<link rel="stylesheet" href="dist/css/index.css">

<script type="module">
  import 'maranello-luce-design-business/wc/mn-gauge';
  import 'maranello-luce-design-business/wc/mn-chart';
</script>

<mn-gauge value="72" label="CPU Load" theme="nero"></mn-gauge>
<mn-chart type="donut" data='[{"label":"A","value":30},{"label":"B","value":70}]'></mn-chart>
```

## Selective CSS Imports

Import only the CSS modules you need:

```html
<!-- Core tokens + base only -->
<link rel="stylesheet" href="dist/css/tokens.css">
<link rel="stylesheet" href="dist/css/base.css">

<!-- Add specific modules -->
<link rel="stylesheet" href="dist/css/components.css">
<link rel="stylesheet" href="dist/css/charts.css">
<link rel="stylesheet" href="dist/css/forms.css">
<link rel="stylesheet" href="dist/css/themes.css">
```

## Theme Switching

```js
// Toggle between themes
function setTheme(theme) {
  document.body.classList.remove('mn-nero', 'mn-avorio', 'mn-colorblind');
  if (theme !== 'editorial') {
    document.body.classList.add(`mn-${theme}`);
  }
}

// Or use the built-in theme toggle
import { initThemeToggle } from 'maranello-luce-design-business';
initThemeToggle();
```

## Event Handling

The design system uses a lightweight event bus for inter-component communication.

```js
// Listen for design system events
M.on('gauge:update', (data) => console.log('Gauge changed:', data));
M.on('chart:click', (data) => console.log('Chart clicked:', data));

// Emit custom events
M.emit('filter:change', { field: 'status', value: 'active' });
```

## Data Binding

Bind data sources to visual components for automatic updates.

```js
M.bindChart('#revenue-chart', '/api/revenue', {
  type: 'area',
  refreshInterval: 30000
});

M.updateGauge('#cpu-gauge', 85);
```
