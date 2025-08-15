import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ['./setupTests.ts'],
    environment: 'jsdom',
    typecheck: {
      enabled: true,
    },
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*'],
      exclude: ['src/main.ts'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
