import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: [
      'packages/*/tests/**/*.test.ts',
      'starters/*/tests/**/*.test.ts',
      'tests/unit/**/*.test.ts',
    ],
    exclude: ['tests/e2e-pw/**', 'e2e/**', 'node_modules/**'],
    environment: 'happy-dom',
  },
});
