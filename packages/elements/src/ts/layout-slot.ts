/** Per-slot state object — encapsulates all slot-specific closure variables. */
export interface SlotConfig {
  id?: string;
  render?: (slot: HTMLElement) => void;
}

export class SlotState {
  visible: boolean;
  viewDriven = false;
  manualRender: ((el: HTMLElement) => void) | null = null;
  panelId: string | undefined;
  locked = false;
  private saved: boolean;

  constructor(
    private readonly domId: string,
    initial: boolean,
    panelId?: string,
  ) {
    this.visible = initial;
    this.saved = initial;
    this.panelId = panelId;
  }

  /** Write hidden to DOM. */
  sync(): void {
    const el = document.getElementById(this.domId);
    if (el && el.hidden !== !this.visible) el.hidden = !this.visible;
  }

  /** Save state before fullpage. */
  save(): void { this.saved = this.visible; }

  /** Restore state after fullpage. */
  restore(): void { this.visible = this.saved; }

  /** Apply view config: undefined = don't touch (close if view-driven), false = close, object = open + render. */
  applyConfig(cfg: false | SlotConfig | undefined): void {
    if (cfg === undefined) {
      if (this.viewDriven) {
        this.visible = false;
        this.viewDriven = false;
      }
      return;
    }
    if (cfg === false) {
      this.visible = false;
      this.viewDriven = false;
      this.panelId = undefined;
      this.locked = true;
      return;
    }
    this.visible = true;
    this.viewDriven = true;
    this.locked = false;
    if (cfg.id) this.panelId = cfg.id;
    if (cfg.render) this.render(cfg.render);
  }

  /** Toggle visibility (manual). Returns false if blocked. */
  toggle(config?: SlotConfig): boolean {
    if (this.locked) return false;
    this.visible = !this.visible;
    this.viewDriven = false;
    if (config && config.id) this.panelId = config.id;
    if (config && config.render) this.manualRender = config.render;
    this.sync();
    if (this.visible) {
      const fn = (config && config.render) || this.manualRender;
      if (fn) this.render(fn);
    }
    return true;
  }

  /** Open slot (manual). Returns false if blocked. */
  open(config?: SlotConfig): boolean {
    if (this.locked) return false;
    this.visible = true;
    this.viewDriven = false;
    if (config && config.render) this.manualRender = config.render;
    this.sync();
    const fn = (config && config.render) || this.manualRender;
    if (fn) this.render(fn);
    return true;
  }

  /** Close slot. */
  close(): void {
    this.visible = false;
    this.viewDriven = false;
    this.sync();
  }

  /** Call render on DOM element. */
  private render(fn: (el: HTMLElement) => void): void {
    const el = document.getElementById(this.domId);
    if (el) fn(el);
  }
}
