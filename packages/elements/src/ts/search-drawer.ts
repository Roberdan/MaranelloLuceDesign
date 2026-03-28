/**
 * Maranello Luce Design - Search drawer
 * Opens a right-side drawer with search input, async results, and sections.
 */

import { isValidColor } from './core/sanitize';
import { debounce } from './core/utils';
import { openDrawer, closeDrawer } from './controls';

export interface SearchDrawerResult {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}

export interface SearchDrawerOptions {
  title: string;
  placeholder?: string;
  onSearch: (query: string) => Promise<SearchDrawerResult[]>;
  onResultClick: (result: SearchDrawerResult) => void;
  sections?: Array<{
    id: string;
    label: string;
    renderer: (el: HTMLElement) => void;
  }>;
}

export interface SearchDrawerController {
  close: () => void;
  setResults: (results: SearchDrawerResult[]) => void;
  setLoading: (loading: boolean) => void;
}

/** Unique id counter for drawer elements. */
let drawerCounter = 0;

/** Open a search drawer on the right side. */
export function openSearchDrawer(
  opts: SearchDrawerOptions,
): SearchDrawerController {
  const {
    title, onSearch, onResultClick,
    placeholder = 'Search...',
    sections = [],
  } = opts;

  /* Create drawer container in the DOM */
  drawerCounter++;
  const drawerId = `mn-search-drawer-${drawerCounter}`;

  /* Backdrop */
  const backdrop = document.createElement('div');
  backdrop.className = 'mn-drawer__backdrop';
  document.body.appendChild(backdrop);

  /* Drawer shell */
  const drawer = document.createElement('div');
  drawer.id = drawerId;
  drawer.className = 'mn-drawer mn-drawer--right';
  document.body.appendChild(drawer);

  /* Inner content */
  const content = document.createElement('div');
  content.className = 'mn-search-drawer';

  const heading = document.createElement('h2');
  heading.textContent = title;
  content.appendChild(heading);

  /* Search input area */
  const searchWrap = document.createElement('div');
  searchWrap.className = 'mn-search-drawer__search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'mn-input';
  searchInput.placeholder = placeholder;
  searchInput.setAttribute('aria-label', placeholder);
  searchWrap.appendChild(searchInput);
  content.appendChild(searchWrap);

  /* Loading indicator */
  const loadingEl = document.createElement('div');
  loadingEl.className = 'mn-search-drawer__loading';
  loadingEl.textContent = 'Searching...';
  loadingEl.style.display = 'none';
  content.appendChild(loadingEl);

  /* Results container */
  const resultsEl = document.createElement('div');
  resultsEl.className = 'mn-search-drawer__results';
  resultsEl.setAttribute('role', 'listbox');
  content.appendChild(resultsEl);

  /* Empty state */
  const emptyEl = document.createElement('div');
  emptyEl.className = 'mn-search-drawer__empty';
  emptyEl.textContent = 'No results';
  emptyEl.style.display = 'none';
  content.appendChild(emptyEl);

  /* Sections */
  for (const section of sections) {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'mn-search-drawer__section';
    const label = document.createElement('div');
    label.className = 'mn-search-drawer__section-label';
    label.textContent = section.label;
    sectionEl.appendChild(label);
    const body = document.createElement('div');
    section.renderer(body);
    sectionEl.appendChild(body);
    content.appendChild(sectionEl);
  }

  drawer.appendChild(content);

  /* Open via existing drawer system */
  openDrawer(drawerId);

  /* Render results into the results container */
  function renderResults(results: SearchDrawerResult[]): void {
    resultsEl.innerHTML = '';
    emptyEl.style.display = results.length === 0 ? '' : 'none';
    for (const result of results) {
      const item = document.createElement('div');
      item.className = 'mn-search-drawer__item';
      item.setAttribute('role', 'option');

      const titleSpan = document.createElement('div');
      titleSpan.className = 'mn-search-drawer__item-title';
      titleSpan.textContent = result.title;
      item.appendChild(titleSpan);

      if (result.subtitle) {
        const sub = document.createElement('div');
        sub.className = 'mn-search-drawer__item-sub';
        sub.textContent = result.subtitle;
        item.appendChild(sub);
      }

      if (result.badge) {
        const badge = document.createElement('span');
        badge.className = 'mn-badge';
        badge.textContent = result.badge;
        if (result.badgeColor && isValidColor(result.badgeColor)) badge.style.backgroundColor = result.badgeColor;
        item.appendChild(badge);
      }

      item.addEventListener('click', () => onResultClick(result));
      resultsEl.appendChild(item);
    }
  }

  /* Debounced search on input */
  const doSearch = debounce(async () => {
    const query = searchInput.value.trim();
    if (!query) {
      resultsEl.innerHTML = '';
      emptyEl.style.display = 'none';
      loadingEl.style.display = 'none';
      return;
    }
    loadingEl.style.display = '';
    try {
      const results = await onSearch(query);
      loadingEl.style.display = 'none';
      renderResults(results);
    } catch {
      loadingEl.style.display = 'none';
      resultsEl.innerHTML = '';
      emptyEl.style.display = '';
    }
  }, 300);

  searchInput.addEventListener('input', () => { doSearch(); });

  function cleanup(): void {
    closeDrawer(drawerId);
    /* Allow close animation, then remove DOM */
    setTimeout(() => {
      backdrop.remove();
      drawer.remove();
    }, 300);
  }

  return {
    close: cleanup,
    setResults: renderResults,
    setLoading: (loading: boolean) => {
      loadingEl.style.display = loading ? '' : 'none';
    },
  };
}
