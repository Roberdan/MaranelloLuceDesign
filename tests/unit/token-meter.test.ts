/**
 * Unit tests for token-meter component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('tokenMeter', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  async function create(
    usage?: Parameters<typeof import('../../src/ts/token-meter').tokenMeter>[1],
    opts?: Parameters<typeof import('../../src/ts/token-meter').tokenMeter>[2],
  ) {
    const { tokenMeter } = await import('../../src/ts/token-meter');
    return tokenMeter(container, usage, opts);
  }

  it('renders default label "Token Usage"', async () => {
    await create({ prompt: 500, completion: 300 });
    const title = container.querySelector('.mn-token-meter__title');
    expect(title?.textContent).toBe('Token Usage');
  });

  it('renders custom label', async () => {
    await create({ prompt: 1200, completion: 800 }, { label: 'Claude Opus' });
    const title = container.querySelector('.mn-token-meter__title');
    expect(title?.textContent).toBe('Claude Opus');
  });

  it('renders meter bar with correct aria attributes', async () => {
    await create({ prompt: 400, completion: 600, budget: 2000 });
    const bar = container.querySelector('.mn-token-meter__bar');
    expect(bar?.getAttribute('role')).toBe('meter');
    expect(bar?.getAttribute('aria-valuenow')).toBe('1000');
    expect(bar?.getAttribute('aria-valuemax')).toBe('2000');
  });

  it('renders breakdown by default', async () => {
    await create({ prompt: 750, completion: 250 });
    const breakdown = container.querySelector('.mn-token-meter__breakdown');
    expect(breakdown).not.toBeNull();
    const counts = breakdown?.querySelectorAll('.mn-token-meter__count');
    expect(counts?.length).toBeGreaterThanOrEqual(2);
  });

  it('hides breakdown when showBreakdown is false', async () => {
    await create({ prompt: 100, completion: 200 }, { showBreakdown: false });
    const breakdown = container.querySelector('.mn-token-meter__breakdown');
    expect(breakdown).toBeNull();
  });

  it('shows cost when costPerMToken is provided', async () => {
    await create({ prompt: 500_000, completion: 500_000, costPerMToken: 15 });
    const costEl = container.querySelector('.mn-token-meter__cost');
    expect(costEl).not.toBeNull();
    expect(costEl?.textContent).toContain('$');
  });

  it('update changes aria-valuenow on bar', async () => {
    const ctrl = await create({ prompt: 100, completion: 100, budget: 1000 });
    ctrl.update({ prompt: 300, completion: 200, budget: 1000 });
    const bar = container.querySelector('.mn-token-meter__bar');
    expect(bar?.getAttribute('aria-valuenow')).toBe('500');
  });

  it('update triggers onChange callback', async () => {
    let received: unknown = null;
    const ctrl = await create(
      { prompt: 50, completion: 50 },
      { onChange: (u) => { received = u; } },
    );
    ctrl.update({ prompt: 200, completion: 100 });
    expect(received).toEqual({ prompt: 200, completion: 100 });
  });

  it('reset clears usage to zero', async () => {
    const ctrl = await create({ prompt: 800, completion: 400, budget: 2000 });
    ctrl.reset();
    const bar = container.querySelector('.mn-token-meter__bar');
    expect(bar?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('destroy empties the container', async () => {
    const ctrl = await create({ prompt: 100, completion: 50 });
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
  });

  it('adds no-anim class when animate is false', async () => {
    await create({ prompt: 100, completion: 100 }, { animate: false });
    const meter = container.querySelector('.mn-token-meter--no-anim');
    expect(meter).not.toBeNull();
  });

  it('renders cached segment inside prompt segment', async () => {
    await create({ prompt: 1000, completion: 500, cached: 400 });
    const cached = container.querySelector('.mn-token-meter__seg--cached');
    expect(cached).not.toBeNull();
  });
});
