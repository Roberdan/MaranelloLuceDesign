const resolve = (path, fallback = null) => {
  try {
    return globalThis.Maranello?.[path] ?? fallback;
  } catch {
    return fallback;
  }
};
class MnThemeRotary extends HTMLElement {
  static get observedAttributes() {
    return ["size"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._controller = null;
    this._labels = {};
    this._positions = [];
    this._wrap = null;
    this._onKeyDown = null;
  }
  connectedCallback() {
    let saved = null;
    try {
      saved = localStorage.getItem("mn-theme");
    } catch (_) {
    }
    if (saved && ["nero", "avorio", "colorblind", "editorial", "sugar"].includes(saved)) {
      const setTheme = resolve("setTheme");
      if (typeof setTheme === "function") setTheme(saved);
      else {
        document.body.classList.remove("mn-nero", "mn-avorio", "mn-colorblind", "mn-sugar");
        if (saved !== "editorial") document.body.classList.add("mn-" + saved);
      }
    }
    const size = parseInt(this.getAttribute("size") || "140", 10);
    this._render(size);
  }
  disconnectedCallback() {
    if (this._wrap && this._onKeyDown) this._wrap.removeEventListener("keydown", this._onKeyDown);
    this._controller?.destroy();
    this._controller = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "size" && oldVal !== newVal && this.isConnected) {
      this.shadowRoot.innerHTML = "";
      this._render(parseInt(newVal || "140", 10));
    }
  }
  _render(size) {
    const style = document.createElement("style");
    style.textContent = `
      :host { display: inline-block; }
      .wrap { display: inline-flex; flex-direction: column; align-items: center; user-select: none; gap: 8px; }
      .dial { position: relative; border-radius: 50%; }
      .ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--mn-border); pointer-events: none; }
      .pointer { position: absolute; top: 8px; left: 50%; width: 2px; border-radius: 1px; background: var(--mn-accent); transform: translateX(-50%); transform-origin: 50% var(--ptr-origin); pointer-events: none; transition: transform .3s cubic-bezier(.4,0,.2,1); }
      .pos { position: absolute; font-family: var(--font-body, sans-serif); font-size: .55rem; color: var(--mn-text-muted); text-transform: uppercase; letter-spacing: .04em; cursor: pointer; transform: translate(-50%, -50%); white-space: nowrap; transition: color .15s; }
      .pos--active { color: var(--mn-text); font-weight: 700; }
      .center { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 40% 35%, var(--mn-border), var(--mn-surface-raised)); box-shadow: 0 3px 8px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.15); pointer-events: none; }
      .center-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mn-accent); opacity: .8; }
    `;
    this.shadowRoot.appendChild(style);
    const POSITIONS = [
      { mode: "editorial", label: "ED", angle: -45 },
      { mode: "nero", label: "NR", angle: 45 },
      { mode: "avorio", label: "AV", angle: 135 },
      { mode: "colorblind", label: "CB", angle: 225 },
      { mode: "sugar", label: "SG", angle: 315 }
    ];
    const center = size / 2;
    const labelR = size / 2 + 18;
    const pointerLen = size * 0.18;
    const centerSize = size * 0.32;
    const wrap = document.createElement("div");
    wrap.className = "wrap";
    wrap.setAttribute("role", "radiogroup");
    wrap.setAttribute("aria-label", "Theme selector");
    const dial = document.createElement("div");
    dial.className = "dial";
    dial.style.width = dial.style.height = size + "px";
    wrap.appendChild(dial);
    const ring = document.createElement("div");
    ring.className = "ring";
    dial.appendChild(ring);
    const pointer = document.createElement("div");
    pointer.className = "pointer";
    pointer.style.height = pointerLen + "px";
    pointer.style.setProperty("--ptr-origin", center - 8 + "px");
    dial.appendChild(pointer);
    const labels = {};
    for (const pos of POSITIONS) {
      const rad = (pos.angle - 90) * (Math.PI / 180);
      const lx = center + Math.cos(rad) * labelR;
      const ly = center + Math.sin(rad) * labelR;
      const el = document.createElement("div");
      el.className = "pos";
      el.textContent = pos.label;
      el.setAttribute("role", "radio");
      el.setAttribute("tabindex", "-1");
      el.setAttribute("aria-checked", "false");
      el.style.left = lx + "px";
      el.style.top = ly + "px";
      el.addEventListener("click", () => {
        this._applyTheme(pos.mode);
        el.focus();
      });
      dial.appendChild(el);
      labels[pos.mode] = el;
    }
    const centerHub = document.createElement("div");
    centerHub.className = "center";
    centerHub.style.width = centerHub.style.height = centerSize + "px";
    centerHub.innerHTML = `<span class="center-dot"></span>`;
    dial.appendChild(centerHub);
    this.shadowRoot.appendChild(wrap);
    this._labels = labels;
    this._pointer = pointer;
    this._positions = POSITIONS;
    this._wrap = wrap;
    this._onKeyDown = (event) => {
      const current = this._getTheme();
      const currentIndex = this._positions.findIndex((p) => p.mode === current);
      let nextIndex = currentIndex;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          nextIndex = (currentIndex + 1) % this._positions.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          nextIndex = (currentIndex - 1 + this._positions.length) % this._positions.length;
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          event.preventDefault();
          nextIndex = this._positions.length - 1;
          break;
        default:
          return;
      }
      const nextMode = this._positions[nextIndex]?.mode;
      if (!nextMode) return;
      this._applyTheme(nextMode);
      this._labels[nextMode]?.focus();
    };
    wrap.addEventListener("keydown", this._onKeyDown);
    this._update();
  }
  _getTheme() {
    const fn = resolve("getTheme");
    if (fn) return fn();
    const cl = document.body.classList;
    if (cl.contains("mn-nero")) return "nero";
    if (cl.contains("mn-avorio")) return "avorio";
    if (cl.contains("mn-colorblind")) return "colorblind";
    if (cl.contains("mn-sugar")) return "sugar";
    return "editorial";
  }
  _applyTheme(mode) {
    const fn = resolve("setTheme");
    if (fn) fn(mode);
    else {
      document.body.classList.remove("mn-nero", "mn-avorio", "mn-colorblind", "mn-sugar");
      const map = { nero: "mn-nero", avorio: "mn-avorio", colorblind: "mn-colorblind", sugar: "mn-sugar" };
      if (map[mode]) document.body.classList.add(map[mode]);
      try {
        localStorage.setItem("mn-theme", mode);
      } catch (_) {
      }
    }
    this._update();
    this.dispatchEvent(new CustomEvent("mn-theme-change", {
      detail: { theme: mode },
      bubbles: true,
      composed: true
    }));
  }
  _update() {
    if (!this._pointer) return;
    const current = this._getTheme();
    const pos = this._positions.find((p) => p.mode === current);
    const angle = pos ? pos.angle : -45;
    this._pointer.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    for (const [mode, el] of Object.entries(this._labels)) {
      const active = mode === current;
      el.classList.toggle("pos--active", active);
      el.setAttribute("aria-checked", String(active));
      el.setAttribute("tabindex", active ? "0" : "-1");
    }
  }
}
customElements.define("mn-theme-rotary", MnThemeRotary);
//# sourceMappingURL=mn-theme-rotary.js.map
