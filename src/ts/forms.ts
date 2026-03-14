/**
 * Maranello Luce Design - Forms facade
 * Aggregates validation and widget initialization.
 */

import {
  validateForm,
  validateField,
  initLiveValidation,
  addValidator,
  getFieldInput,
  validators,
  defaultMessages,
} from './forms-validate';
import type { FormValidator } from './forms-validate';
import {
  initAutoResize,
  initTagInput,
  initPasswordToggle,
  initFileUpload,
  initFormSteps,
  initInlineEdit,
  initCharCounter,
  initSearchClear,
} from './forms-widgets';

function qsa(root: Document | HTMLElement, ...sels: string[]): NodeListOf<HTMLElement> {
  return root.querySelectorAll(sels.join(',')) as NodeListOf<HTMLElement>;
}

/** Mark required fields with aria-required and link hints via aria-describedby. */
function applyFieldA11y(root: Document | HTMLElement): void {
  const fields = (root as HTMLElement).querySelectorAll
    ? (root as HTMLElement).querySelectorAll('.mn-field')
    : document.querySelectorAll('.mn-field');
  fields.forEach((field) => {
    const input = getFieldInput(field);
    if (!input) return;
    if (input.hasAttribute('required') || input.getAttribute('data-validate')?.includes('required')) {
      input.setAttribute('aria-required', 'true');
    }
    const hint = field.querySelector('.mn-field__hint') as HTMLElement | null;
    if (hint) {
      if (!hint.id) {
        hint.id = 'mn-hint-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      }
      const existing = input.getAttribute('aria-describedby');
      if (!existing?.includes(hint.id)) {
        input.setAttribute('aria-describedby', existing ? existing + ' ' + hint.id : hint.id);
      }
    }
  });
}

/** Initialize all form widgets within a root element. */
export function initForms(root: Document | HTMLElement = document): void {
  applyFieldA11y(root);
  qsa(root, '[data-mn-validate]', '.mn-form[data-live-validate]').forEach(
    (form) => initLiveValidation(form),
  );
  qsa(root, '[data-mn-autoresize]', '.mn-form-textarea--auto').forEach(
    (el) => initAutoResize(el as HTMLTextAreaElement),
  );
  qsa(root, '[data-mn-tags]', '.mn-tag-input').forEach(
    (el) => initTagInput(el),
  );
  qsa(root, '[data-mn-password-toggle]', '.mn-password-wrap').forEach(
    (el) => initPasswordToggle(el),
  );
  qsa(root, '[data-mn-file-upload]', '.mn-file-upload').forEach(
    (el) => initFileUpload(el),
  );
  qsa(root, '[data-mn-steps]', '.mn-form-steps').forEach(
    (el) => initFormSteps(el),
  );
  qsa(root, '[data-mn-inline-edit]', '.mn-inline-edit').forEach(
    (el) => initInlineEdit(el),
  );
  qsa(root, '[data-mn-char-counter]', '.mn-field__counter').forEach(
    (el) => initCharCounter(el),
  );
  qsa(root, '[data-mn-search-clear]', '.mn-search-input').forEach(
    (el) => initSearchClear(el),
  );
}

/** Forms public API object. */
export const forms = {
  init: initForms,
  initAll: initForms,
  validate: validateForm,
  validateField,
  initLiveValidation,
  addValidator,
  get validators() { return validators; },
  get defaultMessages() { return defaultMessages; },
  initAutoResize,
  initTagInput,
  initPasswordToggle,
  initFileUpload,
  initFormSteps,
  initInlineEdit,
  initCharCounter,
  initSearchClear,
} as const;
