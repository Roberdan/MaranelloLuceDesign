/**
 * Maranello Luce Design — Mapbox GL Map View
 * Themed wrapper around mapbox-gl with clusters, stage markers, and dark styling.
 * mapbox-gl is a peer dependency — not bundled.
 * (c) Roberdan 2026 — MIT License
 */

import { escapeHtml, isValidColor } from './core/sanitize';

/** Minimal Mapbox GL type surface — mapbox-gl is a peer dependency. */
interface MapboxMap {
  addControl: (ctrl: unknown, pos?: string) => void;
  addSource: (id: string, src: unknown) => void;
  addLayer: (layer: unknown, before?: string) => void;
  on: (event: string, cb: () => void) => void;
  flyTo: (opts: unknown) => void;
  setStyle: (style: string) => void;
  resize: () => void;
  remove: () => void;
  getZoom: () => number;
}

interface MapboxPopup {
  setHTML: (html: string) => MapboxPopup;
}

interface MapboxMapMarker {
  setLngLat: (lnglat: [number, number]) => MapboxMapMarker;
  setPopup: (popup: MapboxPopup) => MapboxMapMarker;
  addTo: (map: MapboxMap) => MapboxMapMarker;
  remove: () => void;
}

interface MapboxGL {
  accessToken: string;
  Map: new (opts: unknown) => MapboxMap;
  Popup: new (opts: unknown) => MapboxPopup;
  Marker: new (opts: { element: HTMLElement }) => MapboxMapMarker;
  NavigationControl: new (opts?: unknown) => unknown;
  AttributionControl: new (opts?: unknown) => unknown;
}

declare const mapboxgl: MapboxGL | undefined;

export interface MapboxMarker {
  id: string | number;
  lat: number;
  lon: number;
  label: string;
  detail?: string;
  stage?: string;
  color?: string;
  count?: number;
}

export interface MapboxViewOptions {
  accessToken?: string;
  style?: string;
  center?: [number, number];
  zoom?: number;
  projection?: 'globe' | 'mercator';
  markers?: MapboxMarker[];
  clusterRadius?: number;
  clusterMaxZoom?: number;
  showLegend?: boolean;
  stages?: { id: string; label: string; color: string }[];
  onClick?: (marker: MapboxMarker) => void;
  choropleth?: {
    sourceUrl: string;
    sourceLayer: string;
    property: string;
    stops: [number, string][];
  } | null;
}

export interface MapboxViewController {
  setMarkers: (markers: MapboxMarker[]) => void;
  flyTo: (lat: number, lon: number, zoom?: number) => void;
  setStyle: (style: string) => void;
  resize: () => void;
  destroy: () => void;
  getMap: () => MapboxMap;
}

const DARK_STYLE = 'mapbox://styles/mapbox/dark-v11';

const DEFAULT_STAGES = [
  { id: 'prospect', label: 'Prospect', color: '#4EA8DE' },
  { id: 'exploration', label: 'Exploration', color: '#FFC72C' },
  { id: 'sprint', label: 'Sprint', color: '#00A651' },
  { id: 'wrap-up', label: 'Wrap-up', color: '#D4622B' },
  { id: 'completed', label: 'Completed', color: '#8B5CF6' },
  { id: 'on-hold', label: 'On Hold', color: '#DC0000' },
];

function getMapboxGL(): MapboxGL | null {
  if (typeof mapboxgl !== 'undefined' && mapboxgl) return mapboxgl;
  if (typeof window !== 'undefined') {
    const win = window as unknown as Record<string, unknown>;
    if (win.mapboxgl) return win.mapboxgl as MapboxGL;
  }
  return null;
}

function safeColor(c: string | undefined, fallback: string): string {
  return c && isValidColor(c) ? c : fallback;
}

export function mapboxView(
  container: HTMLElement | string | null,
  opts?: MapboxViewOptions,
): MapboxViewController | null {
  const target = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container)
    : container;
  if (!target) return null;
  const host = target;
  const root = target;

  const mbRaw = getMapboxGL();
  if (!mbRaw) {
    host.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-dim,#666);font-size:0.8rem">mapbox-gl not loaded. Add &lt;script src="mapbox-gl.js"&gt; to use this component.</div>';
    return null;
  }
  /* Non-null after guard — captured safely in closures below. */
  const mb: MapboxGL = mbRaw;

  const o = {
    accessToken: '',
    style: DARK_STYLE,
    center: [12.0, 42.5] as [number, number],
    zoom: 3,
    projection: 'globe' as const,
    markers: [] as MapboxMarker[],
    clusterRadius: 50,
    clusterMaxZoom: 14,
    showLegend: true,
    choropleth: null as MapboxViewOptions['choropleth'],
    ...opts,
    stages: opts?.stages ?? DEFAULT_STAGES,
  };

  if (o.accessToken) mb.accessToken = o.accessToken;

  host.innerHTML = '';
  const mapDiv = document.createElement('div');
  mapDiv.style.cssText = 'width:100%;height:100%;min-height:300px';
  host.appendChild(mapDiv);

  const map = new mb.Map({
    container: mapDiv,
    style: o.style,
    center: o.center,
    zoom: o.zoom,
    projection: o.projection,
    attributionControl: false,
  });

  map.addControl(new mb.NavigationControl({ showCompass: true }), 'top-right');
  map.addControl(new mb.AttributionControl({ compact: true }));

  const stageColors: Record<string, string> = {};
  o.stages.forEach((s) => { stageColors[s.id] = s.color; });

  function markerColor(m: MapboxMarker): string {
    if (m.color) return safeColor(m.color, '#FFC72C');
    if (m.stage && stageColors[m.stage]) return safeColor(stageColors[m.stage], '#FFC72C');
    return '#FFC72C';
  }

  let markerInstances: MapboxMapMarker[] = [];

  function renderMarkers(markers: MapboxMarker[]): void {
    markerInstances.forEach((m) => m.remove());
    markerInstances = [];

    markers.forEach((m) => {
      const el = document.createElement('div');
      el.className = 'mn-mapbox-marker';
      const color = markerColor(m);
      el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color}80;cursor:pointer;transition:transform 0.15s`;
      if (m.count && m.count > 1) {
        el.style.cssText += ';width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:#000';
        el.textContent = String(m.count);
      }
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.4)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });

      const popup = new mb.Popup({ offset: 20, closeButton: false, className: 'mn-mapbox-popup' })
        .setHTML(`<div style="font-weight:600;margin-bottom:2px">${escapeHtml(m.label)}</div>${m.detail ? `<div style="font-size:0.75rem;opacity:0.7">${escapeHtml(m.detail)}</div>` : ''}`);

      const marker = new mb.Marker({ element: el })
        .setLngLat([m.lon, m.lat])
        .setPopup(popup)
        .addTo(map);

      if (o.onClick) {
        el.addEventListener('click', () => o.onClick!(m));
      }

      markerInstances.push(marker);
    });
  }

  function renderLegend(): void {
    if (!o.showLegend || !o.stages.length) return;
    const legend = document.createElement('div');
    legend.className = 'mn-mapbox-legend';
    legend.style.cssText = 'position:absolute;bottom:8px;left:8px;display:flex;gap:10px;padding:6px 10px;background:rgba(0,0,0,0.7);border-radius:6px;font-size:0.65rem;z-index:1';
    o.stages.forEach((s) => {
      const c = safeColor(s.color, '#999');
      legend.innerHTML += `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span><span style="color:var(--text-dim,#999)">${escapeHtml(s.label)}</span></span>`;
    });
    root.style.position = 'relative';
    root.appendChild(legend);
  }

  map.on('load', () => {
    renderMarkers(o.markers);
    renderLegend();

    if (o.choropleth) {
      const ch = o.choropleth;
      map.addSource('choropleth', { type: 'vector', url: ch.sourceUrl });
      map.addLayer({
        id: 'choropleth-fill',
        type: 'fill',
        source: 'choropleth',
        'source-layer': ch.sourceLayer,
        paint: {
          'fill-color': ['interpolate', ['linear'], ['get', ch.property], ...ch.stops.flat()],
          'fill-opacity': 0.5,
        },
      }, 'waterway-label');
    }
  });

  return {
    setMarkers: (markers) => { o.markers = markers; renderMarkers(markers); },
    flyTo: (lat, lon, zoom) => map.flyTo({ center: [lon, lat], zoom: zoom ?? map.getZoom(), duration: 1500 }),
    setStyle: (style) => map.setStyle(style),
    resize: () => map.resize(),
    destroy: () => { markerInstances.forEach((m) => m.remove()); map.remove(); root.innerHTML = ''; },
    getMap: () => map,
  };
}
