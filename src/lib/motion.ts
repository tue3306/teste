import type { Transition, Variants } from 'motion/react'

/**
 * Vocabulário de movimento da BI&B.
 *
 * Ter as curvas e os tempos num só lugar é o que impede o site de virar uma
 * colcha de retalhos animada — dois componentes com molas diferentes parecem
 * dois produtos. Cada constante existe para um papel, não para um gosto.
 *
 * Movimento reduzido não é tratado aqui: o `<MotionConfig reducedMotion="user">`
 * em App.tsx desliga deslocamento e escala em toda a árvore de uma vez.
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
 * A entrada por scroll é comandada pelo hook `useNaTela`, e não pelo
 * `whileInView` do Motion.
 *
 * Motivo: `whileInView` deixa o elemento no estado inicial para sempre se o
 * `IntersectionObserver` não disparar — e como esse estado é `opacity: 0`, o
 * resultado é conteúdo invisível de forma permanente. `useNaTela` tem prazo de
 * segurança: passado ele, revela de qualquer jeito.
 */
