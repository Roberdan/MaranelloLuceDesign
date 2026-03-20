/**
 * Unit tests for AppShellController.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppShellController } from '../../src/ts/app-shell';
import type { LayoutMode } from '../../src/ts/app-shell';

describe('AppShellController', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('creates shell with default "full" layout', () => {
    const shell = new AppShellController(el);
    expect(el.classList.contains('mn-app-shell')).toBe(true);
    expect(el.classList.contains('mn-app-shell--full')).toBe(true);
    expect(shell.getLayout()).toBe('full');
    shell.destroy();
  });

  it('creates shell with explicit layout', () => {
    const shell = new AppShellController(el, { layout: 'split' });
    expect(el.classList.contains('mn-app-shell--split')).toBe(true);
    expect(shell.getLayout()).toBe('split');
    shell.destroy();
  });

  it('setLayout() changes layout mode and CSS class', () => {
    const shell = new AppShellController(el);
    expect(shell.getLayout()).toBe('full');

    shell.setLayout('docked-bottom');
    expect(shell.getLayout()).toBe('docked-bottom');
    expect(el.classList.contains('mn-app-shell--docked-bottom')).toBe(true);
    expect(el.classList.contains('mn-app-shell--full')).toBe(false);
    shell.destroy();
  });

  it('setLayout() removes previous layout class', () => {
    const shell = new AppShellController(el, { layout: 'stacked' });
    shell.setLayout('dual-panel');
    expect(el.classList.contains('mn-app-shell--stacked')).toBe(false);
    expect(el.classList.contains('mn-app-shell--dual-panel')).toBe(true);
    shell.destroy();
  });

  it('all 6 layout modes render correctly', () => {
    const modes: LayoutMode[] = ['full', 'split', 'stacked', 'docked-bottom', 'dual-panel', 'side-detail'];
    const shell = new AppShellController(el);

    for (const mode of modes) {
      shell.setLayout(mode);
      expect(shell.getLayout()).toBe(mode);
      expect(el.classList.contains(`mn-app-shell--${mode}`)).toBe(true);

      /* Only the active mode class should be present */
      for (const other of modes) {
        if (other !== mode) {
          expect(el.classList.contains(`mn-app-shell--${other}`)).toBe(false);
        }
      }
    }
    shell.destroy();
  });

  it('toggleSidebar() adds collapsed class on first call', () => {
    const shell = new AppShellController(el);
    expect(shell.isSidebarCollapsed()).toBe(false);

    shell.toggleSidebar();
    expect(el.classList.contains('mn-app-shell--sidebar-collapsed')).toBe(true);
    expect(shell.isSidebarCollapsed()).toBe(true);
    shell.destroy();
  });

  it('toggleSidebar() removes collapsed class on second call', () => {
    const shell = new AppShellController(el);
    shell.toggleSidebar();
    shell.toggleSidebar();
    expect(el.classList.contains('mn-app-shell--sidebar-collapsed')).toBe(false);
    expect(shell.isSidebarCollapsed()).toBe(false);
    shell.destroy();
  });

  it('sidebarCollapsed config starts collapsed', () => {
    const shell = new AppShellController(el, { sidebarCollapsed: true });
    expect(shell.isSidebarCollapsed()).toBe(true);
    expect(el.classList.contains('mn-app-shell--sidebar-collapsed')).toBe(true);
    shell.destroy();
  });

  it('getSlot() returns named slot elements', () => {
    const shell = new AppShellController(el);
    const main = shell.getSlot('main');
    expect(main).toBeInstanceOf(HTMLElement);
    expect(main?.dataset.slot).toBe('main');
    expect(main?.classList.contains('mn-app-shell__main')).toBe(true);

    const nav = shell.getSlot('nav');
    expect(nav).toBeInstanceOf(HTMLElement);
    expect(nav?.dataset.slot).toBe('nav');
    shell.destroy();
  });

  it('getSlot() returns all 8 named slots', () => {
    const shell = new AppShellController(el);
    const names = ['nav', 'toolbar', 'filter-bar', 'main', 'secondary', 'detail', 'bottom', 'overlay'];
    for (const name of names) {
      const slot = shell.getSlot(name);
      expect(slot).not.toBeNull();
      expect(slot?.dataset.slot).toBe(name);
    }
    shell.destroy();
  });

  it('getSlot() returns null for unknown slot', () => {
    const shell = new AppShellController(el);
    expect(shell.getSlot('nonexistent')).toBeNull();
    shell.destroy();
  });

  it('setBottomDock() toggles bottom-open class', () => {
    const shell = new AppShellController(el);
    expect(el.classList.contains('mn-app-shell--bottom-open')).toBe(false);

    shell.setBottomDock(true);
    expect(el.classList.contains('mn-app-shell--bottom-open')).toBe(true);

    shell.setBottomDock(false);
    expect(el.classList.contains('mn-app-shell--bottom-open')).toBe(false);
    shell.destroy();
  });

  it('bottomDockHeight config sets CSS custom property', () => {
    const shell = new AppShellController(el, { bottomDockHeight: '200px' });
    expect(el.style.getPropertyValue('--mn-app-shell-bottom-height')).toBe('200px');
    shell.destroy();
  });

  it('destroy() cleans up all DOM and classes', () => {
    const shell = new AppShellController(el, { layout: 'side-detail', sidebarCollapsed: true });
    shell.setBottomDock(true);
    expect(el.querySelectorAll('[data-slot]').length).toBe(8);

    shell.destroy();
    expect(el.classList.contains('mn-app-shell')).toBe(false);
    expect(el.classList.contains('mn-app-shell--side-detail')).toBe(false);
    expect(el.classList.contains('mn-app-shell--sidebar-collapsed')).toBe(false);
    expect(el.classList.contains('mn-app-shell--bottom-open')).toBe(false);
    expect(el.querySelectorAll('[data-slot]').length).toBe(0);
  });

  it('uses existing child elements as slots', () => {
    const existing = document.createElement('div');
    existing.classList.add('mn-app-shell__main');
    existing.textContent = 'Pre-existing content';
    el.appendChild(existing);

    const shell = new AppShellController(el);
    const main = shell.getSlot('main');
    expect(main?.textContent).toBe('Pre-existing content');
    shell.destroy();
  });
});
