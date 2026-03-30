# Agent Semantics

This document describes how agents (AI coding assistants, plan executors, and NaSra) should
read component and template knowledge to compose correct UIs without guessing.

## Semantic Registry

The registry lives in `packages/elements/src/ts/semantic-registry.ts`. It maps workflow
intents to components, composition rules, layouts, and starter packages.

### Types

```ts
interface WorkflowEntry {
  workflow: string;          // unique id, e.g. 'ops-monitor'
  label: string;
  description: string;
  components: ComponentRef[]; // { id, role, importPath? }
  compositionRules: string[]; // semantic rule ids, e.g. 'monitoring-strip'
  layout: string;            // human-readable layout hint
  tags: string[];
  starter?: StarterRef;      // { package, description, entryFunction? }
  dataShapes?: string[];     // expected data shapes, e.g. 'time-series'
}

interface SemanticQuery {
  keywords: string[];
  dataShape?: string;
}

interface SemanticResult extends WorkflowEntry {
  score: number;             // keyword + dataShape match count
}
```

### Query by workflow id

```ts
import { queryByWorkflow } from '@convergio/design-elements';

const entry = queryByWorkflow('ops-monitor');
// entry.components => [{ id: 'mn-system-status', role: 'service health panel' }, ...]
// entry.starter    => undefined (no dedicated starter; use shared-shell)
```

### Query by intent (keyword search)

```ts
import { queryByIntent } from '@convergio/design-elements';

const results = queryByIntent({ keywords: ['monitoring', 'real-time', 'health'] });
// returns SemanticResult[] sorted by descending score
// each result has .components, .compositionRules, .layout, .starter
```

Scoring: each keyword that appears in `tags`, `workflow`, `label`, or `description` adds 1
point. A matching `dataShape` adds 1 point. Pick `results[0]` as the primary candidate.

### List all workflows

```ts
import { listWorkflows } from '@convergio/design-elements';

listWorkflows();
// [{ id, label, description }, ...]
```

Use this to populate a tool call or agent action menu.

## Template Selection via Manifest API

When the task requires scaffolding a new starter:

```ts
import { STARTER_MANIFESTS, instantiateStarter } from '@convergio/create-starter';

// 1. Find the right manifest
const manifest = STARTER_MANIFESTS.find(m => m.id === 'ops-dashboard');
// manifest.category === 'dashboard'
// manifest.dependencies === ['@convergio/design-elements', '@convergio/design-tokens']

// 2. Validate and get file list (dry-run, no filesystem I/O)
const result = instantiateStarter('ops-dashboard', './my-ops-app');
if (!result.success) throw new Error(result.errors[0]);
// result.files === ['./my-ops-app/src/index.ts', './my-ops-app/src/ops-config.ts', ...]
```

`instantiateStarter` never writes to disk. Agents should use the file list to drive subsequent
write operations via their own file-write tooling.

## AI Command Surface Contract

The `AIAdapter` in `SharedShellAdapters` defines the surface an agent can invoke:

```ts
interface AIAdapter {
  routePath: string;      // POST endpoint for chat/completions
  model: string;          // model id passed to the provider
  actions?: AgentAction[]; // structured actions the agent can perform
  systemPrompt?: string;  // prepended to every conversation in this shell
}

interface AgentAction {
  id: string;
  label: string;
  description?: string;
}
```

Agents reading a shell config should:

1. Read `adapters.ai.routePath` to know where to POST completions.
2. Read `adapters.ai.actions` to know what structured actions are available in context.
3. Use `adapters.ai.systemPrompt` as the grounding context for any completion they generate.
4. Never invent action ids — only call actions listed in `adapters.ai.actions`.

## Reading Component Semantics for Composition

When composing a view for a specific workflow:

1. Call `queryByWorkflow(id)` or `queryByIntent({ keywords })`.
2. Read `entry.components` — each `ComponentRef` has an `id` (the WC tag name or JS symbol)
   and a `role` (what it does in this workflow).
3. Read `entry.compositionRules` — these are rule ids (e.g., `'kpi-dashboard'`,
   `'filterable-table'`) that describe how components relate. Cross-reference with the
   agent-cookbook at `docs/agent-cookbook.md` for concrete wiring patterns.
4. Read `entry.layout` — place components according to the described layout
   (e.g., `'4-slot grid (createLayout)'` means use `createLayout` from `layout.ts`).
5. If `entry.starter` is set, prefer that starter package as the shell.

### Workflow to starter mapping (current registry)

| Workflow id | Starter package | Entry function |
|---|---|---|
| `crm-dashboard` | `@convergio/shared-shell-starter` | `createSharedShellFiles` |
| `data-browser` | `@convergio/shared-shell-starter` | `createSharedShellFiles` |
| `project-planner` | `@convergio/shared-shell-starter` | `createSharedShellFiles` |
| `app-shell` | `@convergio/shared-shell-starter` | `createSharedShellFiles` |
| `ai-chat-interface` | none (embed in any shell) | — |
| `ops-monitor` | none listed (use `ops-dashboard` starter) | `createOpsDashboardConfig` |
| `entity-editor` | none (embed in any shell) | — |
| `ai-ops-dashboard` | none listed | — |
| `geo-analytics` | none listed | — |
| `customer-journey` | none listed | — |

For workflows without a `starter` entry, use `shared-shell` as the base and add the
workflow's components to the `content.body` slot.

## Agent Rules

- Read the registry before proposing a component composition. Never assume component ids.
- `ComponentRef.id` values that start with `mn-` are Web Components registered via
  `registerAll()` from `@convergio/design-elements`. Import and call `registerAll()` once
  at app entry.
- `ComponentRef.id` values without `mn-` are headless JS modules (e.g., `streamingText`,
  `agentTrace`). Import them as named exports from `@convergio/design-elements`.
- Prefer `queryByIntent` for fuzzy use-case matching; prefer `queryByWorkflow` when you have
  a confirmed workflow id from the plan or task description.
- Always verify `getStarterForWorkflow(id)` before recommending a starter. The registry is
  the authoritative source; do not infer starters from workflow names.
