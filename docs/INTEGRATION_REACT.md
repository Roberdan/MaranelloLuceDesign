# React Integration

How to use Maranello Luce Design System with React (18+).

## Install

```bash
npm install github:Roberdan/MaranelloLuceDesign#v3.0.0
```

## CSS @layer Import

v3.0.0 wraps all CSS in `@layer` blocks. Import order is safe regardless of bundler.

```tsx
// Full bundle
import 'maranello-luce-design-business/css';

// Or selective layers
import 'maranello-luce-design-business/css/tokens.css';
import 'maranello-luce-design-business/css/base.css';
import 'maranello-luce-design-business/css/components.css';
```

Consumer styles without `@layer` automatically win — no specificity fights.

## Layer 1: CSS-Only

Import the CSS in your entry point. No wrapper components needed.

```tsx
// main.tsx or App.tsx
import 'maranello-luce-design-business/css';

function App() {
  return (
    <body className="mn-nero">
      <section className="mn-section-dark">
        <h2 className="mn-title-section">Dashboard</h2>
        <div className="mn-stat-card">
          <span className="mn-stat-value">142</span>
          <span className="mn-stat-label">Active projects</span>
        </div>
      </section>
    </body>
  );
}
```

Selective CSS imports for smaller bundles:

```tsx
import 'maranello-luce-design-business/css/tokens.css';
import 'maranello-luce-design-business/css/base.css';
import 'maranello-luce-design-business/css/components.css';
```

## Layer 2: Web Components

React does not natively pass complex props to Web Components. Use a wrapper pattern.

### Type declarations

```tsx
// types/maranello.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'mn-gauge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      value?: number | string;
      label?: string;
      theme?: string;
    };
    'mn-chart': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      type?: string;
      data?: string;
    };
    'mn-toast': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      message?: string;
      type?: string;
      duration?: number | string;
    };
  }
}
```

### Per-component ESM import (v3)

```tsx
// Import only the WC you need (no full WC bundle)
import 'maranello-luce-design-business/wc/mn-gauge';
import 'maranello-luce-design-business/wc/mn-chart';
// or all at once:
import 'maranello-luce-design-business/wc';
```

### Wrapper component pattern

```tsx
import { useRef, useEffect } from 'react';
import 'maranello-luce-design-business/wc/mn-gauge';

interface GaugeProps {
  value: number;
  label: string;
  theme?: 'nero' | 'avorio' | 'editorial' | 'colorblind';
}

function MnGauge({ value, label, theme = 'nero' }: GaugeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute('value', String(value));
      ref.current.setAttribute('label', label);
      ref.current.setAttribute('theme', theme);
    }
  }, [value, label, theme]);

  return <mn-gauge ref={ref} />;
}
```

### Event handling with Web Components

```tsx
function MnChart({ data, onSegmentClick }: { data: ChartData[]; onSegmentClick?: (d: ChartData) => void }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.setAttribute('data', JSON.stringify(data));

    const handler = (e: Event) => onSegmentClick?.((e as CustomEvent).detail);
    el.addEventListener('segment-click', handler);
    return () => el.removeEventListener('segment-click', handler);
  }, [data, onSegmentClick]);

  return <mn-chart ref={ref} type="donut" />;
}
```

## Layer 3: Headless JS (Canvas/SVG)

Use `useRef` + `useEffect` for Canvas-based renderers. This is the recommended approach for React because it avoids DOM ownership conflicts.

```tsx
import { useRef, useEffect } from 'react';
import { charts } from 'maranello-luce-design-business/charts';

function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    charts.renderDonut(canvasRef.current, data);
  }, [data]);

  return <canvas ref={canvasRef} width={400} height={300} />;
}
```

### Gantt chart

```tsx
import { useRef, useEffect } from 'react';
import { gantt } from 'maranello-luce-design-business/gantt';

function GanttTimeline({ tasks }: { tasks: GanttTask[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gantt.render(containerRef.current, tasks, { palette: 'nero' });
  }, [tasks]);

  return <div ref={containerRef} style={{ width: '100%', height: 400 }} />;
}
```

### Gauge/Speedometer

```tsx
import { useRef, useEffect } from 'react';
import { gauge } from 'maranello-luce-design-business/gauge';

function FerrariGauge({ value, label }: { value: number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    gauge.create(canvasRef.current, { value, label });
  }, [value, label]);

  return <canvas ref={canvasRef} width={200} height={200} />;
}
```

## DOM Safety

React manages a virtual DOM. Mixing direct DOM manipulation can cause conflicts.

**Safe patterns:**
- Canvas rendering via `useRef` (React does not manage canvas content)
- Web Components via `useRef` + attribute setting in `useEffect`
- CSS class toggling via React's `className` prop

**Avoid:**
- `document.querySelector` inside React components
- `innerHTML` on elements React owns
- Calling Maranello's `M.initThemeToggle()` directly (use React state instead)

### Theme toggle in React

```tsx
import { useState, useEffect } from 'react';

type Theme = 'editorial' | 'nero' | 'avorio' | 'colorblind';

function useTheme(initial: Theme = 'nero') {
  const [theme, setTheme] = useState<Theme>(initial);

  useEffect(() => {
    document.body.classList.remove('mn-nero', 'mn-avorio', 'mn-colorblind');
    if (theme !== 'editorial') {
      document.body.classList.add(`mn-${theme}`);
    }
  }, [theme]);

  return [theme, setTheme] as const;
}
```
