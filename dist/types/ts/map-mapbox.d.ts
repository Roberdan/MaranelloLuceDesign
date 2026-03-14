/**
 * Maranello Luce Design — Mapbox GL Map View
 * Themed wrapper around mapbox-gl with clusters, stage markers, and dark styling.
 * mapbox-gl is a peer dependency — not bundled.
 * (c) Roberdan 2026 — MIT License
 */
/** Minimal Mapbox GL type surface — mapbox-gl is a peer dependency. */
interface MapboxMap {
    addControl: (ctrl: unknown, pos?: string) => void;
    addSource: (id: string, src: unknown) => void;
    addLayer: (layer: unknown, before?: string) => void;
    on: (event: string, cb: () => void) => void;
    flyTo: (opts: unknown) => void;
    setStyle: (style: string) => void;
    resize: () => void;
    remove: () => void;
    getZoom: () => number;
}
export interface MapboxMarker {
    id: string | number;
    lat: number;
    lon: number;
    label: string;
    detail?: string;
    stage?: string;
    color?: string;
    count?: number;
}
export interface MapboxViewOptions {
    accessToken?: string;
    style?: string;
    center?: [number, number];
    zoom?: number;
    projection?: 'globe' | 'mercator';
    markers?: MapboxMarker[];
    clusterRadius?: number;
    clusterMaxZoom?: number;
    showLegend?: boolean;
    stages?: {
        id: string;
        label: string;
        color: string;
    }[];
    onClick?: (marker: MapboxMarker) => void;
    choropleth?: {
        sourceUrl: string;
        sourceLayer: string;
        property: string;
        stops: [number, string][];
    } | null;
}
export interface MapboxViewController {
    setMarkers: (markers: MapboxMarker[]) => void;
    flyTo: (lat: number, lon: number, zoom?: number) => void;
    setStyle: (style: string) => void;
    resize: () => void;
    destroy: () => void;
    getMap: () => MapboxMap;
}
export declare function mapboxView(container: HTMLElement | string | null, opts?: MapboxViewOptions): MapboxViewController | null;
export {};
