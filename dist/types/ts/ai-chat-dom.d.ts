/**
 * Maranello Luce Design - AI Chat DOM builder
 * Constructs the chat panel UI: FAB, header, messages area, input, agent selector.
 */
export type ChatRole = 'user' | 'ai';
export interface AIChatMessage {
    role: ChatRole;
    content: string;
    time: Date;
}
export interface AIChatAgent {
    id: string;
    label: string;
    icon?: string;
}
export interface AIChatOptions {
    onSend?: (msg: string) => string | AIChatResponse | Promise<string | AIChatResponse> | null | undefined;
    onQuickAction?: (action: string, ctx: string | null) => string | AIChatResponse | Promise<string | AIChatResponse> | null | undefined;
    quickActions?: string[];
    placeholder?: string;
    title?: string;
    welcomeMessage?: string | null;
    avatar?: string | null;
    agents?: AIChatAgent[];
    activeAgent?: string | null;
    onAgentChange?: (agentId: string, agent: AIChatAgent) => void;
    onVoice?: (isListening: boolean) => void;
}
export interface AIChatResponse {
    content?: string;
}
export interface AIChatController {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
    addMessage: (role: ChatRole, content: string) => AIChatMessage;
    setTyping: (show: boolean) => void;
    clear: () => void;
    showPulse: () => void;
    destroy: () => void;
}
export declare const ICON_SPARK = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z\"/><path d=\"M18 14l1 3.5L22.5 18l-3.5 1L18 22.5l-1-3.5L13.5 18l3.5-1L18 14z\" opacity=\".6\"/></svg>";
export declare function getIcon(name: string): string;
export declare function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, attrs?: Record<string, string>): HTMLElementTagNameMap[K];
export declare function formatTime(date: Date): string;
export declare function renderContent(text: string): DocumentFragment;
export interface ChatUIElements {
    state: ChatUIState;
    fab: HTMLButtonElement;
    pulse: HTMLSpanElement;
    panel: HTMLDivElement;
    resizeHandle: HTMLDivElement;
    closeBtn: HTMLButtonElement;
    widthBtn: HTMLButtonElement;
    agentSelector: HTMLButtonElement;
    agentSelectorLabel: HTMLSpanElement;
    agentGrid: HTMLDivElement;
    messagesEl: HTMLDivElement;
    typingEl: HTMLDivElement;
    quickBar: HTMLDivElement;
    inputEl: HTMLTextAreaElement;
    sendBtn: HTMLButtonElement;
    voiceBtn: HTMLButtonElement;
}
export interface ChatUIState {
    isOpen: boolean;
    isTyping: boolean;
    messages: AIChatMessage[];
    panelHeight: number;
    isListening: boolean;
    panelWidthMode: string;
    isAgentGridOpen: boolean;
    activeAgentId: string | null;
    addMessage?: (role: string, content: string) => AIChatMessage;
    setTyping?: (show: boolean) => void;
    clear?: () => void;
    toggleAgentGrid?: (forceState?: boolean) => void;
    onDocumentClick?: (e: MouseEvent) => void;
}
export declare function buildUI(container: HTMLElement, opts: Required<AIChatOptions>): ChatUIElements;
