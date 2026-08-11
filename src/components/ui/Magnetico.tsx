import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useMovimentoReduzido } from '@/hooks/useMovimento'

interface Props {
  children: ReactNode
  /** Quanto o elemento persegue o ponteiro, em pixels no extremo. */
  forca?: number
  className?: string
}

/**
 * Elemento que se inclina na direção do ponteiro e volta ao largar.
 *
 * O deslocamento é pequeno de propósito — 6px no extremo. O efeito não é
 * "seguir o mouse", é dar peso ao alvo: o botão parece reagir antes do clique,
 * e é isso que separa uma interface que responde de uma que só espera.
 *
 * `useSpring` sobre os valores crus é o que evita o elemento grudar no
 * ponteiro. Sem a mola, o movimento é literal e mecânico; com ela, há inércia,
 * e a volta ao centro tem o mesmo tempo da ida.
 *
 * Com `prefers-reduced-motion` o efeito sai por inteiro: é movimento contínuo,
 * atrelado ao ponteiro e sem começo nem fim declarados — exatamente a categoria
 * que a preferência existe para conter. O hover normal do CSS continua lá.
 */
export function Magnetico({ children, forca = 6, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const semMovimento = useMovimentoReduzido()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mola = { stiffness: 220, damping: 18, mass: 0.4 }
  const sx = useSpring(x, mola)
  const sy = useSpring(y, mola)

  // −0,5 a 0,5 dentro do elemento vira −forca a +forca de deslocamento.
  const tx = useTransform(sx, [-0.5, 0.5], [-forca, forca])
  const ty = useTransform(sy, [-0.5, 0.5], [-forca, forca])

  if (semMovimento) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: tx, y: ty }}
      onPointerMove={(e) => {
        // Só ponteiro fino: no toque não existe hover, e o evento chegaria
        // junto com o tap, movendo o alvo debaixo do dedo.
        if (e.pointerType !== 'mouse') return
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
