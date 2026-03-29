import { describe, it, expect } from 'vitest';
import { STARTER_MANIFESTS } from '../src/manifest.js';
import { instantiateStarter } from '../src/instantiate.js';

const EXPECTED_IDS = ['shared-shell', 'workspace', 'ops-dashboard', 'executive-cockpit', 'program-management'];

describe('STARTER_MANIFESTS', () => {
  it('covers all 4 domain starters (excluding shared-shell which is a shell, not a domain starter)', () => {
    const domainIds = STARTER_MANIFESTS.filter((m) => m.id !== 'shared-shell').map((m) => m.id);
    expect(domainIds).toContain('workspace');
    expect(domainIds).toContain('ops-dashboard');
    expect(domainIds).toContain('executive-cockpit');
    expect(domainIds).toContain('program-management');
  });

  it('contains all expected starter ids', () => {
    const ids = STARTER_MANIFESTS.map((m) => m.id);
    for (const id of EXPECTED_IDS) {
      expect(ids).toContain(id);
    }
  });

  it('each manifest has valid required fields', () => {
    for (const manifest of STARTER_MANIFESTS) {
      expect(typeof manifest.id).toBe('string');
      expect(manifest.id.length).toBeGreaterThan(0);

      expect(typeof manifest.name).toBe('string');
      expect(manifest.name.length).toBeGreaterThan(0);

      expect(typeof manifest.description).toBe('string');
      expect(manifest.description.length).toBeGreaterThan(0);

      expect(['workspace', 'dashboard', 'executive', 'program-management']).toContain(manifest.category);

      expect(Array.isArray(manifest.dependencies)).toBe(true);
      expect(manifest.dependencies.length).toBeGreaterThan(0);

      expect(Array.isArray(manifest.files)).toBe(true);
      expect(manifest.files.length).toBeGreaterThan(0);
    }
  });

  it('each manifest includes an src/index.ts file entry', () => {
    for (const manifest of STARTER_MANIFESTS) {
      expect(manifest.files).toContain('src/index.ts');
    }
  });

  it('all manifests depend on design-elements and design-tokens', () => {
    for (const manifest of STARTER_MANIFESTS) {
      expect(manifest.dependencies).toContain('@convergio/design-elements');
      expect(manifest.dependencies).toContain('@convergio/design-tokens');
    }
  });
});

describe('instantiateStarter', () => {
  it('returns success for each known manifest id', () => {
    for (const id of EXPECTED_IDS) {
      const result = instantiateStarter(id, '/tmp/my-app');
      expect(result.success).toBe(true);
      expect(result.manifestId).toBe(id);
      expect(result.errors).toHaveLength(0);
    }
  });

  it('returns correct file list prefixed with targetDir', () => {
    const result = instantiateStarter('workspace', '/projects/my-workspace');
    expect(result.success).toBe(true);
    expect(result.targetDir).toBe('/projects/my-workspace');
    for (const file of result.files) {
      expect(file.startsWith('/projects/my-workspace/')).toBe(true);
    }
    expect(result.files).toContain('/projects/my-workspace/src/index.ts');
    expect(result.files).toContain('/projects/my-workspace/src/workspace-config.ts');
  });

  it('reflects the targetDir in the result', () => {
    const targetDir = '/home/user/convergio-app';
    const result = instantiateStarter('ops-dashboard', targetDir);
    expect(result.targetDir).toBe(targetDir);
    expect(result.files.every((f) => f.startsWith(targetDir + '/'))).toBe(true);
  });

  it('returns error for unknown manifest id', () => {
    const result = instantiateStarter('does-not-exist', '/tmp/test');
    expect(result.success).toBe(false);
    expect(result.manifestId).toBe('does-not-exist');
    expect(result.files).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('does-not-exist');
  });

  it('returns files matching the manifest file count for each starter', () => {
    for (const manifest of STARTER_MANIFESTS) {
      const result = instantiateStarter(manifest.id, '/out');
      expect(result.files).toHaveLength(manifest.files.length);
    }
  });

  it('shared-shell result includes deploy and runtime files', () => {
    const result = instantiateStarter('shared-shell', '/out');
    expect(result.success).toBe(true);
    expect(result.files).toContain('/out/src/deploy.ts');
    expect(result.files).toContain('/out/src/runtime.ts');
  });

  it('executive-cockpit result includes cockpit-config file', () => {
    const result = instantiateStarter('executive-cockpit', '/out');
    expect(result.success).toBe(true);
    expect(result.files).toContain('/out/src/cockpit-config.ts');
  });

  it('program-management result includes pm-config file', () => {
    const result = instantiateStarter('program-management', '/out');
    expect(result.success).toBe(true);
    expect(result.files).toContain('/out/src/pm-config.ts');
  });
});
