import { createContext, use } from 'react'
import type { Usuario } from '@/services/autenticacao'

/**
 * Em que ponto do fluxo de autenticação a aplicação está.
 *
 * Não há estado de carregamento: `sessionStorage` é síncrono e a sessão é lida
 * antes da primeira renderização, então o estado já nasce resolvido.
 */
export type EstadoAuth = 'anonimo' | 'autenticado'

export interface AuthContexto {
  estado: EstadoAuth
  usuario: Usuario | null
  /** Atalho para `estado === 'autenticado'`. */
  autenticado: boolean
  /** Verdadeiro enquanto uma tentativa de login está em curso. */
  entrando: boolean
  /** Mensagem do último erro de login, ou `null`. */
  erro: string | null
  /**
   * Tenta autenticar. Devolve `true` no sucesso — o chamador usa isso para
   * decidir se fecha o modal ou para onde redireciona, sem precisar observar o
   * estado num efeito.
   */
  entrar: (usuario: string, senha: string) => Promise<boolean>
  sair: () => void
  /** Apaga a mensagem de erro, ao trocar de tela ou editar o campo. */
  limparErro: () => void
}

export const AuthContext = createContext<AuthContexto | null>(null)

/** Acessa a autenticação. Lança se usado fora do provider. */
export function useAuth(): AuthContexto {
  const ctx = use(AuthContext)
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.')
  }
  return ctx
}
