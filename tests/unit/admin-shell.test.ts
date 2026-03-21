/**
 * Unit tests for adminShell headless component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminShell, AdminShellOpts } from '../../src/ts/admin-shell';

function makeOpts(overrides?: Partial<AdminShellOpts>): AdminShellOpts {
  return {
    sidebar: {
      header: { title: 'TestAdmin', badge: 'Pro' },
      search: { placeholder: 'Search...', shortcut: 'F' },
      nav: [
        { id: 'dash', label: 'Dashboard', icon: 'chart', section: 'OVERVIEW' },
        { id: 'users', label: 'Users', icon: 'users', section: 'MANAGEMENT' },
        { id: 'audit', label: 'Audit Log', icon: 'list', section: 'SECURITY' },
        { id: 'tokens', label: 'Tokens', icon: 'key', section: 'SECURITY' },
      ],
    },
    onNavigate: vi.fn(),
    initialPage: 'dash',
    ...overrides,
  };
}

describe('adminShell', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.innerHTML = '';
    document.body.appendChild(el);
  });

  it('renders sidebar with nav items grouped by section', () => {
    const ctrl = adminShell(el, makeOpts());
    const sections = el.querySelectorAll('.mn-admin-sidebar__section-title');
    expect(sections.length).toBe(3);
    expect(sections[0].textContent).toBe('OVERVIEW');
    expect(sections[1].textContent).toBe('MANAGEMENT');
    expect(sections[2].textContent).toBe('SECURITY');

    const items = el.querySelectorAll('.mn-admin-nav-item');
    expect(items.length).toBe(4);
    ctrl.destroy();
  });

  it('setPage() highlights correct nav item with aria-current', () => {
    const opts = makeOpts();
    const ctrl = adminShell(el, opts);

    /* Initial: dash is active */
    const dashBtn = el.querySelector('[data-nav-id="dash"]');
    expect(dashBtn?.getAttribute('aria-current')).toBe('page');

    ctrl.setPage('audit');
    const auditBtn = el.querySelector('[data-nav-id="audit"]');
    expect(auditBtn?.getAttribute('aria-current')).toBe('page');
    expect(dashBtn?.hasAttribute('aria-current')).toBe(false);
    expect(opts.onNavigate).toHaveBeenCalledWith('audit');
    ctrl.destroy();
  });

  it('collapse(true) adds collapsed class, collapse(false) removes it', () => {
    const ctrl = adminShell(el, makeOpts());
    expect(el.classList.contains('mn-admin-shell--collapsed')).toBe(false);

    ctrl.collapse(true);
    expect(el.classList.contains('mn-admin-shell--collapsed')).toBe(true);

    ctrl.collapse(false);
    expect(el.classList.contains('mn-admin-shell--collapsed')).toBe(false);
    ctrl.destroy();
  });

  it('search filters nav items by label', () => {
    const ctrl = adminShell(el, makeOpts());
    const input = el.querySelector<HTMLInputElement>('.mn-admin-sidebar__search-input');
    expect(input).toBeTruthy();

    /* Simulate typing "aud" */
    input!.value = 'aud';
    input!.dispatchEvent(new Event('input'));

    const items = el.querySelectorAll<HTMLElement>('.mn-admin-nav-item');
    const visible = Array.from(items).filter(i => i.style.display !== 'none');
    expect(visible.length).toBe(1);
    expect(visible[0].dataset.navId).toBe('audit');
    ctrl.destroy();
  });

  it('destroy() cleans up all DOM', () => {
    const ctrl = adminShell(el, makeOpts());
    expect(el.querySelector('.mn-admin-sidebar')).toBeTruthy();

    ctrl.destroy();
    expect(el.innerHTML).toBe('');
    expect(el.classList.contains('mn-admin-shell')).toBe(false);
    expect(el.classList.contains('mn-admin-shell--collapsed')).toBe(false);
  });

  it('contentEl is accessible for mounting content', () => {
    const ctrl = adminShell(el, makeOpts());
    expect(ctrl.contentEl).toBeInstanceOf(HTMLElement);
    expect(ctrl.contentEl.className).toBe('mn-admin-content__body');

    /* Consumer can mount into contentEl */
    const child = document.createElement('p');
    child.textContent = 'Hello';
    ctrl.contentEl.appendChild(child);
    expect(ctrl.contentEl.querySelector('p')?.textContent).toBe('Hello');
    ctrl.destroy();
  });

  it('setTitle() updates topbar title text', () => {
    const ctrl = adminShell(el, makeOpts());
    const title = el.querySelector('.mn-admin-topbar__title');
    expect(title?.textContent).toBe('Dashboard');

    ctrl.setTitle('Custom Title');
    expect(title?.textContent).toBe('Custom Title');
    ctrl.destroy();
  });

  it('initialCollapsed starts with collapsed class', () => {
    const ctrl = adminShell(el, makeOpts({ initialCollapsed: true }));
    expect(el.classList.contains('mn-admin-shell--collapsed')).toBe(true);
    ctrl.destroy();
  });

  it('sidebar has role=navigation and aria-label', () => {
    const ctrl = adminShell(el, makeOpts());
    const nav = el.querySelector('.mn-admin-sidebar');
    expect(nav?.getAttribute('role')).toBe('navigation');
    expect(nav?.getAttribute('aria-label')).toBe('Admin navigation');
    ctrl.destroy();
  });

  it('string footer renders as button without breaking content area', () => {
    const ctrl = adminShell(el, makeOpts({
      sidebar: {
        nav: [{ id: 'dash', label: 'Dashboard', icon: 'chart' }],
        footer: '\u2190 Back to app',
      },
    }));
    const footer = el.querySelector('.mn-admin-sidebar__footer');
    expect(footer).toBeTruthy();
    expect(footer?.tagName).toBe('BUTTON');
    expect(footer?.textContent).toBe('\u2190 Back to app');
    expect(ctrl.contentEl).toBeInstanceOf(HTMLElement);
    expect(ctrl.contentEl.className).toBe('mn-admin-content__body');
    ctrl.destroy();
  });

  it('string footer with onFooterClick renders as clickable button', () => {
    const onClick = vi.fn();
    const ctrl = adminShell(el, makeOpts({
      sidebar: {
        nav: [{ id: 'dash', label: 'Dashboard', icon: 'chart' }],
        footer: '\u2190 Back to app',
        onFooterClick: onClick,
      },
    }));
    const footer = el.querySelector<HTMLElement>('.mn-admin-sidebar__footer');
    expect(footer).toBeTruthy();
    expect(footer?.tagName).toBe('BUTTON');
    footer?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    ctrl.destroy();
  });

  it('object footer {label, onClick} renders as clickable button', () => {
    const onClick = vi.fn();
    const ctrl = adminShell(el, makeOpts({
      sidebar: {
        nav: [{ id: 'dash', label: 'Dashboard', icon: 'chart' }],
        footer: { label: 'Back', onClick },
      },
    }));
    const footer = el.querySelector<HTMLElement>('.mn-admin-sidebar__footer');
    expect(footer).toBeTruthy();
    expect(footer?.tagName).toBe('BUTTON');
    expect(footer?.textContent).toBe('Back');
    footer?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    ctrl.destroy();
  });

  it('HTMLElement footer is appended directly', () => {
    const footerEl = document.createElement('button');
    footerEl.textContent = 'Back';
    footerEl.className = 'custom-footer';
    const ctrl = adminShell(el, makeOpts({
      sidebar: {
        nav: [{ id: 'dash', label: 'Dashboard', icon: 'chart' }],
        footer: footerEl,
      },
    }));
    const found = el.querySelector('.custom-footer');
    expect(found).toBeTruthy();
    expect(found?.textContent).toBe('Back');
    expect(ctrl.contentEl).toBeInstanceOf(HTMLElement);
    ctrl.destroy();
  });
});
