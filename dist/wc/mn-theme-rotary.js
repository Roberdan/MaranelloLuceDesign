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
  }
  connectedCallback() {
    let saved = null;
    try {
      saved = localStorage.getItem("mn-theme");
    } catch (_) {
    }
    if (saved && ["nero", "avorio", "colorblind", "editorial"].includes(saved)) {
      document.body.classList.remove("mn-nero", "mn-avorio", "mn-colorblind");
      if (saved !== "editorial") document.body.classList.add("mn-" + saved);
    }
    const size = parseInt(this.getAttribute("size") || "140", 10);
    this._render(size);
  }
  disconnectedCallback() {
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
      .ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--grigio-scuro, #444); pointer-events: none; }
      .pointer { position: absolute; top: 8px; left: 50%; width: 2px; border-radius: 1px; background: var(--mn-accent, #FFC72C); transform: translateX(-50%); transform-origin: 50% var(--ptr-origin); pointer-events: none; transition: transform .3s cubic-bezier(.4,0,.2,1); }
      .pos { position: absolute; font-family: var(--font-body, sans-serif); font-size: .55rem; color: var(--grigio-medio, #777); text-transform: uppercase; letter-spacing: .04em; cursor: pointer; transform: translate(-50%, -50%); white-space: nowrap; transition: color .15s; }
      .pos--active { color: var(--bianco-caldo, #f5f0e8); font-weight: 700; }
      .center { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 40% 35%, var(--grigio-scuro, #444), var(--nero-soft, #1a1a1a)); box-shadow: 0 3px 8px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.15); pointer-events: none; }
      .center-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mn-accent, #FFC72C); opacity: .8; }
    `;
    this.shadowRoot.appendChild(style);
    const POSITIONS = [
      { mode: "editorial", label: "ED", angle: -45 },
      { mode: "nero", label: "NR", angle: 45 },
      { mode: "avorio", label: "AV", angle: 135 },
      { mode: "colorblind", label: "CB", angle: 225 }
    ];
    const center = size / 2;
    const labelR = size / 2 + 18;
    const pointerLen = size * 0.18;
    const centerSize = size * 0.32;
    const wrap = document.createElement("div");
    wrap.className = "wrap";
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
      el.style.left = lx + "px";
      el.style.top = ly + "px";
      el.addEventListener("click", () => this._applyTheme(pos.mode));
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
    this._update();
  }
  _getTheme() {
    const fn = resolve("getTheme");
    if (fn) return fn();
    const cl = document.body.classList;
    if (cl.contains("mn-nero")) return "nero";
    if (cl.contains("mn-avorio")) return "avorio";
    if (cl.contains("mn-colorblind")) return "colorblind";
    return "editorial";
  }
  _applyTheme(mode) {
    const fn = resolve("setTheme");
    if (fn) fn(mode);
    else {
      document.body.classList.remove("mn-nero", "mn-avorio", "mn-colorblind");
      const map = { nero: "mn-nero", avorio: "mn-avorio", colorblind: "mn-colorblind" };
      if (map[mode]) document.body.classList.add(map[mode]);
    }
    try {
      localStorage.setItem("mn-theme", mode);
    } catch (_) {
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
      el.classList.toggle("pos--active", mode === current);
    }
  }
}
customElements.define("mn-theme-rotary", MnThemeRotary);
//# sourceMappingURL=mn-theme-rotary.js.map
