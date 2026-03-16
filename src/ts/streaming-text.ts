/**
 * Maranello Luce Design - Streaming Text
 * Headless component for progressive text rendering with markdown-lite parsing.
 * Supports bold, inline code, and citation references with ARIA live regions.
 */

import { escapeHtml } from './core/sanitize';

export interface StreamingTextOptions {
  onCitationClick?: (index: number) => void;
  onDone?: () => void;
  typingCursor?: boolean;
  processMarkdown?: boolean;
}

export interface StreamingTextController {
  append: (chunk: string) => void;
  done: () => void;
  reset: () => void;
  setText: (text: string) => void;
  destroy: () => void;
}

/** Regex segments: bold **text**, inline `code`, citation [N] */
const SEGMENT_RE = /(\*\*(.+?)\*\*|`([^`]+)`|\[(\d+)\])/g;

/** Parse buffer into HTML with escaped plain text, bold, code, citations. */
function renderBuffer(raw: string, processMarkdown: boolean): string {
  if (!processMarkdown) return escapeHtml(raw);

  let result = '';
  let lastIndex = 0;

  SEGMENT_RE.lastIndex = 0;
  let match = SEGMENT_RE.exec(raw);

  while (match !== null) {
    /* Escape plain text before this match */
    if (match.index > lastIndex) {
      result += escapeHtml(raw.slice(lastIndex, match.index));
    }

    if (match[2] !== undefined) {
      /* Bold: **text** */
      result += `<strong class="mn-stream__bold">${escapeHtml(match[2])}</strong>`;
    } else if (match[3] !== undefined) {
      /* Inline code: `code` */
      result += `<code class="mn-stream__code">${escapeHtml(match[3])}</code>`;
    } else if (match[4] !== undefined) {
      /* Citation: [N] */
      const idx = match[4];
      result += `<button class="mn-stream__cite" data-idx="${escapeHtml(idx)}" type="button">[${escapeHtml(idx)}]</button>`;
    }

    lastIndex = match.index + match[0].length;
    match = SEGMENT_RE.exec(raw);
  }

  /* Remaining plain text after last match */
  if (lastIndex < raw.length) {
    result += escapeHtml(raw.slice(lastIndex));
  }

  return result;
}

const CURSOR_HTML = '<span class="mn-stream__cursor" aria-hidden="true">|</span>';

/**
 * Create a streaming text renderer attached to the given element.
 * Progressively renders appended chunks with optional markdown-lite processing.
 */
export function streamingText(
  el: HTMLElement,
  opts?: StreamingTextOptions,
): StreamingTextController {
  const options: Required<StreamingTextOptions> = {
    onCitationClick: opts?.onCitationClick ?? (() => {}),
    onDone: opts?.onDone ?? (() => {}),
    typingCursor: opts?.typingCursor ?? true,
    processMarkdown: opts?.processMarkdown ?? true,
  };

  let buffer = '';
  let finished = false;
  const ac = new AbortController();

  /* Set up ARIA attributes for screen readers */
  el.setAttribute('role', 'log');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'false');
  el.setAttribute('aria-label', 'Streaming response');
  el.classList.add('mn-stream');

  /* Hidden live region for announcing new content to SR */
  const liveRegion = document.createElement('span');
  liveRegion.className = 'mn-sr-only';
  liveRegion.setAttribute('aria-live', 'polite');
  el.appendChild(liveRegion);

  /* Delegate citation clicks from container */
  el.addEventListener(
    'click',
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('mn-stream__cite')) {
        const idx = parseInt(target.dataset.idx ?? '0', 10);
        options.onCitationClick(idx);
      }
    },
    { signal: ac.signal },
  );

  function render(showCursor: boolean): void {
    const html = renderBuffer(buffer, options.processMarkdown);
    const cursor = showCursor && options.typingCursor ? CURSOR_HTML : '';
    /* Preserve live region, update content span */
    el.innerHTML = `<span class="mn-stream__content">${html}${cursor}</span>`;
    el.appendChild(liveRegion);
  }

  function append(chunk: string): void {
    if (finished) return;
    buffer += chunk;
    render(true);
    /* Announce latest chunk to screen readers */
    liveRegion.textContent = chunk;
  }

  function done(): void {
    if (finished) return;
    finished = true;
    el.classList.add('mn-stream--done');
    render(false);
    liveRegion.textContent = '';
    options.onDone();
  }

  function reset(): void {
    buffer = '';
    finished = false;
    el.classList.remove('mn-stream--done');
    render(true);
    liveRegion.textContent = '';
  }

  function setText(text: string): void {
    buffer = text;
    finished = true;
    el.classList.add('mn-stream--done');
    render(false);
    liveRegion.textContent = '';
  }

  function destroy(): void {
    ac.abort();
    el.innerHTML = '';
    el.removeAttribute('role');
    el.removeAttribute('aria-live');
    el.removeAttribute('aria-atomic');
    el.removeAttribute('aria-label');
    el.classList.remove('mn-stream', 'mn-stream--done');
    buffer = '';
    finished = true;
  }

  /* Initial render with empty buffer and cursor */
  render(true);

  return { append, done, reset, setText, destroy };
}
