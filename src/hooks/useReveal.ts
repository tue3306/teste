import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useMediaQuery'

/**
 * Revela um elemento quando ele entra na viewport.
 *
 * Um único `IntersectionObserver` atende a página inteira: o protótipo criava
 * um observer novo por contador e nunca desconectava os que jamais cruzavam a
 * tela. Aqui o observer é criado sob demanda, cada elemento sai dele assim que
 * aparece, e ele se desfaz sozinho quando o último assinante desmonta.
 */

type Callback = (alvo: Element) => void

let observer: IntersectionObserver | null = null
const inscritos = new Map<Element, Callback>()

function obterObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        const cb = inscritos.get(entrada.target)
        if (cb) {
          cb(entrada.target)
          desinscrever(entrada.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  )
  return observer
}

function inscrever(el: Element, cb: Callback) {
  inscritos.set(el, cb)
  obterObserver().observe(el)
}

function desinscrever(el: Element) {
  if (!inscritos.delete(el)) return
  observer?.unobserve(el)
  if (inscritos.size === 0) {
    observer?.disconnect()
    observer = null
  }
}

/**
 * Devolve uma ref para o elemento a ser revelado.
 *
 * Com `prefers-reduced-motion` o elemento nasce revelado — o CSS já neutraliza
 * a transição, e marcar aqui garante que nada dependa do observer para
 * aparecer.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const semMovimento = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (semMovimento) {
      el.dataset['revealed'] = 'true'
      return
    }

    // Já visível na carga (acima da dobra): revela sem esperar o observer.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.96 && r.bottom > 0) {
      el.dataset['revealed'] = 'true'
      return
    }

    inscrever(el, (alvo) => {
      ;(alvo as HTMLElement).dataset['revealed'] = 'true'
    })

    /**
     * Rede de segurança: se o observer não avisar em 1,2s, revela assim mesmo.
     *
     * O observer pode simplesmente não disparar — aba em segundo plano,
     * navegador que não está compondo quadros, extensão que interfere. Sem esta
     * rede, o texto ficaria em `opacity: 0` para sempre. A animação é enfeite;
     * o conteúdo não pode depender dela.
     */
    const rede = setTimeout(() => {
      el.dataset['revealed'] = 'true'
      desinscrever(el)
    }, 1200)

    return () => {
      clearTimeout(rede)
      desinscrever(el)
    }
  }, [semMovimento])

  return ref
}
