import { test, expect } from '@playwright/test';

test.describe('Next.js Consumer Smoke Test', () => {
  test('page loads without errors and components mount', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('http://localhost:3099');

    // Wait for hydration
    await page.waitForSelector('[data-testid="title"]', { timeout: 10000 });

    // Header mounted
    const header = page.locator('[data-testid="header"]');
    await expect(header).toBeVisible();

    // Gauge canvas exists
    const gauge = page.locator('[data-testid="gauge"]');
    await expect(gauge).toBeVisible();

    // Table mounted
    const table = page.locator('[data-testid="table"]');
    await expect(table).toBeVisible();

    // Theme button works
    const themeBtn = page.locator('[data-testid="theme-btn"]');
    await themeBtn.click();
    await expect(page.locator('body')).toHaveClass(/mn-nero/);

    // No page errors
    expect(errors).toEqual([]);
  });
});
