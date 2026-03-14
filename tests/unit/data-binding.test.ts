/**
 * Unit tests for data-binding module.
 * Covers bind(), autoBind(), emit/on/off lifecycle, and security guards.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { bind, autoBind } from '../../src/ts/data-binding';
import { emit, on, off } from '../../src/ts/data-binding-events';

// --- bind() property whitelist ---

describe('bind() — allowed property (textContent)', () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('sets textContent when property is whitelisted', async () => {
    // Arrange
    const fetchFn = vi.fn().mockResolvedValue('hello world');

    // Act
    bind(el, { fetch: fetchFn, property: 'textContent' });
    await vi.waitFor(() => el.textContent === 'hello world');

    // Assert
    expect(el.textContent).toBe('hello world');
  });

  it('sets value on input element via whitelisted property', async () => {
    // Arrange
    const input = document.createElement('input');
    document.body.appendChild(input);
    const fetchFn = vi.fn().mockResolvedValue('test-value');

    // Act
    bind(input, { fetch: fetchFn, property: 'value' });
    await vi.waitFor(() => (input as HTMLInputElement).value === 'test-value');

    // Assert
    expect((input as HTMLInputElement).value).toBe('test-value');
    input.remove();
  });
});

describe('bind() — non-whitelisted property warns', () => {
  it('emits console.warn for non-whitelisted property', async () => {
    // Arrange
    const el = document.createElement('div');
    document.body.appendChild(el);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchFn = vi.fn().mockResolvedValue('x');

    // Act
    bind(el, { fetch: fetchFn, property: 'onclick' });
    await vi.waitFor(() => warnSpy.mock.calls.length > 0);

    // Assert
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toContain('[Maranello]');

    warnSpy.mockRestore();
    el.remove();
  });
});

// --- bind() innerHTML escapes ---

describe('bind() — innerHTML uses escapeHtml', () => {
  it('escapes HTML when property is innerHTML', async () => {
    // Arrange
    const el = document.createElement('div');
    document.body.appendChild(el);
    const fetchFn = vi.fn().mockResolvedValue('<script>alert(1)</script>');

    // Act
    bind(el, { fetch: fetchFn, property: 'innerHTML' });
    await vi.waitFor(() => el.innerHTML.length > 0);

    // Assert — raw script tag must not appear as parsed HTML
    expect(el.querySelector('script')).toBeNull();
    expect(el.innerHTML).toContain('&lt;script&gt;');

    el.remove();
  });

  it('does NOT escape when property is textContent', async () => {
    // Arrange
    const el = document.createElement('div');
    document.body.appendChild(el);
    const fetchFn = vi.fn().mockResolvedValue('<b>bold</b>');

    // Act
    bind(el, { fetch: fetchFn, property: 'textContent' });
    await vi.waitFor(() => el.textContent === '<b>bold</b>');

    // Assert — textContent is literal, no child elements created
    expect(el.querySelector('b')).toBeNull();
    expect(el.textContent).toBe('<b>bold</b>');

    el.remove();
  });
});

// --- emit / on / off lifecycle ---

describe('emit / on / off lifecycle', () => {
  it('on subscribes and receives emitted event detail', () => {
    // Arrange
    const handler = vi.fn();

    // Act
    on('test-event', handler);
    emit('test-event', { value: 42 });

    // Assert
    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ value: 42 });

    off('test-event', handler);
  });

  it('off unsubscribes handler — subsequent emits not received', () => {
    // Arrange
    const handler = vi.fn();
    on('test-off', handler);

    // Act
    off('test-off', handler);
    emit('test-off', 'payload');

    // Assert
    expect(handler).not.toHaveBeenCalled();
  });

  it('multiple listeners all receive the same event', () => {
    // Arrange
    const h1 = vi.fn();
    const h2 = vi.fn();
    on('multi-test', h1);
    on('multi-test', h2);

    // Act
    emit('multi-test', 'shared');

    // Assert
    expect(h1).toHaveBeenCalledWith('shared');
    expect(h2).toHaveBeenCalledWith('shared');

    off('multi-test', h1);
    off('multi-test', h2);
  });

  it('off only removes the specific handler, others remain active', () => {
    // Arrange
    const h1 = vi.fn();
    const h2 = vi.fn();
    on('partial-off', h1);
    on('partial-off', h2);

    // Act
    off('partial-off', h1);
    emit('partial-off', 'data');

    // Assert
    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledWith('data');

    off('partial-off', h2);
  });
});

// --- autoBind ---

describe('autoBind()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('finds [data-mn-bind] elements and calls bind() for them', () => {
    // Arrange — element with a valid URL binding
    const el = document.createElement('div');
    el.setAttribute('data-mn-bind', 'url:/api/data;prop:textContent');
    document.body.appendChild(el);

    // Act — autoBind should not throw even if fetch fails
    expect(() => autoBind()).not.toThrow();
  });

  it('ignores elements without a url key in data-mn-bind', () => {
    // Arrange
    const el = document.createElement('div');
    el.setAttribute('data-mn-bind', 'prop:textContent');
    document.body.appendChild(el);

    // Act + Assert — no error thrown
    expect(() => autoBind()).not.toThrow();
  });
});

// --- prototype pollution guard ---

describe('autoBind() — prototype pollution guard', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('rejects __proto__ key with console.warn', () => {
    // Arrange
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('div');
    el.setAttribute('data-mn-bind', '__proto__:polluted;url:/api');
    document.body.appendChild(el);

    // Act
    autoBind();

    // Assert
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Maranello]'),
      '__proto__',
    );
    warnSpy.mockRestore();
  });

  it('rejects constructor key with console.warn', () => {
    // Arrange
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('div');
    el.setAttribute('data-mn-bind', 'constructor:polluted;url:/api');
    document.body.appendChild(el);

    // Act
    autoBind();

    // Assert
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Maranello]'),
      'constructor',
    );
    warnSpy.mockRestore();
  });
});
