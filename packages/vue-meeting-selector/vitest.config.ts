import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
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
      exclude: [...configDefaults.exclude],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
);
