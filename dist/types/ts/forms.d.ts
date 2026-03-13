/**
 * Maranello Luce Design - Forms facade
 * Aggregates validation and widget initialization.
 */
import { validateForm, validateField, initLiveValidation, addValidator } from './forms-validate';
import { initAutoResize, initTagInput, initPasswordToggle, initFileUpload, initFormSteps, initInlineEdit, initCharCounter, initSearchClear } from './forms-widgets';
/** Initialize all form widgets within a root element. */
export declare function initForms(root?: Document | HTMLElement): void;
/** Forms public API object. */
export declare const forms: {
    readonly init: typeof initForms;
    readonly initAll: typeof initForms;
    readonly validate: typeof validateForm;
    readonly validateField: typeof validateField;
    readonly initLiveValidation: typeof initLiveValidation;
    readonly addValidator: typeof addValidator;
    readonly validators: import("./forms-validate").FormValidators;
    readonly defaultMessages: import("./forms-validate").FormMessages;
    readonly initAutoResize: typeof initAutoResize;
    readonly initTagInput: typeof initTagInput;
    readonly initPasswordToggle: typeof initPasswordToggle;
    readonly initFileUpload: typeof initFileUpload;
    readonly initFormSteps: typeof initFormSteps;
    readonly initInlineEdit: typeof initInlineEdit;
    readonly initCharCounter: typeof initCharCounter;
    readonly initSearchClear: typeof initSearchClear;
};
