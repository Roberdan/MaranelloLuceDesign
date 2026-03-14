/**
 * Maranello Luce Design - Command palette (Cmd+K style)
 * Provides a searchable command overlay with keyboard navigation.
 * ARIA combobox pattern with listbox results.
 */
import type { CommandPaletteController } from './core/types';
/**
 * Initialize a command palette on an existing DOM element.
 * Registers Ctrl/Cmd+K global shortcut.
 * Emits 'command-select' event when an item is chosen.
 */
export declare function commandPalette(id: string): CommandPaletteController;
