/** Lightweight per-widget state wrapper for DashboardRenderer (replaces StateScaffold). */

export type WidgetState = 'loading' | 'error' | 'empty' | 'ready';

const WIDGET_STATES: readonly WidgetState[] = ['loading', 'error', 'empty', 'ready'];

export class WidgetScaffold {
  private container: HTMLElement;
  private content: HTMLElement;
  private status: HTMLElement;
  private state: WidgetState;
  private events: AbortController | null = null;
  private retryFn?: () => void;

  constructor(container: HTMLElement, options: { state: WidgetState; onRetry?: () => void }) {
    this.container = container;
    this.state = options.state;
    this.retryFn = options.onRetry;

    this.status = document.createElement('div');
    this.status.className = 'mn-scaffold__status';

    this.content = document.createElement('div');
    this.content.className = 'mn-scaffold__content';

    while (this.container.firstChild) {
      this.content.appendChild(this.container.firstChild);
    }

    this.container.classList.add('mn-scaffold');
    this.container.append(this.status, this.content);
    this.applyState();
  }

  setState(state: WidgetState, message?: string): void {
    if (!WIDGET_STATES.includes(state)) {
      console.warn(`WidgetScaffold: invalid state "${state}".`);
      return;
    }
    this.state = state;

    this.events?.abort();
    this.events = new AbortController();
    this.applyState(message);
  }

  getContentHost(): HTMLElement {
    return this.content;
  }

  destroy(): void {
    this.events?.abort();
    this.events = null;
    this.status.remove();
    while (this.content.firstChild) {
      this.container.appendChild(this.content.firstChild);
    }
    this.content.remove();
    this.container.removeAttribute('aria-busy');
    this.container.classList.remove('mn-scaffold');
    for (const name of WIDGET_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
  }

  private applyState(message?: string): void {
    for (const name of WIDGET_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
    this.container.classList.add(`mn-scaffold--${this.state}`);
    this.container.setAttribute('aria-busy', this.state === 'loading' ? 'true' : 'false');
    this.status.innerHTML = '';
    this.content.classList.toggle('mn-scaffold__content--hidden', this.state !== 'ready');

    if (this.state === 'loading') {
      this.renderLoading();
    } else if (this.state === 'error') {
      this.renderMessage(message || 'Widget failed to load.');
    } else if (this.state === 'empty') {
      this.renderMessage(message || 'No data available.');
    }
  }

  private renderLoading(): void {
    const panel = document.createElement('div');
    panel.className = 'mn-scaffold__panel mn-scaffold__panel--loading';
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');
    for (let i = 0; i < 3; i += 1) {
      const bar = document.createElement('div');
      bar.className = 'mn-scaffold__skeleton-bar';
      panel.appendChild(bar);
    }
    this.status.appendChild(panel);
  }

  private renderMessage(text: string): void {
    const panel = document.createElement('div');
    panel.className = 'mn-scaffold__panel mn-scaffold__panel--message';
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');

    const p = document.createElement('p');
    p.className = 'mn-scaffold__message';
    p.textContent = text;
    panel.appendChild(p);

    if (this.state === 'error' && this.retryFn) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mn-scaffold__action';
      btn.textContent = 'Retry';
      btn.addEventListener('click', this.retryFn, { signal: this.events?.signal });
      panel.appendChild(btn);
    }

    this.status.appendChild(panel);
  }
}
