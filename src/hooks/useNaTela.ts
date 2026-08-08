import { useEffect, useRef, useState } from 'react'

/** Prazo máximo esperando o observer antes de revelar assim mesmo. */
const PRAZO_SEGURANCA = 1200

interface Opcoes {
  /** Fração do elemento que precisa aparecer para contar como visível. */
  fracao?: number
}

/**
 * Diz quando um elemento entrou na tela — com garantia de que ele aparece.
 *
 * Existe porque `whileInView` do Motion tem uma falha de projeto para conteúdo:
 * se o `IntersectionObserver` não disparar, o elemento fica no estado inicial
 * para sempre. Como esse estado costuma ser `opacity: 0`, o resultado é texto
 * permanentemente invisível — e o observer pode não disparar por motivos fora
 * do nosso controle (aba em segundo plano, navegador sem compor quadros,
 * extensão que interfere).
 *
 * Aqui a animação é enfeite, nunca portão. Três caminhos levam ao visível:
 *
 * 1. O elemento já está na viewport quando monta.
 * 2. O observer avisa que entrou.
 * 3. Passou o prazo de segurança e nada aconteceu — revela mesmo assim.
 *
 * Devolve `[ref, visivel]`. Ligue `visivel` ao `animate` do Motion em vez de
 * usar `whileInView`.
 */
export function useNaTela<T extends HTMLElement>(
  { fracao = 0.2 }: Opcoes = {},
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Já visível na carga: nem observa.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) {
      setVisivel(true)
      return
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return
        setVisivel(true)
        observer.disconnect()
      },
      { threshold: fracao },
    )
    observer.observe(el)

    const rede = setTimeout(() => {
      setVisivel(true)
      observer.disconnect()
    }, PRAZO_SEGURANCA)

    return () => {
      observer.disconnect()
      clearTimeout(rede)
    }
  }, [fracao])

  return [ref, visivel]
}
