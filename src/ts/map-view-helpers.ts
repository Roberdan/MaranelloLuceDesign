/**
 * Maranello Luce Design - Map view helpers
 * Projection, clustering, marker drawing, legend rendering, and hit testing.
 */
import type { MapMarker, MapViewOptions, ThemePalette } from './core/types';
import { cssVar, clamp } from './core/utils';

export type MarkerColor = 'active' | 'warning' | 'danger';
export type MarkerSize = 'sm' | 'md' | 'lg';

export interface ProjectedMarker extends MapMarker {
  _x: number;
  _y: number;
}

export interface ClusterMarker extends ProjectedMarker {
  isCluster: true;
  clusterCount: number;
  mixedColor: string;
  _members: ProjectedMarker[];
}

export type RenderedMarker = ProjectedMarker | ClusterMarker;

export interface ViewState {
  zoom: number;
  panX: number;
  panY: number;
}

export const DPR = window.devicePixelRatio || 1;
export const TAU = Math.PI * 2;

const SIZE_PX: Record<string, number> = { sm: 6, md: 10, lg: 14 };

const THEMES: Record<string, ThemePalette> = {
  editorial: { land: '#333330', water: '#0d0d0d', border: '#444440', grid: 'rgba(200,200,200,0.06)', text: '#c8c8c8', muted: '#616161' },
  nero: { land: '#2e2e2a', water: '#080808', border: '#444440', grid: 'rgba(200,200,200,0.05)', text: '#c8c8c8', muted: '#555' },
  avorio: { land: '#e8d5b0', water: '#faf3e6', border: '#d7c39a', grid: 'rgba(0,0,0,0.05)', text: '#1a1a1a', muted: '#888' },
  colorblind: { land: '#1a1a1a', water: '#0a0a0a', border: '#2a2a2a', grid: 'rgba(200,200,200,0.04)', text: '#c8c8c8', muted: '#616161' },
};

function ll(lon: number, lat: number): [number, number] { return [lon, lat]; }

export const CONTINENTS: Record<string, Array<[number, number]>> = {
  northAmerica: [ll(-130,55),ll(-125,60),ll(-115,62),ll(-100,63),ll(-95,68),ll(-88,65),ll(-80,62),ll(-65,60),ll(-60,50),ll(-65,45),ll(-70,42),ll(-75,35),ll(-80,30),ll(-85,28),ll(-90,28),ll(-97,25),ll(-100,20),ll(-105,20),ll(-110,23),ll(-115,30),ll(-120,34),ll(-125,40),ll(-125,48),ll(-130,55)],
  southAmerica: [ll(-80,10),ll(-75,5),ll(-70,8),ll(-60,5),ll(-50,0),ll(-45,-3),ll(-35,-5),ll(-35,-12),ll(-38,-18),ll(-42,-22),ll(-48,-26),ll(-50,-30),ll(-55,-34),ll(-58,-38),ll(-65,-42),ll(-68,-50),ll(-72,-48),ll(-75,-42),ll(-72,-35),ll(-70,-28),ll(-70,-18),ll(-75,-12),ll(-78,-2),ll(-80,2),ll(-80,10)],
  europe: [ll(-10,36),ll(-8,42),ll(-5,44),ll(0,44),ll(3,48),ll(5,52),ll(8,55),ll(12,56),ll(15,58),ll(20,60),ll(25,62),ll(28,65),ll(30,62),ll(32,58),ll(35,55),ll(40,52),ll(38,48),ll(35,45),ll(30,42),ll(28,38),ll(25,36),ll(20,36),ll(15,38),ll(10,38),ll(5,40),ll(0,40),ll(-5,38),ll(-10,36)],
  africa: [ll(-15,15),ll(-17,20),ll(-15,28),ll(-5,35),ll(5,36),ll(10,37),ll(15,33),ll(25,32),ll(30,30),ll(32,28),ll(35,25),ll(40,15),ll(42,12),ll(50,10),ll(48,5),ll(42,0),ll(38,-5),ll(35,-10),ll(32,-15),ll(35,-25),ll(30,-32),ll(25,-34),ll(20,-34),ll(18,-30),ll(15,-25),ll(12,-18),ll(12,-10),ll(10,-2),ll(8,4),ll(5,5),ll(0,5),ll(-5,5),ll(-10,8),ll(-15,10),ll(-15,15)],
  asia: [ll(40,52),ll(45,55),ll(55,55),ll(60,58),ll(70,62),ll(80,65),ll(100,68),ll(120,65),ll(130,60),ll(135,55),ll(140,50),ll(142,45),ll(140,40),ll(135,35),ll(130,32),ll(122,28),ll(115,25),ll(110,20),ll(105,15),ll(100,12),ll(98,8),ll(100,5),ll(105,0),ll(95,5),ll(88,22),ll(82,18),ll(75,15),ll(72,20),ll(68,24),ll(62,25),ll(55,25),ll(50,28),ll(45,32),ll(42,38),ll(40,42),ll(38,48),ll(40,52)],
  oceania: [ll(115,-12),ll(120,-15),ll(130,-12),ll(135,-15),ll(140,-18),ll(145,-20),ll(148,-22),ll(150,-25),ll(152,-28),ll(150,-32),ll(148,-35),ll(142,-38),ll(138,-35),ll(135,-32),ll(130,-30),ll(125,-28),ll(120,-25),ll(118,-22),ll(115,-18),ll(115,-12)],
};

export function detectTheme(): ThemePalette & { coast: string; bg: string } {
  const b = document.body.classList;
  const name = b.contains('mn-colorblind') ? 'colorblind' : b.contains('mn-nero') ? 'nero' : b.contains('mn-avorio') ? 'avorio' : 'editorial';
  const t = THEMES[name];
  return { ...t, coast: t.border, bg: t.water };
}

export function getMarkerColors(): Record<string, Record<MarkerColor, string>> {
  return {
    editorial: { active: cssVar('--signal-ok', '#00A651'), warning: cssVar('--signal-warning', '#FFC72C'), danger: cssVar('--signal-danger', '#DC0000') },
    nero: { active: cssVar('--signal-ok', '#00A651'), warning: cssVar('--signal-warning', '#FFC72C'), danger: cssVar('--signal-danger', '#DC0000') },
    avorio: { active: cssVar('--signal-ok', '#00A651'), warning: cssVar('--arancio', '#D4622B'), danger: cssVar('--signal-danger', '#DC0000') },
    colorblind: { active: '#0072B2', warning: '#FFB000', danger: '#D55E00' },
  };
}

export function project(lat: number, lon: number, w: number, h: number, pad: number, vs?: ViewState): { x: number; y: number } {
  const baseW = Math.max(1, w - pad * 2), baseH = Math.max(1, h - pad * 2);
  if (!vs) return { x: ((lon + 180) / 360) * baseW + pad, y: ((90 - lat) / 180) * baseH + pad };
  const zoom = vs.zoom || 1;
  const worldW = baseW * zoom, worldH = baseH * zoom;
  const cx = (w / 2) * zoom, cy = (h / 2) * zoom;
  const wx = ((lon + 180) / 360) * worldW, wy = ((90 - lat) / 180) * worldH;
  return { x: wx - cx + w * 0.5 + (vs.panX || 0), y: wy - cy + h * 0.5 + (vs.panY || 0) };
}

export function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

export function getVisibleProjected(source: MapMarker[], vw: number, vh: number, padding: number, viewState: ViewState): ProjectedMarker[] {
  const out: ProjectedMarker[] = [];
  for (let i = 0; i < source.length; i++) {
    const m = source[i];
    const p = project(m.lat, m.lon, vw, vh, padding, viewState);
    if (p.x >= -120 && p.x <= vw + 120 && p.y >= -120 && p.y <= vh + 120) {
      out.push({ ...m, _x: p.x, _y: p.y } as ProjectedMarker);
    }
  }
  return out;
}

export function clusterMarkers(
  source: ProjectedMarker[], zoom: number, markerColors: Record<MarkerColor, string>,
  clusterRadius: number, minClusterSize: number,
): RenderedMarker[] {
  const cellSize = Math.max(16, clusterRadius / Math.max(0.5, zoom));
  const buckets: Record<string, ProjectedMarker[]> = {};
  for (const m of source) {
    const key = Math.floor(m._x / cellSize) + ':' + Math.floor(m._y / cellSize);
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(m);
  }
  let clustered: RenderedMarker[] = [];
  for (const key of Object.keys(buckets)) {
    const group = buckets[key];
    if (group.length >= minClusterSize) {
      let xAcc = 0, yAcc = 0;
      for (const g of group) { xAcc += g._x; yAcc += g._y; }
      clustered.push({
        id: 'cluster-' + key, isCluster: true as const, clusterCount: group.length,
        count: group.length, lat: group[0].lat, lon: group[0].lon,
        label: group.length + ' locations', detail: 'Grouped nearby markers',
        color: 'active', mixedColor: mixClusterColor(group, markerColors),
        _x: xAcc / group.length, _y: yAcc / group.length, _members: group, size: 10,
      } as ClusterMarker);
    } else { clustered = clustered.concat(group); }
  }
  return clustered;
}

function mixClusterColor(items: ProjectedMarker[], mc: Record<MarkerColor, string>): string {
  let rAcc = 0, gAcc = 0, bAcc = 0, total = 0;
  const counts: Record<string, number> = { active: 0, warning: 0, danger: 0 };
  for (const m of items) {
    const key = (m.color as MarkerColor) || 'active';
    counts[key] = (counts[key] || 0) + 1; total++;
    const col = mc[key as MarkerColor] || mc.active;
    rAcc += parseInt(col.slice(1, 3), 16); gAcc += parseInt(col.slice(3, 5), 16); bAcc += parseInt(col.slice(5, 7), 16);
  }
  let dom: MarkerColor = 'active';
  if (counts.warning > counts[dom]) dom = 'warning';
  if (counts.danger > counts[dom]) dom = 'danger';
  const dh = mc[dom];
  const dr = parseInt(dh.slice(1, 3), 16), dg = parseInt(dh.slice(3, 5), 16), db = parseInt(dh.slice(5, 7), 16);
  const ar = total ? Math.round(rAcc / total) : dr, ag = total ? Math.round(gAcc / total) : dg, ab = total ? Math.round(bAcc / total) : db;
  return 'rgb(' + Math.round(dr * 0.65 + ar * 0.35) + ',' + Math.round(dg * 0.65 + ag * 0.35) + ',' + Math.round(db * 0.65 + ab * 0.35) + ')';
}

export function markerRadius(m: RenderedMarker): number {
  const base = SIZE_PX[(m.size as unknown as string) || 'md'] || SIZE_PX.md;
  const count = Math.max(1, parseInt(String(m.count || 1), 10) || 1);
  if ('isCluster' in m && m.isCluster) return clamp(10 + Math.sqrt(Math.max(1, (m as ClusterMarker).clusterCount || count)) * 2.4, 12, 30);
  if (count > 1) return clamp(base + Math.sqrt(count) * 1.6, 8, 26);
  return base;
}

export function drawMarker(
  ctx: CanvasRenderingContext2D, m: RenderedMarker,
  mc: Record<MarkerColor, string>, pulse: number,
  highlighted: string | null, hovered: string | null,
): void {
  const x = m._x, y = m._y, r = markerRadius(m);
  const isCluster = 'isCluster' in m && m.isCluster;
  const col = isCluster ? ((m as ClusterMarker).mixedColor || mc.active) : (mc[(m.color as MarkerColor) || 'active'] || mc.active);
  const isHl = highlighted === m.id;
  const isHov = hovered === m.id;
  const count = Math.max(1, parseInt(String(m.count || 1), 10) || 1);
  const showCount = count > 1 || isCluster;
  const pScale = 1 + Math.sin(pulse + (m.lat * 0.1)) * 0.25;
  const outerR = r * pScale * (isHl ? 1.6 : 1.3);
  ctx.beginPath(); ctx.arc(x, y, outerR, 0, TAU); ctx.fillStyle = hexToRgba(col, 0.15); ctx.fill();
  const coreR = showCount ? (isHov ? r * 1.05 : r) : (isHov ? r * 1.2 : r * 0.5);
  ctx.beginPath(); ctx.arc(x, y, coreR, 0, TAU); ctx.fillStyle = col; ctx.fill();
  if (showCount) {
    ctx.fillStyle = isCluster ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.14)';
    ctx.beginPath(); ctx.arc(x, y, coreR * 0.72, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '600 ' + Math.max(11, Math.round(coreR * 0.85)) + 'px "Barlow Condensed",sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(count), x, y + 0.5);
  } else {
    ctx.beginPath(); ctx.arc(x, y, coreR * 0.4, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
  }
}

export function renderLegend(legendEl: HTMLElement | null, mc: Record<MarkerColor, string>): void {
  if (!legendEl) {
    console.warn('[Maranello] renderLegend: legend container element is null');
    return;
  }
  legendEl.innerHTML = '';
  const cats: MarkerColor[] = ['active', 'warning', 'danger'];
  const labels = ['Active', 'Warning', 'Danger'];
  for (let i = 0; i < cats.length; i++) {
    const item = document.createElement('div');
    item.className = 'mn-map__legend-item';
    const dot = document.createElement('span');
    dot.className = 'mn-map__legend-dot'; dot.style.background = mc[cats[i]];
    item.appendChild(dot); item.appendChild(document.createTextNode(labels[i]));
    legendEl.appendChild(item);
  }
}

export function hitTest(clientX: number, clientY: number, canvas: HTMLCanvasElement, markers: RenderedMarker[]): RenderedMarker | null {
  const cr = canvas.getBoundingClientRect();
  const mx = clientX - cr.left, my = clientY - cr.top;
  for (let i = markers.length - 1; i >= 0; i--) {
    const m = markers[i], r = markerRadius(m);
    const dx = mx - m._x, dy = my - m._y;
    if (dx * dx + dy * dy <= (r + 4) * (r + 4)) return m;
  }
  return null;
}
