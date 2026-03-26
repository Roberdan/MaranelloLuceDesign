/**
 * Maranello Luce Design - Command palette (Cmd+K style)
 * Provides a searchable command overlay with keyboard navigation.
 * ARIA combobox pattern with listbox results.
 */
import type { CommandPaletteController } from './core/types';
/** Initialize a command palette. Ctrl/Cmd+K shortcut. Emits 'command-select'. Safe to re-init. */
export declare function commandPalette(id: string): CommandPaletteController;
