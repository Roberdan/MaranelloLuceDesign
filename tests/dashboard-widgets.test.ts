/** @vitest-environment happy-dom */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sparklineMock, createGaugeMock } = vi.hoisted(() => ({
  sparklineMock: vi.fn(),
  createGaugeMock: vi.fn(() => ({ redraw: vi.fn(), destroy: vi.fn(), config: {} })),
}));

vi.mock('../src/ts/charts', () => ({
  sparkline: sparklineMock,
  donut: vi.fn(),
  barChart: vi.fn(),
  hBarChart: vi.fn(),
  areaChart: vi.fn(),
  liveGraph: vi.fn(),
  halfGauge: vi.fn(),
  progressRing: vi.fn(),
  flipCounter: vi.fn(),
  radar: vi.fn(),
  bubble: vi.fn(),
}));

vi.mock('../src/ts/gauge-engine-class', () => ({
  createGauge: createGaugeMock,
}));

import { createDashboardWidget } from '../src/ts/dashboard-widgets';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  sparklineMock.mockReset();
  createGaugeMock.mockClear();
});

describe('KPI widget — safe DOM', () => {
  it('renders articles with correct class names', () => {
    const w = createDashboardWidget({ type: 'kpi-strip' });
    w.render(container, [
      { label: 'Revenue', value: '$1.2M', delta: '+5%' },
      { label: 'Users', value: '3400' },
    ]);
    expect(container.classList.contains('mn-dashboard-kpi-strip')).toBe(true);
    const articles = container.querySelectorAll('article.mn-dashboard-kpi');
    expect(articles).toHaveLength(2);
    expect(articles[0].querySelector('.mn-dashboard-kpi__label')!.textContent).toBe('Revenue');
    expect(articles[0].querySelector('.mn-dashboard-kpi__value')!.textContent).toBe('$1.2M');
    expect(articles[0].querySelector('.mn-dashboard-kpi__delta')!.textContent).toBe('+5%');
    expect(articles[1].querySelector('.mn-dashboard-kpi__delta')).toBeNull();
  });

  it('escapes XSS in label and value', () => {
    const w = createDashboardWidget({ type: 'kpi-strip' });
    w.render(container, [{ label: '<script>alert(1)</script>', value: '<img onerror=alert(1)>' }]);
    /* No actual script or img elements should be created — textContent is safe */
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    const label = container.querySelector('.mn-dashboard-kpi__label');
    expect(label!.textContent).toBe('<script>alert(1)</script>');
    const value = container.querySelector('.mn-dashboard-kpi__value');
    expect(value!.textContent).toBe('<img onerror=alert(1)>');
  });

  it('uses textContent not innerHTML for user data', () => {
    const w = createDashboardWidget({ type: 'kpi-strip' });
    w.render(container, [{ label: 'Test', value: '42' }]);
    /* No innerHTML assignment in source — verify structure uses elements */
    expect(container.querySelector('.mn-dashboard-kpi__label')!.tagName).toBe('P');
    expect(container.querySelector('.mn-dashboard-kpi__value')!.tagName).toBe('P');
  });
});

describe('Stat widget — safe DOM', () => {
  it('renders article with correct structure', () => {
    const w = createDashboardWidget({ type: 'stat-card', options: { icon: 'chart-icon', label: 'Fallback' } });
    w.render(container, { value: 99, label: 'Active Sessions' });
    const article = container.querySelector('article.mn-dashboard-stat');
    expect(article).not.toBeNull();
    expect(article!.querySelector('.mn-dashboard-stat__icon')!.textContent).toBe('chart-icon');
    expect(article!.querySelector('.mn-dashboard-stat__value')!.textContent).toBe('99');
    expect(article!.querySelector('.mn-dashboard-stat__label')!.textContent).toBe('Active Sessions');
  });

  it('escapes XSS in stat values', () => {
    const w = createDashboardWidget({ type: 'stat-card' });
    w.render(container, { value: '<img src=x onerror=alert(1)>', label: '<b>bold</b>' });
    /* No actual img or b elements created — textContent is safe */
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('.mn-dashboard-stat__value')!.textContent).toBe('<img src=x onerror=alert(1)>');
    expect(container.querySelector('.mn-dashboard-stat__label')!.textContent).toBe('<b>bold</b>');
  });

  it('uses option label as fallback', () => {
    const w = createDashboardWidget({ type: 'stat-card', options: { label: 'Default Label' } });
    w.render(container, { value: 7 });
    expect(container.querySelector('.mn-dashboard-stat__label')!.textContent).toBe('Default Label');
  });
});

describe('Legend widget — safe DOM', () => {
  it('renders list with swatch and label', () => {
    const w = createDashboardWidget({ type: 'legend' });
    w.render(container, [
      { label: 'Series A', color: '#ff0000' },
      { label: 'Series B', color: 'var(--mn-accent)' },
    ]);
    const ul = container.querySelector('ul.mn-dashboard-legend');
    expect(ul).not.toBeNull();
    const items = ul!.querySelectorAll('li.mn-dashboard-legend__item');
    expect(items).toHaveLength(2);
    const swatch0 = items[0].querySelector('.mn-dashboard-legend__swatch') as HTMLElement;
    /* happy-dom may keep hex or convert to rgb — accept either */
    const bg0 = swatch0.style.background;
    expect(bg0 === '#ff0000' || bg0.includes('rgb(255, 0, 0)') || bg0.includes('rgb(255,0,0)')).toBe(true);
    expect(items[0].querySelectorAll('span')[1].textContent).toBe('Series A');
  });

  it('validates colors and rejects CSS injection', () => {
    const w = createDashboardWidget({ type: 'legend' });
    w.render(container, [
      { label: 'Malicious', color: 'red; background-image: url(evil.com)' },
      { label: 'Valid', color: 'blue' },
    ]);
    const swatches = container.querySelectorAll('.mn-dashboard-legend__swatch') as NodeListOf<HTMLElement>;
    /* Invalid color should fall back to accent token */
    expect(swatches[0].style.background).not.toContain('evil.com');
    /* Valid color should work */
    expect(swatches[1].style.background).toContain('blue');
  });

  it('escapes XSS in legend labels', () => {
    const w = createDashboardWidget({ type: 'legend' });
    w.render(container, [{ label: '<script>xss</script>', color: '#000' }]);
    /* No actual script element created — textContent is safe */
    expect(container.querySelector('script')).toBeNull();
    const labelSpan = container.querySelector('.mn-dashboard-legend__item span:last-child');
    expect(labelSpan!.textContent).toBe('<script>xss</script>');
  });
});

describe('Table widget — safe DOM', () => {
  it('renders table with headers and rows', () => {
    const w = createDashboardWidget({ type: 'table-summary' });
    w.render(container, {
      headers: ['Name', 'Score'],
      rows: [['Alice Johnson', '95'], ['Bob Martinez', '88']],
    });
    const table = container.querySelector('table.mn-dashboard-table-summary');
    expect(table).not.toBeNull();
    const ths = table!.querySelectorAll('th');
    expect(ths).toHaveLength(2);
    expect(ths[0].textContent).toBe('Name');
    const tds = table!.querySelectorAll('td');
    expect(tds).toHaveLength(4);
    expect(tds[0].textContent).toBe('Alice Johnson');
  });

  it('escapes XSS in table headers and cells', () => {
    const w = createDashboardWidget({ type: 'table-summary' });
    w.render(container, {
      headers: ['<img onerror=alert(1)>'],
      rows: [['<script>document.cookie</script>']],
    });
    /* No actual script or img elements created — textContent is safe */
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('th')!.textContent).toBe('<img onerror=alert(1)>');
    expect(container.querySelector('td')!.textContent).toBe('<script>document.cookie</script>');
  });
});

describe('Widget update and destroy', () => {
  it('update re-renders kpi with new data', () => {
    const w = createDashboardWidget({ type: 'kpi-strip' });
    w.render(container, [{ label: 'Old', value: '1' }]);
    w.update([{ label: 'New', value: '2' }]);
    expect(container.querySelector('.mn-dashboard-kpi__label')!.textContent).toBe('New');
  });

  it('destroy clears container', () => {
    const w = createDashboardWidget({ type: 'kpi-strip' });
    w.render(container, [{ label: 'Test', value: '1' }]);
    w.destroy();
    expect(container.innerHTML).toBe('');
  });
});

describe('No innerHTML in source', () => {
  it('source file does not use innerHTML for widget rendering', async () => {
    /* This is validated by verify commands:
       ! grep -n 'innerHTML' src/ts/dashboard-widgets.ts
       We test the observable behavior: user data never creates real HTML elements */
    const xss = '<div id="xss-proof">gotcha</div>';
    const w = createDashboardWidget({ type: 'kpi-strip' });
    w.render(container, [{ label: xss, value: xss }]);
    expect(container.querySelector('#xss-proof')).toBeNull();
  });
});
