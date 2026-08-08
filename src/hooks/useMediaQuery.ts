import { useSyncExternalStore } from 'react'

/**
 * Assina uma media query.
 *
 * Usa `useSyncExternalStore` em vez de `useState` + `useEffect`: a primeira
 * renderização já lê o valor real, então não há um quadro com o valor errado
 * antes do efeito rodar.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (aoMudar: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', aoMudar)
    return () => {
      mql.removeEventListener('change', aoMudar)
    }
  }

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // servidor / pré-render: assume "não casa"
  )
}

/**
 * A decisão sobre movimento não mora aqui.
 *
 * Ela combina o pedido do sistema com uma escolha explícita do usuário, e vive
 * em `useMovimento.ts`. Consultar a media query direto ignoraria essa escolha.
 */

/** Verdadeiro em ponteiro fino com hover — mouse e trackpad, não toque. */
export function usePonteiroFino(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
