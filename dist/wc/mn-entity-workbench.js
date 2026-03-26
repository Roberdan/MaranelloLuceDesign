// src/ts/entity-workbench-backstack.ts
var BackStack = class {
  constructor() {
    this.entries = [];
  }
  push(entry) {
    this.entries.push(entry);
  }
  pop() {
    return this.entries.pop();
  }
  canGoBack() {
    return this.entries.length > 0;
  }
  depth() {
    return this.entries.length;
  }
  path() {
    return this.entries;
  }
};

// src/ts/core/sanitize.ts
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
var RGB_RE = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
var HSL_RE = /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
var CSS_VAR_RE = /^var\(--[\w-]+(?:\s*,\s*[^)]+)?\)$/;
var CSS_KEYWORDS = /* @__PURE__ */ new Set([
  "transparent",
  "currentColor",
  "currentcolor",
  "inherit",
  "initial",
  "unset",
  "revert"
]);
var NAMED_COLORS = /* @__PURE__ */ new Set([
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
]);
function isValidColor(val) {
  const trimmed = val.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (lower.includes("javascript:")) return false;
  if (lower.includes("expression(")) return false;
  if (lower.includes(";")) return false;
  if (lower.includes("url(")) return false;
  if (HEX_RE.test(trimmed)) return true;
  if (RGB_RE.test(trimmed)) return true;
  if (HSL_RE.test(trimmed)) return true;
  if (CSS_VAR_RE.test(trimmed)) return true;
  if (CSS_KEYWORDS.has(lower)) return true;
  if (NAMED_COLORS.has(lower)) return true;
  return false;
}

// src/ts/async-select.ts
var AsyncSelect = class {
  constructor(container, options) {
    this.container = container;
    this.listboxId = `mn-async-select-listbox-${Math.random().toString(36).slice(2, 8)}`;
    this.items = [];
    this.activeIndex = -1;
    this.openState = false;
    this.requestId = 0;
    this.destroyed = false;
    this.provider = options.provider;
    this.onSelect = options.onSelect;
    this.debounceMs = options.debounceMs ?? 300;
    this.minChars = options.minChars ?? 1;
    this.container.innerHTML = "";
    this.container.classList.add("mn-async-select");
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = "mn-async-select__input";
    this.input.placeholder = options.placeholder ?? "Search...";
    this.input.setAttribute("role", "combobox");
    this.input.setAttribute("aria-autocomplete", "list");
    this.input.setAttribute("aria-expanded", "false");
    this.input.setAttribute("aria-controls", this.listboxId);
    this.dropdown = document.createElement("div");
    this.dropdown.className = "mn-async-select__dropdown";
    this.dropdown.id = this.listboxId;
    this.dropdown.setAttribute("role", "listbox");
    this.dropdown.hidden = true;
    this.container.append(this.input, this.dropdown);
    this.onInput = () => this.scheduleSearch();
    this.onKeyDown = (e) => this.handleKeyDown(e);
    this.onDocClick = (e) => {
      if (!this.container.contains(e.target)) this.close();
    };
    this.input.addEventListener("input", this.onInput);
    this.input.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("click", this.onDocClick);
  }
  open() {
    if (this.openState) return;
    this.openState = true;
    this.dropdown.hidden = false;
    this.input.setAttribute("aria-expanded", "true");
  }
  close() {
    this.openState = false;
    this.dropdown.hidden = true;
    this.activeIndex = -1;
    this.input.setAttribute("aria-expanded", "false");
    this.input.removeAttribute("aria-activedescendant");
  }
  clear() {
    this.selected = void 0;
    this.items = [];
    this.input.value = "";
    this.dropdown.innerHTML = "";
    this.close();
  }
  getValue() {
    return this.selected;
  }
  setProvider(provider) {
    this.provider = provider;
    this.clear();
  }
  destroy() {
    this.destroyed = true;
    if (this.timer) window.clearTimeout(this.timer);
    document.removeEventListener("click", this.onDocClick);
    this.input.removeEventListener("input", this.onInput);
    this.input.removeEventListener("keydown", this.onKeyDown);
    this.container.innerHTML = "";
    this.container.classList.remove("mn-async-select");
  }
  scheduleSearch() {
    if (this.timer) window.clearTimeout(this.timer);
    const query = this.input.value.trim();
    if (query.length < this.minChars) {
      this.requestId++;
      this.items = [];
      this.dropdown.innerHTML = "";
      this.close();
      return;
    }
    this.timer = window.setTimeout(() => {
      void this.fetchResults(query);
    }, this.debounceMs);
  }
  async fetchResults(query) {
    const req = ++this.requestId;
    this.showLoading();
    try {
      const results = await this.provider.search(query);
      if (this.destroyed || req !== this.requestId) return;
      this.items = results;
      this.renderItems();
    } catch {
      if (!this.destroyed && req === this.requestId) this.close();
    }
  }
  showLoading() {
    this.open();
    this.dropdown.innerHTML = '<div class="mn-async-select__loading"><span class="mn-async-select__spinner"></span>Loading...</div>';
  }
  renderItems() {
    this.dropdown.innerHTML = "";
    this.activeIndex = -1;
    this.input.removeAttribute("aria-activedescendant");
    if (!this.items.length) return this.close();
    this.open();
    this.items.forEach((item, index) => {
      const opt = document.createElement("div");
      const id = this.provider.getId?.(item) ?? String(index);
      opt.id = `${this.listboxId}-opt-${escapeHtml(id)}`;
      opt.className = "mn-async-select__item";
      opt.setAttribute("role", "option");
      opt.setAttribute("aria-selected", "false");
      opt.innerHTML = escapeHtml(this.provider.renderItem?.(item) ?? String(item));
      opt.addEventListener("mouseenter", () => this.setActive(index));
      opt.addEventListener("mousedown", (e) => e.preventDefault());
      opt.addEventListener("click", () => this.selectIndex(index));
      this.dropdown.appendChild(opt);
    });
  }
  setActive(index) {
    if (!this.items.length) return;
    const len = this.items.length;
    this.activeIndex = (index % len + len) % len;
    const options = this.dropdown.querySelectorAll(".mn-async-select__item");
    options.forEach((el, i) => {
      const active2 = i === this.activeIndex;
      el.classList.toggle("mn-async-select__item--active", active2);
      el.setAttribute("aria-selected", active2 ? "true" : "false");
    });
    const active = options[this.activeIndex];
    if (!active) return;
    this.input.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  }
  selectIndex(index) {
    const item = this.items[index];
    if (!item) return;
    this.selected = item;
    this.input.value = this.provider.getLabel?.(item) ?? String(item);
    this.onSelect?.(item);
    this.close();
  }
  handleKeyDown(e) {
    if (e.key === "Escape" || e.key === "Tab") return this.close();
    if (!this.items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      return this.setActive(this.activeIndex + 1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      return this.setActive(this.activeIndex <= 0 ? this.items.length - 1 : this.activeIndex - 1);
    }
    if (e.key === "Enter" && this.activeIndex >= 0) {
      e.preventDefault();
      this.selectIndex(this.activeIndex);
    }
  }
};

// src/ts/core/utils.ts
function createElement(tag, className, attrs) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (key === "text") el.textContent = val;
      else el.setAttribute(key, val);
    }
  }
  return el;
}

// src/ts/detail-panel-renderers.ts
var DASH = "\u2014";
function getInitials(name) {
  if (!name) return "?";
  return name.split(/[\s.]+/).map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join("");
}
function formatDateSimple(s) {
  if (!s) return "";
  const str = String(s);
  const parts = str.split("-");
  if (parts.length < 3) return str;
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return `${parseInt(parts[2], 10)} ${MONTHS[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}
function updateStatusSelectColor(sel, colors) {
  if (!colors) return;
  const c = colors[sel.value];
  if (c) {
    sel.style.borderColor = c;
    sel.style.color = c;
  } else {
    sel.style.borderColor = "";
    sel.style.color = "";
  }
}
function renderPersonResults(container, items, input, onChange) {
  container.innerHTML = "";
  if (!items || !items.length) {
    container.classList.remove("mn-detail-panel__person-results--open");
    return;
  }
  items.forEach((item) => {
    const row = createElement("div", "mn-detail-panel__person-result");
    const itemName = typeof item === "string" ? item : item.name;
    const avatar = createElement("span", "mn-detail-panel__avatar mn-detail-panel__avatar--sm");
    avatar.textContent = getInitials(itemName);
    row.appendChild(avatar);
    const nameSpan = createElement("span");
    nameSpan.textContent = itemName;
    row.appendChild(nameSpan);
    if (typeof item !== "string" && item.email) {
      const email = createElement("span", "mn-detail-panel__person-email");
      email.textContent = item.email;
      row.appendChild(email);
    }
    row.addEventListener("mousedown", (e) => {
      e.preventDefault();
      input.value = itemName;
      onChange(itemName);
      container.classList.remove("mn-detail-panel__person-results--open");
    });
    container.appendChild(row);
  });
  container.classList.add("mn-detail-panel__person-results--open");
}
var renderers = {
  text(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  number(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--mono");
    span.textContent = val !== void 0 && val !== null ? String(val) : DASH;
    return span;
  },
  date(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? formatDateSimple(val) : DASH;
    return span;
  },
  badge(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const color = field.badgeColors?.[String(val)] ?? "";
    if (color && isValidColor(color)) span.style.background = color;
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  status(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const colors = field.statusColors ?? {};
    const c = colors[String(val)];
    if (c && isValidColor(c)) {
      span.style.background = c;
      span.style.color = "#fff";
    }
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  person(val) {
    const wrap = createElement("span", "mn-detail-panel__field-value mn-detail-panel__person");
    if (val) {
      const avatar = createElement("span", "mn-detail-panel__avatar");
      avatar.textContent = getInitials(String(val));
      wrap.appendChild(avatar);
      const name = createElement("span");
      name.textContent = String(val);
      wrap.appendChild(name);
    } else {
      wrap.textContent = DASH;
    }
    return wrap;
  },
  score(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--mono");
    span.textContent = val !== void 0 && val !== null ? String(val) : DASH;
    return span;
  },
  select(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  textarea(val) {
    const div = createElement("div", "mn-detail-panel__field-value mn-detail-panel__field-value--block");
    div.textContent = val ? String(val) : DASH;
    return div;
  },
  country(val) {
    const wrap = createElement("span", "mn-detail-panel__field-value mn-detail-panel__country");
    if (val) {
      const str = String(val);
      const code = createElement("span", "mn-country__code");
      code.textContent = str.substring(0, 2).toUpperCase();
      wrap.appendChild(code);
      const name = createElement("span");
      name.textContent = str;
      wrap.appendChild(name);
    } else {
      wrap.textContent = DASH;
    }
    return wrap;
  },
  readonly(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--muted");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  custom(val, field, data) {
    if (field.render) return field.render(val, data);
    return renderers.text(val, field, data);
  }
};

// src/ts/detail-panel-editors.ts
var datePickerFn = null;
var editors = {
  text(val, field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.maxLength) input.maxLength = field.maxLength;
    input.addEventListener("input", () => onChange(input.value));
    return input;
  },
  number(val, field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "number";
    input.value = val !== void 0 && val !== null ? String(val) : "";
    if (field.min !== void 0) input.min = String(field.min);
    if (field.max !== void 0) input.max = String(field.max);
    if (field.step) input.step = String(field.step);
    input.addEventListener("input", () => onChange(parseFloat(input.value) || 0));
    return input;
  },
  date(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__date-wrap");
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "YYYY-MM-DD";
    wrap.appendChild(input);
    const calBtn = createElement("button", "mn-detail-panel__cal-btn");
    calBtn.type = "button";
    calBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    calBtn.title = "Open calendar";
    wrap.appendChild(calBtn);
    input.addEventListener("input", () => onChange(input.value));
    calBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (datePickerFn) {
        datePickerFn(wrap, {
          value: input.value,
          min: field.min != null ? String(field.min) : void 0,
          max: field.max != null ? String(field.max) : void 0,
          onSelect(dateStr) {
            input.value = dateStr;
            onChange(dateStr);
          }
        });
      }
    });
    return wrap;
  },
  select(val, field, onChange) {
    const sel = createElement("select", "mn-form-select mn-form-select--sm mn-detail-panel__edit-input");
    for (const opt of field.options ?? []) {
      const o = createElement("option");
      const optVal = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? "")) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  },
  status(val, field, onChange) {
    const sel = createElement(
      "select",
      "mn-form-select mn-form-select--sm mn-detail-panel__edit-input mn-detail-panel__status-select"
    );
    for (const opt of field.options ?? []) {
      const o = createElement("option");
      const optVal = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? "")) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => {
      updateStatusSelectColor(sel, field.statusColors);
      onChange(sel.value);
    });
    setTimeout(() => updateStatusSelectColor(sel, field.statusColors), 0);
    return sel;
  },
  country(val, _field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "Country name";
    input.addEventListener("input", () => onChange(input.value));
    return input;
  },
  person(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__person-edit");
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "Search people\u2026";
    wrap.appendChild(input);
    const results = createElement("div", "mn-detail-panel__person-results");
    wrap.appendChild(results);
    let debounceTimer = null;
    input.addEventListener("input", () => {
      onChange(input.value);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      const query = input.value.trim();
      const hasSearch = field.onSearch || field.searchFn;
      if (query.length < 2 || !hasSearch) {
        results.innerHTML = "";
        results.classList.remove("mn-detail-panel__person-results--open");
        return;
      }
      debounceTimer = setTimeout(() => {
        const res = field.searchFn ? field.searchFn(query) : field.onSearch(query);
        if (res && typeof res.then === "function") {
          res.then((items) => {
            renderPersonResults(results, items, input, (v) => onChange(v));
          });
        } else if (Array.isArray(res)) {
          renderPersonResults(results, res, input, (v) => onChange(v));
        }
      }, 300);
    });
    input.addEventListener("blur", () => {
      setTimeout(() => results.classList.remove("mn-detail-panel__person-results--open"), 200);
    });
    return wrap;
  },
  score(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__score-stepper");
    const btnMinus = createElement("button", "mn-detail-panel__score-btn");
    btnMinus.type = "button";
    btnMinus.textContent = "\u2212";
    const display = createElement("span", "mn-detail-panel__score-value");
    let current = parseInt(String(val ?? ""), 10) || (field.min ?? 0);
    display.textContent = String(current);
    const btnPlus = createElement("button", "mn-detail-panel__score-btn");
    btnPlus.type = "button";
    btnPlus.textContent = "+";
    function update(delta) {
      current = Math.max(field.min ?? 0, Math.min(field.max ?? 5, current + delta));
      display.textContent = String(current);
      onChange(current);
    }
    btnMinus.addEventListener("click", () => update(-1));
    btnPlus.addEventListener("click", () => update(1));
    wrap.appendChild(btnMinus);
    wrap.appendChild(display);
    wrap.appendChild(btnPlus);
    return wrap;
  },
  textarea(val, field, onChange) {
    const ta = createElement("textarea", "mn-form-textarea mn-form-textarea--sm mn-detail-panel__edit-textarea");
    ta.value = val != null ? String(val) : "";
    ta.rows = field.rows ?? 3;
    if (field.maxLength) ta.maxLength = field.maxLength;
    if (field.placeholder) ta.placeholder = field.placeholder;
    ta.addEventListener("input", () => onChange(ta.value));
    return ta;
  }
};

// src/ts/entity-workbench-render.ts
function renderWorkbench(ctx) {
  ctx.container.innerHTML = "";
  ctx.container.className = "mn-entity-workbench";
  ctx.container.append(
    renderBreadcrumb(ctx.breadcrumb),
    renderTabs(ctx),
    renderBody(ctx),
    renderActions(ctx)
  );
}
function switchTab(container, tabId, ctx) {
  const tabButtons = container.querySelectorAll(".mn-entity-workbench__tab");
  tabButtons.forEach((btn) => {
    btn.classList.toggle("mn-entity-workbench__tab--active", btn.dataset.tabId === tabId);
  });
  const panels = container.querySelectorAll(".mn-entity-workbench__tab-panel");
  panels.forEach((panel) => {
    panel.style.display = panel.dataset.tab === tabId ? "" : "none";
  });
  if (!ctx.renderedTabs.has(tabId)) {
    const panel = container.querySelector(`.mn-entity-workbench__tab-panel[data-tab="${tabId}"]`);
    const tab = ctx.schema.tabs.find((t) => t.id === tabId);
    if (panel && tab) {
      renderTabContent(panel, tab, ctx);
      ctx.renderedTabs.add(tabId);
    }
  }
}
function updateSaveState(container, isDirty) {
  const saveBtn = container.querySelector('[data-action="save"]');
  if (saveBtn) saveBtn.disabled = !isDirty;
}
function renderBreadcrumb(content) {
  const nav = document.createElement("nav");
  nav.className = "mn-entity-workbench__breadcrumb";
  nav.textContent = content;
  return nav;
}
function renderTabs(ctx) {
  const tabs = document.createElement("div");
  tabs.className = "mn-entity-workbench__tabs";
  ctx.schema.tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `mn-entity-workbench__tab${tab.id === ctx.activeTab ? " mn-entity-workbench__tab--active" : ""}`;
    btn.dataset.tabId = tab.id;
    btn.textContent = tab.label;
    btn.addEventListener("click", () => ctx.onTab(tab.id));
    tabs.appendChild(btn);
  });
  return tabs;
}
function renderBody(ctx) {
  const body = document.createElement("div");
  body.className = "mn-entity-workbench__body";
  ctx.schema.tabs.forEach((tab) => {
    const panel = document.createElement("div");
    panel.className = "mn-entity-workbench__tab-panel";
    panel.dataset.tab = tab.id;
    panel.style.display = tab.id === ctx.activeTab ? "" : "none";
    if (tab.id === ctx.activeTab) {
      renderTabContent(panel, tab, ctx);
      ctx.renderedTabs.add(tab.id);
    }
    body.appendChild(panel);
  });
  return body;
}
function renderTabContent(panel, tab, ctx) {
  tab.sections.forEach((section) => {
    const sec = document.createElement("section");
    sec.className = "mn-entity-workbench__section";
    if (section.title) {
      const title = document.createElement("h3");
      title.className = "mn-entity-workbench__section-title";
      title.textContent = section.title;
      sec.appendChild(title);
    }
    section.fields.forEach((field) => sec.appendChild(renderField(ctx, field)));
    panel.appendChild(sec);
  });
}
function renderField(ctx, field) {
  if (field.type === "group") return renderGroup(ctx, field);
  const row = document.createElement("div");
  row.className = "mn-field mn-entity-workbench__field";
  row.innerHTML = `<label class="mn-field__label">${field.label}${field.required ? " *" : ""}</label><div class="mn-entity-workbench__control"></div><div class="mn-field__error"></div>`;
  ctx.fieldEls.set(field.key, row);
  const control = row.querySelector(".mn-entity-workbench__control");
  const readOnly = !ctx.editable || field.readOnly || field.type === "computed";
  const value = field.type === "computed" ? field.compute?.(ctx.data) : getValue(ctx.data, field.key);
  if (field.type === "async-select" && !readOnly && field.provider) {
    const picker = new AsyncSelect(control, {
      provider: field.provider,
      onSelect: (item) => {
        const stored = field.provider?.getId ? field.provider.getId(item) : item;
        ctx.onField(field, stored);
      }
    });
    const input = control.querySelector(".mn-async-select__input");
    if (input && value != null) input.value = String(value);
    ctx.asyncControls.push(picker);
    return row;
  }
  if (!readOnly && editors[field.type]) {
    control.appendChild(editors[field.type](value, toDetail(field), (next) => ctx.onField(field, next)));
    return row;
  }
  control.appendChild((renderers[field.type] ?? renderers.readonly)(value, toDetail(field), ctx.data));
  return row;
}
function renderGroup(ctx, field) {
  const wrap = document.createElement("fieldset");
  wrap.className = "mn-entity-workbench__group";
  wrap.innerHTML = `<legend class="mn-entity-workbench__group-title">${field.label}</legend>`;
  (field.fields ?? []).forEach((sub) => wrap.appendChild(renderField(ctx, sub)));
  return wrap;
}
function renderActions(ctx) {
  const bar = document.createElement("div");
  bar.className = "mn-entity-workbench__actions";
  bar.append(makeAction("save", "Save", ctx.isDirty ? "" : "disabled", () => ctx.onSave()));
  bar.append(makeAction("cancel", "Cancel", "", () => ctx.onCancel()));
  ctx.actions.forEach((action) => {
    bar.append(makeAction(action.id, action.label, action.variant ?? "ghost", () => ctx.onAction(action.id)));
  });
  return bar;
}
function makeAction(id, label, variant, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `mn-btn mn-btn--sm mn-btn--${variant} mn-entity-workbench__action`;
  btn.dataset.action = id;
  btn.textContent = label;
  btn.disabled = variant === "disabled";
  btn.addEventListener("click", onClick);
  return btn;
}
function toDetail(field) {
  return {
    key: field.key,
    label: field.label,
    type: field.type,
    options: field.options?.options
  };
}
function getValue(data, key) {
  return key.split(".").reduce((acc, part) => acc?.[part], data);
}

// src/ts/forms-validate.ts
var validators = {
  required: (v) => v !== null && v !== void 0 && String(v).trim() !== "",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
  phone: (v) => /^[+]?[\d\s\-().]{7,20}$/.test(String(v).trim()),
  url: (v) => {
    try {
      new URL(String(v));
      return true;
    } catch {
      return false;
    }
  },
  minLength: (v, len) => String(v).length >= Number(len),
  maxLength: (v, len) => String(v).length <= Number(len),
  min: (v, min) => Number(v) >= Number(min),
  max: (v, max) => Number(v) <= Number(max),
  pattern: (v, regex) => new RegExp(regex ?? "").test(String(v)),
  match: (v, otherId) => {
    const other = otherId ? document.getElementById(otherId) : null;
    return Boolean(other) && String(v) === String(other?.value);
  }
};
var defaultMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  url: "Please enter a valid URL",
  minLength: "Must be at least {0} characters",
  maxLength: "Must be no more than {0} characters",
  min: "Must be at least {0}",
  max: "Must be no more than {0}",
  pattern: "Invalid format",
  match: "Fields do not match"
};
function getFieldInput(field) {
  return field.querySelector(
    ".mn-form-input, .mn-form-select, .mn-form-textarea"
  );
}
function validateField(field) {
  const input = getFieldInput(field);
  if (!input) return true;
  const rules = input.getAttribute("data-validate");
  if (!rules) return true;
  const value = input.value;
  const ruleList = rules.split(",").map((r) => r.trim());
  let valid = true;
  let errorMsg = "";
  for (const rule of ruleList) {
    const parts = rule.split(":");
    const ruleName = parts[0];
    const ruleParam = parts[1];
    const validator = validators[ruleName];
    if (validator && !validator(value, ruleParam)) {
      valid = false;
      const customMsg = input.getAttribute("data-msg-" + ruleName);
      errorMsg = customMsg ?? defaultMessages[ruleName] ?? "Invalid";
      if (ruleParam) errorMsg = errorMsg.replace("{0}", ruleParam);
      break;
    }
  }
  field.classList.remove("mn-field--error", "mn-field--success");
  const errorEl = field.querySelector(".mn-field__error");
  if (!valid) {
    field.classList.add("mn-field--error");
    input.setAttribute("aria-invalid", "true");
    if (errorEl) {
      if (!errorEl.id) {
        errorEl.id = "mn-err-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
      }
      errorEl.setAttribute("aria-live", "assertive");
      errorEl.textContent = errorMsg;
      const existing = (input.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
      if (!existing.includes(errorEl.id)) {
        input.setAttribute("aria-describedby", [...existing, errorEl.id].join(" "));
      }
    }
  } else {
    input.removeAttribute("aria-invalid");
    if (errorEl) {
      const tokens = (input.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(
        (t) => t && t !== errorEl.id
      );
      if (tokens.length > 0) {
        input.setAttribute("aria-describedby", tokens.join(" "));
      } else {
        input.removeAttribute("aria-describedby");
      }
      errorEl.textContent = "";
    }
    if (value.length > 0) field.classList.add("mn-field--success");
  }
  return valid;
}

// src/ts/entity-workbench.ts
var EntityWorkbench = class {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.stack = new BackStack();
    this.asyncControls = [];
    this.fieldEls = /* @__PURE__ */ new Map();
    this.renderedTabs = /* @__PURE__ */ new Set();
    this.activeTab = "";
    this.currentSchema = options.schema;
    this.baseData = clone(options.data);
    this.currentData = clone(options.data);
    this.activeTab = options.schema.tabs[0]?.id ?? "";
    this.rootLabel = getLabel(this.currentData, 1);
    this.render();
  }
  isDirty() {
    return Object.keys(this.getModifiedData()).length > 0;
  }
  canGoBack() {
    return this.stack.canGoBack();
  }
  getCurrentDepth() {
    return this.stack.depth() + 1;
  }
  getModifiedData() {
    const out = {};
    collectFields(this.currentSchema.tabs).forEach((field) => {
      if (field.type === "group" || field.type === "computed") return;
      const curr = getValue2(this.currentData, field.key);
      const base = getValue2(this.baseData, field.key);
      if (!same(curr, base)) setValue(out, field.key, curr);
    });
    return out;
  }
  validate() {
    this.ensureAllTabsRendered();
    const errors = /* @__PURE__ */ new Map();
    collectFields(this.currentSchema.tabs).forEach((field) => {
      if (field.type === "group" || field.type === "computed") return;
      const host = this.fieldEls.get(field.key);
      if (!host) return;
      const input = host.querySelector(
        ".mn-form-input, .mn-form-select, .mn-form-textarea"
      );
      if (input) {
        const rules = [field.required ? "required" : "", patternRule(field)].filter(Boolean).join(",");
        if (rules) input.setAttribute("data-validate", rules);
      }
      if (!validateField(host)) errors.set(field.key, host.querySelector(".mn-field__error")?.textContent || "Invalid value");
      const custom = field.options?.custom;
      const message = custom?.(getValue2(this.currentData, field.key), this.currentData);
      if (message) {
        errors.set(field.key, message);
        const err = host.querySelector(".mn-field__error");
        if (err) err.textContent = message;
      }
    });
    return { valid: errors.size === 0, errors };
  }
  pushEntity(schema, data) {
    this.stack.push({
      schema: this.currentSchema,
      data: clone(this.currentData),
      base: clone(this.baseData),
      label: getLabel(this.currentData, this.getCurrentDepth())
    });
    this.currentSchema = schema;
    this.baseData = clone(data);
    this.currentData = clone(data);
    this.activeTab = schema.tabs[0]?.id ?? "";
    this.render();
  }
  popEntity() {
    const prev = this.stack.pop();
    if (!prev) return false;
    this.currentSchema = prev.schema;
    this.currentData = prev.data;
    this.baseData = prev.base;
    this.activeTab = this.currentSchema.tabs[0]?.id ?? "";
    this.render();
    return true;
  }
  destroy() {
    this.asyncControls.splice(0).forEach((ctrl) => ctrl.destroy());
    this.fieldEls.clear();
    this.renderedTabs.clear();
    this.container.innerHTML = "";
  }
  buildRenderContext() {
    return {
      container: this.container,
      schema: this.currentSchema,
      activeTab: this.activeTab,
      data: this.currentData,
      editable: this.options.editable !== false,
      actions: this.options.actions ?? [],
      breadcrumb: this.buildBreadcrumb(),
      isDirty: this.isDirty(),
      fieldEls: this.fieldEls,
      asyncControls: this.asyncControls,
      renderedTabs: this.renderedTabs,
      onTab: (tabId) => this.handleTabSwitch(tabId),
      onField: (field, value) => this.onFieldChange(field, value),
      onSave: () => void this.handleSave(),
      onCancel: () => this.handleCancel(),
      onAction: (id) => this.options.onAction?.(id, this.currentData)
    };
  }
  buildBreadcrumb() {
    return [
      this.rootLabel,
      ...this.stack.path().map((v) => v.label),
      getLabel(this.currentData, this.getCurrentDepth())
    ].join(" / ");
  }
  /** Switch tab via CSS display toggle — no DOM rebuild. */
  handleTabSwitch(tabId) {
    this.activeTab = tabId;
    switchTab(this.container, tabId, this.buildRenderContext());
  }
  /** Force-render any tabs not yet lazily rendered (needed for validate). */
  ensureAllTabsRendered() {
    const ctx = this.buildRenderContext();
    for (const tab of this.currentSchema.tabs) {
      if (!this.renderedTabs.has(tab.id)) {
        switchTab(this.container, tab.id, ctx);
      }
    }
    switchTab(this.container, this.activeTab, ctx);
  }
  render() {
    this.destroy();
    renderWorkbench(this.buildRenderContext());
  }
  onFieldChange(field, value) {
    setValue(this.currentData, field.key, value);
    updateSaveState(this.container, this.isDirty());
    if (field.key === "name" || field.key === "title") {
      const breadcrumbEl = this.container.querySelector(".mn-entity-workbench__breadcrumb");
      if (breadcrumbEl) breadcrumbEl.textContent = this.buildBreadcrumb();
    }
  }
  async handleSave() {
    if (!this.validate().valid) return;
    await this.options.onSave?.(this.getModifiedData());
    this.baseData = clone(this.currentData);
    this.render();
  }
  handleCancel() {
    if (this.isDirty() && typeof window !== "undefined" && !window.confirm("Discard unsaved changes?")) return;
    this.currentData = clone(this.baseData);
    this.render();
    this.options.onClose?.();
  }
};
function collectFields(tabs) {
  return tabs.flatMap((tab) => tab.sections.flatMap((section) => section.fields.flatMap((field) => field.type === "group" ? field.fields ?? [] : [field])));
}
function patternRule(field) {
  const pattern = field.options?.pattern;
  return typeof pattern === "string" && pattern.length ? `pattern:${pattern}` : "";
}
function getValue2(data, key) {
  return key.split(".").reduce((acc, part) => acc?.[part], data);
}
function setValue(data, key, value) {
  const parts = key.split(".");
  const last = parts.pop();
  if (!last) return;
  let cursor = data;
  parts.forEach((part) => {
    cursor[part] = cursor[part] ?? {};
    cursor = cursor[part];
  });
  cursor[last] = value;
}
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function getLabel(data, depth) {
  const value = data.name ?? data.title ?? data.id;
  return value != null ? String(value) : `Entity ${depth}`;
}

// src/wc/mn-entity-workbench.js
var MnEntityWorkbench = class extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this._schema = { tabs: [] };
    this._data = {};
    this._editable = true;
    this._actions = [];
    this._ctrl = null;
  }
  connectedCallback() {
    this._renderState();
    if (this.hasAttribute("open")) this._mount();
  }
  disconnectedCallback() {
    this._ctrl?.destroy();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name !== "open" || oldVal === newVal) return;
    if (newVal !== null) this._mount();
    else this._unmount();
    this._renderState();
  }
  get schema() {
    return this._schema;
  }
  set schema(value) {
    this._schema = value?.tabs ? value : { tabs: [] };
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value && typeof value === "object" ? value : {};
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  get editable() {
    return this._editable;
  }
  set editable(value) {
    this._editable = Boolean(value);
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  get actions() {
    return this._actions;
  }
  set actions(value) {
    this._actions = Array.isArray(value) ? value : [];
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
  }
  _mount() {
    this._ctrl?.destroy();
    this._ctrl = new EntityWorkbench(this, {
      schema: this._schema,
      data: this._data,
      editable: this._editable,
      actions: this._actions,
      onSave: (data) => {
        this.dispatchEvent(new CustomEvent("mn-save", { detail: { data }, bubbles: true, composed: true }));
      },
      onClose: () => {
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("mn-close", { bubbles: true, composed: true }));
      },
      onAction: (actionId, data) => {
        this.dispatchEvent(new CustomEvent("mn-action", { detail: { actionId, data }, bubbles: true, composed: true }));
      }
    });
  }
  _unmount() {
    this._ctrl?.destroy();
    this._ctrl = null;
    this.innerHTML = "";
  }
  _renderState() {
    this.classList.toggle("mn-entity-workbench-host", true);
    this.classList.toggle("mn-entity-workbench-host--open", this.hasAttribute("open"));
  }
};
customElements.define("mn-entity-workbench", MnEntityWorkbench);
//# sourceMappingURL=mn-entity-workbench.js.map
