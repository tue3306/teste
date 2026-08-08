import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        /**
         * Separa o vendor do código da aplicação: as dependências mudam de
         * hash muito mais devagar que o app, então o cache do usuário sobrevive
         * a cada deploy.
         *
         * O agrupamento é por caminho de módulo, e não por lista de pacotes:
         * declarar `['react','react-dom']` gerava um chunk vazio, porque o
         * runtime real do React vive em `react/jsx-runtime` e nos arquivos
         * internos do `react-dom`, que não casavam com o nome do pacote.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (/[\\/]node_modules[\\/](react-router|react-router-dom|cookie|set-cookie-parser)[\\/]/.test(id)) {
            return 'router'
          }
          // `motion` reexporta `framer-motion`, que é um pacote irmão. Deixar
          // um no chunk de animação e o outro no vendor cria dependência
          // circular entre os dois chunks — os quatro precisam andar juntos.
          if (/[\\/]node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/.test(id)) {
            return 'motion'
          }
          // Qualquer outra dependência fica a cargo do Rollup, que a coloca
          // junto de quem a usa. Um bucket "vendor" fixo geraria chunk vazio
          // enquanto não houver mais nada além dos três acima.
          return
        },
      },
    },
  },
})
