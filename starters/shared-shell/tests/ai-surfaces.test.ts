import { describe, it, expect } from 'vitest';
import { createDefaultAISurfaces } from '../src/ai-surfaces';
import type { AICommandSurfaces, AICommandPalette, AIPanel, AIActionSurface } from '../src/ai-surfaces';

describe('createDefaultAISurfaces', () => {
  it('returns an object satisfying AICommandSurfaces shape', () => {
    const surfaces: AICommandSurfaces = createDefaultAISurfaces();
    expect(surfaces).toBeDefined();
    expect(surfaces.palette).toBeDefined();
    expect(surfaces.actions).toBeDefined();
    expect(Array.isArray(surfaces.actions)).toBe(true);
  });

  describe('palette', () => {
    it('has a hotkey string', () => {
      const { palette } = createDefaultAISurfaces();
      expect(typeof palette.hotkey).toBe('string');
      expect(palette.hotkey.length).toBeGreaterThan(0);
    });

    it('uses Cmd+K as the default hotkey', () => {
      const { palette } = createDefaultAISurfaces();
      expect(palette.hotkey).toBe('cmd+k');
    });

    it('has a placeholder string', () => {
      const { palette } = createDefaultAISurfaces();
      expect(typeof palette.placeholder).toBe('string');
      expect(palette.placeholder.length).toBeGreaterThan(0);
    });

    it('has a suggestions array', () => {
      const { palette } = createDefaultAISurfaces();
      expect(Array.isArray(palette.suggestions)).toBe(true);
    });

    it('each suggestion has required fields', () => {
      const { palette } = createDefaultAISurfaces();
      for (const suggestion of palette.suggestions) {
        expect(typeof suggestion.id).toBe('string');
        expect(suggestion.id.length).toBeGreaterThan(0);
        expect(typeof suggestion.label).toBe('string');
        expect(suggestion.label.length).toBeGreaterThan(0);
        expect(typeof suggestion.actionId).toBe('string');
        expect(suggestion.actionId.length).toBeGreaterThan(0);
      }
    });
  });

  describe('panel', () => {
    it('defaults to right position', () => {
      const { panel } = createDefaultAISurfaces();
      expect(panel).toBeDefined();
      expect(panel!.position).toBe('right');
    });

    it('has a title string', () => {
      const { panel } = createDefaultAISurfaces();
      expect(typeof panel!.title).toBe('string');
      expect(panel!.title.length).toBeGreaterThan(0);
    });

    it('has a boolean defaultOpen', () => {
      const { panel } = createDefaultAISurfaces();
      expect(typeof panel!.defaultOpen).toBe('boolean');
    });

    it('is closed by default', () => {
      const { panel } = createDefaultAISurfaces();
      expect(panel!.defaultOpen).toBe(false);
    });
  });

  describe('actions', () => {
    it('includes at least one action with a server route', () => {
      const { actions } = createDefaultAISurfaces();
      expect(actions.length).toBeGreaterThan(0);
      for (const action of actions) {
        expect(typeof action.serverRoute).toBe('string');
        expect(action.serverRoute.length).toBeGreaterThan(0);
      }
    });

    it('each action has id, label, serverRoute, and method', () => {
      const { actions } = createDefaultAISurfaces();
      for (const action of actions) {
        expect(typeof action.id).toBe('string');
        expect(typeof action.label).toBe('string');
        expect(typeof action.serverRoute).toBe('string');
        expect(['GET', 'POST']).toContain(action.method);
      }
    });

    it('includes summarize, analyze, and suggest actions', () => {
      const { actions } = createDefaultAISurfaces();
      const ids = actions.map((a) => a.id);
      expect(ids).toContain('summarize');
      expect(ids).toContain('analyze');
      expect(ids).toContain('suggest');
    });

    it('all action IDs are unique', () => {
      const { actions } = createDefaultAISurfaces();
      const ids = actions.map((a) => a.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('server routes start with a slash', () => {
      const { actions } = createDefaultAISurfaces();
      for (const action of actions) {
        expect(action.serverRoute.startsWith('/')).toBe(true);
      }
    });
  });

  it('returns a new object on each call (no shared reference)', () => {
    const a = createDefaultAISurfaces();
    const b = createDefaultAISurfaces();
    expect(a).not.toBe(b);
    expect(a.actions).not.toBe(b.actions);
  });
});
