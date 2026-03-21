import { AsyncSelect } from './async-select';
import type { EntityField, EntitySchema } from './entity-workbench';
export interface RenderContext {
    container: HTMLElement;
    schema: EntitySchema;
    activeTab: string;
    data: Record<string, unknown>;
    editable: boolean;
    actions: Array<{
        id: string;
        label: string;
        variant?: string;
    }>;
    breadcrumb: string;
    isDirty: boolean;
    fieldEls: Map<string, HTMLElement>;
    asyncControls: AsyncSelect[];
    renderedTabs: Set<string>;
    onTab: (tabId: string) => void;
    onField: (field: EntityField, value: unknown) => void;
    onSave: () => void;
    onCancel: () => void;
    onAction: (id: string) => void;
}
export declare function renderWorkbench(ctx: RenderContext): void;
/** Toggle tab visibility without rebuilding DOM. */
export declare function switchTab(container: HTMLElement, tabId: string, ctx: RenderContext): void;
/** Update the save button disabled state without full re-render. */
export declare function updateSaveState(container: HTMLElement, isDirty: boolean): void;
