/**
 * Unit tests for Web Component lifecycle and registry utilities.
 * Tests isRegistered, getAvailableTags, attribute observation, and element creation.
 * WC .js files use import.meta.url which is unavailable in happy-dom, so we
 * register minimal stub elements to exercise the customElements API and helpers.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { isRegistered, getAvailableTags } from '../../src/wc/index';

// ---------------------------------------------------------------------------
// Minimal stub elements — mirror the real WC shape without file I/O
// ---------------------------------------------------------------------------

/** Track attributeChangedCallback invocations per element instance. */
const callLog: Array<{ name: string; oldVal: string | null; newVal: string | null }> = [];

class StubToast extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'message', 'type', 'duration'];
  }

  connectedCallback(): void {
    this._render();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    callLog.push({ name, oldVal, newVal });
    if (this.isConnected) this._render();
  }

  _render(): void {
    this.dataset.rendered = 'true';
  }
}

class StubThemeToggle extends HTMLElement {
  static get observedAttributes() {
    return ['mode'];
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    callLog.push({ name, oldVal, newVal });
  }
}

class StubModal extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'title'];
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    callLog.push({ name, oldVal, newVal });
  }
}

beforeAll(() => {
  // Register stubs only if not already registered (happy-dom persists across tests)
  if (!customElements.get('mn-toast')) {
    customElements.define('mn-toast', StubToast);
  }
  if (!customElements.get('mn-theme-toggle')) {
    customElements.define('mn-theme-toggle', StubThemeToggle);
  }
  if (!customElements.get('mn-modal')) {
    customElements.define('mn-modal', StubModal);
  }
});

// --- isRegistered ---

describe('isRegistered', () => {
  it('returns true for mn-toast after define', () => {
    // Assert
    expect(isRegistered('mn-toast')).toBe(true);
  });

  it('returns true for mn-theme-toggle after define', () => {
    // Assert
    expect(isRegistered('mn-theme-toggle')).toBe(true);
  });

  it('returns true for mn-modal after define', () => {
    // Assert
    expect(isRegistered('mn-modal')).toBe(true);
  });

  it('returns false for a tag that was never defined', () => {
    // Assert — mn-chart is NOT registered in this test suite
    expect(isRegistered('mn-chart')).toBe(false);
  });
});

// --- getAvailableTags ---

describe('getAvailableTags', () => {
  it('returns a non-empty readonly array', () => {
    // Act
    const tags = getAvailableTags();
    // Assert
    expect(tags.length).toBeGreaterThan(0);
  });

  it('includes all 24 expected WC tags', () => {
    // Arrange
    const expected = [
      'mn-a11y', 'mn-chart', 'mn-chat', 'mn-command-palette', 'mn-data-table',
      'mn-date-picker', 'mn-detail-panel', 'mn-ferrari-control', 'mn-funnel',
      'mn-gantt', 'mn-gauge', 'mn-hbar', 'mn-login', 'mn-map', 'mn-mapbox',
      'mn-modal', 'mn-okr', 'mn-profile', 'mn-speedometer', 'mn-system-status',
      'mn-tab', 'mn-tabs', 'mn-theme-toggle', 'mn-toast',
    ];
    // Act
    const tags = getAvailableTags();
    // Assert
    for (const tag of expected) {
      expect(tags).toContain(tag);
    }
  });

  it('every tag starts with "mn-"', () => {
    // Act
    const tags = getAvailableTags();
    // Assert
    for (const tag of tags) {
      expect(tag.startsWith('mn-')).toBe(true);
    }
  });

  it('returns a readonly array (no push method on the type)', () => {
    // Act
    const tags = getAvailableTags();
    // Assert: array-like, no mutation possible (readonly at type level)
    expect(Array.isArray(tags)).toBe(true);
  });
});

// --- Custom element attribute changes ---

describe('Custom element — attributeChangedCallback', () => {
  beforeAll(() => {
    callLog.length = 0; // reset before attribute tests
  });

  it('StubToast responds to "title" attribute change', () => {
    // Arrange
    const el = document.createElement('mn-toast') as StubToast;
    document.body.appendChild(el);
    // Act
    el.setAttribute('title', 'Race Alert');
    // Assert
    const entry = callLog.find((e) => e.name === 'title' && e.newVal === 'Race Alert');
    expect(entry).toBeDefined();
  });

  it('StubToast responds to "type" attribute change', () => {
    // Arrange
    const el = document.createElement('mn-toast') as StubToast;
    document.body.appendChild(el);
    // Act
    el.setAttribute('type', 'success');
    // Assert
    const entry = callLog.find((e) => e.name === 'type' && e.newVal === 'success');
    expect(entry).toBeDefined();
  });

  it('StubThemeToggle responds to "mode" attribute change', () => {
    // Arrange
    const el = document.createElement('mn-theme-toggle') as StubThemeToggle;
    document.body.appendChild(el);
    // Act
    el.setAttribute('mode', 'avorio');
    // Assert
    const entry = callLog.find((e) => e.name === 'mode' && e.newVal === 'avorio');
    expect(entry).toBeDefined();
  });

  it('StubModal responds to "open" attribute change', () => {
    // Arrange
    const el = document.createElement('mn-modal') as StubModal;
    document.body.appendChild(el);
    // Act
    el.setAttribute('open', '');
    // Assert
    const entry = callLog.find((e) => e.name === 'open' && e.newVal === '');
    expect(entry).toBeDefined();
  });

  it('unrelated attribute does not trigger attributeChangedCallback', () => {
    // Arrange
    callLog.length = 0;
    const el = document.createElement('mn-modal') as StubModal;
    document.body.appendChild(el);
    // Act: set an attribute NOT in observedAttributes
    el.setAttribute('data-custom', 'value');
    // Assert
    const entry = callLog.find((e) => e.name === 'data-custom');
    expect(entry).toBeUndefined();
  });
});

// --- Element creation and connection ---

describe('Custom element — connectedCallback', () => {
  it('mn-toast connects and sets data-rendered', () => {
    // Arrange / Act
    const el = document.createElement('mn-toast') as StubToast;
    document.body.appendChild(el);
    // Assert
    expect(el.isConnected).toBe(true);
    expect(el.dataset.rendered).toBe('true');
    expect(el.tagName.toLowerCase()).toBe('mn-toast');
  });

  it('mn-theme-toggle element can be created and appended', () => {
    // Arrange / Act
    const el = document.createElement('mn-theme-toggle');
    document.body.appendChild(el);
    // Assert
    expect(el.isConnected).toBe(true);
  });
});

// --- observedAttributes contract ---

describe('Custom element — observedAttributes', () => {
  it('StubToast observes title, message, type, duration', () => {
    // Assert
    expect(StubToast.observedAttributes).toContain('title');
    expect(StubToast.observedAttributes).toContain('message');
    expect(StubToast.observedAttributes).toContain('type');
    expect(StubToast.observedAttributes).toContain('duration');
  });

  it('StubThemeToggle observes mode only', () => {
    // Assert
    expect(StubThemeToggle.observedAttributes).toEqual(['mode']);
  });

  it('StubModal observes open and title', () => {
    // Assert
    expect(StubModal.observedAttributes).toContain('open');
    expect(StubModal.observedAttributes).toContain('title');
  });
});
