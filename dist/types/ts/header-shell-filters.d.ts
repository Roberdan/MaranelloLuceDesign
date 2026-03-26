import type { HeaderShellFilterGroup } from './header-shell-config';
export declare function createFilterState(groups: HeaderShellFilterGroup[] | undefined): Record<string, string[]>;
export declare function setFilterValues(filters: Record<string, string[]>, group: HeaderShellFilterGroup, nextValues: string[]): string[];
export declare function syncFilterButtons(root: ParentNode, filters: Record<string, string[]>): void;
