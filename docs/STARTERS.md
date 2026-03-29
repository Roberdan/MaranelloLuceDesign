# Starter platform

The starter platform gives application teams a complete UI shell so they can focus on data, security, roles, business logic, telemetry, features, and APIs.

Available starters:
- Workspace App
- Ops Dashboard
- Executive Cockpit
- Program Management

All starters are designed to consume Convergio Design as the visual and semantic source of truth.

Shared starter features:
- `starters/shared-shell` for layout, navigation, agent seams, RBAC, telemetry, and API contracts
- `app/api/agent/route.ts` in every starter as the canonical AI-ready entrypoint
- direct `@convergio/design-elements/css` import in `app/layout.tsx`
