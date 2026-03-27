/**
 * Maranello Luce Design - System status indicator
 * Compact pill with expandable service health panel.
 */

import { createElement } from './core/utils';
import type {
  SystemStatusService,
  SystemStatusCheckResult,
  SystemStatusRenderedResult,
  SystemStatusOptions,
  SystemStatusController,
} from './core/types';

export type { SystemStatusService, SystemStatusCheckResult, SystemStatusRenderedResult, SystemStatusOptions, SystemStatusController };

type RenderedResult = SystemStatusRenderedResult;

function statusClass(ok: boolean, ms: number): 'danger' | 'warning' | 'active' {
  if (!ok) return 'danger';
  if (ms > 1000) return 'warning';
  return 'active';
}

function overallStatus(results: RenderedResult[]): { label: string; cls: 'danger' | 'warning' | 'active' } {
  if (results.some((r) => !r.ok)) return { label: 'Degraded Performance', cls: 'danger' };
  if (results.some((r) => r.ms > 1000)) return { label: 'Partial Degradation', cls: 'warning' };
  return { label: 'All Systems Operational', cls: 'active' };
}

/**
 * Create a system status indicator with optional auto-polling.
 */
export function systemStatus(
  container: string | HTMLElement,
  opts?: SystemStatusOptions,
): SystemStatusController | null {
  const options = {
    version: '',
    environment: '',
    services: [] as SystemStatusService[],
    pollInterval: 30000,
    onClick: undefined as SystemStatusOptions['onClick'],
    ...opts,
  };

  const host = typeof container === 'string' ? document.querySelector<HTMLElement>(container) : container;
  if (!host) return null;

  host.innerHTML = '';
  host.classList.add('mn-sys-status');

  const pill = createElement('button', 'mn-sys-status__pill', {
    'aria-label': 'System status',
    'aria-expanded': 'false',
  });
  const dot = createElement('span', 'mn-sys-status__dot mn-sys-status__dot--active');
  const verSpan = createElement('span', 'mn-sys-status__version', { text: options.version });
  const envSpan = createElement('span', 'mn-sys-status__env', { text: options.environment });

  pill.appendChild(dot);
  pill.appendChild(verSpan);
  if (options.environment) {
    pill.appendChild(document.createTextNode(' \u00B7 '));
    pill.appendChild(envSpan);
  }
  host.appendChild(pill);

  const panel = createElement('div', 'mn-sys-status__panel', { role: 'status', 'aria-live': 'polite' });
  const headerRow = createElement('div', 'mn-sys-status__header');
  const headerDot = createElement('span', 'mn-sys-status__dot mn-sys-status__dot--active');
  const headerLabel = createElement('span', 'mn-sys-status__header-label', { text: 'Checking\u2026' });
  headerRow.appendChild(headerDot);
  headerRow.appendChild(headerLabel);
  panel.appendChild(headerRow);
  const serviceList = createElement('div', 'mn-sys-status__services');
  panel.appendChild(serviceList);
  host.appendChild(panel);

  let isOpen = false;
  let results: RenderedResult[] = [];
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  pill.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('mn-sys-status__panel--open', isOpen);
    pill.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && results.length === 0) void refresh();
  });

  function onDocClick(e: MouseEvent): void {
    const target = e.target as Node | null;
    if (target && isOpen && !host!.contains(target)) {
      isOpen = false;
      panel.classList.remove('mn-sys-status__panel--open');
      pill.setAttribute('aria-expanded', 'false');
    }
  }
  function onDocKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      panel.classList.remove('mn-sys-status__panel--open');
      pill.setAttribute('aria-expanded', 'false');
    }
  }
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKey);

  function renderResults(): void {
    serviceList.innerHTML = '';
    results.forEach((r, i) => {
      const row = createElement('div', 'mn-sys-status__service');
      row.appendChild(createElement('span', `mn-sys-status__dot mn-sys-status__dot--${statusClass(r.ok, r.ms)}`));
      row.appendChild(createElement('span', 'mn-sys-status__service-name', { text: r.name }));
      const sMs = createElement('span', 'mn-sys-status__service-ms', { text: r.ok ? `${r.ms}ms` : 'DOWN' });
      if (!r.ok) sMs.classList.add('mn-sys-status__service-ms--down');
      row.appendChild(sMs);
      if (options.onClick) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => options.onClick?.(options.services[i], r));
      }
      serviceList.appendChild(row);
    });

    const overall = overallStatus(results);
    headerDot.className = `mn-sys-status__dot mn-sys-status__dot--${overall.cls}`;
    headerLabel.textContent = overall.label;
    dot.className = `mn-sys-status__dot mn-sys-status__dot--${overall.cls}`;
  }

  async function refresh(): Promise<void> {
    headerLabel.textContent = 'Checking\u2026';
    results = await Promise.all(
      options.services.map(async (svc): Promise<RenderedResult> => {
        const start = performance.now();
        try {
          if (svc.check) {
            const res = await svc.check();
            return { name: svc.name, ok: res.ok !== false, ms: Math.round(res.ms ?? (performance.now() - start)) };
          }
          await new Promise<void>((r) => setTimeout(r, 50 + Math.random() * 300));
          return { name: svc.name, ok: true, ms: Math.round(performance.now() - start) };
        } catch {
          return { name: svc.name, ok: false, ms: Math.round(performance.now() - start) };
        }
      }),
    );
    renderResults();
  }

  if (options.pollInterval > 0) {
    pollTimer = setInterval(() => void refresh(), options.pollInterval);
  }
  void refresh();

  return {
    refresh,
    destroy(): void {
      if (pollTimer) clearInterval(pollTimer);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onDocKey);
      host!.innerHTML = '';
      host!.classList.remove('mn-sys-status');
    },
  };
}
