import { defineConfig } from 'vite'
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
  ]
})