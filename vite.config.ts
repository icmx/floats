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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'highcharts-vendor': [
            'highcharts/highstock',
            'highcharts-react-official',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
