/**
 * Unit tests for form accessibility: aria-describedby, aria-invalid, aria-required.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { validateField, initLiveValidation } from '../../src/ts/forms-validate';

function buildField(rules: string, value = ''): HTMLElement {
  const field = document.createElement('div');
  field.className = 'mn-field';
  const input = document.createElement('input');
  input.className = 'mn-form-input';
  input.setAttribute('data-validate', rules);
  input.value = value;
  const error = document.createElement('span');
  error.className = 'mn-field__error';
  field.append(input, error);
  return field;
}

describe('forms accessibility', () => {
  it('sets aria-invalid=true on validation failure', () => {
    const field = buildField('required', '');
    validateField(field);
    const input = field.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('removes aria-invalid on validation pass', () => {
    const field = buildField('required', '');
    validateField(field);
    const input = field.querySelector('input')!;
    input.value = 'filled';
    validateField(field);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('links error via aria-describedby', () => {
    const field = buildField('required', '');
    validateField(field);
    const input = field.querySelector('input')!;
    const error = field.querySelector('.mn-field__error')!;
    expect(error.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('removes error from aria-describedby on pass', () => {
    const field = buildField('required', '');
    validateField(field);
    const input = field.querySelector('input')!;
    input.value = 'ok';
    validateField(field);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('error element has aria-live=assertive', () => {
    const field = buildField('required', '');
    validateField(field);
    const error = field.querySelector('.mn-field__error')!;
    expect(error.getAttribute('aria-live')).toBe('assertive');
  });

  it('initLiveValidation sets aria-required on required fields', () => {
    const form = document.createElement('form');
    const field = buildField('required,email');
    form.appendChild(field);
    document.body.appendChild(form);
    initLiveValidation(form);
    const input = field.querySelector('input')!;
    expect(input.getAttribute('aria-required')).toBe('true');
    form.remove();
  });
});
