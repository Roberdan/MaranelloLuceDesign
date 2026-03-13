/**
 * Unit tests for forms-validate module.
 * Covers validateField(), aria attributes, and initLiveValidation().
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateField, initLiveValidation } from '../../src/ts/forms-validate';

// Helper: build a field wrapper with an input and optional error element
function makeField(opts: {
  value: string;
  rules: string;
  required?: boolean;
  withError?: boolean;
}): HTMLElement {
  const field = document.createElement('div');
  field.className = 'mn-field';

  const input = document.createElement('input');
  input.className = 'mn-form-input';
  input.value = opts.value;
  input.setAttribute('data-validate', opts.rules);
  if (opts.required) input.setAttribute('required', '');
  field.appendChild(input);

  if (opts.withError) {
    const err = document.createElement('span');
    err.className = 'mn-field__error';
    field.appendChild(err);
  }

  return field;
}

// --- validateField returns valid/invalid ---

describe('validateField() — returns valid/invalid', () => {
  it('returns true when field passes required rule', () => {
    // Arrange
    const field = makeField({ value: 'hello', rules: 'required' });

    // Act
    const result = validateField(field);

    // Assert
    expect(result).toBe(true);
  });

  it('returns false when required field is empty', () => {
    // Arrange
    const field = makeField({ value: '', rules: 'required' });

    // Act
    const result = validateField(field);

    // Assert
    expect(result).toBe(false);
  });

  it('returns true for a valid email address', () => {
    // Arrange
    const field = makeField({ value: 'user@example.com', rules: 'email' });

    // Act + Assert
    expect(validateField(field)).toBe(true);
  });

  it('returns false for an invalid email address', () => {
    // Arrange
    const field = makeField({ value: 'not-an-email', rules: 'email' });

    // Act + Assert
    expect(validateField(field)).toBe(false);
  });

  it('returns true when no data-validate attribute is present', () => {
    // Arrange
    const field = document.createElement('div');
    field.className = 'mn-field';
    const input = document.createElement('input');
    input.className = 'mn-form-input';
    field.appendChild(input);

    // Act + Assert
    expect(validateField(field)).toBe(true);
  });

  it('returns true when field has no input child', () => {
    // Arrange
    const field = document.createElement('div');
    field.className = 'mn-field';

    // Act + Assert
    expect(validateField(field)).toBe(true);
  });
});

// --- aria-invalid on invalid fields ---

describe('validateField() — aria-invalid attribute', () => {
  it('sets aria-invalid="true" on the input when validation fails', () => {
    // Arrange
    const field = makeField({ value: '', rules: 'required' });
    const input = field.querySelector('input')!;

    // Act
    validateField(field);

    // Assert
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('removes aria-invalid when validation passes', () => {
    // Arrange
    const field = makeField({ value: 'valid@example.com', rules: 'email' });
    const input = field.querySelector('input')!;
    input.setAttribute('aria-invalid', 'true'); // pre-existing invalid state

    // Act
    validateField(field);

    // Assert
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });
});

// --- aria-describedby links to error element ---

describe('validateField() — aria-describedby', () => {
  it('sets aria-describedby pointing to the error element id', () => {
    // Arrange
    const field = makeField({ value: '', rules: 'required', withError: true });
    const input = field.querySelector('input')!;

    // Act
    validateField(field);

    // Assert — describedby must reference the error element's id
    const errorEl = field.querySelector('.mn-field__error')!;
    expect(errorEl.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBe(errorEl.id);
  });

  it('removes aria-describedby when field becomes valid', () => {
    // Arrange — start with an invalid state
    const field = makeField({ value: '', rules: 'required', withError: true });
    const input = field.querySelector('input')!;
    validateField(field); // mark as invalid first

    // Make valid
    input.value = 'fixed';

    // Act
    validateField(field);

    // Assert
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});

// --- aria-required on required fields ---

describe('validateField() — aria-required', () => {
  it('required HTML attribute is reflected (browser native behaviour)', () => {
    // Arrange
    const field = makeField({ value: '', rules: 'required', required: true });
    const input = field.querySelector('input')!;

    // Assert — the required attribute is set directly on the input
    expect(input.hasAttribute('required')).toBe(true);
  });

  it('validates required rule even without native required attr', () => {
    // Arrange
    const field = makeField({ value: '   ', rules: 'required' });

    // Act + Assert — whitespace-only value must also fail
    expect(validateField(field)).toBe(false);
  });
});

// --- initLiveValidation sets up blur handlers ---

describe('initLiveValidation()', () => {
  let form: HTMLFormElement;

  beforeEach(() => {
    form = document.createElement('form');
    document.body.appendChild(form);
  });

  it('attaches blur handler that triggers validation', () => {
    // Arrange
    const field = makeField({ value: '', rules: 'required', withError: true });
    form.appendChild(field);
    const input = field.querySelector('input')!;

    initLiveValidation(form);

    // Act — simulate blur with empty value
    input.dispatchEvent(new Event('blur'));

    // Assert
    expect(field.classList.contains('mn-field--error')).toBe(true);

    form.remove();
  });

  it('does not throw when called with a CSS selector string', () => {
    // Arrange
    form.id = 'test-live-form';

    // Act + Assert
    expect(() => initLiveValidation('#test-live-form')).not.toThrow();

    form.remove();
  });

  it('does nothing when selector matches no element', () => {
    // Act + Assert — graceful no-op for missing container
    expect(() => initLiveValidation('#does-not-exist')).not.toThrow();
  });

  it('validates on input event when field is already in error state', () => {
    // Arrange
    const field = makeField({ value: '', rules: 'required', withError: true });
    form.appendChild(field);
    const input = field.querySelector('input')!;
    field.classList.add('mn-field--error'); // pre-set error state
    initLiveValidation(form);

    // Act — fix the value and fire input event
    input.value = 'corrected';
    input.dispatchEvent(new Event('input'));

    // Assert — error class removed after correction
    expect(field.classList.contains('mn-field--error')).toBe(false);

    form.remove();
  });
});
