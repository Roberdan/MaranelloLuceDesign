/**
 * Unit tests for date-range-picker component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  dateRangePicker,
  type DateRangePickerController,
} from '../../src/ts/date-range-picker';

let container: HTMLDivElement;
let ctrl: DateRangePickerController;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  ctrl?.destroy();
  container.remove();
  document.querySelectorAll('.mn-drp__popup').forEach(el => el.remove());
});

describe('dateRangePicker', () => {
  it('creates a trigger button inside the container', () => {
    ctrl = dateRangePicker(container);
    const btn = container.querySelector('.mn-drp__trigger');
    expect(btn).not.toBeNull();
    expect(btn?.tagName).toBe('BUTTON');
  });

  it('shows default placeholder when no value set', () => {
    ctrl = dateRangePicker(container);
    const btn = container.querySelector('.mn-drp__trigger');
    expect(btn?.textContent).toContain('Select date range');
  });

  it('shows custom placeholder when provided', () => {
    ctrl = dateRangePicker(container, { placeholder: 'Pick a period' });
    const btn = container.querySelector('.mn-drp__trigger');
    expect(btn?.textContent).toContain('Pick a period');
  });

  it('displays initial value as formatted range', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-01-15', to: '2026-02-28' },
    });
    const btn = container.querySelector('.mn-drp__trigger');
    const text = btn?.textContent ?? '';
    expect(text).toContain('15 Jan 2026');
    expect(text).toContain('28 Feb 2026');
  });

  it('getValue returns current range', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-03-01', to: '2026-03-31' },
    });
    const val = ctrl.getValue();
    expect(val.from).toBe('2026-03-01');
    expect(val.to).toBe('2026-03-31');
  });

  it('getValue returns null/null when no value set', () => {
    ctrl = dateRangePicker(container);
    const val = ctrl.getValue();
    expect(val.from).toBeNull();
    expect(val.to).toBeNull();
  });

  it('setValue updates the displayed range', () => {
    ctrl = dateRangePicker(container);
    ctrl.setValue({ from: '2026-06-01', to: '2026-06-30' });
    const btn = container.querySelector('.mn-drp__trigger');
    const text = btn?.textContent ?? '';
    expect(text).toContain('1 Jun 2026');
    expect(text).toContain('30 Jun 2026');
  });

  it('open creates the popup in document.body', () => {
    ctrl = dateRangePicker(container);
    ctrl.open();
    expect(document.querySelector('.mn-drp__popup')).not.toBeNull();
  });

  it('popup contains month label and day names', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-03-10', to: null },
    });
    ctrl.open();
    const label = document.querySelector('.mn-drp__month-label');
    expect(label?.textContent).toContain('March 2026');
    const dayNames = document.querySelectorAll('.mn-drp__day-name');
    expect(dayNames.length).toBe(7);
  });

  it('popup renders day cells for the month', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-01-01', to: null },
    });
    ctrl.open();
    // January 2026 has 31 days
    const days = document.querySelectorAll('.mn-drp__day:not(.mn-drp__day--empty)');
    expect(days.length).toBe(31);
  });

  it('close removes the popup', () => {
    ctrl = dateRangePicker(container);
    ctrl.open();
    ctrl.close();
    expect(document.querySelector('.mn-drp__popup')).toBeNull();
  });

  it('closes popup on Escape key', () => {
    ctrl = dateRangePicker(container);
    ctrl.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.mn-drp__popup')).toBeNull();
  });

  it('marks disabled dates based on min/max', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-03-01', to: null },
      min: '2026-03-10',
      max: '2026-03-20',
    });
    ctrl.open();
    const disabled = document.querySelectorAll('.mn-drp__day--disabled');
    // Days 1-9 and 21-31 should be disabled
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('fires onChange when a range is completed', () => {
    const spy = vi.fn();
    ctrl = dateRangePicker(container, { onChange: spy });
    ctrl.open();
    // Click first available day to set "from"
    const firstDay = document.querySelector<HTMLElement>(
      '.mn-drp__day:not(.mn-drp__day--empty)',
    );
    firstDay?.click();
    // After first click, calendar rebuilds — re-query for second day
    const allDays = document.querySelectorAll<HTMLElement>(
      '.mn-drp__day:not(.mn-drp__day--empty)',
    );
    if (allDays.length >= 2) {
      allDays[1].click(); // sets to, triggers onChange
      expect(spy).toHaveBeenCalledOnce();
      const range = spy.mock.calls[0][0];
      expect(range.from).toBeTruthy();
      expect(range.to).toBeTruthy();
    }
  });

  it('destroy removes trigger and popup', () => {
    ctrl = dateRangePicker(container);
    ctrl.open();
    ctrl.destroy();
    expect(container.querySelector('.mn-drp__trigger')).toBeNull();
    expect(document.querySelector('.mn-drp__popup')).toBeNull();
  });

  it('prev/next buttons navigate months', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-06-15', to: null },
    });
    ctrl.open();
    const label = document.querySelector('.mn-drp__month-label');
    expect(label?.textContent).toContain('June 2026');
    const prev = document.querySelector<HTMLElement>('.mn-drp__nav--prev');
    prev?.click();
    expect(label?.textContent).toContain('May 2026');
    const next = document.querySelector<HTMLElement>('.mn-drp__nav--next');
    next?.click();
    next?.click();
    expect(label?.textContent).toContain('July 2026');
  });

  it('returns independent copy from getValue', () => {
    ctrl = dateRangePicker(container, {
      value: { from: '2026-01-01', to: '2026-01-31' },
    });
    const v1 = ctrl.getValue();
    const v2 = ctrl.getValue();
    expect(v1).not.toBe(v2);
    expect(v1).toEqual(v2);
  });
});
