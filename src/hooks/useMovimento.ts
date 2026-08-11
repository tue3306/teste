import { useSyncExternalStore } from 'react'

/**
 * Preferência de movimento do sistema.
 *
 * O site **anima sozinho**. Não existe interruptor, não existe "ligar
 * animações", não existe nada que o usuário precise achar antes de a página
 * ganhar vida — a versão anterior tinha um seletor no rodapé e, por trás de um
 * aviso de privacidade, ele era inalcançável nos primeiros dois cliques. Uma
 * home que chega parada e depende de configuração para se mexer está quebrada.
 *
 * `prefers-reduced-motion` continua respeitado, mas pelo critério certo:
 * **amplitude**. O que a preferência combate é deslocamento amplo, rápido ou
 * atrelado ao scroll — parallax, cartões voando, contadores disparando. Um
 * ponto de 8px pulsando, um degradê respirando e uma faixa deslizando devagar
 * não estão nessa categoria e continuam rodando.
 *
 * Essa distinção não é teórica. No Windows, desligar "efeitos de animação" —
 * coisa que muita gente faz pensando no desempenho da máquina — passa a
 * anunciar `prefers-reduced-motion: reduce` para a web inteira. Tratar esse
 * pedido como "apague tudo" mata o site para quem nunca pediu isso a site
 * nenhum.
 *
 * O valor resolvido vira o atributo `data-motion` no `<html>`, e é dele que o
 * CSS depende. Uma fonte de verdade só, compartilhada com o JavaScript.
 */

const CONSULTA = '(prefers-reduced-motion: reduce)'

function assinar(aoMudar: () => void) {
  const mql = window.matchMedia(CONSULTA)
  const escutar = () => {
    aplicarAtributo()
    aoMudar()
  }
  mql.addEventListener('change', escutar)
  return () => {
    mql.removeEventListener('change', escutar)
  }
}

/** O sistema operacional está pedindo menos movimento? */
export function movimentoReduzido(): boolean {
  return window.matchMedia(CONSULTA).matches
}

/**
 * Escreve o resultado no `<html>`.
 *
 * O mesmo cálculo roda num script embutido no `index.html`, antes da primeira
 * pintura — sem ele, a página apareceria com a amplitude cheia por um instante
 * antes de o React montar e corrigir.
 */
function aplicarAtributo() {
  document.documentElement.dataset['motion'] = movimentoReduzido() ? 'reduzido' : 'ok'
}

/**
 * Verdadeiro quando o movimento de **grande amplitude** deve ser contido.
 *
 * Componentes que animam poucos pixels não precisam consultar isto: eles rodam
 * sempre. Quem usa é quem desloca de verdade — parallax, tilt, cartões
 * flutuantes, contadores.
 */
export function useMovimentoReduzido(): boolean {
  return useSyncExternalStore(assinar, movimentoReduzido, () => false)
}
