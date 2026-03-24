import type { ThemeMode } from './core/types';

export type HeaderShellEventName =
  'header-shell-action'
  | 'header-shell-search'
  | 'header-shell-filter'
  | 'header-shell-theme';

export interface HeaderShellEventMap {
  'header-shell-action': { id: string; role: 'pre' | 'post' };
  'header-shell-search': { query: string };
  'header-shell-filter': { groupId: string; values: string[] };
  'header-shell-theme': { mode: ThemeMode };
}

export function emitShellEvent<K extends HeaderShellEventName>(
  host: HTMLElement,
  type: K,
  detail: HeaderShellEventMap[K],
): void {
  host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
}
