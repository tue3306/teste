import css from './CabecalhoSecao.module.css'

interface Props {
  titulo: string
  subtitulo: string
}

/** Título e subtítulo de uma seção da plataforma. */
export function CabecalhoSecao({ titulo, subtitulo }: Props) {
  return (
    <div className={css['bloco']}>
      <div>
        <h1 className={css['titulo']}>{titulo}</h1>
        <p className={css['subtitulo']}>{subtitulo}</p>
      </div>
      <p className={css['atualizado']}>atualizado agora</p>
    </div>
  )
}
