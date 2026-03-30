import { describe, expect, it } from 'vitest';

import {
  generateDeployAssets,
  listDeployTargets,
  type SharedShellAdapters,
} from '../src/index';

const adapters: SharedShellAdapters = {
  ai: { routePath: '/api/ai/chat', model: 'claude-sonnet-4-6' },
  auth: {
    provider: 'nextauth',
    signInPath: '/auth/signin',
    signOutPath: '/auth/signout',
    sessionEndpoint: '/api/auth/session',
  },
  telemetry: {
    provider: 'posthog',
    envKey: 'POSTHOG_KEY',
    autoEvents: ['page_view'],
  },
  api: {
    baseUrlEnv: 'API_BASE_URL',
    endpoints: [{ id: 'health', method: 'GET', path: '/health' }],
  },
};

describe('deployment asset generators', () => {
  it('lists supported deploy targets', () => {
    const targets = listDeployTargets();
    expect(targets).toContain('vercel');
    expect(targets).toContain('azure-container-apps');
  });

  describe('Vercel target', () => {
    it('generates vercel.json and .env.example', () => {
      const assets = generateDeployAssets('vercel', adapters);

      expect(assets.target).toBe('vercel');
      expect(assets.files['vercel.json']).toContain('"framework": "nextjs"');
      expect(assets.files['.env.example']).toContain('AI_PROVIDER_API_KEY');
      expect(assets.files['.env.example']).toContain('AUTH_SECRET');
      expect(assets.files['.env.example']).toContain('POSTHOG_KEY');
      expect(assets.files['.env.example']).toContain('API_BASE_URL');
    });

    it('collects required env vars from adapters', () => {
      const assets = generateDeployAssets('vercel', adapters);
      const names = assets.envVars.map((v) => v.name);

      expect(names).toContain('AI_PROVIDER_API_KEY');
      expect(names).toContain('AUTH_SECRET');
      expect(names).toContain('POSTHOG_KEY');
      expect(names).toContain('API_BASE_URL');
      expect(assets.envVars.every((v) => v.required)).toBe(true);
    });

    it('generates minimal assets when no adapters are provided', () => {
      const assets = generateDeployAssets('vercel');

      expect(assets.files['vercel.json']).toContain('"framework": "nextjs"');
      expect(assets.envVars).toHaveLength(0);
    });
  });

  describe('Azure Container Apps target', () => {
    it('generates k8s deployment, Dockerfile, and .env.example', () => {
      const assets = generateDeployAssets('azure-container-apps', adapters);

      expect(assets.target).toBe('azure-container-apps');
      expect(assets.files['deploy/k8s-deployment.yaml']).toContain('convergio-shell');
      expect(assets.files['deploy/k8s-deployment.yaml']).toContain('containerPort: 3000');
      expect(assets.files['Dockerfile']).toContain('FROM node:22-alpine');
      expect(assets.files['Dockerfile']).toContain('pnpm build');
      expect(assets.files['.env.example']).toContain('AI_PROVIDER_API_KEY');
    });

    it('injects env vars into k8s manifest', () => {
      const assets = generateDeployAssets('azure-container-apps', adapters);
      const yaml = assets.files['deploy/k8s-deployment.yaml'];

      expect(yaml).toContain('AI_PROVIDER_API_KEY');
      expect(yaml).toContain('AUTH_SECRET');
      expect(yaml).toContain('secretKeyRef');
    });
  });

  it('throws on unsupported target', () => {
    expect(() => generateDeployAssets('gcp' as never)).toThrow('Unsupported deploy target');
  });
});
