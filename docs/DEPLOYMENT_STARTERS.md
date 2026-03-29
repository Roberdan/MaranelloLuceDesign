# Starter deployment

The starter platform is designed for:
- Vercel deployments for App Router workflows
- Azure container deployments for teams standardizing on containers

Deployment configuration belongs in each deployable starter app. `starters/shared-shell/` is a shared library package, so app-specific assets like `vercel.json` or container images should live alongside the consuming starter.

Canonical environment surface:
- `NODE_ENV`
- `AI_PROVIDER`
- `NEXT_PUBLIC_APP_NAME`
- provider-specific secrets layered by the consuming app

Every starter now exposes `app/api/agent/route.ts` as the server integration seam for agent interactions.
