/**
 * Maranello Luce Design - Neural nodes data-driven types.
 */
export interface NeuralNodeData {
    id: string;
    label?: string;
    sublabel?: string;
    color?: string;
    size?: number;
    group?: string;
    badge?: string;
    energy?: number;
}
export interface NeuralConnection {
    from: string;
    to: string;
    strength?: number;
}
export interface NeuralNodesOptions {
    nodeCount?: number;
    connectionDensity?: number;
    width?: number;
    height?: number;
    colors?: string[];
    pulseSpeed?: number;
    particleCount?: number;
    interactive?: boolean;
    nodes?: NeuralNodeData[];
    connections?: NeuralConnection[];
    labels?: boolean;
    forceLayout?: boolean;
    labelFont?: string;
}
export interface NeuralNodesController {
    pulse: (target?: number | string) => void;
    setActivity: (level: number) => void;
    destroy: () => void;
    setNodes: (nodes: NeuralNodeData[]) => void;
    setConnections: (connections: NeuralConnection[]) => void;
    addNode: (node: NeuralNodeData) => void;
    removeNode: (id: string) => void;
    updateNode: (id: string, patch: Partial<NeuralNodeData>) => void;
    highlightNode: (id: string | null) => void;
}
export type InternalNode = {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    phase: number;
    energy: number;
    size: number;
    label?: string;
    sublabel?: string;
    badge?: string;
    group?: string;
};
export type InternalConnection = {
    a: number;
    b: number;
    strength: number;
};
export type Particle = {
    connection: number;
    lane: number;
    t: number;
    speed: number;
};
export type Wave = {
    x: number;
    y: number;
    radius: number;
    life: number;
    color: string;
};
export type Activation = {
    at: number;
    index: number;
};
