/** AI Chat DOM builder — FAB, header, messages area, input, agent selector. */
import { icons } from './icons';
import { escapeHtml, sanitizeAttr } from './core/sanitize';

export type ChatRole = 'user' | 'ai';
export interface AIChatMessage { role: ChatRole; content: string; time: Date; }
export interface AIChatAgent { id: string; label: string; icon?: string; }
export interface AIChatResponse { content?: string; }
export interface StreamingHandle { append: (token: string) => void; finish: () => void; message: AIChatMessage; }
export interface AddMessageOptions { streaming?: boolean; }

type HandlerReturn = string | AIChatResponse | Promise<string | AIChatResponse> | null | undefined;

export interface AIChatOptions {
  mode?: 'fab' | 'embedded';
  onSend?: (msg: string) => HandlerReturn;
  onQuickAction?: (action: string, ctx: string | null) => HandlerReturn;
  quickActions?: string[];
  placeholder?: string;
  title?: string;
  welcomeMessage?: string | null;
  avatar?: string | null;
  agents?: AIChatAgent[];
  activeAgent?: string | null;
  onAgentChange?: (agentId: string, agent: AIChatAgent) => void;
  onVoice?: (isListening: boolean) => void;
  voiceAdapter?: import('./voice-input').VoiceAdapter;
}

export interface AIChatController {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
  addMessage: (role: ChatRole, content: string, opts?: AddMessageOptions) => AIChatMessage | StreamingHandle;
  setTyping: (show: boolean) => void;
  clear: () => void;
  showPulse: () => void;
  destroy: () => void;
}

export const ICON_SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/><path d="M18 14l1 3.5L22.5 18l-3.5 1L18 22.5l-1-3.5L13.5 18l3.5-1L18 14z" opacity=".6"/></svg>';

const FALLBACK_ICONS: Record<string, string> = {
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0014 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
  expandHorizontal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8 3 3 8 3"/><line x1="3" y1="3" x2="10" y2="10"/><polyline points="21 16 21 21 16 21"/><line x1="14" y1="14" x2="21" y2="21"/><polyline points="16 3 21 3 21 8"/><line x1="14" y1="10" x2="21" y2="3"/><polyline points="8 21 3 21 3 16"/><line x1="10" y1="14" x2="3" y2="21"/></svg>',
};

export function getIcon(name: string): string {
  if (icons[name]) return icons[name]();
  return FALLBACK_ICONS[name] ?? '';
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls: string,
  attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') e.textContent = v;
      // SVG markup from the internal icons module is trusted — assign directly.
      // User-supplied html strings must be escaped to prevent XSS.
      else if (k === 'html') e.innerHTML = String(v).trimStart().startsWith('<svg') ? String(v) : escapeHtml(String(v));
      else e.setAttribute(k, sanitizeAttr(k, v));
    }
  }
  return e;
}

export function formatTime(date: Date): string {
  const h = date.getHours(), m = date.getMinutes();
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

export function renderContent(text: string): DocumentFragment {
  const container = document.createDocumentFragment();
  const parts = text.split(/(```[\s\S]*?```)/g);

  for (const part of parts) {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w*\n/, '');
      const block = el('div', 'mn-chat-msg__code');
      const pre = el('pre', '');
      pre.textContent = code;
      block.appendChild(pre);
      const copyBtn = el('button', 'mn-chat-msg__copy', { 'aria-label': 'Copy code' });
      copyBtn.innerHTML = getIcon('copy');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = getIcon('checkCircle');
          setTimeout(() => { copyBtn.innerHTML = getIcon('copy'); }, 1500);
        });
      });
      block.appendChild(copyBtn);
      container.appendChild(block);
    } else if (part) {
      const span = el('span', '');
      span.innerHTML = escapeHtml(part)
        .replace(/`([^`]+)`/g, '<code class="mn-chat-msg__code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      container.appendChild(span);
    }
  }
  return container;
}

export interface ChatUIElements {
  state: ChatUIState;
  fab: HTMLButtonElement;
  pulse: HTMLSpanElement;
  panel: HTMLDivElement;
  resizeHandle: HTMLDivElement;
  closeBtn: HTMLButtonElement;
  widthBtn: HTMLButtonElement;
  agentSelector: HTMLButtonElement;
  agentSelectorLabel: HTMLSpanElement;
  agentGrid: HTMLDivElement;
  messagesEl: HTMLDivElement;
  typingEl: HTMLDivElement;
  quickBar: HTMLDivElement;
  inputEl: HTMLTextAreaElement;
  sendBtn: HTMLButtonElement;
  voiceBtn: HTMLButtonElement;
}

export interface ChatUIState {
  isOpen: boolean;
  isTyping: boolean;
  messages: AIChatMessage[];
  panelHeight: number;
  isListening: boolean;
  panelWidthMode: string;
  isAgentGridOpen: boolean;
  activeAgentId: string | null;
  addMessage?: (role: string, content: string, opts?: AddMessageOptions) => AIChatMessage | StreamingHandle;
  setTyping?: (show: boolean) => void;
  clear?: () => void;
  toggleAgentGrid?: (forceState?: boolean) => void;
  onDocumentClick?: (e: MouseEvent) => void;
  destroyMessages?: () => void;
}

export function buildUI(container: HTMLElement, opts: Required<AIChatOptions>): ChatUIElements {
  const embedded = opts.mode === 'embedded';
  const state: ChatUIState = {
    isOpen: embedded, isTyping: false, messages: [],
    panelHeight: 520, isListening: false, panelWidthMode: 'normal',
    isAgentGridOpen: false,
    activeAgentId: opts.activeAgent ?? (opts.agents?.[0]?.id ?? null),
  };

  const fab = el('button', 'mn-chat-fab', { 'aria-label': 'Open AI assistant', title: 'AI Assistant' });
  const pulse = el('span', 'mn-chat-fab__pulse');
  if (!embedded) {
    if (opts.avatar) {
      const fabImg = document.createElement('img');
      fabImg.src = opts.avatar;
      fabImg.className = 'mn-chat-fab__avatar';
      fabImg.alt = 'AI';
      fab.appendChild(fabImg);
    } else {
      fab.innerHTML = ICON_SPARK;
    }
    fab.appendChild(pulse);
    container.appendChild(fab);
  }

  const panelCls = embedded ? 'mn-chat-panel mn-chat-panel--embedded' : 'mn-chat-panel';
  const panel = el('div', panelCls, { role: embedded ? 'region' : 'dialog', 'aria-label': 'AI assistant chat' });
  if (!embedded) panel.appendChild(el('div', 'mn-chat-panel__accent'));
  const resizeHandle = el('div', 'mn-chat-panel__resize');
  if (!embedded) panel.appendChild(resizeHandle);

  const header = el('div', 'mn-chat-panel__header');
  const headerLeft = el('div', 'mn-chat-panel__header-left');
  if (opts.avatar) {
    const ha = el('img', 'mn-chat-panel__header-avatar') as unknown as HTMLImageElement;
    (ha as HTMLImageElement).src = opts.avatar;
    (ha as HTMLImageElement).alt = '';
    headerLeft.appendChild(ha);
  }
  const titleEl = el('span', 'mn-chat-panel__title', { text: opts.avatar ? '' : opts.title ?? '' });
  const agentSelector = el('button', 'mn-chat-agent-selector', { type: 'button', 'aria-label': 'Select AI agent' });
  const agentSelectorLabel = el('span', 'mn-chat-agent-selector__label');
  agentSelector.appendChild(agentSelectorLabel);
  agentSelector.appendChild(el('span', 'mn-chat-agent-selector__chevron', { html: getIcon('chevronDown') }));
  const headerActions = el('div', 'mn-chat-panel__header-actions');
  const closeBtn = el('button', 'mn-chat-panel__close', { 'aria-label': 'Close chat' });
  const widthBtn = el('button', 'mn-chat-panel__resize', { 'aria-label': 'Toggle panel width' });
  if (!embedded) {
    closeBtn.innerHTML = getIcon('close');
    widthBtn.innerHTML = getIcon('expandHorizontal');
    headerActions.appendChild(widthBtn);
    headerActions.appendChild(closeBtn);
  }
  headerLeft.appendChild(titleEl);
  if (opts.agents?.length) headerLeft.appendChild(agentSelector);
  header.appendChild(headerLeft);
  header.appendChild(headerActions);
  panel.appendChild(header);
  const agentGrid = el('div', 'mn-chat-agent-grid', { 'aria-hidden': 'true' });
  panel.appendChild(agentGrid);

  const messagesEl = el('div', 'mn-chat-panel__messages');
  panel.appendChild(messagesEl);
  const typingEl = el('div', 'mn-chat-typing');
  typingEl.style.display = 'none';
  for (let d = 0; d < 3; d++) typingEl.appendChild(el('span', 'mn-chat-typing__dot'));
  messagesEl.appendChild(typingEl);

  const quickBar = el('div', 'mn-chat-panel__quick');
  panel.appendChild(quickBar);
  const inputArea = el('div', 'mn-chat-panel__input-area');
  const inputEl = el('textarea', 'mn-chat-panel__input', { placeholder: opts.placeholder ?? '', rows: '1' });
  const sendBtn = el('button', 'mn-chat-panel__send', { 'aria-label': 'Send message' });
  sendBtn.innerHTML = getIcon('arrowUp');
  const voiceBtn = el('button', 'mn-chat-voice', { 'aria-label': 'Toggle voice input' });
  voiceBtn.innerHTML = getIcon('mic');
  inputArea.appendChild(inputEl);
  inputArea.appendChild(voiceBtn);
  inputArea.appendChild(sendBtn);
  panel.appendChild(inputArea);
  container.appendChild(panel);

  return {
    state, fab, pulse, panel: panel as HTMLDivElement, resizeHandle: resizeHandle as HTMLDivElement,
    closeBtn: closeBtn as HTMLButtonElement, widthBtn: widthBtn as HTMLButtonElement,
    agentSelector: agentSelector as HTMLButtonElement, agentSelectorLabel: agentSelectorLabel as HTMLSpanElement,
    agentGrid: agentGrid as HTMLDivElement, messagesEl: messagesEl as HTMLDivElement,
    typingEl: typingEl as HTMLDivElement, quickBar: quickBar as HTMLDivElement,
    inputEl: inputEl as HTMLTextAreaElement, sendBtn: sendBtn as HTMLButtonElement,
    voiceBtn: voiceBtn as HTMLButtonElement,
  };
}
