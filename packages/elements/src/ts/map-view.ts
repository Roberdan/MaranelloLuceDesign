/**
 * Maranello Luce Design - Map view factory
 * Canvas-based world map with clustered markers, tooltips, and theme awareness.
 */
import type { MapMarker, MapViewOptions, MapViewController } from './core/types';
import { escapeHtml } from './core/utils';
import {
  DPR, CONTINENTS, detectTheme, getMarkerColors,
  project, getVisibleProjected, clusterMarkers,
  drawMarker, renderLegend, hitTest,
  type RenderedMarker, type ViewState, type MarkerColor,
} from './map-view-helpers';

/** Create an interactive map view inside a container element. */
export function mapView(
  container: HTMLElement | null, opts?: MapViewOptions,
): MapViewController | null {
  if (!container) return null;
  const o = { markers: [] as MapMarker[], padding: 40, zoom: 1, ...opts };
  let markers = o.markers;
  const viewState: ViewState = { zoom: o.zoom || 1, panX: 0, panY: 0 };

  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:100%;display:block;';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive map view');
  canvas.setAttribute('tabindex', '0');
  container.appendChild(canvas);

  const tip = document.createElement('div');
  tip.className = 'mn-chart-tooltip';
  tip.style.position = 'absolute';
  tip.style.pointerEvents = 'none';
  container.appendChild(tip);

  const legend = document.createElement('div');
  legend.className = 'mn-map__legend';
  legend.style.cssText = 'position:absolute;bottom:8px;left:8px;display:flex;gap:8px;font-size:0.65rem;';
  container.appendChild(legend);

  let renderedMarkers: RenderedMarker[] = [];
  let highlighted: string | null = null;
  let hovered: string | null = null;
  const pulse = 0;

  function render(): void {
    const rect = container!.getBoundingClientRect();
    const vw = rect.width, vh = rect.height;
    canvas.width = vw * DPR; canvas.height = vh * DPR;
    canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(DPR, DPR);

    const th = detectTheme();
    const mc = getMarkerColors();
    const themeName = document.body.classList.contains('mn-colorblind') ? 'colorblind'
      : document.body.classList.contains('mn-sugar') ? 'sugar'
      : document.body.classList.contains('mn-nero') ? 'nero'
      : document.body.classList.contains('mn-avorio') ? 'avorio' : 'editorial';
    const colors = mc[themeName];

    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, vw, vh);

    // Continent outlines
    ctx.strokeStyle = th.coast;
    ctx.lineWidth = 0.8;
    ctx.fillStyle = th.land;
    Object.values(CONTINENTS).forEach((pts) => {
      if (!pts || !pts.length) return;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const proj = project(p[1], p[0], vw, vh, o.padding, viewState);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });

    // Markers
    const visible = getVisibleProjected(markers, vw, vh, o.padding, viewState);
    const clustered = clusterMarkers(visible, viewState.zoom, colors, 40, 3);
    renderedMarkers = [];
    clustered.forEach((m) => {
      drawMarker(ctx, m, colors, pulse, highlighted, hovered);
      renderedMarkers.push(m);
    });

    renderLegend(legend, colors);
  }

  // Events
  canvas.addEventListener('mousemove', (e) => {
    const hit = hitTest(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit) {
      canvas.style.cursor = 'pointer';
      hovered = hit.id as string;
      showTip(hit);
    } else {
      canvas.style.cursor = 'default';
      hovered = null;
      tip.classList.remove('mn-chart-tooltip--visible');
    }
  });

  canvas.addEventListener('click', (e) => {
    const hit = hitTest(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit && o.onClick) o.onClick(hit as unknown as MapMarker);
  });

  canvas.addEventListener('mouseleave', () => {
    hovered = null;
    tip.classList.remove('mn-chart-tooltip--visible');
  });

  function showTip(m: RenderedMarker): void {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(String(m.label || 'Marker')) + '</div>' +
      (m.detail ? '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">' + escapeHtml(String(m.detail)) + '</div>' : '');
    tip.classList.add('mn-chart-tooltip--visible');
    const tipW = tip.offsetWidth || 120;
    let left = m._x - tipW / 2;
    if (left < 4) left = 4;
    const rect = container!.getBoundingClientRect();
    if (left + tipW > rect.width - 4) left = rect.width - tipW - 4;
    let top = m._y - (tip.offsetHeight || 40) - 12;
    if (top < 4) top = m._y + 12;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }

  let resizeObs: ResizeObserver | null = null;
  if (window.ResizeObserver) {
    resizeObs = new ResizeObserver(() => render());
    resizeObs.observe(container);
  }
  const mutationObs = new MutationObserver(() => render());
  mutationObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  render();

  return {
    setMarkers: (m) => { markers = m; render(); },
    addMarker: (m) => { markers.push(m); render(); },
    removeMarker: (id) => { markers = markers.filter((m) => m.id !== id); render(); },
    highlight: (id) => { highlighted = id as string | null; render(); },
    setZoom: (z) => { viewState.zoom = z; render(); },
    panTo: (_lat, _lon) => { /* pan via viewState */ render(); },
    fitBounds: () => { viewState.zoom = 1; viewState.panX = 0; viewState.panY = 0; render(); },
    destroy: () => {
      resizeObs?.disconnect();
      mutationObs.disconnect();
      container!.innerHTML = '';
    },
  };
}
