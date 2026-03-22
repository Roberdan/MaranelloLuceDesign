import { eventBus } from './core/events';

export type Placement = 'page' | 'side-panel' | 'bottom-dock' | 'modal' | 'overlay' | 'workspace';

export interface ViewConfig {
  id: string;
  tag?: string;
  factory?: (container: HTMLElement, data?: unknown) => unknown;
  title: string;
  icon?: string;
  defaultPlacement: Placement;
  sizeHint?: { width?: string; height?: string };
}

export class ViewRegistry {
  private static instance: ViewRegistry | undefined;
  private readonly configs = new Map<string, ViewConfig>();

  private constructor() {}

  static getInstance(): ViewRegistry {
    if (!ViewRegistry.instance) {
      ViewRegistry.instance = new ViewRegistry();
    }
    return ViewRegistry.instance;
  }

  static reset(): void {
    if (ViewRegistry.instance) {
      ViewRegistry.instance.clear();
    }
    ViewRegistry.instance = undefined;
  }

  register(config: ViewConfig): void {
    if (this.configs.has(config.id)) {
      throw new Error(`View "${config.id}" is already registered`);
    }
    this.configs.set(config.id, config);
    eventBus.emit('view-registered', { viewId: config.id, config });
  }

  get(id: string): ViewConfig | undefined {
    const cfg = this.configs.get(id);
    return cfg ? { ...cfg } : undefined;
  }

  list(): ReadonlyArray<ViewConfig> {
    return Object.freeze([...this.configs.values()].map(c => ({ ...c })));
  }

  unregister(id: string): boolean {
    if (!this.configs.has(id)) {
      return false;
    }
    this.configs.delete(id);
    eventBus.emit('view-unregistered', { viewId: id });
    return true;
  }

  has(id: string): boolean {
    return this.configs.has(id);
  }

  clear(): void {
    for (const id of [...this.configs.keys()]) {
      this.unregister(id);
    }
  }
}
