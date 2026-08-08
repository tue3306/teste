import { useEffect, useRef } from 'react'
import { usePonteiroFino } from './useMediaQuery'
import { useMovimentoReduzido } from './useMovimento'

/**
 * Inclina o cartão seguindo o ponteiro.
 *
 * Só liga em ponteiro fino com hover e com movimento permitido — em toque o
 * efeito nunca dispara e a escuta sequer é registrada. O elemento escreve numa
 * custom property em vez de sobrescrever `transform` direto, para não brigar
 * com a animação de flutuação que roda no mesmo nó.
 */
export function useTilt<T extends HTMLElement>(intensidade = 6) {
  const ref = useRef<T>(null)
  const ponteiroFino = usePonteiroFino()
  const semMovimento = useMovimentoReduzido()

  useEffect(() => {
    const el = ref.current
    if (!el || !ponteiroFino || semMovimento) return

    let raf = 0
    let pendente: { x: number; y: number } | null = null

    const aplicar = () => {
      raf = 0
      if (!pendente) return
      el.style.setProperty('--tilt-y', `${pendente.x.toFixed(2)}deg`)
      el.style.setProperty('--tilt-x', `${pendente.y.toFixed(2)}deg`)
      el.style.setProperty('--tilt-z', '6px')
      el.style.animationPlayState = 'paused'
    }

    const aoMover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pendente = {
        x: ((e.clientX - r.left) / r.width - 0.5) * intensidade,
        y: -((e.clientY - r.top) / r.height - 0.5) * intensidade,
      }
      raf ||= requestAnimationFrame(aplicar)
    }

    const aoSair = () => {
      pendente = null
      el.style.removeProperty('--tilt-x')
      el.style.removeProperty('--tilt-y')
      el.style.removeProperty('--tilt-z')
      el.style.animationPlayState = ''
    }

    el.addEventListener('pointermove', aoMover, { passive: true })
    el.addEventListener('pointerleave', aoSair)

    return () => {
      el.removeEventListener('pointermove', aoMover)
      el.removeEventListener('pointerleave', aoSair)
      cancelAnimationFrame(raf)
      aoSair()
    }
  }, [intensidade, ponteiroFino, semMovimento])

  return ref
}

/**
 * Puxa o botão levemente na direção do ponteiro ("magnético").
 *
 * Mesmas guardas do tilt. O deslocamento é sutil de propósito: forte demais e o
 * alvo foge do clique, que é um problema de usabilidade, não um charme.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const ponteiroFino = usePonteiroFino()
  const semMovimento = useMovimentoReduzido()

  useEffect(() => {
    const el = ref.current
    if (!el || !ponteiroFino || semMovimento) return

    let raf = 0
    let pendente: { x: number; y: number } | null = null

    const aplicar = () => {
      raf = 0
      if (!pendente) return
      el.style.setProperty('--mag-x', `${pendente.x.toFixed(1)}px`)
      el.style.setProperty('--mag-y', `${pendente.y.toFixed(1)}px`)
    }

    const aoMover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pendente = {
        x: (e.clientX - r.left - r.width / 2) * 0.1,
        y: (e.clientY - r.top - r.height / 2) * 0.18,
      }
      raf ||= requestAnimationFrame(aplicar)
    }

    const aoSair = () => {
      pendente = null
      el.style.removeProperty('--mag-x')
      el.style.removeProperty('--mag-y')
    }

    el.addEventListener('pointermove', aoMover, { passive: true })
    el.addEventListener('pointerleave', aoSair)

    return () => {
      el.removeEventListener('pointermove', aoMover)
      el.removeEventListener('pointerleave', aoSair)
      cancelAnimationFrame(raf)
      aoSair()
    }
  }, [ponteiroFino, semMovimento])

  return ref
}
