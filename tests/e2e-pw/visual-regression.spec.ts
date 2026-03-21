/**
 * Visual regression tests for theme rendering.
 * Uses Playwright's toHaveScreenshot() to capture baseline screenshots
 * and detect unintended visual changes across all 6 theme variants.
 *
 * Usage:
 *   npx playwright test visual-regression   — compare against baselines
 *   npx playwright test visual-regression --update-snapshots — regenerate baselines
 */
import { test, expect, type Page } from '@playwright/test';

const THEMES = [
  { name: 'editorial',        bodyClass: null },
  { name: 'nero',             bodyClass: 'mn-nero' },
  { name: 'avorio',           bodyClass: 'mn-avorio' },
  { name: 'colorblind',       bodyClass: 'mn-colorblind' },
  { name: 'sugar',            bodyClass: 'mn-sugar' },
  { name: 'sugar-colorblind', bodyClass: 'mn-sugar mn-colorblind' },
] as const;

const SECTIONS = [
  'hero', 'cards', 'charts', 'gauges', 'forms', 'icons',
] as const;

async function applyTheme(page: Page, bodyClass: string | null) {
  await page.evaluate((cls) => {
    document.body.classList.remove('mn-nero', 'mn-avorio', 'mn-colorblind', 'mn-sugar');
    if (cls) cls.split(' ').forEach(c => document.body.classList.add(c));
  }, bodyClass);
  // Allow CSS transitions to settle
  await page.waitForTimeout(300);
}

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, id);
  await page.waitForTimeout(200);
}

test.describe('Visual Regression', () => {
  // Use a consistent viewport for reproducible screenshots
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const theme of THEMES) {
    test.describe(`${theme.name} theme`, () => {
      for (const section of SECTIONS) {
        test(`${section} renders correctly`, async ({ page }) => {
          await page.goto('/demo/index.html');
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

          await applyTheme(page, theme.bodyClass);
          await scrollToSection(page, section);

          // Mask canvas elements — they render async and may have timing variance
          const canvases = page.locator('canvas');
          const canvasCount = await canvases.count();
          const maskLocators = canvasCount > 0 ? [canvases] : [];

          await expect(page).toHaveScreenshot(
            `${theme.name}-${section}.png`,
            {
              maxDiffPixelRatio: 0.01,
              mask: maskLocators,
              animations: 'disabled',
            },
          );
        });
      }
    });
  }

  // Full-page smoke test per theme (no mask, captures everything)
  for (const theme of THEMES) {
    test(`${theme.name} full page smoke`, async ({ page }) => {
      await page.goto('/demo/e2e.html');
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
      await applyTheme(page, theme.bodyClass);

      await expect(page).toHaveScreenshot(
        `${theme.name}-fullpage.png`,
        {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
          animations: 'disabled',
        },
      );
    });
  }
});
