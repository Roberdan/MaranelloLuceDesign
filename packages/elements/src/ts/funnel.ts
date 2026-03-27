/**
 * Maranello Luce Design - Funnel/Sankey pipeline visualization (SVG)
 * Per-stage exit branches for On Hold / Withdrawn.
 */
import type { PipelineStage, SankeyData, SankeyOptions, SankeyController } from './core/types';
import { isValidColor } from './core/sanitize';
import { resolveContainer, svgEl, svgText, trapPath, cumulativeReach, autoTextColor } from './funnel-helpers';

const BAR_H = 38, GAP = 24, RAD = 6, VB_W = 420, PAD = 16, MIN_BAR = 0.35;
const EXIT_R = 12, EXIT_GAP = 6;
const PIPE_L = 80, PIPE_R = 340, PIPE_W = PIPE_R - PIPE_L;

/** Create an SVG Sankey funnel inside a container. */
export function funnel(
  container: string | Element | null, options?: SankeyOptions,
): SankeyController {
  const target = resolveContainer(container);
  if (!target) throw new Error('funnel: container not found.');
  const host = target as HTMLElement;
  const opts: SankeyOptions = { animate: true, ...options };
  let destroyed = false;
  const root = document.createElement('div');
  root.className = 'mn-funnel';
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', 'Pipeline funnel');

  function render(data: SankeyData | null | undefined): void {
    if (destroyed) return;
    root.innerHTML = '';
    if (!data || !data.pipeline || !data.pipeline.length) {
      root.innerHTML = '<p class="mn-funnel__empty">No pipeline stages available.</p>';
      return;
    }
    const pipe = data.pipeline;
    const maxC = Math.max(...pipe.map((s) => s.count || 1));
    const total = data.total || pipe.reduce((a, s) => a + s.count, 0);
    const reach = cumulativeReach(pipe.map((s) => s.count));
    const rows = pipe.length;
    const containerH = (host as HTMLElement).clientHeight || 0;
    const dynH = containerH > 100 ? containerH : 0;
    const barH = dynH > 0 ? Math.max(28, Math.floor((dynH - PAD * 2 - (rows - 1) * 24) / rows)) : BAR_H;
    const gap = dynH > 0 ? 24 : GAP;
    const svgH = PAD * 2 + rows * barH + (rows - 1) * gap;
    const svg = svgEl('svg', { viewBox: '0 0 ' + VB_W + ' ' + svgH, preserveAspectRatio: 'xMidYMid meet' }) as SVGSVGElement;
    svg.style.width = '100%'; svg.style.height = dynH > 0 ? '100%' : 'auto';

    pipe.forEach((stageRaw, i) => {
      const stage = isValidColor(stageRaw.color) ? stageRaw : { ...stageRaw, color: 'var(--mn-border-strong)' };
      const barW = Math.max(PIPE_W * MIN_BAR, (stage.count / maxC) * PIPE_W);
      const barX = PIPE_L + (PIPE_W - barW) / 2;
      const y = PAD + i * (barH + gap);

      // Connector
      if (i < rows - 1) {
        const ns = pipe[i + 1];
        const nW = Math.max(PIPE_W * MIN_BAR, (ns.count / maxC) * PIPE_W);
        const nX = PIPE_L + (PIPE_W - nW) / 2;
        svg.appendChild(svgEl('path', { d: trapPath(barX, barW, nX, nW, y + barH, y + barH + gap), fill: stage.color, opacity: '0.12' }));
        const rate = reach[i] > 0 ? Math.round(reach[i + 1] / reach[i] * 100) : 0;
        svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + barH + gap / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': 9, style: "font-family:var(--font-display,'Barlow Condensed',sans-serif)", fill: 'var(--mn-text-muted)', 'font-weight': '500' }, '\u2193 ' + rate + '%'));
      }

      // Bar
      const bar = svgEl('rect', { x: barX, y, width: barW, height: barH, rx: RAD, fill: stage.color });
      bar.classList.add('mn-funnel__bar');
      bar.setAttribute('data-stage', stage.label);
      if (opts.animate) { (bar as SVGElement & ElementCSSInlineStyle).style.opacity = '0'; (bar as SVGElement & ElementCSSInlineStyle).style.transform = 'translateX(-12px)'; }
      svg.appendChild(bar);

      // Labels
      const tc = autoTextColor(stage.color);
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + Math.round(barH * 0.37), 'text-anchor': 'middle', 'font-size': 11, style: "font-family:var(--font-body,'Inter',sans-serif)", fill: tc, 'font-weight': '600' }, stage.label));
      let cTxt = String(stage.count);
      if (total > 0) cTxt += ' (' + Math.round(stage.count / total * 100) + '%)';
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + Math.round(barH * 0.76), 'text-anchor': 'middle', 'font-size': 14, style: "font-family:var(--font-display,'Barlow Condensed',sans-serif)", fill: tc, 'font-weight': '700' }, cTxt));

      // Exit branches
      const holdClr = isValidColor(data.onHold?.color || '') ? data.onHold!.color : '#ea580c';
      const wdClr = isValidColor(data.withdrawn?.color || '') ? data.withdrawn!.color : '#666';
      if (stage.holdCount && stage.holdCount > 0) renderExitPill(svg, barX, y, 'left', stage.holdCount, holdClr, '\u23F8');
      if (stage.withdrawnCount && stage.withdrawnCount > 0) renderExitPill(svg, barX + barW, y, 'right', stage.withdrawnCount, wdClr, '\u2715');

      // Hover + Click selection
      const hit = svgEl('rect', { x: barX, y, width: barW, height: barH, fill: 'transparent', cursor: 'pointer', 'pointer-events': 'all' });
      hit.addEventListener('mouseenter', () => {
        (bar as SVGElement & ElementCSSInlineStyle).style.filter = 'brightness(1.3)';
        (bar as SVGElement & ElementCSSInlineStyle).style.transition = 'filter 0.15s';
      });
      hit.addEventListener('mouseleave', () => {
        (bar as SVGElement & ElementCSSInlineStyle).style.filter = '';
      });
      hit.addEventListener('click', () => {
        svg.querySelectorAll('.mn-funnel__sel').forEach(el => el.remove());
        const sel = svgEl('rect', { x: barX - 2, y: y - 2, width: barW + 4, height: barH + 4, fill: 'none', stroke: '#FFC72C', 'stroke-width': '2', rx: '6', class: 'mn-funnel__sel' });
        svg.appendChild(sel);
        if (opts.onClick) opts.onClick(stage);
      });
      svg.appendChild(hit);

      if (opts.animate) {
        setTimeout(() => {
          (bar as SVGElement & ElementCSSInlineStyle).style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          (bar as SVGElement & ElementCSSInlineStyle).style.opacity = '1';
          (bar as SVGElement & ElementCSSInlineStyle).style.transform = 'none';
        }, 60 * i + 30);
      }
    });

    // Legend
    const legendY = svgH - 4;
    if (data.onHold && data.onHold.count > 0) {
      const ohLegClr = isValidColor(data.onHold.color) ? data.onHold.color : '#ea580c';
      svg.appendChild(svgEl('circle', { cx: PIPE_L, cy: legendY, r: 4, fill: ohLegClr, opacity: '0.8' }));
      svg.appendChild(svgText({ x: PIPE_L + 8, y: legendY + 3, 'font-size': 9, style: "font-family:var(--font-body,'Inter',sans-serif)", fill: 'var(--mn-text-muted)', 'font-weight': '500' }, '\u23F8 On Hold: ' + data.onHold.count));
    }
    if (data.withdrawn && data.withdrawn.count > 0) {
      const wdLegClr = isValidColor(data.withdrawn.color) ? data.withdrawn.color : '#666';
      svg.appendChild(svgEl('circle', { cx: PIPE_L + PIPE_W / 2 + 20, cy: legendY, r: 4, fill: wdLegClr, opacity: '0.8' }));
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2 + 28, y: legendY + 3, 'font-size': 9, style: "font-family:var(--font-body,'Inter',sans-serif)", fill: 'var(--mn-text-muted)', 'font-weight': '500' }, '\u2715 Withdrawn: ' + data.withdrawn.count));
    }
    root.appendChild(svg);
  }

  function renderExitPill(svg: SVGElement, anchorX: number, barY: number, side: string, count: number, color: string, icon: string): void {
    const isLeft = side === 'left';
    const cy = barY + BAR_H / 2;
    const pillX = isLeft ? anchorX - EXIT_GAP - EXIT_R * 2 - 20 : anchorX + EXIT_GAP;
    const lineEnd = isLeft ? pillX + EXIT_R * 2 + 20 : pillX;
    svg.appendChild(svgEl('line', { x1: anchorX, y1: cy, x2: lineEnd, y2: cy, stroke: color, 'stroke-width': '1.5', 'stroke-dasharray': '3 2', opacity: '0.5' }));
    const pw = EXIT_R * 2 + 20, ph = 20;
    svg.appendChild(svgEl('rect', { x: pillX, y: cy - ph / 2, width: pw, height: ph, rx: ph / 2, fill: color, opacity: '0.18' }));
    svg.appendChild(svgText({ x: pillX + pw / 2, y: cy + 3.5, 'text-anchor': 'middle', 'font-size': 10, style: "font-family:var(--font-display,'Barlow Condensed',sans-serif)", fill: color, 'font-weight': '600' }, icon + ' ' + count));
  }

  host.innerHTML = '';
  host.appendChild(root);
  render((opts as Record<string, unknown>).data as SankeyData | null);
  return {
    update: (d) => { render(d); },
    destroy: () => { if (destroyed) return; destroyed = true; root.innerHTML = ''; if (root.parentNode === host) host.removeChild(root); },
  };
}
