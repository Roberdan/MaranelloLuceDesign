export interface GraphNode {
    id: string;
    label: string;
    group?: string;
    avatar?: string;
    detail?: string;
    size?: number;
    x?: number;
    y?: number;
}
export interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
    color?: string;
}
export interface SocialGraphOptions {
    nodes: GraphNode[];
    edges: GraphEdge[];
    width?: number;
    height?: number;
    onClick?: (node: GraphNode) => void;
    onHover?: (node: GraphNode | null) => void;
    groups?: Record<string, string>;
    animate?: boolean;
    showLabels?: boolean;
}
export interface SocialGraphController {
    addNode: (node: GraphNode) => void;
    removeNode: (id: string) => void;
    highlight: (id: string | null) => void;
    setData: (nodes: GraphNode[], edges: GraphEdge[]) => void;
    destroy: () => void;
}
export declare function socialGraph(container: HTMLElement | string | null, opts?: SocialGraphOptions): SocialGraphController | null;
