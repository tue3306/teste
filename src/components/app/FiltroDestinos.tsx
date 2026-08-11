import { useId } from 'react'
import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { NOMES_REGIAO } from '@/data/rj'
import { CATEGORIAS } from '@/data/site'
import { ORDENS, alternar, contarFiltros, type Filtros, type OrdemDestino } from '@/lib/filtros'
import { SELO } from '@/lib/motion'
import type { RegiaoRJ } from '@/types'
import css from './FiltroDestinos.module.css'

const REGIOES = Object.keys(NOMES_REGIAO) as RegiaoRJ[]

interface Props {
  filtros: Filtros
  aoMudar: (f: Filtros) => void
  ordem: OrdemDestino
  aoOrdenar: (o: OrdemDestino) => void
  /** Quantos destinos passaram pelo filtro. */
  encontrados: number
}

/**
 * Barra de filtro e ordenação dos destinos.
 *
 * Multisseleção de verdade: cada pílula liga e desliga por conta própria, e o
 * grupo inteiro só some do cálculo quando fica vazio. A versão anterior tinha
 * `aria-pressed` e cara de multisseleção, mas guardava **um** valor por grupo —
 * clicar na segunda pílula apagava a primeira, e ninguém entendia por quê.
 *
 * O contador de marcados e o botão de limpar são o par que evita o beco sem
 * saída: sempre dá para ver quantos filtros estão ativos e desfazê-los de uma
 * vez.
 */
export function FiltroDestinos({ filtros, aoMudar, ordem, aoOrdenar, encontrados }: Props) {
  const idOrdem = useId()
  const marcados = contarFiltros(filtros)

  return (
    <div className={css['barra']}>
      <div className={css['grupos']}>
        <fieldset className={css['grupo']}>
          <legend className={css['rotulo']}>Região</legend>
          <div className={css['pilulas']}>
            {REGIOES.map((r) => {
              const ativa = filtros.regioes.includes(r)
              return (
                <button
                  key={r}
                  type="button"
                  className={`${css['pilula']} ${ativa ? css['ativa'] : ''}`}
                  aria-pressed={ativa}
                  onClick={() => {
                    aoMudar(alternar(filtros, 'regioes', r))
                  }}
                >
                  {NOMES_REGIAO[r]}
                  {ativa ? <Icone nome="fechar" tamanho={11} /> : null}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className={css['grupo']}>
          <legend className={css['rotulo']}>Perfil da viagem</legend>
          <div className={css['pilulas']}>
            {CATEGORIAS.map((c) => {
              const ativa = filtros.perfis.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${css['pilula']} ${ativa ? css['ativa'] : ''}`}
                  aria-pressed={ativa}
                  onClick={() => {
                    aoMudar(alternar(filtros, 'perfis', c.id))
                  }}
                >
                  <Icone nome={c.icone} tamanho={14} />
                  {c.label}
                  {ativa ? <Icone nome="fechar" tamanho={11} /> : null}
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      <div className={css['rodape']}>
        <p className={css['contagem']} aria-live="polite">
          <strong>{encontrados}</strong> {encontrados === 1 ? 'destino' : 'destinos'}
          {marcados > 0 ? (
            <motion.span
              className={css['selo']}
              variants={SELO}
              initial="oculto"
              animate="visivel"
            >
              {marcados} {marcados === 1 ? 'filtro' : 'filtros'}
            </motion.span>
          ) : null}
        </p>

        <div className={css['controles']}>
          {marcados > 0 ? (
            <button
              type="button"
              className={css['limpar']}
              onClick={() => {
                aoMudar({ regioes: [], perfis: [] })
              }}
            >
              Limpar filtros
            </button>
          ) : null}

          {/*
            O `<select>` nativo com aparência do design system. Um menu
            construído à mão daria mais controle visual e custaria a rolagem
            nativa do iOS, a busca por digitação e o comportamento de teclado —
            que ninguém reimplementa direito.
          */}
          <div className={css['ordenarCaixa']}>
            <label htmlFor={idOrdem} className={css['ordenarRotulo']}>
              Ordenar
            </label>
            <div className={css['selectMoldura']}>
              <select
                id={idOrdem}
                className={css['select']}
                value={ordem}
                onChange={(e) => {
                  aoOrdenar(e.target.value as OrdemDestino)
                }}
              >
                {ORDENS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Icone nome="setaBaixo" tamanho={15} className={css['seta']} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
