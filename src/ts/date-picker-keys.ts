/**
 * Maranello Luce Design - Date picker keyboard navigation
 * Arrow/Home/End/Page key handlers for the calendar grid.
 */

interface KeyNavContext {
  getViewYear: () => number;
  getViewMonth: () => number;
  setView: (y: number, m: number) => void;
  daysInMonth: (y: number, m: number) => number;
  isDisabled: (y: number, m: number, d: number) => boolean;
  selectDay: (day: number) => void;
  closePicker: () => void;
  renderCalendar: () => void;
  getFocusedDay: () => number;
  setFocusedDay: (d: number) => void;
  focusDayCell: (d: number) => void;
}

/** Attach keyboard navigation to the date picker. */
export function attachDatePickerKeys(
  picker: HTMLElement,
  ctx: KeyNavContext,
): void {
  picker.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    if (!target.classList.contains('mn-date-picker__day')) return;

    const day = ctx.getFocusedDay();
    if (!day) return;

    let handled = true;

    switch (e.key) {
      case 'ArrowLeft': navigateDay(ctx, day, -1); break;
      case 'ArrowRight': navigateDay(ctx, day, 1); break;
      case 'ArrowUp': navigateDay(ctx, day, -7); break;
      case 'ArrowDown': navigateDay(ctx, day, 7); break;
      case 'Home': ctx.setFocusedDay(1); ctx.focusDayCell(1); break;
      case 'End': {
        const last = ctx.daysInMonth(ctx.getViewYear(), ctx.getViewMonth());
        ctx.setFocusedDay(last);
        ctx.focusDayCell(last);
        break;
      }
      case 'PageUp': changeMonth(ctx, -1); break;
      case 'PageDown': changeMonth(ctx, 1); break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!ctx.isDisabled(ctx.getViewYear(), ctx.getViewMonth(), day)) {
          ctx.selectDay(day);
        }
        return;
      case 'Escape': ctx.closePicker(); return;
      default: handled = false;
    }

    if (handled) e.preventDefault();
  });
}

/** Move focus by a delta in days, crossing month boundaries. */
function navigateDay(ctx: KeyNavContext, current: number, delta: number): void {
  let y = ctx.getViewYear();
  let m = ctx.getViewMonth();
  let target = current + delta;

  if (target < 1) {
    m--;
    if (m < 0) { m = 11; y--; }
    ctx.setView(y, m);
    target = ctx.daysInMonth(y, m) + target;
    ctx.renderCalendar();
    ctx.setFocusedDay(target);
    ctx.focusDayCell(target);
    return;
  }

  const max = ctx.daysInMonth(y, m);
  if (target > max) {
    target = target - max;
    m++;
    if (m > 11) { m = 0; y++; }
    ctx.setView(y, m);
    ctx.renderCalendar();
    ctx.setFocusedDay(target);
    ctx.focusDayCell(target);
    return;
  }

  ctx.setFocusedDay(target);
  ctx.focusDayCell(target);
}

/** Move to the previous or next month, keeping the same focused day. */
function changeMonth(ctx: KeyNavContext, dir: number): void {
  let y = ctx.getViewYear();
  let m = ctx.getViewMonth() + dir;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  ctx.setView(y, m);
  const maxDay = ctx.daysInMonth(y, m);
  const day = Math.min(ctx.getFocusedDay(), maxDay);
  ctx.renderCalendar();
  ctx.setFocusedDay(day);
  ctx.focusDayCell(day);
}

export type { KeyNavContext };
