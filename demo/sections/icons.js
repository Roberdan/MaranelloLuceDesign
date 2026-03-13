/**
 * Icons section — full icon catalog with grouped grid, size variants, and semantic colors.
 */
const ICON_GROUPS = {
  navigation: ['dashboard', 'home', 'menu', 'chevronRight', 'chevronDown', 'chevronLeft', 'chevronUp', 'arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight', 'externalLink', 'sidebar'],
  status: ['checkCircle', 'alertTriangle', 'alertCircle', 'info', 'atRisk', 'completed', 'blocked', 'loader', 'shield', 'shieldCheck', 'refresh', 'settings'],
  actions: ['close', 'edit', 'copy', 'trash', 'download', 'upload', 'plus', 'minus', 'filter'],
  data: ['gauge', 'trendUp', 'trendDown', 'barChart', 'toggleOn', 'toggleOff', 'kpi', 'impact', 'pipeline', 'orgChart', 'treeView'],
  objects: ['user', 'users', 'userGroup', 'briefcase', 'admin', 'key', 'lock', 'unlock', 'bell', 'bellDot'],
  domain: ['project', 'workspace', 'nowNext'],
};
const GROUP_META = [['navigation', 'Navigation'], ['status', 'Status'], ['actions', 'Actions'], ['data', 'Data'], ['objects', 'Objects'], ['domain', 'Domain']];

export function createIconsSection() {
  const section = document.createElement('section');
  section.id = 'icons';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">11 — Iconography</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Icon Catalog</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">Maranello Luce icon language for agent operations interfaces.</p>
      ${GROUP_META.map(([key, label]) => `<div style="margin-bottom:var(--space-2xl)"><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">${label}</h3><div id="icon-group-${key}" class="mn-card-dark" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:var(--space-xs);padding:var(--space-md)"></div></div>`).join('')}
      <div style="margin-bottom:var(--space-2xl)"><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Size Variants</h3><div class="mn-card-dark" style="padding:var(--space-md)"><div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);align-items:flex-end">${['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => `<div style="text-align:center;min-width:58px"><span class="mn-icon mn-icon--${size}" id="icon-size-${size}"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">${size}</div></div>`).join('')}</div></div></div>
      <div><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Semantic Colors</h3><div class="mn-card-dark" style="padding:var(--space-md)"><div style="display:flex;flex-wrap:wrap;gap:var(--space-lg)"><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-success" style="color:var(--verde-racing)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">success</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-warning" style="color:var(--giallo-ferrari)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">warning</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-danger" style="color:var(--rosso-corsa)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">danger</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-info" style="color:#4EA8DE"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">info</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-muted" style="color:var(--grigio-medio)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">muted</div></div></div></div></div>
    </div>
  `;
  requestAnimationFrame(() => initIcons(section));
  return section;
}
function iconGrid(groupName, iconNames, section) { const M = window.Maranello; if (!M?.icons) return; const container = section.querySelector(`#icon-group-${groupName}`); if (!container) return; const catalog = typeof M.iconCatalog === 'function' ? new Set(M.iconCatalog()) : null; iconNames.forEach((name) => { if (catalog && !catalog.has(name)) return; const fn = M.icons[name]; if (!fn) return; const cell = document.createElement('div'); cell.style.cssText = 'text-align:center;padding:var(--space-sm)'; cell.innerHTML = `<span class="mn-icon mn-icon--md" style="color:var(--grigio-chiaro)">${fn()}</span><div class="mn-micro" style="color:var(--grigio-medio);margin-top:4px">${name}</div>`; container.appendChild(cell); }); }
function initIcons(section) { const M = window.Maranello; if (!M?.icons) return; GROUP_META.forEach(([key]) => iconGrid(key, ICON_GROUPS[key], section)); if (typeof M.renderIcon === 'function') { ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].forEach((size) => { const el = section.querySelector(`#icon-size-${size}`); if (el) M.renderIcon(el, 'dashboard', { size, ariaLabel: `dashboard ${size}` }); }); ['icon-color-success', 'icon-color-warning', 'icon-color-danger', 'icon-color-info', 'icon-color-muted'].forEach((id) => { const el = section.querySelector(`#${id}`); if (el) M.renderIcon(el, 'dashboard', { size: 'lg', ariaLabel: id.replace('icon-color-', '') }); }); } }
