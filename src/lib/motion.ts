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
