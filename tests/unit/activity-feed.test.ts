/**
 * Unit tests for activity-feed component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { activityFeed, type ActivityItem } from '../../src/ts/activity-feed';

function makeItem(overrides: Partial<ActivityItem> = {}): ActivityItem {
  return {
    id: 'af-001',
    title: 'Invoice approved',
    body: 'Invoice #4892 for Maranello SpA was approved by finance.',
    meta: '2 minutes ago',
    type: 'success',
    ...overrides,
  };
}

let container: HTMLDivElement;

beforeEach(() => { container = document.createElement('div'); });

describe('activityFeed', () => {
  it('renders initial items into the container', () => {
    const items = [makeItem(), makeItem({ id: 'af-002', title: 'Deployment started' })];
    const ctrl = activityFeed(container, items);
    expect(container.querySelectorAll('.mn-feed__item').length).toBe(2);
    ctrl.destroy();
  });

  it('sets role=feed and aria-label on container', () => {
    const ctrl = activityFeed(container);
    expect(container.getAttribute('role')).toBe('feed');
    expect(container.getAttribute('aria-label')).toBe('Activity feed');
    ctrl.destroy();
  });

  it('adds mn-feed class to container', () => {
    const ctrl = activityFeed(container);
    expect(container.classList.contains('mn-feed')).toBe(true);
    ctrl.destroy();
  });

  it('renders title, body, and meta for each item', () => {
    const ctrl = activityFeed(container, [makeItem()]);
    expect(container.querySelector('.mn-feed__title')?.textContent).toContain('Invoice approved');
    expect(container.querySelector('.mn-feed__body')?.textContent).toContain('Invoice #4892');
    expect(container.querySelector('.mn-feed__meta')?.textContent).toContain('2 minutes ago');
    ctrl.destroy();
  });

  it('applies type class to item', () => {
    const ctrl = activityFeed(container, [makeItem({ type: 'danger' })]);
    const item = container.querySelector('.mn-feed__item');
    expect(item?.classList.contains('mn-feed__item--danger')).toBe(true);
    ctrl.destroy();
  });

  it('renders icon element when icon is provided', () => {
    const svgIcon = '<svg><circle r="5"/></svg>';
    const ctrl = activityFeed(container, [makeItem({ icon: svgIcon })]);
    expect(container.querySelector('.mn-feed__icon')).not.toBeNull();
    ctrl.destroy();
  });

  it('omits body and meta elements when not provided', () => {
    const ctrl = activityFeed(container, [makeItem({ body: undefined, meta: undefined })]);
    expect(container.querySelector('.mn-feed__body')).toBeNull();
    expect(container.querySelector('.mn-feed__meta')).toBeNull();
    ctrl.destroy();
  });

  it('add appends item to the bottom', () => {
    const ctrl = activityFeed(container, [makeItem()]);
    ctrl.add(makeItem({ id: 'af-new', title: 'Pipeline completed' }));
    const items = container.querySelectorAll('.mn-feed__item');
    expect(items.length).toBe(2);
    expect(items[1].dataset.id).toBe('af-new');
    ctrl.destroy();
  });

  it('prepend inserts item at the top', () => {
    const ctrl = activityFeed(container, [makeItem()]);
    ctrl.prepend(makeItem({ id: 'af-top', title: 'Urgent: server alert' }));
    const first = container.querySelector('.mn-feed__item');
    expect(first?.dataset.id).toBe('af-top');
    ctrl.destroy();
  });

  it('enforces maxItems by removing oldest from bottom', () => {
    const items = Array.from({ length: 4 }, (_, i) =>
      makeItem({ id: `af-${i}`, title: `Event ${i}` }),
    );
    const ctrl = activityFeed(container, items, { maxItems: 2 });
    expect(container.querySelectorAll('.mn-feed__item').length).toBe(2);
    ctrl.destroy();
  });

  it('enforces maxItems when adding new items', () => {
    const ctrl = activityFeed(container, [makeItem()], { maxItems: 2 });
    ctrl.add(makeItem({ id: 'af-2', title: 'Budget review' }));
    ctrl.add(makeItem({ id: 'af-3', title: 'Contract signed' }));
    expect(container.querySelectorAll('.mn-feed__item').length).toBe(2);
    ctrl.destroy();
  });

  it('clear removes all items', () => {
    const ctrl = activityFeed(container, [makeItem(), makeItem({ id: 'af-002' })]);
    ctrl.clear();
    expect(container.querySelectorAll('.mn-feed__item').length).toBe(0);
    ctrl.destroy();
  });

  it('destroy restores container to clean state', () => {
    const ctrl = activityFeed(container, [makeItem()]);
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-feed')).toBe(false);
  });

  it('renders with no initial items', () => {
    const ctrl = activityFeed(container);
    expect(container.querySelectorAll('.mn-feed__item').length).toBe(0);
    ctrl.destroy();
  });

  it('defaults type to default when omitted', () => {
    const ctrl = activityFeed(container, [makeItem({ type: undefined })]);
    const item = container.querySelector('.mn-feed__item');
    expect(item?.classList.contains('mn-feed__item--default')).toBe(true);
    ctrl.destroy();
  });
});
