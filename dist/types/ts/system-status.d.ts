/**
 * Maranello Luce Design - System status indicator
 * Compact pill with expandable service health panel.
 */
import type { SystemStatusService, SystemStatusCheckResult, SystemStatusRenderedResult, SystemStatusOptions, SystemStatusController } from './core/types';
export type { SystemStatusService, SystemStatusCheckResult, SystemStatusRenderedResult, SystemStatusOptions, SystemStatusController };
/**
 * Create a system status indicator with optional auto-polling.
 */
export declare function systemStatus(container: string | HTMLElement, opts?: SystemStatusOptions): SystemStatusController | null;
