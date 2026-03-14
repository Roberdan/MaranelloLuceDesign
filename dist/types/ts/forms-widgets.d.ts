/** Maranello Luce Design - Form widgets: auto-resize, tag input, password toggle,
 * file upload, form steps, inline edit, char counter, search clear. */
export interface TagInputApi {
    getTags: () => string[];
    addTag: (text: string) => void;
    setTags: (arr: string[]) => void;
}
export interface FileUploadApi {
    getFiles: () => File[];
    clear: () => void;
}
export interface FormStepsApi {
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
    getCurrent: () => number;
}
/** Auto-resize a textarea to fit its content. */
export declare function initAutoResize(el: HTMLTextAreaElement | null): void;
/** Initialize a tag input widget. */
export declare function initTagInput(container: Element | null): TagInputApi | null;
/** Initialize a password visibility toggle. */
export declare function initPasswordToggle(wrap: Element | null): void;
/** Initialize a file upload widget with drag-and-drop. */
export declare function initFileUpload(container: Element | null): FileUploadApi | null;
/** Initialize a multi-step form. */
export declare function initFormSteps(container: Element | null): FormStepsApi | null;
/** Initialize inline editing on an element. */
export declare function initInlineEdit(el: Element | null): void;
/** Initialize a character counter on a field. */
export declare function initCharCounter(field: Element): void;
/** Initialize a search input with clear button. */
export declare function initSearchClear(wrap: Element | null): void;
