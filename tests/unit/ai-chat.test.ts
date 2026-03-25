/**
 * Unit tests for AI Chat DOM builder.
 * Tests buildUI structure, renderContent XSS escaping, and agent icon sanitization.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  buildUI,
  renderContent,
  ICON_SPARK,
} from '../../src/ts/ai-chat-dom';
import { sanitizeSvg } from '../../src/ts/core/sanitize';
import type { AIChatOptions } from '../../src/ts/ai-chat-dom';

const DEFAULT_OPTS: Required<AIChatOptions> = {
  onSend: () => null,
  onQuickAction: () => null,
  quickActions: [],
  placeholder: 'Ask something…',
  title: 'AI Assistant',
  welcomeMessage: null,
  avatar: null,
  agents: [],
  activeAgent: null,
  onAgentChange: () => {},
  onVoice: () => {},
};

// --- buildUI ---

describe('buildUI — DOM structure', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('appends the FAB button to the container', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const fab = container.querySelector('.mn-chat-fab');
    // Assert
    expect(fab).not.toBeNull();
    expect(fab?.tagName).toBe('BUTTON');
  });

  it('appends the chat panel to the container', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const panel = container.querySelector('.mn-chat-panel');
    // Assert
    expect(panel).not.toBeNull();
  });

  it('chat panel has role="dialog"', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const panel = container.querySelector('.mn-chat-panel');
    // Assert
    expect(panel?.getAttribute('role')).toBe('dialog');
  });

  it('messages area is present inside panel', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const msgs = container.querySelector('.mn-chat-panel__messages');
    // Assert
    expect(msgs).not.toBeNull();
  });

  it('textarea input is present inside panel', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const input = container.querySelector('textarea.mn-chat-panel__input');
    // Assert
    expect(input).not.toBeNull();
  });

  it('send button is present inside panel', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const send = container.querySelector('.mn-chat-panel__send');
    // Assert
    expect(send).not.toBeNull();
    expect(send?.tagName).toBe('BUTTON');
  });

  it('close button has aria-label', () => {
    // Arrange
    buildUI(container, DEFAULT_OPTS);
    // Act
    const close = container.querySelector('.mn-chat-panel__close');
    // Assert
    expect(close?.getAttribute('aria-label')).toBe('Close chat');
  });

  it('returns controller with expected shape', () => {
    // Arrange / Act
    const ui = buildUI(container, DEFAULT_OPTS);
    // Assert
    expect(ui).toHaveProperty('fab');
    expect(ui).toHaveProperty('panel');
    expect(ui).toHaveProperty('messagesEl');
    expect(ui).toHaveProperty('inputEl');
    expect(ui).toHaveProperty('sendBtn');
  });

  it('uses custom placeholder text on textarea', () => {
    // Arrange
    const opts = { ...DEFAULT_OPTS, placeholder: 'Type here…' };
    // Act
    buildUI(container, opts);
    const input = container.querySelector('textarea.mn-chat-panel__input');
    // Assert
    expect(input?.getAttribute('placeholder')).toBe('Type here…');
  });

  it('renders avatar img inside FAB when avatar is provided', () => {
    // Arrange
    const opts = { ...DEFAULT_OPTS, avatar: 'https://example.com/avatar.png' };
    // Act
    buildUI(container, opts);
    const fabImg = container.querySelector('.mn-chat-fab__avatar');
    // Assert
    expect(fabImg).not.toBeNull();
  });
});

// --- renderContent ---

describe('renderContent — XSS escaping', () => {
  it('escapes HTML tags in plain text', () => {
    // Arrange
    const input = '<script>alert("xss")</script>';
    // Act
    const frag = renderContent(input);
    const div = document.createElement('div');
    div.appendChild(frag);
    // Assert: no live script element
    expect(div.querySelector('script')).toBeNull();
    expect(div.innerHTML).not.toContain('<script>');
  });

  it('escapes angle brackets', () => {
    // Arrange / Act
    const frag = renderContent('<img src=x onerror=alert(1)>');
    const div = document.createElement('div');
    div.appendChild(frag);
    // Assert
    expect(div.querySelector('img')).toBeNull();
    expect(div.innerHTML).toContain('&lt;img');
  });

  it('preserves plain text content', () => {
    // Arrange / Act
    const frag = renderContent('Hello world');
    const div = document.createElement('div');
    div.appendChild(frag);
    // Assert
    expect(div.textContent).toContain('Hello world');
  });

  it('renders code blocks without executing them', () => {
    // Arrange
    const input = '```\nconst x = 1;\n```';
    // Act
    const frag = renderContent(input);
    const div = document.createElement('div');
    div.appendChild(frag);
    // Assert
    expect(div.querySelector('pre')).not.toBeNull();
    expect(div.querySelector('script')).toBeNull();
  });

  it('does not inject raw HTML from bold markdown', () => {
    // Arrange — bold markdown is rendered as <strong>, not raw injection
    const input = '**safe text**';
    // Act
    const frag = renderContent(input);
    const div = document.createElement('div');
    div.appendChild(frag);
    // Assert: strong element is safe; no arbitrary tag injection
    expect(div.innerHTML).toContain('<strong>safe text</strong>');
  });
});

// --- ICON_SPARK sanitization ---

describe('ICON_SPARK — agent icon SVG safety', () => {
  it('ICON_SPARK contains SVG markup', () => {
    // Assert
    expect(ICON_SPARK).toContain('<svg');
  });

  it('ICON_SPARK has no <script> tags', () => {
    // Assert
    expect(ICON_SPARK.toLowerCase()).not.toContain('<script');
  });

  it('ICON_SPARK has no event handler attributes (onload etc.)', () => {
    // Assert
    expect(ICON_SPARK).not.toMatch(/\bon\w+\s*=/i);
  });

  it('sanitizeSvg passes ICON_SPARK through without removing content', () => {
    // Arrange / Act
    const result = sanitizeSvg(ICON_SPARK);
    // Assert: non-empty, still contains SVG path
    expect(result).toContain('<svg');
    expect(result).not.toBe('');
  });

  it('sanitizeSvg strips injected onload from agent icon', () => {
    // Arrange
    const evil = '<svg onload="alert(1)"><path d="M1 1"/></svg>';
    // Act
    const result = sanitizeSvg(evil);
    // Assert
    expect(result).not.toContain('onload');
    expect(result).toContain('<path');
  });

  it('sanitizeSvg strips <script> inside SVG', () => {
    const evil = '<svg><script>alert(1)</script><circle/></svg>';
    const result = sanitizeSvg(evil);
    expect(result).not.toContain('script');
  });
});

// --- Embedded mode ---

describe('buildUI — embedded mode', () => {
  let container: HTMLElement;
  const EMBEDDED_OPTS: Required<AIChatOptions> = {
    ...DEFAULT_OPTS,
    mode: 'embedded' as const,
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('does not append FAB in embedded mode', () => {
    buildUI(container, EMBEDDED_OPTS);
    expect(container.querySelector('.mn-chat-fab')).toBeNull();
  });

  it('panel has mn-chat-panel--embedded class', () => {
    buildUI(container, EMBEDDED_OPTS);
    const panel = container.querySelector('.mn-chat-panel');
    expect(panel?.classList.contains('mn-chat-panel--embedded')).toBe(true);
  });

  it('panel has role="region" instead of dialog', () => {
    buildUI(container, EMBEDDED_OPTS);
    const panel = container.querySelector('.mn-chat-panel');
    expect(panel?.getAttribute('role')).toBe('region');
  });

  it('does not render close or resize buttons in header', () => {
    buildUI(container, EMBEDDED_OPTS);
    const close = container.querySelector('.mn-chat-panel__close');
    const resize = container.querySelector('.mn-chat-panel__header-actions button');
    expect(close?.innerHTML ?? '').toBe('');
    expect(resize).toBeNull();
  });

  it('panel does not have accent bar', () => {
    buildUI(container, EMBEDDED_OPTS);
    expect(container.querySelector('.mn-chat-panel__accent')).toBeNull();
  });

  it('state.isOpen is true by default', () => {
    const ui = buildUI(container, EMBEDDED_OPTS);
    expect(ui.state.isOpen).toBe(true);
  });
});

// --- Streaming support ---

describe('aiChat — streaming addMessage', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('returns StreamingHandle with append and finish', async () => {
    const { aiChat } = await import('../../src/ts/ai-chat-iife');
    const ctrl = aiChat(container, { mode: 'embedded' });
    const handle = ctrl.addMessage('ai', '', { streaming: true });
    expect(handle).toHaveProperty('append');
    expect(handle).toHaveProperty('finish');
    expect(handle).toHaveProperty('message');
    ctrl.destroy();
  });

  it('append adds tokens to the message content', async () => {
    const { aiChat } = await import('../../src/ts/ai-chat-iife');
    const ctrl = aiChat(container, { mode: 'embedded' });
    const handle = ctrl.addMessage('ai', '', { streaming: true }) as import('../../src/ts/ai-chat-dom').StreamingHandle;
    handle.append('Hello');
    handle.append(' world');
    expect(handle.message.content).toBe('Hello world');
    ctrl.destroy();
  });

  it('finish renders final markdown and adds timestamp', async () => {
    const { aiChat } = await import('../../src/ts/ai-chat-iife');
    const ctrl = aiChat(container, { mode: 'embedded' });
    const handle = ctrl.addMessage('ai', '', { streaming: true }) as import('../../src/ts/ai-chat-dom').StreamingHandle;
    handle.append('**bold**');
    handle.finish();
    const msg = container.querySelector('.mn-chat-msg--ai');
    expect(msg?.classList.contains('mn-chat-msg--streaming')).toBe(false);
    expect(msg?.querySelector('strong')).not.toBeNull();
    const time = msg?.querySelector('.mn-chat-msg__time');
    expect(time?.textContent).not.toBe('');
    ctrl.destroy();
  });

  it('non-streaming addMessage still returns AIChatMessage', async () => {
    const { aiChat } = await import('../../src/ts/ai-chat-iife');
    const ctrl = aiChat(container, { mode: 'embedded' });
    const result = ctrl.addMessage('ai', 'Normal message');
    expect(result).toHaveProperty('role');
    expect(result).toHaveProperty('content');
    expect(result).not.toHaveProperty('append');
    ctrl.destroy();
  });
});
