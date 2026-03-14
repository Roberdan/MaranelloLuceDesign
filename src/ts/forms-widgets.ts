/** Maranello Luce Design - Form widgets: auto-resize, tag input, password toggle,
 * file upload, form steps, inline edit, char counter, search clear. */

import { eventBus } from './core/events';
import { escapeHtml } from './core/sanitize';

export interface TagInputApi {
  getTags: () => string[];
  addTag: (text: string) => void;
  setTags: (arr: string[]) => void;
}

export interface FileUploadApi {
  getFiles: () => File[];
  clear: () => void;
}

export interface FormStepsApi {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  getCurrent: () => number;
}

/** Auto-resize a textarea to fit its content. */
export function initAutoResize(el: HTMLTextAreaElement | null): void {
  if (!el) return;
  function resize(): void { el!.style.height = 'auto'; el!.style.height = el!.scrollHeight + 'px'; }
  el.addEventListener('input', resize);
  resize();
}

/** Initialize a tag input widget. */
export function initTagInput(container: Element | null): TagInputApi | null {
  if (!container) { console.warn('[Maranello] initTagInput: container element is null'); return null; }
  const root = container;
  const field = root.querySelector('.mn-tag-input__field') as HTMLInputElement | null;
  if (!field) return null;
  if (!field.hasAttribute('aria-label')) field.setAttribute('aria-label', 'Type to add tags');
  let tags: string[] = [];

  function addTag(text: string): void {
    const t = text.trim();
    if (!t || tags.indexOf(t) !== -1) return;
    tags.push(t);
    const chip = document.createElement('span');
    chip.className = 'mn-tag-input__chip';
    chip.appendChild(document.createTextNode(t));
    const removeBtn = document.createElement('button');
    removeBtn.className = 'mn-tag-input__chip-remove';
    removeBtn.setAttribute('aria-label', 'Remove ' + t);
    removeBtn.textContent = '\u00D7';
    removeBtn.addEventListener('click', () => {
      tags = tags.filter((x) => x !== t);
      chip.remove();
      eventBus.emit('tag-change', { tags: tags.slice(), container: root });
    });
    chip.appendChild(removeBtn);
    root.insertBefore(chip, field);
    eventBus.emit('tag-change', { tags: tags.slice(), container: root });
  }

  field.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(field.value);
      field.value = '';
    } else if (e.key === 'Backspace' && field.value === '' && tags.length > 0) {
      tags.pop();
      const chips = root.querySelectorAll('.mn-tag-input__chip');
      if (chips.length > 0) chips[chips.length - 1].remove();
      eventBus.emit('tag-change', { tags: tags.slice(), container: root });
    }
  });
  root.addEventListener('click', () => field.focus());

  return {
    getTags: () => tags.slice(),
    addTag,
    setTags(arr: string[]): void {
      root.querySelectorAll('.mn-tag-input__chip').forEach((c) => c.remove());
      tags = [];
      arr.forEach(addTag);
    },
  };
}

/** Initialize a password visibility toggle. */
export function initPasswordToggle(wrap: Element | null): void {
  if (!wrap) return;
  const input = wrap.querySelector('.mn-form-input') as HTMLInputElement | null;
  const toggle = wrap.querySelector('.mn-password-toggle') as HTMLElement | null;
  if (!input || !toggle) return;
  toggle.addEventListener('click', () => {
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    toggle.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
    toggle.innerHTML = isPwd
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/><path d="M10.59 10.59a3 3 0 1 0 4.24 4.24"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  });
}

/** Initialize a file upload widget with drag-and-drop. */
export function initFileUpload(container: Element | null): FileUploadApi | null {
  if (!container) { console.warn('[Maranello] initFileUpload: container element is null'); return null; }
  const root = container;
  const input = root.querySelector('input[type="file"]') as HTMLInputElement | null;
  if (!input) return null;
  let files: File[] = [];
  root.addEventListener('dragover', (e: Event) => {
    e.preventDefault(); root.classList.add('mn-file-upload--dragover');
  });
  root.addEventListener('dragleave', () => root.classList.remove('mn-file-upload--dragover'));
  root.addEventListener('drop', (e: Event) => {
    const de = e as DragEvent;
    de.preventDefault();
    root.classList.remove('mn-file-upload--dragover');
    files = Array.from(de.dataTransfer?.files ?? []);
    eventBus.emit('file-upload', { files, container: root });
    updateLabel();
  });
  input.addEventListener('change', () => {
    files = Array.from(input.files ?? []);
    eventBus.emit('file-upload', { files, container: root });
    updateLabel();
  });
  const liveRegion = root.querySelector('.mn-file-upload__live') as HTMLElement
    ?? Object.assign(document.createElement('span'), { className: 'mn-file-upload__live' });
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');
  liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
  if (!liveRegion.parentNode) root.appendChild(liveRegion);
  function updateLabel(): void {
    const textEl = root.querySelector('.mn-file-upload__text') as HTMLElement | null;
    if (!textEl || files.length === 0) return;
    textEl.textContent = '';
    const strong = document.createElement('strong');
    const msg = files.length === 1 ? files[0].name : files.length + ' files selected';
    strong.textContent = files.length === 1 ? files[0].name : files.length + ' files';
    textEl.appendChild(strong);
    if (files.length > 1) textEl.appendChild(document.createTextNode(' selected'));
    liveRegion.textContent = msg;
  }
  return {
    getFiles: () => files,
    clear(): void {
      files = [];
      input.value = '';
      const t = root.querySelector('.mn-file-upload__text') as HTMLElement | null;
      if (t) t.innerHTML = '<strong>Click to upload</strong> or drag and drop';
    },
  };
}

/** Initialize a multi-step form. */
export function initFormSteps(container: Element | null): FormStepsApi | null {
  if (!container) { console.warn('[Maranello] initFormSteps: container element is null'); return null; }
  container.setAttribute('role', 'group');
  if (!container.getAttribute('aria-label')) container.setAttribute('aria-label', 'Form steps');
  const steps = container.querySelectorAll('.mn-form-step');
  let current = 0;
  function setStep(index: number): void {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => {
      step.classList.remove('mn-form-step--active', 'mn-form-step--complete');
      step.removeAttribute('aria-current');
      if (i < current) step.classList.add('mn-form-step--complete');
      if (i === current) {
        step.classList.add('mn-form-step--active');
        step.setAttribute('aria-current', 'step');
      }
    });
    eventBus.emit('form-step-change', { step: current, total: steps.length });
  }
  setStep(0);
  return {
    next: () => setStep(current + 1),
    prev: () => setStep(current - 1),
    goTo: (i: number) => setStep(i),
    getCurrent: () => current,
  };
}

/** Initialize inline editing on an element. */
export function initInlineEdit(el: Element | null): void {
  if (!el) return;
  const root = el;
  let originalText = (root.textContent ?? '').trim();
  let editing = false;
  root.addEventListener('click', () => {
    if (editing) return;
    editing = true;
    root.classList.add('mn-inline-edit--editing');
    const input = document.createElement('input');
    input.className = 'mn-form-input mn-form-input--sm';
    input.value = originalText;
    if (root instanceof HTMLElement) input.style.width = Math.max(100, root.offsetWidth) + 'px';
    const icon = root.querySelector('.mn-inline-edit__icon');
    root.textContent = '';
    root.appendChild(input);
    input.focus();
    input.select();
    function save(): void {
      const newValue = input.value.trim();
      editing = false;
      root.classList.remove('mn-inline-edit--editing');
      root.textContent = newValue || originalText;
      originalText = root.textContent ?? '';
      if (icon) root.appendChild(icon);
      eventBus.emit('inline-edit', { el: root, value: root.textContent });
    }
    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') { input.value = originalText; save(); }
    });
  });
}

/** Initialize a character counter on a field. */
export function initCharCounter(field: Element): void {
  const input = field.querySelector(
    '.mn-form-input, .mn-form-textarea',
  ) as HTMLInputElement | HTMLTextAreaElement | null;
  const counter = field.querySelector('.mn-field__counter') as HTMLElement | null;
  if (!input || !counter) return;
  const max = input.getAttribute('maxlength') ?? input.getAttribute('data-maxlength') ?? '\u221e';
  function update(): void { counter!.textContent = input!.value.length + '/' + max; }
  input.addEventListener('input', update);
  update();
}

/** Initialize a search input with clear button. */
export function initSearchClear(wrap: Element | null): void {
  if (!wrap) { console.warn('[Maranello] initSearchClear: wrapper element is null'); return; }
  const input = wrap.querySelector('.mn-form-input') as HTMLInputElement | null;
  const clearBtn = wrap.querySelector('.mn-search-input__clear') as HTMLElement | null;
  if (!input || !clearBtn) return;
  function toggleClear(): void { clearBtn!.style.display = input!.value ? 'flex' : 'none'; }
  input.addEventListener('input', toggleClear);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    toggleClear();
    input.focus();
    eventBus.emit('search-clear', { input });
  });
  toggleClear();
}
