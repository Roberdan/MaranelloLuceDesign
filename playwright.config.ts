import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/e2e-pw/**/*.spec.ts'],
  timeout: 60_000,
  retries: 1,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: 'http://localhost:3333',
    headless: true,
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npx serve . -l 3333 --no-clipboard',
    port: 3333,
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
