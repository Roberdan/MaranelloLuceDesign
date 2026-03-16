export type SwotQuadrant = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
export interface SwotItem {
    id: string;
    text: string;
    quadrant: SwotQuadrant;
}
export interface SwotMatrixOptions {
    items?: SwotItem[];
    editable?: boolean;
    onChange?: (items: SwotItem[]) => void;
    quadrantLabels?: {
        strengths?: string;
        weaknesses?: string;
        opportunities?: string;
        threats?: string;
    };
}
export interface SwotMatrixController {
    getItems: () => SwotItem[];
    addItem: (quadrant: SwotQuadrant, text: string) => void;
    removeItem: (id: string) => void;
    update: (items: SwotItem[]) => void;
    destroy: () => void;
}
export declare function swotMatrix(el: HTMLElement, opts?: SwotMatrixOptions): SwotMatrixController;
