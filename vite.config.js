import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { mkdirSync, copyFileSync } from 'node:fs';
export default defineConfig({ base: './', plugins: [{ name: 'copy-classic-script', closeBundle() { mkdirSync('dist/assets/js', { recursive: true }); copyFileSync('assets/js/main.js', 'dist/assets/js/main.js'); } }], build: { rollupOptions: { input: { trabalhos: resolve(import.meta.dirname, 'index.html'), sobre: resolve(import.meta.dirname, 'sobre.html'), maestro: resolve(import.meta.dirname, 'banda-musical-maestro-santa-rosa.html'), bloco: resolve(import.meta.dirname, 'bloco-do-urubu.html') } } } });
