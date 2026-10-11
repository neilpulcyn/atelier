import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base: the same build works at / (npm start) and under /atelier/ on GitHub Pages.
  base: './',
  plugins: [react()],
  preview: { port: 4173, host: true },
  server: { port: 5173, host: true },
});
