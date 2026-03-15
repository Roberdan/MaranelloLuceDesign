/* Maranello Luce Design v3.3.0 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */
import {
  eventBus
} from "./chunk-HHVWQPGK.js";

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
function validateForm(formEl) {
  const fields = formEl.querySelectorAll(".mn-field");
  let allValid = true;
  const errors = [];
  fields.forEach((field) => {
    if (!validateField(field)) {
      allValid = false;
      errors.push(field);
    }
  });
  if (errors.length > 0) {
    errors[0].scrollIntoView({ behavior: "smooth", block: "center" });
    getFieldInput(errors[0])?.focus();
  }
  return allValid;
}
function initLiveValidation(formOrSelector) {
  const form = typeof formOrSelector === "string" ? document.querySelector(formOrSelector) : formOrSelector;
  if (!form) return;
  form.querySelectorAll("[data-validate]").forEach((inputEl) => {
    const input = inputEl;
    const field = input.closest(".mn-field");
    if (!field) return;
    const rules = input.getAttribute("data-validate") ?? "";
    if (rules.includes("required")) input.setAttribute("aria-required", "true");
    input.addEventListener("blur", () => validateField(field));
    input.addEventListener("input", () => {
      if (field.classList.contains("mn-field--error")) validateField(field);
      const counter = field.querySelector(".mn-field__counter");
      if (counter) {
        const max = input.getAttribute("maxlength") ?? input.getAttribute("data-maxlength");
        if (max) counter.textContent = input.value.length + "/" + max;
      }
    });
  });
  form.addEventListener("submit", (e) => {
    if (!validateForm(form)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
function addValidator(name, fn, message) {
  validators[name] = fn;
  if (message) defaultMessages[name] = message;
}

// src/ts/forms-widgets.ts
function initAutoResize(el) {
  if (!el) return;
  function resize() {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }
  el.addEventListener("input", resize);
  resize();
}
function initTagInput(container) {
  if (!container) {
    console.warn("[Maranello] initTagInput: container element is null");
    return null;
  }
  const root = container;
  const field = root.querySelector(".mn-tag-input__field");
  if (!field) return null;
  if (!field.hasAttribute("aria-label")) field.setAttribute("aria-label", "Type to add tags");
  let tags = [];
  function addTag(text) {
    const t = text.trim();
    if (!t || tags.indexOf(t) !== -1) return;
    tags.push(t);
    const chip = document.createElement("span");
    chip.className = "mn-tag-input__chip";
    chip.appendChild(document.createTextNode(t));
    const removeBtn = document.createElement("button");
    removeBtn.className = "mn-tag-input__chip-remove";
    removeBtn.setAttribute("aria-label", "Remove " + t);
    removeBtn.textContent = "\xD7";
    removeBtn.addEventListener("click", () => {
      tags = tags.filter((x) => x !== t);
      chip.remove();
      eventBus.emit("tag-change", { tags: tags.slice(), container: root });
    });
    chip.appendChild(removeBtn);
    root.insertBefore(chip, field);
    eventBus.emit("tag-change", { tags: tags.slice(), container: root });
  }
  field.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field.value);
      field.value = "";
    } else if (e.key === "Backspace" && field.value === "" && tags.length > 0) {
      tags.pop();
      const chips = root.querySelectorAll(".mn-tag-input__chip");
      if (chips.length > 0) chips[chips.length - 1].remove();
      eventBus.emit("tag-change", { tags: tags.slice(), container: root });
    }
  });
  root.addEventListener("click", () => field.focus());
  return {
    getTags: () => tags.slice(),
    addTag,
    setTags(arr) {
      root.querySelectorAll(".mn-tag-input__chip").forEach((c) => c.remove());
      tags = [];
      arr.forEach(addTag);
    }
  };
}
function initPasswordToggle(wrap) {
  if (!wrap) return;
  const input = wrap.querySelector(".mn-form-input");
  const toggle = wrap.querySelector(".mn-password-toggle");
  if (!input || !toggle) return;
  toggle.addEventListener("click", () => {
    const isPwd = input.type === "password";
    input.type = isPwd ? "text" : "password";
    toggle.setAttribute("aria-label", isPwd ? "Hide password" : "Show password");
    toggle.innerHTML = isPwd ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/><path d="M10.59 10.59a3 3 0 1 0 4.24 4.24"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  });
}
function initFileUpload(container) {
  if (!container) {
    console.warn("[Maranello] initFileUpload: container element is null");
    return null;
  }
  const root = container;
  const input = root.querySelector('input[type="file"]');
  if (!input) return null;
  let files = [];
  root.addEventListener("dragover", (e) => {
    e.preventDefault();
    root.classList.add("mn-file-upload--dragover");
  });
  root.addEventListener("dragleave", () => root.classList.remove("mn-file-upload--dragover"));
  root.addEventListener("drop", (e) => {
    const de = e;
    de.preventDefault();
    root.classList.remove("mn-file-upload--dragover");
    files = Array.from(de.dataTransfer?.files ?? []);
    eventBus.emit("file-upload", { files, container: root });
    updateLabel();
  });
  input.addEventListener("change", () => {
    files = Array.from(input.files ?? []);
    eventBus.emit("file-upload", { files, container: root });
    updateLabel();
  });
  const liveRegion = root.querySelector(".mn-file-upload__live") ?? Object.assign(document.createElement("span"), { className: "mn-file-upload__live" });
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("role", "status");
  liveRegion.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)";
  if (!liveRegion.parentNode) root.appendChild(liveRegion);
  function updateLabel() {
    const textEl = root.querySelector(".mn-file-upload__text");
    if (!textEl || files.length === 0) return;
    textEl.textContent = "";
    const strong = document.createElement("strong");
    const msg = files.length === 1 ? files[0].name : files.length + " files selected";
    strong.textContent = files.length === 1 ? files[0].name : files.length + " files";
    textEl.appendChild(strong);
    if (files.length > 1) textEl.appendChild(document.createTextNode(" selected"));
    liveRegion.textContent = msg;
  }
  return {
    getFiles: () => files,
    clear() {
      files = [];
      input.value = "";
      const t = root.querySelector(".mn-file-upload__text");
      if (t) t.innerHTML = "<strong>Click to upload</strong> or drag and drop";
    }
  };
}
function initFormSteps(container) {
  if (!container) {
    console.warn("[Maranello] initFormSteps: container element is null");
    return null;
  }
  container.setAttribute("role", "group");
  if (!container.getAttribute("aria-label")) container.setAttribute("aria-label", "Form steps");
  const steps = container.querySelectorAll(".mn-form-step");
  let current = 0;
  function setStep(index) {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => {
      step.classList.remove("mn-form-step--active", "mn-form-step--complete");
      step.removeAttribute("aria-current");
      if (i < current) step.classList.add("mn-form-step--complete");
      if (i === current) {
        step.classList.add("mn-form-step--active");
        step.setAttribute("aria-current", "step");
      }
    });
    eventBus.emit("form-step-change", { step: current, total: steps.length });
  }
  setStep(0);
  return {
    next: () => setStep(current + 1),
    prev: () => setStep(current - 1),
    goTo: (i) => setStep(i),
    getCurrent: () => current
  };
}
function initInlineEdit(el) {
  if (!el) return;
  const root = el;
  let originalText = (root.textContent ?? "").trim();
  let editing = false;
  root.addEventListener("click", () => {
    if (editing) return;
    editing = true;
    root.classList.add("mn-inline-edit--editing");
    const input = document.createElement("input");
    input.className = "mn-form-input mn-form-input--sm";
    input.value = originalText;
    if (root instanceof HTMLElement) input.style.width = Math.max(100, root.offsetWidth) + "px";
    const icon = root.querySelector(".mn-inline-edit__icon");
    root.textContent = "";
    root.appendChild(input);
    input.focus();
    input.select();
    function save() {
      const newValue = input.value.trim();
      editing = false;
      root.classList.remove("mn-inline-edit--editing");
      root.textContent = newValue || originalText;
      originalText = root.textContent ?? "";
      if (icon) root.appendChild(icon);
      eventBus.emit("inline-edit", { el: root, value: root.textContent });
    }
    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") save();
      if (e.key === "Escape") {
        input.value = originalText;
        save();
      }
    });
  });
}
function initCharCounter(field) {
  const input = field.querySelector(
    ".mn-form-input, .mn-form-textarea"
  );
  const counter = field.querySelector(".mn-field__counter");
  if (!input || !counter) return;
  const max = input.getAttribute("maxlength") ?? input.getAttribute("data-maxlength") ?? "\u221E";
  function update() {
    counter.textContent = input.value.length + "/" + max;
  }
  input.addEventListener("input", update);
  update();
}
function initSearchClear(wrap) {
  if (!wrap) {
    console.warn("[Maranello] initSearchClear: wrapper element is null");
    return;
  }
  const input = wrap.querySelector(".mn-form-input");
  const clearBtn = wrap.querySelector(".mn-search-input__clear");
  if (!input || !clearBtn) return;
  function toggleClear() {
    clearBtn.style.display = input.value ? "flex" : "none";
  }
  input.addEventListener("input", toggleClear);
  clearBtn.addEventListener("click", () => {
    input.value = "";
    toggleClear();
    input.focus();
    eventBus.emit("search-clear", { input });
  });
  toggleClear();
}

// src/ts/forms.ts
function qsa(root, ...sels) {
  return root.querySelectorAll(sels.join(","));
}
function applyFieldA11y(root) {
  const fields = root.querySelectorAll ? root.querySelectorAll(".mn-field") : document.querySelectorAll(".mn-field");
  fields.forEach((field) => {
    const input = getFieldInput(field);
    if (!input) return;
    if (input.hasAttribute("required") || input.getAttribute("data-validate")?.includes("required")) {
      input.setAttribute("aria-required", "true");
    }
    const hint = field.querySelector(".mn-field__hint");
    if (hint) {
      if (!hint.id) {
        hint.id = "mn-hint-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
      }
      const existing = input.getAttribute("aria-describedby");
      if (!existing?.includes(hint.id)) {
        input.setAttribute("aria-describedby", existing ? existing + " " + hint.id : hint.id);
      }
    }
  });
}
function initForms(root = document) {
  applyFieldA11y(root);
  qsa(root, "[data-mn-validate]", ".mn-form[data-live-validate]").forEach(
    (form) => initLiveValidation(form)
  );
  qsa(root, "[data-mn-autoresize]", ".mn-form-textarea--auto").forEach(
    (el) => initAutoResize(el)
  );
  qsa(root, "[data-mn-tags]", ".mn-tag-input").forEach(
    (el) => initTagInput(el)
  );
  qsa(root, "[data-mn-password-toggle]", ".mn-password-wrap").forEach(
    (el) => initPasswordToggle(el)
  );
  qsa(root, "[data-mn-file-upload]", ".mn-file-upload").forEach(
    (el) => initFileUpload(el)
  );
  qsa(root, "[data-mn-steps]", ".mn-form-steps").forEach(
    (el) => initFormSteps(el)
  );
  qsa(root, "[data-mn-inline-edit]", ".mn-inline-edit").forEach(
    (el) => initInlineEdit(el)
  );
  qsa(root, "[data-mn-char-counter]", ".mn-field__counter").forEach(
    (el) => initCharCounter(el)
  );
  qsa(root, "[data-mn-search-clear]", ".mn-search-input").forEach(
    (el) => initSearchClear(el)
  );
}
var forms = {
  init: initForms,
  initAll: initForms,
  validate: validateForm,
  validateField,
  initLiveValidation,
  addValidator,
  get validators() {
    return validators;
  },
  get defaultMessages() {
    return defaultMessages;
  },
  initAutoResize,
  initTagInput,
  initPasswordToggle,
  initFileUpload,
  initFormSteps,
  initInlineEdit,
  initCharCounter,
  initSearchClear
};

export {
  validators,
  defaultMessages,
  getFieldInput,
  validateField,
  validateForm,
  initLiveValidation,
  addValidator,
  initAutoResize,
  initTagInput,
  initPasswordToggle,
  initFileUpload,
  initFormSteps,
  initInlineEdit,
  initCharCounter,
  initSearchClear,
  initForms,
  forms
};
//# sourceMappingURL=chunk-RRQQA6OJ.js.map
