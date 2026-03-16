/**
 * Unit tests for user-table component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userTable, type AdminUser } from '../../src/ts/user-table';

const USERS: AdminUser[] = [
  { id: 'u1', name: 'Marco Rossi', email: 'marco@convergio.io', role: 'admin', status: 'active', teams: ['Engineering', 'Platform', 'DevOps'] },
  { id: 'u2', name: 'Elena Bianchi', email: 'elena@convergio.io', role: 'member', status: 'invited', lastActive: '2026-03-10' },
  { id: 'u3', name: 'Luca Verdi', email: 'luca@convergio.io', role: 'viewer', status: 'suspended' },
];

let container: HTMLDivElement;

beforeEach(() => { container = document.createElement('div'); });

describe('userTable', () => {
  it('renders a table with rows matching user count', () => {
    const ctrl = userTable(container, USERS);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    ctrl.destroy();
  });

  it('renders user name and email in each row', () => {
    const ctrl = userTable(container, USERS);
    const html = container.innerHTML;
    expect(html).toContain('Marco Rossi');
    expect(html).toContain('elena@convergio.io');
    ctrl.destroy();
  });

  it('renders teams with overflow badge for 3+ teams', () => {
    const ctrl = userTable(container, USERS);
    expect(container.innerHTML).toContain('+1');
    ctrl.destroy();
  });

  it('shows resend-invite action for invited users', () => {
    const ctrl = userTable(container, USERS);
    const invitedRow = container.querySelector('[data-uid="u2"]');
    expect(invitedRow?.querySelector('[data-act="resend-invite"]')).toBeTruthy();
    ctrl.destroy();
  });

  it('shows suspend action for non-invited users', () => {
    const ctrl = userTable(container, USERS);
    const activeRow = container.querySelector('[data-uid="u1"]');
    expect(activeRow?.querySelector('[data-act="suspend"]')).toBeTruthy();
    ctrl.destroy();
  });

  it('includes search input when searchable', () => {
    const ctrl = userTable(container, USERS, { searchable: true });
    expect(container.querySelector('input[type="search"]')).toBeTruthy();
    ctrl.destroy();
  });

  it('omits search input when searchable is false', () => {
    const ctrl = userTable(container, USERS, { searchable: false });
    expect(container.querySelector('input[type="search"]')).toBeNull();
    ctrl.destroy();
  });

  it('setFilter narrows displayed rows', () => {
    const ctrl = userTable(container, USERS);
    ctrl.setFilter('elena');
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(container.innerHTML).toContain('Elena Bianchi');
    ctrl.destroy();
  });

  it('update replaces data and re-renders', () => {
    const ctrl = userTable(container, USERS);
    ctrl.update([USERS[0]]);
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
    ctrl.destroy();
  });

  it('getSelected returns empty array initially', () => {
    const ctrl = userTable(container, USERS);
    expect(ctrl.getSelected()).toEqual([]);
    ctrl.destroy();
  });

  it('renders select-all checkbox when selectable', () => {
    const ctrl = userTable(container, USERS, { selectable: true });
    expect(container.querySelector('.mn-user-table__check-all')).toBeTruthy();
    ctrl.destroy();
  });

  it('destroy clears container innerHTML', () => {
    const ctrl = userTable(container, USERS);
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
  });

  it('displays user count badge', () => {
    const ctrl = userTable(container, USERS);
    const badge = container.querySelector('.mn-user-table__count');
    expect(badge?.textContent).toBe('3 users');
    ctrl.destroy();
  });

  it('fires onAction callback for action buttons', () => {
    const onAction = vi.fn();
    const ctrl = userTable(container, USERS, { onAction });
    const editBtn = container.querySelector<HTMLButtonElement>('[data-act="edit"]');
    editBtn?.click();
    expect(onAction).toHaveBeenCalledWith(USERS[0], 'edit');
    ctrl.destroy();
  });
});
