/**
 * Maranello Luce Design - RAG Source Citation Cards
 * Renders a list of source citation cards for retrieval-augmented generation.
 */
export interface SourceCard {
    id: string;
    title: string;
    excerpt?: string;
    source?: string;
    score?: number;
    date?: string;
    badge?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export interface SourceCardsOptions {
    onSelect?: (card: SourceCard) => void;
    maxVisible?: number;
    layout?: 'list' | 'grid';
}
export interface SourceCardsController {
    update: (cards: SourceCard[]) => void;
    destroy: () => void;
}
/**
 * Render source citation cards into a container.
 * All user-provided strings are set via textContent (XSS-safe).
 */
export declare function renderSourceCards(container: HTMLElement, cards: SourceCard[], opts?: SourceCardsOptions): SourceCardsController;
