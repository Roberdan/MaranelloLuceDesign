/** Maranello Luce Design - Notification Center */
import { escapeHtml } from './core/sanitize';

export interface MnNotification {
  id: string;
  title: string;
  body?: string;
  type?: 'default' | 'success' | 'warning' | 'danger';
  timestamp?: string;
  read?: boolean;
  action?: { label: string; onClick: () => void };
}

export interface NotificationCenterOptions {
  maxVisible?: number;
  onAction?: (n: MnNotification) => void;
  position?: 'right' | 'left';
}

export interface NotificationCenterController {
  add: (n: MnNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
  getUnreadCount: () => number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  destroy: () => void;
}

function buildItem(
  n: MnNotification, onRemove: (id: string) => void, onAction?: (n: MnNotification) => void,
): HTMLElement {
  const el = document.createElement('div');
  const typeCls = `mn-notif-item--${n.type ?? 'default'}`;
  const unreadCls = n.read ? '' : ' mn-notif-item--unread';
  el.className = `mn-notif-item ${typeCls}${unreadCls}`;
  el.dataset.notifId = n.id;

  const dot = `<span class="mn-notif-item__dot mn-notif-item__dot--${n.type ?? 'default'}"></span>`;
  const title = `<span class="mn-notif-item__title">${escapeHtml(n.title)}</span>`;
  const body = n.body
    ? `<span class="mn-notif-item__body">${escapeHtml(n.body)}</span>`
    : '';
  const meta = n.timestamp
    ? `<span class="mn-notif-item__meta">${escapeHtml(n.timestamp)}</span>`
    : '';
  const action = n.action
    ? `<button class="mn-notif-item__action">${escapeHtml(n.action.label)}</button>`
    : '';
  const remove = '<button class="mn-notif-item__remove" aria-label="Remove">&times;</button>';

  el.innerHTML = `${dot}<div class="mn-notif-item__content">${title}${body}${meta}${action}</div>${remove}`;

  el.querySelector('.mn-notif-item__remove')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onRemove(n.id);
  });

  if (n.action) {
    el.querySelector('.mn-notif-item__action')?.addEventListener('click', (e) => {
      e.stopPropagation();
      n.action?.onClick();
    });
  }

  el.addEventListener('click', () => {
    n.read = true;
    el.classList.remove('mn-notif-item--unread');
    onAction?.(n);
  });

  return el;
}

/** Create a notification center panel attached to a trigger element. */
export function notificationCenter(
  triggerEl: HTMLElement,
  opts?: NotificationCenterOptions,
): NotificationCenterController {
  const maxVisible = opts?.maxVisible ?? 50;
  const position = opts?.position ?? 'right';
  const notifications: MnNotification[] = [];

  /* Panel DOM */
  const panel = document.createElement('div');
  const posCls = position === 'left' ? ' mn-notif-panel--left' : '';
  panel.className = `mn-notif-panel${posCls}`;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Notifications');

  const header = document.createElement('div');
  header.className = 'mn-notif-panel__header';
  header.innerHTML =
    '<span class="mn-notif-panel__title">Notifications <span class="mn-notif-panel__badge">0</span></span>' +
    '<button class="mn-notif-panel__mark-all">Mark all read</button>';

  const list = document.createElement('div');
  list.className = 'mn-notif-panel__list';

  const empty = document.createElement('div');
  empty.className = 'mn-notif-panel__empty';
  empty.textContent = 'No notifications';

  const backdrop = document.createElement('div');
  backdrop.className = 'mn-notif-backdrop';

  panel.appendChild(header);
  panel.appendChild(list);
  panel.appendChild(empty);
  document.body.appendChild(panel);
  document.body.appendChild(backdrop);

  const badge = header.querySelector('.mn-notif-panel__badge') as HTMLElement;
  const markAllBtn = header.querySelector('.mn-notif-panel__mark-all') as HTMLElement;

  function getUnreadCount(): number {
    return notifications.filter((n) => !n.read).length;
  }

  function updateBadge(): void {
    const count = getUnreadCount();
    badge.textContent = String(count);
    badge.style.display = count > 0 ? '' : 'none';
    triggerEl.dataset.unreadCount = String(count);
    triggerEl.classList.toggle('mn-notif-trigger--has-unread', count > 0);
  }

  function updateEmpty(): void {
    empty.style.display = notifications.length === 0 ? '' : 'none';
  }

  function removeItem(id: string): void {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx === -1) return;
    notifications.splice(idx, 1);
    list.querySelector(`[data-notif-id="${id}"]`)?.remove();
    updateBadge();
    updateEmpty();
  }

  function renderAll(): void {
    list.innerHTML = '';
    for (const n of notifications) {
      list.appendChild(buildItem(n, removeItem, opts?.onAction));
    }
    updateBadge();
    updateEmpty();
  }

  /* Open / close */
  let isOpen = false;

  function openPanel(): void {
    isOpen = true;
    panel.classList.add('mn-notif-panel--open');
    backdrop.style.display = 'block';
  }

  function closePanel(): void {
    isOpen = false;
    panel.classList.remove('mn-notif-panel--open');
    backdrop.style.display = 'none';
  }

  function togglePanel(): void {
    isOpen ? closePanel() : openPanel();
  }

  /* Event listeners */
  const onTriggerClick = (): void => togglePanel();
  triggerEl.addEventListener('click', onTriggerClick);

  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && isOpen) closePanel();
  };
  document.addEventListener('keydown', onKeydown);

  const onBackdropClick = (): void => closePanel();
  backdrop.addEventListener('click', onBackdropClick);

  markAllBtn.addEventListener('click', () => {
    for (const n of notifications) n.read = true;
    list.querySelectorAll('.mn-notif-item--unread').forEach((el) =>
      el.classList.remove('mn-notif-item--unread'),
    );
    updateBadge();
  });

  /* Initial render */
  renderAll();

  return {
    add(n: MnNotification): void {
      notifications.unshift(n);
      if (notifications.length > maxVisible) {
        const removed = notifications.pop();
        if (removed) {
          list.querySelector(`[data-notif-id="${removed.id}"]`)?.remove();
        }
      }
      const el = buildItem(n, removeItem, opts?.onAction);
      list.prepend(el);
      updateBadge();
      updateEmpty();
    },
    markRead(id: string): void {
      const n = notifications.find((x) => x.id === id);
      if (!n) return;
      n.read = true;
      list
        .querySelector(`[data-notif-id="${id}"]`)
        ?.classList.remove('mn-notif-item--unread');
      updateBadge();
    },
    markAllRead(): void {
      for (const n of notifications) n.read = true;
      list.querySelectorAll('.mn-notif-item--unread').forEach((el) =>
        el.classList.remove('mn-notif-item--unread'),
      );
      updateBadge();
    },
    remove: removeItem,
    clear(): void {
      notifications.length = 0;
      list.innerHTML = '';
      updateBadge();
      updateEmpty();
    },
    getUnreadCount,
    open: openPanel,
    close: closePanel,
    toggle: togglePanel,
    destroy(): void {
      triggerEl.removeEventListener('click', onTriggerClick);
      document.removeEventListener('keydown', onKeydown);
      backdrop.removeEventListener('click', onBackdropClick);
      panel.remove();
      backdrop.remove();
      triggerEl.classList.remove('mn-notif-trigger--has-unread');
      delete triggerEl.dataset.unreadCount;
    },
  };
}
