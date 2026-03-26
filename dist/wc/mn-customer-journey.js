var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/ts/core/sanitize.ts
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var init_sanitize = __esm({
  "src/ts/core/sanitize.ts"() {
    "use strict";
  }
});

// src/ts/customer-journey-render.ts
function buildCard(eng, typeIcons, ac) {
  const card = document.createElement("div");
  card.className = `mn-journey__card mn-journey__card--${eng.status}`;
  card.setAttribute("role", "listitem");
  card.setAttribute("tabindex", "0");
  card.dataset.id = eng.id;
  if (eng.date) card.dataset.date = eng.date;
  if (eng.assignee) card.dataset.assignee = eng.assignee;
  const avatar = document.createElement("div");
  avatar.className = "mn-journey__avatar";
  if (eng.avatar) {
    const img = document.createElement("img");
    img.src = eng.avatar;
    img.alt = eng.assignee ? escapeHtml(eng.assignee) : "";
    img.className = "mn-journey__avatar-img";
    avatar.appendChild(img);
  } else {
    avatar.textContent = eng.assignee ? journeyInitials(eng.assignee) : "?";
  }
  card.appendChild(avatar);
  const body = document.createElement("div");
  body.className = "mn-journey__card-body";
  const title = document.createElement("span");
  title.className = "mn-journey__title";
  title.textContent = escapeHtml(eng.title);
  body.appendChild(title);
  const badge = document.createElement("span");
  badge.className = `mn-journey__badge mn-journey__badge--${eng.status}`;
  badge.textContent = STATUS_LABELS[eng.status];
  badge.setAttribute("aria-label", STATUS_LABELS[eng.status]);
  body.appendChild(badge);
  const typeEl = document.createElement("span");
  typeEl.className = `mn-journey__type mn-journey__type--${eng.type}`;
  typeEl.textContent = typeIcons[eng.type] ?? "";
  typeEl.setAttribute("aria-label", eng.type);
  body.appendChild(typeEl);
  card.appendChild(body);
  return card;
}
function buildPhase(phase, typeIcons, ac) {
  const col = document.createElement("div");
  col.className = "mn-journey__phase";
  col.setAttribute("role", "group");
  col.setAttribute("aria-label", phase.label);
  const heading = document.createElement("div");
  heading.className = "mn-journey__phase-label";
  heading.textContent = escapeHtml(phase.label);
  col.appendChild(heading);
  for (const eng of phase.engagements) {
    col.appendChild(buildCard(eng, typeIcons, ac));
  }
  return col;
}
function renderJourneyPhases(el, phases, opts, ac, typeIcons) {
  for (const phase of phases) {
    el.appendChild(buildPhase(phase, typeIcons, ac));
  }
}
function drawConnectors(el, _phases) {
  const phaseEls = el.querySelectorAll(".mn-journey__phase");
  if (phaseEls.length < 2) return;
  const elRect = el.getBoundingClientRect();
  const w = el.scrollWidth;
  const h = el.scrollHeight;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("mn-journey__connectors");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "mn-journey-arrow");
  marker.setAttribute("markerWidth", "8");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "8");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrowPath.setAttribute("d", "M0,0 L8,3 L0,6 Z");
  arrowPath.style.fill = "var(--mn-info)";
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg.appendChild(defs);
  for (let i = 0; i < phaseEls.length - 1; i++) {
    const srcCards = phaseEls[i].querySelectorAll(".mn-journey__card");
    const dstCards = phaseEls[i + 1].querySelectorAll(".mn-journey__card");
    if (!srcCards.length || !dstCards.length) continue;
    const src = srcCards[srcCards.length - 1].getBoundingClientRect();
    const dst = dstCards[0].getBoundingClientRect();
    const x1 = src.right - elRect.left + el.scrollLeft;
    const y1 = src.top + src.height / 2 - elRect.top + el.scrollTop;
    const x2 = dst.left - elRect.left + el.scrollLeft;
    const y2 = dst.top + dst.height / 2 - elRect.top + el.scrollTop;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("mn-journey__connector-line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.style.stroke = "var(--mn-info)";
    line.setAttribute("stroke-dasharray", "6 4");
    line.setAttribute("stroke-width", "2.5");
    line.setAttribute("marker-end", "url(#mn-journey-arrow)");
    svg.appendChild(line);
  }
  el.appendChild(svg);
}
var STATUS_LABELS;
var init_customer_journey_render = __esm({
  "src/ts/customer-journey-render.ts"() {
    "use strict";
    init_sanitize();
    init_customer_journey();
    STATUS_LABELS = {
      completed: "Completed",
      active: "Active",
      pending: "Pending",
      blocked: "Blocked"
    };
  }
});

// src/ts/customer-journey.ts
var customer_journey_exports = {};
__export(customer_journey_exports, {
  customerJourney: () => customerJourney,
  journeyInitials: () => journeyInitials
});
function journeyInitials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function setupKeyboard(el, phases, opts, ac, selectFn) {
  el.addEventListener("keydown", (e) => {
    const target = e.target;
    if (!target.classList.contains("mn-journey__card")) return;
    const phaseEl = target.closest(".mn-journey__phase");
    if (!phaseEl) return;
    const allPhases = [...el.querySelectorAll(".mn-journey__phase")];
    const phaseIdx = allPhases.indexOf(phaseEl);
    const cards = [...phaseEl.querySelectorAll(".mn-journey__card")];
    const cardIdx = cards.indexOf(target);
    let next = null;
    if (e.key === "ArrowRight" && phaseIdx < allPhases.length - 1) {
      const nextCards = allPhases[phaseIdx + 1].querySelectorAll(".mn-journey__card");
      next = nextCards[0] ?? null;
    } else if (e.key === "ArrowLeft" && phaseIdx > 0) {
      const prevCards = allPhases[phaseIdx - 1].querySelectorAll(".mn-journey__card");
      next = prevCards[0] ?? null;
    } else if (e.key === "ArrowDown" && cardIdx < cards.length - 1) {
      next = cards[cardIdx + 1];
    } else if (e.key === "ArrowUp" && cardIdx > 0) {
      next = cards[cardIdx - 1];
    } else if (e.key === "Enter") {
      const id = target.dataset.id ?? "";
      selectFn(id);
      const eng = phases.flatMap((p) => p.engagements).find((en) => en.id === id);
      if (eng?.onClick) eng.onClick();
      if (eng && opts.onSelect) opts.onSelect(eng);
      return;
    }
    if (next) {
      e.preventDefault();
      next.focus();
    }
  }, { signal: ac.signal });
}
function setupTooltip(el, ac) {
  let tip = null;
  el.addEventListener("pointerenter", (e) => {
    const card = e.target.closest?.(".mn-journey__card");
    if (!card) return;
    const date = card.dataset.date ?? "";
    const assignee = card.dataset.assignee ?? "";
    if (!date && !assignee) return;
    tip = document.createElement("div");
    tip.className = "mn-journey__tooltip";
    const parts = [];
    if (assignee) parts.push(escapeHtml(assignee));
    if (date) parts.push(escapeHtml(date));
    tip.innerHTML = parts.join("<br>");
    card.appendChild(tip);
  }, { capture: true, signal: ac.signal });
  el.addEventListener("pointerleave", (e) => {
    const card = e.target.closest?.(".mn-journey__card");
    if (card && tip && card.contains(tip)) {
      tip.remove();
      tip = null;
    }
  }, { capture: true, signal: ac.signal });
}
function customerJourney(el, phases, opts) {
  const options = {
    orientation: "horizontal",
    onSelect: () => {
    },
    showConnectors: true,
    compactMode: false,
    ...opts
  };
  const ac = new AbortController();
  let selectedId = null;
  let currentPhases = [...phases];
  el.setAttribute("role", "list");
  el.setAttribute("aria-label", "Customer journey");
  el.classList.add("mn-journey");
  if (options.orientation === "vertical") el.classList.add("mn-journey--vertical");
  if (options.compactMode) el.classList.add("mn-journey--compact");
  function render() {
    el.innerHTML = "";
    renderJourneyPhases(el, currentPhases, options, ac, TYPE_ICONS);
    if (options.showConnectors && currentPhases.length > 1) {
      drawConnectors(el, currentPhases);
    }
    if (selectedId) markSelected(selectedId);
  }
  function markSelected(id) {
    el.querySelectorAll(".mn-journey__card--selected").forEach((c) => c.classList.remove("mn-journey__card--selected"));
    const card = el.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (card) {
      card.classList.add("mn-journey__card--selected");
      card.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
  function selectEngagement(id) {
    selectedId = id;
    markSelected(id);
  }
  el.addEventListener("click", (e) => {
    const card = e.target.closest?.(".mn-journey__card");
    if (!card) return;
    const id = card.dataset.id ?? "";
    selectEngagement(id);
    const eng = currentPhases.flatMap((p) => p.engagements).find((en) => en.id === id);
    if (eng?.onClick) eng.onClick();
    if (eng && opts?.onSelect) opts.onSelect(eng);
  }, { signal: ac.signal });
  setupKeyboard(el, currentPhases, options, ac, selectEngagement);
  setupTooltip(el, ac);
  render();
  return {
    update(newPhases) {
      currentPhases = [...newPhases];
      render();
    },
    selectEngagement,
    getSelected: () => selectedId,
    destroy() {
      ac.abort();
      el.innerHTML = "";
      el.removeAttribute("role");
      el.removeAttribute("aria-label");
      el.classList.remove("mn-journey", "mn-journey--vertical", "mn-journey--compact");
    }
  };
}
var TYPE_ICONS;
var init_customer_journey = __esm({
  "src/ts/customer-journey.ts"() {
    "use strict";
    init_sanitize();
    init_customer_journey_render();
    TYPE_ICONS = {
      opportunity: "\u2605",
      // star
      contract: "\u2709",
      // envelope
      ticket: "\u2691",
      // flag
      meeting: "\u260E",
      // telephone
      task: "\u2713"
      // check
    };
  }
});

// src/wc/mn-customer-journey.js
var _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
var MnCustomerJourney = class extends HTMLElement {
  static get observedAttributes() {
    return ["phases", "selected", "layout"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    const tokens = cssLink("../css/tokens.css");
    const layout = cssLink("../css/layouts-customer-journey.css");
    const style = document.createElement("style");
    style.textContent = ":host { display: block; }";
    this._container = document.createElement("div");
    this.shadowRoot.append(tokens, layout, style, this._container);
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    if (this._ctrl) {
      this._ctrl.destroy();
      this._ctrl = null;
    }
  }
  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }
  async _render() {
    if (this._ctrl) {
      this._ctrl.destroy();
      this._ctrl = null;
    }
    const phasesAttr = this.getAttribute("phases");
    if (!phasesAttr) return;
    try {
      const phases = JSON.parse(phasesAttr);
      const { customerJourney: customerJourney2 } = await Promise.resolve().then(() => (init_customer_journey(), customer_journey_exports));
      const layoutMode = this.getAttribute("layout") || "horizontal";
      this._ctrl = customerJourney2(this._container, phases, {
        orientation: layoutMode,
        showConnectors: true,
        onSelect: (eng) => this.dispatchEvent(
          new CustomEvent("select", { detail: eng, bubbles: true })
        )
      });
      const sel = this.getAttribute("selected");
      if (sel) this._ctrl.selectEngagement(sel);
    } catch (_e) {
    }
  }
};
customElements.define("mn-customer-journey", MnCustomerJourney);
//# sourceMappingURL=mn-customer-journey.js.map
