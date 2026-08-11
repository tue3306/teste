import { useCallback, useEffect, useState } from 'react'
import { ler, gravar, type Chave } from '@/lib/armazenamento'

/**
 * Estado espelhado no armazenamento local.
 *
 * Substitui o antigo `useLocalStorage`, que recebia a chave como string livre e
 * falava com `window.localStorage` por conta própria. Duas convenções conviviam
 * no projeto — `bib:viagem:v2` de um lado, `bib:v2:destino` do outro — e nenhuma
 * das duas sabia da outra na hora de apagar tudo.
 *
 * Agora a chave vem do catálogo tipado em `lib/armazenamento.ts`, e prefixo,
 * versão, consentimento e tolerância a falha ficam num lugar só. Escrever uma
 * chave que não existe passou a ser erro de compilação.
 *
 * O evento `storage` mantém abas irmãs em sincronia: favoritar num separador e
 * ver o coração acender no outro.
 */
export function useArmazenado<T>(chave: Chave, inicial: T) {
  const [valor, setValor] = useState<T>(() => ler(chave, inicial))

  const definir = useCallback(
    (proximo: T | ((atual: T) => T)) => {
      setValor((atual) => {
        const resolvido = typeof proximo === 'function' ? (proximo as (a: T) => T)(atual) : proximo
        // Quem recusou o armazenamento continua usando o site normalmente — o
        // estado só deixa de sobreviver ao fechar a aba.
        gravar(chave, resolvido)
        return resolvido
      })
    },
    [chave],
  )

  useEffect(() => {
    const aoMudar = (e: StorageEvent) => {
      // A chave do evento é a completa, com prefixo e versão; comparar pelo
      // sufixo é suficiente e evita reexportar a função que monta o nome.
      if (!e.key?.endsWith(`:${chave}`)) return
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
