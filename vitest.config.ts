import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['tests/**/*.test.ts', 'tests/e2e/*.spec.ts'],
    exclude: ['tests/e2e-pw/**', 'e2e/**', 'node_modules/**'],
    environment: 'node',
  },
});
