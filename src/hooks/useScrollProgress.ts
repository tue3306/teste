import { useEffect, useState } from 'react'

/**
 * Progresso de leitura da página, de 0 a 1.
 *
 * O ouvinte é passivo e o trabalho acontece uma vez por quadro: o protótipo
 * respondia a cada evento de scroll e, no mesmo callback, media
 * `getBoundingClientRect()` de todo elemento com parallax — leitura de layout
 * síncrona dentro do scroll, que é a receita clássica de travamento.
 */
export function useScrollProgress(): number {
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    let raf = 0
    let agendado = false

    const medir = () => {
      agendado = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgresso(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }

    const aoRolar = () => {
      if (agendado) return
      agendado = true
      raf = requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar, { passive: true })

    return () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      cancelAnimationFrame(raf)
    }
  }, [])

  return progresso
}
