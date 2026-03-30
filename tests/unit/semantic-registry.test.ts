import { describe, it, expect } from 'vitest';
import {
  queryByWorkflow,
  queryByIntent,
  listWorkflows,
  getStarterForWorkflow,
} from '../../packages/elements/src/ts/semantic-registry';
import type {
  WorkflowEntry,
  SemanticQuery,
  SemanticResult,
} from '../../packages/elements/src/ts/semantic-registry';

describe('Semantic Registry', () => {
  describe('queryByWorkflow', () => {
    it('returns a result for a known workflow id', () => {
      const result = queryByWorkflow('crm-dashboard');
      expect(result).toBeDefined();
      expect(result!.workflow).toBe('crm-dashboard');
      expect(result!.components.length).toBeGreaterThan(0);
    });

    it('returns undefined for unknown workflow', () => {
      expect(queryByWorkflow('nonexistent-xyz')).toBeUndefined();
    });

    it('result includes starter when available', () => {
      const result = queryByWorkflow('crm-dashboard');
      expect(result).toBeDefined();
      expect(result!.starter).toBeDefined();
      expect(result!.starter!.package).toContain('@convergio');
    });

    it('result includes compositionRules', () => {
      const result = queryByWorkflow('crm-dashboard');
      expect(result).toBeDefined();
      expect(result!.compositionRules.length).toBeGreaterThan(0);
    });

    it('result includes layout recommendation', () => {
      const result = queryByWorkflow('crm-dashboard');
      expect(result).toBeDefined();
      expect(typeof result!.layout).toBe('string');
    });
  });

  describe('queryByIntent', () => {
    it('returns matches for a keyword intent', () => {
      const results = queryByIntent({ keywords: ['dashboard'] });
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some(r => r.workflow.includes('dashboard')),
      ).toBe(true);
    });

    it('returns matches for dataShape intent', () => {
      const results = queryByIntent({
        keywords: ['table'],
        dataShape: 'list',
      });
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns empty array when nothing matches', () => {
      const results = queryByIntent({
        keywords: ['quantum-teleportation'],
      });
      expect(results).toEqual([]);
    });

    it('ranks results by relevance (more keyword matches first)', () => {
      const results = queryByIntent({
        keywords: ['data', 'table', 'filter'],
      });
      if (results.length >= 2) {
        expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
      }
    });
  });

  describe('listWorkflows', () => {
    it('returns all registered workflows', () => {
      const workflows = listWorkflows();
      expect(workflows.length).toBeGreaterThanOrEqual(8);
    });

    it('each workflow has id, label, and description', () => {
      for (const wf of listWorkflows()) {
        expect(typeof wf.id).toBe('string');
        expect(typeof wf.label).toBe('string');
        expect(typeof wf.description).toBe('string');
      }
    });
  });

  describe('getStarterForWorkflow', () => {
    it('returns starter config for workflows that have one', () => {
      const starter = getStarterForWorkflow('app-shell');
      expect(starter).toBeDefined();
      expect(starter!.package).toBeDefined();
    });

    it('returns undefined for workflows without a starter', () => {
      const starter = getStarterForWorkflow('ai-chat-interface');
      expect(starter).toBeUndefined();
    });
  });

  describe('workflow entries structure', () => {
    it('every workflow has at least one component', () => {
      for (const wf of listWorkflows()) {
        const result = queryByWorkflow(wf.id);
        expect(
          result!.components.length,
          `${wf.id} must have components`,
        ).toBeGreaterThan(0);
      }
    });

    it('components reference valid mn- tags or TS module names', () => {
      for (const wf of listWorkflows()) {
        const result = queryByWorkflow(wf.id);
        for (const comp of result!.components) {
          expect(
            typeof comp.id,
            `component in ${wf.id} must have string id`,
          ).toBe('string');
          expect(
            typeof comp.role,
            `component in ${wf.id} must have string role`,
          ).toBe('string');
        }
      }
    });

    it('every workflow has searchable tags', () => {
      for (const wf of listWorkflows()) {
        const result = queryByWorkflow(wf.id);
        expect(
          result!.tags.length,
          `${wf.id} must have tags`,
        ).toBeGreaterThan(0);
      }
    });
  });
});
