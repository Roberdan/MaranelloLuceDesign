/**
 * Unit tests for streaming-text component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('streamingText', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  async function create(opts?: Parameters<typeof import('../../src/ts/streaming-text').streamingText>[1]) {
    const { streamingText } = await import('../../src/ts/streaming-text');
    return streamingText(container, opts);
  }

  it('sets ARIA attributes on the container', async () => {
    await create();
    expect(container.getAttribute('role')).toBe('log');
    expect(container.getAttribute('aria-live')).toBe('polite');
    expect(container.getAttribute('aria-label')).toBe('Streaming response');
  });

  it('adds mn-stream class to container', async () => {
    await create();
    expect(container.classList.contains('mn-stream')).toBe(true);
  });

  it('renders typing cursor by default', async () => {
    await create();
    const cursor = container.querySelector('.mn-stream__cursor');
    expect(cursor).not.toBeNull();
  });

  it('append adds text progressively', async () => {
    const ctrl = await create();
    ctrl.append('Revenue increased ');
    ctrl.append('by 15% in Q4');
    const content = container.querySelector('.mn-stream__content');
    expect(content?.textContent).toContain('Revenue increased');
    expect(content?.textContent).toContain('by 15% in Q4');
  });

  it('renders bold markdown as <strong>', async () => {
    const ctrl = await create();
    ctrl.append('The **quarterly report** is ready');
    const bold = container.querySelector('strong.mn-stream__bold');
    expect(bold?.textContent).toBe('quarterly report');
  });

  it('renders inline code as <code>', async () => {
    const ctrl = await create();
    ctrl.append('Run `npm install` to set up');
    const code = container.querySelector('code.mn-stream__code');
    expect(code?.textContent).toBe('npm install');
  });

  it('renders citation as button with data-idx', async () => {
    const ctrl = await create();
    ctrl.append('See reference [3] for details');
    const cite = container.querySelector<HTMLElement>('.mn-stream__cite');
    expect(cite?.dataset.idx).toBe('3');
    expect(cite?.textContent).toBe('[3]');
  });

  it('fires onCitationClick when citation button is clicked', async () => {
    const spy = vi.fn();
    const ctrl = await create({ onCitationClick: spy });
    ctrl.append('Source [7] confirms this');
    const cite = container.querySelector<HTMLElement>('.mn-stream__cite');
    cite?.click();
    expect(spy).toHaveBeenCalledWith(7);
  });

  it('done removes cursor and fires onDone', async () => {
    const spy = vi.fn();
    const ctrl = await create({ onDone: spy });
    ctrl.append('Analysis complete');
    ctrl.done();
    expect(container.classList.contains('mn-stream--done')).toBe(true);
    expect(container.querySelector('.mn-stream__cursor')).toBeNull();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('append after done is ignored', async () => {
    const ctrl = await create();
    ctrl.append('First chunk');
    ctrl.done();
    ctrl.append('Should be ignored');
    const content = container.querySelector('.mn-stream__content');
    expect(content?.textContent).not.toContain('Should be ignored');
  });

  it('reset clears text and restores cursor', async () => {
    const ctrl = await create();
    ctrl.append('Some text');
    ctrl.done();
    ctrl.reset();
    expect(container.classList.contains('mn-stream--done')).toBe(false);
    expect(container.querySelector('.mn-stream__cursor')).not.toBeNull();
    const content = container.querySelector('.mn-stream__content');
    expect(content?.textContent?.replace('|', '').trim()).toBe('');
  });

  it('setText sets full text and marks done', async () => {
    const ctrl = await create();
    ctrl.setText('Final analysis of quarterly earnings');
    expect(container.classList.contains('mn-stream--done')).toBe(true);
    const content = container.querySelector('.mn-stream__content');
    expect(content?.textContent).toContain('Final analysis');
  });

  it('destroy removes all ARIA attributes and classes', async () => {
    const ctrl = await create();
    ctrl.append('temporary content');
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.getAttribute('role')).toBeNull();
    expect(container.classList.contains('mn-stream')).toBe(false);
  });

  it('disables markdown when processMarkdown is false', async () => {
    const ctrl = await create({ processMarkdown: false });
    ctrl.append('Keep **raw** and `code`');
    expect(container.querySelector('strong')).toBeNull();
    expect(container.querySelector('code')).toBeNull();
    const content = container.querySelector('.mn-stream__content');
    expect(content?.textContent).toContain('**raw**');
  });
});
