/** AI Chat IIFE wrapper — aiChat() factory with default avatar for IIFE consumers. */
import { buildUI } from './ai-chat-dom';
import { initMessages } from './ai-chat-messages';
import type { AIChatOptions, AIChatController } from './ai-chat-dom';

export function aiChat(container: HTMLElement, opts?: Partial<AIChatOptions>): AIChatController {
  const full: Required<AIChatOptions> = {
    mode: opts?.mode ?? 'fab',
    onSend: opts?.onSend ?? null,
    onQuickAction: opts?.onQuickAction ?? null,
    quickActions: opts?.quickActions ?? [],
    placeholder: opts?.placeholder ?? 'Type a message\u2026',
    title: opts?.title ?? 'AI Assistant',
    welcomeMessage: opts?.welcomeMessage ?? null,
    avatar: opts?.avatar ?? 'https://github.com/Roberdan.png',
    agents: opts?.agents ?? [],
    activeAgent: opts?.activeAgent ?? null,
    onAgentChange: opts?.onAgentChange ?? (() => {}),
    onVoice: opts?.onVoice ?? (() => {}),
    voiceAdapter: opts?.voiceAdapter ?? undefined,
  } as Required<AIChatOptions>;
  const embedded = full.mode === 'embedded';
  const els = buildUI(container, full);
  initMessages(els.state, els, full);
  const { state, fab, panel, closeBtn } = els;

  function open() {
    if (embedded) return;
    panel.classList.add('mn-chat-panel--open'); panel.style.display = 'flex'; state.isOpen = true;
  }
  function close() {
    if (embedded) return;
    panel.classList.remove('mn-chat-panel--open'); panel.style.display = 'none'; state.isOpen = false;
  }
  function toggle() { state.isOpen ? close() : open(); }

  if (!embedded) {
    fab.addEventListener('click', toggle);
    closeBtn.addEventListener('click', close);
  }

  return {
    open, close, toggle,
    isOpen: () => state.isOpen,
    addMessage: (role, content, msgOpts) => state.addMessage!(role, content, msgOpts),
    setTyping: (show) => state.setTyping!(show),
    clear: () => state.clear!(),
    showPulse: () => { els.pulse.classList.add('mn-chat-fab__pulse--active'); },
    destroy: () => { if (state.destroyMessages) state.destroyMessages(); container.innerHTML = ''; },
  };
}
