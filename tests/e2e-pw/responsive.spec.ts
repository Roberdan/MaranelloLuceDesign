/**
 * Playwright E2E tests — Responsive viewport behavior.
 * Tests at 375px (mobile), 768px (tablet), 1280px (desktop).
 * Uses /demo/e2e.html with responsive test fixtures.
 */
import { test, expect } from '@playwright/test';

const MOBILE  = { width: 375,  height: 812 };
const TABLET  = { width: 768,  height: 1024 };
const DESKTOP = { width: 1280, height: 800 };

test.describe('Responsive — Mobile (375px)', () => {
  test.use({ viewport: MOBILE });

  test('sidebar is off-canvas at 375px', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    const sidebar = page.locator('[data-testid="sidebar"]');
    // Sidebar exists in DOM but is off-canvas (width 0 or translated off-screen)
    await expect(sidebar).toHaveCount(1);
    const box = await sidebar.boundingBox();
    expect(box === null || box.width === 0 || box.x + box.width <= 0).toBeTruthy();
  });

  test('spacing token --space-5xl is 3rem at mobile', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    // Token is calc() so evaluate via element computed style (3rem at 16px = 48px)
    const val = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.paddingTop = 'var(--space-5xl)';
      document.body.appendChild(el);
      const px = getComputedStyle(el).paddingTop;
      el.remove();
      return px;
    });
    expect(val).toBe('48px'); // 3rem × 16px
  });

  test('form grid is single-column at 375px', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    const form = page.locator('[data-testid="form-grid"]');
    const cols = await form.evaluate(el =>
      getComputedStyle(el).getPropertyValue('grid-template-columns').trim()
    );
    // Single column: should be one value (e.g., "343px" or "1fr")
    expect(cols.split(' ').length).toBe(1);
  });

  test('data table scroll container has overflow-x auto', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    const scroll = page.locator('[data-testid="data-table"] .mn-dt__scroll');
    const overflow = await scroll.evaluate(el =>
      getComputedStyle(el).overflowX
    );
    expect(overflow).toBe('auto');
  });
});

test.describe('Responsive — Tablet (768px)', () => {
  test.use({ viewport: TABLET });

  test('spacing tokens are intermediate at tablet', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    // Token is calc() so evaluate via element computed style (5rem at 16px = 80px)
    const val = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.paddingTop = 'var(--space-5xl)';
      document.body.appendChild(el);
      const px = getComputedStyle(el).paddingTop;
      el.remove();
      return px;
    });
    expect(val).toBe('80px'); // 5rem × 16px
  });
});

test.describe('Responsive — Desktop (1280px)', () => {
  test.use({ viewport: DESKTOP });

  test('spacing tokens are full at desktop', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    // Read resolved value via an element — token is calc() expression at desktop so
    // getPropertyValue returns the raw calc string, not '8rem'. paddingTop gives px.
    const val = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.paddingTop = 'var(--space-5xl)';
      document.body.appendChild(el);
      const px = getComputedStyle(el).paddingTop;
      el.remove();
      return px;
    });
    // 8rem at default 16px base font-size = 128px
    expect(val).toBe('128px');
  });

  test('form grid has multiple columns at desktop', async ({ page }) => {
    await page.goto('/demo/e2e.html');
    const form = page.locator('[data-testid="form-grid"]');
    const cols = await form.evaluate(el =>
      getComputedStyle(el).getPropertyValue('grid-template-columns').trim()
    );
    // Desktop: should have 2+ columns
    expect(cols.split(' ').length).toBeGreaterThanOrEqual(2);
  });
});
