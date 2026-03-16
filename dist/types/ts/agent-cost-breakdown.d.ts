/**
 * Maranello Luce Design - Agent Cost Breakdown
 * FinOps dashboard table for AI agent token usage, cost attribution,
 * budget tracking, and trend analysis. Datadog/Vantage quality.
 */
export interface AgentCostRow {
    id: string;
    agentName: string;
    model: string;
    totalTokens: number;
    cachedTokens?: number;
    cost: number;
    costDelta?: number;
    calls: number;
    avgLatencyMs?: number;
    budget?: number;
    tags?: string[];
}
export interface AgentCostBreakdownOptions {
    currency?: string;
    period?: string;
    onSelect?: (row: AgentCostRow) => void;
    onBudgetAlert?: (row: AgentCostRow) => void;
    sortable?: boolean;
}
export interface AgentCostBreakdownController {
    update: (rows: AgentCostRow[]) => void;
    destroy: () => void;
}
export declare function agentCostBreakdown(el: HTMLElement, rows: AgentCostRow[], opts?: AgentCostBreakdownOptions): AgentCostBreakdownController;
