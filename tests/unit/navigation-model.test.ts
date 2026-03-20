/**
 * Unit tests for NavigationModel.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NavigationModel } from '../../src/ts/navigation-model';

describe('NavigationModel', () => {
  let nav: NavigationModel;

  beforeEach(() => {
    nav = new NavigationModel();
  });

  afterEach(() => {
    nav.destroy();
  });

  it('push() adds entry to stack and returns it', () => {
    const entry = nav.push('dashboard');
    expect(entry.viewId).toBe('dashboard');
    expect(entry.timestamp).toBeGreaterThan(0);
  });

  it('push() with params stores them on entry', () => {
    const entry = nav.push('detail', { id: '42', mode: 'edit' });
    expect(entry.params?.id).toBe('42');
    expect(entry.params?.mode).toBe('edit');
  });

  it('current() returns top of stack without removing', () => {
    nav.push('a');
    nav.push('b');
    const top = nav.current();
    expect(top?.viewId).toBe('b');

    /* Calling current again should return the same */
    expect(nav.current()?.viewId).toBe('b');
  });

  it('current() returns undefined on empty stack', () => {
    expect(nav.current()).toBeUndefined();
  });

  it('pop() removes top and returns new current', () => {
    nav.push('first');
    nav.push('second');

    const result = nav.pop();
    expect(result?.viewId).toBe('first');
    expect(nav.current()?.viewId).toBe('first');
  });

  it('pop() returns undefined when stack is empty', () => {
    expect(nav.pop()).toBeUndefined();
  });

  it('pop() on single-entry stack returns undefined (stack becomes empty)', () => {
    nav.push('only');
    const result = nav.pop();

    /* After pop, stack is empty: pop returns current() which is undefined */
    expect(result).toBeUndefined();
    expect(nav.current()).toBeUndefined();
  });

  it('replace() swaps top entry', () => {
    nav.push('old');
    const replaced = nav.replace('new', { fresh: true });
    expect(replaced.viewId).toBe('new');
    expect(nav.current()?.viewId).toBe('new');
    expect(nav.history().length).toBe(1);
  });

  it('replace() on empty stack pushes instead', () => {
    const entry = nav.replace('first');
    expect(entry.viewId).toBe('first');
    expect(nav.history().length).toBe(1);
  });

  it('canGoBack() is true with 2+ entries', () => {
    expect(nav.canGoBack()).toBe(false);
    nav.push('a');
    expect(nav.canGoBack()).toBe(false);
    nav.push('b');
    expect(nav.canGoBack()).toBe(true);
  });

  it('history() returns a copy of the stack', () => {
    nav.push('x');
    nav.push('y');
    const h = nav.history();
    expect(h.length).toBe(2);
    expect(h[0].viewId).toBe('x');
    expect(h[1].viewId).toBe('y');
  });

  it('remove() deletes all entries with given viewId', () => {
    nav.push('a');
    nav.push('b');
    nav.push('a');
    nav.remove('a');
    expect(nav.history().length).toBe(1);
    expect(nav.current()?.viewId).toBe('b');
  });

  it('clear() empties the stack', () => {
    nav.push('x');
    nav.push('y');
    nav.clear();
    expect(nav.current()).toBeUndefined();
    expect(nav.history().length).toBe(0);
  });

  it('onNavigate() callback fires on push', () => {
    const spy = vi.fn();
    nav.onNavigate(spy);

    nav.push('home');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].viewId).toBe('home');
    expect(spy.mock.calls[0][1]).toBe('push');
  });

  it('onNavigate() callback fires on pop', () => {
    const spy = vi.fn();
    nav.push('a');
    nav.push('b');

    nav.onNavigate(spy);
    nav.pop();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].viewId).toBe('a');
    expect(spy.mock.calls[0][1]).toBe('pop');
  });

  it('onNavigate() callback fires on replace', () => {
    const spy = vi.fn();
    nav.push('original');
    nav.onNavigate(spy);

    nav.replace('swapped');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].viewId).toBe('swapped');
    expect(spy.mock.calls[0][1]).toBe('replace');
  });

  it('unsubscribe function stops further callbacks', () => {
    const spy = vi.fn();
    const unsub = nav.onNavigate(spy);

    nav.push('a');
    expect(spy).toHaveBeenCalledOnce();

    unsub();
    nav.push('b');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('destroy() clears stack and callbacks', () => {
    const spy = vi.fn();
    nav.onNavigate(spy);
    nav.push('a');
    spy.mockClear();

    nav.destroy();
    expect(nav.current()).toBeUndefined();

    /* After destroy, pushing should not call old callback */
    nav.push('post-destroy');
    expect(spy).not.toHaveBeenCalled();
  });

  it('multiple subscribers all receive events', () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    nav.onNavigate(spy1);
    nav.onNavigate(spy2);

    nav.push('shared');
    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
  });
});
