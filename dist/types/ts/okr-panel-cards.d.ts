import { type OkrStatus, type KeyResultInput, type ObjectiveInput, type Objective, type OkrStats } from './okr-panel-utils';
export declare function normalizeObjective(item: ObjectiveInput | undefined): Objective;
export declare function calculateStats(objectives: Objective[]): OkrStats;
export declare function createSummaryCard(status: OkrStatus, count: number, description: string, total: number): HTMLDivElement;
export declare function createHero(stats: OkrStats, period: string): HTMLElement;
export declare function createKRRow(kr: KeyResultInput, objectiveStatus: OkrStatus): HTMLLIElement;
export declare function createObjectiveCard(objective: Objective, index: number): HTMLElement;
