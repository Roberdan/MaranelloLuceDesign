/**
 * Unit tests for the <mn-theme-toggle> Web Component.
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it } from 'vitest';

describe('mn-theme-toggle', () => {
  afterEach(() => {
    document.body.className = '';
    document.body.innerHTML = '';
    try { localStorage.removeItem('mn-theme'); } catch (_error) {}
  });

  it('preserves the current theme on mount and cycles only through configured modes', async () => {
    await import('../../src/wc/mn-theme-toggle.js');
    document.body.classList.add('mn-avorio');
    const toggle = document.createElement('mn-theme-toggle');
    toggle.setAttribute('modes', 'nero,avorio');
    document.body.appendChild(toggle);
    const button = toggle.shadowRoot?.querySelector('button');
    expect(document.body.classList.contains('mn-avorio')).toBe(true);
    button?.click();
    expect(document.body.classList.contains('mn-nero')).toBe(true);
    button?.click();
    expect(document.body.classList.contains('mn-avorio')).toBe(true);
  });

  it('falls back to the first allowed mode when the current theme is outside the configured subset', async () => {
    await import('../../src/wc/mn-theme-toggle.js');
    const toggle = document.createElement('mn-theme-toggle');
    toggle.setAttribute('modes', 'nero,avorio');
    document.body.appendChild(toggle);
    expect(document.body.classList.contains('mn-nero')).toBe(true);
  });
});
