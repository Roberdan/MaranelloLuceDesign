/**
 * Maranello Luce Design - Activity Feed
 * Vertical timeline widget for activity/audit log display.
 */
import { escapeHtml } from './core/sanitize';

export interface ActivityItem {
  id: string;
  title: string;
  body?: string;
  meta?: string;
  /** Raw SVG string — trusted developer input, rendered via innerHTML */
  icon?: string;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export interface ActivityFeedOptions {
  /** Remove oldest items when exceeded; default: unlimited */
  maxItems?: number;
  /** Slide-in animation for new items; default: true */
  animate?: boolean;
}

export interface ActivityFeedController {
  add: (item: ActivityItem) => void;
  prepend: (item: ActivityItem) => void;
  clear: () => void;
  destroy: () => void;
}

/** Build the DOM node for a single activity item. */
function buildItemNode(item: ActivityItem, animate: boolean): HTMLElement {
  const type = item.type ?? 'default';
  const row = document.createElement('div');
  row.className = `mn-feed__item mn-feed__item--${type}`;
  row.dataset.id = item.id;

  const indicator = document.createElement('div');
  indicator.className = 'mn-feed__indicator';
  row.appendChild(indicator);

  if (item.icon) {
    const iconEl = document.createElement('div');
    iconEl.className = 'mn-feed__icon';
    // Icon is trusted SVG from the developer — set directly via innerHTML
    iconEl.innerHTML = item.icon;
    row.appendChild(iconEl);
  }

  const content = document.createElement('div');
  content.className = 'mn-feed__content';

  const titleEl = document.createElement('div');
  titleEl.className = 'mn-feed__title';
  titleEl.textContent = escapeHtml(item.title);
  content.appendChild(titleEl);

  if (item.body) {
    const bodyEl = document.createElement('div');
    bodyEl.className = 'mn-feed__body';
    bodyEl.textContent = escapeHtml(item.body);
    content.appendChild(bodyEl);
  }

  if (item.meta) {
    const metaEl = document.createElement('div');
    metaEl.className = 'mn-feed__meta';
    metaEl.textContent = escapeHtml(item.meta);
    content.appendChild(metaEl);
  }

  row.appendChild(content);

  if (animate) {
    row.classList.add('mn-feed__item--entering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        row.classList.remove('mn-feed__item--entering');
      });
    });
  }

  return row;
}

/** Trim oldest items from DOM and internal array when maxItems exceeded. */
function enforceMax(
  el: HTMLElement,
  items: ActivityItem[],
  maxItems: number | undefined,
): void {
  if (maxItems === undefined || maxItems <= 0) return;
  while (items.length > maxItems) {
    items.pop();
    const last = el.lastElementChild;
    if (last) last.remove();
  }
}

/** Trim oldest items when prepending (oldest = bottom). */
function enforceMaxPrepend(
  el: HTMLElement,
  items: ActivityItem[],
  maxItems: number | undefined,
): void {
  if (maxItems === undefined || maxItems <= 0) return;
  while (items.length > maxItems) {
    items.pop();
    const last = el.lastElementChild;
    if (last) last.remove();
  }
}

/**
 * Create an activity feed timeline inside the given element.
 * @param el - Container element
 * @param items - Initial items to render
 * @param opts - Feed options
 */
export function activityFeed(
  el: HTMLElement,
  items?: ActivityItem[],
  opts?: ActivityFeedOptions,
): ActivityFeedController {
  const animate = opts?.animate !== false;
  const maxItems = opts?.maxItems;
  const internal: ActivityItem[] = [];

  el.classList.add('mn-feed');
  el.setAttribute('role', 'feed');
  el.setAttribute('aria-label', 'Activity feed');
  el.innerHTML = '';

  // Render initial items without animation
  if (items) {
    for (const item of items) {
      internal.push(item);
      el.appendChild(buildItemNode(item, false));
    }
    enforceMax(el, internal, maxItems);
  }

  const controller: ActivityFeedController = {
    /** Append item to the bottom of the feed. */
    add(item: ActivityItem): void {
      internal.push(item);
      el.appendChild(buildItemNode(item, animate));
      enforceMax(el, internal, maxItems);
    },

    /** Insert item at the top of the feed. */
    prepend(item: ActivityItem): void {
      internal.unshift(item);
      const node = buildItemNode(item, animate);
      if (el.firstChild) {
        el.insertBefore(node, el.firstChild);
      } else {
        el.appendChild(node);
      }
      enforceMaxPrepend(el, internal, maxItems);
    },

    /** Remove all items from the feed. */
    clear(): void {
      internal.length = 0;
      el.innerHTML = '';
    },

    /** Tear down the feed and restore the container. */
    destroy(): void {
      internal.length = 0;
      el.classList.remove('mn-feed');
      el.innerHTML = '';
    },
  };

  return controller;
}
