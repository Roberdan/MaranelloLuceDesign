import { EventBus, eventBus } from './core/events';

export interface ViewEntry {
  viewId: string;
  params?: Record<string, unknown>;
  timestamp: number;
}

export type NavigateAction = 'push' | 'pop' | 'replace' | 'remove' | 'clear';
export type NavigateCallback = (entry: ViewEntry, action: NavigateAction) => void;

interface NavigationEventMap extends Record<string, unknown> {
  navigate: { entry: ViewEntry; action: NavigateAction };
}

export class NavigationModel {
  private readonly stack: ViewEntry[] = [];
  private readonly bus = new EventBus<NavigationEventMap>(new EventTarget());
  private readonly callbacks = new Map<NavigateCallback, (detail: NavigationEventMap['navigate']) => void>();

  push(viewId: string, params?: Record<string, unknown>): ViewEntry {
    const entry: ViewEntry = { viewId, params, timestamp: Date.now() };
    this.stack.push(entry);
    this.notify(entry, 'push');
    return entry;
  }

  pop(): ViewEntry | undefined {
    if (this.stack.length === 0) return undefined;
    this.stack.pop();
    const entry = this.current();
    if (entry) this.notify(entry, 'pop');
    return entry;
  }

  replace(viewId: string, params?: Record<string, unknown>): ViewEntry {
    const entry: ViewEntry = { viewId, params, timestamp: Date.now() };
    if (this.stack.length === 0) {
      this.stack.push(entry);
    } else {
      this.stack[this.stack.length - 1] = entry;
    }
    this.notify(entry, 'replace');
    return entry;
  }

  current(): ViewEntry | undefined {
    return this.stack[this.stack.length - 1];
  }

  canGoBack(): boolean {
    return this.stack.length > 1;
  }

  history(): ReadonlyArray<ViewEntry> {
    return this.stack.slice();
  }

  remove(viewId: string): void {
    let removed = false;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i].viewId === viewId) {
        this.stack.splice(i, 1);
        removed = true;
      }
    }
    if (removed) {
      const current = this.current();
      if (current) {
        this.notify(current, 'remove');
      } else {
        this.notify({ viewId, timestamp: Date.now() }, 'remove');
      }
    }
  }

  clear(): void {
    if (this.stack.length === 0) return;
    const last = this.stack[this.stack.length - 1];
    this.stack.length = 0;
    this.notify(last, 'clear');
  }

  onNavigate(cb: NavigateCallback): () => void {
    const handler = (detail: NavigationEventMap['navigate']) => {
      cb(detail.entry, detail.action);
    };
    this.callbacks.set(cb, handler);
    this.bus.on('navigate', handler);
    return () => {
      const registered = this.callbacks.get(cb);
      if (!registered) return;
      this.bus.off('navigate', registered);
      this.callbacks.delete(cb);
    };
  }

  destroy(): void {
    this.stack.length = 0; // silent clear — no event on destroy
    this.callbacks.clear();
    this.bus.removeAll();
  }

  private notify(entry: ViewEntry, action: NavigateAction): void {
    const detail = { entry, action };
    this.bus.emit('navigate', detail);
    eventBus.emit('navigate', detail);
  }
}
