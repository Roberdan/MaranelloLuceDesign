import { type HeaderShellAction, type HeaderShellFilterGroup, type HeaderShellOptions, type HeaderShellSection, type HeaderShellState } from './header-shell-config';
export type { HeaderShellAction, HeaderShellFilterGroup, HeaderShellOptions, HeaderShellSection, HeaderShellState };
export interface HeaderShellController {
    getState(): HeaderShellState;
    setQuery(query: string): void;
    setFilter(groupId: string, values: string[]): void;
    destroy(): void;
}
export declare function headerShell(container: HTMLElement, options: HeaderShellOptions): HeaderShellController;
