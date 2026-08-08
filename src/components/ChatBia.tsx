import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Botao } from '@/components/ui/Botao'
import { useViagem } from '@/context/ViagemContext'
import { SUGESTOES_BIA } from '@/data/site'
import css from './ChatBia.module.css'

interface Props {
  /** Texto do `placeholder` do campo. */
  convite?: string
  /** Altura máxima da área de mensagens. Sem valor, cresce livremente. */
  alturaMaxima?: number
}

/**
 * Conversa com a Bia.
 *
 * Um único componente serve a seção do site e a aba da plataforma; no protótipo
 * a mesma marcação estava duplicada nos dois lugares, e o histórico não
 * acompanhava o usuário de um para o outro.
 *
 * Duas correções de comportamento: a lista rola sozinha até a mensagem nova
 * (antes ela crescia para fora da vista) e o envio é um `<form>`, então Enter
 * funciona sem um `onKeyDown` avulso escutando a tecla.
 */
export function ChatBia({ convite = 'Escreva para a Bia…', alturaMaxima }: Props) {
  const { chat, enviarMensagem, biaDigitando } = useViagem()
  const [texto, setTexto] = useState('')
  const listaRef = useRef<HTMLDivElement>(null)
  const jaMontou = useRef(false)
  const campoId = useId()

  /**
   * Desce até a mensagem mais recente.
   *
   * Move `scrollTop` do próprio container, e não `scrollIntoView` no último
   * elemento: `scrollIntoView` rola **todos** os ancestrais roláveis, inclusive
   * o documento. Como esta conversa também vive no meio da landing, a versão
   * anterior abria a home já rolada até a seção da Bia.
   *
   * A primeira execução é pulada de propósito: ao montar, o histórico inicial
   * deve aparecer do começo, não do fim.
   */
  useEffect(() => {
    if (!jaMontou.current) {
      jaMontou.current = true
      return
    }
    const el = listaRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat.length, biaDigitando])

  function aoEnviar(e: FormEvent) {
    e.preventDefault()
    if (!texto.trim()) return
    enviarMensagem(texto)
    setTexto('')
  }

  return (
    <div className={css['painel']}>
      {/* `aria-live="polite"` anuncia a resposta da Bia sem cortar a leitura em
          andamento; `role="log"` diz que é um histórico que cresce no fim. */}
      <div
        ref={listaRef}
        className={css['mensagens']}
        style={alturaMaxima ? { maxHeight: alturaMaxima } : undefined}
        role="log"
        aria-live="polite"
        aria-label="Conversa com a Bia"
      >
        {chat.map((m) => (
          <div
            key={m.id}
            className={`${css['linha']} ${m.autor === 'user' ? css['linhaUsuario'] : css['linhaBot']}`}
          >
            <p className={`${css['balao']} ${m.autor === 'user' ? css['baloUsuario'] : ''}`}>
              <span className="sr-only">{m.autor === 'user' ? 'Você: ' : 'Bia: '}</span>
              {m.texto}
            </p>
          </div>
        ))}

        {biaDigitando ? (
          <div className={`${css['linha']} ${css['linhaBot']}`}>
            <p className={`${css['balao']} ${css['digitando']}`}>
              <span className="sr-only">Bia está escrevendo</span>
              <span className={css['ponto']} aria-hidden="true" />
              <span className={css['ponto']} aria-hidden="true" />
              <span className={css['ponto']} aria-hidden="true" />
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <form className={css['entrada']} onSubmit={aoEnviar}>
          <label className="sr-only" htmlFor={campoId}>
            Sua pergunta para a Bia
          </label>
          <input
            id={campoId}
            className={css['campo']}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
            }}
            placeholder={convite}
            autoComplete="off"
          />
          <Botao type="submit" variante="teal" quadrado disabled={!texto.trim()}>
            Enviar
          </Botao>
        </form>

        <div className={css['sugestoes']}>
          {SUGESTOES_BIA.map((s) => (
            <button
              key={s}
              type="button"
              className={css['sugestao']}
              disabled={biaDigitando}
              onClick={() => {
                enviarMensagem(s)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
