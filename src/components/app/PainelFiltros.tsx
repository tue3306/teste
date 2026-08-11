import { useId } from 'react'
import { FACETAS_POR_VERTICAL } from '@/data/rj'
import { useViagem } from '@/context/ViagemContext'
import { moeda } from '@/lib/format'
import type { Ordenacao, Vertical } from '@/types'
import css from './PainelFiltros.module.css'

interface Props {
  vertical: Vertical
  /** Faixa de preço do que está listado, para o controle não ter curso morto. */
  faixa: { min: number; max: number }
  precoMax: number
  aoTrocarPreco: (valor: number) => void
  ordenacao: Ordenacao
  aoTrocarOrdenacao: (valor: Ordenacao) => void
  facetas: string[]
  aoAlternarFaceta: (id: string) => void
  /** Quantos itens sobraram depois de tudo aplicado. */
  encontrados: number
}

const ORDENACOES: { id: Ordenacao; label: string }[] = [
  { id: 'melhor', label: 'Melhor escolha' },
  { id: 'preco', label: 'Menor preço' },
  { id: 'nota', label: 'Melhor nota' },
]

export function PainelFiltros({
  vertical,
  faixa,
  precoMax,
  aoTrocarPreco,
  ordenacao,
  aoTrocarOrdenacao,
  facetas,
  aoAlternarFaceta,
  encontrados,
}: Props) {
  const { orcamento, busca } = useViagem()
  const idPreco = useId()
  const disponiveis = FACETAS_POR_VERTICAL[vertical]

  /** Quanto do orçamento declarado a viagem já consumiu. */
  const usado = busca.orcamento > 0 ? Math.min(100, (orcamento.total / busca.orcamento) * 100) : 0

  return (
    <aside className={css['painel']} aria-label="Filtros">
      <div className={css['topo']}>
        <span>Filtros</span>
        <span className={css['legenda']} aria-live="polite">
          {encontrados === 1 ? '1 opção' : `${String(encontrados)} opções`}
        </span>
      </div>

      <div className={css['grupo']}>
        <label htmlFor={idPreco} className={css['legenda']}>
          Preço até
        </label>
        <div className={css['linhaPreco']}>
          <span className={css['valor']}>{moeda(precoMax)}</span>
        </div>
        {/*
          Os limites vêm da faixa real do que está na tela. Os `min=200 max=2400`
          fixos do protótipo deixavam metade do curso morto na aba de voos e
          cortavam o resort mais caro fora do alcance.
        */}
        <input
          id={idPreco}
          className={css['slider']}
          type="range"
          min={faixa.min}
          max={faixa.max}
          step={10}
          value={precoMax}
          onChange={(e) => {
            aoTrocarPreco(Number(e.target.value))
          }}
        />
        <p className={css['legenda']}>
          {moeda(faixa.min)} a {moeda(faixa.max)}
        </p>
      </div>

      <div className={css['divisoria']} />

      <fieldset className={css['grupo']}>
        <legend className={css['legenda']}>Ordenar por</legend>
        <div className={css['opcoes']}>
          {ORDENACOES.map((o) => (
            <label key={o.id} className={css['opcao']}>
              <input
                type="radio"
                name="ordenacao"
                value={o.id}
                checked={ordenacao === o.id}
                onChange={() => {
                  aoTrocarOrdenacao(o.id)
                }}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={css['divisoria']} />

      <fieldset className={css['grupo']}>
        <legend className={css['legenda']}>Características</legend>
        <div className={css['facetas']}>
          {/*
            Cada vertical declara as suas. Filtrar voo por "piscina" nunca fez
            sentido, e no protótipo isso zerava a lista de voos sem explicação.
          */}
          {disponiveis.map((f) => {
            const ativa = facetas.includes(f.id)
            return (
              <button
                key={f.id}
                type="button"
                className={`${css['faceta']} ${ativa ? css['ativo'] : ''}`}
                aria-pressed={ativa}
                onClick={() => {
                  aoAlternarFaceta(f.id)
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {busca.orcamento > 0 ? (
        <>
          <div className={css['divisoria']} />
          <div className={css['orcamento']}>
            <p className={css['legenda']}>Seu orçamento</p>
            <p className={css['orcamentoValor']}>{moeda(busca.orcamento)}</p>
            <div
              className={css['trilho']}
              role="progressbar"
              aria-valuenow={Math.round(usado)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Orçamento já comprometido"
            >
              <div className={css['preenchimento']} style={{ width: `${String(usado)}%` }} />
            </div>
            <p className={css['orcamentoNota']}>
              {orcamento.estourou
                ? `${moeda(orcamento.total - busca.orcamento)} acima do previsto`
                : `${moeda(orcamento.total)} comprometidos · sobram ${moeda(orcamento.sobra)}`}
            </p>
          </div>
        </>
      ) : null}
    </aside>
  )
}
