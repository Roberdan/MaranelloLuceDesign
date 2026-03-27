import { escapeHtml } from './core/sanitize';

export interface AsyncDataProvider<T = unknown> {
  search(query: string): Promise<T[]>;
  renderItem?: (item: T) => string;
  getLabel?: (item: T) => string;
  getId?: (item: T) => string;
}

export interface AsyncSelectOptions<T = unknown> {
  provider: AsyncDataProvider<T>;
  onSelect?: (item: T) => void;
  placeholder?: string;
  debounceMs?: number;
  minChars?: number;
}

export class AsyncSelect<T = unknown> {
  private provider: AsyncDataProvider<T>;
  private readonly onSelect?: (item: T) => void;
  private readonly debounceMs: number;
  private readonly minChars: number;
  private readonly input: HTMLInputElement;
  private readonly dropdown: HTMLDivElement;
  private readonly listboxId = `mn-async-select-listbox-${Math.random().toString(36).slice(2, 8)}`;
  private readonly onDocClick: (e: MouseEvent) => void;
  private readonly onInput: () => void;
  private readonly onKeyDown: (e: KeyboardEvent) => void;
  private items: T[] = [];
  private selected?: T;
  private activeIndex = -1;
  private timer?: number;
  private openState = false;
  private requestId = 0;
  private destroyed = false;

  constructor(private readonly container: HTMLElement, options: AsyncSelectOptions<T>) {
    this.provider = options.provider;
    this.onSelect = options.onSelect;
    this.debounceMs = options.debounceMs ?? 300;
    this.minChars = options.minChars ?? 1;
    this.container.innerHTML = '';
    this.container.classList.add('mn-async-select');
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'mn-async-select__input';
    this.input.placeholder = options.placeholder ?? 'Search...';
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-controls', this.listboxId);
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'mn-async-select__dropdown';
    this.dropdown.id = this.listboxId;
    this.dropdown.setAttribute('role', 'listbox');
    this.dropdown.hidden = true;
    this.container.append(this.input, this.dropdown);
    this.onInput = () => this.scheduleSearch();
    this.onKeyDown = (e) => this.handleKeyDown(e);
    this.onDocClick = (e) => { if (!this.container.contains(e.target as Node)) this.close(); };
    this.input.addEventListener('input', this.onInput);
    this.input.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('click', this.onDocClick);
  }

  open(): void {
    if (this.openState) return;
    this.openState = true;
    this.dropdown.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
  }

  close(): void {
    this.openState = false;
    this.dropdown.hidden = true;
    this.activeIndex = -1;
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');
  }

  clear(): void {
    this.selected = undefined;
    this.items = [];
    this.input.value = '';
    this.dropdown.innerHTML = '';
    this.close();
  }

  getValue(): T | undefined {
    return this.selected;
  }

  setProvider(provider: AsyncDataProvider<T>): void {
    this.provider = provider;
    this.clear();
  }

  destroy(): void {
    this.destroyed = true;
    if (this.timer) window.clearTimeout(this.timer);
    document.removeEventListener('click', this.onDocClick);
    this.input.removeEventListener('input', this.onInput);
    this.input.removeEventListener('keydown', this.onKeyDown);
    this.container.innerHTML = '';
    this.container.classList.remove('mn-async-select');
  }

  private scheduleSearch(): void {
    if (this.timer) window.clearTimeout(this.timer);
    const query = this.input.value.trim();
    if (query.length < this.minChars) {
      this.requestId++;
      this.items = [];
      this.dropdown.innerHTML = '';
      this.close();
      return;
    }
    this.timer = window.setTimeout(() => { void this.fetchResults(query); }, this.debounceMs);
  }

  private async fetchResults(query: string): Promise<void> {
    const req = ++this.requestId;
    this.showLoading();
    try {
      const results = await this.provider.search(query);
      if (this.destroyed || req !== this.requestId) return;
      this.items = results;
      this.renderItems();
    } catch {
      if (!this.destroyed && req === this.requestId) this.close();
    }
  }

  private showLoading(): void {
    this.open();
    this.dropdown.innerHTML = '<div class="mn-async-select__loading"><span class="mn-async-select__spinner"></span>Loading...</div>';
  }

  private renderItems(): void {
    this.dropdown.innerHTML = '';
    this.activeIndex = -1;
    this.input.removeAttribute('aria-activedescendant');
    if (!this.items.length) return this.close();
    this.open();
    this.items.forEach((item, index) => {
      const opt = document.createElement('div');
      const id = this.provider.getId?.(item) ?? String(index);
      opt.id = `${this.listboxId}-opt-${escapeHtml(id)}`;
      opt.className = 'mn-async-select__item';
      opt.setAttribute('role', 'option');
      opt.setAttribute('aria-selected', 'false');
      opt.innerHTML = escapeHtml(this.provider.renderItem?.(item) ?? String(item));
      opt.addEventListener('mouseenter', () => this.setActive(index));
      opt.addEventListener('mousedown', (e) => e.preventDefault());
      opt.addEventListener('click', () => this.selectIndex(index));
      this.dropdown.appendChild(opt);
    });
  }

  private setActive(index: number): void {
    if (!this.items.length) return;
    const len = this.items.length;
    this.activeIndex = ((index % len) + len) % len;
    const options = this.dropdown.querySelectorAll<HTMLElement>('.mn-async-select__item');
    options.forEach((el, i) => {
      const active = i === this.activeIndex;
      el.classList.toggle('mn-async-select__item--active', active);
      el.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const active = options[this.activeIndex];
    if (!active) return;
    this.input.setAttribute('aria-activedescendant', active.id);
    active.scrollIntoView({ block: 'nearest' });
  }

  private selectIndex(index: number): void {
    const item = this.items[index];
    if (!item) return;
    this.selected = item;
    this.input.value = this.provider.getLabel?.(item) ?? String(item);
    this.onSelect?.(item);
    this.close();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' || e.key === 'Tab') return this.close();
    if (!this.items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); return this.setActive(this.activeIndex + 1); }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      return this.setActive(this.activeIndex <= 0 ? this.items.length - 1 : this.activeIndex - 1);
    }
    if (e.key === 'Enter' && this.activeIndex >= 0) {
      e.preventDefault();
      this.selectIndex(this.activeIndex);
    }
  }
}
