import type { NeuralNodesOptions, NeuralNodesController, NeuralNodeData, NeuralConnection } from './neural-nodes-types';
export type { NeuralNodesOptions, NeuralNodesController, NeuralNodeData, NeuralConnection };
export declare function neuralNodes(container: HTMLElement | string | null, opts?: NeuralNodesOptions): NeuralNodesController | null;
