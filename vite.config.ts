// Arquivo: vite.config.ts (VERSÃO FINAL CORRIGIDA)

import { defineConfig } from 'vite';
// CORREÇÃO: Este plugin usa "export default", então o importamos sem as chaves {}.
// O nome "viteStaticCopy" pode ser qualquer um, mas este é o convencional.
import viteStaticCopy from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    // Usando a importação default que acabamos de corrigir.
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