/**
 * Unit tests for notification-center component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  notificationCenter,
  type MnNotification,
  type NotificationCenterController,
} from '../../src/ts/notification-center';

function makeNotif(overrides: Partial<MnNotification> = {}): MnNotification {
  return {
    id: 'n-001',
    title: 'Deployment completed',
    body: 'Production v4.11 deployed to eu-west-1.',
    type: 'success',
    timestamp: '14:32',
    read: false,
    ...overrides,
  };
}

let trigger: HTMLButtonElement;
let ctrl: NotificationCenterController;

beforeEach(() => {
  trigger = document.createElement('button');
  document.body.appendChild(trigger);
});

afterEach(() => {
  ctrl?.destroy();
  trigger.remove();
  document.querySelectorAll('.mn-notif-panel, .mn-notif-backdrop').forEach(el => el.remove());
});

describe('notificationCenter', () => {
  it('creates panel and backdrop in document.body', () => {
    ctrl = notificationCenter(trigger);
    expect(document.querySelector('.mn-notif-panel')).not.toBeNull();
    expect(document.querySelector('.mn-notif-backdrop')).not.toBeNull();
  });

  it('sets role=dialog and aria-label on panel', () => {
    ctrl = notificationCenter(trigger);
    const panel = document.querySelector('.mn-notif-panel');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-label')).toBe('Notifications');
  });

  it('starts closed (no open class)', () => {
    ctrl = notificationCenter(trigger);
    const panel = document.querySelector('.mn-notif-panel');
    expect(panel?.classList.contains('mn-notif-panel--open')).toBe(false);
  });

  it('open adds open class to panel', () => {
    ctrl = notificationCenter(trigger);
    ctrl.open();
    const panel = document.querySelector('.mn-notif-panel');
    expect(panel?.classList.contains('mn-notif-panel--open')).toBe(true);
  });

  it('close removes open class from panel', () => {
    ctrl = notificationCenter(trigger);
    ctrl.open();
    ctrl.close();
    const panel = document.querySelector('.mn-notif-panel');
    expect(panel?.classList.contains('mn-notif-panel--open')).toBe(false);
  });

  it('toggle toggles panel state', () => {
    ctrl = notificationCenter(trigger);
    ctrl.toggle();
    expect(document.querySelector('.mn-notif-panel--open')).not.toBeNull();
    ctrl.toggle();
    expect(document.querySelector('.mn-notif-panel--open')).toBeNull();
  });

  it('add inserts notification at the top of the list', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif());
    ctrl.add(makeNotif({ id: 'n-002', title: 'Build failed' }));
    const first = document.querySelector('.mn-notif-item');
    expect(first?.dataset.notifId).toBe('n-002');
  });

  it('getUnreadCount returns correct count', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif({ id: 'n-1', read: false }));
    ctrl.add(makeNotif({ id: 'n-2', read: true }));
    ctrl.add(makeNotif({ id: 'n-3', read: false }));
    expect(ctrl.getUnreadCount()).toBe(2);
  });

  it('markRead marks a single notification as read', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif({ id: 'n-1' }));
    ctrl.markRead('n-1');
    expect(ctrl.getUnreadCount()).toBe(0);
    const item = document.querySelector('[data-notif-id="n-1"]');
    expect(item?.classList.contains('mn-notif-item--unread')).toBe(false);
  });

  it('markAllRead marks every notification as read', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif({ id: 'n-1' }));
    ctrl.add(makeNotif({ id: 'n-2' }));
    ctrl.markAllRead();
    expect(ctrl.getUnreadCount()).toBe(0);
  });

  it('remove deletes a notification by id', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif({ id: 'n-1' }));
    ctrl.add(makeNotif({ id: 'n-2', title: 'License renewed' }));
    ctrl.remove('n-1');
    expect(document.querySelector('[data-notif-id="n-1"]')).toBeNull();
    expect(document.querySelector('[data-notif-id="n-2"]')).not.toBeNull();
  });

  it('clear removes all notifications', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif({ id: 'n-1' }));
    ctrl.add(makeNotif({ id: 'n-2' }));
    ctrl.clear();
    expect(document.querySelectorAll('.mn-notif-item').length).toBe(0);
    expect(ctrl.getUnreadCount()).toBe(0);
  });

  it('respects maxVisible by evicting oldest', () => {
    ctrl = notificationCenter(trigger, { maxVisible: 2 });
    ctrl.add(makeNotif({ id: 'n-1' }));
    ctrl.add(makeNotif({ id: 'n-2' }));
    ctrl.add(makeNotif({ id: 'n-3' }));
    // n-1 should be evicted
    expect(document.querySelector('[data-notif-id="n-1"]')).toBeNull();
    expect(document.querySelectorAll('.mn-notif-item').length).toBe(2);
  });

  it('applies position left class when configured', () => {
    ctrl = notificationCenter(trigger, { position: 'left' });
    const panel = document.querySelector('.mn-notif-panel');
    expect(panel?.classList.contains('mn-notif-panel--left')).toBe(true);
  });

  it('updates trigger unread indicator', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif({ id: 'n-1', read: false }));
    expect(trigger.classList.contains('mn-notif-trigger--has-unread')).toBe(true);
    ctrl.markAllRead();
    expect(trigger.classList.contains('mn-notif-trigger--has-unread')).toBe(false);
  });

  it('destroy removes panel, backdrop, and trigger classes', () => {
    ctrl = notificationCenter(trigger);
    ctrl.add(makeNotif());
    ctrl.destroy();
    expect(document.querySelector('.mn-notif-panel')).toBeNull();
    expect(document.querySelector('.mn-notif-backdrop')).toBeNull();
    expect(trigger.classList.contains('mn-notif-trigger--has-unread')).toBe(false);
  });

  it('closes on Escape key', () => {
    ctrl = notificationCenter(trigger);
    ctrl.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    const panel = document.querySelector('.mn-notif-panel');
    expect(panel?.classList.contains('mn-notif-panel--open')).toBe(false);
  });
});
