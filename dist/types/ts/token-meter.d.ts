export interface TokenUsage {
    prompt: number;
    completion: number;
    cached?: number;
    budget?: number;
    costPerMToken?: number;
}
export interface TokenMeterOptions {
    label?: string;
    showCost?: boolean;
    showBreakdown?: boolean;
    animate?: boolean;
    onChange?: (usage: TokenUsage) => void;
}
export interface TokenMeterController {
    update: (usage: TokenUsage) => void;
    reset: () => void;
    destroy: () => void;
}
/** Create a token usage meter inside the given element. */
export declare function tokenMeter(el: HTMLElement, usage?: TokenUsage, opts?: TokenMeterOptions): TokenMeterController;
