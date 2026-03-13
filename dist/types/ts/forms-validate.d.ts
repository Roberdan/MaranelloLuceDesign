/**
 * Maranello Luce Design - Form validation
 * Field and form validation with built-in validators.
 */
export type FormInputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormValidator = (value: unknown, param?: string) => boolean;
export interface FormValidators {
    [name: string]: FormValidator;
}
export interface FormMessages {
    [name: string]: string;
}
declare const validators: FormValidators;
declare const defaultMessages: FormMessages;
/** Get the form-control input element from a field wrapper. */
export declare function getFieldInput(field: Element): FormInputElement | null;
/** Validate a single field against its data-validate rules. */
export declare function validateField(field: Element): boolean;
/** Validate all fields in a form. Returns true if all pass. */
export declare function validateForm(formEl: Element): boolean;
/** Enable live validation on a form. */
export declare function initLiveValidation(formOrSelector: string | Element): void;
/** Register a custom validator. */
export declare function addValidator(name: string, fn: FormValidator, message?: string): void;
export { validators, defaultMessages };
