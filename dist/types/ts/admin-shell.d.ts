export interface AdminShellNavItem {
    id: string;
    label: string;
    icon: string;
    section?: string;
    badge?: string | number;
}
export interface AdminShellOpts {
    sidebar: {
        header?: {
            icon?: string;
            title: string;
            badge?: string;
        };
        search?: {
            placeholder?: string;
            shortcut?: string;
            onSearch?: (q: string) => void;
        };
        nav: AdminShellNavItem[];
        footer?: HTMLElement | string | {
            label: string;
            onClick: () => void;
        };
        onFooterClick?: () => void;
    };
    collapsible?: boolean;
    initialCollapsed?: boolean;
    topBar?: boolean;
    onNavigate: (pageId: string) => void;
    initialPage?: string;
}
export interface AdminShellController {
    contentEl: HTMLElement;
    setPage: (id: string) => void;
    setTitle: (title: string) => void;
    collapse: (val: boolean) => void;
    destroy: () => void;
}
/**
 * Create a full-screen admin shell with collapsible sidebar and content area.
 * Mounts a fixed overlay grid below the navbar with navigation and a content slot.
 */
export declare function adminShell(el: HTMLElement, opts: AdminShellOpts): AdminShellController;
