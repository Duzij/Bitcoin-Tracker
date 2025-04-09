import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['lucide-react'],
  },
  css: {
    postcss: './postcss.config.js',
  },
  plugins: [
    react(),
    checker({ typescript: true })
  ]
});
