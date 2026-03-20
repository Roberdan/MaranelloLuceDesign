/** Maranello Luce Design - BCG Matrix (Canvas 2D) */
import { cssVar } from './core/utils';
import { escapeHtml } from './core/sanitize';
import { chartHiDpi, hexToRgba, applyChartA11y } from './charts-helpers';

export interface BCGItem {
  id: string;
  label: string;
  marketShare: number;
  growthRate: number;
  size?: number;
  color?: string;
}

export interface BCGMatrixOptions {
  items: BCGItem[];
  height?: number;
  shareThreshold?: number;
  growthThreshold?: number;
  onHover?: (item: BCGItem | null) => void;
  onClick?: (item: BCGItem) => void;
  animate?: boolean;
}

export interface BCGMatrixController {
  update: (items: BCGItem[]) => void;
  destroy: () => void;
}

type Quad = 'Stars' | 'Cash Cows' | '? Marks' | 'Dogs';
const MARGIN = { top: 16, right: 16, bottom: 40, left: 48 };
const FONT = '10px Inter, sans-serif';
const QUADS: Quad[] = ['Stars', 'Cash Cows', '? Marks', 'Dogs'];

function resolveColor(raw: string | undefined, fb: string): string {
  if (!raw) return fb;
  const m = raw.match(/^var\(--([\w-]+)/);
  return m ? cssVar(`--${m[1]}`, fb) : raw;
}

function quadOf(it: BCGItem, sT: number, gT: number): Quad {
  const hs = it.marketShare >= sT, hg = it.growthRate >= gT;
  if (hs && hg) return 'Stars';
  if (hs) return 'Cash Cows';
  if (hg) return '? Marks';
  return 'Dogs';
}
function quadHex(q: Quad): string {
  const isSugar = document.body.classList.contains('mn-sugar');
  const m: Record<Quad, [string, string]> = {
    'Stars': ['--signal-ok', '#00A651'],
    'Cash Cows': isSugar ? ['--signal-warning', '#F59E0B'] : ['--mn-accent', '#FFC72C'],
    '? Marks': ['--signal-warning', '#FFC72C'],
    'Dogs': isSugar ? ['--mn-text-muted', '#767676'] : ['--mn-border-subtle', '#4d4d4d'],
  };
  const [v, fb] = m[q];
  return cssVar(v, fb);
}

function qColor(q: Quad, a: number): string {
  const h = quadHex(q);
  return h.startsWith('#') && h.length >= 7 ? hexToRgba(h, a) : h;
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '\u2026' : s;
}

/** Render an interactive BCG Matrix on a canvas element. */
export function bcgMatrix(
  canvas: HTMLCanvasElement, opts: BCGMatrixOptions,
): BCGMatrixController | undefined {
  const sT = opts.shareThreshold ?? 0.5;
  const gT = opts.growthThreshold ?? 10;
  const doAnim = opts.animate !== false;
  let items = [...opts.items];
  let hovId: string | null = null;
  let prog = doAnim ? 0 : 1;
  let raf = 0;
  let dead = false;

  const rect = canvas.getBoundingClientRect();
  const w = Math.max(rect.width, 200);
  const h = opts.height ?? 320;
  const _ctx = chartHiDpi(canvas, w, h);
  if (!_ctx) return undefined;
  const ctx = _ctx;
  const pL = MARGIN.left, pT = MARGIN.top;
  const pW = w - MARGIN.left - MARGIN.right;
  const pH = h - MARGIN.top - MARGIN.bottom;

  const gRange = () => {
    const rs = items.map((i) => i.growthRate);
    return { mn: Math.min(0, ...rs) - 5, mx: Math.max(20, ...rs) + 5 };
  };
  const toX = (s: number) => pL + (1 - s) * pW;
  const toY = (g: number) => {
    const { mn, mx } = gRange();
    return pT + (1 - (g - mn) / (mx - mn)) * pH;
  };
  const bR = (sz: number) => 8 + sz * 3;

  function draw(sc: number): void {
    ctx.clearRect(0, 0, w, h);
    const tm = cssVar('--mn-text-muted');
    const bd = cssVar('--mn-border');
    const sf = cssVar('--mn-surface');
    const tx = cssVar('--mn-text');
    const midX = toX(sT), midY = toY(gT);

    /* Quadrant fills */
    const qr: [number, number, number, number, Quad][] = [
      [pL, pT, midX - pL, midY - pT, 'Stars'],
      [pL, midY, midX - pL, pT + pH - midY, 'Cash Cows'],
      [midX, pT, pL + pW - midX, midY - pT, '? Marks'],
      [midX, midY, pL + pW - midX, pT + pH - midY, 'Dogs'],
    ];
    for (const [x, y, qw, qh, q] of qr) {
      ctx.fillStyle = qColor(q, 0.10);
      ctx.fillRect(x, y, qw, qh);
    }

    /* Quadrant labels */
    ctx.font = FONT; ctx.fillStyle = tm;
    ctx.textAlign = 'left';
    ctx.fillText('Stars', pL + 6, pT + 14);
    ctx.fillText('Cash Cows', pL + 6, pT + pH - 6);
    ctx.textAlign = 'right';
    ctx.fillText('? Marks', pL + pW - 6, pT + 14);
    ctx.fillText('Dogs', pL + pW - 6, pT + pH - 6);

    /* Dashed midpoint lines */
    ctx.strokeStyle = bd; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, pT); ctx.lineTo(midX, pT + pH);
    ctx.moveTo(pL, midY); ctx.lineTo(pL + pW, midY);
    ctx.stroke(); ctx.setLineDash([]);

    /* Axis labels */
    ctx.fillStyle = tm; ctx.font = FONT; ctx.textAlign = 'center';
    ctx.fillText('\u2190 Relative Market Share \u2192', pL + pW / 2, h - 8);
    ctx.save();
    ctx.translate(12, pT + pH / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Market Growth Rate %', 0, 0);
    ctx.restore();

    /* Bubbles */
    for (const it of items) {
      const bx = toX(it.marketShare), by = toY(it.growthRate);
      const r = bR(it.size ?? 5) * sc;
      const q = quadOf(it, sT, gT);
      ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fillStyle = resolveColor(it.color, qColor(q, 0.70));
      ctx.fill();
      ctx.strokeStyle = resolveColor(it.color, qColor(q, 1));
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = tx; ctx.font = FONT; ctx.textAlign = 'center';
      ctx.fillText(trunc(it.label, 12), bx, by + r + 12);

      if (it.id === hovId) {
        ctx.beginPath(); ctx.arc(bx, by, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = cssVar('--mn-accent');
        ctx.lineWidth = 2; ctx.stroke();
        /* Tooltip */
        const l1 = it.label;
        const l2 = `Share: ${(it.marketShare * 100).toFixed(0)}% | Growth: ${it.growthRate.toFixed(1)}%`;
        ctx.font = FONT;
        const tw = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 12;
        const tbx = Math.min(Math.max(bx - tw / 2, pL), pL + pW - tw);
        const tby = Math.max(by - r - 36, pT);
        ctx.fillStyle = sf; ctx.fillRect(tbx, tby, tw, 30);
        ctx.strokeStyle = bd; ctx.lineWidth = 1; ctx.strokeRect(tbx, tby, tw, 30);
        ctx.fillStyle = tx; ctx.textAlign = 'left';
        ctx.fillText(l1, tbx + 6, tby + 12);
        ctx.fillText(l2, tbx + 6, tby + 24);
      }
    }
  }

  function hitTest(ex: number, ey: number): BCGItem | null {
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const dx = ex - toX(it.marketShare), dy = ey - toY(it.growthRate);
      if (Math.hypot(dx, dy) <= bR(it.size ?? 5)) return it;
    }
    return null;
  }

  const coords = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onMove = (e: MouseEvent): void => {
    const hit = hitTest(coords(e).x, coords(e).y);
    const nid = hit?.id ?? null;
    if (nid !== hovId) { hovId = nid; draw(prog); opts.onHover?.(hit); }
  };
  const onDown = (e: MouseEvent): void => {
    const hit = hitTest(coords(e).x, coords(e).y);
    if (hit) opts.onClick?.(hit);
  };
  const onLeave = (): void => {
    if (hovId) { hovId = null; draw(prog); opts.onHover?.(null); }
  };

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mouseleave', onLeave);

  function applyA11y(): void {
    const grp: Record<Quad, string[]> = { 'Stars': [], 'Cash Cows': [], '? Marks': [], 'Dogs': [] };
    for (const it of items) grp[quadOf(it, sT, gT)].push(it.label);
    const desc = QUADS.filter((q) => grp[q].length > 0)
      .map((q) => `${q}: ${grp[q].join(', ')}`).join('. ');
    const label = `BCG matrix with ${items.length} items. ${desc}`;
    const rows = items.map((it) => ({
      label: escapeHtml(it.label),
      value: `Share ${(it.marketShare * 100).toFixed(0)}%, Growth ${it.growthRate.toFixed(1)}%, ${quadOf(it, sT, gT)}`,
    }));
    applyChartA11y(canvas, label, rows);
  }

  if (doAnim) {
    const t0 = performance.now();
    const tick = (now: number): void => {
      if (dead) return;
      prog = Math.min((now - t0) / 400, 1);
      draw(1 - Math.pow(1 - prog, 3));
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  } else { draw(1); }
  applyA11y();

  return {
    update(newItems: BCGItem[]): void {
      items = [...newItems]; prog = 1; draw(1); applyA11y();
    },
    destroy(): void {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mouseleave', onLeave);
      const sr = canvas.nextElementSibling;
      if (sr?.classList.contains('mn-sr-only')) sr.remove();
    },
  };
}
