import { useCallback, useEffect, useState } from 'react'
import { podeGuardar } from './useConsentimento'

/**
 * Estado espelhado em `localStorage`.
 *
 * Toda escrita é protegida: em janela anônima do Safari e com cookies de
 * terceiros bloqueados, `localStorage.setItem` lança — e uma exceção aqui
 * derrubaria a árvore inteira. Falhar em silêncio degrada para estado em
 * memória, que é o comportamento correto: o usuário perde a persistência, não a
 * aplicação.
 *
 * O evento `storage` mantém abas irmãs em sincronia.
 */
export function useLocalStorage<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => ler(chave, inicial))

  const definir = useCallback(
    (proximo: T | ((atual: T) => T)) => {
      setValor((atual) => {
        const resolvido = typeof proximo === 'function' ? (proximo as (a: T) => T)(atual) : proximo
        try {
          // Quem recusou o armazenamento continua usando o site normalmente —
          // o estado só deixa de sobreviver ao fechar a aba.
          if (podeGuardar()) window.localStorage.setItem(chave, JSON.stringify(resolvido))
        } catch {
          // Armazenamento indisponível ou cheio: segue só em memória.
        }
        return resolvido
      })
    },
    [chave],
  )

  useEffect(() => {
    const aoMudar = (e: StorageEvent) => {
      if (e.key !== chave) return
      setValor(ler(chave, inicial))
    }
    window.addEventListener('storage', aoMudar)
    return () => {
      window.removeEventListener('storage', aoMudar)
    }
    // `inicial` é o valor de contingência; mudá-lo não deve reassinar o evento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])

  return [valor, definir] as const
}

function ler<T>(chave: string, inicial: T): T {
  try {
    const bruto = window.localStorage.getItem(chave)
    return bruto === null ? inicial : (JSON.parse(bruto) as T)
  } catch {
    return inicial
  }
}
