import { useSyncExternalStore } from 'react'

/**
 * Preferência de movimento do site.
 *
 * O padrão da web é obedecer ao sistema operacional, e é o que fazemos — mas só
 * como ponto de partida. No Windows, desligar "efeitos de animação" faz o
 * navegador anunciar `prefers-reduced-motion: reduce` para **todo** site, e quem
 * mexeu naquele interruptor por causa do desempenho da máquina raramente
 * imagina que também apagou a animação de todas as páginas que visita.
 *
 * Por isso a preferência tem três estados: seguir o sistema (padrão), forçar
 * movimento ou forçar movimento reduzido. A escolha fica no aparelho.
 *
 * O valor resolvido vira o atributo `data-motion` no `<html>`, e é dele que
 * todo o CSS depende — não da media query. Assim há uma fonte de verdade só,
 * compartilhada entre folha de estilo e JavaScript.
 */

export type PreferenciaMovimento = 'sistema' | 'ligado' | 'reduzido'

const CHAVE = 'bib:movimento'
const CONSULTA = '(prefers-reduced-motion: reduce)'

const VALIDOS: PreferenciaMovimento[] = ['sistema', 'ligado', 'reduzido']

/** Valor assumido no servidor / pré-render, onde não há `localStorage`. */
const PADRAO = (): PreferenciaMovimento => 'sistema'

function lerArmazenado(): PreferenciaMovimento {
  try {
    const bruto = window.localStorage.getItem(CHAVE)
    return VALIDOS.includes(bruto as PreferenciaMovimento)
      ? (bruto as PreferenciaMovimento)
      : 'sistema'
  } catch {
    return 'sistema'
  }
}

let preferencia: PreferenciaMovimento = lerArmazenado()
const ouvintes = new Set<() => void>()

/** O sistema operacional está pedindo menos movimento? */
function sistemaPedeMenos(): boolean {
  return window.matchMedia(CONSULTA).matches
}

/** Decisão final: a escolha explícita vence o sistema. */
export function movimentoReduzido(): boolean {
  if (preferencia === 'ligado') return false
  if (preferencia === 'reduzido') return true
  return sistemaPedeMenos()
}

/**
 * Escreve o resultado no `<html>`.
 *
 * O mesmo cálculo roda num script embutido no `index.html`, antes da primeira
 * pintura — sem ele, a página apareceria animada por um instante antes de o
 * React montar e corrigir, que é justamente o susto que a preferência quer
 * evitar.
 */
function aplicarAtributo() {
  document.documentElement.dataset['motion'] = movimentoReduzido() ? 'reduzido' : 'ok'
}

function avisar() {
  aplicarAtributo()
  for (const ouvinte of ouvintes) ouvinte()
}

/** Troca a preferência e guarda no aparelho. */
export function definirPreferenciaMovimento(nova: PreferenciaMovimento) {
  preferencia = nova
  try {
    if (nova === 'sistema') window.localStorage.removeItem(CHAVE)
    else window.localStorage.setItem(CHAVE, nova)
  } catch {
    // Armazenamento bloqueado: vale só nesta sessão.
  }
  avisar()
}

function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar)

  // Mudança no sistema só importa quando a preferência é "seguir o sistema",
  // mas assinar sempre é mais simples e o custo é um ouvinte.
  const mql = window.matchMedia(CONSULTA)
  mql.addEventListener('change', avisar)

  return () => {
    ouvintes.delete(aoMudar)
    mql.removeEventListener('change', avisar)
  }
}

/** Verdadeiro quando o movimento deve ser contido. */
export function useMovimentoReduzido(): boolean {
  return useSyncExternalStore(assinar, movimentoReduzido, () => false)
}

/** A escolha bruta, para desenhar o controle. */
export function usePreferenciaMovimento(): PreferenciaMovimento {
  return useSyncExternalStore(assinar, () => preferencia, PADRAO)
}
