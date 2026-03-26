<!-- v3.1.0 | 2025-07-21 -->
# Framework Integration

All frameworks: `npm install github:Roberdan/convergio-design#v3.0.0`

## Vanilla

```html
<link rel="stylesheet" href="dist/css/index.css">
<script src="dist/iife/maranello.min.js"></script>
<body class="mn-nero">
  <mn-gauge value="72" label="CPU"></mn-gauge>
  <canvas id="chart"></canvas>
  <script>Maranello.sparkline(document.getElementById('chart'), [10,20,15,30]);</script>
</body>
```

## React

```tsx
import 'maranello-luce-design-business/css';
import { useRef, useEffect } from 'react';
import { sparkline } from 'maranello-luce-design-business/charts';

function Spark({ data }: { data: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) sparkline(ref.current, data); }, [data]);
  return <canvas ref={ref} width={200} height={60} />;
}
```

WC in React: use `useRef` + `setAttribute` in `useEffect`. SSR: client-only via `useEffect`.

## Vue

```vue
<script setup>
import 'maranello-luce-design-business/css';
import 'maranello-luce-design-business/wc';
import { ref } from 'vue';
const val = ref(72);
</script>
<template><mn-gauge :value="val" label="CPU"></mn-gauge></template>
```

Config: `app.config.compilerOptions.isCustomElement = tag => tag.startsWith('mn-')`.
Nuxt: wrap in `<ClientOnly>`.

## Svelte

```svelte
<script>
import 'maranello-luce-design-business/css';
import { onMount } from 'svelte';
import { sparkline } from 'maranello-luce-design-business/charts';
let canvas;
onMount(() => sparkline(canvas, [10,20,15,30]));
</script>
<canvas bind:this={canvas} width="200" height="60"></canvas>
```

SvelteKit SSR: guard with `onMount` or `browser` check.

## Vite Config

```ts
// vite.config.ts — Vue projects need custom element config
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: tag => tag.startsWith('mn-') } } })],
  optimizeDeps: { include: ['maranello-luce-design-business'] }
});
```

## Common Rules

| Rule | Detail |
|---|---|
| CSS load order | DS CSS first, then consumer overrides |
| `@layer` | Consumer styles without `@layer` win automatically |
| Canvas/WC in SSR | Client-only (`useEffect` / `onMounted` / `onMount`) |
| React DOM safety | Mount in `useRef` container, call `destroy()` in cleanup |
| Theme switching | Use `setTheme()`, not direct class manipulation |
| Selective CSS | Import only needed modules: `…/css/tokens.css`, `…/css/charts.css` etc. |
| Mapbox (mn-map) | Peer dep: `npm install mapbox-gl`, set `VITE_MAPBOX_TOKEN` |
