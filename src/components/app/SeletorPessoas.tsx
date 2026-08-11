import { useViagem } from '@/context/ViagemContext'
import { FATOR_IDADE, pessoasPagantes, quartosSugeridos, totalPessoas } from '@/lib/orcamento'
import type { Pessoas } from '@/types'
import css from './SeletorPessoas.module.css'

/**
 * As três faixas etárias, com a regra de cobrança de cada uma escrita ao lado.
 *
 * São as faixas que companhias aéreas e operadoras de passeio realmente usam.
 * O campo antes era um texto livre — "2 adultos" —, o que significava que o
 * número de pessoas não entrava em conta nenhuma: dava para escrever "8
 * adultos" e o total da viagem não se mexia.
 */
const FAIXAS: { id: keyof Pessoas; label: string; idade: string; regra: string }[] = [
  {
    id: 'adultos',
    label: 'Adultos',
    idade: '12 anos ou mais',
    regra: 'tarifa cheia',
  },
  {
    id: 'criancas',
    label: 'Crianças',
    idade: 'de 2 a 11 anos',
    regra: `paga ${String(FATOR_IDADE.crianca * 100)}% em voo e passeio`,
  },
  {
    id: 'bebes',
    label: 'Bebês',
    idade: 'até 1 ano, de colo',
    regra: 'não paga e não ocupa assento',
  },
]

interface Props {
  /** Reduz o espaçamento, para caber dentro do formulário do hero. */
  compacto?: boolean
}

export function SeletorPessoas({ compacto = false }: Props) {
  const { busca, definirPessoas, contexto, definirQuartos } = useViagem()
  const { pessoas } = busca

  const cabecas = totalPessoas(pessoas)
  const pagantes = pessoasPagantes(pessoas)
  const sugerido = quartosSugeridos(pessoas)

  return (
    <div className={`${css['bloco']} ${compacto ? css['compacto'] : ''}`}>
      <ul className={css['faixas']}>
        {FAIXAS.map((f) => {
          const valor = pessoas[f.id]
          // Ao menos um adulto: um grupo sem adulto não é uma viagem que se
          // possa reservar, e o total viraria uma fração de passageiro.
          const minimo = f.id === 'adultos' ? 1 : 0

          return (
            <li key={f.id} className={css['faixa']}>
              <div className={css['rotulos']}>
                <span className={css['nome']}>{f.label}</span>
                <span className={css['idade']}>{f.idade}</span>
                <span className={css['regra']}>{f.regra}</span>
              </div>

              <div className={css['contador']}>
                <button
                  type="button"
                  className={css['passo']}
                  disabled={valor <= minimo}
                  aria-label={`Menos um ${f.label.toLowerCase().replace(/s$/, '')}`}
                  onClick={() => {
                    definirPessoas(f.id, valor - 1)
                  }}
                >
                  −
                </button>
                {/*
                  `aria-live` no número, e não no botão: quem usa leitor de tela
                  ouve o valor novo depois de clicar, sem que o nome do botão
                  mude debaixo do foco.
                */}
                <span className={css['valor']} aria-live="polite">
                  {valor}
                </span>
                <button
                  type="button"
                  className={css['passo']}
                  disabled={valor >= 9}
                  aria-label={`Mais um ${f.label.toLowerCase().replace(/s$/, '')}`}
                  onClick={() => {
                    definirPessoas(f.id, valor + 1)
                  }}
                >
                  +
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {/*
        A conta aberta. Dois adultos e uma criança dão 2,7 passageiros pagantes,
        não 3 — e mostrar isso aqui é o que impede o total de parecer errado
        quando a pessoa confere na mão.
      */}
      <p className={css['resumo']}>
        <strong>
          {cabecas} {cabecas === 1 ? 'pessoa' : 'pessoas'}
        </strong>{' '}
        na viagem ·{' '}
        {Number.isInteger(pagantes)
          ? `${String(pagantes)} pagantes`
          : `${pagantes.toFixed(1).replace('.', ',')} passageiros pagantes`}
      </p>

      <div className={css['quartos']}>
        <label htmlFor="quartos" className={css['quartosRotulo']}>
          Quartos
        </label>
        <select
          id="quartos"
          className={css['select']}
          value={contexto.quartos}
          onChange={(e) => {
            const escolhido = Number(e.target.value)
            // Voltar ao sugerido não é um valor a mais na lista: é escolher o
            // número que o grupo pede. Quando coincide, solta o override para o
            // campo voltar a acompanhar mudanças no grupo.
            definirQuartos(escolhido === sugerido ? null : escolhido)
          }}
        >
          {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'quarto' : 'quartos'}
              {n === sugerido ? ' (sugerido)' : ''}
            </option>
          ))}
        </select>
        <span className={css['quartosNota']}>
          a diária de hospedagem é multiplicada por noites × quartos
        </span>
      </div>
    </div>
  )
}
