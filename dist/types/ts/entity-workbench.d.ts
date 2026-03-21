import type { AsyncDataProvider } from './async-select';
export interface EntityField {
    key: string;
    label: string;
    type: string;
    options?: Record<string, unknown>;
    required?: boolean;
    readOnly?: boolean;
    provider?: AsyncDataProvider;
    compute?: (data: Record<string, unknown>) => unknown;
    fields?: EntityField[];
}
export interface EntitySection {
    title?: string;
    fields: EntityField[];
}
export interface EntityTab {
    id: string;
    label: string;
    sections: EntitySection[];
}
export interface EntitySchema {
    tabs: EntityTab[];
}
export interface EntityWorkbenchOptions {
    schema: EntitySchema;
    data: Record<string, unknown>;
    editable?: boolean;
    actions?: Array<{
        id: string;
        label: string;
        icon?: string;
        variant?: string;
    }>;
    onSave?: (data: Record<string, unknown>) => void | Promise<void>;
    onClose?: () => void;
    onAction?: (actionId: string, data: Record<string, unknown>) => void;
}
export declare class EntityWorkbench {
    private readonly container;
    private readonly options;
    private readonly stack;
    private readonly asyncControls;
    private readonly fieldEls;
    private readonly renderedTabs;
    private currentSchema;
    private baseData;
    private currentData;
    private activeTab;
    private readonly rootLabel;
    constructor(container: HTMLElement, options: EntityWorkbenchOptions);
    isDirty(): boolean;
    canGoBack(): boolean;
    getCurrentDepth(): number;
    getModifiedData(): Record<string, unknown>;
    validate(): {
        valid: boolean;
        errors: Map<string, string>;
    };
    pushEntity(schema: EntitySchema, data: Record<string, unknown>): void;
    popEntity(): boolean;
    destroy(): void;
    private buildRenderContext;
    private buildBreadcrumb;
    /** Switch tab via CSS display toggle — no DOM rebuild. */
    private handleTabSwitch;
    /** Force-render any tabs not yet lazily rendered (needed for validate). */
    private ensureAllTabsRendered;
    private render;
    private onFieldChange;
    private handleSave;
    private handleCancel;
}
