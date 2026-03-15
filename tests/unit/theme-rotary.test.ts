/**
 * Unit tests for ThemeRotary controller.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { themeRotary } from '../../src/ts/theme-rotary';
import type { ThemeRotaryController } from '../../src/ts/theme-rotary';

describe('themeRotary', () => {
  let container: HTMLElement;
  let ctrl: ThemeRotaryController;

  beforeEach(() => {
    document.body.className = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('creates rotary DOM in container', () => {
    ctrl = themeRotary({ container });
    expect(container.querySelector('.mn-theme-rotary')).toBeTruthy();
    ctrl.destroy();
  });

  it('reads initial theme from body', () => {
    document.body.classList.add('mn-nero');
    ctrl = themeRotary({ container });
    expect(ctrl.getTheme()).toBe('nero');
    ctrl.destroy();
  });

  it('sets theme via controller', () => {
    ctrl = themeRotary({ container });
    ctrl.setTheme('avorio');
    expect(document.body.classList.contains('mn-avorio')).toBe(true);
    expect(ctrl.getTheme()).toBe('avorio');
    ctrl.destroy();
  });

  it('calls onChange callback', () => {
    const onChange = vi.fn();
    ctrl = themeRotary({ container, onChange });
    ctrl.setTheme('nero');
    expect(onChange).toHaveBeenCalledWith('nero');
    ctrl.destroy();
  });

  it('destroy removes DOM', () => {
    ctrl = themeRotary({ container });
    expect(container.querySelector('.mn-theme-rotary')).toBeTruthy();
    ctrl.destroy();
    expect(container.querySelector('.mn-theme-rotary')).toBeFalsy();
  });

  it('respects custom size', () => {
    ctrl = themeRotary({ container, size: 200 });
    const dial = container.querySelector('.mn-theme-rotary__dial') as HTMLElement;
    expect(dial?.style.width).toBe('200px');
    ctrl.destroy();
  });
});
