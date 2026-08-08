import type { CSSProperties } from 'react'
import css from './Esqueleto.module.css'

interface Props {
  largura?: string | number
  altura?: string | number
  raio?: string
  className?: string
  style?: CSSProperties
}

/**
 * Bloco cinza pulsante no lugar de um conteúdo que ainda está vindo.
 *
 * Sempre `aria-hidden`: quem usa leitor de tela recebe o aviso de carregamento
 * pela região `aria-live` do container, não por uma sequência de caixas vazias.
 */
export function Esqueleto({ largura = '100%', altura = '1rem', raio, className, style }: Props) {
  return (
    <span
      className={[css['esqueleto'], className].filter(Boolean).join(' ')}
      style={{ display: 'block', width: largura, height: altura, borderRadius: raio, ...style }}
      aria-hidden="true"
    />
  )
}
