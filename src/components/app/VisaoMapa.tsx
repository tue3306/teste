import { useId, useMemo, useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Imagem } from '@/components/ui/Imagem'
import { Mapa, type PontoMapa } from '@/components/ui/Mapa'
import { useViagem } from '@/context/ViagemContext'
import { PINS_MAPA } from '@/data/roteiro'
import css from './VisaoMapa.module.css'

const COR_POR_TIPO: Record<string, string> = {
  hotel: 'var(--teal-strong)',
  passeio: 'var(--coral-strong)',
  restaurante: 'var(--ink)',
  noite: 'var(--ink)',
  praia: 'var(--teal)',
}

/**
 * Mapa da viagem.
 *
 * O mapa é real — Leaflet sobre OpenStreetMap, com as coordenadas dos pontos.
 * A versão anterior era uma grade em CSS com bolinhas em posição percentual,
 * que não correspondia à cidade nem servia para se localizar.
 *
 * A lista ao lado não é decoração: é a forma acessível de percorrer os pontos.
 * Um mapa arrastável sozinho deixa de fora quem navega por teclado.
 */
export function VisaoMapa() {
  const { roteiro, adicionarParada } = useViagem()
  const [pinAtivo, setPinAtivo] = useState('p1')
  const [dia, setDia] = useState(1)
  const [confirmacao, setConfirmacao] = useState('')
  const selectId = useId()

  const pontos = useMemo<PontoMapa[]>(
    () =>
      PINS_MAPA.map((p) => ({
        id: p.id,
        nome: p.nome,
        latitude: p.latitude,
        longitude: p.longitude,
        cor: COR_POR_TIPO[p.tipo] ?? 'var(--ink)',
      })),
    [],
  )

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
      <div className={css['coluna']}>
        <div className={css['moldura']}>
          <Mapa
            pontos={pontos}
            ativo={pinAtivo}
            aoEscolher={(id) => {
              setPinAtivo(id)
              setConfirmacao('')
            }}
            rotulo="Mapa dos pontos da viagem no Rio de Janeiro"
          />
        </div>

        {/* Percorrer os pontos sem depender de arrastar o mapa. */}
        <ul className={css['atalhos']} aria-label="Pontos da viagem">
          {PINS_MAPA.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`${css['atalho']} ${p.id === pinAtivo ? css['atalhoAtivo'] : ''}`}
                aria-pressed={p.id === pinAtivo}
                onClick={() => {
                  setPinAtivo(p.id)
                  setConfirmacao('')
                }}
              >
                <span
                  className={css['bolinha']}
                  style={{ background: COR_POR_TIPO[p.tipo] ?? 'var(--ink)' }}
                  aria-hidden="true"
                />
                {p.nome}
              </button>
            </li>
          ))}
        </ul>
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
