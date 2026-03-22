import type { StripGaugeZone, StripPipelineZone, StripTrendZone, StripBoardZone } from './core/types';
interface ZoneHandle {
    update: (zone: Record<string, unknown>) => void;
    destroy: () => void;
}
export declare function renderGaugeZone(section: HTMLElement, zone: StripGaugeZone, _animate: boolean): ZoneHandle;
export declare function renderPipelineZone(section: HTMLElement, zone: StripPipelineZone, _animate: boolean): ZoneHandle;
export declare function renderTrendZone(section: HTMLElement, zone: StripTrendZone, _animate: boolean): ZoneHandle;
export declare function renderBoardZone(section: HTMLElement, zone: StripBoardZone, _animate: boolean): ZoneHandle;
export {};
