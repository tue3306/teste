import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

/**
 * Portão das rotas privadas.
 *
 * Duas decisões, cada uma consertando um problema real:
 *
 * 1. Ao redirecionar, guarda em `state.de` de onde a pessoa veio, para o login
 *    devolvê-la ao lugar certo em vez de despejá-la sempre na home.
 *
 * 2. `replace` no `Navigate`: sem ele, o histórico enche de entradas para a
 *    rota protegida, e o botão voltar do navegador vira um laço entre o login e
 *    a página que ele mesmo bloqueou.
 *
 * Não há tela de espera porque não há espera: o `AuthProvider` lê a sessão de
 * forma síncrona, antes da primeira renderização.
 */
export function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth()
  const local = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ de: local.pathname + local.search }} />
  }

  return <>{children}</>
}
