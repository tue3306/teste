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
 * prenda conteúdo: se o elemento já está visível na carga, ou se o usuário
 * pediu menos movimento, a revelação acontece de imediato. O protótipo
 * dependia de um `setTimeout` de segurança de 1,8 s para o mesmo fim.
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
