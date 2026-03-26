export interface AsyncDataProvider<T = unknown> {
    search(query: string): Promise<T[]>;
    renderItem?: (item: T) => string;
    getLabel?: (item: T) => string;
    getId?: (item: T) => string;
}
export interface AsyncSelectOptions<T = unknown> {
    provider: AsyncDataProvider<T>;
    onSelect?: (item: T) => void;
    placeholder?: string;
    debounceMs?: number;
    minChars?: number;
}
export declare class AsyncSelect<T = unknown> {
    private readonly container;
    private provider;
    private readonly onSelect?;
    private readonly debounceMs;
    private readonly minChars;
    private readonly input;
    private readonly dropdown;
    private readonly listboxId;
    private readonly onDocClick;
    private readonly onInput;
    private readonly onKeyDown;
    private items;
    private selected?;
    private activeIndex;
    private timer?;
    private openState;
    private requestId;
    private destroyed;
    constructor(container: HTMLElement, options: AsyncSelectOptions<T>);
    open(): void;
    close(): void;
    clear(): void;
    getValue(): T | undefined;
    setProvider(provider: AsyncDataProvider<T>): void;
    destroy(): void;
    private scheduleSearch;
    private fetchResults;
    private showLoading;
    private renderItems;
    private setActive;
    private selectIndex;
    private handleKeyDown;
}
