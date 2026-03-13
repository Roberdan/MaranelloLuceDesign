/**
 * Maranello Luce Design - Control type definitions
 * Extracted from: controls-drag, controls-dialogs, controls-nav,
 *   ferrari-controls, ferrari-controls-manettino, ferrari-controls-toggle
 */
export interface RotaryOptions {
    steps?: string[];
    initial?: number;
    snap?: boolean;
    onChange?: (value: string, index: number) => void;
}
export interface RotaryController {
    setStep: (idx: number) => void;
    getValue: () => string;
    destroy: () => void;
}
export interface SliderOptions {
    min?: number;
    max?: number;
    value?: number;
    step?: number;
    unit?: string;
    onChange?: (value: number) => void;
    label?: string | null;
}
export interface SliderController {
    getValue: () => number;
    setValue: (v: number) => void;
}
export interface ToastOptions {
    title?: string;
    message?: string;
    type?: string;
    duration?: number;
    container?: string;
}
export interface ModalElement extends HTMLElement {
    _mnTrapFocus?: (e: KeyboardEvent) => void;
}
export interface CommandPaletteController {
    open: () => void;
    close: () => void;
}
export interface CruiseLeverOptions {
    positions?: string[];
    initial?: number;
    label?: string;
    onChange?: ((index: number, label: string) => void) | null;
}
export interface ManettinoOptions {
    positions?: string[];
    initial?: number;
    label?: string;
    tint?: string;
    onChange?: ((index: number, label: string) => void) | null;
}
export interface FerrariToggleOptions {
    label?: string;
    initial?: boolean;
    onChange?: ((value: boolean) => void) | null;
}
export interface SteppedDialOptions {
    positions?: string[];
    initial?: number;
    label?: string;
    onChange?: ((index: number, label: string) => void) | null;
}
export interface IndexedControlController {
    getValue: () => number;
    setValue: (idx: number) => void;
    destroy: () => void;
}
export interface BooleanControlController {
    getValue: () => boolean;
    setValue: (on: boolean) => void;
    destroy: () => void;
}
