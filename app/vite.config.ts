import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default defineConfig({
  plugins: [react(),nodePolyfills()],
  resolve: {
    alias: {
      // Use absolute paths for aliasing
      process: resolve(__dirname, 'node_modules/process'),
      buffer: resolve(__dirname, 'node_modules/buffer/'),
    },
  },
  define: {
    global: 'globalThis',
    process: {
      env: {
        NODE_ENV: '"development"',
      },
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
});
