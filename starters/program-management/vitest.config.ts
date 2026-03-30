import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**'],
    environment: 'happy-dom',
  },
});
