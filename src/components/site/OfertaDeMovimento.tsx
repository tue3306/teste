import { useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import {
  definirPreferenciaMovimento,
  useMovimentoReduzido,
  usePreferenciaMovimento,
} from '@/hooks/useMovimento'
import { useConsentimento } from '@/hooks/useConsentimento'
import css from './OfertaDeMovimento.module.css'

/**
 * Oferece ligar a animação quando o sistema a está bloqueando.
 *
 * O caso é comum e invisível para quem o vive: no Windows, desligar "efeitos de
 * animação" — algo que muita gente faz pensando no desempenho da máquina — faz
 * o navegador anunciar `prefers-reduced-motion` para **todo** site. O site
 * obedece, como manda o padrão, e a pessoa conclui que a página é sem graça,
 * sem nunca ligar uma coisa à outra.
 *
 * Aparece só quando as três condições valem ao mesmo tempo: o sistema pede
 * menos movimento, o usuário ainda não opinou, e o aviso de privacidade já saiu
 * da frente. Quem realmente quer menos movimento clica em "manter assim" uma
 * vez e não vê mais.
 */
export function OfertaDeMovimento() {
  const preferencia = usePreferenciaMovimento()
  const reduzido = useMovimentoReduzido()
  const consentimento = useConsentimento()
  const [dispensado, setDispensado] = useState(false)

  const oferecer =
    preferencia === 'sistema' && reduzido && consentimento !== 'pendente' && !dispensado

  if (!oferecer) return null

  return (
    <aside className={css['aviso']} role="dialog" aria-labelledby="oferta-movimento-titulo">
      <p id="oferta-movimento-titulo" className={css['titulo']}>
        <Icone nome="estrela" tamanho={15} />O site está sem animação
      </p>
      <p className={css['texto']}>
        Seu sistema está pedindo menos movimento, e nós obedecemos — vale para todos os sites que
        você abre. Quer ver a BI&amp;B com as animações ligadas?
      </p>
      <div className={css['acoes']}>
        <Botao
          tamanho="sm"
          onClick={() => {
            definirPreferenciaMovimento('ligado')
          }}
        >
          Ligar animações
        </Botao>
        <Botao
          tamanho="sm"
          variante="secundario"
          onClick={() => {
            // Só esconde o convite; a preferência segue "sistema", então o
            // usuário pode mudar de ideia pelo seletor no rodapé.
            setDispensado(true)
          }}
        >
          Manter assim
        </Botao>
      </div>
    </aside>
  )
}
