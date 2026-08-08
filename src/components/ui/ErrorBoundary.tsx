import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface Estado {
  erro: Error | null
}

/**
 * Rede de segurança da árvore.
 *
 * Sem isto, qualquer exceção durante a renderização desmonta a aplicação
 * inteira e deixa a página em branco — sem mensagem, sem rota de saída. O
 * protótipo não tinha nenhuma.
 */
export class ErrorBoundary extends Component<Props, Estado> {
  override state: Estado = { erro: null }

  static getDerivedStateFromError(erro: Error): Estado {
    return { erro }
  }

  override componentDidCatch(erro: Error, info: ErrorInfo) {
    // Ponto de integração com um serviço de monitoramento (Sentry e afins).
    console.error('[BI&B] erro não tratado na renderização:', erro, info.componentStack)
  }

  override render() {
    if (!this.state.erro) return this.props.children

    return (
      <div role="alert" style={ESTILO_CAIXA}>
        <h1 style={{ fontSize: '1.75rem', letterSpacing: '-0.03em', margin: 0 }}>
          Algo saiu do rumo por aqui.
        </h1>
        <p style={{ color: 'var(--ink-2)', margin: 0, maxWidth: '46ch', lineHeight: 1.6 }}>
          A página não conseguiu carregar. Recarregar costuma resolver; se insistir, avise a gente
          pelo rodapé.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.reload()
          }}
          style={ESTILO_BOTAO}
        >
          Recarregar a página
        </button>
      </div>
    )
  }
}

// Estilos inline de propósito: se o erro veio do carregamento do CSS, uma
// classe não ajudaria.
const ESTILO_CAIXA = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '2rem',
  textAlign: 'center' as const,
  background: '#FBF6EE',
  color: '#14312F',
  fontFamily: "'Manrope', system-ui, sans-serif",
}

const ESTILO_BOTAO = {
  marginTop: '0.5rem',
  padding: '13px 26px',
  borderRadius: '999px',
  border: 'none',
  background: '#CF471E',
  color: '#fff',
  fontSize: '0.9375rem',
  fontWeight: 700,
  cursor: 'pointer',
}
