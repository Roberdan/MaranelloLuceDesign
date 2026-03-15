# AI Agents — Maranello Design System

## NaSra

**NaSra** is the canonical AI expert agent for the Maranello Design System.
She covers: adaptive token rules, all 4 themes, WCAG 2.2 accessibility,
color blindness prevention, responsive layout patterns, and CI constitution checks.

### How to use NaSra in your project

#### Option A — Use canonical NaSra directly (recommended for most projects)

Copy `NaSra.agent.md` into your project's `.github/agents/` directory.
No modifications needed — the agent reads `docs/design/` from disk and stays
current with the design system version you have synced.

```
your-project/
└── .github/
    └── agents/
        └── NaSra.agent.md   ← copy from MaranelloLuceDesign
```

In Claude Code: `@NaSra help me implement the dashboard KPI section`
In GitHub Copilot: `@NaSra what token should I use for a data label text color?`

#### Option B — Thin framework extension (only if you use Svelte/React/Vue/etc.)

Keep the canonical NaSra **unmodified** for design system knowledge.
Create a separate `NaSra-{framework}.agent.md` with only framework-specific rules:

```
your-project/
└── .github/
    └── agents/
        ├── NaSra.agent.md              ← canonical, no edits
        └── NaSra-svelte.agent.md       ← only Svelte/engine patterns
```

The extension should:
- Reference the canonical agent: "For DS knowledge, see canonical NaSra"
- Add ONLY framework-specific integration patterns
- NOT duplicate token rules, WCAG, color blindness, or responsive sections

See `VirtualBPM/.github/agents/NaSra.agent.md` as a reference implementation.

### What NOT to do

| Wrong | Right |
|---|---|
| Copy NaSra and add local token rules | Update canonical NaSra, re-copy |
| Maintain two separate full NaSra copies | One canonical + optional thin extension |
| Add token/WCAG rules to framework extension | Those belong in canonical NaSra only |
| Remove responsive checklist from canonical | Required — every adopter needs it |

### Keeping NaSra up to date

When you update the Maranello dist in your project, re-copy `NaSra.agent.md`
from this repo (same version tag). The agent's knowledge is versioned together
with the design system.

```bash
# Example: update NaSra alongside the dist
cp node_modules/maranello-luce/...NaSra.agent.md .github/agents/NaSra.agent.md
# or from git subtree / submodule
```
