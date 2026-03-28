/** AI Chat message logic — rendering, sending, quick actions, agent switching, voice toggle. */
import { ICON_SPARK, getIcon, el, formatTime, renderContent } from './ai-chat-dom';
import { sanitizeSvg } from './core/sanitize';
import { voiceManager } from './voice-input';
import type { VoiceManagerController, VoiceState } from './voice-input';
import type { AIChatAgent, AIChatMessage, AIChatOptions, AddMessageOptions, ChatUIElements, ChatUIState, StreamingHandle } from './ai-chat-dom';

type HandlerResult = string | { content?: string } | Promise<string | { content?: string }> | null | undefined;

export function initMessages(state: ChatUIState, els: ChatUIElements, opts: Required<AIChatOptions>): void {
  const { messages } = state;
  const { messagesEl, typingEl, inputEl, sendBtn, voiceBtn, quickBar } = els;
  const { agentSelector, agentSelectorLabel, agentGrid } = els;

  function addMessage(role: string, content: string, msgOpts?: AddMessageOptions): AIChatMessage | StreamingHandle {
    const msg: AIChatMessage = { role: role as 'user' | 'ai', content, time: new Date() };
    messages.push(msg);
    const { wrap, contentEl } = renderMessage(msg, msgOpts?.streaming);
    scrollToBottom();
    if (msgOpts?.streaming) {
      wrap.classList.add('mn-chat-msg--streaming');
      return {
        message: msg,
        append(token: string) {
          msg.content += token;
          contentEl.textContent += token;
          scrollToBottom();
        },
        finish() {
          wrap.classList.remove('mn-chat-msg--streaming');
          contentEl.innerHTML = '';
          contentEl.appendChild(renderContent(msg.content));
          msg.time = new Date();
          const timeEl = wrap.querySelector('.mn-chat-msg__time');
          if (timeEl) timeEl.textContent = formatTime(msg.time);
          scrollToBottom();
        },
      };
    }
    return msg;
  }

  function renderMessage(msg: AIChatMessage, streaming?: boolean): { wrap: HTMLElement; contentEl: HTMLElement } {
    const wrap = el('div', `mn-chat-msg mn-chat-msg--${msg.role}`);
    let contentEl: HTMLElement;
    if (msg.role === 'ai') {
      const iconWrap = el('span', 'mn-chat-msg__icon');
      iconWrap.innerHTML = ICON_SPARK;
      const body = el('div', 'mn-chat-msg__body');
      body.appendChild(iconWrap);
      contentEl = el('span', 'mn-chat-msg__content');
      if (streaming) contentEl.textContent = msg.content;
      else contentEl.appendChild(renderContent(msg.content));
      body.appendChild(contentEl);
      wrap.appendChild(body);
    } else {
      contentEl = el('span', 'mn-chat-msg__content');
      contentEl.appendChild(renderContent(msg.content));
      if (opts.avatar) {
        const body = el('div', 'mn-chat-msg__body');
        body.appendChild(contentEl);
        body.appendChild(el('img', 'mn-chat-msg__avatar', { src: opts.avatar ?? '', alt: 'You' }));
        wrap.appendChild(body);
      } else {
        wrap.appendChild(contentEl);
      }
    }
    const timeEl = el('div', 'mn-chat-msg__time', { text: streaming ? '' : formatTime(msg.time) });
    wrap.appendChild(timeEl);
    messagesEl.insertBefore(wrap, typingEl);
    return { wrap, contentEl };
  }

  function scrollToBottom(): void {
    requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }

  function setTyping(show: boolean): void {
    state.isTyping = show;
    typingEl.style.display = show ? 'flex' : 'none';
    if (show) scrollToBottom();
  }

  function resetInputHeight(): void { inputEl.style.height = 'auto'; inputEl.rows = 1; }
  function autoResize(): void { inputEl.style.height = 'auto'; inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px'; }
  function updateSendVisibility(): void { sendBtn.classList.toggle('mn-chat-panel__send--visible', inputEl.value.trim().length > 0); }

  function handleResult(result: HandlerResult): void {
    if (!result) return;
    if (typeof (result as Promise<unknown>).then === 'function') {
      (result as Promise<string | { content?: string }>)
        .then((r) => { setTyping(false); if (r) addMessage('ai', typeof r === 'string' ? r : r.content ?? String(r)); })
        .catch((e: unknown) => { setTyping(false); addMessage('ai', `Error: ${(e as Error).message ?? String(e)}`); });
    } else {
      setTyping(false);
      const r = result as string | { content?: string };
      addMessage('ai', typeof r === 'string' ? r : r.content ?? String(r));
    }
  }

  function sendMessage(): void {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage('user', text);
    inputEl.value = '';
    resetInputHeight();
    updateSendVisibility();
    try {
      if (opts.onSend) { setTyping(true); handleResult(opts.onSend(text)); }
    } catch (err) {
      setTyping(false);
      addMessage('ai', `Error: ${(err as Error).message ?? String(err)}`);
    }
  }

  function handleQuickAction(action: string): void {
    if (!opts.onQuickAction) return;
    let lastAi: string | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'ai') { lastAi = messages[i].content; break; }
    }
    addMessage('user', action);
    setTyping(true);
    handleResult(opts.onQuickAction(action, lastAi));
  }

  function getActiveAgent(): AIChatAgent | null {
    const agents = opts.agents ?? [];
    for (const agent of agents) {
      if (agent.id === state.activeAgentId) return agent;
    }
    return agents[0] ?? null;
  }

  function updateAgentSelectorLabel(): void {
    const active = getActiveAgent();
    agentSelectorLabel.textContent = active ? active.label : 'Select Agent';
  }

  function renderAgentGrid(): void {
    const agents = opts.agents ?? [];
    if (!agents.length) return;
    agentGrid.innerHTML = '';
    for (const agent of agents) {
      const card = el('button', 'mn-chat-agent-card', { type: 'button' });
      if (agent.id === state.activeAgentId) card.classList.add('mn-chat-agent-card--active');
      const iconEl = el('span', 'mn-chat-agent-card__icon');
      if (agent.icon && /<svg/i.test(agent.icon)) {
        const safeSvg = sanitizeSvg(agent.icon);
        if (safeSvg) iconEl.innerHTML = safeSvg;
        else iconEl.textContent = '\u{1F916}';
      }
      else iconEl.textContent = agent.icon ?? '\u{1F916}';
      card.appendChild(iconEl);
      card.appendChild(el('span', 'mn-chat-agent-card__label', { text: agent.label ?? agent.id }));
      card.addEventListener('click', () => {
        state.activeAgentId = agent.id;
        updateAgentSelectorLabel();
        renderAgentGrid();
        toggleAgentGrid(false);
        if (typeof opts.onAgentChange === 'function') opts.onAgentChange(agent.id, agent);
      });
      agentGrid.appendChild(card);
    }
  }

  function toggleAgentGrid(forceState?: boolean): void {
    if (!(opts.agents ?? []).length) return;
    state.isAgentGridOpen = typeof forceState === 'boolean' ? forceState : !state.isAgentGridOpen;
    agentGrid.classList.toggle('mn-chat-agent-grid--open', state.isAgentGridOpen);
    agentSelector.classList.toggle('mn-chat-agent-selector--open', state.isAgentGridOpen);
    agentGrid.setAttribute('aria-hidden', state.isAgentGridOpen ? 'false' : 'true');
  }

  function cyclePanelWidth(): void {
    const next = state.panelWidthMode === 'normal' ? 'wide' : state.panelWidthMode === 'wide' ? 'full' : 'normal';
    state.panelWidthMode = next;
    els.panel.classList.toggle('mn-chat-panel--wide', next === 'wide');
    els.panel.classList.toggle('mn-chat-panel--full', next === 'full');
  }

  var voiceMgr: VoiceManagerController | null = opts.voiceAdapter
    ? voiceManager({
        adapter: opts.voiceAdapter,
        events: {
          onTranscript(text: string, isFinal: boolean) {
            inputEl.value = isFinal ? text : inputEl.value + text;
          },
          onStateChange(vs: VoiceState) {
            var wrap = voiceBtn.parentElement || voiceBtn;
            wrap.classList.remove('mn-voice--listening', 'mn-voice--processing', 'mn-voice--error');
            if (vs !== 'idle') wrap.classList.add('mn-voice--' + vs);
            state.isListening = vs === 'listening';
            if (typeof opts.onVoice === 'function') opts.onVoice(state.isListening);
          },
        },
      })
    : null;

  function toggleVoice(): void {
    if (voiceMgr) {
      voiceMgr.toggle();
      /* onVoice is called from the onStateChange handler above */
    } else {
      state.isListening = !state.isListening;
      voiceBtn.classList.toggle('mn-chat-voice--active', state.isListening);
      if (typeof opts.onVoice === 'function') opts.onVoice(state.isListening);
    }
  }

  function clear(): void {
    state.messages.length = 0;
    messagesEl.querySelectorAll('.mn-chat-msg').forEach((n) => n.remove());
    setTyping(false);
  }

  for (const action of (opts.quickActions ?? [])) {
    const btn = el('button', 'mn-chat-panel__quick-btn', { text: action });
    btn.addEventListener('click', () => handleQuickAction(action));
    quickBar.appendChild(btn);
  }

  if ((opts.agents ?? []).length) {
    updateAgentSelectorLabel();
    renderAgentGrid();
    agentSelector.addEventListener('click', () => toggleAgentGrid());
  }

  inputEl.addEventListener('input', () => { autoResize(); updateSendVisibility(); });
  inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);
  voiceBtn.addEventListener('click', toggleVoice);
  els.widthBtn.addEventListener('click', cyclePanelWidth);

  state.addMessage = addMessage;
  state.setTyping = setTyping;
  state.clear = clear;
  state.toggleAgentGrid = toggleAgentGrid;
  state.destroyMessages = function () {
    if (voiceMgr) { voiceMgr.destroy(); voiceMgr = null; }
  };
  state.onDocumentClick = (e: MouseEvent) => {
    if (!state.isAgentGridOpen) return;
    if (!(e.target instanceof Node) || !els.panel.contains(e.target)) return;
    if (agentSelector.contains(e.target) || agentGrid.contains(e.target)) return;
    toggleAgentGrid(false);
  };
}
