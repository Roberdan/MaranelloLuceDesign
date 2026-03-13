/**
 * Maranello Luce Design - Detail panel controller
 * Creates and manages a detail panel instance with edit/save/close lifecycle.
 */

import type { DetailPanelOptions, DetailPanelState, DetailPanelController } from './core/types';
import { buildDOM, renderBody, showToast, renderSkeleton } from './detail-panel-ui';

/** Create a detail panel inside the given container element. */
export function createDetailPanel(
  container: HTMLElement,
  opts: DetailPanelOptions = {},
): DetailPanelController {
  const state: DetailPanelState = {
    activeTab: opts.tabs?.[0] ?? null,
    isEditing: false,
    isSaving: false,
    changes: {},
    errors: {},
    isDirty: false,
    isOpen: false,
    data: opts.data ?? {},
    schema: opts.schema ?? [],
  };

  const dom = buildDOM(container, opts, state.activeTab, (tab) => {
    state.activeTab = tab;
    if (dom.tabBar) {
      dom.tabBar.querySelectorAll('.mn-detail-panel__tab').forEach((btn) => {
        btn.classList.toggle('mn-detail-panel__tab--active', (btn as HTMLElement).dataset.tab === tab);
      });
    }
    renderBody(dom.body, state, opts);
  });

  renderBody(dom.body, state, opts);

  dom.closeBtn.addEventListener('click', () => { doClose(); opts.onClose?.(); });
  dom.backdrop.addEventListener('click', () => { doClose(); opts.onClose?.(); });
  dom.editBtn.addEventListener('click', () => startEdit());
  dom.cancelBtn.addEventListener('click', () => cancelEdit());
  dom.saveBtn.addEventListener('click', () => save());

  function startEdit(): void {
    state.isEditing = true;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = 'none';
    dom.saveBtn.style.display = '';
    dom.cancelBtn.style.display = '';
    renderBody(dom.body, state, opts);
  }

  function cancelEdit(): void {
    state.isEditing = false;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = '';
    dom.saveBtn.style.display = 'none';
    dom.cancelBtn.style.display = 'none';
    renderBody(dom.body, state, opts);
  }

  function save(): void {
    if (Object.keys(state.errors).length) return;
    const payload: Record<string, unknown> = {};
    for (const k in state.changes) payload[k] = state.changes[k];
    opts.onSave?.(payload, state.data);
    cancelEdit();
  }

  function doClose(): void {
    state.isOpen = false;
    container.classList.remove('mn-detail-panel--open');
    const bd = container.previousElementSibling;
    if (bd && bd.classList.contains('mn-detail-panel__backdrop')) {
      bd.classList.remove('mn-detail-panel__backdrop--visible');
    }
  }

  function doOpen(): void {
    state.isOpen = true;
    container.classList.add('mn-detail-panel--open');
    const bd = container.previousElementSibling;
    if (bd && bd.classList.contains('mn-detail-panel__backdrop')) {
      bd.classList.add('mn-detail-panel__backdrop--visible');
    }
  }

  return {
    open: doOpen,
    close: doClose,
    isOpen: () => state.isOpen,
    startEdit,
    cancelEdit,
    save,
    isEditing: () => state.isEditing,
    isDirty: () => state.isDirty,
    setData(newData) {
      state.data = newData;
      renderBody(dom.body, state, opts);
    },
    getData: () => ({ ...state.data }),
    setTitle(t) { dom.titleEl.textContent = t; },
    showLoading() { renderSkeleton(dom.body); },
    setTab(tab) {
      state.activeTab = tab;
      if (dom.tabBar) {
        dom.tabBar.querySelectorAll('.mn-detail-panel__tab').forEach((btn) => {
          btn.classList.toggle('mn-detail-panel__tab--active', (btn as HTMLElement).dataset.tab === tab);
        });
      }
      renderBody(dom.body, state, opts);
    },
    render() { renderBody(dom.body, state, opts); },
    showToast(msg, type) { showToast(container, msg, type); },
    destroy() { container.innerHTML = ''; },
  };
}
