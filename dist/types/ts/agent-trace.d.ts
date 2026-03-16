export type TraceStepStatus = 'pending' | 'running' | 'done' | 'error';
export type TraceStepKind = 'tool' | 'reasoning' | 'result' | 'handoff';
export interface TraceStep {
    id: string;
    kind: TraceStepKind;
    label: string;
    status: TraceStepStatus;
    durationMs?: number;
    input?: string;
    output?: string;
    timestamp?: string;
}
export interface AgentTraceOptions {
    maxVisible?: number;
    onSelect?: (step: TraceStep) => void;
}
export interface AgentTraceController {
    add: (step: TraceStep) => void;
    update: (id: string, partial: Partial<TraceStep>) => void;
    clear: () => void;
    destroy: () => void;
}
export declare function agentTrace(el: HTMLElement, steps?: TraceStep[], opts?: AgentTraceOptions): AgentTraceController;
