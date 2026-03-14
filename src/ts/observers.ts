/**
 * Maranello Luce Design - DOM Observers
 * Lazy gauge initialization, scroll-reveal, nav tracking, and auto-contrast.
 */
import { FerrariGauge } from './gauge-engine';
import { throttle } from './core/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Gauge lazy-init observer
// ---------------------------------------------------------------------------

/**
 * Lazily initialize FerrariGauge instances when their canvas scrolls into view.
 * Returns the array of created gauge instances (populated asynchronously).
 */
export function initGauges(opts?: GaugeInitOptions): FerrariGauge[] {
  const selector = opts?.selector ?? '.mn-gauge__canvas';
  const threshold = opts?.threshold ?? 0.2;
  const instances: FerrariGauge[] = [];
  const canvases = document.querySelectorAll<HTMLCanvasElement>(selector);

  if (!canvases.length) {
    console.warn('[Maranello] initGauges: no gauge canvases found for selector:', selector);
  }

  canvases.forEach((canvas) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gauge = new FerrariGauge(canvas);
            instances.push(gauge);
            obs.unobserve(canvas);
          }
        });
      },
      { threshold },
    );
    obs.observe(canvas);
  });

  return instances;
}

// ---------------------------------------------------------------------------
// Scroll-reveal observer
// ---------------------------------------------------------------------------

/** Observe elements and add a "visible" class when they enter the viewport. */
export function initScrollReveal(opts?: ScrollRevealOptions): void {
  const selector = opts?.selector ?? '.mn-reveal';
  const threshold = opts?.threshold ?? 0.1;
  const rootMargin = opts?.rootMargin ?? '0px 0px -50px 0px';
  const visibleClass = opts?.visibleClass ?? 'mn-reveal--visible';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
        }
      });
    },
    { threshold, rootMargin },
  );

  const revealEls = document.querySelectorAll(selector);
  if (!revealEls.length) {
    console.warn('[Maranello] initScrollReveal: no elements found for selector:', selector);
  }
  revealEls.forEach((el) => observer.observe(el));
}

// ---------------------------------------------------------------------------
// Navigation scroll tracking
// ---------------------------------------------------------------------------

/** Track scroll position and highlight the nav link for the current section. */
export function initNavTracking(opts?: NavTrackingOptions): void {
  const sectionSelector = opts?.sectionSelector ?? 'section[id]';
  const linkSelector = opts?.linkSelector ?? '.mn-nav__link';
  const offsetPx = opts?.offsetPx ?? 100;
  const activeClass = opts?.activeClass ?? 'mn-nav__link--active';

  const sections = document.querySelectorAll<HTMLElement>(sectionSelector);
  const navLinks = document.querySelectorAll<HTMLElement>(linkSelector);

  if (!sections.length) {
    console.warn('[Maranello] initNavTracking: no sections found for selector:', sectionSelector);
  }
  if (!navLinks.length) {
    console.warn('[Maranello] initNavTracking: no nav links found for selector:', linkSelector);
  }

  const handleScroll = throttle(() => {
    let current = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offsetPx) {
        current = section.getAttribute('id') ?? '';
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        activeClass,
        link.getAttribute('href') === `#${current}`,
      );
    });
  }, 100);

  window.addEventListener('scroll', handleScroll);
}

// ---------------------------------------------------------------------------
// Auto-contrast (WCAG relative luminance)
// ---------------------------------------------------------------------------

/** Linearize an sRGB channel value (0..1) for luminance calculation. */
function linearize(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Compute relative luminance from an RGB background color string. */
export function relativeLuminance(bgColor: string): number | null {
  const matches = bgColor.match(/\d+/g);
  if (!matches || matches.length < 3) return null;

  const r = linearize(parseInt(matches[0], 10) / 255);
  const g = linearize(parseInt(matches[1], 10) / 255);
  const b = linearize(parseInt(matches[2], 10) / 255);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Apply auto-contrast text color/shadow to elements based on background luminance.
 * Light backgrounds get dark text; dark backgrounds get light text with shadow.
 */
export function autoContrast(
  selector: string,
  threshold: number = 0.35,
): void {
  document.querySelectorAll(selector).forEach((el) => {
    const bg = getComputedStyle(el).backgroundColor;
    const lum = relativeLuminance(bg);
    if (lum === null) return;

    if (el instanceof HTMLElement) {
      el.style.color = lum > threshold ? '#111' : 'rgba(255,255,255,0.95)';
      el.style.textShadow =
        lum > threshold ? 'none' : '0 1px 3px rgba(0,0,0,0.5)';
    }
  });
}
