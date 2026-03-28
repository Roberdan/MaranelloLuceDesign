/** Maranello Luce Design - Business Model Canvas (Osterwalder 9-block) */
import { escapeHtml } from './core/sanitize';

export type BmcBlockId =
  | 'key-partners' | 'key-activities' | 'key-resources'
  | 'value-proposition' | 'customer-relationships' | 'channels'
  | 'customer-segments' | 'cost-structure' | 'revenue-streams';
export interface BmcItem { id: string; text: string; blockId: BmcBlockId; }
export interface BmcBlock { id: BmcBlockId; title: string; icon: string; items: BmcItem[]; }
export interface BusinessModelCanvasOptions {
  blocks?: Partial<Record<BmcBlockId, Partial<BmcBlock>>>;
  editable?: boolean;
  onChange?: (blocks: BmcBlock[]) => void;
}
export interface BusinessModelCanvasController {
  getBlocks: () => BmcBlock[];
  addItem: (blockId: BmcBlockId, text: string) => void;
  removeItem: (id: string) => void;
  update: (blocks: BmcBlock[]) => void;
  destroy: () => void;
}

const BLOCK_IDS: BmcBlockId[] = [
  'key-partners', 'key-activities', 'key-resources', 'value-proposition',
  'customer-relationships', 'channels', 'customer-segments',
  'cost-structure', 'revenue-streams',
];

const DEFAULTS: Record<BmcBlockId, { title: string; icon: string }> = {
  'key-partners':            { title: 'Key Partners',            icon: 'KP' },
  'key-activities':          { title: 'Key Activities',          icon: 'KA' },
  'key-resources':           { title: 'Key Resources',           icon: 'KR' },
  'value-proposition':       { title: 'Value Proposition',       icon: 'VP' },
  'customer-relationships':  { title: 'Customer Relationships',  icon: 'CR' },
  'channels':                { title: 'Channels',                icon: 'CH' },
  'customer-segments':       { title: 'Customer Segments',       icon: 'CS' },
  'cost-structure':          { title: 'Cost Structure',          icon: 'C$' },
  'revenue-streams':         { title: 'Revenue Streams',         icon: 'R$' },
};

/* Grid area shorthand per block */
const AREA: Record<BmcBlockId, string> = {
  'key-partners': 'kp', 'key-activities': 'ka', 'key-resources': 'kr',
  'value-proposition': 'vp', 'customer-relationships': 'cr', 'channels': 'ch',
  'customer-segments': 'cs', 'cost-structure': 'co', 'revenue-streams': 'rs',
};

function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function buildBlock(
  blockId: BmcBlockId, title: string, icon: string,
  uid: string, editable: boolean,
): HTMLDivElement {
  const div = document.createElement('div');
  div.className = `mn-bmc__block mn-bmc__block--${AREA[blockId]}`;
  div.setAttribute('role', 'group');
  div.dataset.block = blockId;
  const hdrId = `bmc-${uid}-${blockId}-hdr`;
  div.setAttribute('aria-labelledby', hdrId);

  const hdr = document.createElement('div');
  hdr.className = 'mn-bmc__header';
  hdr.id = hdrId;
  const badge = document.createElement('span');
  badge.className = 'mn-bmc__icon';
  badge.textContent = icon;
  const lbl = document.createElement('span');
  lbl.className = 'mn-bmc__title';
  lbl.textContent = title;
  hdr.append(badge, lbl);

  const list = document.createElement('ul');
  list.className = 'mn-bmc__list';
  list.setAttribute('role', 'list');
  list.setAttribute('aria-label', `${title} items`);
  div.append(hdr, list);

  if (editable) {
    const addBtn = document.createElement('button');
    addBtn.className = 'mn-bmc__add';
    addBtn.type = 'button';
    addBtn.setAttribute('aria-label', `Add ${title.toLowerCase()}`);
    addBtn.textContent = '+ Add';
    const wrap = document.createElement('div');
    wrap.className = 'mn-bmc__input-wrap';
    wrap.hidden = true;
    const input = document.createElement('input');
    input.className = 'mn-input mn-bmc__input';
    input.type = 'text';
    input.placeholder = 'Enter item\u2026';
    input.setAttribute('aria-label', `New ${title.toLowerCase()}`);
    const confirm = document.createElement('button');
    confirm.className = 'mn-bmc__confirm';
    confirm.type = 'button';
    confirm.setAttribute('aria-label', 'Confirm');
    confirm.textContent = '\u21B5';
    wrap.append(input, confirm);
    div.append(addBtn, wrap);
  }
  return div;
}

function buildItemEl(item: BmcItem, editable: boolean): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'mn-bmc__item';
  li.setAttribute('role', 'listitem');
  li.dataset.id = item.id;
  const span = document.createElement('span');
  span.className = 'mn-bmc__text';
  span.textContent = item.text;
  li.append(span);
  if (editable) {
    const btn = document.createElement('button');
    btn.className = 'mn-bmc__remove';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Remove: ${escapeHtml(item.text)}`);
    btn.textContent = '\u00D7';
    li.append(btn);
  }
  return li;
}

export function businessModelCanvas(
  el: HTMLElement, opts?: BusinessModelCanvasOptions,
): BusinessModelCanvasController {
  const editable = opts?.editable !== false;
  const uid = genId().slice(0, 8);

  /* Build initial block data from defaults + overrides */
  const blocks: BmcBlock[] = BLOCK_IDS.map(id => ({
    id,
    title: opts?.blocks?.[id]?.title ?? DEFAULTS[id].title,
    icon: opts?.blocks?.[id]?.icon ?? DEFAULTS[id].icon,
    items: [...(opts?.blocks?.[id]?.items ?? [])],
  }));

  el.classList.add('mn-bmc');
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Business Model Canvas');

  const blockEls = new Map<BmcBlockId, HTMLDivElement>();
  for (const b of blocks) {
    const bEl = buildBlock(b.id, b.title, b.icon, uid, editable);
    blockEls.set(b.id, bEl);
    el.append(bEl);
  }

  function notify(): void { opts?.onChange?.(blocks.map(b => ({ ...b, items: [...b.items] }))); }
  function findBlock(id: BmcBlockId): BmcBlock { return blocks.find(b => b.id === id)!; }

  function renderItems(): void {
    for (const b of blocks) {
      const list = blockEls.get(b.id)!.querySelector('.mn-bmc__list')!;
      list.innerHTML = '';
      for (const item of b.items) list.append(buildItemEl(item, editable));
    }
  }

  function addItem(blockId: BmcBlockId, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item: BmcItem = { id: genId(), text: trimmed, blockId };
    findBlock(blockId).items.push(item);
    const list = blockEls.get(blockId)!.querySelector('.mn-bmc__list')!;
    list.append(buildItemEl(item, editable));
    notify();
  }

  function removeItem(id: string): void {
    const li = el.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (li) { li.classList.add('mn-bmc__item--removing'); setTimeout(() => li.remove(), 200); }
    for (const b of blocks) b.items = b.items.filter(i => i.id !== id);
    notify();
  }

  function hideInput(bEl: HTMLElement): void {
    const wrap = bEl.querySelector('.mn-bmc__input-wrap') as HTMLElement;
    const addBtn = bEl.querySelector('.mn-bmc__add') as HTMLElement;
    if (wrap) wrap.hidden = true;
    if (addBtn) addBtn.hidden = false;
  }

  function handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.closest('.mn-bmc__remove')) {
      const li = target.closest('.mn-bmc__item') as HTMLElement | null;
      if (li?.dataset.id) removeItem(li.dataset.id);
      return;
    }
    if (target.closest('.mn-bmc__add')) {
      const bEl = target.closest('.mn-bmc__block') as HTMLElement;
      const wrap = bEl.querySelector('.mn-bmc__input-wrap') as HTMLElement;
      const addBtn = bEl.querySelector('.mn-bmc__add') as HTMLElement;
      wrap.hidden = false;
      addBtn.hidden = true;
      const input = wrap.querySelector('input')!;
      input.value = '';
      input.focus();
      return;
    }
    if (target.closest('.mn-bmc__confirm')) {
      const bEl = target.closest('.mn-bmc__block') as HTMLElement;
      const input = bEl.querySelector('.mn-bmc__input') as HTMLInputElement;
      addItem(bEl.dataset.block as BmcBlockId, input.value);
      hideInput(bEl);
    }
  }

  function handleKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('mn-bmc__input')) return;
    const bEl = target.closest('.mn-bmc__block') as HTMLElement;
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(bEl.dataset.block as BmcBlockId, (target as HTMLInputElement).value);
      hideInput(bEl);
    } else if (e.key === 'Escape') {
      hideInput(bEl);
      (bEl.querySelector('.mn-bmc__add') as HTMLElement)?.focus();
    }
  }

  el.addEventListener('click', handleClick);
  el.addEventListener('keydown', handleKeydown);
  renderItems();

  return {
    getBlocks: () => blocks.map(b => ({ ...b, items: [...b.items] })),
    addItem,
    removeItem,
    update(newBlocks: BmcBlock[]): void {
      blocks.length = 0;
      blocks.push(...newBlocks.map(b => ({ ...b, items: [...b.items] })));
      renderItems();
      notify();
    },
    destroy(): void {
      el.removeEventListener('click', handleClick);
      el.removeEventListener('keydown', handleKeydown);
      el.innerHTML = '';
      el.classList.remove('mn-bmc');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
    },
  };
}
