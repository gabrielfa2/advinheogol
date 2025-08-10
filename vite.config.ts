// Arquivo: vite.config.ts (VERSÃO CORRIGIDA)

import { defineConfig } from 'vite';
// O plugin do React foi removido pois o projeto não o utiliza.
import { staticCopy } from 'vite-plugin-static-copy'; // NOME DA IMPORTAÇÃO CORRIGIDO

export default defineConfig({
  plugins: [
    // A chamada para react() foi removida.

    // Usando o nome correto da função do plugin.
    staticCopy({
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