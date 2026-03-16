export interface BCGItem {
    id: string;
    label: string;
    marketShare: number;
    growthRate: number;
    size?: number;
    color?: string;
}
export interface BCGMatrixOptions {
    items: BCGItem[];
    height?: number;
    shareThreshold?: number;
    growthThreshold?: number;
    onHover?: (item: BCGItem | null) => void;
    onClick?: (item: BCGItem) => void;
    animate?: boolean;
}
export interface BCGMatrixController {
    update: (items: BCGItem[]) => void;
    destroy: () => void;
}
/** Render an interactive BCG Matrix on a canvas element. */
export declare function bcgMatrix(canvas: HTMLCanvasElement, opts: BCGMatrixOptions): BCGMatrixController | undefined;
