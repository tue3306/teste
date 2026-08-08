import css from './PularParaConteudo.module.css'

/** Atalho de teclado para saltar a navegação e ir direto ao conteúdo. */
export function PularParaConteudo() {
  return (
    <a href="#conteudo" className={css['pular']}>
      Pular para o conteúdo
    </a>
  )
}
