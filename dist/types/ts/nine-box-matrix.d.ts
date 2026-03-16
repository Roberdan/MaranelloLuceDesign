export interface NineBoxItem {
    id: string;
    label: string;
    x: 1 | 2 | 3;
    y: 1 | 2 | 3;
    subtitle?: string;
    color?: string;
}
export interface NineBoxMatrixOptions {
    items: NineBoxItem[];
    xLabel?: string;
    yLabel?: string;
    xAxisLabels?: [string, string, string];
    yAxisLabels?: [string, string, string];
    onSelect?: (item: NineBoxItem) => void;
    onMove?: (item: NineBoxItem, newX: 1 | 2 | 3, newY: 1 | 2 | 3) => void;
}
export interface NineBoxMatrixController {
    update: (items: NineBoxItem[]) => void;
    moveItem: (id: string, x: 1 | 2 | 3, y: 1 | 2 | 3) => void;
    getItems: () => NineBoxItem[];
    destroy: () => void;
}
export declare function nineBoxMatrix(el: HTMLElement, opts: NineBoxMatrixOptions): NineBoxMatrixController;
