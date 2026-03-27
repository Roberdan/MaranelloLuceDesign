// Maranello Luce Design - Date Range Picker
// Headless calendar dropdown for selecting a from/to date range.

export interface DateRange { from: string | null; to: string | null }

export interface DateRangePickerOptions {
  value?: DateRange;
  min?: string;
  max?: string;
  placeholder?: string;
  onChange?: (range: DateRange) => void;
}

export interface DateRangePickerController {
  getValue: () => DateRange;
  setValue: (range: DateRange) => void;
  open: () => void;
  close: () => void;
  destroy: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SHORT_M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function todayISO(): string {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}
function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${SHORT_M[m - 1]} ${y}`;
}
function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
// Monday-based day index (0=Mon, 6=Sun)
function mondayIdx(date: Date): number { return (date.getDay() + 6) % 7; }

export function dateRangePicker(
  el: HTMLElement,
  opts?: DateRangePickerOptions,
): DateRangePickerController {
  const o = opts ?? {};
  let range: DateRange = { from: o.value?.from ?? null, to: o.value?.to ?? null };
  let viewYear: number, viewMonth: number;
  let popup: HTMLDivElement | null = null;
  let picking = false;

  const now = new Date();
  if (range.from) {
    const d = parseISO(range.from);
    viewYear = d.getFullYear(); viewMonth = d.getMonth();
  } else {
    viewYear = now.getFullYear(); viewMonth = now.getMonth();
  }

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'mn-drp__trigger mn-input';
  el.appendChild(trigger);
  updateLabel();

  function updateLabel(): void {
    if (range.from && range.to) {
      trigger.textContent = `${formatDisplay(range.from)} \u2013 ${formatDisplay(range.to)}`;
    } else if (range.from) {
      trigger.textContent = `${formatDisplay(range.from)} \u2013 \u2026`;
    } else {
      trigger.textContent = o.placeholder ?? 'Select date range\u2026';
    }
  }

  function isDisabled(iso: string): boolean {
    return (!!o.min && iso < o.min) || (!!o.max && iso > o.max);
  }

  function buildCalendar(): void {
    if (!popup) return;
    const grid = popup.querySelector('.mn-drp__grid') as HTMLDivElement;
    const lbl = popup.querySelector('.mn-drp__month-label') as HTMLSpanElement;
    lbl.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';
    for (const dn of DAYS) {
      const h = document.createElement('div');
      h.className = 'mn-drp__day-name'; h.textContent = dn;
      grid.appendChild(h);
    }
    const offset = mondayIdx(new Date(viewYear, viewMonth, 1));
    const total = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = todayISO();
    for (let i = 0; i < offset; i++) {
      const e = document.createElement('div');
      e.className = 'mn-drp__day mn-drp__day--empty';
      grid.appendChild(e);
    }
    for (let d = 1; d <= total; d++) {
      const iso = toISO(viewYear, viewMonth, d);
      const cell = document.createElement('div');
      cell.className = 'mn-drp__day';
      cell.textContent = String(d);
      cell.dataset.date = iso;
      if (iso === today) cell.classList.add('mn-drp__day--today');
      if (isDisabled(iso)) cell.classList.add('mn-drp__day--disabled');
      if (range.from && (iso === range.from || iso === range.to)) {
        cell.classList.add('mn-drp__day--selected');
      }
      if (range.from && range.to && iso > range.from && iso < range.to) {
        cell.classList.add('mn-drp__day--in-range');
      }
      grid.appendChild(cell);
    }
  }

  function positionPopup(): void {
    if (!popup) return;
    const r = el.getBoundingClientRect();
    popup.style.top = `${r.bottom + 4}px`;
    popup.style.left = `${r.left}px`;
  }

  function onGridClick(e: Event): void {
    const t = e.target as HTMLElement;
    if (!t.dataset.date || t.classList.contains('mn-drp__day--disabled')) return;
    const iso = t.dataset.date;
    if (!picking || !range.from) {
      range = { from: iso, to: null };
      picking = true;
      buildCalendar(); updateLabel();
      return;
    }
    if (iso < range.from) {
      range = { from: iso, to: null };
      buildCalendar(); updateLabel();
      return;
    }
    range.to = iso;
    picking = false;
    updateLabel(); closePopup();
    o.onChange?.(range);
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') closePopup();
  }

  function onClickOutside(e: MouseEvent): void {
    if (!popup) return;
    const t = e.target as Node;
    if (popup.contains(t) || el.contains(t)) return;
    closePopup();
  }

  function openPopup(): void {
    if (popup) return;
    popup = document.createElement('div');
    popup.className = 'mn-drp__popup';
    popup.innerHTML =
      '<div class="mn-drp__header">' +
      '<button type="button" class="mn-drp__nav mn-drp__nav--prev">\u2039</button>' +
      '<span class="mn-drp__month-label"></span>' +
      '<button type="button" class="mn-drp__nav mn-drp__nav--next">\u203A</button>' +
      '</div><div class="mn-drp__grid"></div>';
    document.body.appendChild(popup);
    positionPopup();
    buildCalendar();
    popup.querySelector('.mn-drp__nav--prev')!.addEventListener('click', () => {
      if (--viewMonth < 0) { viewMonth = 11; viewYear--; }
      buildCalendar();
    });
    popup.querySelector('.mn-drp__nav--next')!.addEventListener('click', () => {
      if (++viewMonth > 11) { viewMonth = 0; viewYear++; }
      buildCalendar();
    });
    popup.querySelector('.mn-drp__grid')!.addEventListener('click', onGridClick);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('scroll', positionPopup, true);
    window.addEventListener('resize', positionPopup);
  }

  function closePopup(): void {
    if (!popup) return;
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('mousedown', onClickOutside);
    window.removeEventListener('scroll', positionPopup, true);
    window.removeEventListener('resize', positionPopup);
    popup.remove();
    popup = null;
  }

  trigger.addEventListener('click', () => { popup ? closePopup() : openPopup(); });

  return {
    getValue: () => ({ ...range }),
    setValue(r: DateRange) {
      range = { from: r.from, to: r.to };
      picking = false;
      if (range.from) {
        const d = parseISO(range.from);
        viewYear = d.getFullYear(); viewMonth = d.getMonth();
      }
      updateLabel();
      if (popup) buildCalendar();
    },
    open: openPopup,
    close: closePopup,
    destroy() { closePopup(); trigger.remove(); },
  };
}
