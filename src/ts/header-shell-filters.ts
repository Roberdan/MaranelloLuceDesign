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
  filters[group.id] = group.multi ? allowed : [allowed[0]];
  return filters[group.id].slice();
}
