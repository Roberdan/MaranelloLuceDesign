/**
 * Maranello Luce Design - Admin user table
 * Rich, Stripe-quality user management table with search, selection,
 * avatar initials, status/role badges, and inline row actions.
 */
export type UserRole = 'admin' | 'member' | 'viewer' | 'billing';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'invited';
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastActive?: string;
    avatarUrl?: string;
    teams?: string[];
}
export interface UserTableOptions {
    searchable?: boolean;
    selectable?: boolean;
    onSelect?: (user: AdminUser) => void;
    onAction?: (user: AdminUser, action: 'edit' | 'suspend' | 'delete' | 'resend-invite') => void;
    pageSize?: number;
}
export interface UserTableController {
    update: (users: AdminUser[]) => void;
    setFilter: (query: string) => void;
    getSelected: () => AdminUser[];
    destroy: () => void;
}
/** Create a rich admin user table inside the given element. */
export declare function userTable(el: HTMLElement, users: AdminUser[], opts?: UserTableOptions): UserTableController;
