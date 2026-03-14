/**
 * Maranello Luce Design - Date picker
 * Themed calendar dropdown for date selection.
 * ARIA grid pattern with full keyboard navigation.
 */

import type { DatePickerOptions, DatePickerController } from './core/types';
import { attachDatePickerKeys } from './date-picker-keys';

interface ParsedDate { y: number; m: number; d: number }

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

let activePicker: HTMLDivElement | null = null;

function closePicker(): void {
  if (activePicker) { activePicker.remove(); activePicker = null; }
  document.removeEventListener('mousedown', onDocClick);
  document.removeEventListener('keydown', onDocKey);
}

function onDocClick(e: MouseEvent): void {
  if (activePicker && e.target instanceof Node && !activePicker.contains(e.target)) closePicker();
}

function onDocKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') closePicker();
}

function pad(n: number): string { return n < 10 ? '0' + n : String(n); }
function toDateStr(y: number, m: number, d: number): string { return y + '-' + pad(m + 1) + '-' + pad(d); }
function parseVal(s?: string): ParsedDate | null {
  if (!s) return null;
  const p = String(s).split('-');
  return { y: Number(p[0]), m: Number(p[1]) - 1, d: Number(p[2]) || 1 };
}
function daysInMonth(y: number, m: number): number { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfWeek(y: number, m: number): number {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

/** Focus a day cell by its 1-based day number within the picker grid. */
function focusDayCellInPicker(picker: HTMLElement, day: number): void {
  const cells = picker.querySelectorAll<HTMLButtonElement>(
    '.mn-date-picker__day:not(.mn-date-picker__day--empty)',
  );
  const target = cells[day - 1];
  if (target) {
    cells.forEach((c) => c.setAttribute('tabindex', '-1'));
    target.setAttribute('tabindex', '0');
    target.focus();
  }
}

/** Create a date picker dropdown anchored to an element. */
export function datePicker(anchor: HTMLElement, opts?: DatePickerOptions): DatePickerController {
  closePicker();
  const options = opts ?? {};

  let sel = parseVal(options.value);
  let viewY = sel ? sel.y : new Date().getFullYear();
  let viewM = sel ? sel.m : new Date().getMonth();
  let focusedDay = sel ? sel.d : 1;
  const minD = parseVal(options.min);
  const maxD = parseVal(options.max);
  const todayY = new Date().getFullYear();
  const todayM = new Date().getMonth();
  const todayD = new Date().getDate();

  const picker = document.createElement('div');
  picker.className = 'mn-date-picker';
  activePicker = picker;

  function isDisabled(y: number, m: number, d: number): boolean {
    const ds = toDateStr(y, m, d);
    if (minD && ds < toDateStr(minD.y, minD.m, minD.d)) return true;
    if (maxD && ds > toDateStr(maxD.y, maxD.m, maxD.d)) return true;
    return false;
  }

  function selectDay(day: number): void {
    sel = { y: viewY, m: viewM, d: day };
    if (options.onSelect) options.onSelect(toDateStr(viewY, viewM, day));
    closePicker();
  }

  function renderCalendar(): void {
    picker.innerHTML = '';
    const nav = document.createElement('div');
    nav.className = 'mn-date-picker__nav';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'mn-date-picker__nav-btn';
    prevBtn.innerHTML = '\u25C0';
    prevBtn.setAttribute('aria-label', 'Previous month');
    prevBtn.addEventListener('click', () => {
      viewM--;
      if (viewM < 0) { viewM = 11; viewY--; }
      // Clamp focusedDay to the new month's length to avoid out-of-range tabindex=0
      focusedDay = Math.min(focusedDay, daysInMonth(viewY, viewM));
      renderCalendar();
    });

    const title = document.createElement('span');
    title.className = 'mn-date-picker__month-title';
    title.id = 'mn-dp-title';
    title.textContent = MONTHS[viewM] + ' ' + viewY;
    title.setAttribute('aria-live', 'polite');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'mn-date-picker__nav-btn';
    nextBtn.innerHTML = '\u25B6';
    nextBtn.setAttribute('aria-label', 'Next month');
    nextBtn.addEventListener('click', () => {
      viewM++;
      if (viewM > 11) { viewM = 0; viewY++; }
      // Clamp focusedDay to the new month's length to avoid out-of-range tabindex=0
      focusedDay = Math.min(focusedDay, daysInMonth(viewY, viewM));
      renderCalendar();
    });

    nav.append(prevBtn, title, nextBtn);
    picker.appendChild(nav);

    const dayHeaders = document.createElement('div');
    dayHeaders.className = 'mn-date-picker__days-header';
    dayHeaders.setAttribute('role', 'row');
    DAYS.forEach((d) => {
      const dh = document.createElement('span');
      dh.className = 'mn-date-picker__day-name';
      dh.setAttribute('role', 'columnheader');
      dh.textContent = d;
      dayHeaders.appendChild(dh);
    });
    picker.appendChild(dayHeaders);

    const grid = document.createElement('div');
    grid.className = 'mn-date-picker__grid';
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-labelledby', 'mn-dp-title');

    const startDay = firstDayOfWeek(viewY, viewM);
    const totalDays = daysInMonth(viewY, viewM);
    let row = document.createElement('div');
    row.setAttribute('role', 'row');

    for (let e = 0; e < startDay; e++) {
      const empty = document.createElement('span');
      empty.className = 'mn-date-picker__day mn-date-picker__day--empty';
      empty.setAttribute('role', 'gridcell');
      row.appendChild(empty);
    }

    for (let d = 1; d <= totalDays; d++) {
      const cellIdx = (startDay + d - 1) % 7;
      if (cellIdx === 0 && d > 1) {
        grid.appendChild(row);
        row = document.createElement('div');
        row.setAttribute('role', 'row');
      }

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'mn-date-picker__day';
      cell.setAttribute('role', 'gridcell');
      cell.textContent = String(d);
      cell.setAttribute('tabindex', d === focusedDay ? '0' : '-1');

      const dateLabel = d + ' ' + MONTHS[viewM] + ' ' + viewY;
      cell.setAttribute('aria-label', dateLabel);

      const disabled = isDisabled(viewY, viewM, d);
      if (disabled) cell.classList.add('mn-date-picker__day--disabled');
      cell.disabled = disabled;

      const isSelected = sel && d === sel.d && viewM === sel.m && viewY === sel.y;
      if (d === todayD && viewM === todayM && viewY === todayY) {
        cell.classList.add('mn-date-picker__day--today');
      }
      if (isSelected) {
        cell.classList.add('mn-date-picker__day--selected');
        cell.setAttribute('aria-selected', 'true');
      }

      const day = d;
      cell.addEventListener('click', () => selectDay(day));
      row.appendChild(cell);
    }
    grid.appendChild(row);
    picker.appendChild(grid);

    const todayBtn = document.createElement('button');
    todayBtn.type = 'button';
    todayBtn.className = 'mn-date-picker__today-btn';
    todayBtn.textContent = 'Today';
    todayBtn.addEventListener('click', () => {
      viewY = todayY;
      viewM = todayM;
      sel = { y: todayY, m: todayM, d: todayD };
      if (options.onSelect) options.onSelect(toDateStr(todayY, todayM, todayD));
      closePicker();
    });
    picker.appendChild(todayBtn);
  }

  attachDatePickerKeys(picker, {
    getViewYear: () => viewY,
    getViewMonth: () => viewM,
    setView: (y, m) => { viewY = y; viewM = m; },
    daysInMonth,
    isDisabled,
    selectDay,
    closePicker,
    renderCalendar,
    getFocusedDay: () => focusedDay,
    setFocusedDay: (d) => { focusedDay = d; },
    focusDayCell: (d) => focusDayCellInPicker(picker, d),
  });

  renderCalendar();
  anchor.style.position = 'relative';
  anchor.appendChild(picker);

  setTimeout(() => focusDayCellInPicker(picker, focusedDay), 50);

  setTimeout(() => {
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onDocKey);
  }, 0);

  return { close: closePicker };
}
