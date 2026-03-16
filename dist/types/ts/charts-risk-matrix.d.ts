export interface RiskItem {
    id: string;
    label: string;
    probability: 1 | 2 | 3 | 4 | 5;
    impact: 1 | 2 | 3 | 4 | 5;
    color?: string;
}
export interface RiskMatrixOptions {
    items: RiskItem[];
    height?: number;
    gridSize?: number;
    animate?: boolean;
    onHover?: (item: RiskItem | null) => void;
    onClick?: (item: RiskItem) => void;
}
export interface RiskMatrixController {
    update: (items: RiskItem[]) => void;
    destroy: () => void;
}
export declare function riskMatrix(canvas: HTMLCanvasElement, opts: RiskMatrixOptions): RiskMatrixController | undefined;
