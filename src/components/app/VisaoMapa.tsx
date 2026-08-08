import { useId, useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Imagem } from '@/components/ui/Imagem'
import { useViagem } from '@/context/ViagemContext'
import { PINS_MAPA } from '@/data/roteiro'
import css from './VisaoMapa.module.css'

const COR_POR_TIPO: Record<string, string> = {
  hotel: 'var(--teal)',
  passeio: 'var(--coral)',
  restaurante: 'var(--ink)',
  noite: 'var(--ink)',
  praia: 'var(--ink)',
}

/**
 * Mapa da viagem.
 *
 * "Adicionar ao roteiro" agora adiciona: o ponto escolhido entra no dia
 * selecionado e passa a aparecer na aba Roteiro. No protótipo o botão não tinha
 * manipulador.
 */
export function VisaoMapa() {
  const { roteiro, adicionarParada } = useViagem()
  const [pinAtivo, setPinAtivo] = useState('p1')
  const [dia, setDia] = useState(1)
  const [confirmacao, setConfirmacao] = useState('')
  const selectId = useId()

  const pin = PINS_MAPA.find((p) => p.id === pinAtivo) ?? PINS_MAPA[0]
  if (!pin) return null

  function adicionar() {
    if (!pin) return
    adicionarParada(dia, {
      hora: '—',
      titulo: pin.nome,
      local: pin.sub,
      tipo: pin.tipo,
      custo: pin.preco,
    })
    setConfirmacao(`${pin.nome} entrou no dia ${String(dia)} do seu roteiro.`)
  }

  return (
    <div className={css['grade']}>
      <div className={css['mapa']}>
        <div className={css['malha']} aria-hidden="true" />
        <div className={css['mar']} aria-hidden="true" />
        <span className={css['legenda']}>mapa · zona sul do rio de janeiro</span>

        {PINS_MAPA.map((p) => {
          const ativo = p.id === pinAtivo
          return (
            <button
              key={p.id}
              type="button"
              className={css['pin']}
              style={{ left: p.x, top: p.y }}
              aria-pressed={ativo}
              onClick={() => {
                setPinAtivo(p.id)
                setConfirmacao('')
              }}
            >
              <span
                className={css['marcador']}
                style={{
                  width: ativo ? 17 : 12,
                  height: ativo ? 17 : 12,
                  background: COR_POR_TIPO[p.tipo] ?? 'var(--ink)',
                  boxShadow: `0 0 0 ${ativo ? '9px' : '5px'} ${
                    ativo ? 'rgba(14,154,167,.22)' : 'rgba(20,49,47,.09)'
                  }, 0 6px 14px -6px rgba(20,49,47,.9)`,
                }}
                aria-hidden="true"
              />
              <span className={`${css['rotulo']} ${ativo ? css['rotuloAtivo'] : ''}`}>{p.nome}</span>
            </button>
          )
        })}
      </div>

      <div className={css['detalhe']}>
        <Imagem slug={pin.foto} className={css['foto']} sizes="(min-width: 1180px) 256px, 100vw" />

        <h2 className={css['nome']}>{pin.nome}</h2>
        <p className={css['sub']}>{pin.sub}</p>

        <div className={css['linhaPreco']}>
          <span className={css['info']}>{pin.detalhe}</span>
          <span className={css['preco']}>{pin.preco}</span>
        </div>

        <div className={css['escolherDia']}>
          <label className={css['rotuloDia']} htmlFor={selectId}>
            Adicionar ao dia
          </label>
          <select
            id={selectId}
            className={css['select']}
            value={dia}
            onChange={(e) => {
              setDia(Number(e.target.value))
              setConfirmacao('')
            }}
          >
            {roteiro.map((d) => (
              <option key={d.n} value={d.n}>
                Dia {d.n} · {d.diaLongo} · {d.titulo}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBlockStart: 14 }}>
          <Botao variante="teal" bloco quadrado onClick={adicionar}>
            Adicionar ao roteiro
          </Botao>
        </div>

        <p aria-live="polite">
          {confirmacao ? <span className={css['confirmacao']}>{confirmacao}</span> : null}
        </p>
      </div>
    </div>
  )
}
