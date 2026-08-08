import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import css from './Botao.module.css'

type Variante = 'primario' | 'secundario' | 'escuro' | 'teal' | 'texto'
type Tamanho = 'sm' | 'md' | 'lg'

interface Base {
  variante?: Variante
  tamanho?: Tamanho
  /** Ocupa toda a largura disponível. */
  bloco?: boolean
  /** Cantos suaves em vez de pílula. */
  quadrado?: boolean
  className?: string
  children: ReactNode
}

interface ComoBotao extends Base, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Base> {
  para?: undefined
  ref?: Ref<HTMLButtonElement>
}

interface ComoLink extends Base {
  /** Destino interno: renderiza um `<Link>` do router em vez de `<button>`. */
  para: string
  ref?: Ref<HTMLAnchorElement>
}

export type PropsBotao = ComoBotao | ComoLink

/**
 * Botão do design system.
 *
 * Com `para`, vira um link de navegação do router — o que importa para
 * acessibilidade: destinos precisam ser `<a>` (abrem em nova aba, aparecem na
 * lista de links do leitor de tela), ações precisam ser `<button>`. O protótipo
 * navegava com `onClick` em `<button>`, perdendo as duas coisas.
 */
export function Botao(props: PropsBotao) {
  const {
    variante = 'primario',
    tamanho = 'md',
    bloco = false,
    quadrado = false,
    className,
    children,
  } = props

  const classes = [
    css['botao'],
    css[variante],
    tamanho !== 'md' ? css[tamanho] : null,
    bloco ? css['bloco'] : null,
    quadrado ? css['quadrado'] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (props.para !== undefined) {
    const { para, ref } = props
    return (
      <Link to={para} className={classes} ref={ref}>
        {children}
      </Link>
    )
  }

  const {
    variante: _v,
    tamanho: _t,
    bloco: _b,
    quadrado: _q,
    className: _c,
    children: _ch,
    para: _p,
    ...resto
  } = props

  return (
    <button type="button" {...resto} className={classes}>
      {children}
    </button>
  )
}
