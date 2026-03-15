/**
 * Unit tests for chart accessibility: applyChartA11y with data param,
 * sr-only table injection, aria-live region.
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { applyChartA11y } from '../../src/ts/charts-helpers';
import type { A11yDataRow } from '../../src/ts/charts-helpers';

function mkCanvas(): HTMLCanvasElement {
  const parent = document.createElement('div');
  const canvas = document.createElement('canvas');
  parent.appendChild(canvas);
  return canvas;
}

describe('applyChartA11y', () => {
  it('sets role=img and aria-label', () => {
    const canvas = mkCanvas();
    applyChartA11y(canvas, 'Test chart');
    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Test chart');
  });

  it('creates sr-only span with text when no data', () => {
    const canvas = mkCanvas();
    applyChartA11y(canvas, 'Simple label');
    const sr = canvas.nextElementSibling as HTMLElement;
    expect(sr).not.toBeNull();
    expect(sr.classList.contains('mn-sr-only')).toBe(true);
    expect(sr.textContent).toBe('Simple label');
  });

  it('injects sr-only table when data provided', () => {
    const canvas = mkCanvas();
    const data: A11yDataRow[] = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
    ];
    applyChartA11y(canvas, 'Chart with data', data);
    const sr = canvas.nextElementSibling as HTMLElement;
    expect(sr.innerHTML).toContain('<table>');
    expect(sr.innerHTML).toContain('<caption>Chart with data</caption>');
    expect(sr.innerHTML).toContain('<td>A</td>');
    expect(sr.innerHTML).toContain('<td>20</td>');
  });

  it('reuses existing sr-only element on re-render', () => {
    const canvas = mkCanvas();
    applyChartA11y(canvas, 'First render');
    applyChartA11y(canvas, 'Second render');
    const siblings = canvas.parentElement!.querySelectorAll('.mn-sr-only');
    expect(siblings.length).toBe(1);
    expect(siblings[0].textContent).toBe('Second render');
  });

  it('updates from text to table on re-render', () => {
    const canvas = mkCanvas();
    applyChartA11y(canvas, 'No data');
    applyChartA11y(canvas, 'With data', [{ label: 'X', value: 5 }]);
    const sr = canvas.nextElementSibling as HTMLElement;
    expect(sr.innerHTML).toContain('<table>');
  });

  it('backward compat: works without data param', () => {
    const canvas = mkCanvas();
    applyChartA11y(canvas, 'Legacy call');
    expect(canvas.getAttribute('aria-label')).toBe('Legacy call');
  });
});
