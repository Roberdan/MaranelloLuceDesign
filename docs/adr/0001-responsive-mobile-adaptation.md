# ADR-0001: Responsive Mobile Adaptation

**Status:** Accepted  
**Date:** 2026-03-14  
**Context:** MaranelloLuceDesign needed mobile/tablet support without breaking existing desktop layouts.

## Decisions

### 1. Separate responsive-*.css files (not inline @media)

**Why:** Project convention enforces 250-line max per file. Inline @media in each component CSS would push many files over the limit. Separate files also allow tree-shaking by consumers who don't need mobile support.

**Consequence:** 5 new CSS files imported by maranello.css. Consumers loading individual CSS files must also load responsive-*.css if they need mobile support.

### 2. autoResize() utility (not controller pattern)

**Why:** Charts are pure render functions (`sparkline(canvas, data, opts)`) — they don't maintain state. A ResizeObserver wrapper that re-calls the factory on resize is the simplest approach. Controller pattern would require refactoring all chart APIs.

**Consequence:** autoResize returns a cleanup function. Consumers must call it on teardown.

### 3. size='fluid' for gauge/speedometer

**Why:** Gauges have an `init()` lifecycle with canvas sizing. Adding 'fluid' to the existing size enum is minimally invasive — init() already reads parent bounds when no preset matches.

**Consequence:** New 'fluid' value added to GaugeSize type. GAUGE_SIZES record includes `fluid: 0` (signals parent-bound sizing).

### 4. Breakpoints: 640px / 1024px

**Why:** 640px covers all phone viewports (iPhone SE to 15 Pro Max in portrait). 1024px captures iPad and small laptops. Aligns with Tailwind `sm`/`lg` and common device classes.

**Consequence:** Three tiers: mobile (≤640), tablet (641–1024), desktop (>1024). Token overrides cascade at each tier.
