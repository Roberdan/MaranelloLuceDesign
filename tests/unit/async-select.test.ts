/**
 * Unit tests for AsyncSelect.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AsyncDataProvider } from '../../src/ts/async-select';

interface FakeItem { id: string; name: string }

function fakeProvider(items: FakeItem[]): AsyncDataProvider<FakeItem> {
  return {
    search: vi.fn(async () => items),
    getLabel: (item) => item.name,
    getId: (item) => item.id,
    renderItem: (item) => item.name,
  };
}

describe('AsyncSelect', () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  async function create(
    providerItems: FakeItem[] = [
      { id: '1', name: 'Alpha Corp' },
      { id: '2', name: 'Beta Industries' },
      { id: '3', name: 'Gamma Solutions' },
    ],
    opts?: Partial<import('../../src/ts/async-select').AsyncSelectOptions<FakeItem>>,
  ) {
    const { AsyncSelect } = await import('../../src/ts/async-select');
    const provider = fakeProvider(providerItems);
    const merged = { provider, debounceMs: 100, minChars: 1, ...opts };
    const sel = new AsyncSelect<FakeItem>(container, merged);
    return { sel, provider };
  }

  it('renders input with combobox role', async () => {
    await create();
    const input = container.querySelector('input');
    expect(input).not.toBeNull();
    expect(input?.getAttribute('role')).toBe('combobox');
    expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    expect(input?.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders listbox dropdown', async () => {
    await create();
    const listbox = container.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
    expect((listbox as HTMLElement).hidden).toBe(true);
  });

  it('input has aria-controls pointing to listbox id', async () => {
    await create();
    const input = container.querySelector('input')!;
    const listbox = container.querySelector('[role="listbox"]')!;
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
  });

  it('typing triggers provider.search after debounce', async () => {
    const { provider } = await create();
    const input = container.querySelector('input')!;

    input.value = 'Alp';
    input.dispatchEvent(new Event('input'));

    expect(provider.search).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    expect(provider.search).toHaveBeenCalledWith('Alp');
  });

  it('typing below minChars does not trigger search', async () => {
    const { provider } = await create([], { minChars: 3 });
    const input = container.querySelector('input')!;

    input.value = 'Al';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(500);

    expect(provider.search).not.toHaveBeenCalled();
  });

  it('renders options after search resolves', async () => {
    await create();
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);

    const options = container.querySelectorAll('[role="option"]');
    expect(options.length).toBe(3);
    expect(options[0].textContent).toBe('Alpha Corp');
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('ArrowDown navigates to first then second option', async () => {
    await create();
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    let active = container.querySelector('.mn-async-select__item--active');
    expect(active?.textContent).toBe('Alpha Corp');
    expect(active?.getAttribute('aria-selected')).toBe('true');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    active = container.querySelector('.mn-async-select__item--active');
    expect(active?.textContent).toBe('Beta Industries');
  });

  it('ArrowUp wraps to last option from top', async () => {
    await create();
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    const active = container.querySelector('.mn-async-select__item--active');
    expect(active?.textContent).toBe('Gamma Solutions');
  });

  it('Enter selects the active option and fires onSelect', async () => {
    const onSelect = vi.fn();
    await create(undefined, { onSelect });
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toEqual({ id: '1', name: 'Alpha Corp' });
    expect(input.value).toBe('Alpha Corp');
  });

  it('Escape closes dropdown', async () => {
    await create();
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);
    expect(input.getAttribute('aria-expanded')).toBe('true');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(input.getAttribute('aria-expanded')).toBe('false');
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    expect(listbox.hidden).toBe(true);
  });

  it('click on option selects it', async () => {
    const onSelect = vi.fn();
    await create(undefined, { onSelect });
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);

    const opt = container.querySelectorAll('[role="option"]')[1] as HTMLElement;
    opt.click();

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0].name).toBe('Beta Industries');
  });

  it('clear empties selection and input', async () => {
    const { sel } = await create();
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(100);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(sel.getValue()).toBeDefined();

    sel.clear();

    expect(sel.getValue()).toBeUndefined();
    expect(input.value).toBe('');
  });

  it('setProvider replaces provider and clears state', async () => {
    const { sel } = await create();
    const newProvider = fakeProvider([{ id: '99', name: 'New Item' }]);

    sel.setProvider(newProvider);

    expect(sel.getValue()).toBeUndefined();
    const input = container.querySelector('input')!;
    expect(input.value).toBe('');
  });

  it('destroy removes all DOM and event listeners', async () => {
    const { sel } = await create();
    expect(container.querySelector('input')).not.toBeNull();

    sel.destroy();

    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-async-select')).toBe(false);
  });

  it('destroy() prevents in-flight search from rendering', async () => {
    let resolveSearch!: (items: FakeItem[]) => void;
    const provider: AsyncDataProvider<FakeItem> = {
      search: vi.fn(() => new Promise<FakeItem[]>((r) => { resolveSearch = r; })),
      getLabel: (item) => item.name,
      getId: (item) => item.id,
      renderItem: (item) => item.name,
    };
    const { AsyncSelect } = await import('../../src/ts/async-select');
    const sel = new AsyncSelect<FakeItem>(container, { provider, debounceMs: 50, minChars: 1 });
    const input = container.querySelector('input')!;

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(50);
    expect(provider.search).toHaveBeenCalledWith('A');

    sel.destroy();
    resolveSearch([{ id: '1', name: 'Alpha Corp' }]);
    await vi.advanceTimersByTimeAsync(0);

    expect(container.querySelectorAll('[role="option"]').length).toBe(0);
  });

  it('placeholder option sets input placeholder', async () => {
    await create([], { placeholder: 'Find a company...' });
    const input = container.querySelector('input')!;
    expect(input.placeholder).toBe('Find a company...');
  });

  it('container gets mn-async-select class', async () => {
    await create();
    expect(container.classList.contains('mn-async-select')).toBe(true);
  });
});
