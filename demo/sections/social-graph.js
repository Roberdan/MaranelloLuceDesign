/**
 * Social graph section — Maranello Luce agent network.
 */
export function createSocialGraphSection() {
  const section = document.createElement('section');
  section.id = 'social-graph';
  section.className = 'mn-section-dark';
  section.innerHTML = `<div class="mn-container"><p class="mn-section-number">16 — Agent Graph</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Maranello Luce Hub-and-Spoke Network</h2><p class="mn-body" style="margin-bottom:var(--space-xl)">28 fictional agents across orchestrator, executor, validator, researcher, and monitor teams.</p><div class="mn-card-dark" style="padding:var(--space-xl);width:100%;margin-bottom:var(--space-md)"><div id="social-graph-canvas" style="width:100%;height:500px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:radial-gradient(circle at center, rgba(255,255,255,.05), rgba(0,0,0,.2));"></div></div><div id="social-graph-meta" class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-md)">Hover a node to inspect an agent. Drag to reposition.</div><div id="social-graph-legend" style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center"></div></div>`;
  requestAnimationFrame(() => initSocialGraph(section));
  return section;
}

function initSocialGraph(section) {
  if (!section.isConnected) return requestAnimationFrame(() => initSocialGraph(section));
  const { nodes, edges, groups } = buildSocialNetworkData();
  const graphEl = section.querySelector('#social-graph-canvas');
  const legend = section.querySelector('#social-graph-legend');
  const meta = section.querySelector('#social-graph-meta');
  const defaultMeta = 'Hover a node to inspect an agent. Drag to reposition.';
  Object.entries(groups).forEach(([team, color]) => {
    const item = document.createElement('span');
    item.className = 'mn-micro';
    item.style.cssText = 'display:inline-flex;align-items:center;gap:8px;color:var(--avorio)';
    item.innerHTML = `<span style="width:10px;height:10px;border-radius:999px;background:${color};box-shadow:0 0 0 1px rgba(255,255,255,.12)"></span>${team}`;
    legend?.appendChild(item);
  });
  const onHover = (node) => {
    if (!meta) return;
    meta.textContent = node ? `${node.label} — ${node.group} · ${node.connections} connections` : defaultMeta;
  };
  if (window.Maranello?.socialGraph) {
    window.Maranello.socialGraph(graphEl, {
      nodes,
      edges,
      groups,
      height: 500,
      onHover,
      onClick: (node) => window.Maranello.toast?.({ type: 'info', title: node.label, message: `${node.group} · ${node.connections} connections` }),
    });
    return;
  }
  drawFallbackGraph(graphEl, { nodes, edges, groups, onHover });
}

function buildSocialNetworkData() {
  const teamDefs = [
    { team: 'Orchestrators', color: '#00A651', names: ['Atlas Orchestrator Lead', 'Helix Orchestrator Lead', 'Nexus Orchestrator Lead', 'Vector Orchestrator', 'Beacon Orchestrator'], leadCount: 3, angle: 0, radius: 24 },
    { team: 'Executors', color: '#4EA8DE', names: ['Signal Executor Lead', 'Pulse Executor', 'Forge Executor', 'Circuit Executor', 'Delta Executor', 'Runner Executor', 'Matrix Executor', 'Echo Executor'], leadCount: 1, angle: -0.35, radius: 140 },
    { team: 'Validators', color: '#FFC72C', names: ['Prism Validator Lead', 'Sentinel Validator', 'Audit Validator', 'Proof Validator', 'Guard Validator'], leadCount: 1, angle: 1.0, radius: 156 },
    { team: 'Researchers', color: '#8B5CF6', names: ['Nova Researcher Lead', 'Query Researcher', 'Scout Researcher', 'Horizon Researcher', 'Mapper Researcher', 'Lens Researcher'], leadCount: 1, angle: 2.2, radius: 168 },
    { team: 'Monitors', color: '#DC0000', names: ['Relay Monitor Lead', 'Watch Monitor', 'Canary Monitor', 'Shield Monitor'], leadCount: 1, angle: 3.0, radius: 220 },
  ];
  let seed = 17;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const edgeMap = new Map();
  const teamMembers = new Map();
  const nodes = [];
  const groups = Object.fromEntries(teamDefs.map((t) => [t.team, t.color]));
  const cx = 450; const cy = 250;
  const addEdge = (a, b, weight) => {
    if (!a || !b || a.id === b.id) return;
    const key = [a.id, b.id].sort().join('::');
    const prev = edgeMap.get(key);
    if (!prev || weight > prev.weight) edgeMap.set(key, { source: a.id, target: b.id, weight: toStroke(weight) });
  };
  teamDefs.forEach((def) => {
    const members = def.names.map((label, i) => {
      const lead = i < def.leadCount;
      const spread = lead ? 26 : 52;
      const jitter = (rand() - 0.5) * spread;
      const angle = def.angle + (lead ? (i - (def.leadCount - 1) / 2) * 0.75 : (i - def.leadCount + 1) * 0.48);
      const x = cx + Math.cos(angle) * (def.radius + jitter);
      const y = cy + Math.sin(angle) * (def.radius + jitter * 0.9);
      return { id: `${def.team.toLowerCase()}-${i + 1}`, label, group: def.team, avatar: initials(label), role: lead ? `${def.team.slice(0, -1)} Lead` : def.team.slice(0, -1), lead, x, y };
    });
    teamMembers.set(def.team, members);
    nodes.push(...members);
  });
  teamMembers.forEach((members) => {
    const leads = members.filter((n) => n.lead);
    members.filter((n) => !n.lead).forEach((member, i) => addEdge(member, leads[i % leads.length], 2));
  });
  const leads = nodes.filter((n) => n.lead);
  for (let i = 0; i < leads.length; i += 1) for (let j = i + 1; j < leads.length; j += 1) addEdge(leads[i], leads[j], 1.5);
  teamMembers.forEach((members) => {
    const attempts = Math.max(2, Math.floor(members.length * 1.2));
    for (let i = 0; i < attempts; i += 1) addEdge(members[Math.floor(rand() * members.length)], members[Math.floor(rand() * members.length)], 1);
  });
  const workers = nodes.filter((n) => !n.lead);
  for (let i = 0; i < Math.floor(workers.length * 0.55); i += 1) {
    const a = workers[Math.floor(rand() * workers.length)];
    const pool = workers.filter((n) => n.group !== a.group);
    addEdge(a, pool[Math.floor(rand() * pool.length)], 0.5);
  }
  const edges = [...edgeMap.values()];
  const degree = new Map(nodes.map((n) => [n.id, 0]));
  edges.forEach((e) => { degree.set(e.source, (degree.get(e.source) || 0) + 1); degree.set(e.target, (degree.get(e.target) || 0) + 1); });
  const values = [...degree.values()];
  const min = Math.min(...values), max = Math.max(...values);
  nodes.forEach((n) => {
    const d = degree.get(n.id) || 0;
    n.connections = d;
    n.size = Math.round(10 + ((d - min) / Math.max(1, max - min)) * 20);
    n.detail = `${n.role} · ${n.group} · ${d} connections`;
  });
  return { nodes, edges, groups };
}

function drawFallbackGraph(host, opts) {
  if (!(host instanceof HTMLElement)) return;
  host.innerHTML = '';
  host.style.position = 'relative';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;cursor:default;';
  host.appendChild(canvas);
  const dpr = window.devicePixelRatio || 1;
  const nodes = opts.nodes.map((n) => ({ ...n, vx: 0, vy: 0 }));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  let drag = null;
  const resize = () => {
    const r = host.getBoundingClientRect();
    canvas.width = Math.round(Math.max(320, r.width) * dpr);
    canvas.height = Math.round(Math.max(260, r.height) * dpr);
  };
  const point = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const hit = (x, y) => [...nodes].reverse().find((n) => Math.hypot(x - n.x, y - n.y) <= n.size + 3) || null;
  const step = () => {
    const w = canvas.width / dpr; const h = canvas.height / dpr;
    nodes.forEach((n) => { n.fx = (w / 2 - n.x) * 0.004; n.fy = (h / 2 - n.y) * 0.004; });
    for (let i = 0; i < nodes.length; i += 1) for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, dist = Math.max(10, Math.hypot(dx, dy));
      const rep = 3800 / (dist * dist), nx = dx / dist, ny = dy / dist;
      a.fx += nx * rep; a.fy += ny * rep; b.fx -= nx * rep; b.fy -= ny * rep;
      const overlap = (a.size + b.size + 10) - dist;
      if (overlap > 0) { a.fx += nx * overlap * 0.12; a.fy += ny * overlap * 0.12; b.fx -= nx * overlap * 0.12; b.fy -= ny * overlap * 0.12; }
    }
    opts.edges.forEach((e) => {
      const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y, dist = Math.max(12, Math.hypot(dx, dy));
      const spring = (dist - 70) * 0.0026 * (e.weight / 1.5), nx = dx / dist, ny = dy / dist;
      a.fx += nx * spring; a.fy += ny * spring; b.fx -= nx * spring; b.fy -= ny * spring;
    });
    nodes.forEach((n) => {
      if (drag?.id === n.id) return;
      n.vx = (n.vx + n.fx) * 0.9; n.vy = (n.vy + n.fy) * 0.9;
      n.x = clamp(n.x + n.vx, n.size + 8, w - n.size - 8);
      n.y = clamp(n.y + n.vy, n.size + 8, h - n.size - 8);
    });
  };
  const draw = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = canvas.width / dpr; const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    let edgeIdx = 0;
    // Draw edges — straight lines with gradient, no blur (performance + clarity)
    ctx.globalAlpha = 1;
    ctx.lineCap = 'round';
    opts.edges.forEach((e) => {
      const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
      if (!a || !b) return;
      const colA = opts.groups[a.group] || '#FFC72C';
      const colB = opts.groups[b.group] || '#FFC72C';
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, colA + '55'); grad.addColorStop(1, colB + '55');
      ctx.strokeStyle = grad; ctx.lineWidth = Math.max(0.8, e.weight * 0.8);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    // Draw nodes — ring glow via manual alpha ring, no blur filter
    nodes.forEach((n) => {
      const col = opts.groups[n.group] || '#FFC72C';
      const r = n.size;
      // Outer soft ring
      ctx.globalAlpha = 0.18; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2); ctx.fill();
      // Solid node
      ctx.globalAlpha = 1; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      // White ring border
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.stroke();
      // Initials inside
      ctx.fillStyle = '#0a0a0a';
      ctx.font = `700 ${Math.max(9, Math.round(r * 0.72))}px 'Barlow Condensed',sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.avatar, n.x, n.y + 0.5);
      // Short label below node (first word only, leads get full first two words)
      const shortLbl = n.lead
        ? n.label.split(' ').slice(0, 2).join(' ')
        : n.label.split(' ')[0];
      ctx.fillStyle = n.lead ? col : 'rgba(200,200,200,0.55)';
      ctx.font = `${n.lead ? '600' : '400'} ${n.lead ? 9 : 8}px 'Barlow Condensed',sans-serif`;
      ctx.fillText(shortLbl, n.x, n.y + r + 10);
    });
  };
  const animate = () => {
    // Stop RAF when canvas is removed from DOM (prevents leak on section change)
    if (!canvas.isConnected) return;
    step(); draw(); requestAnimationFrame(animate);
  };
  canvas.addEventListener('mousedown', (e) => { const p = point(e); drag = hit(p.x, p.y); });
  canvas.addEventListener('mousemove', (e) => {
    const p = point(e);
    if (drag) { drag.x = p.x; drag.y = p.y; opts.onHover?.(drag); canvas.style.cursor = 'grabbing'; return; }
    const node = hit(p.x, p.y); opts.onHover?.(node || null); canvas.style.cursor = node ? 'pointer' : 'default';
  });
  window.addEventListener('mouseup', () => { drag = null; });
  canvas.addEventListener('mouseleave', () => opts.onHover?.(null));
  resize();
  new ResizeObserver(resize).observe(host);
  animate();
}

function toStroke(weight) { return clamp(0.5 + ((weight - 0.5) / 1.5) * 2.5, 0.5, 3); }
function initials(label) { return label.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase(); }
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
