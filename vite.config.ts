// Arquivo: vite.config.ts (VERSÃO FINAL E CORRETA)

import { defineConfig } from 'vite';
// A importação correta, que usa chaves e o nome 'viteStaticCopy'
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    // Chamando a função importada corretamente
    viteStaticCopy({
      targets: [
        {
          src: 'contato.html',
          dest: '.'
        },
        {
          src: 'privacidade.html',
          dest: '.'
        },
        {
          src: 'termos.html',
          dest: '.'
        }
      ]
    })
  ]
});