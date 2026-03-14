/**
 * Maranello Luce Design - Form validation
 * Field and form validation with built-in validators.
 */

export type FormInputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormValidator = (value: unknown, param?: string) => boolean;
export interface FormValidators { [name: string]: FormValidator }
export interface FormMessages { [name: string]: string }

const validators: FormValidators = {
  required: (v) => v !== null && v !== undefined && String(v).trim() !== '',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
  phone: (v) => /^[+]?[\d\s\-().]{7,20}$/.test(String(v).trim()),
  url: (v) => { try { new URL(String(v)); return true; } catch { return false; } },
  minLength: (v, len) => String(v).length >= Number(len),
  maxLength: (v, len) => String(v).length <= Number(len),
  min: (v, min) => Number(v) >= Number(min),
  max: (v, max) => Number(v) <= Number(max),
  pattern: (v, regex) => new RegExp(regex ?? '').test(String(v)),
  match: (v, otherId) => {
    const other = otherId
      ? document.getElementById(otherId) as FormInputElement | null
      : null;
    return Boolean(other) && String(v) === String(other?.value);
  },
};

const defaultMessages: FormMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: 'Must be at least {0} characters',
  maxLength: 'Must be no more than {0} characters',
  min: 'Must be at least {0}',
  max: 'Must be no more than {0}',
  pattern: 'Invalid format',
  match: 'Fields do not match',
};

/** Get the form-control input element from a field wrapper. */
export function getFieldInput(field: Element): FormInputElement | null {
  return field.querySelector(
    '.mn-form-input, .mn-form-select, .mn-form-textarea',
  ) as FormInputElement | null;
}

/** Validate a single field against its data-validate rules. */
export function validateField(field: Element): boolean {
  const input = getFieldInput(field);
  if (!input) return true;
  const rules = input.getAttribute('data-validate');
  if (!rules) return true;
  const value = input.value;
  const ruleList = rules.split(',').map((r) => r.trim());
  let valid = true;
  let errorMsg = '';

  for (const rule of ruleList) {
    const parts = rule.split(':');
    const ruleName = parts[0];
    const ruleParam = parts[1];
    const validator = validators[ruleName];
    if (validator && !validator(value, ruleParam)) {
      valid = false;
      const customMsg = input.getAttribute('data-msg-' + ruleName);
      errorMsg = customMsg ?? defaultMessages[ruleName] ?? 'Invalid';
      if (ruleParam) errorMsg = errorMsg.replace('{0}', ruleParam);
      break;
    }
  }

  field.classList.remove('mn-field--error', 'mn-field--success');
  const errorEl = field.querySelector('.mn-field__error') as HTMLElement | null;
  if (!valid) {
    field.classList.add('mn-field--error');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      if (!errorEl.id) {
        errorEl.id = 'mn-err-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      }
      errorEl.setAttribute('aria-live', 'assertive');
      errorEl.textContent = errorMsg;
      // Append error id while preserving other aria-describedby tokens
      const existing = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
      if (!existing.includes(errorEl.id)) {
        input.setAttribute('aria-describedby', [...existing, errorEl.id].join(' '));
      }
    }
  } else {
    input.removeAttribute('aria-invalid');
    if (errorEl) {
      // Remove only the error id token, preserving any other aria-describedby values
      const tokens = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(
        (t) => t && t !== errorEl.id,
      );
      if (tokens.length > 0) {
        input.setAttribute('aria-describedby', tokens.join(' '));
      } else {
        input.removeAttribute('aria-describedby');
      }
      errorEl.textContent = '';
    }
    if (value.length > 0) field.classList.add('mn-field--success');
  }
  return valid;
}

/** Validate all fields in a form. Returns true if all pass. */
export function validateForm(formEl: Element): boolean {
  const fields = formEl.querySelectorAll('.mn-field');
  let allValid = true;
  const errors: Element[] = [];
  fields.forEach((field) => {
    if (!validateField(field)) {
      allValid = false;
      errors.push(field);
    }
  });
  if (errors.length > 0) {
    errors[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    getFieldInput(errors[0])?.focus();
  }
  return allValid;
}

/** Enable live validation on a form. */
export function initLiveValidation(formOrSelector: string | Element): void {
  const form = typeof formOrSelector === 'string'
    ? document.querySelector(formOrSelector) : formOrSelector;
  if (!form) return;
  form.querySelectorAll('[data-validate]').forEach((inputEl) => {
    const input = inputEl as FormInputElement;
    const field = input.closest('.mn-field');
    if (!field) return;
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('input', () => {
      if (field.classList.contains('mn-field--error')) validateField(field);
      const counter = field.querySelector('.mn-field__counter') as HTMLElement | null;
      if (counter) {
        const max = input.getAttribute('maxlength') ?? input.getAttribute('data-maxlength');
        if (max) counter.textContent = input.value.length + '/' + max;
      }
    });
  });
  form.addEventListener('submit', (e: Event) => {
    if (!validateForm(form)) { e.preventDefault(); e.stopPropagation(); }
  });
}

/** Register a custom validator. */
export function addValidator(name: string, fn: FormValidator, message?: string): void {
  validators[name] = fn;
  if (message) defaultMessages[name] = message;
}

export { validators, defaultMessages };
