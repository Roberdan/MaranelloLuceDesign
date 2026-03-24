import type { HeaderShellFilterGroup } from './header-shell-config';

export function createFilterState(groups: HeaderShellFilterGroup[] | undefined): Record<string, string[]> {
  const state: Record<string, string[]> = {};
  if (!groups) return state;
  groups.forEach((group) => {
    if (group.options.length > 0) state[group.id] = [group.options[0].id];
  });
  return state;
}

export function setFilterValues(
  filters: Record<string, string[]>,
  group: HeaderShellFilterGroup,
  nextValues: string[],
): string[] {
  const defaultId = group.options[0]?.id;
  const allowed: string[] = [];
  group.options.forEach((option) => {
    if (nextValues.indexOf(option.id) !== -1) allowed.push(option.id);
  });
  if (group.multi && defaultId && allowed.length > 1) {
    const defaultIndex = allowed.indexOf(defaultId);
    if (defaultIndex !== -1) allowed.splice(defaultIndex, 1);
  }
  if (!allowed.length && defaultId) allowed.push(defaultId);
  filters[group.id] = !allowed.length ? [] : (group.multi ? allowed : [allowed[0]]);
  return filters[group.id].slice();
}

export function syncFilterButtons(root: ParentNode, filters: Record<string, string[]>): void {
  root.querySelectorAll<HTMLElement>('[data-filter-group-id]').forEach((group) => {
    const groupId = group.dataset.filterGroupId;
    const selected = groupId ? (filters[groupId] || []) : [];
    group.querySelectorAll<HTMLButtonElement>('.mn-header-shell__filter-option').forEach((button) => {
      const isSelected = !!button.dataset.filterOptionId && selected.indexOf(button.dataset.filterOptionId) !== -1;
      if (isSelected) button.classList.add('is-selected');
      else button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', String(isSelected));
    });
  });
}
