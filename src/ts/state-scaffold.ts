export interface StateScaffoldOptions {
  state: 'loading' | 'empty' | 'error' | 'partial' | 'no-results' | 'ready';
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
  onAction?: () => void;
}

type ScaffoldState = StateScaffoldOptions['state'];

const VALID_STATES: readonly ScaffoldState[] = ['loading', 'empty', 'error', 'partial', 'no-results', 'ready'];

export class StateScaffold {
  private container: HTMLElement;
  private content: HTMLElement;
  private status: HTMLElement;
  private options: StateScaffoldOptions;
  private state: ScaffoldState;
  private events: AbortController | null = null;

  constructor(container: HTMLElement, options: StateScaffoldOptions) {
    const validInitial = options?.state && VALID_STATES.includes(options.state);
    if (!validInitial && options?.state) {
      console.warn(`StateScaffold: invalid initial state "${options.state}". Falling back to "loading". Valid states: ${VALID_STATES.join(', ')}`);
    }
    const initial = validInitial ? options.state : 'loading';
    this.container = container;
    this.options = { ...options, state: initial };
    this.state = initial;

    this.status = document.createElement('div');
    this.status.className = 'mn-scaffold__status';

    this.content = document.createElement('div');
    this.content.className = 'mn-scaffold__content';

    while (this.container.firstChild) {
      this.content.appendChild(this.container.firstChild);
    }

    this.container.classList.add('mn-scaffold');
    this.container.append(this.status, this.content);
    this.setState(initial, this.options.message);
  }

  setState(state: ScaffoldState, message?: string): void {
    if (!VALID_STATES.includes(state)) {
      console.warn(`StateScaffold: invalid state "${state}". Valid states: ${VALID_STATES.join(', ')}`);
      return;
    }
    this.state = state;
    this.options.state = state;
    if (typeof message === 'string') {
      this.options.message = message;
    }

    this.events?.abort();
    this.events = new AbortController();

    for (const name of VALID_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
    this.container.classList.add(`mn-scaffold--${state}`);
    this.container.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');

    this.status.innerHTML = '';
    this.content.classList.toggle('mn-scaffold__content--hidden', state !== 'partial' && state !== 'ready');

    if (state === 'loading') this.renderLoading();
    if (state === 'empty') this.renderEmpty();
    if (state === 'error') this.renderError();
    if (state === 'partial') this.renderPartial();
    if (state === 'no-results') this.renderNoResults();
    if (state === 'ready') this.renderReady();
  }

  getState(): string {
    return this.state;
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
    this.container.classList.remove('mn-scaffold', 'mn-scaffold__content--hidden');
    for (const name of VALID_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
  }

  private renderLoading(): void {
    const panel = this.buildPanel('loading');
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');

    for (let i = 0; i < 3; i += 1) {
      const bar = document.createElement('div');
      bar.className = 'mn-scaffold__skeleton-bar';
      panel.appendChild(bar);
    }

    this.status.appendChild(panel);
  }

  private renderEmpty(): void {
    const panel = this.buildMessageState(
      this.options.message || 'No data available yet.',
      this.options.onAction,
      this.options.actionLabel,
      'Take action',
    );
    this.status.appendChild(panel);
  }

  private renderError(): void {
    const panel = this.buildMessageState(
      this.options.message || 'Something went wrong. Please try again.',
      this.options.onRetry,
      'Retry',
      'Retry',
    );
    this.status.appendChild(panel);
  }

  private renderPartial(): void {
    const banner = document.createElement('div');
    banner.className = 'mn-scaffold__banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');

    const text = document.createElement('p');
    text.className = 'mn-scaffold__message';
    text.textContent = this.options.message || 'Some data may be unavailable right now.';
    banner.appendChild(text);

    this.status.appendChild(banner);
  }

  private renderReady(): void {
    this.status.innerHTML = '';
  }

  private renderNoResults(): void {
    const panel = this.buildMessageState(
      this.options.message || 'No results match your filters.',
      this.options.onAction,
      this.options.actionLabel,
      'Clear filters',
    );
    this.status.appendChild(panel);
  }

  private buildPanel(modifier: string): HTMLElement {
    const panel = document.createElement('div');
    panel.className = `mn-scaffold__panel mn-scaffold__panel--${modifier}`;
    return panel;
  }

  private buildMessageState(
    message: string,
    action?: () => void,
    actionLabel?: string,
    fallbackLabel?: string,
  ): HTMLElement {
    const panel = this.buildPanel('message');
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');

    const text = document.createElement('p');
    text.className = 'mn-scaffold__message';
    text.textContent = message;
    panel.appendChild(text);

    if (action) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mn-scaffold__action';
      button.textContent = actionLabel || fallbackLabel || 'Action';
      button.addEventListener('click', action, { signal: this.events?.signal });
      panel.appendChild(button);
    }

    return panel;
  }
}
