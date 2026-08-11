import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

/**
 * Configuração de testes.
 *
 * O alias `@` precisa ser repetido aqui: o Vitest não lê o `paths` do
 * tsconfig, e sem isto todo import de `@/data/rj` falha na resolução.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
