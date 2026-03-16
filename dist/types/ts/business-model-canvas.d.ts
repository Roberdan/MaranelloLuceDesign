export type BmcBlockId = 'key-partners' | 'key-activities' | 'key-resources' | 'value-proposition' | 'customer-relationships' | 'channels' | 'customer-segments' | 'cost-structure' | 'revenue-streams';
export interface BmcItem {
    id: string;
    text: string;
    blockId: BmcBlockId;
}
export interface BmcBlock {
    id: BmcBlockId;
    title: string;
    icon: string;
    items: BmcItem[];
}
export interface BusinessModelCanvasOptions {
    blocks?: Partial<Record<BmcBlockId, Partial<BmcBlock>>>;
    editable?: boolean;
    onChange?: (blocks: BmcBlock[]) => void;
}
export interface BusinessModelCanvasController {
    getBlocks: () => BmcBlock[];
    addItem: (blockId: BmcBlockId, text: string) => void;
    removeItem: (id: string) => void;
    update: (blocks: BmcBlock[]) => void;
    destroy: () => void;
}
export declare function businessModelCanvas(el: HTMLElement, opts?: BusinessModelCanvasOptions): BusinessModelCanvasController;
