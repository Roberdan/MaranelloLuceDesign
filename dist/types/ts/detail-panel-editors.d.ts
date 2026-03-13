/**
 * Maranello Luce Design - Detail panel field editors (edit mode)
 * Creates editable DOM elements for each field type.
 */
import type { DetailEditor } from './core/types';
/** Date picker integration type (lazy-loaded from date-picker module). */
type DatePickerFn = (anchor: HTMLElement, opts: {
    value?: string;
    min?: string;
    max?: string;
    onSelect: (d: string) => void;
}) => void;
/** Register a date picker function for calendar button support. */
export declare function registerDatePicker(fn: DatePickerFn): void;
declare const editors: Record<string, DetailEditor>;
export { editors };
