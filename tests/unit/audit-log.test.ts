/**
 * Unit tests for audit-log component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { auditLog, type AuditEntry } from '../../src/ts/audit-log';

function makeEntry(overrides: Partial<AuditEntry> = {}): AuditEntry {
  return {
    id: 'al-001',
    timestamp: '2026-03-15 14:22',
    actor: 'Marco Rossi',
    action: 'Updated billing plan',
    severity: 'info',
    ...overrides,
  };
}

let container: HTMLDivElement;

beforeEach(() => { container = document.createElement('div'); });

describe('auditLog', () => {
  it('renders initial entries as list items', () => {
    const entries = [makeEntry(), makeEntry({ id: 'al-002', action: 'Deployed v4.11', severity: 'success' })];
    const ctrl = auditLog(container, entries);
    expect(container.querySelectorAll('.mn-audit__entry').length).toBe(2);
    ctrl.destroy();
  });

  it('sets role=log on the container', () => {
    const ctrl = auditLog(container, []);
    expect(container.getAttribute('role')).toBe('log');
    ctrl.destroy();
  });

  it('renders filter tabs when filterable', () => {
    const ctrl = auditLog(container, [], { filterable: true });
    const tabs = container.querySelectorAll('.mn-audit__tab');
    expect(tabs.length).toBe(6); // all + 5 severities
    ctrl.destroy();
  });

  it('omits filter tabs when filterable is false', () => {
    const ctrl = auditLog(container, [], { filterable: false });
    expect(container.querySelectorAll('.mn-audit__tab').length).toBe(0);
    ctrl.destroy();
  });

  it('prepend adds entry at the top of the list', () => {
    const ctrl = auditLog(container, [makeEntry()]);
    ctrl.prepend(makeEntry({ id: 'al-new', action: 'Revoked API key' }));
    const first = container.querySelector('.mn-audit__entry');
    expect(first?.dataset.id).toBe('al-new');
    ctrl.destroy();
  });

  it('append adds entry at the bottom of the list', () => {
    const ctrl = auditLog(container, [makeEntry()]);
    ctrl.append(makeEntry({ id: 'al-last', action: 'Created workspace' }));
    const items = container.querySelectorAll('.mn-audit__entry');
    expect(items[items.length - 1].dataset.id).toBe('al-last');
    ctrl.destroy();
  });

  it('setFilter hides non-matching entries', () => {
    const entries = [
      makeEntry({ id: 'e1', severity: 'error' }),
      makeEntry({ id: 'e2', severity: 'info' }),
    ];
    const ctrl = auditLog(container, entries);
    ctrl.setFilter('error');
    const visible = container.querySelectorAll<HTMLElement>('.mn-audit__entry');
    const shown = [...visible].filter(el => el.style.display !== 'none');
    expect(shown.length).toBe(1);
    expect(shown[0].dataset.severity).toBe('error');
    ctrl.destroy();
  });

  it('clear removes all entries from the list', () => {
    const ctrl = auditLog(container, [makeEntry(), makeEntry({ id: 'al-002' })]);
    ctrl.clear();
    expect(container.querySelectorAll('.mn-audit__entry').length).toBe(0);
    ctrl.destroy();
  });

  it('destroy clears container and removes role', () => {
    const ctrl = auditLog(container, [makeEntry()]);
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-audit')).toBe(false);
  });

  it('respects maxEntries limit by pruning oldest', () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      makeEntry({ id: `e-${i}`, action: `Action ${i}` }),
    );
    const ctrl = auditLog(container, entries, { maxEntries: 3 });
    expect(container.querySelectorAll('.mn-audit__entry').length).toBe(3);
    ctrl.destroy();
  });

  it('renders metadata chips when entry has metadata', () => {
    const entry = makeEntry({ ipAddress: '192.168.1.42', metadata: { region: 'eu-west-1' } });
    const ctrl = auditLog(container, [entry]);
    expect(container.innerHTML).toContain('192.168.1.42');
    expect(container.innerHTML).toContain('eu-west-1');
    ctrl.destroy();
  });

  it('renders actor role badge when provided', () => {
    const entry = makeEntry({ actorRole: 'admin' });
    const ctrl = auditLog(container, [entry]);
    expect(container.innerHTML).toContain('mn-audit__actor-badge');
    expect(container.innerHTML).toContain('admin');
    ctrl.destroy();
  });
});
