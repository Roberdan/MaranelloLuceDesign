export interface NeuralNodesOptions {
    nodeCount?: number;
    connectionDensity?: number;
    width?: number;
    height?: number;
    colors?: string[];
    pulseSpeed?: number;
    particleCount?: number;
    interactive?: boolean;
}
export interface NeuralNodesController {
    pulse: (nodeIndex?: number) => void;
    setActivity: (level: number) => void;
    destroy: () => void;
}
export declare function neuralNodes(container: HTMLElement | string | null, opts?: NeuralNodesOptions): NeuralNodesController | null;
