/**
 * Unit tests for gantt defaults, date utilities, and layout helpers.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';

// --- DEFAULTS shape ---
describe('DEFAULTS object shape', () => {
  it('has expected numeric fields', async () => {
    const { DEFAULTS } = await import('../../src/ts/gantt-defaults');
    expect(typeof DEFAULTS.labelWidth).toBe('number');
    expect(typeof DEFAULTS.rowHeight).toBe('number');
    expect(typeof DEFAULTS.headerHeight).toBe('number');
    expect(typeof DEFAULTS.barHeight).toBe('number');
  });

  it('has expected boolean fields', async () => {
    const { DEFAULTS } = await import('../../src/ts/gantt-defaults');
    expect(DEFAULTS.showToday).toBe(true);
    expect(DEFAULTS.showGrid).toBe(true);
    expect(DEFAULTS.showProgress).toBe(true);
  });

  it('null-defaults for callbacks', async () => {
    const { DEFAULTS } = await import('../../src/ts/gantt-defaults');
    expect(DEFAULTS.onSelect).toBeNull();
    expect(DEFAULTS.onClick).toBeNull();
    expect(DEFAULTS.palette).toBeNull();
  });

  it('zoom range is valid (min < default < max)', async () => {
    const { DEFAULTS } = await import('../../src/ts/gantt-defaults');
    expect(DEFAULTS.minZoom).toBeLessThan(DEFAULTS.defaultZoom);
    expect(DEFAULTS.defaultZoom).toBeLessThan(DEFAULTS.maxZoom);
  });
});

// --- parseDate ---
describe('parseDate', () => {
  it('parses ISO date string', async () => {
    const { parseDate } = await import('../../src/ts/gantt-defaults');
    const d = parseDate('2025-06-15');
    expect(d).toBeInstanceOf(Date);
    expect(d!.getUTCFullYear()).toBe(2025);
    expect(d!.getUTCMonth()).toBe(5); // June = 5
    expect(d!.getUTCDate()).toBe(15);
  });

  it('returns null for falsy input', async () => {
    const { parseDate } = await import('../../src/ts/gantt-defaults');
    expect(parseDate(null)).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });

  it('returns same Date when given a Date instance', async () => {
    const { parseDate } = await import('../../src/ts/gantt-defaults');
    const d = new Date('2025-01-01T00:00:00Z');
    expect(parseDate(d)).toBe(d);
  });
});

// --- daysBetween ---
describe('daysBetween', () => {
  it('returns 0 for same date', async () => {
    const { daysBetween } = await import('../../src/ts/gantt-defaults');
    const d = new Date('2025-01-01T00:00:00Z');
    expect(daysBetween(d, d)).toBe(0);
  });

  it('returns correct days for 30-day span', async () => {
    const { daysBetween } = await import('../../src/ts/gantt-defaults');
    const a = new Date('2025-01-01T00:00:00Z');
    const b = new Date('2025-01-31T00:00:00Z');
    expect(daysBetween(a, b)).toBe(30);
  });

  it('returns negative value when b < a', async () => {
    const { daysBetween } = await import('../../src/ts/gantt-defaults');
    const a = new Date('2025-02-01T00:00:00Z');
    const b = new Date('2025-01-01T00:00:00Z');
    expect(daysBetween(a, b)).toBeLessThan(0);
  });
});

// --- hexLuminance ---
describe('hexLuminance', () => {
  it('black has luminance ~0', async () => {
    const { hexLuminance } = await import('../../src/ts/gantt-defaults');
    expect(hexLuminance('#000000')).toBeCloseTo(0);
  });

  it('white has luminance ~1', async () => {
    const { hexLuminance } = await import('../../src/ts/gantt-defaults');
    expect(hexLuminance('#ffffff')).toBeCloseTo(1, 1);
  });
});

// --- textOnBg ---
describe('textOnBg', () => {
  it('returns dark text on light background', async () => {
    const { textOnBg } = await import('../../src/ts/gantt-defaults');
    expect(textOnBg('#ffffff')).toBe('#111');
  });

  it('returns light text on dark background', async () => {
    const { textOnBg } = await import('../../src/ts/gantt-defaults');
    expect(textOnBg('#000000')).toBe('#fff');
  });
});

// --- buildRows ---
describe('buildRows', () => {
  it('returns one row per task with no children', async () => {
    const { buildRows } = await import('../../src/ts/gantt-defaults');
    const tasks = [
      { id: 't1', label: 'Task 1' },
      { id: 't2', label: 'Task 2' },
    ];
    const rows = buildRows(tasks, {});
    expect(rows.length).toBe(2);
    expect(rows[0].type).toBe('parent');
  });

  it('includes child rows when parent is expanded', async () => {
    const { buildRows } = await import('../../src/ts/gantt-defaults');
    const tasks = [
      { id: 'p1', label: 'Parent', children: [{ id: 'c1', label: 'Child' }] },
    ];
    const rows = buildRows(tasks, { p1: true });
    expect(rows.length).toBe(2);
    expect(rows[1].type).toBe('child');
  });

  it('excludes child rows when parent is collapsed', async () => {
    const { buildRows } = await import('../../src/ts/gantt-defaults');
    const tasks = [
      { id: 'p1', label: 'Parent', children: [{ id: 'c1', label: 'Child' }] },
    ];
    const rows = buildRows(tasks, {});
    expect(rows.length).toBe(1);
  });
});

// --- buildRange ---
describe('buildRange', () => {
  it('returns min and max dates from tasks', async () => {
    const { buildRange } = await import('../../src/ts/gantt-defaults');
    const tasks = [
      { id: 't1', start: '2025-01-01', end: '2025-06-30' },
      { id: 't2', start: '2025-03-01', end: '2025-12-31' },
    ];
    const range = buildRange(tasks);
    expect(range.min).toBeInstanceOf(Date);
    expect(range.max).toBeInstanceOf(Date);
    expect(range.min < range.max).toBe(true);
  });

  it('includes months array spanning the range', async () => {
    const { buildRange } = await import('../../src/ts/gantt-defaults');
    const tasks = [{ id: 't1', start: '2025-01-01', end: '2025-03-31' }];
    const range = buildRange(tasks);
    expect(Array.isArray(range.months)).toBe(true);
    expect(range.months.length).toBeGreaterThan(0);
  });
});
