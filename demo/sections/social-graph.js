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
  // Virtual coordinate space — matches buildSocialNetworkData (cx=450, cy=250)
  const VW = 900, VH = 500;
  const nodes = opts.nodes.map((n) => ({ ...n, ox: n.x, oy: n.y }));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  let drag = null;

  const resize = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(320, r.width), h = Math.max(260, r.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const sx = w / VW, sy = h / VH;
    // Scale positions from virtual space — skip dragged node
    nodes.forEach((n) => { if (drag?.id === n.id) return; n.x = n.ox * sx; n.y = n.oy * sy; });
    draw();
  };

  const point = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const hit = (x, y) => [...nodes].reverse().find((n) => Math.hypot(x - n.x, y - n.y) <= n.size + 4) ?? null;

  const draw = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = canvas.width / dpr, h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    // Team cluster halos — subtle ring around each team
    const teams = new Map();
    nodes.forEach((n) => { if (!teams.has(n.group)) teams.set(n.group, []); teams.get(n.group).push(n); });
    teams.forEach((members, team) => {
      const col = opts.groups[team] || '#FFC72C';
      const tcx = members.reduce((s, n) => s + n.x, 0) / members.length;
      const tcy = members.reduce((s, n) => s + n.y, 0) / members.length;
      const rad = Math.max(...members.map((n) => Math.hypot(n.x - tcx, n.y - tcy) + n.size + 22));
      ctx.globalAlpha = 0.04; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(tcx, tcy, rad, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.09; ctx.strokeStyle = col; ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.arc(tcx, tcy, rad, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    });

    // Edges — quadratic bezier curves with gradient
    ctx.globalAlpha = 1; ctx.lineCap = 'round';
    opts.edges.forEach((e) => {
      const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
      if (!a || !b) return;
      const colA = opts.groups[a.group] || '#FFC72C';
      const colB = opts.groups[b.group] || '#FFC72C';
      // Perpendicular control point gives gentle arc
      const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
      const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, colA + '50'); grad.addColorStop(1, colB + '50');
      ctx.strokeStyle = grad; ctx.lineWidth = Math.max(0.6, e.weight * 0.7);
      ctx.beginPath(); ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mx, my, b.x, b.y); ctx.stroke();
    });

    // Nodes — layered glow + fill + border + initials + label
    nodes.forEach((n) => {
      const col = opts.groups[n.group] || '#FFC72C';
      const r = n.size;
      ctx.globalAlpha = 0.07; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 12, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.15;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = n.lead ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = n.lead ? 2 : 1;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#0a0a0a';
      ctx.font = `700 ${Math.max(8, Math.round(r * 0.72))}px 'Barlow Condensed',sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.avatar, n.x, n.y + 0.5);
      const lbl = n.lead ? n.label.split(' ').slice(0, 2).join(' ') : n.label.split(' ')[0];
      ctx.fillStyle = n.lead ? col : 'rgba(205,205,205,0.65)';
      ctx.font = `${n.lead ? '600' : '400'} ${n.lead ? 9 : 8}px 'Barlow Condensed',sans-serif`;
      ctx.fillText(lbl, n.x, n.y + r + 11);
    });
  };

  canvas.addEventListener('mousedown', (e) => { const p = point(e); drag = hit(p.x, p.y); });
  canvas.addEventListener('mousemove', (e) => {
    const p = point(e);
    if (drag) { drag.x = p.x; drag.y = p.y; opts.onHover?.(drag); canvas.style.cursor = 'grabbing'; draw(); return; }
    const node = hit(p.x, p.y); opts.onHover?.(node ?? null); canvas.style.cursor = node ? 'pointer' : 'default';
  });
  window.addEventListener('mouseup', () => { drag = null; });
  canvas.addEventListener('mouseleave', () => opts.onHover?.(null));
  canvas.addEventListener('click', (e) => {
    const p = point(e); const n = hit(p.x, p.y);
    if (n) opts.onClick?.(n);
  });
  resize();
  new ResizeObserver(resize).observe(host);
}

function toStroke(weight) { return Math.min(3, Math.max(0.5, 0.5 + ((weight - 0.5) / 1.5) * 2.5)); }
function initials(label) { return label.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase(); }
