/**
 * Unit tests for business-model-canvas component.
 * Task spec references charts-bmc; actual source is business-model-canvas.ts.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { businessModelCanvas, type BmcBlockId } from '../../src/ts/business-model-canvas';

let container: HTMLDivElement;

beforeEach(() => { container = document.createElement('div'); });

const ALL_BLOCKS: BmcBlockId[] = [
  'key-partners', 'key-activities', 'key-resources', 'value-proposition',
  'customer-relationships', 'channels', 'customer-segments',
  'cost-structure', 'revenue-streams',
];

describe('businessModelCanvas', () => {
  it('renders all 9 Osterwalder blocks', () => {
    const ctrl = businessModelCanvas(container);
    const blocks = container.querySelectorAll('.mn-bmc__block');
    expect(blocks.length).toBe(9);
    ctrl.destroy();
  });

  it('sets role=region with aria-label on the container', () => {
    const ctrl = businessModelCanvas(container);
    expect(container.getAttribute('role')).toBe('region');
    expect(container.getAttribute('aria-label')).toBe('Business Model Canvas');
    ctrl.destroy();
  });

  it('adds the mn-bmc class to the container', () => {
    const ctrl = businessModelCanvas(container);
    expect(container.classList.contains('mn-bmc')).toBe(true);
    ctrl.destroy();
  });

  it('renders default block titles', () => {
    const ctrl = businessModelCanvas(container);
    const html = container.innerHTML;
    expect(html).toContain('Key Partners');
    expect(html).toContain('Value Proposition');
    expect(html).toContain('Revenue Streams');
    ctrl.destroy();
  });

  it('renders custom block title overrides', () => {
    const ctrl = businessModelCanvas(container, {
      blocks: { 'value-proposition': { title: 'Unique Value' } },
    });
    expect(container.innerHTML).toContain('Unique Value');
    ctrl.destroy();
  });

  it('renders pre-populated items', () => {
    const ctrl = businessModelCanvas(container, {
      blocks: {
        'key-partners': {
          items: [{ id: 'kp1', text: 'Anthropic', blockId: 'key-partners' }],
        },
      },
    });
    expect(container.innerHTML).toContain('Anthropic');
    ctrl.destroy();
  });

  it('addItem inserts a new item into the specified block', () => {
    const ctrl = businessModelCanvas(container);
    ctrl.addItem('channels', 'Direct Sales');
    const channelsBlock = container.querySelector('[data-block="channels"]');
    expect(channelsBlock?.innerHTML).toContain('Direct Sales');
    ctrl.destroy();
  });

  it('addItem with empty text is a no-op', () => {
    const ctrl = businessModelCanvas(container);
    const before = ctrl.getBlocks().find(b => b.id === 'channels')!.items.length;
    ctrl.addItem('channels', '   ');
    const after = ctrl.getBlocks().find(b => b.id === 'channels')!.items.length;
    expect(after).toBe(before);
    ctrl.destroy();
  });

  it('getBlocks returns all 9 blocks with their items', () => {
    const ctrl = businessModelCanvas(container);
    ctrl.addItem('cost-structure', 'Cloud hosting');
    const blocks = ctrl.getBlocks();
    expect(blocks.length).toBe(9);
    const costBlock = blocks.find(b => b.id === 'cost-structure')!;
    expect(costBlock.items.length).toBe(1);
    expect(costBlock.items[0].text).toBe('Cloud hosting');
    ctrl.destroy();
  });

  it('removeItem removes the item from block data', () => {
    const ctrl = businessModelCanvas(container);
    ctrl.addItem('key-activities', 'Model Training');
    const itemId = ctrl.getBlocks().find(b => b.id === 'key-activities')!.items[0].id;
    ctrl.removeItem(itemId);
    const after = ctrl.getBlocks().find(b => b.id === 'key-activities')!;
    expect(after.items.length).toBe(0);
    ctrl.destroy();
  });

  it('update replaces all block data', () => {
    const ctrl = businessModelCanvas(container);
    const newBlocks = ALL_BLOCKS.map(id => ({
      id, title: id, icon: 'X', items: [],
    }));
    ctrl.update(newBlocks);
    expect(ctrl.getBlocks().every(b => b.icon === 'X')).toBe(true);
    ctrl.destroy();
  });

  it('fires onChange callback on addItem', () => {
    const onChange = vi.fn();
    const ctrl = businessModelCanvas(container, { onChange });
    ctrl.addItem('channels', 'Partner API');
    expect(onChange).toHaveBeenCalled();
    ctrl.destroy();
  });

  it('renders add button when editable', () => {
    const ctrl = businessModelCanvas(container, { editable: true });
    expect(container.querySelectorAll('.mn-bmc__add').length).toBe(9);
    ctrl.destroy();
  });

  it('destroy clears container and removes classes', () => {
    const ctrl = businessModelCanvas(container);
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-bmc')).toBe(false);
    expect(container.getAttribute('role')).toBeNull();
  });
});
