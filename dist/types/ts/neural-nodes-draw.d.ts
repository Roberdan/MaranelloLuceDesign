/**
 * Maranello Luce Design - Neural nodes canvas drawing routines.
 */
import type { InternalNode, InternalConnection, Particle, Wave } from './neural-nodes-types';
export declare function toAlpha(color: string, opacity: number): string;
export interface DrawState {
    nodes: InternalNode[];
    connections: InternalConnection[];
    particles: Particle[];
    waves: Wave[];
    hovered: number;
    activity: number;
    pulseSpeed: number;
    particleCount: number;
    labels: boolean;
    labelFont: string;
}
export declare function drawFrame(ctx: CanvasRenderingContext2D, now: number, s: DrawState): void;
