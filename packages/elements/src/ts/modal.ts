/**
 * Maranello Luce Design - Modal dialog component
 * Handles backdrop, focus trapping, and keyboard dismissal.
 */

import type { ModalElement } from './core/types';

/**
 * Open a modal by its backdrop element ID.
 * Sets up focus trap and Escape key to close.
 */
export function openModal(id: string): void {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;

  const modal = backdrop.querySelector<ModalElement>('.mn-modal');
  if (!modal) return;

  backdrop.classList.add('mn-modal-backdrop--open');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const focusable = modal.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (first) first.focus();

  function trapFocus(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      closeModal(id);
    }
  }

  modal._mnTrapFocus = trapFocus;
  document.addEventListener('keydown', trapFocus);
}

/**
 * Close a modal by its backdrop element ID.
 * Removes focus trap listener.
 */
export function closeModal(id: string): void {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;

  const modal = backdrop.querySelector<ModalElement>('.mn-modal');
  backdrop.classList.remove('mn-modal-backdrop--open');

  if (modal?._mnTrapFocus) {
    document.removeEventListener('keydown', modal._mnTrapFocus);
    delete modal._mnTrapFocus;
  }
}
