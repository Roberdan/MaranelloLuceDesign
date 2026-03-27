/** Maranello Luce Design - Detail panel UI (DOM + body rendering) */
import type { DetailPanelOptions, DetailPanelState, DetailField } from './core/types';
import { createElement } from './core/utils';
import { renderers } from './detail-panel-renderers';
import { editors } from './detail-panel-editors';

/** DOM references returned by buildDOM. */
export interface DetailPanelDOM {
  backdrop: HTMLElement; titleEl: HTMLElement;
  editBtn: HTMLButtonElement; saveBtn: HTMLButtonElement;
  cancelBtn: HTMLButtonElement; closeBtn: HTMLButtonElement;
  tabBar: HTMLElement | null; body: HTMLElement; footer: HTMLElement;
}

/** Show a toast notification inside the panel. */
export function showToast(panel: HTMLElement, message: string, type: string = 'info'): void {
  const existing = panel.querySelector('.mn-detail-panel__toast');
  if (existing) existing.remove();
  const toast = createElement('div', `mn-detail-panel__toast mn-detail-panel__toast--${type}`);
  toast.textContent = message;
  const body = panel.querySelector('.mn-detail-panel__body') ?? panel;
  body.insertBefore(toast, body.firstChild);
  setTimeout(() => toast.classList.add('mn-detail-panel__toast--visible'), 16);
  setTimeout(() => {
    toast.classList.remove('mn-detail-panel__toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/** Render a loading skeleton into the panel body. */
export function renderSkeleton(body: HTMLElement): void {
  body.innerHTML = '';
  for (let s = 0; s < 3; s++) {
    const section = createElement('div', 'mn-detail-panel__section');
    const title = createElement('div', 'mn-detail-panel__skeleton mn-detail-panel__skeleton--title');
    section.appendChild(title);
    for (let f = 0; f < 4; f++) {
      const field = createElement('div', 'mn-detail-panel__field');
      field.appendChild(createElement('span', 'mn-detail-panel__skeleton mn-detail-panel__skeleton--label'));
      field.appendChild(createElement('span', 'mn-detail-panel__skeleton mn-detail-panel__skeleton--value'));
      section.appendChild(field);
    }
    body.appendChild(section);
  }
}

/** Validate a single field value against its validation rules. */
export function validateField(value: unknown, field: DetailField): string | null {
  if (!field.validate) return null;
  const rules = field.validate;
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${field.label} is required`;
  }
  if (rules.min !== undefined && Number(value) < rules.min) {
    return `${field.label} must be at least ${rules.min}`;
  }
  if (rules.max !== undefined && Number(value) > rules.max) {
    return `${field.label} must be at most ${rules.max}`;
  }
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `${field.label} must be ${rules.maxLength} characters or less`;
  }
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return rules.patternMessage ?? `${field.label} has an invalid format`;
  }
  if (rules.custom) return rules.custom(value);
  return null;
}

/** Build the full detail panel DOM structure inside a container. */
export function buildDOM(
  container: HTMLElement,
  opts: DetailPanelOptions,
  activeTab: string | null,
  onTabClick: (tab: string) => void,
): DetailPanelDOM {
  container.innerHTML = '';
  const isInline = opts.mode === 'inline';
  container.classList.add('mn-detail-panel');
  if (isInline) container.classList.add('mn-detail-panel--inline');

  /* Inline mode: hidden backdrop; overlay mode: inserted before container */
  const backdrop = createElement('div', 'mn-detail-panel__backdrop');
  if (isInline) backdrop.style.display = 'none';
  else container.parentNode!.insertBefore(backdrop, container);

  const header = createElement('div', 'mn-detail-panel__header');

  /* Parent back-link above title */
  if (opts.parentLink) {
    const back = createElement('button', 'mn-detail__back');
    back.type = 'button';
    back.textContent = '\u2190 ' + opts.parentLink.label;
    back.addEventListener('click', () => opts.parentLink!.onClick());
    header.appendChild(back);
  }

  const titleRow = createElement('div', 'mn-detail-panel__title-row');
  const titleEl = createElement('div', 'mn-detail-panel__title');
  titleEl.textContent = opts.title ?? '';
  titleRow.appendChild(titleEl);

  /* External link buttons after title */
  if (opts.externalLinks?.length) {
    for (const link of opts.externalLinks) {
      const a = document.createElement('a');
      a.className = 'mn-detail__ext-link';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = link.label;
      a.setAttribute('aria-label', link.label);
      a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
      titleRow.appendChild(a);
    }
  }
  header.appendChild(titleRow);

  const headerActions = createElement('div', 'mn-detail-panel__header-actions');
  const editBtn = createElement('button', 'mn-detail-panel__action-btn mn-detail-panel__edit-btn');
  editBtn.textContent = 'Edit';
  editBtn.style.display = opts.editable !== false ? '' : 'none';
  const saveBtn = createElement('button', 'mn-detail-panel__action-btn mn-detail-panel__save-btn');
  saveBtn.textContent = 'Save';
  saveBtn.style.display = 'none';
  const cancelBtn = createElement('button', 'mn-detail-panel__action-btn mn-detail-panel__cancel-btn');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.display = 'none';

  const closeBtn = createElement('button', 'mn-detail-panel__close');
  closeBtn.innerHTML = '\u2715';
  closeBtn.title = 'Close panel';

  headerActions.append(editBtn, saveBtn, cancelBtn, closeBtn);
  header.appendChild(headerActions);
  container.appendChild(header);

  let tabBar: HTMLElement | null = null;
  if (opts.tabs && opts.tabs.length > 1) {
    tabBar = createElement('div', 'mn-detail-panel__tabs');
    for (const tab of opts.tabs) {
      const btn = createElement('button', 'mn-detail-panel__tab');
      btn.textContent = tab;
      btn.dataset.tab = tab;
      if (tab === activeTab) btn.classList.add('mn-detail-panel__tab--active');
      btn.addEventListener('click', () => onTabClick(tab));
      tabBar.appendChild(btn);
    }
    container.appendChild(tabBar);
  }

  const body = createElement('div', 'mn-detail-panel__body');
  container.appendChild(body);

  const footer = createElement('div', 'mn-detail-panel__footer');
  if (opts.footerActions) {
    for (const action of opts.footerActions) {
      const btn = createElement('button', `mn-btn mn-btn--sm${action.ghost ? ' mn-btn--ghost' : ''}`);
      btn.textContent = action.label;
      if (action.onClick) btn.addEventListener('click', action.onClick);
      footer.appendChild(btn);
    }
  }
  container.appendChild(footer);

  return { backdrop, titleEl, editBtn, saveBtn, cancelBtn, closeBtn, tabBar, body, footer };
}

/** Render fields into the panel body based on current state. */
export function renderBody(
  body: HTMLElement,
  state: DetailPanelState,
  opts: DetailPanelOptions,
): void {
  body.innerHTML = '';
  state.errors = {};

  /* Custom tab renderer takes priority */
  if (state.activeTab && opts.tabRenderers?.[state.activeTab]) {
    opts.tabRenderers[state.activeTab](body, opts.data);
    return;
  }

  if (state.activeTab && opts.subComponents?.[state.activeTab]) {
    opts.subComponents[state.activeTab](body, state.data, {
      isEditing: state.isEditing,
      changes: state.changes,
    });
    return;
  }

  const sections = state.schema.filter(
    (s) => !s.tab || s.tab === state.activeTab || !state.activeTab,
  );

  for (const section of sections) {
    const sectionEl = createElement('div', 'mn-detail-panel__section');
    if (section.section) {
      const title = createElement('div', 'mn-detail-panel__section-title');
      title.textContent = section.section;
      sectionEl.appendChild(title);
    }

    for (const field of section.fields ?? []) {
      const fieldEl = createElement('div', 'mn-detail-panel__field');
      if (field.type === 'textarea' || field.type === 'custom') {
        fieldEl.classList.add('mn-detail-panel__field--block');
      }

      const label = createElement('span', 'mn-detail-panel__field-label');
      label.textContent = field.label;
      fieldEl.appendChild(label);

      const val = Object.prototype.hasOwnProperty.call(state.changes, field.key)
        ? state.changes[field.key]
        : state.data[field.key];

      if (state.isEditing && field.type !== 'readonly' && field.editable !== false) {
        const editor = editors[field.type ?? 'text'] ?? editors.text;
        const editorEl = editor(val, field, (newVal: unknown) => {
          state.changes[field.key] = newVal;
          state.isDirty = true;
          const err = validateField(newVal, field);
          const errEl = fieldEl.querySelector('.mn-detail-panel__field-error');
          if (err) {
            state.errors[field.key] = err;
            if (!errEl) {
              const newErr = createElement('div', 'mn-detail-panel__field-error');
              newErr.textContent = err;
              fieldEl.appendChild(newErr);
            } else {
              errEl.textContent = err;
            }
            fieldEl.classList.add('mn-detail-panel__field--error');
          } else {
            delete state.errors[field.key];
            if (errEl) errEl.remove();
            fieldEl.classList.remove('mn-detail-panel__field--error');
          }
        });
        fieldEl.appendChild(editorEl);
      } else {
        const renderer = renderers[field.type ?? 'text'] ?? renderers.text;
        fieldEl.appendChild(renderer(val, field, state.data));
      }
      sectionEl.appendChild(fieldEl);
    }
    body.appendChild(sectionEl);
  }
}
