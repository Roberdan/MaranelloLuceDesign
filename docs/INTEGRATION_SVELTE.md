# Svelte Integration

How to use Maranello Luce Design System with Svelte (4+) and SvelteKit.

## Install

```bash
npm install github:Roberdan/MaranelloLuceDesign#v3.0.0
```

## CSS @layer Import

v3.0.0 wraps all CSS in `@layer` blocks. Svelte component styles (scoped) win automatically.

```svelte
<script>
  // Full bundle
  import 'maranello-luce-design-business/css';

  // Or selective layers
  import 'maranello-luce-design-business/css/tokens.css';
  import 'maranello-luce-design-business/css/components.css';
</script>
```

## Layer 1: CSS-Only

Import CSS in your root layout. Svelte handles CSS natively.

### SvelteKit (`+layout.svelte`)

```svelte
<script>
  import 'maranello-luce-design-business/css';
</script>

<body class="mn-nero">
  <slot />
</body>
```

### Standalone Svelte (`App.svelte`)

```svelte
<script>
  import 'maranello-luce-design-business/css';
</script>

<section class="mn-section-dark">
  <h2 class="mn-title-section">Metrics</h2>
  <div class="mn-stat-card">
    <span class="mn-stat-value">{count}</span>
    <span class="mn-stat-label">Active</span>
  </div>
</section>
```

Selective imports:

```svelte
<script>
  import 'maranello-luce-design-business/css/tokens.css';
  import 'maranello-luce-design-business/css/base.css';
  import 'maranello-luce-design-business/css/components.css';
</script>
```

## Layer 2: Web Components

Svelte has native support for custom elements. Web Components work without any wrapper.

### Per-component ESM import (v3)

```svelte
<script>
  // Import only the WCs you use
  import 'maranello-luce-design-business/wc/mn-gauge';
  import 'maranello-luce-design-business/wc/mn-chart';
</script>
```

### Standalone WC without IIFE (CDN mode)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
<mn-gauge value="72" label="CPU" theme="nero"></mn-gauge>
```

```svelte
<script>
  import 'maranello-luce-design-business/wc';

  let gaugeValue = 72;
</script>

<mn-gauge value={gaugeValue} label="CPU Load" theme="nero"></mn-gauge>

<mn-chart type="donut" data={JSON.stringify(chartData)}></mn-chart>

<mn-data-table src="/api/data" sortable paginate></mn-data-table>

<mn-toast message="Saved" type="success" duration="3000"></mn-toast>
```

### Event handling

```svelte
<mn-gauge
  value={gaugeValue}
  label="RPM"
  on:value-change={(e) => console.log('New value:', e.detail)}
></mn-gauge>
```

### Dynamic updates

```svelte
<script>
  let value = 50;

  function increment() {
    value = Math.min(100, value + 10);
  }
</script>

<mn-gauge {value} label="Progress"></mn-gauge>
<button class="mn-btn mn-btn--primary" on:click={increment}>+10</button>
```

## Layer 3: Headless JS

Use `onMount` for Canvas/SVG rendering. Svelte's lifecycle matches well with imperative drawing.

### Charts

```svelte
<script>
  import { onMount } from 'svelte';
  import { charts } from 'maranello-luce-design-business/charts';

  let canvas;
  const data = [
    { label: 'Active', value: 45 },
    { label: 'Pending', value: 30 },
    { label: 'Done', value: 25 }
  ];

  onMount(() => {
    charts.renderDonut(canvas, data);
  });
</script>

<canvas bind:this={canvas} width="400" height="300"></canvas>
```

### Gantt timeline

```svelte
<script>
  import { onMount } from 'svelte';
  import { gantt } from 'maranello-luce-design-business/gantt';

  let container;
  export let tasks = [];

  onMount(() => {
    gantt.render(container, tasks, { palette: 'nero' });
  });
</script>

<div bind:this={container} style="width:100%; height:400px;"></div>
```

### Gauge with reactive updates

```svelte
<script>
  import { onMount } from 'svelte';
  import { gauge } from 'maranello-luce-design-business/gauge';

  let canvas;
  export let value = 0;
  let instance;

  onMount(() => {
    instance = gauge.create(canvas, { value, label: 'RPM' });
  });

  $: if (instance) {
    instance.update(value);
  }
</script>

<canvas bind:this={canvas} width="200" height="200"></canvas>
```

## Theme Switching

```svelte
<script>
  let theme = 'nero';

  function setTheme(t) {
    document.body.classList.remove('mn-nero', 'mn-avorio', 'mn-colorblind');
    if (t !== 'editorial') {
      document.body.classList.add(`mn-${t}`);
    }
    theme = t;
  }
</script>

<select value={theme} on:change={(e) => setTheme(e.target.value)}>
  <option value="editorial">Editorial</option>
  <option value="nero">Nero</option>
  <option value="avorio">Avorio</option>
  <option value="colorblind">Colorblind</option>
</select>
```

## SvelteKit SSR Notes

Web Components and Canvas require the browser. Guard with `onMount` or `browser` check:

```svelte
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let ready = false;
  onMount(() => { ready = true; });
</script>

{#if ready}
  <mn-gauge value="72" label="CPU"></mn-gauge>
{/if}
```
