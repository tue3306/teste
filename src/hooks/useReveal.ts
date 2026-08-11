import { useEffect, useRef } from 'react'

/**
 * Revela um elemento quando ele entra na viewport.
 *
 * Um único `IntersectionObserver` atende a página inteira: o protótipo criava
 * um observer novo por contador e nunca desconectava os que jamais cruzavam a
 * tela. Aqui o observer é criado sob demanda, cada elemento sai dele assim que
 * aparece, e ele se desfaz sozinho quando o último assinante desmonta.
 */

type Callback = (alvo: Element) => void

/**
 * Marca o elemento como revelado.
 *
 * Numa aba em segundo plano o navegador não entrega quadro nenhum, e uma
 * transição de opacidade simplesmente não avança — o elemento ficaria em
 * `opacity: 0` mesmo com o alvo declarado corretamente. Nesse caso a transição
 * é dispensada e o conteúdo aparece de imediato: a animação de entrada seria
 * perdida de qualquer forma, já que ninguém está olhando.
 */
function revelar(el: HTMLElement) {
  if (document.hidden) el.style.transition = 'none'
  el.dataset['revealed'] = 'true'
}

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
 * A revelação por scroll acontece **sempre**, inclusive com
 * `prefers-reduced-motion`. Antes o elemento nascia revelado nesse caso, e a
 * página inteira aparecia de uma vez, sem vida nenhuma — o que a preferência
 * pede não é "nada acontece", é "nada se desloca muito". Quem cuida disso é o
 * CSS: sob movimento reduzido a classe `.reveal` mantém o fade e descarta os
 * 24px de `translateY`.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Já visível na carga (acima da dobra): revela sem esperar o observer.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.96 && r.bottom > 0) {
      revelar(el)
      return
    }

    inscrever(el, (alvo) => {
      revelar(alvo as HTMLElement)
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
      revelar(el)
      desinscrever(el)
    }, 1200)

    return () => {
      clearTimeout(rede)
      desinscrever(el)
    }
  }, [])

  return ref
}
