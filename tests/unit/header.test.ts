/**
 * Unit tests for header (3-zone navbar) component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('header', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  async function create(
    opts?: Partial<Parameters<typeof import('../../src/ts/header').header>[1]>,
  ) {
    const { header } = await import('../../src/ts/header');
    return header(container, { ...opts });
  }

  it('renders 3 zones (left, center, right)', async () => {
    await create();
    expect(container.querySelector('.mn-header__zone--left')).not.toBeNull();
    expect(container.querySelector('.mn-header__zone--center')).not.toBeNull();
    expect(container.querySelector('.mn-header__zone--right')).not.toBeNull();
  });

  it('renders brand with label and optional logo', async () => {
    await create({
      brand: { label: 'Convergio', logo: '<svg>test</svg>', href: '/home' },
    });
    const brand = container.querySelector('.mn-header__brand') as HTMLAnchorElement;
    expect(brand).not.toBeNull();
    expect(brand.textContent).toContain('Convergio');
    expect(brand.innerHTML).toContain('<svg>test</svg>');
    expect(brand.getAttribute('href')).toBe('/home');
  });

  it('renders brand as span when no href provided', async () => {
    await create({ brand: { label: 'Dashboard' } });
    const brand = container.querySelector('.mn-header__brand');
    expect(brand?.tagName.toLowerCase()).toBe('span');
  });

  it('renders left buttons with labels', async () => {
    await create({
      left: [
        { id: 'projects', label: 'Projects' },
        { id: 'tasks', label: 'Tasks' },
      ],
    });
    const btns = container.querySelectorAll('.mn-header__zone--left .mn-header__btn');
    expect(btns.length).toBe(2);
    expect(btns[0].textContent).toContain('Projects');
    expect(btns[1].textContent).toContain('Tasks');
  });

  it('renders separators as vertical dividers', async () => {
    await create({
      left: [
        { id: 'a', label: 'A' },
        'separator',
        { id: 'b', label: 'B' },
      ],
    });
    const sep = container.querySelector('.mn-header__zone--left .mn-header__sep');
    expect(sep).not.toBeNull();
  });

  it('renders center search bar with placeholder and shortcut hint', async () => {
    await create({
      center: {
        type: 'search',
        placeholder: 'Search projects...',
        shortcut: 'Cmd+K',
      },
    });
    const input = container.querySelector('.mn-header__search-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe('Search projects...');
    const shortcut = container.querySelector('.mn-header__shortcut');
    expect(shortcut?.textContent).toBe('Cmd+K');
  });

  it('fires onSearch when Enter pressed in search input', async () => {
    const spy = vi.fn();
    await create({
      center: { type: 'search', onSearch: spy },
    });
    const input = container.querySelector('.mn-header__search-input') as HTMLInputElement;
    input.value = 'revenue report';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(spy).toHaveBeenCalledWith('revenue report');
  });

  it('renders filter button in search zone when provided', async () => {
    const filterSpy = vi.fn();
    await create({
      center: {
        type: 'search',
        filterButton: { label: 'Filters', onClick: filterSpy },
      },
    });
    const filterBtn = container.querySelector('.mn-header__filter-btn') as HTMLButtonElement;
    expect(filterBtn).not.toBeNull();
    expect(filterBtn.textContent).toContain('Filters');
    filterBtn.click();
    expect(filterSpy).toHaveBeenCalled();
  });

  it('renders right zone buttons', async () => {
    await create({
      right: [{ id: 'notifications', label: 'Alerts', icon: '<svg>bell</svg>' }],
    });
    const btn = container.querySelector('.mn-header__zone--right .mn-header__btn');
    expect(btn).not.toBeNull();
    expect(btn?.innerHTML).toContain('<svg>bell</svg>');
    expect(btn?.textContent).toContain('Alerts');
  });

  it('setActive toggles active class on correct button', async () => {
    const ctrl = await create({
      left: [
        { id: 'proj', label: 'Projects' },
        { id: 'task', label: 'Tasks' },
      ],
    });
    ctrl.setActive('task');
    const btns = container.querySelectorAll('.mn-header__zone--left .mn-header__btn');
    expect(btns[0].classList.contains('mn-header__btn--active')).toBe(false);
    expect(btns[1].classList.contains('mn-header__btn--active')).toBe(true);
  });

  it('setActive clears previous active state', async () => {
    const ctrl = await create({
      left: [
        { id: 'a', label: 'A', active: true },
        { id: 'b', label: 'B' },
      ],
    });
    // initially 'a' is active
    let btns = container.querySelectorAll('.mn-header__btn');
    const aBtn = [...btns].find(b => b.textContent?.includes('A'));
    expect(aBtn?.classList.contains('mn-header__btn--active')).toBe(true);

    ctrl.setActive('b');
    btns = container.querySelectorAll('.mn-header__btn');
    const bBtn = [...btns].find(b => b.textContent?.includes('B'));
    expect(aBtn?.classList.contains('mn-header__btn--active')).toBe(false);
    expect(bBtn?.classList.contains('mn-header__btn--active')).toBe(true);
  });

  it('click handlers fire on button click (CSP-safe addEventListener)', async () => {
    const spy = vi.fn();
    await create({
      left: [{ id: 'x', label: 'Click Me', onClick: spy }],
    });
    const btn = container.querySelector('.mn-header__btn') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('has no inline onclick attributes (CSP-safe)', async () => {
    await create({
      left: [{ id: 'x', label: 'X', onClick: vi.fn() }],
      center: { type: 'search', onSearch: vi.fn() },
    });
    const allEls = container.querySelectorAll('*');
    allEls.forEach(el => {
      expect(el.getAttribute('onclick')).toBeNull();
      expect(el.getAttribute('onkeydown')).toBeNull();
    });
  });

  it('all buttons are keyboard focusable with type="button"', async () => {
    await create({
      left: [{ id: 'a', label: 'A' }],
      right: [{ id: 'b', label: 'B' }],
    });
    const btns = container.querySelectorAll('.mn-header__btn');
    btns.forEach(btn => {
      expect((btn as HTMLButtonElement).type).toBe('button');
    });
  });

  it('renders profile item in right zone using profileMenu', async () => {
    await create({
      right: [
        {
          type: 'profile',
          name: 'Marco Rossi',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      ],
    });
    const profileTrigger = container.querySelector('.mn-header__profile');
    expect(profileTrigger).not.toBeNull();
    // profileMenu appends a button to the container
    const profileBtn = profileTrigger?.querySelector('.mn-profile-trigger');
    expect(profileBtn).not.toBeNull();
  });

  it('destroy removes event listeners and clears container', async () => {
    const spy = vi.fn();
    const ctrl = await create({
      left: [{ id: 'x', label: 'X', onClick: spy }],
    });
    ctrl.destroy();
    // header element should be removed
    expect(container.querySelector('.mn-header')).toBeNull();
  });

  it('renders header element with mn-header class and role navigation', async () => {
    await create();
    const nav = container.querySelector('.mn-header');
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute('role')).toBe('navigation');
    expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
  });
});
