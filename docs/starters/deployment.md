# Deployment

The shared-shell starter generates deployment assets programmatically via `generateDeployAssets`.
All configuration comes from the typed `SharedShellAdapters` bundle — no hardcoded values.

## Generate assets

```ts
import { generateDeployAssets } from '@convergio/shared-shell-starter';
import type { SharedShellAdapters, DeployTarget } from '@convergio/shared-shell-starter';

const adapters: SharedShellAdapters = {
  ai:        { routePath: '/api/ai/chat', model: 'claude-sonnet-4-6' },
  auth:      { provider: 'nextauth', signInPath: '/auth/signin', signOutPath: '/auth/signout', sessionEndpoint: '/api/auth/session' },
  telemetry: { provider: 'posthog', envKey: 'POSTHOG_KEY', autoEvents: ['page_view', 'nav_click'] },
  api:       { baseUrlEnv: 'API_BASE_URL', endpoints: [] },
};

const assets = generateDeployAssets('vercel', adapters);
// assets.files  — Record<string, string> keyed by file path
// assets.envVars — EnvVar[] with name, description, required
```

`listDeployTargets()` returns `['vercel', 'azure-container-apps']`.

## Environment Variable Reference

Variables are derived from the adapters you pass. The table below lists the full set of
variables that `collectEnvVars` (internal) can emit.

| Variable | Adapter | Required | Description |
|---|---|---|---|
| `AI_PROVIDER_API_KEY` | `ai` | yes | API key for the AI model provider |
| `AUTH_SECRET` | `auth` | yes | Session encryption secret |
| `<telemetry.envKey>` | `telemetry` | yes | Telemetry write key (value depends on provider) |
| `<api.baseUrlEnv>` | `api` | yes | Backend API base URL (value is the env var name you choose) |

Set all required variables before running the build. Do not hardcode values in source.

## Vercel

### Steps

1. Generate assets: `generateDeployAssets('vercel', adapters)`.
2. Write `assets.files['vercel.json']` to the repo root.
3. Write `assets.files['.env.example']` to the repo root (commit; do not commit `.env.local`).
4. In the Vercel dashboard: Settings > Environment Variables — add each required variable.
5. `vercel deploy` or push to the connected branch.

### Generated vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "regions": ["iad1"]
}
```

Override `regions` in the overrides step if you need `cdg1` (Frankfurt) or `syd1` (Sydney).

### AI route

`AIAdapter.routePath` defaults to `/api/ai/chat`. Create the corresponding Next.js route handler
and wire it to your AI SDK. The shell's `AIAdapter.model` value is passed as a hint — the route
handler is responsible for using it.

## Azure Container Apps

### Steps

1. Generate assets: `generateDeployAssets('azure-container-apps', adapters)`.
2. Write `assets.files['Dockerfile']`, `assets.files['deploy/k8s-deployment.yaml']`, and
   `assets.files['.env.example']` to the repo.
3. Build and push the image:
   ```sh
   docker build -t convergio-shell:latest .
   docker tag convergio-shell:latest <registry>.azurecr.io/convergio-shell:latest
   docker push <registry>.azurecr.io/convergio-shell:latest
   ```
4. Create Azure Key Vault secrets for each `EnvVar` with `required: true`.
5. Apply the manifest:
   ```sh
   kubectl apply -f deploy/k8s-deployment.yaml
   ```

### Generated Dockerfile (multi-stage)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Requires `output: 'standalone'` in `next.config.js` for the standalone copy to exist.

### Generated k8s manifest

The deployment spec sets 2 replicas, 0.5 CPU / 512 Mi limit, 0.25 CPU / 256 Mi request.
Each required env var is injected via `secretRef`. Secret names are derived from the
variable name: `AI_PROVIDER_API_KEY` becomes `ai-provider-api-key`.

## Tauri Desktop

Tauri wraps the Next.js app in a WebView. The shell runs unmodified inside the WebView.

Key points:

- Export the Next.js app as a static site (`next export`) or use the dev server during development.
- Set `"distDir": "../out"` in `tauri.conf.json` to point at the Next.js output directory.
- `AIAdapter.routePath` must be an absolute URL when running in Tauri (the WebView has no local
  server for API routes). Point it at a deployed backend or a local sidecar.
- `AuthAdapter` session endpoints must also be absolute URLs; browser cookie flows do not apply
  inside Tauri's WebView by default.
- The `generateDeployAssets` function does not produce a Tauri config. Write `tauri.conf.json`
  manually based on the env var list in `assets.envVars`.
- All 6 themes work in WebKit (Tauri's WebView on macOS/Linux). Avoid `structuredClone`,
  `Object.hasOwn`, `Array.at()`, and `classList.toggle(name, force)` — see CLAUDE.md for the
  full Safari / WebKit compatibility list.
