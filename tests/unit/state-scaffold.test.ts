/**
 * Unit tests for StateScaffold.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StateScaffold } from '../../src/ts/state-scaffold';

describe('StateScaffold', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('renders loading state with skeleton bars by default', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    expect(scaffold.getState()).toBe('loading');
    expect(el.classList.contains('mn-scaffold')).toBe(true);
    expect(el.classList.contains('mn-scaffold--loading')).toBe(true);

    const bars = el.querySelectorAll('.mn-scaffold__skeleton-bar');
    expect(bars.length).toBe(3);
    scaffold.destroy();
  });

  it('loading panel has aria-busy and role=status', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    const panel = el.querySelector('.mn-scaffold__panel--loading');
    expect(panel?.getAttribute('aria-busy')).toBe('true');
    expect(panel?.getAttribute('role')).toBe('status');
    scaffold.destroy();
  });

  it('setState("empty") shows empty message', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    scaffold.setState('empty', 'Nothing here yet.');
    expect(scaffold.getState()).toBe('empty');
    expect(el.classList.contains('mn-scaffold--empty')).toBe(true);
    expect(el.classList.contains('mn-scaffold--loading')).toBe(false);
    expect(el.querySelector('.mn-scaffold__message')?.textContent).toBe('Nothing here yet.');
    scaffold.destroy();
  });

  it('empty state uses default message when none provided', () => {
    const scaffold = new StateScaffold(el, { state: 'empty' });
    const msg = el.querySelector('.mn-scaffold__message');
    expect(msg?.textContent).toBe('No data available yet.');
    scaffold.destroy();
  });

  it('setState("error") shows error message with retry button', () => {
    const retrySpy = vi.fn();
    const scaffold = new StateScaffold(el, {
      state: 'loading',
      onRetry: retrySpy,
    });

    scaffold.setState('error', 'Server unreachable.');
    expect(scaffold.getState()).toBe('error');

    const msg = el.querySelector('.mn-scaffold__message');
    expect(msg?.textContent).toBe('Server unreachable.');

    const btn = el.querySelector<HTMLButtonElement>('.mn-scaffold__action');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('Retry');
    scaffold.destroy();
  });

  it('retry button fires onRetry callback', () => {
    const retrySpy = vi.fn();
    const scaffold = new StateScaffold(el, {
      state: 'error',
      message: 'Failed',
      onRetry: retrySpy,
    });

    const btn = el.querySelector<HTMLButtonElement>('.mn-scaffold__action');
    btn?.click();
    expect(retrySpy).toHaveBeenCalledOnce();
    scaffold.destroy();
  });

  it('setState("no-results") shows no-results message with action', () => {
    const actionSpy = vi.fn();
    const scaffold = new StateScaffold(el, {
      state: 'no-results',
      message: 'No matches found.',
      actionLabel: 'Reset filters',
      onAction: actionSpy,
    });

    expect(scaffold.getState()).toBe('no-results');
    const msg = el.querySelector('.mn-scaffold__message');
    expect(msg?.textContent).toBe('No matches found.');

    const btn = el.querySelector<HTMLButtonElement>('.mn-scaffold__action');
    expect(btn?.textContent).toBe('Reset filters');
    btn?.click();
    expect(actionSpy).toHaveBeenCalledOnce();
    scaffold.destroy();
  });

  it('setState("partial") shows banner and reveals content', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    scaffold.setState('partial', 'Partial data loaded.');

    expect(scaffold.getState()).toBe('partial');
    const banner = el.querySelector('.mn-scaffold__banner');
    expect(banner).not.toBeNull();
    expect(banner?.textContent).toBe('Partial data loaded.');

    /* Content slot should be visible */
    const content = el.querySelector('.mn-scaffold__content');
    expect(content?.classList.contains('mn-scaffold__content--hidden')).toBe(false);
    scaffold.destroy();
  });

  it('non-partial states hide content slot', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    const content = el.querySelector('.mn-scaffold__content');
    expect(content?.classList.contains('mn-scaffold__content--hidden')).toBe(true);

    scaffold.setState('error');
    expect(content?.classList.contains('mn-scaffold__content--hidden')).toBe(true);
    scaffold.destroy();
  });

  it('aria-live is present on status panels', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    let panel = el.querySelector('[aria-live]');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('aria-live')).toBe('polite');

    scaffold.setState('error', 'Error occurred');
    panel = el.querySelector('[aria-live]');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('aria-live')).toBe('polite');
    scaffold.destroy();
  });

  it('getContentHost() returns the content slot element', () => {
    const scaffold = new StateScaffold(el, { state: 'partial' });
    const host = scaffold.getContentHost();
    expect(host).toBeInstanceOf(HTMLElement);
    expect(host.classList.contains('mn-scaffold__content')).toBe(true);
    scaffold.destroy();
  });

  it('preserves existing children in content slot', () => {
    const child = document.createElement('p');
    child.textContent = 'Pre-existing';
    el.appendChild(child);

    const scaffold = new StateScaffold(el, { state: 'partial' });
    const content = scaffold.getContentHost();
    expect(content.querySelector('p')?.textContent).toBe('Pre-existing');
    scaffold.destroy();
  });

  it('destroy() restores original DOM structure', () => {
    const child = document.createElement('span');
    child.textContent = 'Original';
    el.appendChild(child);

    const scaffold = new StateScaffold(el, { state: 'loading' });
    scaffold.destroy();

    expect(el.classList.contains('mn-scaffold')).toBe(false);
    expect(el.querySelector('.mn-scaffold__status')).toBeNull();
    expect(el.querySelector('.mn-scaffold__content')).toBeNull();
    expect(el.querySelector('span')?.textContent).toBe('Original');
  });

  it('destroy() removes all state classes', () => {
    const scaffold = new StateScaffold(el, { state: 'error' });
    scaffold.destroy();

    expect(el.classList.contains('mn-scaffold--error')).toBe(false);
    expect(el.classList.contains('mn-scaffold--loading')).toBe(false);
    expect(el.classList.contains('mn-scaffold--empty')).toBe(false);
    expect(el.classList.contains('mn-scaffold--partial')).toBe(false);
    expect(el.classList.contains('mn-scaffold--no-results')).toBe(false);
  });

  it('setState transitions cleanly between all states', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    const states = ['empty', 'error', 'partial', 'no-results', 'ready', 'loading'] as const;

    for (const s of states) {
      scaffold.setState(s);
      expect(scaffold.getState()).toBe(s);
      expect(el.classList.contains(`mn-scaffold--${s}`)).toBe(true);
    }
    scaffold.destroy();
  });

  it('setState("ready") hides status, shows content, sets aria-busy=false', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    scaffold.setState('ready');
    expect(scaffold.getState()).toBe('ready');
    expect(el.classList.contains('mn-scaffold--ready')).toBe(true);
    expect(el.classList.contains('mn-scaffold--loading')).toBe(false);
    expect((el.querySelector('.mn-scaffold__status') as HTMLElement)?.innerHTML).toBe('');
    expect(el.querySelector('.mn-scaffold__content')?.classList.contains('mn-scaffold__content--hidden')).toBe(false);
    expect(el.getAttribute('aria-busy')).toBe('false');
    scaffold.destroy();
  });

  it.each(['loading', 'empty', 'error'] as const)('transitions from %s to ready correctly', (from) => {
    const scaffold = new StateScaffold(el, { state: from, message: 'Test' });
    expect(scaffold.getState()).toBe(from);
    scaffold.setState('ready');
    expect(scaffold.getState()).toBe('ready');
    expect(el.querySelector('.mn-scaffold__content')?.classList.contains('mn-scaffold__content--hidden')).toBe(false);
    scaffold.destroy();
  });

  it('partial state still works for degraded content with banner', () => {
    const scaffold = new StateScaffold(el, { state: 'loading' });
    scaffold.setState('partial', 'Some data may be unavailable.');
    expect(scaffold.getState()).toBe('partial');
    expect(el.querySelector('.mn-scaffold__banner')?.textContent).toBe('Some data may be unavailable.');
    expect(el.querySelector('.mn-scaffold__content')?.classList.contains('mn-scaffold__content--hidden')).toBe(false);
    scaffold.destroy();
  });

  it('console.warn fires on invalid state name', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const scaffold = new StateScaffold(el, { state: 'loading' });
    scaffold.setState('bogus' as 'loading');
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0]?.[0]).toContain('bogus');
    expect(scaffold.getState()).toBe('loading');
    warnSpy.mockRestore();
    scaffold.destroy();
  });

  it('destroy removes ready state class', () => {
    const scaffold = new StateScaffold(el, { state: 'ready' });
    scaffold.destroy();
    expect(el.classList.contains('mn-scaffold--ready')).toBe(false);
  });
});
