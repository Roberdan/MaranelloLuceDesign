/**
 * Maranello Luce Design - Toast notification component
 */

import type { ToastOptions } from './core/types';

interface ResolvedToastOptions {
  title: string;
  message: string;
  type: string;
  duration: number;
  container: string;
}

/**
 * Show a toast notification. Creates a container if one does not exist.
 * Returns the toast DOM element for further manipulation.
 */
export function toast(options?: ToastOptions): HTMLElement {
  const opts: ResolvedToastOptions = {
    title: '',
    message: '',
    type: 'info',
    duration: 4000,
    container: 'mn-toast-container',
    ...options,
  };

  let container = document.getElementById(opts.container);
  if (!container) {
    container = document.createElement('div');
    container.id = opts.container;
    container.className = 'mn-toast-container';
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `mn-toast mn-toast--${opts.type}`;
  const isUrgent = opts.type === 'error' || opts.type === 'warning';
  toastEl.setAttribute('role', isUrgent ? 'alert' : 'status');
  toastEl.setAttribute('aria-live', isUrgent ? 'assertive' : 'polite');

  const msgWrap = document.createElement('div');
  msgWrap.className = 'mn-toast__message';

  if (opts.title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'mn-toast__title';
    titleEl.textContent = opts.title;
    msgWrap.appendChild(titleEl);
  }

  const textEl = document.createElement('div');
  textEl.className = 'mn-toast__text';
  textEl.textContent = opts.message;
  msgWrap.appendChild(textEl);
  toastEl.appendChild(msgWrap);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mn-toast__close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u2715';
  toastEl.appendChild(closeBtn);

  function dismiss(): void {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(100%)';
    setTimeout(() => toastEl.remove(), 300);
  }

  closeBtn.addEventListener('click', dismiss);
  container.appendChild(toastEl);

  if (opts.duration > 0) {
    setTimeout(() => {
      if (toastEl.parentNode) dismiss();
    }, opts.duration);
  }

  return toastEl;
}
