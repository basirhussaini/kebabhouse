import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve('index.html'),
        menu: resolve('menu.html'),
        about: resolve('about.html'),
        karta: resolve('karta.html'),
        stader: resolve('stader.html'),
        recensioner: resolve('recensioner.html')
      }
    }
  }
});
