/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityWorkbench, type EntitySchema } from '../src/ts/entity-workbench';

const schema: EntitySchema = {
  tabs: [
    {
      id: 'profile',
      label: 'Profile',
      sections: [
        {
          title: 'Identity',
          fields: [
            { key: 'name', label: 'Name', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      sections: [
        {
          fields: [
            { key: 'email', label: 'Email', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
};

describe('EntityWorkbench tab-switch optimisation', () => {
  let container: HTMLDivElement;
  const instances: EntityWorkbench[] = [];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    instances.splice(0).forEach((wb) => wb.destroy());
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('preserves field values across tab switches', () => {
    const wb = new EntityWorkbench(container, {
      schema,
      data: { name: 'Luca Cordero', email: 'luca@example.com' },
    });
    instances.push(wb);

    // Edit name on profile tab
    const nameInput = container.querySelector(
      'input.mn-form-input',
    ) as HTMLInputElement;
    nameInput.value = 'Enzo Ferrari';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Switch to settings tab
    const tabs = container.querySelectorAll('.mn-entity-workbench__tab');
    (tabs[1] as HTMLButtonElement).click();

    // Switch back to profile tab
    const tabsAfter = container.querySelectorAll('.mn-entity-workbench__tab');
    (tabsAfter[0] as HTMLButtonElement).click();

    // Value must still be there
    const nameInputAfter = container.querySelector(
      '.mn-entity-workbench__tab-panel[data-tab="profile"] input.mn-form-input',
    ) as HTMLInputElement;
    expect(nameInputAfter.value).toBe('Enzo Ferrari');
  });

  it('isDirty detects changes in hidden tabs', () => {
    const wb = new EntityWorkbench(container, {
      schema,
      data: { name: 'Luca Cordero', email: 'luca@example.com' },
    });
    instances.push(wb);

    // Edit name on profile tab
    const nameInput = container.querySelector(
      'input.mn-form-input',
    ) as HTMLInputElement;
    nameInput.value = 'Enzo Ferrari';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Switch to settings tab — profile tab is now hidden
    const tabs = container.querySelectorAll('.mn-entity-workbench__tab');
    (tabs[1] as HTMLButtonElement).click();

    // isDirty must detect the change in the hidden profile tab
    expect(wb.isDirty()).toBe(true);
  });

  it('validate checks all tabs including hidden ones', () => {
    const wb = new EntityWorkbench(container, {
      schema,
      data: { name: '', email: '' },
    });
    instances.push(wb);

    // Switch to settings tab — profile tab with required name is hidden
    const tabs = container.querySelectorAll('.mn-entity-workbench__tab');
    (tabs[1] as HTMLButtonElement).click();

    // Validate must catch the empty required name in hidden profile tab
    const result = wb.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.has('name')).toBe(true);
  });

  it('does not rebuild DOM on tab switch (uses CSS display toggle)', () => {
    const wb = new EntityWorkbench(container, {
      schema,
      data: { name: 'Luca Cordero', email: 'luca@example.com' },
    });
    instances.push(wb);

    // Get reference to profile tab panel DOM node
    const profilePanel = container.querySelector(
      '.mn-entity-workbench__tab-panel[data-tab="profile"]',
    ) as HTMLElement;
    expect(profilePanel).toBeTruthy();

    // Switch to settings tab
    const tabs = container.querySelectorAll('.mn-entity-workbench__tab');
    (tabs[1] as HTMLButtonElement).click();

    // Profile panel must still be in DOM but hidden
    const samePanelAfter = container.querySelector(
      '.mn-entity-workbench__tab-panel[data-tab="profile"]',
    ) as HTMLElement;
    expect(samePanelAfter).toBe(profilePanel);
    expect(samePanelAfter.style.display).toBe('none');

    // Settings panel must be visible
    const settingsPanel = container.querySelector(
      '.mn-entity-workbench__tab-panel[data-tab="settings"]',
    ) as HTMLElement;
    expect(settingsPanel).toBeTruthy();
    expect(settingsPanel.style.display).not.toBe('none');
  });
});
