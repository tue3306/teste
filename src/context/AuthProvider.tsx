import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContexto, type EstadoAuth } from './AuthContext'
import { ErroLogin, autenticar, type Usuario } from '@/services/autenticacao'

/**
 * Onde a sessão fica.
 *
 * `sessionStorage`, e não `localStorage`: a sessão vale enquanto a aba estiver
 * aberta e some quando ela fecha. Numa demonstração que roda em máquina
 * compartilhada, deixar alguém logado indefinidamente é pior do que pedir a
 * senha de novo — e a senha desta demonstração é pública de qualquer forma.
 */
const CHAVE = 'bib:sessao'

function lerSessao(): Usuario | null {
  try {
    const bruto = window.sessionStorage.getItem(CHAVE)
    if (!bruto) return null
    const dado: unknown = JSON.parse(bruto)
    // Sessão de um formato antigo, ou adulterada à mão, é descartada em vez de
    // derrubar a aplicação com um `usuario.nome` de `undefined`.
    if (
      typeof dado === 'object' &&
      dado !== null &&
      'usuario' in dado &&
      typeof (dado as Usuario).usuario === 'string'
    ) {
      return dado as Usuario
    }
    return null
  } catch {
    return null
  }
}

/**
 * Estado de autenticação da aplicação.
 *
 * A sessão é lida no inicializador do `useState`, antes da primeira
 * renderização — e não num efeito. A diferença importa: lendo num efeito, a
 * rota protegida renderiza uma vez com `usuario === null`, redireciona para
 * `/login`, e só então a sessão guardada aparece. Quem recarregasse a
 * plataforma já autenticado seria chutado para fora e voltaria, com um piscar
 * de tela no meio.
 *
 * `sessionStorage` é síncrono, então não há nada a esperar: o estado nasce
 * resolvido e o `'carregando'` deixa de existir.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerSessao)
  const [entrando, setEntrando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const estado: EstadoAuth = usuario ? 'autenticado' : 'anonimo'

  /** Evita atualizar estado depois do desmonte, se a promessa demorar. */
  const vivo = useRef(true)

  useEffect(() => {
    vivo.current = true
    return () => {
      vivo.current = false
    }
  }, [])

  const entrar = useCallback(async (login: string, senha: string): Promise<boolean> => {
    setEntrando(true)
    setErro(null)
    try {
      const autenticado = await autenticar(login, senha)
      if (!vivo.current) return false

      setUsuario(autenticado)
      try {
        window.sessionStorage.setItem(CHAVE, JSON.stringify(autenticado))
      } catch {
        // Armazenamento bloqueado: a sessão vale só até recarregar a página.
      }
      return true
    } catch (e) {
      if (!vivo.current) return false
      setErro(
        e instanceof ErroLogin ? e.message : 'Não foi possível entrar agora. Tente de novo.',
      )
      return false
    } finally {
      if (vivo.current) setEntrando(false)
    }
  }, [])

  const sair = useCallback(() => {
    setUsuario(null)
    setErro(null)
    try {
      window.sessionStorage.removeItem(CHAVE)
    } catch {
      // Nada a fazer: o estado em memória já foi limpo.
    }
  }, [])

  const limparErro = useCallback(() => {
    setErro(null)
  }, [])

  const valor = useMemo<AuthContexto>(
    () => ({
      estado,
      usuario,
      autenticado: estado === 'autenticado',
      entrando,
      erro,
      entrar,
      sair,
      limparErro,
    }),
    [estado, usuario, entrando, erro, entrar, sair, limparErro],
  )

  return <AuthContext value={valor}>{children}</AuthContext>
}
