import { useEffect, useState } from 'react'

export type EstadoRecurso<T> =
  | { status: 'ocioso'; dados: null; erro: null }
  | { status: 'carregando'; dados: T | null; erro: null }
  | { status: 'pronto'; dados: T; erro: null }
  | { status: 'erro'; dados: T | null; erro: string }

interface Opcoes {
  /** Adia a busca até virar `true` — para campos que só consultam ao digitar. */
  ativo?: boolean
  /** Espera este tanto de milissegundos sem mudança antes de disparar. */
  debounce?: number
}

/** O que a última busca concluída devolveu, e de qual busca ela veio. */
interface Registro<T> {
  origem: unknown
  dados: T | null
  erro: string | null
}

const OCIOSO = { status: 'ocioso', dados: null, erro: null } as const

/**
 * Busca assíncrona com estado, cancelamento e antirracing.
 *
 * `buscar` **precisa ser estável** — envolva em `useCallback`. A identidade da
 * função é a chave da busca: mudou a função, refaz; é a mesma, aproveita o que
 * já foi resolvido.
 *
 * Três garantias que a chamada solta dentro de um `useEffect` não dá:
 *
 * 1. A requisição é abortada quando o componente desmonta ou a busca muda —
 *    nada de `setState` em componente desmontado.
 * 2. Resposta atrasada de uma busca antiga é descartada. Sem isso, digitar
 *    rápido num autocomplete faz o resultado de "Rio" sobrescrever o de
 *    "Rio de Janeiro" só porque chegou depois.
 * 3. Os dados anteriores seguem visíveis enquanto os novos carregam, o que
 *    evita a lista piscar em branco a cada tecla.
 *
 * O estado "carregando" é **derivado**, não armazenado: se o último registro
 * não veio da busca atual, é porque ela ainda está em voo. Guardar essa
 * informação exigiria um `setState` no corpo do efeito — e isso força um
 * segundo render em cascata a cada busca.
 */
export function useRecurso<T>(
  buscar: (sinal: AbortSignal) => Promise<T>,
  { ativo = true, debounce = 0 }: Opcoes = {},
): EstadoRecurso<T> {
  const [registro, setRegistro] = useState<Registro<T> | null>(null)

  useEffect(() => {
    if (!ativo) return

    const controlador = new AbortController()
    let cancelado = false

    const disparar = () => {
      buscar(controlador.signal)
        .then((dados) => {
          if (cancelado) return
          setRegistro({ origem: buscar, dados, erro: null })
        })
        .catch((erro: unknown) => {
          // Aborto é fim de vida do efeito, não falha a exibir.
          if (cancelado || controlador.signal.aborted) return
          setRegistro({
            origem: buscar,
            dados: null,
            erro: erro instanceof Error ? erro.message : 'falha inesperada',
          })
        })
    }

    const timer = debounce > 0 ? setTimeout(disparar, debounce) : null
    if (timer === null) disparar()

    return () => {
      cancelado = true
      if (timer !== null) clearTimeout(timer)
      controlador.abort()
    }
  }, [buscar, ativo, debounce])

  if (!ativo) return OCIOSO

  const atual = registro?.origem === buscar ? registro : null
  if (!atual) return { status: 'carregando', dados: registro?.dados ?? null, erro: null }
  if (atual.erro !== null) return { status: 'erro', dados: atual.dados, erro: atual.erro }
  return { status: 'pronto', dados: atual.dados as T, erro: null }
}
