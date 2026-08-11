import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface Props {
  children: ReactNode
  /** Atraso da entrada, em segundos. */
  atraso?: number
  /** Elemento a renderizar. Padrão `div`. */
  como?: ElementType
  className?: string
  style?: CSSProperties
  id?: string
}

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * O estado inicial (`opacity: 0`) mora no CSS, mas o hook garante que ele nunca
 * prenda conteúdo: se o elemento já está visível na carga, a revelação acontece
 * de imediato, e há uma rede de 1,2 s caso o observer nunca dispare.
 *
 * A revelação acontece mesmo com `prefers-reduced-motion` — antes o elemento
 * nascia revelado nesse caso e a página inteira aparecia de uma vez. Quem
 * contém a amplitude é o CSS: sob movimento reduzido o fade fica e os 24px de
 * deslocamento saem.
 */
export function Reveal({ children, atraso = 0, como: Como = 'div', className, style, id }: Props) {
  const ref = useReveal<HTMLElement>()

  return (
    <Como
      ref={ref}
      id={id}
      className={['reveal', className].filter(Boolean).join(' ')}
      style={{ ...style, ...(atraso ? ({ '--reveal-delay': `${String(atraso)}s` } as CSSProperties) : null) }}
    >
      {children}
    </Como>
  )
}
