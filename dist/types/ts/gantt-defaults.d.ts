/**
 * Maranello Luce Design - Gantt defaults, palettes, and layout utilities
 */
import type { GanttDefaults, GanttRow } from './core/types';
export declare const DPR: number;
export declare const MS_DAY = 86400000;
export declare const DEFAULTS: GanttDefaults;
export declare function hexLuminance(hex: string): number;
export declare function textOnBg(hex: string): string;
export declare function buildPalette(): Record<string, string>;
export declare function buildChildPalette(): Record<string, string>;
export declare function buildSeverity(): Record<string, {
    fg: string;
    bg: string;
    icon: string;
}>;
export declare function themeColors(): Record<string, unknown>;
export declare const MONTH_FULL: string[];
export declare const MONTH_ABBR: string[];
export declare function parseDate(s: unknown): Date | null;
export declare function monthStart(d: Date): Date;
export declare function addMonths(d: Date, n: number): Date;
export declare function daysBetween(a: Date, b: Date): number;
export declare function fmtDateFull(d: Date | null): string;
export declare function fmtDateShort(d: Date | null): string;
export declare function getScale(ppm: number): {
    scale: string;
    primaryType: string;
};
export declare function buildRows(tasks: unknown[], expanded: Record<string, boolean>): GanttRow[];
export declare function rowY(idx: number, rows: GanttRow[], o: Record<string, unknown>): number;
export declare function contentH(rows: GanttRow[], o: Record<string, unknown>): number;
export declare function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void;
export declare function truncText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string;
export declare function buildRange(tasks: unknown[]): {
    min: Date;
    max: Date;
    months: Array<{
        date: Date;
        month: number;
        year: number;
    }>;
};
export declare function buildYearSpans(months: Array<{
    date: Date;
}>): Array<{
    year: number;
    s: number;
    e: number;
}>;
