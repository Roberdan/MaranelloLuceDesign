/**
 * Maranello Luce Design - Dashboard Strip
 * Composite component: configurable instrument nacelle with gauges, pipeline, trends, stats.
 */
import { createElement } from './core/utils';
import {
  renderGaugeZone, renderPipelineZone, renderTrendZone, renderBoardZone,
} from './dashboard-strip-zones';
import type {
  DashboardStripOptions, DashboardStripController, StripZone,
} from './core/types';

interface ZoneCtrl { update: Function; destroy: Function }

function renderZone(
  section: HTMLElement, zone: StripZone, animate: boolean,
): ZoneCtrl {
  switch (zone.type) {
    case 'gauge': return renderGaugeZone(section, zone, animate);
    case 'pipeline': return renderPipelineZone(section, zone, animate);
    case 'trend': return renderTrendZone(section, zone, animate);
    case 'board': return renderBoardZone(section, zone, animate);
    default:
      console.warn('[Maranello] dashboardStrip: unknown zone type');
      return { update() {}, destroy() {} };
  }
}

export function dashboardStrip(
  container: HTMLElement | string,
  opts: DashboardStripOptions,
): DashboardStripController | null {
  const root = typeof container === 'string'
    ? document.getElementById(container)
      || document.querySelector<HTMLElement>(container)
    : container;

  if (!root) {
    console.warn('[Maranello] dashboardStrip: container not found');
    return null;
  }

  const strip = createElement('div', 'mn-strip mn-strip--dashboard');
  strip.setAttribute('role', 'region');
  strip.setAttribute('aria-label', opts.ariaLabel || 'Dashboard strip');

  const inner = createElement('div', 'mn-strip__inner');
  strip.appendChild(inner);

  const animate = opts.animate !== false;
  const zoneControllers: ZoneCtrl[] = [];

  // Build grid-template-columns: gauge/board = fixed, pipeline/trend = flexible
  function gridCols(zones: StripZone[]): string {
    return zones.map((z) => {
      if (z.type === 'gauge') return 'auto';
      if (z.type === 'board') return 'auto';
      if (z.type === 'pipeline') return '2fr';
      return '1fr';
    }).join(' ');
  }

  function buildZones(): void {
    inner.textContent = '';
    zoneControllers.length = 0;
    inner.style.display = 'grid';
    inner.style.gridTemplateColumns = gridCols(opts.zones);

    for (let i = 0; i < opts.zones.length; i++) {
      const section = createElement('div', 'mn-strip__section');
      section.setAttribute('data-section', opts.zones[i].type);
      inner.appendChild(section);
      zoneControllers.push(renderZone(section, opts.zones[i], animate));
    }
  }

  root.appendChild(strip);
  buildZones();

  return {
    updateZone(index: number, data: Partial<StripZone>): void {
      if (index < 0 || index >= opts.zones.length) return;
      Object.assign(opts.zones[index], data);
      const section = inner.querySelectorAll(
        '.mn-strip__section',
      )[index] as HTMLElement | undefined;
      if (!section || !zoneControllers[index]) return;
      zoneControllers[index].destroy();
      section.textContent = '';
      zoneControllers[index] = renderZone(section, opts.zones[index], false);
    },
    destroy(): void {
      for (const c of zoneControllers) c.destroy();
      zoneControllers.length = 0;
      strip.remove();
    },
  };
}
