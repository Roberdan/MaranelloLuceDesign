/**
 * Maranello Luce Design - Sanitization utilities
 * XSS prevention, input validation, and safe HTML/SVG handling.
 */
/** Escape HTML special characters to prevent XSS injection. */
export declare function escapeHtml(str: string): string;
/** Sanitize an HTML string by escaping all special characters. */
export declare function sanitizeHtml(str: string): string;
/** Validate a CSS color value. Rejects javascript:, expression(), unsafe url(). */
export declare function isValidColor(val: string): boolean;
/** Sanitize an attribute value. HTML content is escaped; other values pass through. */
export declare function sanitizeAttr(key: string, val: string): string;
/**
 * Sanitize an SVG string by parsing and stripping dangerous elements/attributes.
 * Removes script, foreignObject, event handlers (on*), and external <use> hrefs.
 */
export declare function sanitizeSvg(svgString: string): string;
/** Allowed property names for data binding. */
export declare const ALLOWED_BIND_PROPERTIES: Set<string>;
