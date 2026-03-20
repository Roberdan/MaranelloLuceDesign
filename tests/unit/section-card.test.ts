/**
 * Unit tests for section-card component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('sectionCard', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  async function create(
    opts?: Partial<Parameters<typeof import('../../src/ts/section-card').sectionCard>[1]>,
  ) {
    const { sectionCard } = await import('../../src/ts/section-card');
    return sectionCard(container, { title: 'Revenue Overview', ...opts });
  }

  it('renders title in header h3', async () => {
    await create();
    const h3 = container.querySelector('.mn-section-card__title');
    expect(h3).not.toBeNull();
    expect(h3?.textContent).toBe('Revenue Overview');
  });

  it('bodyEl is accessible and inside the section', async () => {
    const ctrl = await create();
    expect(ctrl.bodyEl).toBeInstanceOf(HTMLElement);
    expect(ctrl.bodyEl.className).toContain('mn-section-card__body');
    expect(container.querySelector('.mn-section-card')?.contains(ctrl.bodyEl)).toBe(true);
  });

  it('setTitle updates h3 text content', async () => {
    const ctrl = await create();
    ctrl.setTitle('Updated Metric');
    const h3 = container.querySelector('.mn-section-card__title');
    expect(h3?.textContent).toBe('Updated Metric');
  });

  it('flat variant applies correct class', async () => {
    await create({ variant: 'flat' });
    const section = container.querySelector('.mn-section-card');
    expect(section?.classList.contains('mn-section-card--flat')).toBe(true);
    expect(section?.classList.contains('mn-section-card--default')).toBe(false);
  });

  it('default variant applies mn-section-card--default', async () => {
    await create();
    const section = container.querySelector('.mn-section-card');
    expect(section?.classList.contains('mn-section-card--default')).toBe(true);
  });

  it('action click fires onClick callback', async () => {
    const spy = vi.fn();
    await create({ action: { label: 'View details', onClick: spy } });
    const action = container.querySelector('.mn-section-card__action') as HTMLElement;
    expect(action).not.toBeNull();
    action.click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('action renders as anchor when href provided', async () => {
    await create({ action: { label: 'Go', href: '/users' } });
    const action = container.querySelector('.mn-section-card__action');
    expect(action?.tagName).toBe('A');
    expect((action as HTMLAnchorElement).href).toContain('/users');
  });

  it('padding=false adds no-padding class', async () => {
    await create({ padding: false });
    const section = container.querySelector('.mn-section-card');
    expect(section?.classList.contains('mn-section-card--no-padding')).toBe(true);
  });

  it('section has role=region and aria-labelledby', async () => {
    await create();
    const section = container.querySelector('.mn-section-card');
    expect(section?.getAttribute('role')).toBe('region');
    const labelledBy = section?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const h3 = container.querySelector(`#${labelledBy}`);
    expect(h3?.textContent).toBe('Revenue Overview');
  });

  it('setAction replaces existing action', async () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const ctrl = await create({ action: { label: 'First', onClick: spy1 } });
    ctrl.setAction({ label: 'Second', onClick: spy2 });
    const actions = container.querySelectorAll('.mn-section-card__action');
    expect(actions.length).toBe(1);
    expect(actions[0]?.textContent).toBe('Second');
    (actions[0] as HTMLElement).click();
    expect(spy2).toHaveBeenCalledOnce();
    expect(spy1).not.toHaveBeenCalled();
  });

  it('className option adds custom class', async () => {
    await create({ className: 'my-custom' });
    const section = container.querySelector('.mn-section-card');
    expect(section?.classList.contains('my-custom')).toBe(true);
  });
});
