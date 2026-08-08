import type { ReactNode } from 'react'
import { AvisoPrivacidade } from './AvisoPrivacidade'
import { Cabecalho } from './Cabecalho'
import { OfertaDeMovimento } from './OfertaDeMovimento'
import { Rodape } from './Rodape'

interface Props {
  children: ReactNode
  /**
   * A home tem âncoras internas (#tudo, #comparar…) no menu; as páginas
   * institucionais não, e apontar para elas de fora levaria a lugar nenhum.
   */
  ancorasInternas?: boolean
}

/**
 * Moldura do site institucional: cabeçalho, conteúdo e rodapé.
 *
 * Extraído da Landing quando surgiu a segunda página. Manter as duas metades
 * sincronizadas na mão é como o rodapé de um site acaba diferente do outro.
 */
export function LayoutSite({ children, ancorasInternas = false }: Props) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Cabecalho ancorasInternas={ancorasInternas} />
      <main id="conteudo">{children}</main>
      <Rodape />
      <AvisoPrivacidade />
      <OfertaDeMovimento />
    </div>
  )
}
