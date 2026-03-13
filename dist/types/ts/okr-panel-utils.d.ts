export type OkrStatus = 'on-track' | 'at-risk' | 'behind';
export type OkrScope = 'LOCAL' | 'TEAM' | 'GLOBAL' | string;
export interface KeyResultInput {
    title?: string;
    current?: number | string;
    target?: number | string;
    unit?: string;
}
export interface ObjectiveInput {
    title?: string;
    scope?: OkrScope;
    progress?: number | string;
    status?: OkrStatus;
    keyResults?: KeyResultInput[];
}
export interface Objective {
    title: string;
    scope: OkrScope;
    progress: number;
    status: OkrStatus;
    keyResults: KeyResultInput[];
}
export interface OkrPanelOptions {
    title?: string;
    period?: string;
    objectives?: ObjectiveInput[];
}
export interface OkrStats {
    counts: Record<OkrStatus, number>;
    average: number;
}
export interface OkrPanelController {
    update: (objectives: ObjectiveInput[]) => void;
    destroy: () => void;
}
export declare const STATUS_COLORS: Record<OkrStatus, string>;
export declare const SCOPE_COLORS: Record<string, string>;
export declare function safeNumber(v: unknown): number;
export declare function pct(current: unknown, target: unknown): number;
export declare function statusFromProgress(p: unknown): OkrStatus;
export declare function statusLabel(s: OkrStatus): string;
export declare function formatKR(current: unknown, target: unknown, unit?: string): string;
export declare function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, attrs?: Record<string, string>): HTMLElementTagNameMap[K];
export declare function describeArc(cx: number, cy: number, r: number, sa: number, ea: number): string;
export declare function ringTemplate(size: number, stroke: number, percent: number, color: string, centerText: string | null, trackClass: string, progressClass: string): string;
export declare function heroGaugeSVG(percent: number, color: string): string;
export declare function animateRings(container: HTMLElement): void;
export declare function animateSummaryRings(container: HTMLElement): void;
export declare function animateBars(container: HTMLElement): void;
export declare function animateGauge(container: HTMLElement): void;
