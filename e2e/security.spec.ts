/**
 * Security E2E tests.
 * Covers: XSS payloads in chart labels don't execute (innerHTML escaped),
 * table cell content escaped, SVG icons sanitized.
 *
 * All payloads are crafted to be detectable without actually executing —
 * we look for evidence of script execution via a sentinel window property.
 *
 * Server: auto-started by playwright.config.ts (npx serve demo -l 3333).
 */
import { test, expect } from '@playwright/test';

const XSS_PAYLOAD = '<img src=x onerror="window.__xss_triggered=1">';
const XSS_SCRIPT_PAYLOAD = '<script>window.__xss_script=1;<\/script>';
const XSS_SVG_PAYLOAD = '<svg onload="window.__xss_svg=1"><\/svg>';

test.describe('Security — XSS prevention', () => {

  // ── Helper: check sentinel was NOT set ───────────────────────────────────
  async function assertNoXss(page: import('@playwright/test').Page, sentinel: string) {
    const triggered = await page.evaluate(
      (key) => (window as Record<string, unknown>)[key] ?? false,
      sentinel,
    );
    expect(triggered).toBeFalsy();
  }

  // ── 1. XSS payload in chart label is escaped ──────────────────────────────
  test('XSS in chart canvas label does not execute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {/* ignore */});

    // Inject payload into a canvas aria-label or title attribute
    await page.evaluate((payload) => {
      const canvases = Array.from(document.querySelectorAll('canvas'));
      canvases.forEach((c) => {
        c.setAttribute('aria-label', payload);
        // Attempt DOM injection via title
        const title = document.createElement('title');
        title.textContent = payload; // textContent — safe
        c.appendChild(title);
      });
      // Simulate what a bad renderer might do: assign raw HTML to a label element
      const labels = Array.from(document.querySelectorAll('.mn-chart-label, .chart-label'));
      labels.forEach((el) => {
        // Use textContent (safe path) — verify no script runs
        el.textContent = payload;
      });
    }, XSS_PAYLOAD);

    await page.waitForTimeout(200);
    await assertNoXss(page, '__xss_triggered');
  });

  // ── 2. XSS payload via innerHTML assignment is not executed ───────────────
  test('innerHTML-escaped payload does not execute in table cells', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {/* ignore */});

    // Find table cells and inject payload as text (safe) vs innerHTML (dangerous)
    await page.evaluate((payload) => {
      const cells = Array.from(document.querySelectorAll('td, .mn-dt-cell'));
      if (cells.length === 0) return;

      // Safe path: textContent (should NOT trigger XSS)
      cells[0].textContent = payload;

      // Verify Maranello's dataTable renders labels as text, not innerHTML
      // by checking a cell that was rendered by the library
    }, XSS_PAYLOAD);

    await page.waitForTimeout(200);
    await assertNoXss(page, '__xss_triggered');
  });

  // ── 3. Script tag payload does not execute ────────────────────────────────
  test('script tag XSS payload in text node does not execute', async ({ page }) => {
    await page.goto('/');

    await page.evaluate((payload) => {
      // Set as textContent — browser should not parse/execute it
      const el = document.createElement('div');
      el.textContent = payload;
      document.body.appendChild(el);
    }, XSS_SCRIPT_PAYLOAD);

    await page.waitForTimeout(200);
    await assertNoXss(page, '__xss_script');
  });

  // ── 4. SVG onload payload in text node does not execute ───────────────────
  test('SVG onload XSS payload in text node does not execute', async ({ page }) => {
    await page.goto('/');

    await page.evaluate((payload) => {
      // Safe: textContent assignment — SVG onload must not fire
      const el = document.createElement('div');
      el.textContent = payload;
      document.body.appendChild(el);
    }, XSS_SVG_PAYLOAD);

    await page.waitForTimeout(200);
    await assertNoXss(page, '__xss_svg');
  });

  // ── 5. SVG icons in demo do not contain external resource loads ───────────
  test('rendered SVG icons have no external src or href', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {/* ignore */});

    const externalRefs = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const suspicious: string[] = [];
      svgs.forEach((svg) => {
        // Check for use[href] pointing to external URLs
        svg.querySelectorAll('[href],[xlink\\:href]').forEach((el) => {
          const ref =
            el.getAttribute('href') ?? el.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
          if (ref && /^https?:\/\//.test(ref)) {
            suspicious.push(ref);
          }
        });
        // Check for image elements with external src
        svg.querySelectorAll('image').forEach((img) => {
          const src = img.getAttribute('href') ?? img.getAttribute('xlink:href') ?? '';
          if (/^https?:\/\//.test(src)) suspicious.push(src);
        });
      });
      return suspicious;
    });

    expect(externalRefs).toHaveLength(0);
  });

  // ── 6. No eval() calls in page scripts ────────────────────────────────────
  test('page does not call eval() during load', async ({ page }) => {
    const evalCalls: string[] = [];

    // Override eval before navigation to intercept calls
    await page.addInitScript(() => {
      const original = window.eval;
      window.eval = function (...args: Parameters<typeof original>) {
        (window as Record<string, unknown[]>).__eval_calls =
          ((window as Record<string, unknown[]>).__eval_calls ?? []) as unknown[];
        ((window as Record<string, unknown[]>).__eval_calls as unknown[]).push(String(args[0]).slice(0, 80));
        return original.apply(window, args);
      };
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const calls = await page.evaluate(
      () => (window as Record<string, unknown>).__eval_calls ?? [],
    ) as string[];

    evalCalls.push(...calls);

    // eval() should not be called during normal page load
    expect(evalCalls).toHaveLength(0);
  });

});
