/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
//
// Note: COMMIT_REF is specific to Netlify environment
//
export default defineConfig({
  envPrefix: 'BUNDLE_',
  plugins: [react()],
  define: {
    __DEFINE_COMMIT_REF__: JSON.stringify(process.env.COMMIT_REF || ''),
    __DEFINE_BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // two separate entries makes smaller chunks for highcharts case
          'highcharts-vendor': ['@highcharts/react'],
          'highcharts-stock-vendor': ['@highcharts/react/Stock'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
