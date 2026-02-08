import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  build: {
    target: 'ES2022',
    minify: 'terser',
    sourcemap: false,
  },
  preview: {
    port: 3000,
  },
});
