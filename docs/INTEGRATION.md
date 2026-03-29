<!-- v6.3.2 | 2026-03-29 -->
# Framework Integration

Install from npm:

```bash
npm install @convergio/design-tokens @convergio/design-elements
```

## Canonical Next.js App Router setup

This is the recommended integration path.

### 1. Root layout CSS

```tsx
import '@convergio/design-elements/css';
import '@convergio/design-tokens/bridge-shadcn'; // optional

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`@convergio/design-elements/css` already includes tokens and themes. Import `@convergio/design-tokens/css` only if you need token CSS without component CSS.

### 2. Client boundary for DOM APIs

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gantt } from '@convergio/design-elements/gantt';

export function GanttView({ tasks }: { tasks: unknown[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const widget = gantt(ref.current, tasks);
    return () => widget.destroy();
  }, [tasks]);

  return <div ref={ref} />;
}
```

The package root and documented subpaths are safe to import during SSR. Actual DOM work still belongs in client components.

### 4. Starter platform for full applications

If you need more than isolated widgets, use the starter platform in `starters/`:

- `template-workspace-app`
- `template-ops-dashboard`
- `template-executive-cockpit`
- `template-program-management`

Each starter is wired to the shared shell package, imports `@convergio/design-elements/css`, and exposes `app/api/agent/route.ts` as the canonical server seam for AI interactions.

### 3. Web Components and TSX typing

Add once in a project-level `.d.ts` file:

```ts
/// <reference types="@convergio/design-elements/react" />
```

Then use Web Components from a client file:

```tsx
'use client';

import '@convergio/design-elements/register-all';

export function GaugeCard() {
  return <mn-gauge value="72" unit="%" />;
}
```

## React

Use refs + `useEffect`, and always destroy the returned controller on cleanup.

## Vue

Use `onMounted` / `onUnmounted` for imperative APIs.

For Web Components configure:

```ts
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('mn-');
```

## Svelte

Use `onMount` for imperative APIs and destroy on teardown.

## Common rules

| Rule | Detail |
|---|---|
| CSS entrypoint | Prefer `@convergio/design-elements/css` for full app styling |
| SSR | Importing is safe on the server; DOM work stays client-side |
| Web Components | Register from client boundaries |
| TypeScript | Use `@convergio/design-elements/react` for JSX IntrinsicElements |
| shadcn bridge | Optional `@convergio/design-tokens/bridge-shadcn` side-effect CSS import |
