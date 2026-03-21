export interface StateScaffoldOptions {
    state: 'loading' | 'empty' | 'error' | 'partial' | 'no-results' | 'ready';
    message?: string;
    actionLabel?: string;
    onRetry?: () => void;
    onAction?: () => void;
}
type ScaffoldState = StateScaffoldOptions['state'];
export declare class StateScaffold {
    private container;
    private content;
    private status;
    private options;
    private state;
    private events;
    constructor(container: HTMLElement, options: StateScaffoldOptions);
    setState(state: ScaffoldState, message?: string): void;
    getState(): string;
    getContentHost(): HTMLElement;
    destroy(): void;
    private renderLoading;
    private renderEmpty;
    private renderError;
    private renderPartial;
    private renderReady;
    private renderNoResults;
    private buildPanel;
    private buildMessageState;
}
export {};
