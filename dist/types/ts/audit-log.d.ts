export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical' | 'success';
export interface AuditEntry {
    id: string;
    timestamp: string;
    actor: string;
    actorRole?: string;
    action: string;
    resource?: string;
    severity: AuditSeverity;
    metadata?: Record<string, string>;
    ipAddress?: string;
}
export interface AuditLogOptions {
    maxEntries?: number;
    filterable?: boolean;
    onSelect?: (entry: AuditEntry) => void;
    live?: boolean;
}
export interface AuditLogController {
    prepend: (entry: AuditEntry) => void;
    append: (entry: AuditEntry) => void;
    setFilter: (severity: AuditSeverity | 'all') => void;
    clear: () => void;
    destroy: () => void;
}
export declare function auditLog(el: HTMLElement, entries?: AuditEntry[], opts?: AuditLogOptions): AuditLogController;
