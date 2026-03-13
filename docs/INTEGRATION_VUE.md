# Vue Integration

How to use Maranello Luce Design System with Vue 3.

## Install

```bash
npm install github:Roberdan/MaranelloLuceDesign#v3.0.0
```

## CSS @layer Import

v3.0.0 wraps all CSS in `@layer` blocks. Consumer styles added without `@layer` win automatically.

```ts
// main.ts — full bundle
import 'maranello-luce-design-business/css';

// Or selective layers
import 'maranello-luce-design-business/css/tokens.css';
import 'maranello-luce-design-business/css/base.css';
import 'maranello-luce-design-business/css/components.css';
```

## Layer 1: CSS-Only

```ts
// main.ts
import { createApp } from 'vue';
import 'maranello-luce-design-business/css';
import App from './App.vue';
createApp(App).mount('#app');
```

Use `mn-*` CSS classes directly in `<template>` — no wrappers needed.

## Layer 2: Web Components

Vue needs configuration to recognize `mn-*` elements as custom elements.

### Configure Vue compiler

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('mn-');

app.mount('#app');
```

### Vite config (alternative)

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('mn-')
        }
      }
    })
  ]
});
```

### Per-component ESM import (v3)

```ts
// Import individual WCs instead of the full bundle
import 'maranello-luce-design-business/wc/mn-gauge';
import 'maranello-luce-design-business/wc/mn-chart';
// or all WCs
import 'maranello-luce-design-business/wc';
```

### Standalone WC without IIFE (CDN mode)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/css/index.css">
<script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v3.0.0/dist/iife/maranello.min.js"></script>
<mn-gauge value="72" label="CPU" theme="nero"></mn-gauge>
```

### Usage in templates

```vue
<script setup lang="ts">
import 'maranello-luce-design-business/wc';
import { ref } from 'vue';

const gaugeValue = ref(72);
const chartData = ref([
  { label: 'Active', value: 45 },
  { label: 'Pending', value: 30 }
]);
</script>

<template>
  <mn-gauge :value="gaugeValue" label="CPU Load" theme="nero"></mn-gauge>

  <mn-chart type="donut" :data="JSON.stringify(chartData)"></mn-chart>

  <mn-data-table src="/api/data" sortable paginate></mn-data-table>

  <mn-toast message="Saved" type="success" duration="3000"></mn-toast>
</template>
```

### Event handling

```vue
<template>
  <mn-gauge
    :value="value"
    label="RPM"
    @value-change="onValueChange"
  ></mn-gauge>
</template>

<script setup lang="ts">
function onValueChange(e: CustomEvent) {
  console.log('New value:', e.detail);
}
</script>
```

## Layer 3: Headless JS

Use `onMounted` + template refs for Canvas/SVG rendering.

### Charts

```vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { charts } from 'maranello-luce-design-business/charts';

const canvasRef = ref<HTMLCanvasElement>();
const data = ref([
  { label: 'Active', value: 45 },
  { label: 'Pending', value: 30 },
  { label: 'Done', value: 25 }
]);

onMounted(() => {
  if (canvasRef.value) {
    charts.renderDonut(canvasRef.value, data.value);
  }
});

watch(data, (newData) => {
  if (canvasRef.value) {
    charts.renderDonut(canvasRef.value, newData);
  }
}, { deep: true });
</script>

<template>
  <canvas ref="canvasRef" width="400" height="300"></canvas>
</template>
```

### Gantt / Gauge

```ts
// Gantt: use onMounted + div ref
import { gantt } from 'maranello-luce-design-business/gantt';
onMounted(() => gantt.render(containerRef.value!, props.tasks, { palette: 'nero' }));

// Gauge: use onMounted + canvas ref; reactive via watch
import { gauge } from 'maranello-luce-design-business/gauge';
let instance: ReturnType<typeof gauge.create>;
onMounted(() => { instance = gauge.create(canvasRef.value!, { value: props.value, label: props.label }); });
watch(() => props.value, (val) => instance?.update(val));
```

## Theme Switching

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

type Theme = 'editorial' | 'nero' | 'avorio' | 'colorblind';
const theme = ref<Theme>('nero');

watch(theme, (t) => {
  document.body.classList.remove('mn-nero', 'mn-avorio', 'mn-colorblind');
  if (t !== 'editorial') {
    document.body.classList.add(`mn-${t}`);
  }
});
</script>

<template>
  <select v-model="theme">
    <option value="editorial">Editorial</option>
    <option value="nero">Nero</option>
    <option value="avorio">Avorio</option>
    <option value="colorblind">Colorblind</option>
  </select>
</template>
```

## Nuxt 3 Notes

For SSR, wrap WC/Canvas in `<ClientOnly>`. Configure custom elements in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vue: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('mn-') } }
});
```
