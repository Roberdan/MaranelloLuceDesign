/**
 * Maranello Luce Design - Date picker
 * Themed calendar dropdown for date selection.
 * ARIA grid pattern with full keyboard navigation.
 */
import type { DatePickerOptions, DatePickerController } from './core/types';
/** Create a date picker dropdown anchored to an element. */
export declare function datePicker(anchor: HTMLElement, opts?: DatePickerOptions): DatePickerController;
