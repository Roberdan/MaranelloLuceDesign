import { escapeHtml, cssVar } from './core/utils';
export interface GraphNode {
  id: string;
  label: string;
  group?: string;
  avatar?: string;
  detail?: string;
  size?: number;
  x?: number;
  y?: number;
}
export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  color?: string;
}
export interface SocialGraphOptions {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  onClick?: (node: GraphNode) => void;
  onHover?: (node: GraphNode | null) => void;
  groups?: Record<string, string>;
  animate?: boolean;
  showLabels?: boolean;
}
export interface SocialGraphController {
  addNode: (node: GraphNode) => void;
  removeNode: (id: string) => void;
  highlight: (id: string | null) => void;
  setData: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  destroy: () => void;
}
type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number; fx: number; fy: number };

const GROUP_COLORS: Record<string, string> = {
  default: '#FFC72C', Therapists: '#00A651', Researchers: '#4EA8DE', Volunteers: '#FFC72C', Families: '#8B5CF6', Staff: '#DC0000',
};

export function socialGraph(
  container: HTMLElement | string | null,
  opts: SocialGraphOptions = { nodes: [], edges: [] },
): SocialGraphController | null {
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  if (!(target instanceof HTMLElement)) return null;
  const hostEl: HTMLElement = target;
  hostEl.innerHTML = '';
  hostEl.style.position = 'relative';
  hostEl.style.overflow = 'hidden';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
  canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Social graph'); canvas.setAttribute('tabindex', '0');
  const tip = document.createElement('div');
  tip.className = 'mn-chart-tooltip';
  tip.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity .12s ease;max-width:220px;';
  hostEl.append(canvas, tip);

  let width = 0, height = 0, raf = 0, frame = 0;
  let nodes: SimNode[] = [], edges: GraphEdge[] = [], nodeMap = new Map<string, SimNode>(), linked = new Map<string, Set<string>>();
  let running = opts.animate !== false, hoveredId: string | null = null, highlightedId: string | null = null;
  let dragging: SimNode | null = null, dragMoved = false, resizeObs: ResizeObserver | null = null;

  const dpr = () => window.devicePixelRatio || 1;
  const activeId = () => hoveredId ?? highlightedId;
  const showLabels = opts.showLabels !== false;
  const showTip = (node: GraphNode, x: number, y: number) => {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(node.label) + '</div>' +
      (node.detail ? '<div style="font-size:.68rem;color:var(--mn-text-tertiary)">' + escapeHtml(node.detail) + '</div>' : '');
    tip.style.opacity = '1';
    const tw = tip.offsetWidth || 140, th = tip.offsetHeight || 44;
    tip.style.left = Math.max(6, Math.min(width - tw - 6, x - tw / 2)) + 'px';
    tip.style.top = Math.max(6, Math.min(height - th - 6, y - th - 14)) + 'px';
  };
  const hideTip = () => { tip.style.opacity = '0'; };
  const colorOf = (node: GraphNode) => opts.groups?.[node.group || ''] || GROUP_COLORS[node.group || ''] || GROUP_COLORS.default;
  const inside = (node: GraphNode) => {
    if (node.avatar) return node.avatar.slice(0, 2);
    const parts = node.label.split(/\s+/).filter(Boolean).slice(0, 2);
    return (parts.map((part) => part[0]).join('') || node.id.slice(0, 2)).toUpperCase();
  };
  const point = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const hit = (x: number, y: number) => [...nodes].reverse().find((node) => Math.hypot(x - node.x, y - node.y) <= (node.size || 16) + 3) || null;

  function resize(): void {
    const rect = hostEl.getBoundingClientRect();
    width = Math.max(320, Math.round(opts.width ?? rect.width ?? 0));
    height = Math.max(240, Math.round(opts.height ?? rect.height ?? 0));
    const scale = dpr();
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    draw();
  }

  function rebuild(nextNodes: GraphNode[], nextEdges: GraphEdge[]): void {
    const prev = nodeMap;
    nodes = nextNodes.map((node, index) => {
      const old = prev.get(node.id);
      const angle = (index / Math.max(nextNodes.length, 1)) * Math.PI * 2;
      const radius = Math.min(width || 640, height || 420) * 0.28;
      return {
        ...node,
        x: node.x ?? old?.x ?? (width || 640) / 2 + Math.cos(angle) * radius * (0.55 + Math.random() * 0.45),
        y: node.y ?? old?.y ?? (height || 420) / 2 + Math.sin(angle) * radius * (0.55 + Math.random() * 0.45),
        vx: old?.vx ?? 0,
        vy: old?.vy ?? 0,
        fx: 0,
        fy: 0,
      };
    });
    nodeMap = new Map(nodes.map((node) => [node.id, node]));
    edges = nextEdges.filter((edge) => nodeMap.has(edge.source) && nodeMap.has(edge.target));
    linked = new Map(nodes.map((node) => [node.id, new Set<string>()]));
    edges.forEach((edge) => { linked.get(edge.source)?.add(edge.target); linked.get(edge.target)?.add(edge.source); });
    frame = 0;
    running = opts.animate !== false && nodes.length > 1;
    canvas.setAttribute('aria-label', `Social graph: ${nodes.length} nodes, ${edges.length} connections`);
    loop();
    draw();
  }

  function step(): void {
    if (!running || nodes.length < 2) { running = false; return; }
    const area = Math.max(width * height, 1), k = Math.sqrt(area / Math.max(nodes.length, 1));
    nodes.forEach((node) => { node.fx = 0; node.fy = 0; });
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.max(12, Math.hypot(dx, dy));
        const force = (k * k) / dist, nx = dx / dist, ny = dy / dist;
        a.fx += nx * force; a.fy += ny * force; b.fx -= nx * force; b.fy -= ny * force;
      }
    }
    edges.forEach((edge) => {
      const a = nodeMap.get(edge.source), b = nodeMap.get(edge.target);
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y, dist = Math.max(12, Math.hypot(dx, dy));
      const force = ((dist * dist) / k) * 0.02 * (edge.weight || 1), nx = dx / dist, ny = dy / dist;
      a.fx += nx * force; a.fy += ny * force; b.fx -= nx * force; b.fy -= ny * force;
    });
    const cx = width / 2, cy = height / 2, temp = Math.max(0.35, 16 * (1 - frame / 200));
    nodes.forEach((node) => {
      if (dragging?.id === node.id) { node.vx = 0; node.vy = 0; return; }
      node.fx += (cx - node.x) * 0.02; node.fy += (cy - node.y) * 0.02;
      node.vx = (node.vx + node.fx * 0.008) * 0.88;
      node.vy = (node.vy + node.fy * 0.008) * 0.88;
      const mag = Math.max(1, Math.hypot(node.vx, node.vy)), move = Math.min(temp, mag);
      node.x += (node.vx / mag) * move; node.y += (node.vy / mag) * move;
      const pad = (node.size || 16) + 10;
      node.x = Math.min(width - pad, Math.max(pad, node.x));
      node.y = Math.min(height - pad, Math.max(pad, node.y));
    });
    frame += 1;
    if (frame >= 200) running = false;
  }

  function draw(): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
    ctx.clearRect(0, 0, width, height);
    const focus = activeId(), neighbors = focus ? linked.get(focus) || new Set<string>() : null;
    edges.forEach((edge) => {
      const a = nodeMap.get(edge.source), b = nodeMap.get(edge.target);
      if (!a || !b) return;
      const emphasize = !focus || edge.source === focus || edge.target === focus;
      ctx.save();
      ctx.globalAlpha = focus ? (emphasize ? 0.8 : 0.1) : 0.28;
      ctx.strokeStyle = edge.color || '#d5d9e0';
      ctx.lineWidth = Math.max(1, (edge.weight || 1) * (emphasize ? 1.5 : 1));
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.restore();
    });
    nodes.forEach((node) => {
      const radius = node.size || 16, isFocus = node.id === focus, isNear = neighbors?.has(node.id);
      ctx.save();
      ctx.globalAlpha = focus ? (isFocus || isNear ? 1 : 0.18) : 1;
      ctx.fillStyle = colorOf(node);
      if (isFocus) { ctx.shadowColor = colorOf(node); ctx.shadowBlur = 16; }
      ctx.beginPath(); ctx.arc(node.x, node.y, radius + (isFocus ? 2 : 0), 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.lineWidth = isFocus ? 2.5 : 1; ctx.strokeStyle = 'rgba(255,255,255,.72)'; ctx.stroke();
      ctx.fillStyle = '#111'; ctx.font = `600 ${Math.max(10, radius * 0.8)}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(inside(node), node.x, node.y + 0.5, radius * 1.5);
      if (showLabels) {
        ctx.fillStyle = cssVar('--mn-text', 'rgba(245,245,245,.92)');
        ctx.font = '500 12px Inter, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + radius + 8);
      }
      ctx.restore();
    });
  }

  function tick(): void {
    raf = 0;
    step();
    draw();
    if (running) loop();
  }
  function loop(): void { if (!raf && running) raf = requestAnimationFrame(tick); }

  const onMove = (event: MouseEvent) => {
    const p = point(event);
    if (dragging) {
      dragMoved = true; dragging.x = p.x; dragging.y = p.y; frame = Math.min(frame, 140); running = true; loop(); draw(); showTip(dragging, p.x, p.y); return;
    }
    const node = hit(p.x, p.y);
    if (node?.id !== hoveredId) { hoveredId = node?.id || null; opts.onHover?.(node || null); draw(); }
    if (node) { canvas.style.cursor = 'pointer'; showTip(node, p.x, p.y); } else { canvas.style.cursor = 'default'; hideTip(); }
  };
  const onUp = () => { dragging = null; canvas.style.cursor = hoveredId ? 'pointer' : 'default'; };

  canvas.addEventListener('mousedown', (event) => {
    const p = point(event), node = hit(p.x, p.y);
    if (!node) return;
    dragging = node; dragMoved = false; hoveredId = node.id; opts.onHover?.(node); showTip(node, p.x, p.y); draw();
  });
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', () => { if (!dragging) { hoveredId = null; opts.onHover?.(null); hideTip(); draw(); } });
  canvas.addEventListener('click', (event) => {
    if (dragMoved) return;
    const p = point(event), node = hit(p.x, p.y);
    if (node && opts.onClick) opts.onClick(node);
  });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  if (window.ResizeObserver && (!opts.width || !opts.height)) { resizeObs = new ResizeObserver(resize); resizeObs.observe(hostEl); }

  resize();
  rebuild(opts.nodes || [], opts.edges || []);
  return {
    addNode: (node) => rebuild([...nodes, node], edges),
    removeNode: (id) => rebuild(nodes.filter((node) => node.id !== id), edges.filter((edge) => edge.source !== id && edge.target !== id)),
    highlight: (id) => { highlightedId = id; draw(); },
    setData: (nextNodes, nextEdges) => rebuild(nextNodes, nextEdges),
    destroy: () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObs?.disconnect();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      hostEl.innerHTML = '';
    },
  };
}
