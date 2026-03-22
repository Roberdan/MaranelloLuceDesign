/**
 * Cross-browser smoke test — verifies core Maranello IIFE APIs work on
 * both Chromium and WebKit (Safari). Catches Safari-specific failures like
 * missing APIs (structuredClone), CustomEvent issues, or DOM manipulation
 * differences.
 */
import { test, expect } from '@playwright/test';

test.describe('Cross-browser IIFE smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/index.html');
    await page.waitForFunction(() => typeof window.Maranello === 'object');
  });

  test('Maranello namespace exists with core exports', async ({ page }) => {
    const types = await page.evaluate(() => ({
      createLayout: typeof window.Maranello.createLayout,
      header: typeof window.Maranello.header?.init,
      sparkline: typeof window.Maranello.sparkline,
      toast: typeof window.Maranello.toast,
      dataTable: typeof window.Maranello.dataTable,
      gantt: typeof window.Maranello.gantt,
    }));

    expect(types.createLayout).toBe('function');
    expect(types.header).toBe('function');
    expect(types.sparkline).toBe('function');
    expect(types.toast).toBe('function');
    expect(types.dataTable).toBe('function');
    expect(types.gantt).toBe('function');
  });

  test('createLayout manages slot visibility', async ({ page }) => {
    const result = await page.evaluate(() => {
      const div = document.createElement('div');
      div.innerHTML = [
        '<div id="mn-slot-strip" hidden></div>',
        '<div id="mn-slot-left" hidden></div>',
        '<div id="mn-slot-center"></div>',
        '<div id="mn-slot-right" hidden></div>',
      ].join('');
      document.body.appendChild(div);

      const layout = window.Maranello.createLayout(div);
      layout.register('test', { label: 'Test' });
      layout.showView('test');
      const afterShow = JSON.parse(JSON.stringify(layout.state));

      layout.toggleLeft();
      const afterToggle = JSON.parse(JSON.stringify(layout.state));

      layout.destroy();
      div.remove();
      return { afterShow, afterToggle };
    });

    expect(result.afterShow.view).toBe('test');
    expect(result.afterToggle.left).toBe(true);
  });

  test('header.init renders and fires events', async ({ page }) => {
    const result = await page.evaluate(() => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      let onClickFired = false;
      let eventFired = false;
      let eventDetail = null;

      document.addEventListener('header-button-click', (e) => {
        eventFired = true;
        eventDetail = e.detail;
      }, { once: true });

      window.Maranello.header.init(el, {
        brand: { label: 'TestApp' },
        left: [{
          id: 'home',
          label: 'Home',
          onClick: () => { onClickFired = true; },
        }],
      });

      const btn = el.querySelector('.mn-header__btn');
      const nav = el.querySelector('.mn-header');
      if (btn) btn.click();

      const navHeight = nav ? getComputedStyle(nav).height : '0px';
      el.remove();

      return { onClickFired, eventFired, eventDetail, btnFound: !!btn, navHeight };
    });

    expect(result.btnFound).toBe(true);
    expect(result.onClickFired).toBe(true);
    expect(result.eventFired).toBe(true);
    expect(result.eventDetail).toEqual({ id: 'home', label: 'Home' });
  });

  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/demo/index.html');
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });
});
