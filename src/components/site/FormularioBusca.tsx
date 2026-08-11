import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Botao } from '@/components/ui/Botao'
import { SeletorPessoas } from '@/components/app/SeletorPessoas'
import { useViagem } from '@/context/ViagemContext'
import { TIPOS_DE_VIAGEM } from '@/data/site'
import { DESTINOS, NOMES_REGIAO } from '@/data/rj'
import { noitesEntre } from '@/lib/orcamento'
import type { Categoria, RegiaoRJ } from '@/types'
import css from './FormularioBusca.module.css'

/** Destinos agrupados por região, para o `<optgroup>` do seletor. */
const POR_REGIAO = (Object.keys(NOMES_REGIAO) as RegiaoRJ[]).map((r) => ({
  regiao: r,
  destinos: DESTINOS.filter((d) => d.regiao === r),
}))

/**
 * Busca do hero.
 *
 * É um `<form>` de verdade: no protótipo os campos eram inputs soltos e o botão
 * um `onClick`, então Enter dentro de um campo não fazia nada.
 *
 * Os quatro campos deixaram de ser texto livre. Destino é um `<select>` dos 29
 * destinos reais, as datas são `<input type="date">` e as pessoas passaram a
 * ter faixa etária — porque tudo isso agora entra no cálculo do orçamento. Um
 * campo "2 adultos" digitado à mão não multiplica preço nenhum.
 */
export function FormularioBusca() {
  const { busca, definirBusca } = useViagem()
  const navigate = useNavigate()
  const id = useId()
  const [pessoasAberto, setPessoasAberto] = useState(false)

  const noites = noitesEntre(busca.ida, busca.volta)
  const total = busca.pessoas.adultos + busca.pessoas.criancas + busca.pessoas.bebes

  function aoEnviar(e: FormEvent) {
    e.preventDefault()
    void navigate('/plataforma/hoteis')
  }

  return (
    <form className={css['caixa']} onSubmit={aoEnviar}>
      <div className={css['linha']}>
        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-destino`}>
            Destino
          </label>
          <select
            id={`${id}-destino`}
            className={`${css['entrada']} ${css['select']}`}
            value={busca.destino}
            onChange={(e) => {
              definirBusca('destino', e.target.value)
            }}
          >
            {POR_REGIAO.map((g) => (
              <optgroup key={g.regiao} label={NOMES_REGIAO[g.regiao]}>
                {g.destinos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-ida`}>
            Ida
          </label>
          <input
            id={`${id}-ida`}
            className={css['entrada']}
            type="date"
            value={busca.ida}
            onChange={(e) => {
              definirBusca('ida', e.target.value)
            }}
          />
        </div>

        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-volta`}>
            Volta
          </label>
          <input
            id={`${id}-volta`}
            className={css['entrada']}
            type="date"
            /* A volta nunca antes da ida: barrar no próprio campo evita um
               estado inválido em vez de explicá-lo depois com mensagem de erro. */
            min={busca.ida}
            value={busca.volta}
            onChange={(e) => {
              definirBusca('volta', e.target.value)
            }}
          />
        </div>
      </div>

      <div className={css['linha']}>
        <div className={css['campo']}>
          <span className={css['rotulo']}>Pessoas</span>
          <button
            type="button"
            className={`${css['entrada']} ${css['gatilho']}`}
            aria-expanded={pessoasAberto}
            onClick={() => {
              setPessoasAberto((v) => !v)
            }}
          >
            {total} {total === 1 ? 'pessoa' : 'pessoas'}
            {busca.pessoas.criancas > 0
              ? ` · ${String(busca.pessoas.criancas)} criança${busca.pessoas.criancas > 1 ? 's' : ''}`
              : ''}
          </button>
        </div>

        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-orcamento`}>
            Orçamento total
          </label>
          <input
            id={`${id}-orcamento`}
            className={css['entrada']}
            type="number"
            min={0}
            step={100}
            value={busca.orcamento || ''}
            placeholder="6000"
            onChange={(e) => {
              definirBusca('orcamento', Number(e.target.value))
            }}
            inputMode="numeric"
          />
        </div>

        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-tipo`}>
            Perfil da viagem
          </label>
          <select
            id={`${id}-tipo`}
            className={`${css['entrada']} ${css['select']}`}
            value={busca.tipo}
            onChange={(e) => {
              definirBusca('tipo', e.target.value as Categoria | '')
            }}
          >
            <option value="">Qualquer</option>
            {TIPOS_DE_VIAGEM.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <Botao type="submit" tamanho="lg" className={css['enviar']}>
          Planejar viagem
        </Botao>
      </div>

      {pessoasAberto ? (
        <div className={css['painelPessoas']}>
          <SeletorPessoas compacto />
        </div>
      ) : null}

      <p className={css['resumoBusca']} aria-live="polite">
        {noites > 0
          ? `${String(noites)} ${noites === 1 ? 'noite' : 'noites'} · ${String(total)} ${total === 1 ? 'pessoa' : 'pessoas'}`
          : 'Escolha a volta depois da ida para a conta fechar.'}
      </p>
    </form>
  )
}
