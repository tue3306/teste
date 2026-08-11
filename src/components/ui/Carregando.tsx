import css from './Carregando.module.css'

/**
 * Estado de espera enquanto um pedaço da aplicação chega pela rede.
 *
 * `role="status"` com `aria-live="polite"` faz o leitor de tela anunciar a
 * espera sem interromper o que estiver lendo.
 */
export function Carregando({ texto = 'Carregando a plataforma…' }: { texto?: string }) {
  return (
    <div className={css['caixa']} role="status" aria-live="polite">
      <div className={css['pontos']} aria-hidden="true">
        <span className={css['ponto']} />
        <span className={css['ponto']} />
        <span className={css['ponto']} />
      </div>
      <p className={css['texto']}>{texto}</p>
    </div>
  )
}
