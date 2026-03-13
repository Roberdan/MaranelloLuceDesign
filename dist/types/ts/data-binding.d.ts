/**
 * Maranello Luce Design - Data binding core
 * Binds data from URLs to DOM elements, emits/listens to events.
 */
interface BindOptions {
    url?: string;
    fetch?: () => Promise<unknown>;
    map?: (data: unknown, el?: Element) => unknown;
    property?: string;
    interval?: number;
    onUpdate?: (el: Element, value: unknown) => void;
    onError?: (el: Element, err: unknown) => void;
}
/** Emit a custom event on the document (legacy compatibility). */
export declare function emit(name: string, detail: unknown): void;
/** Listen for a custom event on the document (legacy compatibility). */
export declare function on(name: string, handler: (detail: unknown) => void): void;
/** Bind data from a URL or fetch function to DOM elements. */
export declare function bind(selector: string | Element, options: BindOptions): number | undefined;
/** Auto-bind elements with data-mn-bind attributes. */
export declare function autoBind(): void;
/** Register drill-down click handlers on matching elements. */
export declare function onDrillDown(selector: string, handler: (element: Element, contextData: Record<string, string | null>) => void): void;
export {};
