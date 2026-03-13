/**
 * Maranello Luce Design - DOM Observers
 * Lazy gauge initialization, scroll-reveal, nav tracking, and auto-contrast.
 */
import { FerrariGauge } from './gauge-engine';
/** Options for the IntersectionObserver-based gauge initializer. */
export interface GaugeInitOptions {
    /** CSS selector for gauge canvas elements. */
    selector?: string;
    /** Visibility threshold (0..1) before triggering gauge creation. */
    threshold?: number;
}
/** Options for the scroll-reveal observer. */
export interface ScrollRevealOptions {
    /** CSS selector for elements to reveal. */
    selector?: string;
    /** Visibility threshold (0..1). */
    threshold?: number;
    /** Root margin for early/late triggering. */
    rootMargin?: string;
    /** CSS class added when element becomes visible. */
    visibleClass?: string;
}
/** Options for the nav-tracking scroll handler. */
export interface NavTrackingOptions {
    /** CSS selector for sections with id attributes. */
    sectionSelector?: string;
    /** CSS selector for navigation links. */
    linkSelector?: string;
    /** Pixel offset from top for "current" calculation. */
    offsetPx?: number;
    /** CSS class toggled on the active link. */
    activeClass?: string;
}
/** Result of computing relative luminance for auto-contrast. */
export interface ContrastResult {
    /** Relative luminance (0 = black, 1 = white). */
    luminance: number;
    /** Whether the background is considered light (luminance > threshold). */
    isLight: boolean;
}
/**
 * Lazily initialize FerrariGauge instances when their canvas scrolls into view.
 * Returns the array of created gauge instances (populated asynchronously).
 */
export declare function initGauges(opts?: GaugeInitOptions): FerrariGauge[];
/** Observe elements and add a "visible" class when they enter the viewport. */
export declare function initScrollReveal(opts?: ScrollRevealOptions): void;
/** Track scroll position and highlight the nav link for the current section. */
export declare function initNavTracking(opts?: NavTrackingOptions): void;
/** Compute relative luminance from an RGB background color string. */
export declare function relativeLuminance(bgColor: string): number | null;
/**
 * Apply auto-contrast text color/shadow to elements based on background luminance.
 * Light backgrounds get dark text; dark backgrounds get light text with shadow.
 */
export declare function autoContrast(selector: string, threshold?: number): void;
