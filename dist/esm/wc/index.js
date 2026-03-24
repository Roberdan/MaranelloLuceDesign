const WC_TAGS = [
  "mn-app-shell",
  "mn-a11y",
  "mn-async-select",
  "mn-chart",
  "mn-chat",
  "mn-command-palette",
  "mn-dashboard",
  "mn-data-table",
  "mn-date-picker",
  "mn-detail-panel",
  "mn-entity-workbench",
  "mn-ferrari-control",
  "mn-facet-workbench",
  "mn-funnel",
  "mn-gantt",
  "mn-gauge",
  "mn-header-shell",
  "mn-hbar",
  "mn-login",
  "mn-map",
  "mn-mapbox",
  "mn-modal",
  "mn-okr",
  "mn-profile",
  "mn-speedometer",
  "mn-state-scaffold",
  "mn-system-status",
  "mn-tab",
  "mn-tabs",
  "mn-theme-rotary",
  "mn-section-nav",
  "mn-theme-toggle",
  "mn-toast"
];
let _loaded = false;
async function registerAll() {
  if (_loaded) return;
  try {
    await Promise.all([
      import("./mn-app-shell.js"),
      import("./mn-a11y.js"),
      import("./mn-async-select.js"),
      import("./mn-chart.js"),
      import("./mn-chat.js"),
      import("./mn-command-palette.js"),
      import("./mn-dashboard.js"),
      import("./mn-data-table.js"),
      import("./mn-date-picker.js"),
      import("./mn-detail-panel.js"),
      import("./mn-entity-workbench.js"),
      import("./mn-ferrari-control.js"),
      import("./mn-facet-workbench.js"),
      import("./mn-funnel.js"),
      import("./mn-gantt.js"),
      import("./mn-gauge.js"),
      import("./mn-header-shell.js"),
      import("./mn-hbar.js"),
      import("./mn-login.js"),
      import("./mn-map.js"),
      import("./mn-mapbox.js"),
      import("./mn-modal.js"),
      import("./mn-okr.js"),
      import("./mn-profile.js"),
      import("./mn-speedometer.js"),
      import("./mn-state-scaffold.js"),
      import("./mn-system-status.js"),
      import("./mn-tabs.js"),
      // also registers mn-tab
      import("./mn-section-nav.js"),
      import("./mn-theme-rotary.js"),
      import("./mn-theme-toggle.js"),
      import("./mn-toast.js")
    ]);
    if (typeof document !== "undefined" && !document.querySelector("mn-a11y")) {
      document.body.appendChild(document.createElement("mn-a11y"));
    }
    _loaded = true;
  } catch (err) {
    console.warn("Maranello WC registerAll failed \u2014 retry on next call", err);
  }
}
function isRegistered(tag) {
  return !!customElements.get(tag);
}
function getAvailableTags() {
  return WC_TAGS;
}
function getRegistered() {
  return WC_TAGS.filter((tag) => !!customElements.get(tag));
}
export {
  getAvailableTags,
  getRegistered,
  isRegistered,
  registerAll
};
//# sourceMappingURL=index.js.map
