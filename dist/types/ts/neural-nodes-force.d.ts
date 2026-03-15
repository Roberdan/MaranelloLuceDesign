/**
 * Maranello Luce Design - Force-directed layout for neural nodes.
 */
import type { InternalNode, InternalConnection } from './neural-nodes-types';
export declare function applyForces(nodes: InternalNode[], connections: InternalConnection[], width: number, height: number): void;
