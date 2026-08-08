import { useEffect, useRef, useState } from 'react'
import { useMovimentoReduzido } from './useMovimento'

const DURACAO = 1100

/**
 * Conta de zero até `alvo` quando o elemento entra na viewport.
 *
 * Devolve a ref do elemento e o valor corrente. O `requestAnimationFrame` é
 * cancelado no desmonte e o observer é desconectado assim que dispara — o
 * protótipo deixava ambos pendurados.
 */
export function useCountUp(alvo: number) {
  const semMovimento = useMovimentoReduzido()
  /** Fração já percorrida da contagem, de 0 a 1. */
  const [progresso, setProgresso] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Sem movimento não há o que animar: o valor final é derivado no retorno,
    // então o efeito simplesmente não faz nada — nada de `setState` aqui, que
    // dispararia um render em cascata.
    if (semMovimento) return

    const el = ref.current
    if (!el) return

    let raf = 0
    let inicio = 0

    const passo = (agora: number) => {
      inicio ||= agora
      const k = Math.min(1, (agora - inicio) / DURACAO)
      setProgresso(1 - Math.pow(1 - k, 3)) // ease-out cúbico
      if (k < 1) raf = requestAnimationFrame(passo)
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return
        observer.disconnect()
        raf = requestAnimationFrame(passo)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [semMovimento])

  return { ref, valor: semMovimento ? alvo : Math.round(alvo * progresso) }
}
