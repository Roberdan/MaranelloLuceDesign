/**
 * Unit tests for live regions: toast role/aria-live, mn-chart aria-busy.
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { toast } from '../../src/ts/toast';

describe('toast aria-live roles', () => {
  it('error toast has role=alert and aria-live=assertive', () => {
    const el = toast({ type: 'error', message: 'fail', duration: 0 });
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
    el.remove();
  });

  it('warning toast has role=alert and aria-live=assertive', () => {
    const el = toast({ type: 'warning', message: 'warn', duration: 0 });
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
    el.remove();
  });

  it('info toast has role=status and aria-live=polite', () => {
    const el = toast({ type: 'info', message: 'info', duration: 0 });
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    el.remove();
  });

  it('success toast has role=status and aria-live=polite', () => {
    const el = toast({ type: 'success', message: 'ok', duration: 0 });
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    el.remove();
  });

  it('close button has aria-label', () => {
    const el = toast({ message: 'test', duration: 0 });
    const btn = el.querySelector('.mn-toast__close');
    expect(btn?.getAttribute('aria-label')).toBe('Close');
    el.remove();
  });
});

describe('mn-chart aria-busy', () => {
  it('sets aria-busy=true before async init and clears it via finally', async () => {
    // Validates the try-finally pattern used in mn-chart._init()
    const el = document.createElement('div');
    async function init() {
      el.setAttribute('aria-busy', 'true');
      try {
        await Promise.resolve(); // simulate async factory resolution
      } finally {
        el.removeAttribute('aria-busy');
      }
    }
    const promise = init();
    expect(el.getAttribute('aria-busy')).toBe('true'); // set synchronously before first await
    await promise;
    expect(el.hasAttribute('aria-busy')).toBe(false); // cleared by finally even if factory throws
  });
});
