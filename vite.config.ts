import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy' // Importa o plugin

export default defineConfig({
  plugins: [
    react(),
    // Adicione o plugin e configure-o para copiar seus arquivos HTML
    viteStaticCopy({
      targets: [
        {
          src: 'contato.html',
          dest: '.' // '.' significa a raiz da pasta 'dist'
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
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contato: resolve(__dirname, 'contato.html'),
        privacidade: resolve(__dirname, 'privacidade.html'),
        termos: resolve(__dirname, 'termos.html'),
      },
    },
  },
})