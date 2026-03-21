/** @vitest-environment happy-dom */
import { beforeEach, describe, expect, it } from 'vitest';
import { StateScaffold } from '../src/ts/state-scaffold';
import '../src/wc/mn-state-scaffold.js';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  container.innerHTML = '<div class="content">Body</div>';
});

describe('StateScaffold', () => {
  it('defaults to loading when invalid state is provided', () => {
    const scaffold = new StateScaffold(container, { state: 'invalid' } as unknown as { state: 'loading' });
    expect(scaffold.getState()).toBe('loading');
    expect(container.classList.contains('mn-scaffold--loading')).toBe(true);
    scaffold.destroy();
  });

  it('transitions through all supported states', () => {
    const scaffold = new StateScaffold(container, { state: 'loading' });
    const states = ['empty', 'error', 'partial', 'no-results', 'ready', 'loading'] as const;

    for (const state of states) {
      scaffold.setState(state, `state-${state}`);
      expect(scaffold.getState()).toBe(state);
      expect(container.classList.contains(`mn-scaffold--${state}`)).toBe(true);
    }

    scaffold.destroy();
  });

  it('calls retry handler from error button', () => {
    let retries = 0;
    const scaffold = new StateScaffold(container, {
      state: 'error',
      onRetry: () => {
        retries += 1;
      },
    });

    const button = container.querySelector('.mn-scaffold__action') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    button?.click();
    expect(retries).toBe(1);
    scaffold.destroy();
  });

  it('calls action handler from no-results button', () => {
    let actions = 0;
    const scaffold = new StateScaffold(container, {
      state: 'no-results',
      actionLabel: 'Clear filters',
      onAction: () => {
        actions += 1;
      },
    });

    const button = container.querySelector('.mn-scaffold__action') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    button?.click();
    expect(actions).toBe(1);
    scaffold.destroy();
  });

  it('emits mn-retry from web component', () => {
    const el = document.createElement('mn-state-scaffold');
    el.setAttribute('state', 'error');
    document.body.appendChild(el);

    let fired = false;
    el.addEventListener('mn-retry', () => {
      fired = true;
    });

    const button = el.querySelector('.mn-scaffold__action') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    button?.click();
    expect(fired).toBe(true);
    el.remove();
  });

  it('emits mn-action from web component', () => {
    const el = document.createElement('mn-state-scaffold');
    el.setAttribute('state', 'no-results');
    el.setAttribute('action-label', 'Clear filters');
    document.body.appendChild(el);

    let fired = false;
    el.addEventListener('mn-action', () => {
      fired = true;
    });

    const button = el.querySelector('.mn-scaffold__action') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    button?.click();
    expect(fired).toBe(true);
    el.remove();
  });

  it('shows partial banner while keeping content visible', () => {
    const scaffold = new StateScaffold(container, {
      state: 'partial',
      message: 'Only part of the data loaded.',
    });

    expect(container.querySelector('.mn-scaffold__banner')).not.toBeNull();
    expect(container.querySelector('.mn-scaffold__content--hidden')).toBeNull();
    expect(container.querySelector('.content')).not.toBeNull();
    scaffold.destroy();
  });

  it('destroy removes scaffold wrappers and classes', () => {
    const scaffold = new StateScaffold(container, { state: 'empty' });
    scaffold.destroy();

    expect(container.classList.contains('mn-scaffold')).toBe(false);
    expect(container.querySelector('.mn-scaffold__status')).toBeNull();
    expect(container.querySelector('.mn-scaffold__content')).toBeNull();
    expect(container.querySelector('.content')).not.toBeNull();
  });
});
