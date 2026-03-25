/**
 * Maranello Luce Design - Map view event handling
 * Pan, zoom, pinch-to-zoom, drag, hit-testing, and tooltip management.
 */
import type { RenderedMarker, ViewState } from './map-view-helpers';
import { hitTest, markerRadius, project } from './map-view-helpers';

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

export function showTip(
  m: RenderedMarker, els: TipElements,
  padding: number, viewState: ViewState,
): void {
  els.tipLabel.textContent = m.label || 'Marker';
  els.tipDetail.textContent = m.detail || '';
  els.tip.classList.add('mn-map__tooltip--visible');
  els.tip.setAttribute('aria-hidden', 'false');

  const cr = els.wrap.getBoundingClientRect();
  const pos = (typeof m._x === 'number' && typeof m._y === 'number')
    ? { x: m._x, y: m._y }
    : project(m.lat, m.lon, cr.width, cr.height, padding, viewState);

  const tipW = els.tip.offsetWidth || 120;
  const tipH = els.tip.offsetHeight || 40;
  let left = pos.x - tipW / 2;
  if (left < 4) left = 4;
  if (left + tipW > cr.width - 4) left = cr.width - tipW - 4;
  let top = pos.y - tipH - 12;
  if (top < 4) top = pos.y + 12;
  els.tip.style.left = left + 'px';
  els.tip.style.top = top + 'px';
}

export function hideTip(tip: HTMLElement): void {
  tip.classList.remove('mn-map__tooltip--visible');
  tip.setAttribute('aria-hidden', 'true');
}

/** Attach full interactive event handlers (hover, click, pan, zoom, touch). */
export function attachEvents(
  canvas: HTMLCanvasElement, tipEls: TipElements,
  state: MapEventState, callbacks: MapEventCallbacks,
): EventCleanup {
  function handleWheel(e: WheelEvent): void {
    if (!state.enableZoom) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    callbacks.setZoomInternal(state.zoomLevel * factor);
  }

  function startDrag(clientX: number, clientY: number): void {
    if (!state.enablePan) return;
    state.isDragging = true;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    state.hovered = null;
    hideTip(tipEls.tip);
    canvas.style.cursor = 'grabbing';
  }

  function moveDrag(clientX: number, clientY: number): void {
    if (!state.isDragging) return;
    const dx = clientX - state.dragStartX;
    const dy = clientY - state.dragStartY;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    callbacks.panByPixels(dx, dy);
  }

  function endDrag(): void {
    state.isDragging = false;
    canvas.style.cursor = state.enablePan ? 'grab' : 'default';
  }

  function onCanvasMouseMove(e: MouseEvent): void {
    if (state.isDragging) return;
    const m = hitTest(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m) {
      state.hovered = m.id as string;
      canvas.style.cursor = 'pointer';
      showTip(m, tipEls, state.padding, state.viewState);
    } else {
      state.hovered = null;
      canvas.style.cursor = state.enablePan ? 'grab' : 'default';
      hideTip(tipEls.tip);
    }
  }

  function onCanvasMouseLeave(): void {
    state.hovered = null;
    if (!state.isDragging) {
      canvas.style.cursor = state.enablePan ? 'grab' : 'default';
    }
    hideTip(tipEls.tip);
  }

  function onCanvasClick(e: MouseEvent): void {
    if (state.isDragging) return;
    const m = hitTest(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m && state.onClick) state.onClick(m);
  }

  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('mouseleave', onCanvasMouseLeave);
  canvas.addEventListener('click', onCanvasClick);

  let onWindowMouseMove: ((e: MouseEvent) => void) | null = null;
  let onWindowMouseUp: (() => void) | null = null;
  let onCanvasMouseDown: ((e: MouseEvent) => void) | null = null;
  let onCanvasTouchStart: ((e: TouchEvent) => void) | null = null;
  let onCanvasTouchMove: ((e: TouchEvent) => void) | null = null;
  let onCanvasTouchEnd: (() => void) | null = null;

  if (state.enableZoom) {
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.style.touchAction = 'none';
  }

  if (state.enablePan) {
    canvas.style.cursor = 'grab';

    onCanvasMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      startDrag(e.clientX, e.clientY);
    };
    canvas.addEventListener('mousedown', onCanvasMouseDown);

    onWindowMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    onWindowMouseUp = () => { if (state.isDragging) endDrag(); };
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);

    onCanvasTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && state.enableZoom) {
        const t1 = e.touches[0], t2 = e.touches[1];
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        state.touchPinchStartDist = Math.sqrt(dx * dx + dy * dy);
        state.touchPinchStartZoom = state.zoomLevel;
        return;
      }
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    canvas.addEventListener('touchstart', onCanvasTouchStart, { passive: true });

    onCanvasTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && state.enableZoom && state.touchPinchStartDist > 0) {
        e.preventDefault();
        const p1 = e.touches[0], p2 = e.touches[1];
        const dx = p2.clientX - p1.clientX;
        const dy = p2.clientY - p1.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          callbacks.setZoomInternal(state.touchPinchStartZoom * (dist / state.touchPinchStartDist));
        }
        return;
      }
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    canvas.addEventListener('touchmove', onCanvasTouchMove, { passive: false });

    onCanvasTouchEnd = () => {
      state.touchPinchStartDist = 0;
      if (state.isDragging) endDrag();
    };
    canvas.addEventListener('touchend', onCanvasTouchEnd, { passive: true });
  }

  return {
    cleanup(): void {
      canvas.removeEventListener('mousemove', onCanvasMouseMove);
      canvas.removeEventListener('mouseleave', onCanvasMouseLeave);
      canvas.removeEventListener('click', onCanvasClick);
      if (state.enableZoom) canvas.removeEventListener('wheel', handleWheel);
      if (onCanvasMouseDown) canvas.removeEventListener('mousedown', onCanvasMouseDown);
      if (onWindowMouseMove) window.removeEventListener('mousemove', onWindowMouseMove);
      if (onWindowMouseUp) window.removeEventListener('mouseup', onWindowMouseUp);
      if (onCanvasTouchStart) canvas.removeEventListener('touchstart', onCanvasTouchStart);
      if (onCanvasTouchMove) canvas.removeEventListener('touchmove', onCanvasTouchMove);
      if (onCanvasTouchEnd) canvas.removeEventListener('touchend', onCanvasTouchEnd);
    },
  };
}
