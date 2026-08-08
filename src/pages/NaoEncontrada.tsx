import { Botao } from '@/components/ui/Botao'
import { Logo } from '@/components/ui/Logo'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'

/**
 * 404.
 *
 * O protótipo não tinha rotas, logo não tinha como ter uma: qualquer URL
 * mostrava a home. Com rotas de verdade, um endereço errado precisa dizer isso
 * e oferecer uma saída.
 */
export function NaoEncontrada() {
  useMetaDaPagina('Página não encontrada', 'Esta página não existe na BI&B.')

  return (
    <main
      id="conteudo"
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        textAlign: 'center',
        padding: 'var(--gutter)',
      }}
    >
      <Logo />
      <p className="eyebrow">erro 404</p>
      <h1 className="titulo" style={{ marginBlockStart: 0 }}>
        Esse endereço não
        <br />
        <span className="serif">saiu do papel.</span>
      </h1>
      <p className="lead" style={{ maxWidth: '44ch' }}>
        A página que você procurou não existe — ou mudou de lugar. Volte ao início ou abra a
        plataforma para continuar planejando.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <Botao para="/">Voltar ao início</Botao>
        <Botao para="/plataforma/voos" variante="secundario">
          Abrir plataforma
        </Botao>
      </div>
    </main>
  )
}
