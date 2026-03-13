/**
 * Unit tests for sanitization utilities.
 * sanitizeSvg uses DOMParser so we need happy-dom.
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  isValidColor,
  sanitizeAttr,
  sanitizeSvg,
  ALLOWED_BIND_PROPERTIES,
} from '../../src/ts/core/sanitize';

// --- escapeHtml ---

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });

  it('escapes less-than', () => {
    expect(escapeHtml('a<b')).toBe('a&lt;b');
  });

  it('escapes greater-than', () => {
    expect(escapeHtml('a>b')).toBe('a&gt;b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('a"b')).toBe('a&quot;b');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("a'b")).toBe('a&#39;b');
  });

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('passes through normal string without special chars', () => {
    expect(escapeHtml('hello world 123')).toBe('hello world 123');
  });

  it('escapes all special chars in a combined string', () => {
    expect(escapeHtml('<div class="x">&\'test\'')).toBe(
      '&lt;div class=&quot;x&quot;&gt;&amp;&#39;test&#39;',
    );
  });
});

// --- isValidColor ---

describe('isValidColor', () => {
  describe('valid colors', () => {
    it.each([
      ['#fff', '3-digit hex'],
      ['#FFF', '3-digit hex uppercase'],
      ['#ff00ff', '6-digit hex'],
      ['#FF00FF00', '8-digit hex with alpha'],
      ['#abcd', '4-digit hex with alpha'],
    ])('accepts %s (%s)', (color) => {
      expect(isValidColor(color)).toBe(true);
    });

    it('accepts rgb()', () => {
      expect(isValidColor('rgb(255, 0, 128)')).toBe(true);
    });

    it('accepts rgba()', () => {
      expect(isValidColor('rgba(255, 0, 128, 0.5)')).toBe(true);
    });

    it('accepts hsl()', () => {
      expect(isValidColor('hsl(120, 50%, 50%)')).toBe(true);
    });

    it('accepts hsla()', () => {
      expect(isValidColor('hsla(120, 50%, 50%, 0.8)')).toBe(true);
    });

    it.each(['red', 'blue', 'coral', 'rebeccapurple'])(
      'accepts named color: %s',
      (color) => {
        expect(isValidColor(color)).toBe(true);
      },
    );

    it.each(['transparent', 'currentColor', 'inherit', 'initial'])(
      'accepts CSS keyword: %s',
      (keyword) => {
        expect(isValidColor(keyword)).toBe(true);
      },
    );

    it('accepts var(--custom-prop)', () => {
      expect(isValidColor('var(--custom-prop)')).toBe(true);
    });

    it('accepts var(--color, #fff) with fallback', () => {
      expect(isValidColor('var(--color, #fff)')).toBe(true);
    });
  });

  describe('invalid colors', () => {
    it('rejects javascript: protocol', () => {
      expect(isValidColor('javascript:alert(1)')).toBe(false);
    });

    it('rejects expression()', () => {
      expect(isValidColor('expression(alert(1))')).toBe(false);
    });

    it('rejects url(javascript:)', () => {
      expect(isValidColor('url(javascript:alert(1))')).toBe(false);
    });

    it('rejects arbitrary strings', () => {
      expect(isValidColor('notacolor')).toBe(false);
    });

    it('rejects values with semicolons', () => {
      expect(isValidColor('red; background: url(evil)')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidColor('')).toBe(false);
    });

    it('rejects whitespace-only', () => {
      expect(isValidColor('   ')).toBe(false);
    });
  });
});

// --- sanitizeAttr ---

describe('sanitizeAttr', () => {
  it('escapes value when key is html', () => {
    expect(sanitizeAttr('html', '<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
  });

  it('passes through value for non-html keys', () => {
    expect(sanitizeAttr('title', '<b>bold</b>')).toBe('<b>bold</b>');
  });

  it('passes through value for class key', () => {
    expect(sanitizeAttr('class', 'mn-card active')).toBe('mn-card active');
  });
});

// --- sanitizeSvg ---

describe('sanitizeSvg', () => {
  it('passes through clean SVG', () => {
    const svg = '<svg><circle cx="10" cy="10" r="5"/></svg>';
    const result = sanitizeSvg(svg);
    expect(result).toContain('<circle');
    expect(result).toContain('<svg');
  });

  it('strips onload attribute', () => {
    const svg = '<svg onload="alert(1)"><rect width="10" height="10"/></svg>';
    const result = sanitizeSvg(svg);
    expect(result).not.toContain('onload');
    expect(result).toContain('<rect');
  });

  it('strips script elements', () => {
    const svg = '<svg><script>alert(1)</script><rect/></svg>';
    const result = sanitizeSvg(svg);
    expect(result).not.toContain('script');
  });

  it('strips foreignObject elements', () => {
    const svg = '<svg><foreignObject><div>hack</div></foreignObject></svg>';
    const result = sanitizeSvg(svg);
    expect(result).not.toContain('foreignObject');
    expect(result).not.toContain('foreignobject');
  });

  it('strips use with external href', () => {
    const svg = '<svg><use href="https://evil.com/sprite.svg#icon"/></svg>';
    const result = sanitizeSvg(svg);
    expect(result).not.toContain('evil.com');
  });

  it('keeps use with local #id reference', () => {
    const svg = '<svg><use href="#my-icon"/></svg>';
    const result = sanitizeSvg(svg);
    expect(result).toContain('#my-icon');
  });

  it('returns empty string for non-SVG input', () => {
    expect(sanitizeSvg('<div>not svg</div>')).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(sanitizeSvg('')).toBe('');
  });

  it('returns empty string for null-like input', () => {
    expect(sanitizeSvg(null as unknown as string)).toBe('');
    expect(sanitizeSvg(undefined as unknown as string)).toBe('');
  });
});

// --- ALLOWED_BIND_PROPERTIES ---

describe('ALLOWED_BIND_PROPERTIES', () => {
  it.each(['textContent', 'className', 'value', 'innerHTML'])(
    'contains %s',
    (prop) => {
      expect(ALLOWED_BIND_PROPERTIES.has(prop)).toBe(true);
    },
  );

  it.each(['onclick', 'onload', '__proto__'])(
    'does NOT contain %s',
    (prop) => {
      expect(ALLOWED_BIND_PROPERTIES.has(prop)).toBe(false);
    },
  );
});
