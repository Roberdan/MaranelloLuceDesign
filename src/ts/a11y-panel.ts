/**
 * Maranello Luce Design - Accessibility panel controller
 * Wires up the a11y FAB, panel, reset, keyboard, and outside-click behavior.
 */

import type { A11yPanelController, A11ySettings } from './core/types';
import {
  DEFAULTS,
  loadSettings,
  saveSettings,
  applySettings,
  buildPanel,
} from './a11y-panel-dom';

/**
 * Create and mount the accessibility panel.
 * Returns a controller with getSettings, reset, and destroy methods.
 */
export function a11yPanel(): A11yPanelController {
  const settings: A11ySettings = loadSettings();
  const refs = buildPanel(settings);
  const { fab, panel } = refs;

  refs.resetBtn.addEventListener('click', () => {
    settings.fontSize = DEFAULTS.fontSize;
    settings.reducedMotion = DEFAULTS.reducedMotion;
    settings.highContrast = DEFAULTS.highContrast;
    settings.focusVisible = DEFAULTS.focusVisible;
    settings.lineSpacing = DEFAULTS.lineSpacing;
    saveSettings(settings);
    applySettings(settings);

    for (const k of Object.keys(refs.sizeButtons)) {
      refs.sizeButtons[k].classList.toggle('mn-a11y-panel__size-btn--active', k === 'md');
    }
    for (const k of Object.keys(refs.lsButtons)) {
      refs.lsButtons[k].classList.toggle('mn-a11y-panel__size-btn--active', k === 'normal');
    }
    panel.querySelectorAll<HTMLButtonElement>('.mn-a11y-toggle').forEach((t) => {
      const label = t.getAttribute('aria-label');
      const isDefault = label === 'Focus Indicators';
      t.classList.toggle('mn-a11y-toggle--on', isDefault);
      t.setAttribute('aria-checked', String(isDefault));
    });
  });

  let isOpen = false;

  fab.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('mn-a11y-panel--open', isOpen);
    fab.setAttribute('aria-expanded', String(isOpen));
  });

  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      panel.classList.remove('mn-a11y-panel--open');
      fab.setAttribute('aria-expanded', 'false');
      fab.focus();
    }
  };
  document.addEventListener('keydown', onKeydown);

  const onDocClick = (e: MouseEvent): void => {
    const target = e.target as Node | null;
    if (target && isOpen && !panel.contains(target) && !fab.contains(target)) {
      isOpen = false;
      panel.classList.remove('mn-a11y-panel--open');
      fab.setAttribute('aria-expanded', 'false');
    }
  };
  document.addEventListener('click', onDocClick);

  document.body.appendChild(fab);
  document.body.appendChild(panel);
  applySettings(settings);

  return {
    getSettings: () => ({ ...settings }),
    reset: () => refs.resetBtn.click(),
    destroy: () => {
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocClick);
      fab.remove();
      panel.remove();
    },
  };
}
