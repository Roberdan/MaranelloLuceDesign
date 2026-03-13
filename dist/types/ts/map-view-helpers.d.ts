/**
 * Maranello Luce Design - Map view helpers
 * Projection, clustering, marker drawing, legend rendering, and hit testing.
 */
import type { MapMarker, ThemePalette } from './core/types';
export type MarkerColor = 'active' | 'warning' | 'danger';
export type MarkerSize = 'sm' | 'md' | 'lg';
export interface ProjectedMarker extends MapMarker {
    _x: number;
    _y: number;
}
export interface ClusterMarker extends ProjectedMarker {
    isCluster: true;
    clusterCount: number;
    mixedColor: string;
    _members: ProjectedMarker[];
}
export type RenderedMarker = ProjectedMarker | ClusterMarker;
export interface ViewState {
    zoom: number;
    panX: number;
    panY: number;
}
export declare const DPR: number;
export declare const TAU: number;
export declare const CONTINENTS: Record<string, Array<[number, number]>>;
export declare function detectTheme(): ThemePalette & {
    coast: string;
    bg: string;
};
export declare function getMarkerColors(): Record<string, Record<MarkerColor, string>>;
export declare function project(lat: number, lon: number, w: number, h: number, pad: number, vs?: ViewState): {
    x: number;
    y: number;
};
export declare function hexToRgba(hex: string, a: number): string;
export declare function getVisibleProjected(source: MapMarker[], vw: number, vh: number, padding: number, viewState: ViewState): ProjectedMarker[];
export declare function clusterMarkers(source: ProjectedMarker[], zoom: number, markerColors: Record<MarkerColor, string>, clusterRadius: number, minClusterSize: number): RenderedMarker[];
export declare function markerRadius(m: RenderedMarker): number;
export declare function drawMarker(ctx: CanvasRenderingContext2D, m: RenderedMarker, mc: Record<MarkerColor, string>, pulse: number, highlighted: string | null, hovered: string | null): void;
export declare function renderLegend(legendEl: HTMLElement | null, mc: Record<MarkerColor, string>): void;
export declare function hitTest(clientX: number, clientY: number, canvas: HTMLCanvasElement, markers: RenderedMarker[]): RenderedMarker | null;
