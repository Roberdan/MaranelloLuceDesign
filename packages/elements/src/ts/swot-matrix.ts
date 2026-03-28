/**
 * Maranello Luce Design - SWOT Matrix
 * Interactive 2x2 SWOT analysis grid with editable items per quadrant.
 */
import { escapeHtml } from './core/sanitize';

export type SwotQuadrant = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export interface SwotItem {
  id: string;
  text: string;
  quadrant: SwotQuadrant;
}

export interface SwotMatrixOptions {
  items?: SwotItem[];
  editable?: boolean;
  onChange?: (items: SwotItem[]) => void;
  quadrantLabels?: {
    strengths?: string;
    weaknesses?: string;
    opportunities?: string;
    threats?: string;
  };
}

export interface SwotMatrixController {
  getItems: () => SwotItem[];
  addItem: (quadrant: SwotQuadrant, text: string) => void;
  removeItem: (id: string) => void;
  update: (items: SwotItem[]) => void;
  destroy: () => void;
}

const QUADRANTS: SwotQuadrant[] = ['strengths', 'weaknesses', 'opportunities', 'threats'];
const ICONS: Record<SwotQuadrant, string> = {
  strengths: 'S', weaknesses: 'W', opportunities: 'O', threats: 'T',
};
const DEFAULTS: Record<SwotQuadrant, string> = {
  strengths: 'Strengths', weaknesses: 'Weaknesses',
  opportunities: 'Opportunities', threats: 'Threats',
};

function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function buildQuadrant(
  q: SwotQuadrant, label: string, uid: string, editable: boolean,
): HTMLDivElement {
  const div = document.createElement('div');
  div.className = `mn-swot__quadrant mn-swot__quadrant--${q}`;
  div.setAttribute('role', 'group');
  const hdrId = `swot-${uid}-${q}-hdr`;
  div.setAttribute('aria-labelledby', hdrId);
  div.dataset.quadrant = q;

  const hdr = document.createElement('div');
  hdr.className = 'mn-swot__header';
  hdr.id = hdrId;
  const icon = document.createElement('span');
  icon.className = 'mn-swot__icon';
  icon.textContent = ICONS[q];
  const title = document.createElement('span');
  title.className = 'mn-swot__title';
  title.textContent = label;
  hdr.append(icon, title);

  const list = document.createElement('ul');
  list.className = 'mn-swot__list';
  list.setAttribute('role', 'list');
  list.setAttribute('aria-label', `${label} items`);
  div.append(hdr, list);

  if (editable) {
    const addBtn = document.createElement('button');
    addBtn.className = 'mn-swot__add';
    addBtn.type = 'button';
    addBtn.setAttribute('aria-label', `Add ${label.toLowerCase()}`);
    addBtn.textContent = '+ Add';

    const wrap = document.createElement('div');
    wrap.className = 'mn-swot__input-wrap';
    wrap.hidden = true;
    const input = document.createElement('input');
    input.className = 'mn-input mn-swot__input';
    input.type = 'text';
    input.placeholder = 'Enter item\u2026';
    input.setAttribute('aria-label', `New ${label.toLowerCase()}`);
    const confirm = document.createElement('button');
    confirm.className = 'mn-swot__confirm';
    confirm.type = 'button';
    confirm.setAttribute('aria-label', 'Confirm');
    confirm.textContent = '\u21B5';
    wrap.append(input, confirm);
    div.append(addBtn, wrap);
  }
  return div;
}

function buildItemEl(item: SwotItem, editable: boolean): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'mn-swot__item';
  li.setAttribute('role', 'listitem');
  li.dataset.id = item.id;
  const span = document.createElement('span');
  span.className = 'mn-swot__text';
  span.textContent = item.text;
  li.append(span);
  if (editable) {
    const btn = document.createElement('button');
    btn.className = 'mn-swot__remove';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Remove: ${escapeHtml(item.text)}`);
    btn.textContent = '\u00D7';
    li.append(btn);
  }
  return li;
}

export function swotMatrix(
  el: HTMLElement, opts?: SwotMatrixOptions,
): SwotMatrixController {
  const editable = opts?.editable !== false;
  const labels = { ...DEFAULTS, ...opts?.quadrantLabels };
  let items: SwotItem[] = [...(opts?.items ?? [])];
  const uid = genId().slice(0, 8);

  el.classList.add('mn-swot');
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'SWOT Analysis');

  const quadrantEls = new Map<SwotQuadrant, HTMLDivElement>();
  for (const q of QUADRANTS) {
    const qEl = buildQuadrant(q, labels[q], uid, editable);
    quadrantEls.set(q, qEl);
    el.append(qEl);
  }

  function notify(): void { opts?.onChange?.([...items]); }

  function renderItems(): void {
    for (const q of QUADRANTS) {
      const list = quadrantEls.get(q)!.querySelector('.mn-swot__list')!;
      list.innerHTML = '';
      for (const item of items.filter(i => i.quadrant === q)) {
        list.append(buildItemEl(item, editable));
      }
    }
  }

  function addItem(quadrant: SwotQuadrant, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item: SwotItem = { id: genId(), text: trimmed, quadrant };
    items.push(item);
    const list = quadrantEls.get(quadrant)!.querySelector('.mn-swot__list')!;
    list.append(buildItemEl(item, editable));
    notify();
  }

  function removeItem(id: string): void {
    const li = el.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (li) {
      li.classList.add('mn-swot__item--removing');
      setTimeout(() => li.remove(), 200);
    }
    items = items.filter(i => i.id !== id);
    notify();
  }

  function hideInput(qEl: HTMLElement): void {
    const wrap = qEl.querySelector('.mn-swot__input-wrap') as HTMLElement;
    const addBtn = qEl.querySelector('.mn-swot__add') as HTMLElement;
    if (wrap) wrap.hidden = true;
    if (addBtn) addBtn.hidden = false;
  }

  function handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.closest('.mn-swot__remove')) {
      const li = target.closest('.mn-swot__item') as HTMLElement | null;
      if (li?.dataset.id) removeItem(li.dataset.id);
      return;
    }
    if (target.closest('.mn-swot__add')) {
      const qEl = target.closest('.mn-swot__quadrant') as HTMLElement;
      const wrap = qEl.querySelector('.mn-swot__input-wrap') as HTMLElement;
      const addBtn = qEl.querySelector('.mn-swot__add') as HTMLElement;
      wrap.hidden = false;
      addBtn.hidden = true;
      const input = wrap.querySelector('input')!;
      input.value = '';
      input.focus();
      return;
    }
    if (target.closest('.mn-swot__confirm')) {
      const qEl = target.closest('.mn-swot__quadrant') as HTMLElement;
      const q = qEl.dataset.quadrant as SwotQuadrant;
      const input = qEl.querySelector('.mn-swot__input') as HTMLInputElement;
      addItem(q, input.value);
      hideInput(qEl);
    }
  }

  function handleKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('mn-swot__input')) return;
    const qEl = target.closest('.mn-swot__quadrant') as HTMLElement;
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(qEl.dataset.quadrant as SwotQuadrant, (target as HTMLInputElement).value);
      hideInput(qEl);
    } else if (e.key === 'Escape') {
      hideInput(qEl);
      (qEl.querySelector('.mn-swot__add') as HTMLElement)?.focus();
    }
  }

  el.addEventListener('click', handleClick);
  el.addEventListener('keydown', handleKeydown);
  renderItems();

  return {
    getItems: () => [...items],
    addItem,
    removeItem,
    update(newItems: SwotItem[]): void {
      items = [...newItems];
      renderItems();
      notify();
    },
    destroy(): void {
      el.removeEventListener('click', handleClick);
      el.removeEventListener('keydown', handleKeydown);
      el.innerHTML = '';
      el.classList.remove('mn-swot');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
    },
  };
}
