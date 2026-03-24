const _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnCommandPalette extends HTMLElement {
  static get observedAttributes() {
    return ["items", "placeholder"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._items = [];
    this._focusIdx = -1;
    const tokens = cssLink("../css/tokens.css");
    const link = cssLink("../css/layouts-command-palette.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: contents }
      .mn-command-palette { position: fixed; inset: 0; z-index: 9500;
        display: flex; align-items: flex-start; justify-content: center;
        padding-top: 20vh; background: rgba(0,0,0,.5);
        opacity: 0; pointer-events: none; transition: opacity .2s }
      .mn-command-palette--open { opacity: 1; pointer-events: auto }
      .mn-cp__box { background: var(--mn-surface-raised);
        border: 1px solid var(--mn-border); border-radius: 12px;
        width: 520px; max-width: 90vw; max-height: 60vh; overflow: hidden;
        box-shadow: 0 24px 48px rgba(0,0,0,.6); display: flex;
        flex-direction: column }
      .mn-cp__input { width: 100%; padding: 14px 16px; border: none;
        background: transparent; color: var(--mn-text);
        font-family: var(--font-body, sans-serif); font-size: 1rem;
        border-bottom: 1px solid var(--mn-border); outline: none }
      .mn-cp__input::placeholder { color: var(--mn-text-muted) }
      .mn-cp__list { overflow-y: auto; padding: 8px 0; flex: 1 }
      .mn-cp__item { display: flex; align-items: center; gap: 10px;
        padding: 10px 16px; cursor: pointer; color: var(--mn-text-tertiary);
        font-family: var(--font-body, sans-serif); font-size: .9rem;
        transition: background .1s }
      .mn-cp__item:hover, .mn-cp__item--focused {
        background: var(--mn-border) }
      .mn-cp__item-icon { flex-shrink: 0; width: 18px; text-align: center }
      .mn-cp__item-text { flex: 1 }
      .mn-cp__item-shortcut { font-size: .75rem;
        color: var(--mn-text-muted); font-family: monospace }
      .mn-cp__empty { padding: 20px 16px; text-align: center;
        color: var(--mn-text-muted); font-size: .9rem }
      .mn-cp__group { padding: 6px 16px 4px; font-size: .7rem;
        text-transform: uppercase; letter-spacing: .08em;
        color: var(--mn-text-muted) }
    `;
    this._backdrop = document.createElement("div");
    this._backdrop.className = "mn-command-palette";
    const box = document.createElement("div");
    box.className = "mn-cp__box";
    this._input = document.createElement("input");
    this._input.className = "mn-cp__input";
    this._input.type = "text";
    this._input.setAttribute("autocomplete", "off");
    this._list = document.createElement("div");
    this._list.className = "mn-cp__list";
    box.append(this._input, this._list);
    this._backdrop.appendChild(box);
    this._input.addEventListener("input", () => this._filter());
    this._input.addEventListener("keydown", (e) => this._onKey(e));
    this._backdrop.addEventListener("click", (e) => {
      if (e.target === this._backdrop) this.close();
    });
    this._globalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        this._isOpen ? this.close() : this.open();
      }
    };
    this.shadowRoot.append(tokens, link, style, this._backdrop);
  }
  connectedCallback() {
    this._input.placeholder = this.getAttribute("placeholder") || "Type a command\u2026";
    this._parseItems();
    document.addEventListener("keydown", this._globalKey);
  }
  disconnectedCallback() {
    document.removeEventListener("keydown", this._globalKey);
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === "items") this._parseItems();
    if (name === "placeholder") this._input.placeholder = newVal || "Type a command\u2026";
  }
  /* ── Public API ─────────────────────────────────────────── */
  open() {
    this._isOpen = true;
    this._backdrop.classList.add("mn-command-palette--open");
    this._input.value = "";
    this._filter();
    this._input.focus();
  }
  close() {
    this._isOpen = false;
    this._backdrop.classList.remove("mn-command-palette--open");
    this._focusIdx = -1;
  }
  /* ── Private ────────────────────────────────────────────── */
  _parseItems() {
    try {
      this._items = JSON.parse(this.getAttribute("items") || "[]");
    } catch {
      this._items = [];
    }
    this._filter();
  }
  _filter() {
    const q = (this._input.value || "").toLowerCase();
    const filtered = q ? this._items.filter((it) => (it.text || "").toLowerCase().includes(q)) : this._items;
    this._renderList(filtered);
  }
  _renderList(items) {
    this._list.innerHTML = "";
    this._focusIdx = -1;
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "mn-cp__empty";
      empty.textContent = "No commands found";
      this._list.appendChild(empty);
      return;
    }
    let lastGroup = null;
    items.forEach((item, i) => {
      if (item.group && item.group !== lastGroup) {
        lastGroup = item.group;
        const g = document.createElement("div");
        g.className = "mn-cp__group";
        g.textContent = item.group;
        this._list.appendChild(g);
      }
      const row = document.createElement("div");
      row.className = "mn-cp__item";
      row.dataset.index = String(i);
      if (item.icon) {
        const ic = document.createElement("span");
        ic.className = "mn-cp__item-icon";
        ic.textContent = item.icon;
        row.appendChild(ic);
      }
      const txt = document.createElement("span");
      txt.className = "mn-cp__item-text";
      txt.textContent = item.text || "";
      row.appendChild(txt);
      if (item.shortcut) {
        const sc = document.createElement("span");
        sc.className = "mn-cp__item-shortcut";
        sc.textContent = item.shortcut;
        row.appendChild(sc);
      }
      row.addEventListener("click", () => this._selectItem(item));
      this._list.appendChild(row);
    });
  }
  _selectItem(item) {
    this.dispatchEvent(new CustomEvent("mn-select", {
      detail: { item },
      bubbles: true,
      composed: true
    }));
    this.close();
  }
  _onKey(e) {
    const rows = this._list.querySelectorAll(".mn-cp__item");
    if (e.key === "Escape") {
      this.close();
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._focusIdx = Math.min(this._focusIdx + 1, rows.length - 1);
      this._highlightRow(rows);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._focusIdx = Math.max(this._focusIdx - 1, 0);
      this._highlightRow(rows);
    } else if (e.key === "Enter" && this._focusIdx >= 0 && rows[this._focusIdx]) {
      rows[this._focusIdx].click();
    }
  }
  _highlightRow(rows) {
    rows.forEach((r, i) => r.classList.toggle("mn-cp__item--focused", i === this._focusIdx));
    rows[this._focusIdx]?.scrollIntoView({ block: "nearest" });
  }
}
customElements.define("mn-command-palette", MnCommandPalette);
//# sourceMappingURL=mn-command-palette.js.map
