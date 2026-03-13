/**
 * Maranello Luce Design - Map view event handling
 * Pan, zoom, pinch-to-zoom, drag, hit-testing, and tooltip management.
 */
import type { RenderedMarker, ViewState } from './map-view-helpers';
/** Tooltip DOM element references. */
export interface TipElements {
    wrap: HTMLElement;
    tip: HTMLElement;
    tipLabel: HTMLElement;
    tipDetail: HTMLElement;
}
/** Mutable event state shared between handlers. */
export interface MapEventState {
    renderedMarkers: RenderedMarker[];
    viewState: ViewState;
    padding: number;
    zoomLevel: number;
    highlighted: string | null;
    hovered: string | null;
    enableZoom: boolean;
    enablePan: boolean;
    isDragging: boolean;
    dragStartX: number;
    dragStartY: number;
    touchPinchStartDist: number;
    touchPinchStartZoom: number;
    pulse: number;
    onClick?: (marker: RenderedMarker) => void;
}
/** Callbacks from event system back to the map controller. */
export interface MapEventCallbacks {
    setZoomInternal: (zoom: number) => void;
    panByPixels: (dx: number, dy: number) => void;
}
/** Result of attaching events; call cleanup to remove listeners. */
export interface EventCleanup {
    cleanup: () => void;
}
export declare function showTip(m: RenderedMarker, els: TipElements, padding: number, viewState: ViewState): void;
export declare function hideTip(tip: HTMLElement): void;
/** Attach full interactive event handlers (hover, click, pan, zoom, touch). */
export declare function attachEvents(canvas: HTMLCanvasElement, tipEls: TipElements, state: MapEventState, callbacks: MapEventCallbacks): EventCleanup;
