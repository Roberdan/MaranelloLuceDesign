/**
 * Social graph section — FightTheStroke community network.
 */
export function createSocialGraphSection() {
  const section = document.createElement('section');
  section.id = 'social-graph';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">16 — Community Graph</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">FightTheStroke Network</h2>
      <p class="mn-body" style="margin-bottom:var(--space-xl)">50 fictional members across therapy, research, volunteering, family advocacy, and staff operations.</p>
      <div class="mn-card-dark" style="padding:var(--space-xl);width:100%;margin-bottom:var(--space-md)">
        <div id="social-graph-canvas" style="width:100%;height:500px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:radial-gradient(circle at top, rgba(255,255,255,.05), rgba(0,0,0,.15));"></div>
      </div>
      <div id="social-graph-meta" class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-md)">Hover a node to inspect a member. Drag to reposition.</div>
      <div id="social-graph-legend" style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center"></div>
    </div>
  `;
  requestAnimationFrame(() => initSocialGraph(section));
  return section;
}

function initSocialGraph(section) {
  if (!section.isConnected) return requestAnimationFrame(() => initSocialGraph(section));
  const M = window.Maranello;
  if (!M?.socialGraph) return;
  const groups = [
    ['Therapists', '#00A651', 'Therapist'],
    ['Researchers', '#4EA8DE', 'Researcher'],
    ['Volunteers', '#FFC72C', 'Volunteer'],
    ['Families', '#8B5CF6', 'Family Advocate'],
    ['Staff', '#DC0000', 'Staff Member'],
  ];
  const first = ['Ada', 'Luca', 'Mia', 'Noah', 'Elena', 'Marco', 'Sofia', 'Leo', 'Ari', 'Giulia'];
  const last = ['Bianchi', 'Rossi', 'Ferri', 'Conti', 'Greco', 'Marini', 'Gallo', 'Costa', 'Villa', 'Sala'];
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pick = (list, index) => list[index % list.length];
  const users = groups.flatMap(([group, , role], groupIndex) => Array.from({ length: 10 }, (_, localIndex) => {
    const id = `${group.toLowerCase()}-${localIndex + 1}`;
    const name = `${pick(first, groupIndex * 3 + localIndex)} ${pick(last, groupIndex * 5 + localIndex * 2)}`;
    return {
      id,
      label: name,
      group,
      avatar: name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
      detail: `${role} · ${group}`,
      size: 14 + ((localIndex + groupIndex) % 4) * 2,
    };
  }));
  const byGroup = new Map(groups.map(([group]) => [group, users.filter((user) => user.group === group)]));
  const edgeMap = new Map();
  const addEdge = (a, b, weight = 1) => {
    if (!a || !b || a.id === b.id) return;
    const key = [a.id, b.id].sort().join('::');
    if (edgeMap.has(key)) return;
    edgeMap.set(key, { source: a.id, target: b.id, weight });
  };
  groups.forEach(([group], groupIndex) => {
    const members = byGroup.get(group) || [];
    members.forEach((member, index) => {
      addEdge(member, members[(index + 1) % members.length], 1.6);
      addEdge(member, members[(index + 3) % members.length], 1.1);
      addEdge(member, members[Math.floor(rand() * members.length)], 1 + rand());
      if (index < 3) addEdge(member, users[(groupIndex * 7 + index * 3) % users.length], 0.9);
    });
  });
  while (edgeMap.size < 80) {
    const a = users[Math.floor(rand() * users.length)];
    const pool = rand() < 0.72 ? byGroup.get(a.group) || users : users;
    addEdge(a, pool[Math.floor(rand() * pool.length)], 0.8 + rand() * 1.4);
  }
  const legend = section.querySelector('#social-graph-legend');
  groups.forEach(([group, color]) => {
    const item = document.createElement('span');
    item.className = 'mn-micro';
    item.style.cssText = 'display:inline-flex;align-items:center;gap:8px;color:var(--avorio)';
    item.innerHTML = `<span style="width:10px;height:10px;border-radius:999px;background:${color};box-shadow:0 0 0 1px rgba(255,255,255,.12)"></span>${group}`;
    legend?.appendChild(item);
  });
  const meta = section.querySelector('#social-graph-meta');
  M.socialGraph(section.querySelector('#social-graph-canvas'), {
    nodes: users,
    edges: [...edgeMap.values()],
    height: 500,
    groups: Object.fromEntries(groups.map(([group, color]) => [group, color])),
    onHover: (node) => {
      if (meta) meta.textContent = node ? `${node.label} — ${node.detail}` : 'Hover a node to inspect a member. Drag to reposition.';
    },
    onClick: (node) => M.toast?.({ type: 'info', title: node.label, message: `${node.detail} · ${byGroup.get(node.group || '')?.length || 0} peers in ${node.group}` }),
  });
}
