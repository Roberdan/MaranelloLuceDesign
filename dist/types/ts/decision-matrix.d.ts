export interface DecisionCriterion {
    id: string;
    label: string;
    weight: number;
}
export interface DecisionAlternative {
    id: string;
    label: string;
    scores: Record<string, number>;
}
export interface DecisionMatrixOptions {
    criteria: DecisionCriterion[];
    alternatives: DecisionAlternative[];
    editable?: boolean;
    onChange?: (alternatives: DecisionAlternative[]) => void;
}
export interface DecisionMatrixController {
    update: (alternatives: DecisionAlternative[]) => void;
    getScores: () => DecisionAlternative[];
    destroy: () => void;
}
export declare function decisionMatrix(el: HTMLElement, opts: DecisionMatrixOptions): DecisionMatrixController;
