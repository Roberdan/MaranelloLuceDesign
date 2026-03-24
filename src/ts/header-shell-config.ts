import type { ProfileMenuSection, ThemeMode } from './core/types';

export interface HeaderShellAction {
  id: string;
  label?: string;
  title?: string;
  icon?: string;
  active?: boolean;
  pressed?: boolean;
  disabled?: boolean;
}

export interface HeaderShellFilterOption {
  id: string;
  label: string;
  tone?: string;
}
export interface HeaderShellFilterGroup {
  id: string;
  label: string;
  multi?: boolean;
  options: HeaderShellFilterOption[];
}

export type HeaderShellSection =
  | { type: 'brand'; label?: string; logo?: string; logoSrc?: string; logoAlt?: string; href?: string }
  | { type: 'actions'; role: 'pre' | 'post'; items: HeaderShellAction[]; presentation?: 'segmented' | 'cluster' }
  | { type: 'search'; placeholder?: string; shortcut?: string; filterButtonLabel?: string; filters?: HeaderShellFilterGroup[] }
  | { type: 'theme'; modes?: ThemeMode[] }
  | { type: 'profile'; name: string; avatarUrl?: string; sections?: ProfileMenuSection[] }
  | { type: 'divider' }
  | { type: 'spacer' };

export interface HeaderShellCallbacks {
  onAction?: (payload: { id: string; role: 'pre' | 'post' }) => void;
  onSearch?: (payload: { query: string }) => void;
  onFilter?: (payload: { groupId: string; values: string[] }) => void;
  onTheme?: (payload: { mode: ThemeMode }) => void;
}

export interface HeaderShellOptions {
  ariaLabel?: string;
  sections: HeaderShellSection[];
  callbacks?: HeaderShellCallbacks;
}

export interface HeaderShellState {
  query: string;
  filters: Record<string, string[]>;
  activeActionId: string;
  themeMode: ThemeMode;
}

export function normalizeSections(sections: HeaderShellSection[]): HeaderShellSection[] {
  return Array.isArray(sections) ? sections.slice() : [];
}
