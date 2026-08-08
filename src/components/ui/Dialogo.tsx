import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Icone } from './Icone'
import css from './Dialogo.module.css'

interface Props {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  descricao?: string
  children: ReactNode
}

/**
 * Modal sobre o elemento `<dialog>` nativo.
 *
 * `showModal()` entrega de graça o que uma modal caseira erra quase sempre:
 * captura de foco, fechamento por Esc, o resto da página marcado como inerte e
 * a camada de topo acima de qualquer `z-index`. Nenhuma biblioteca envolvida.
 */
export function Dialogo({ aberto, aoFechar, titulo, descricao, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const tituloId = useId()
  const descricaoId = useId()

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return

    if (aberto && !dlg.open) dlg.showModal()
    else if (!aberto && dlg.open) dlg.close()
  }, [aberto])

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return

    // Esc e clique no backdrop disparam `cancel`/`close` nativos; o estado do
    // React precisa acompanhar, senão a modal não reabre.
    const aoCancelar = (e: Event) => {
      e.preventDefault()
      aoFechar()
    }
    const aoFecharNativo = () => {
      if (aberto) aoFechar()
    }

    // Clique no backdrop: o alvo é o próprio <dialog>, porque o backdrop não é
    // um nó separado na árvore. Registrado aqui, e não como `onClick` no JSX,
    // porque em JSX a regra `click-events-have-key-events` acusaria falta de
    // handler de teclado — que o <dialog> já resolve nativamente com Esc.
    const aoClicarFora = (e: MouseEvent) => {
      if (e.target === dlg) aoFechar()
    }

    dlg.addEventListener('cancel', aoCancelar)
    dlg.addEventListener('close', aoFecharNativo)
    dlg.addEventListener('click', aoClicarFora)
    return () => {
      dlg.removeEventListener('cancel', aoCancelar)
      dlg.removeEventListener('close', aoFecharNativo)
      dlg.removeEventListener('click', aoClicarFora)
    }
  }, [aberto, aoFechar])

  return (
    <dialog
      ref={ref}
      className={css['dialogo']}
      aria-labelledby={tituloId}
      aria-describedby={descricao ? descricaoId : undefined}
    >
      <div className={css['corpo']}>
        <div className={css['cabecalho']}>
          <div>
            <h2 id={tituloId} className={css['titulo']}>
              {titulo}
            </h2>
            {descricao ? (
              <p id={descricaoId} className={css['descricao']}>
                {descricao}
              </p>
            ) : null}
          </div>
          <button type="button" className={css['fechar']} onClick={aoFechar} aria-label="Fechar">
            <Icone nome="fechar" tamanho={15} />
          </button>
        </div>
        <div className={css['conteudo']}>{children}</div>
      </div>
    </dialog>
  )
}
