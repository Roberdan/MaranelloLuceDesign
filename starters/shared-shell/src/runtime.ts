import type {
  SharedShellConfig,
  SharedShellController,
  SharedShellNavItem,
  SharedShellState,
} from './contracts';

function cloneMarkup(markup: string): DocumentFragment {
  return document.createRange().createContextualFragment(markup);
}

function findNavItem(config: SharedShellConfig, itemId: string): SharedShellNavItem | null {
  for (const section of config.navigation) {
    const match = section.items.find((item) => item.id === itemId);
    if (match) return match;
  }
  return null;
}

function findInitialItem(config: SharedShellConfig): SharedShellNavItem {
  for (const section of config.navigation) {
    const direct = section.items.find((item) => item.href === config.currentPath);
    if (direct) return direct;
  }
  return config.navigation[0]?.items[0] ?? { id: 'overview', label: 'Overview', href: '/' };
}

function buildLinkItem(item: SharedShellNavItem, state: SharedShellState): HTMLAnchorElement {
  const link = document.createElement('a');
  link.className = 'cvg-shared-shell__nav-link';
  link.dataset.navItemId = item.id;
  link.href = item.href;
  link.setAttribute('role', 'listitem');
  if (item.id === state.activeItemId) link.setAttribute('aria-current', 'page');
  if (item.icon) {
    const icon = document.createElement('span');
    icon.className = 'cvg-shared-shell__nav-icon';
    icon.textContent = item.icon;
    link.appendChild(icon);
  }
  const label = document.createElement('span');
  label.className = 'cvg-shared-shell__nav-label';
  label.textContent = item.label;
  link.appendChild(label);
  return link;
}

function renderNav(root: HTMLElement, config: SharedShellConfig, state: SharedShellState): void {
  const existing = root.querySelector('[data-shared-shell="nav-sections"]');
  if (existing) existing.remove();
  const list = document.createElement('div');
  list.dataset.sharedShell = 'nav-sections';
  for (const section of config.navigation) {
    const heading = document.createElement('p');
    heading.className = 'cvg-shared-shell__nav-section';
    heading.textContent = section.label;
    list.appendChild(heading);
    const sectionList = document.createElement('div');
    sectionList.className = 'cvg-shared-shell__nav-list';
    sectionList.setAttribute('role', 'list');
    for (const item of section.items) sectionList.appendChild(buildLinkItem(item, state));
    list.appendChild(sectionList);
  }
  root.appendChild(list);
}

function updateActiveNav(root: HTMLElement, state: SharedShellState): void {
  const links = root.querySelectorAll<HTMLAnchorElement>('[data-nav-item-id]');
  links.forEach((link) => {
    if (link.dataset.navItemId === state.activeItemId) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

export function renderSharedShell(
  host: HTMLElement,
  config: SharedShellConfig,
): SharedShellController {
  const initial = findInitialItem(config);
  const state: SharedShellState = { activeItemId: initial.id, currentPath: initial.href };
  host.innerHTML = '';

  const shell = document.createElement('section');
  shell.className = 'cvg-shared-shell';
  shell.dataset.themeModes = config.themes.join(',');
  shell.dataset.sharedShell = 'root';

  const header = document.createElement('header');
  header.dataset.sharedShell = 'header';
  const brand = document.createElement('a');
  brand.href = config.header.homeHref;
  brand.className = 'cvg-shared-shell__brand';
  brand.textContent = `${config.header.brandLabel} · ${config.header.productLabel}`;
  header.appendChild(brand);
  if (config.header.searchPlaceholder) {
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'cvg-shared-shell__search';
    search.placeholder = config.header.searchPlaceholder;
    search.setAttribute('aria-label', config.header.searchPlaceholder);
    header.appendChild(search);
  }
  shell.appendChild(header);

  const body = document.createElement('div');
  body.className = 'cvg-shared-shell__body';

  const nav = document.createElement('nav');
  nav.className = 'cvg-shared-shell__nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  renderNav(nav, config, state);
  body.appendChild(nav);

  const main = document.createElement('main');
  main.dataset.sharedShell = 'content';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'cvg-shared-shell__eyebrow';
  eyebrow.textContent = config.content.eyebrow ?? config.appDescription;
  main.appendChild(eyebrow);
  const title = document.createElement('h1');
  title.textContent = config.content.title;
  main.appendChild(title);
  const content = document.createElement('div');
  content.className = 'cvg-shared-shell__content';
  content.appendChild(cloneMarkup(config.content.body));
  if (config.content.supporting) content.appendChild(cloneMarkup(config.content.supporting));
  main.appendChild(content);
  body.appendChild(main);

  if (config.detailPanel) {
    const panel = document.createElement('aside');
    panel.className = 'cvg-shared-shell__detail';
    panel.setAttribute('aria-label', 'Detail panel');
    const panelTitle = document.createElement('h2');
    panelTitle.textContent = config.detailPanel.title;
    panel.appendChild(panelTitle);
    if (config.detailPanel.description) {
      const desc = document.createElement('p');
      desc.textContent = config.detailPanel.description;
      panel.appendChild(desc);
    }
    panel.appendChild(cloneMarkup(config.detailPanel.body));
    body.appendChild(panel);
  }

  shell.appendChild(body);
  host.appendChild(shell);

  return {
    destroy(): void {
      host.innerHTML = '';
    },
    getState(): Readonly<SharedShellState> {
      return Object.freeze({ ...state });
    },
    setActiveItem(itemId: string): void {
      const item = findNavItem(config, itemId);
      if (!item) return;
      state.activeItemId = item.id;
      state.currentPath = item.href;
      updateActiveNav(shell, state);
    },
  };
}
