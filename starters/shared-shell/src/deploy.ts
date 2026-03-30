/**
 * Deployment asset generators for the shared shell starter.
 *
 * Produces configuration files for Vercel and Azure Container Apps
 * so teams deploy without re-architecting the UI shell.
 */

import type { SharedShellAdapters } from './adapters';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported deployment targets. */
export type DeployTarget = 'vercel' | 'azure-container-apps';

/** Runtime env var declaration for deployment manifests. */
export interface EnvVar {
  name: string;
  description: string;
  required: boolean;
}

/** Result of a deployment asset generation. */
export interface DeployAssets {
  target: DeployTarget;
  files: Record<string, string>;
  envVars: EnvVar[];
}

// ---------------------------------------------------------------------------
// Shared env extraction
// ---------------------------------------------------------------------------

function collectEnvVars(adapters?: SharedShellAdapters): EnvVar[] {
  const vars: EnvVar[] = [];

  if (adapters?.ai) {
    vars.push(
      { name: 'AI_PROVIDER_API_KEY', description: 'API key for the AI model provider', required: true },
    );
  }
  if (adapters?.auth) {
    vars.push(
      { name: 'AUTH_SECRET', description: 'Session encryption secret', required: true },
    );
  }
  if (adapters?.telemetry) {
    vars.push(
      { name: adapters.telemetry.envKey, description: 'Telemetry write key', required: true },
    );
  }
  if (adapters?.api) {
    vars.push(
      { name: adapters.api.baseUrlEnv, description: 'Backend API base URL', required: true },
    );
  }

  return vars;
}

// ---------------------------------------------------------------------------
// Vercel
// ---------------------------------------------------------------------------

function generateVercelAssets(adapters?: SharedShellAdapters): DeployAssets {
  const envVars = collectEnvVars(adapters);

  const vercelJson: Record<string, unknown> = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    framework: 'nextjs',
    buildCommand: 'pnpm build',
    installCommand: 'pnpm install',
    regions: ['iad1'],
  };

  const envExample = envVars
    .map((v) => `# ${v.description}${v.required ? ' (required)' : ''}\n${v.name}=`)
    .join('\n');

  return {
    target: 'vercel',
    files: {
      'vercel.json': JSON.stringify(vercelJson, null, 2),
      '.env.example': `# Convergio shared shell — Vercel deployment\n${envExample}\n`,
    },
    envVars,
  };
}

// ---------------------------------------------------------------------------
// Azure Container Apps
// ---------------------------------------------------------------------------

function generateAzureAssets(adapters?: SharedShellAdapters): DeployAssets {
  const envVars = collectEnvVars(adapters);

  const envBlock = envVars.length > 0
    ? '\n          env:\n' + envVars
        .map((v) => {
          const secretName = v.name.toLowerCase().replace(/_/g, '-');
          return `            - name: ${v.name}\n              valueFrom:\n                secretKeyRef:\n                  name: ${secretName}\n                  key: ${v.name}`;
        })
        .join('\n')
    : '';

  const containerApp = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: convergio-shell
  labels:
    app: convergio-shell
spec:
  replicas: 2
  selector:
    matchLabels:
      app: convergio-shell
  template:
    metadata:
      labels:
        app: convergio-shell
    spec:
      containers:
        - name: shell
          image: convergio-shell:latest
          ports:
            - containerPort: 3000${envBlock}
          resources:
            limits:
              cpu: '0.5'
              memory: 512Mi
            requests:
              cpu: '0.25'
              memory: 256Mi
`;

  const dockerfile = `FROM node:22-alpine AS builder
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
`;

  const envExample = envVars
    .map((v) => `# ${v.description}${v.required ? ' (required)' : ''}\n${v.name}=`)
    .join('\n');

  return {
    target: 'azure-container-apps',
    files: {
      'deploy/k8s-deployment.yaml': containerApp,
      'Dockerfile': dockerfile,
      '.env.example': `# Convergio shared shell — Azure Container Apps\n${envExample}\n`,
    },
    envVars,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Generate deployment assets for a given target. */
export function generateDeployAssets(
  target: DeployTarget,
  adapters?: SharedShellAdapters,
): DeployAssets {
  switch (target) {
    case 'vercel':
      return generateVercelAssets(adapters);
    case 'azure-container-apps':
      return generateAzureAssets(adapters);
    default:
      throw new Error(`Unsupported deploy target: ${target as string}`);
  }
}

/** List all supported deployment targets. */
export function listDeployTargets(): DeployTarget[] {
  return ['vercel', 'azure-container-apps'];
}
