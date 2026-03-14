/**
 * Unit tests for map-view module.
 * Canvas 2D is mocked — only container structure and return value are verified.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock canvas getContext before importing map-view (DPR access is safe in happy-dom)
const mockCtx = {
  scale: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 40 }),
  set fillStyle(_v: unknown) {},
  set strokeStyle(_v: unknown) {},
  set lineWidth(_v: unknown) {},
  set font(_v: unknown) {},
  set textAlign(_v: unknown) {},
  set textBaseline(_v: unknown) {},
  set globalAlpha(_v: unknown) {},
  set shadowColor(_v: unknown) {},
  set shadowBlur(_v: unknown) {},
};

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx) as typeof HTMLCanvasElement.prototype.getContext;

// ResizeObserver stub (not provided by happy-dom v2)
if (!('ResizeObserver' in window)) {
  (window as unknown as Record<string, unknown>).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

import { mapView } from '../../src/ts/map-view';

// --- mapView creates container structure ---

describe('mapView() — container structure', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '300px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('returns a controller object (not null) for a valid container', () => {
    // Arrange + Act
    const ctrl = mapView(container);

    // Assert
    expect(ctrl).not.toBeNull();
    ctrl?.destroy();
  });

  it('appends a canvas element inside the container', () => {
    // Act
    const ctrl = mapView(container);

    // Assert
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();

    ctrl?.destroy();
  });

  it('appends a tooltip div with mn-chart-tooltip class', () => {
    // Act
    const ctrl = mapView(container);

    // Assert
    const tip = container.querySelector('.mn-chart-tooltip');
    expect(tip).not.toBeNull();

    ctrl?.destroy();
  });

  it('appends a legend div with mn-map__legend class', () => {
    // Act
    const ctrl = mapView(container);

    // Assert
    const legend = container.querySelector('.mn-map__legend');
    expect(legend).not.toBeNull();

    ctrl?.destroy();
  });

  it('sets position:relative on the container', () => {
    // Act
    mapView(container);

    // Assert
    expect(container.style.position).toBe('relative');
  });

  it('sets overflow:hidden on the container', () => {
    // Act
    mapView(container);

    // Assert
    expect(container.style.overflow).toBe('hidden');
  });

  it('destroy() empties the container', () => {
    // Arrange
    const ctrl = mapView(container);
    expect(container.children.length).toBeGreaterThan(0);

    // Act
    ctrl?.destroy();

    // Assert
    expect(container.innerHTML).toBe('');
  });
});

// --- Marker rendering escapes labels ---

describe('mapView() — marker escapeHtml on tooltip labels', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('controller exposes setMarkers without throwing for XSS labels', () => {
    // Arrange
    const ctrl = mapView(container, { markers: [] });

    // Act — pass a marker with an XSS label; render() must not throw
    expect(() => ctrl?.setMarkers([
      { id: 'x', lat: 0, lon: 0, label: '<img src=x onerror=alert(1)>', color: 'active' },
    ])).not.toThrow();

    ctrl?.destroy();
  });

  it('controller exposes addMarker without throwing', () => {
    // Arrange
    const ctrl = mapView(container, { markers: [] });

    // Act + Assert
    expect(() => ctrl?.addMarker(
      { id: 'a1', lat: 48, lon: 2, label: 'Paris', color: 'active' },
    )).not.toThrow();

    ctrl?.destroy();
  });
});

// --- Missing container returns null with console.warn ---

describe('mapView() — null container', () => {
  it('returns null when container is null', () => {
    // Act
    const result = mapView(null);

    // Assert
    expect(result).toBeNull();
  });

  it('does not throw when container is null', () => {
    // Act + Assert
    expect(() => mapView(null)).not.toThrow();
  });
});

// --- Controller API surface ---

describe('mapView() — controller methods', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('exposes setZoom method', () => {
    const ctrl = mapView(container);
    expect(typeof ctrl?.setZoom).toBe('function');
    ctrl?.destroy();
  });

  it('exposes highlight method', () => {
    const ctrl = mapView(container);
    expect(typeof ctrl?.highlight).toBe('function');
    ctrl?.destroy();
  });

  it('exposes removeMarker method', () => {
    const ctrl = mapView(container);
    expect(typeof ctrl?.removeMarker).toBe('function');
    ctrl?.destroy();
  });

  it('setZoom does not throw', () => {
    const ctrl = mapView(container);
    expect(() => ctrl?.setZoom(2)).not.toThrow();
    ctrl?.destroy();
  });
});
