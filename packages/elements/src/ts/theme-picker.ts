/**
 * Maranello Luce Design - Grafana-style theme picker
 * Renders preview cards for all 5 themes with radio selection.
 */

import type { ThemeMode } from './core/types';
import { setTheme, getTheme } from './core/utils';
import { escapeHtml } from './core/sanitize';
import { getLocale } from './locale';

export interface ThemePickerOptions {
  current?: string;
  onChange?: (theme: string) => void;
  compact?: boolean;
}

export interface ThemePickerController {
  destroy: () => void;
  getTheme: () => string;
}

interface ThemeData {
  id: ThemeMode;
  label: string;
  surface: string;
  card: string;
  accent: string;
  error: string;
  info: string;
}

const THEMES: ThemeData[] = [
  { id: 'editorial', label: 'Editorial', surface: '#111111', card: '#1a1a1a', accent: '#FFC72C', error: '#DC0000', info: '#448AFF' },
  { id: 'nero', label: 'Nero', surface: '#050505', card: '#111111', accent: '#FFC72C', error: '#DC0000', info: '#448AFF' },
  { id: 'avorio', label: 'Avorio', surface: '#FAF3E6', card: '#FFFFFF', accent: '#DC0000', error: '#DC0000', info: '#448AFF' },
  { id: 'colorblind', label: 'Colorblind', surface: '#111111', card: '#1a1a1a', accent: '#0072B2', error: '#C94000', info: '#0072B2' },
  { id: 'sugar', label: 'Sugar', surface: '#E4E4E8', card: '#FFFFFF', accent: '#000000', error: '#DC0000', info: '#448AFF' },
];

function buildCard(theme: ThemeData, isActive: boolean): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'mn-theme-picker__card' + (isActive ? ' mn-theme-picker__card--active' : '');
  card.setAttribute('role', 'radio');
  card.setAttribute('aria-checked', String(isActive));
  card.setAttribute('tabindex', '0');
  card.setAttribute('data-theme', theme.id);
  const themeLocale = getLocale().themes;
  const locLabel = themeLocale[theme.id as keyof typeof themeLocale] || theme.label;
  card.setAttribute('aria-label', `${escapeHtml(locLabel)} theme`);

  const header = document.createElement('div');
  header.className = 'mn-theme-picker__header';

  const radio = document.createElement('span');
  radio.className = 'mn-theme-picker__radio';
  radio.setAttribute('aria-hidden', 'true');
  header.appendChild(radio);

  const name = document.createElement('span');
  name.className = 'mn-theme-picker__name';
  name.textContent = locLabel;
  header.appendChild(name);

  card.appendChild(header);

  const preview = document.createElement('div');
  preview.className = 'mn-theme-picker__preview';
  preview.style.backgroundColor = theme.surface;

  const previewCard = document.createElement('div');
  previewCard.className = 'mn-theme-picker__preview-card';
  previewCard.style.backgroundColor = theme.card;

  const formLabel = document.createElement('div');
  formLabel.className = 'mn-theme-picker__preview-label';
  const isLight = theme.id === 'avorio' || theme.id === 'sugar';
  formLabel.style.backgroundColor = isLight ? '#999' : '#555';

  const formInput = document.createElement('div');
  formInput.className = 'mn-theme-picker__preview-input';
  formInput.style.borderColor = isLight ? '#ccc' : '#444';

  const dots = document.createElement('div');
  dots.className = 'mn-theme-picker__dots';
  for (const color of [theme.accent, theme.error, theme.info]) {
    const dot = document.createElement('span');
    dot.className = 'mn-theme-picker__dot';
    dot.style.backgroundColor = color;
    dots.appendChild(dot);
  }

  previewCard.appendChild(formLabel);
  previewCard.appendChild(formInput);
  previewCard.appendChild(dots);
  preview.appendChild(previewCard);
  card.appendChild(preview);

  return card;
}

export function themePicker(
  container: HTMLElement,
  options?: ThemePickerOptions,
): ThemePickerController {
  const current = (options?.current ?? getTheme()) as ThemeMode;
  let selected: ThemeMode = THEMES.some((t) => t.id === current) ? current : 'editorial';

  const grid = document.createElement('div');
  grid.className = 'mn-theme-picker' + (options?.compact ? ' mn-theme-picker--compact' : '');
  grid.setAttribute('role', 'radiogroup');
  grid.setAttribute('aria-label', 'Theme selection');

  function render(): void {
    grid.innerHTML = '';
    for (const theme of THEMES) {
      const card = buildCard(theme, theme.id === selected);
      card.addEventListener('click', () => select(theme.id));
      card.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(theme.id);
        }
      });
      grid.appendChild(card);
    }
  }

  function select(id: ThemeMode): void {
    selected = id;
    setTheme(id);
    render();
    options?.onChange?.(id);
  }

  render();
  container.appendChild(grid);

  return {
    destroy(): void {
      grid.remove();
    },
    getTheme(): string {
      return selected;
    },
  };
}
