/**
 * Unit tests for settings-panel component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const SAMPLE_SECTIONS = [
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize theme and accessibility',
    items: [
      {
        type: 'toggle' as const,
        label: 'Dark mode',
        description: 'Enable dark theme',
        value: true,
        onChange: vi.fn(),
      },
      {
        type: 'select' as const,
        label: 'Language',
        value: 'en',
        onChange: vi.fn(),
        options: [
          { value: 'en', label: 'English' },
          { value: 'it', label: 'Italiano' },
        ],
      },
    ],
  },
  {
    id: 'danger',
    title: 'Danger Zone',
    items: [
      {
        type: 'action' as const,
        label: 'Reset preferences',
        description: 'Restore all defaults',
        buttonLabel: 'Reset',
        variant: 'danger' as const,
        onAction: vi.fn(),
      },
    ],
  },
];

describe('settingsPanel', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    /* Reset mocks from sample */
    for (const s of SAMPLE_SECTIONS) {
      for (const item of s.items) {
        if ('onChange' in item) (item.onChange as ReturnType<typeof vi.fn>).mockClear();
        if ('onAction' in item) (item.onAction as ReturnType<typeof vi.fn>).mockClear();
      }
    }
  });

  async function create(sections = SAMPLE_SECTIONS) {
    const { settingsPanel } = await import('../../src/ts/settings-panel');
    return settingsPanel(container, { sections });
  }

  it('renders sections with correct titles', async () => {
    await create();
    const legends = container.querySelectorAll('.mn-settings-section__title');
    expect(legends.length).toBe(2);
    expect(legends[0]?.textContent).toBe('Appearance');
    expect(legends[1]?.textContent).toBe('Danger Zone');
  });

  it('renders section description when provided', async () => {
    await create();
    const desc = container.querySelector('.mn-settings-section__desc');
    expect(desc?.textContent).toBe('Customize theme and accessibility');
  });

  it('wraps sections in fieldset elements', async () => {
    await create();
    const fieldsets = container.querySelectorAll('fieldset.mn-settings-section');
    expect(fieldsets.length).toBe(2);
  });

  it('toggle onChange fires with boolean value', async () => {
    await create();
    const toggle = container.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(toggle).not.toBeNull();
    expect(toggle!.checked).toBe(true);
    toggle!.checked = false;
    toggle!.dispatchEvent(new Event('change'));
    const handler = SAMPLE_SECTIONS[0].items[0] as { onChange: ReturnType<typeof vi.fn> };
    expect(handler.onChange).toHaveBeenCalledWith(false);
  });

  it('toggle has role=switch and aria-checked', async () => {
    await create();
    const toggle = container.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(toggle?.getAttribute('role')).toBe('switch');
    expect(toggle?.getAttribute('aria-checked')).toBe('true');
  });

  it('getValues returns current state for all items', async () => {
    const ctrl = await create();
    const vals = ctrl.getValues();
    expect(vals['Dark mode']).toBe(true);
    expect(vals['Language']).toBe('en');
    expect(vals['appearance:Dark mode']).toBe(true);
    expect(vals['appearance:Language']).toBe('en');
  });

  it('action button fires onAction callback', async () => {
    await create();
    const btn = container.querySelector('.mn-settings-action-btn');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('Reset');
    (btn as HTMLElement).click();
    const handler = SAMPLE_SECTIONS[1].items[0] as { onAction: ReturnType<typeof vi.fn> };
    expect(handler.onAction).toHaveBeenCalledOnce();
  });

  it('danger action button has danger class', async () => {
    await create();
    const btn = container.querySelector('.mn-settings-action-btn');
    expect(btn?.classList.contains('mn-settings-action-btn--danger')).toBe(true);
  });

  it('destroy cleans up DOM and removes class', async () => {
    const ctrl = await create();
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-settings-panel')).toBe(false);
  });

  it('select renders options and fires onChange', async () => {
    await create();
    const sel = container.querySelector<HTMLSelectElement>('select');
    expect(sel).not.toBeNull();
    expect(sel!.options.length).toBe(2);
    sel!.value = 'it';
    sel!.dispatchEvent(new Event('change'));
    const handler = SAMPLE_SECTIONS[0].items[1] as { onChange: ReturnType<typeof vi.fn> };
    expect(handler.onChange).toHaveBeenCalledWith('it');
  });

  it('labels are associated with controls via for/id', async () => {
    await create();
    const labels = container.querySelectorAll<HTMLLabelElement>('.mn-settings-item__label');
    for (const lbl of labels) {
      if (lbl.htmlFor) {
        const ctrl = container.querySelector(`#${lbl.htmlFor}`);
        expect(ctrl).not.toBeNull();
      }
    }
  });
});
