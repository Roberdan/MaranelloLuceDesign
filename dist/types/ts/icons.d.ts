/**
 * Maranello Luce Design - Icon catalog (barrel export)
 * Consolidates all icon sub-modules into a single catalog.
 */
import type { IconCatalog, RenderIconOptions } from './core/types';
/** Full icon catalog merging all icon groups. */
export declare const icons: IconCatalog;
/** Render an icon into a target element. */
export declare function renderIcon(target: string | Element, name: string, opts?: RenderIconOptions): void;
/** Get all available icon names. */
export declare function iconCatalog(): string[];
export { navIcons } from './icons-nav';
export { statusIcons } from './icons-status';
export { actionIcons } from './icons-actions';
export { dataIcons } from './icons-data';
export { objectIcons } from './icons-objects';
export { platformIcons } from './icons-platform';
