import { useId } from 'react'
import { FACETAS_POR_VERTICAL } from '@/data/ofertas'
import { ORCAMENTO } from '@/data/site'
import { moeda } from '@/lib/format'
import type { Ordenacao, Vertical } from '@/types'
import css from './PainelFiltros.module.css'

const ORDENS: { id: Ordenacao; label: string }[] = [
  { id: 'melhor', label: 'Melhor custo-benefício' },
  { id: 'preco', label: 'Menor preço' },
  { id: 'nota', label: 'Melhor avaliado' },
]

interface Props {
  vertical: Vertical
  precoMaximo: number
  faixa: { min: number; max: number }
  aoMudarPreco: (valor: number) => void
  ordenacao: Ordenacao
  aoMudarOrdenacao: (valor: Ordenacao) => void
  facetasAtivas: string[]
  aoAlternarFaceta: (id: string) => void
  aoLimpar: () => void
}

/**
 * Filtros da lista.
 *
 * As comodidades vêm de `FACETAS_POR_VERTICAL`, então cada aba mostra só o que
 * se aplica a ela. No protótipo as quatro opções de hotel apareciam também em
 * Voos, e como o filtro exigia que a oferta satisfizesse todas as marcadas,
 * marcar qualquer uma zerava a lista de voos sem explicação.
 *
 * Ordenação e facetas usam `aria-pressed`: são botões de alternância, e sem
 * isso o leitor de tela anuncia "Piscina, botão" sem dizer se está ligado.
 */
export function PainelFiltros({
  vertical,
  precoMaximo,
  faixa,
  aoMudarPreco,
  ordenacao,
  aoMudarOrdenacao,
  facetasAtivas,
  aoAlternarFaceta,
  aoLimpar,
}: Props) {
  const sliderId = useId()
  const facetas = FACETAS_POR_VERTICAL[vertical]
  const pct = Math.round((ORCAMENTO.gasto / ORCAMENTO.total) * 100)

  return (
    <aside className={css['painel']} aria-label="Filtros de resultado">
      <div className={css['topo']}>
        <h2 className="rotulo">filtros</h2>
        <button
          type="button"
          onClick={aoLimpar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--coral-text)',
            fontSize: '12.5px',
            fontWeight: 700,
            padding: 0,
          }}
        >
          limpar
        </button>
      </div>

      <div className={css['grupo']}>
        <label className={css['linhaPreco']} htmlFor={sliderId}>
          <span>Preço máximo</span>
          <span className={css['valor']}>{moeda(precoMaximo)}</span>
        </label>
        <input
          id={sliderId}
          className={css['slider']}
          type="range"
          min={faixa.min}
          max={faixa.max}
          step={10}
          value={precoMaximo}
          onChange={(e) => {
            aoMudarPreco(Number(e.target.value))
          }}
          aria-valuetext={moeda(precoMaximo)}
        />
      </div>

      <hr className={css['divisoria']} />

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className={css['legenda']}>Ordenar por</legend>
        <div className={css['opcoes']}>
          {ORDENS.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`${css['opcao']} ${ordenacao === o.id ? css['ativo'] : ''}`}
              aria-pressed={ordenacao === o.id}
              onClick={() => {
                aoMudarOrdenacao(o.id)
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <hr className={css['divisoria']} />

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className={css['legenda']}>Comodidades</legend>
        <div className={css['facetas']}>
          {facetas.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${css['faceta']} ${facetasAtivas.includes(f.id) ? css['ativo'] : ''}`}
              aria-pressed={facetasAtivas.includes(f.id)}
              onClick={() => {
                aoAlternarFaceta(f.id)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </fieldset>

      <hr className={css['divisoria']} />

      <div className={css['orcamento']}>
        <h3 className="rotulo">orçamento</h3>
        <p className={css['orcamentoValor']}>{moeda(ORCAMENTO.gasto)}</p>
        <div
          className={css['trilho']}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${String(pct)}% do orçamento comprometido`}
        >
          <div className={css['preenchimento']} style={{ width: `${String(pct)}%` }} />
        </div>
        <p className={css['orcamentoNota']}>
          de {moeda(ORCAMENTO.total)} · sobra {moeda(ORCAMENTO.total - ORCAMENTO.gasto)}
        </p>
      </div>
    </aside>
  )
}
