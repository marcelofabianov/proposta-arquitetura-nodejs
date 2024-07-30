import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    clearMocks: true,
    globals: false,
    environment: 'node',
    include: ['./src/**/*.test.ts'],
    coverage: {
      exclude: ['node_modules', 'dist', 'vite.config.ts'],
      provider: 'v8',
      reportsDirectory: './tests/output/unit/coverage',
      include: ['src/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/_core'),
    },
  },
})
