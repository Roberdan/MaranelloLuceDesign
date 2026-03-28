export interface FacetOption {
  id: string;
  label: string;
  count?: number;
}

export type FacetType = 'select' | 'multi-select' | 'search' | 'date-range' | 'boolean';

export interface FacetConfig {
  id: string;
  label: string;
  type: FacetType;
  dataProvider: () => Promise<FacetOption[]>;
  countProvider?: (selection: Map<string, string[]>) => Promise<number>;
  exclusionRules?: { excludes: string[] };
}

export interface FacetSectionRefs {
  section: HTMLElement;
  header: HTMLButtonElement;
  body: HTMLElement;
  count: HTMLElement;
}

export function buildWorkbenchShell(container: HTMLElement): {
  root: HTMLElement;
  list: HTMLElement;
  chips: HTMLElement;
} {
  container.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'mn-facet-workbench';
  const list = document.createElement('div');
  list.className = 'mn-facet-list';
  const chips = document.createElement('div');
  chips.className = 'mn-filter-chips mn-facet-chips';
  root.append(list, chips);
  container.appendChild(root);
  return { root, list, chips };
}

export function createFacetSection(facet: FacetConfig): FacetSectionRefs {
  const section = document.createElement('section');
  section.className = 'mn-facet';
  section.dataset.facetId = facet.id;
  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'mn-facet__header';
  header.setAttribute('aria-expanded', 'true');
  const title = document.createElement('span');
  title.className = 'mn-facet__title';
  title.textContent = facet.label;
  const count = document.createElement('span');
  count.className = 'mn-facet__count';
  const chevron = document.createElement('span');
  chevron.className = 'mn-facet__chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '▾';
  header.append(title, count, chevron);
  const body = document.createElement('div');
  body.className = 'mn-facet__body';
  body.dataset.type = facet.type;
  section.append(header, body);
  return { section, header, body, count };
}

export function setFacetCollapsed(refs: FacetSectionRefs, collapsed: boolean): void {
  refs.section.classList.toggle('mn-facet--collapsed', collapsed);
  refs.header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  refs.body.hidden = collapsed;
}

export function renderLoading(body: HTMLElement): void {
  body.innerHTML = '<div class="mn-facet__loading">Loading…</div>';
}

export function renderOptionRows(
  body: HTMLElement,
  facet: FacetConfig,
  options: FacetOption[],
  selected: ReadonlyArray<string>,
): void {
  if (facet.type !== 'select' && facet.type !== 'multi-select' && facet.type !== 'search') return;
  body.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'mn-facet__options';
  const isSingle = facet.type === 'select';
  const visible = facet.type === 'search' ? options : options;

  visible.forEach((option) => {
    const row = document.createElement('label');
    row.className = 'mn-facet__option';
    const input = document.createElement('input');
    input.className = 'mn-facet__option-input';
    input.type = isSingle ? 'radio' : 'checkbox';
    input.name = `mn-facet-${facet.id}`;
    input.value = option.id;
    input.checked = selected.includes(option.id);
    const text = document.createElement('span');
    text.className = 'mn-facet__option-label';
    text.textContent = option.count == null ? option.label : `${option.label} (${option.count})`;
    row.append(input, text);
    wrap.appendChild(row);
  });

  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'mn-facet__empty';
    empty.textContent = 'No options';
    body.appendChild(empty);
    return;
  }
  body.appendChild(wrap);
}

export function renderSearchControls(body: HTMLElement, query = ''): HTMLInputElement {
  const search = document.createElement('input');
  search.type = 'search';
  search.value = query;
  search.placeholder = 'Search options';
  search.className = 'mn-facet__search-input';
  body.prepend(search);
  return search;
}

export function renderDateRange(body: HTMLElement, selected: ReadonlyArray<string>): {
  from: HTMLInputElement;
  to: HTMLInputElement;
} {
  body.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'mn-facet__date-range';
  const from = document.createElement('input');
  from.type = 'date';
  from.className = 'mn-facet__date mn-facet__date--from';
  from.value = selected[0] || '';
  const to = document.createElement('input');
  to.type = 'date';
  to.className = 'mn-facet__date mn-facet__date--to';
  to.value = selected[1] || '';
  wrap.append(from, to);
  body.appendChild(wrap);
  return { from, to };
}

export function renderBoolean(body: HTMLElement, active: boolean): HTMLInputElement {
  body.innerHTML = '';
  const label = document.createElement('label');
  label.className = 'mn-facet__boolean';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'mn-facet__boolean-input';
  input.checked = active;
  const text = document.createElement('span');
  text.className = 'mn-facet__boolean-label';
  text.textContent = 'Enabled';
  label.append(input, text);
  body.appendChild(label);
  return input;
}

export function renderActiveChips(
  chipsContainer: HTMLElement,
  facets: ReadonlyArray<FacetConfig>,
  filters: ReadonlyMap<string, string[]>,
  onRemove: (facetId: string, value: string) => void,
): void {
  chipsContainer.innerHTML = '';
  const names = new Map(facets.map((facet) => [facet.id, facet.label]));

  filters.forEach((values, facetId) => {
    values.forEach((value) => {
      const chip = document.createElement('span');
      chip.className = 'mn-filter-chip mn-facet-chip';
      const label = document.createElement('span');
      label.className = 'mn-filter-chip__label mn-facet-chip__label';
      label.textContent = `${names.get(facetId) || facetId}: ${value}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'mn-filter-chip__remove mn-facet-chip__remove';
      remove.textContent = '×';
      remove.addEventListener('click', () => onRemove(facetId, value));
      chip.append(label, remove);
      chipsContainer.appendChild(chip);
    });
  });
}

export function setFacetDisabled(section: HTMLElement, disabled: boolean): void {
  section.classList.toggle('mn-facet--disabled', disabled);
  section.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button, select, textarea').forEach((el) => {
    if (!el.classList.contains('mn-facet__header')) el.disabled = disabled;
  });
}
