/**
 * Maranello Luce Design - Login screen DOM helpers
 * Provides element creation, mini-gauge SVG, compass SVG, and service cards.
 */
export type LoginServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | string;
export interface LoginServiceCheck {
    name: string;
    status: LoginServiceStatus;
    latency_ms: number | null;
}
declare const STATUS_COLORS: Record<string, string>;
declare const STATUS_LABELS: Record<string, string>;
export declare function miniGaugeSVG(status: LoginServiceStatus, latencyMs: number | null, label: string): string;
export declare function compassSVG(size: number): string;
export declare function createServiceCard(check: LoginServiceCheck): HTMLDivElement;
export { STATUS_COLORS, STATUS_LABELS };
