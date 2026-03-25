/**
 * Maranello Luce Design - Control type definitions
 * Extracted from: controls-drag, controls-dialogs, controls-nav,
 *   ferrari-controls, ferrari-controls-manettino, ferrari-controls-toggle
 */

// --- Rotary Knob ---

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

// --- Slider ---

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
  destroy: () => void;
}

// --- Toast ---

export interface ToastOptions {
  title?: string;
  message?: string;
  type?: string;
  duration?: number;
  container?: string;
}

// --- Modal ---

export interface ModalElement extends HTMLElement {
  _mnTrapFocus?: (e: KeyboardEvent) => void;
}

// --- Command Palette ---

export interface CommandPaletteController {
  open: () => void;
  close: () => void;
}

// --- Ferrari Cruise Lever ---

export interface CruiseLeverOptions {
  positions?: string[];
  initial?: number;
  label?: string;
  onChange?: ((index: number, label: string) => void) | null;
}

// --- Ferrari Manettino ---

export interface ManettinoOptions {
  positions?: string[];
  initial?: number;
  label?: string;
  tint?: string;
  onChange?: ((index: number, label: string) => void) | null;
}

// --- Ferrari Toggle ---

export interface FerrariToggleOptions {
  label?: string;
  initial?: boolean;
  onChange?: ((value: boolean) => void) | null;
}

// --- Stepped Dial ---

export interface SteppedDialOptions {
  positions?: string[];
  initial?: number;
  label?: string;
  onChange?: ((index: number, label: string) => void) | null;
}

// --- Indexed Control (shared controller shape) ---

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
