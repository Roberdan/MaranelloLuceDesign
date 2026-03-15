/**
 * Maranello Luce Design - Base interactive controls
 * Detail panel open/close, drawer, org tree, command palette,
 * notifications, drill down.
 */

import type { CommandPaletteController } from './core/types';
import { eventBus } from './core/events';

/** Open a detail panel by element id. */
export function openDetailPanel(id: string): void {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.add('mn-detail-panel--open');
  const backdrop = panel.previousElementSibling;
  if (backdrop && backdrop.classList.contains('mn-detail-panel__backdrop')) {
    backdrop.classList.add('mn-detail-panel__backdrop--visible');
    backdrop.addEventListener(
      'click',
      () => closeDetailPanel(id),
      { once: true },
    );
  }
  const first = panel.querySelector<HTMLElement>('button, [href], input');
  if (first) first.focus();
}

/** Close a detail panel by element id. */
export function closeDetailPanel(id: string): void {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.remove('mn-detail-panel--open');
  const backdrop = panel.previousElementSibling;
  if (backdrop && backdrop.classList.contains('mn-detail-panel__backdrop')) {
    backdrop.classList.remove('mn-detail-panel__backdrop--visible');
  }
}

/** Open a mobile drawer by element id. Traps focus and closes on Escape. */
export function openDrawer(id: string, triggerEl?: HTMLElement): void {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.add('mn-drawer--open');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  const trigger = triggerEl ?? (document.activeElement as HTMLElement | null);
  const backdrop = drawer.previousElementSibling;
  if (backdrop && backdrop.classList.contains('mn-drawer__backdrop')) {
    backdrop.classList.add('mn-drawer__backdrop--visible');
    backdrop.addEventListener(
      'click',
      () => closeDrawer(id, trigger),
      { once: true },
    );
  }
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(id, trigger); return; }
    if (e.key !== 'Tab') return;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  drawer.addEventListener('keydown', onKey);
  (drawer as unknown as Record<string, unknown>)._mnDrawerKeyHandler = onKey;
  const first = drawer.querySelector<HTMLElement>('button, [href], input, [tabindex]');
  if (first) first.focus();
}

/** Close a mobile drawer by element id. Returns focus to trigger. */
export function closeDrawer(id: string, triggerEl?: HTMLElement | null): void {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.remove('mn-drawer--open');
  drawer.removeAttribute('role');
  drawer.removeAttribute('aria-modal');
  const backdrop = drawer.previousElementSibling;
  if (backdrop && backdrop.classList.contains('mn-drawer__backdrop')) {
    backdrop.classList.remove('mn-drawer__backdrop--visible');
  }
  const handler = (drawer as unknown as Record<string, unknown>)._mnDrawerKeyHandler;
  if (typeof handler === 'function') {
    drawer.removeEventListener('keydown', handler as EventListener);
    delete (drawer as unknown as Record<string, unknown>)._mnDrawerKeyHandler;
  }
  if (triggerEl && typeof triggerEl.focus === 'function') triggerEl.focus();
}

/** Initialize org tree expand/collapse, node selection, and keyboard nav. */
export function initOrgTree(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('.mn-org-tree__toggle').forEach((toggle) => {
    if (toggle.classList.contains('mn-org-tree__toggle--leaf')) return;
    const item = toggle.closest('.mn-org-tree__item');
    const children = item?.querySelector<HTMLElement>('.mn-org-tree__children');
    const isCollapsed = children?.classList.contains('mn-org-tree__children--collapsed') ?? true;
    toggle.setAttribute('aria-expanded', String(!isCollapsed));
    toggle.addEventListener('click', (e: Event) => {
      e.stopPropagation();
      if (!item || !children) return;
      const collapsed = children.classList.contains('mn-org-tree__children--collapsed');
      children.classList.toggle('mn-org-tree__children--collapsed');
      toggle.classList.toggle('mn-org-tree__toggle--expanded', collapsed);
      toggle.setAttribute('aria-expanded', String(collapsed));
    });
  });

  const nodes = container.querySelectorAll<HTMLElement>('.mn-org-tree__node');
  nodes.forEach((node, idx) => {
    node.setAttribute('tabindex', idx === 0 ? '0' : '-1');
    node.addEventListener('click', () => {
      container.querySelectorAll('.mn-org-tree__node--active').forEach((n) => {
        n.classList.remove('mn-org-tree__node--active');
      });
      node.classList.add('mn-org-tree__node--active');
      const label = node.querySelector('.mn-org-tree__label');
      eventBus.emit('org-tree-select', {
        label: label ? label.textContent ?? '' : '',
        node,
      });
    });
    node.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = idx + 1 < nodes.length ? idx + 1 : idx;
        nodes[next].focus(); nodes[next].setAttribute('tabindex', '0');
        node.setAttribute('tabindex', '-1');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = idx > 0 ? idx - 1 : 0;
        nodes[prev].focus(); nodes[prev].setAttribute('tabindex', '0');
        node.setAttribute('tabindex', '-1');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const toggle = node.closest('.mn-org-tree__item')
          ?.querySelector<HTMLElement>('.mn-org-tree__toggle');
        if (toggle && toggle.getAttribute('aria-expanded') === 'false') toggle.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const toggle = node.closest('.mn-org-tree__item')
          ?.querySelector<HTMLElement>('.mn-org-tree__toggle');
        if (toggle && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
      }
    });
  });
}

/** Toggle notification center visibility. */
export function toggleNotifications(id: string): void {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.toggle('mn-notification-center--open');
}

/** Initialize drill-down expand/collapse controls. */
export function initDrillDown(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('.mn-drill-down').forEach((trigger) => {
    const content = trigger.nextElementSibling;
    if (!content || !content.classList.contains('mn-drill-down__content')) return;
    const contentEl = content as HTMLElement;
    const initiallyOpen = contentEl.classList.contains('mn-drill-down__content--open');
    trigger.setAttribute('aria-expanded', String(initiallyOpen));
    trigger.addEventListener('click', () => {
      const isOpen = contentEl.classList.contains('mn-drill-down__content--open');
      contentEl.classList.toggle('mn-drill-down__content--open');
      trigger.classList.toggle('mn-drill-down--expanded');
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}
