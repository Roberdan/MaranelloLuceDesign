/**
 * Maranello Luce Design - Sanitization utilities
 * XSS prevention, input validation, and safe HTML/SVG handling.
 */

/** Escape HTML special characters to prevent XSS injection. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Sanitize an HTML string by escaping all special characters. */
export function sanitizeHtml(str: string): string {
  return escapeHtml(str);
}

const HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_RE = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
const HSL_RE = /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
/* Matches var(--custom-prop) and var(--prop, fallback) */
const CSS_VAR_RE = /^var\(--[\w-]+(?:\s*,\s*[^)]+)?\)$/;

const CSS_KEYWORDS = new Set([
  'transparent', 'currentColor', 'currentcolor', 'inherit', 'initial',
  'unset', 'revert',
]);

/* CSS named colors (Level 4) - lowercase for matching */
const NAMED_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige',
  'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown',
  'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
  'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan',
  'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
  'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
  'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink',
  'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick',
  'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite',
  'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
  'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki',
  'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray',
  'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
  'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue',
  'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
  'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
  'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
  'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
  'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive',
  'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip',
  'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
  'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown',
  'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
  'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
  'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato',
  'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow',
  'yellowgreen',
]);

/** Validate a CSS color value. Rejects javascript:, expression(), unsafe url(). */
export function isValidColor(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (!trimmed) return false;

  /* Reject dangerous patterns */
  const lower = trimmed.toLowerCase();
  if (lower.includes('javascript:')) return false;
  if (lower.includes('expression(')) return false;
  if (lower.includes(';')) return false;
  if (lower.includes('url(')) return false;

  if (HEX_RE.test(trimmed)) return true;
  if (RGB_RE.test(trimmed)) return true;
  if (HSL_RE.test(trimmed)) return true;
  if (CSS_VAR_RE.test(trimmed)) return true;
  if (CSS_KEYWORDS.has(lower)) return true;
  if (NAMED_COLORS.has(lower)) return true;

  return false;
}

/** Sanitize an attribute value. HTML content is escaped; other values pass through. */
export function sanitizeAttr(key: string, val: string): string {
  if (key === 'html') return escapeHtml(val);
  return val;
}

const SAFE_SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
  'g', 'text', 'defs', 'clippath',
]);

const DANGEROUS_SVG_TAGS = new Set([
  'script', 'foreignobject',
]);

/**
 * Sanitize an SVG string by parsing and stripping dangerous elements/attributes.
 * Removes script, foreignObject, event handlers (on*), and external <use> hrefs.
 */
export function sanitizeSvg(svgString: string): string {
  if (!svgString || typeof svgString !== 'string') return '';

  const doc = new DOMParser().parseFromString(svgString, 'text/html');
  const svg = doc.querySelector('svg');
  if (!svg) return '';

  cleanSvgNode(svg);
  return svg.outerHTML;
}

/** Recursively clean an SVG element tree. */
function cleanSvgNode(el: Element): void {
  /* Remove event handler attributes (on*) */
  for (const attr of Array.from(el.attributes)) {
    if (attr.name.toLowerCase().startsWith('on')) {
      el.removeAttribute(attr.name);
    }
  }

  const children = Array.from(el.children);
  for (const child of children) {
    const tag = child.tagName.toLowerCase();

    if (DANGEROUS_SVG_TAGS.has(tag)) {
      child.remove();
      continue;
    }

    /* <use> with external href is dangerous */
    if (tag === 'use') {
      const href = child.getAttribute('href') ?? child.getAttribute('xlink:href') ?? '';
      if (href && !href.startsWith('#')) {
        child.remove();
        continue;
      }
    }

    /* Strip animate elements with dangerous attrs */
    if (tag.startsWith('animate')) {
      const attrName = child.getAttribute('attributeName') ?? '';
      if (attrName.toLowerCase().startsWith('on') || attrName === 'href') {
        child.remove();
        continue;
      }
    }

    if (!SAFE_SVG_TAGS.has(tag) && tag !== 'use' && !tag.startsWith('animate')) {
      child.remove();
      continue;
    }

    cleanSvgNode(child);
  }
}

/** Allowed property names for data binding. */
export const ALLOWED_BIND_PROPERTIES: Set<string> = new Set([
  'textContent', 'className', 'value', 'checked', 'disabled', 'hidden',
  'src', 'href', 'alt', 'title', 'placeholder',
  'aria-label', 'aria-hidden', 'aria-expanded', 'aria-selected',
  'aria-describedby', 'aria-invalid',
  'innerHTML',
]);
