// src/ts/facet-workbench-render.ts
function buildWorkbenchShell(container) {
  container.innerHTML = "";
  const root = document.createElement("div");
  root.className = "mn-facet-workbench";
  const list = document.createElement("div");
  list.className = "mn-facet-list";
  const chips = document.createElement("div");
  chips.className = "mn-filter-chips mn-facet-chips";
  root.append(list, chips);
  container.appendChild(root);
  return { root, list, chips };
}
function createFacetSection(facet) {
  const section = document.createElement("section");
  section.className = "mn-facet";
  section.dataset.facetId = facet.id;
  const header = document.createElement("button");
  header.type = "button";
  header.className = "mn-facet__header";
  header.setAttribute("aria-expanded", "true");
  const title = document.createElement("span");
  title.className = "mn-facet__title";
  title.textContent = facet.label;
  const count = document.createElement("span");
  count.className = "mn-facet__count";
  const chevron = document.createElement("span");
  chevron.className = "mn-facet__chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "\u25BE";
  header.append(title, count, chevron);
  const body = document.createElement("div");
  body.className = "mn-facet__body";
  body.dataset.type = facet.type;
  section.append(header, body);
  return { section, header, body, count };
}
function setFacetCollapsed(refs, collapsed) {
  refs.section.classList.toggle("mn-facet--collapsed", collapsed);
  refs.header.setAttribute("aria-expanded", collapsed ? "false" : "true");
  refs.body.hidden = collapsed;
}
function renderLoading(body) {
  body.innerHTML = '<div class="mn-facet__loading">Loading\u2026</div>';
}
function renderOptionRows(body, facet, options, selected) {
  if (facet.type !== "select" && facet.type !== "multi-select" && facet.type !== "search") return;
  body.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "mn-facet__options";
  const isSingle = facet.type === "select";
  const visible = facet.type === "search" ? options : options;
  visible.forEach((option) => {
    const row = document.createElement("label");
    row.className = "mn-facet__option";
    const input = document.createElement("input");
    input.className = "mn-facet__option-input";
    input.type = isSingle ? "radio" : "checkbox";
    input.name = `mn-facet-${facet.id}`;
    input.value = option.id;
    input.checked = selected.includes(option.id);
    const text = document.createElement("span");
    text.className = "mn-facet__option-label";
    text.textContent = option.count == null ? option.label : `${option.label} (${option.count})`;
    row.append(input, text);
    wrap.appendChild(row);
  });
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "mn-facet__empty";
    empty.textContent = "No options";
    body.appendChild(empty);
    return;
  }
  body.appendChild(wrap);
}
function renderSearchControls(body, query = "") {
  const search = document.createElement("input");
  search.type = "search";
  search.value = query;
  search.placeholder = "Search options";
  search.className = "mn-facet__search-input";
  body.prepend(search);
  return search;
}
function renderDateRange(body, selected) {
  body.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "mn-facet__date-range";
  const from = document.createElement("input");
  from.type = "date";
  from.className = "mn-facet__date mn-facet__date--from";
  from.value = selected[0] || "";
  const to = document.createElement("input");
  to.type = "date";
  to.className = "mn-facet__date mn-facet__date--to";
  to.value = selected[1] || "";
  wrap.append(from, to);
  body.appendChild(wrap);
  return { from, to };
}
function renderBoolean(body, active) {
  body.innerHTML = "";
  const label = document.createElement("label");
  label.className = "mn-facet__boolean";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "mn-facet__boolean-input";
  input.checked = active;
  const text = document.createElement("span");
  text.className = "mn-facet__boolean-label";
  text.textContent = "Enabled";
  label.append(input, text);
  body.appendChild(label);
  return input;
}
function renderActiveChips(chipsContainer, facets, filters, onRemove) {
  chipsContainer.innerHTML = "";
  const names = new Map(facets.map((facet) => [facet.id, facet.label]));
  filters.forEach((values, facetId) => {
    values.forEach((value) => {
      const chip = document.createElement("span");
      chip.className = "mn-filter-chip mn-facet-chip";
      const label = document.createElement("span");
      label.className = "mn-filter-chip__label mn-facet-chip__label";
      label.textContent = `${names.get(facetId) || facetId}: ${value}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mn-filter-chip__remove mn-facet-chip__remove";
      remove.textContent = "\xD7";
      remove.addEventListener("click", () => onRemove(facetId, value));
      chip.append(label, remove);
      chipsContainer.appendChild(chip);
    });
  });
}
function setFacetDisabled(section, disabled) {
  section.classList.toggle("mn-facet--disabled", disabled);
  section.querySelectorAll("input, button, select, textarea").forEach((el) => {
    if (!el.classList.contains("mn-facet__header")) el.disabled = disabled;
  });
}

// src/ts/facet-workbench-keyboard.ts
function isOptionElement(el) {
  return el.classList.contains("mn-facet__option-input") || el.classList.contains("mn-facet__option-button");
}
function focusOption(current, direction) {
  const body = current.closest(".mn-facet__body");
  if (!body) return;
  const options = Array.from(body.querySelectorAll(".mn-facet__option-input, .mn-facet__option-button"));
  if (!options.length) return;
  const idx = options.indexOf(current);
  const next = idx < 0 ? options[0] : options[(idx + direction + options.length) % options.length];
  next.focus();
}
function closeFacetFromNode(node) {
  const section = node.closest(".mn-facet");
  if (!section) return;
  section.classList.add("mn-facet--collapsed");
  const header = section.querySelector(".mn-facet__header");
  const body = section.querySelector(".mn-facet__body");
  if (header && body) {
    header.setAttribute("aria-expanded", "false");
    body.hidden = true;
    header.focus();
  }
}
function bindFacetWorkbenchKeyboard(root) {
  const onKeyDown = (event) => {
    const target = event.target;
    if (!target) return;
    if (target.classList.contains("mn-facet__header") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      target.click();
      return;
    }
    if (!isOptionElement(target)) {
      if (event.key === "Escape") closeFacetFromNode(target);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(target, 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(target, -1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) {
        target.checked = target.type === "radio" ? true : !target.checked;
        target.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        target.click();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeFacetFromNode(target);
    }
  };
  root.addEventListener("keydown", onKeyDown);
  return {
    destroy() {
      root.removeEventListener("keydown", onKeyDown);
    }
  };
}

// src/ts/facet-workbench.ts
var FacetWorkbench = class {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.facets = /* @__PURE__ */ new Map();
    this.loadedOptions = /* @__PURE__ */ new Map();
    this.filters = /* @__PURE__ */ new Map();
    this.searchTimers = /* @__PURE__ */ new Map();
    this.presets = (options.presets || []).map((preset) => ({ name: preset.name, filters: cloneFilters(preset.filters) }));
    const shell = buildWorkbenchShell(container);
    this.list = shell.list;
    this.chips = shell.chips;
    this.keyboard = bindFacetWorkbenchKeyboard(shell.root);
    this.renderSkeleton();
    void this.loadFacetData();
  }
  getActiveFilters() {
    return cloneFilters(this.filters);
  }
  clearAll() {
    this.filters.clear();
    this.syncUiFromFilters();
    this.commitFilters();
  }
  clearFacet(id) {
    this.filters.delete(id);
    this.syncUiFromFilters();
    this.commitFilters();
  }
  savePreset(name) {
    const preset = { name, filters: this.getActiveFilters() };
    const idx = this.presets.findIndex((item) => item.name === name);
    if (idx >= 0) this.presets[idx] = preset;
    else this.presets.push(preset);
    return { name, filters: cloneFilters(preset.filters) };
  }
  loadPreset(name) {
    const preset = this.presets.find((item) => item.name === name);
    if (!preset) return;
    this.filters.clear();
    preset.filters.forEach((values, key) => this.filters.set(key, [...values]));
    this.syncUiFromFilters();
    this.commitFilters();
  }
  listPresets() {
    return this.presets.map((item) => ({ name: item.name, filters: cloneFilters(item.filters) }));
  }
  destroy() {
    this.searchTimers.forEach((timer) => window.clearTimeout(timer));
    this.keyboard.destroy();
    this.container.innerHTML = "";
  }
  renderSkeleton() {
    this.options.facets.forEach((facet) => {
      const refs = createFacetSection(facet);
      this.facets.set(facet.id, refs);
      refs.header.addEventListener("click", () => {
        setFacetCollapsed(refs, !refs.section.classList.contains("mn-facet--collapsed"));
      });
      renderLoading(refs.body);
      this.list.appendChild(refs.section);
    });
    this.refreshChips();
  }
  async loadFacetData() {
    await Promise.all(this.options.facets.map(async (facet) => {
      const refs = this.facets.get(facet.id);
      if (!refs) return;
      const needsData = facet.type === "select" || facet.type === "multi-select" || facet.type === "search";
      this.loadedOptions.set(facet.id, needsData ? await facet.dataProvider() : []);
      this.renderFacetBody(facet, refs);
    }));
    this.applyExclusions();
    this.refreshChips();
  }
  renderFacetBody(facet, refs) {
    const selected = this.filters.get(facet.id) || [];
    if (facet.type === "date-range") {
      const { from, to } = renderDateRange(refs.body, selected);
      const onChange = () => this.setFacetValues(facet.id, [from.value, to.value].filter(Boolean));
      from.addEventListener("change", onChange);
      to.addEventListener("change", onChange);
      return;
    }
    if (facet.type === "boolean") {
      const control = renderBoolean(refs.body, selected.includes("true"));
      control.addEventListener("change", () => this.setFacetValues(facet.id, control.checked ? ["true"] : []));
      return;
    }
    const options = this.loadedOptions.get(facet.id) || [];
    renderOptionRows(refs.body, facet, options, selected);
    if (facet.type === "search") {
      const search = renderSearchControls(refs.body);
      search.addEventListener("input", () => {
        const prior = this.searchTimers.get(facet.id);
        if (prior) window.clearTimeout(prior);
        const timer = window.setTimeout(() => {
          const q = search.value.trim().toLowerCase();
          renderOptionRows(refs.body, facet, options.filter((opt) => opt.label.toLowerCase().includes(q)), this.filters.get(facet.id) || []);
          refs.body.prepend(search);
          this.attachOptionChange(facet);
        }, 180);
        this.searchTimers.set(facet.id, timer);
      });
    }
    this.attachOptionChange(facet);
  }
  attachOptionChange(facet) {
    const refs = this.facets.get(facet.id);
    if (!refs) return;
    refs.body.querySelectorAll(".mn-facet__option-input").forEach((input) => {
      input.addEventListener("change", () => {
        const checked = Array.from(refs.body.querySelectorAll(".mn-facet__option-input:checked")).map((n) => n.value);
        this.setFacetValues(facet.id, facet.type === "select" ? checked.slice(0, 1) : checked);
      });
    });
  }
  removeChipValue(facetId, value) {
    this.setFacetValues(facetId, (this.filters.get(facetId) || []).filter((item) => item !== value));
  }
  setFacetValues(id, values) {
    if (values.length) this.filters.set(id, [...values]);
    else this.filters.delete(id);
    this.syncUiFromFilters();
    this.commitFilters();
  }
  syncUiFromFilters() {
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (refs) this.renderFacetBody(facet, refs);
    });
    this.applyExclusions();
    this.refreshChips();
  }
  applyExclusions() {
    const disabled = /* @__PURE__ */ new Set();
    this.options.facets.forEach((facet) => {
      if (this.filters.get(facet.id)?.length) facet.exclusionRules?.excludes.forEach((id) => disabled.add(id));
    });
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (refs) setFacetDisabled(refs.section, disabled.has(facet.id));
    });
  }
  refreshChips() {
    renderActiveChips(this.chips, this.options.facets, this.filters, (facetId, value) => this.removeChipValue(facetId, value));
  }
  commitFilters() {
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (!refs || !facet.countProvider) return;
      void facet.countProvider(this.getActiveFilters()).then((count) => {
        refs.count.textContent = Number.isFinite(count) ? `${count}` : "";
      }).catch(() => {
        refs.count.textContent = "";
      });
    });
    this.options.onFilterChange?.(this.getActiveFilters());
  }
};
function cloneFilters(source) {
  const out = /* @__PURE__ */ new Map();
  source.forEach((values, key) => out.set(key, [...values]));
  return out;
}

// src/wc/mn-facet-workbench.js
var MnFacetWorkbench = class extends HTMLElement {
  static get observedAttributes() {
    return [];
  }
  constructor() {
    super();
    this._facets = [];
    this._presets = [];
    this._ctrl = null;
  }
  connectedCallback() {
    this._mount();
  }
  disconnectedCallback() {
    this._ctrl?.destroy();
    this._ctrl = null;
  }
  get facets() {
    return this._facets;
  }
  set facets(value) {
    this._facets = Array.isArray(value) ? value : [];
    if (this.isConnected) this._mount();
  }
  get presets() {
    return this._presets;
  }
  set presets(value) {
    this._presets = Array.isArray(value) ? value : [];
    if (this.isConnected) this._mount();
  }
  _mount() {
    this._ctrl?.destroy();
    this._ctrl = new FacetWorkbench(this, {
      facets: this._facets,
      presets: this._presets,
      onFilterChange: (filters) => {
        this.dispatchEvent(new CustomEvent("mn-filter-change", {
          detail: { filters },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
};
customElements.define("mn-facet-workbench", MnFacetWorkbench);
//# sourceMappingURL=mn-facet-workbench.js.map
