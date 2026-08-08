import { Link } from 'react-router-dom'
import css from './Logo.module.css'

interface Props {
  /** Destino do logotipo. Padrão: a home. */
  para?: string
  compacto?: boolean
}

/**
 * Logotipo BI&B.
 *
 * O "&" é um `<span>` decorativo em serifada itálica; o nome acessível vem do
 * `aria-label` do link, para o leitor de tela anunciar "BI e B" em vez de soletrar
 * a marcação.
 */
export function Logo({ para = '/', compacto = false }: Props) {
  return (
    <Link
      to={para}
      className={[css['logo'], compacto ? css['sm'] : null].filter(Boolean).join(' ')}
      aria-label="BI&B — início"
    >
      <span aria-hidden="true">BI</span>
      <span className={css['e']} aria-hidden="true">
        &amp;
      </span>
      <span aria-hidden="true">B</span>
    </Link>
  )
}
