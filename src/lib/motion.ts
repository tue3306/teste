import type { Transition, Variants } from 'motion/react'

/**
 * Vocabulário de movimento da BI&B.
 *
 * Ter as curvas e os tempos num só lugar é o que impede o site de virar uma
 * colcha de retalhos animada — dois componentes com molas diferentes parecem
 * dois produtos. Cada constante existe para um papel, não para um gosto.
 *
 * ## Movimento reduzido
 *
 * O `MotionConfig` **não** desliga nada — `reducedMotion="always"` matava a
 * árvore inteira, e o comentário anterior deste arquivo dizia que isso era o
 * desejado. Não era: o site chegava estático para quem tem animação desligada
 * no sistema, que é a maioria de quem mexeu naquele interruptor pensando em
 * desempenho.
 *
 * A contenção agora é por **amplitude** e fica com quem anima. O que sai é
 * movimento amplo, contínuo ou preso ao scroll — parallax, tilt, magnético. O
 * que fica, com deslocamento menor, é entrada, hover e transição de layout.
 */

/** Mola padrão de interface: assenta rápido, sem oscilar. */
export const MOLA: Transition = { type: 'spring', stiffness: 420, damping: 38 }

/** Mola mais macia, para elementos grandes que percorrem mais distância. */
export const MOLA_SUAVE: Transition = { type: 'spring', stiffness: 260, damping: 32 }

/** Curva de saída para opacidade e cor, onde mola não faz sentido. */
export const SUAVE: Transition = { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }

/**
 * Container que escalona a entrada dos filhos.
 *
 * `delayChildren` dá um respiro antes do primeiro item; `staggerChildren` é
 * curto de propósito — acima de ~80ms a lista parece lenta em vez de elegante.
 */
export const CONTAINER: Variants = {
  oculto: {},
  visivel: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
}

/** Item que sobe ao entrar. Combina com `CONTAINER`. */
export const ITEM: Variants = {
  oculto: { opacity: 0, y: 22 },
  visivel: { opacity: 1, y: 0, transition: MOLA_SUAVE },
}

/** Item que entra crescendo — para selos e cartões pequenos. */
export const ITEM_ESCALA: Variants = {
  oculto: { opacity: 0, y: 16, scale: 0.96 },
  visivel: { opacity: 1, y: 0, scale: 1, transition: MOLA_SUAVE },
}

/**
 * Regra do projeto: **Motion nunca anima `opacity` de conteúdo.**
 *
 * O Motion escreve estilo inline a cada quadro de `requestAnimationFrame`, e
 * aba em segundo plano não recebe quadro nenhum. Um elemento com
 * `initial={{ opacity: 0 }}` ficaria invisível até o usuário focar a aba — e um
 * `whileInView` que nunca dispara o deixa invisível para sempre.
 *
 * Por isso a divisão: a **visibilidade** é do CSS (classe `.reveal`, com alvo
 * declarativo e rede de segurança de 1,2s) e o **movimento** é do Motion, só em
 * `transform`. Se um quadro faltar, o pior caso é um elemento alguns pixels
 * fora do lugar — nunca um elemento que sumiu.
 */

/** Deslize de entrada, sem tocar em opacidade. */
export const DESLIZE: Variants = {
  oculto: { y: 26 },
  visivel: { y: 0, transition: MOLA_SUAVE },
}

/** Deslize lateral, para colunas que entram de lado. */
export const DESLIZE_LATERAL: Variants = {
  oculto: { x: 22 },
  visivel: { x: 0, transition: MOLA_SUAVE },
}

/** Cartão que assenta crescendo — escala é transform, então é seguro. */
export const ASSENTA: Variants = {
  oculto: { y: 20, scale: 0.97 },
  visivel: { y: 0, scale: 1, transition: MOLA_SUAVE },
}

/** Elevação padrão no hover, usada nos cartões clicáveis. */
export const HOVER_CARTAO = { y: -6, transition: MOLA } as const

/** Resposta ao toque. */
export const TAP_CARTAO = { scale: 0.985, transition: MOLA } as const

/**
 * Entrada escalonada de uma grade, disparada quando ela cruza a viewport.
 *
 * `whileInView` com `once` faz a lista se montar diante do usuário em vez de
 * já estar montada quando ele chega. É o efeito que mais contribui para a
 * sensação de que a página está viva, e o mais barato: nenhum ouvinte de
 * scroll, nenhum estado em React — o Motion usa `IntersectionObserver` por
 * baixo.
 *
 * `amount: 0.15` dispara quando 15% da grade apareceu. Esperar a grade inteira
 * significaria, numa lista alta, nunca disparar.
 */
export const GRADE = {
  initial: 'oculto',
  whileInView: 'visivel',
  viewport: { once: true, amount: 0.15 },
  variants: CONTAINER,
} as const

/**
 * Item de grade que sobe e assenta. Combina com `GRADE`.
 *
 * Só `transform` e `opacity`: as duas propriedades que o navegador anima no
 * compositor, sem recalcular layout. Animar `height` ou `top` numa lista de
 * vinte cartões é como se perde 60fps.
 */
export const ITEM_GRADE: Variants = {
  oculto: { opacity: 0, y: 24, scale: 0.98 },
  visivel: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

/**
 * Amplitude do hover conforme a preferência do usuário.
 *
 * Seis pixels para quem não pediu nada, dois para quem pediu menos movimento.
 * Zero seria a resposta fácil e a errada: um cartão clicável que não reage ao
 * ponteiro não parece acessível, parece quebrado.
 */
export function hoverCartao(reduzido: boolean) {
  return { y: reduzido ? -2 : -6, transition: MOLA } as const
}

/** Selo ou pílula que pulsa uma vez ao aparecer — para "novo", "escolhido". */
export const SELO: Variants = {
  oculto: { scale: 0.6, opacity: 0 },
  visivel: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 520, damping: 24 },
  },
}
