/**
 * Maranello Luce Design - Streaming Text
 * Headless component for progressive text rendering with markdown-lite parsing.
 * Supports bold, inline code, and citation references with ARIA live regions.
 */
export interface StreamingTextOptions {
    onCitationClick?: (index: number) => void;
    onDone?: () => void;
    typingCursor?: boolean;
    processMarkdown?: boolean;
}
export interface StreamingTextController {
    append: (chunk: string) => void;
    done: () => void;
    reset: () => void;
    setText: (text: string) => void;
    destroy: () => void;
}
/**
 * Create a streaming text renderer attached to the given element.
 * Progressively renders appended chunks with optional markdown-lite processing.
 */
export declare function streamingText(el: HTMLElement, opts?: StreamingTextOptions): StreamingTextController;
