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
export declare function attachDatePickerKeys(picker: HTMLElement, ctx: KeyNavContext): void;
export type { KeyNavContext };
