import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use relative paths so Electron can load files via the file:// protocol
  base: './',
  build: {
    outDir: 'dist'
  }
});
