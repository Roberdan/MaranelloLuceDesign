/**
 * Maranello Luce Design - Map view factory
 * Canvas-based world map with clustered markers, tooltips, and theme awareness.
 */
import type { MapViewOptions, MapViewController } from './core/types';
/** Create an interactive map view inside a container element. */
export declare function mapView(container: HTMLElement | null, opts?: MapViewOptions): MapViewController | null;
