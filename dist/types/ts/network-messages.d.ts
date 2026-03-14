export interface NetNode {
    id: string;
    label: string;
    x: number;
    y: number;
    color?: string;
    size?: number;
}
export interface NetMessage {
    from: string;
    to: string;
    color?: string;
    speed?: number;
    size?: number;
    label?: string;
}
export interface NetworkMessagesOptions {
    nodes: NetNode[];
    connections: {
        from: string;
        to: string;
        color?: string;
    }[];
    width?: number;
    height?: number;
    particleTrail?: boolean;
    glowEffect?: boolean;
}
export interface NetworkMessagesController {
    send: (msg: NetMessage) => void;
    burst: (msgs: NetMessage[]) => void;
    setNodes: (nodes: NetNode[]) => void;
    destroy: () => void;
}
export declare function networkMessages(container: HTMLElement | string | null, opts?: NetworkMessagesOptions): NetworkMessagesController | null;
