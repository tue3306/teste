import { useViagem } from '@/context/ViagemContext'
import { TODAS_OFERTAS } from '@/data/ofertas'
import { ALERTAS, CHECKLIST, DOCUMENTOS } from '@/data/site'
import { COMPOSICAO, ECONOMIA, GASTO, VIAGEM } from '@/data/viagem'
import { moeda, resumo } from '@/lib/format'
import css from './VisaoPainel.module.css'

/**
 * Painel "Minha viagem".
 *
 * O número de reservas confirmadas passou a sair do estado real — antes era um
 * "4" fixo no HTML, que continuava 4 depois de reservar mais alguma coisa. O
 * checklist virou `<input type="checkbox">` de verdade: no protótipo era um
 * `<button>` com um quadradinho pintado, então nenhum leitor de tela conseguia
 * dizer se o item estava marcado.
 */
export function VisaoPainel() {
  const { checklist, alternarChecklist, favoritos, alternarFavorito, reservas } = useViagem()

  const salvos = favoritos
    .map((id) => TODAS_OFERTAS.find((o) => o.id === id))
    .filter((o) => o !== undefined)

  return (
    <div className={css['grade']}>
      <section className={`${css['cartao']} ${css['resumo']} ${css['largo']}`}>
        <h2 className="rotulo">próxima viagem</h2>
        <p className={css['destino']}>{VIAGEM.destino}</p>
        <p className={css['periodo']}>
          {VIAGEM.periodo} · {VIAGEM.noites} noites · {VIAGEM.pessoas} adultos
        </p>
        <dl className={css['numeros']}>
          <div>
            <dd className={css['numero']} style={{ margin: 0 }}>
              {moeda(GASTO)}
            </dd>
            <dt className={css['numeroLegenda']}>gasto previsto</dt>
          </div>
          <div>
            <dd className={`${css['numero']} ${css['numeroTeal']}`} style={{ margin: 0 }}>
              {moeda(ECONOMIA)}
            </dd>
            <dt className={css['numeroLegenda']}>economia obtida</dt>
          </div>
          <div>
            <dd className={css['numero']} style={{ margin: 0 }}>
              {reservas.length}
            </dd>
            <dt className={css['numeroLegenda']}>reservas confirmadas</dt>
          </div>
        </dl>

        {/* A conta aberta: cada linha e a soma que fecha no gasto previsto.
            Sem isso o total é um número que o usuário precisa aceitar. */}
        <dl className={css['composicao']}>
          {COMPOSICAO.map((linha) => (
            <div key={linha.rotulo} className={css['linhaGasto']}>
              <dt>
                <span className={css['gastoRotulo']}>{linha.rotulo}</span>
                <span className={css['gastoDetalhe']}>{linha.detalhe}</span>
              </dt>
              <dd className={css['gastoValor']}>{moeda(linha.valor)}</dd>
            </div>
          ))}
          <div className={`${css['linhaGasto']} ${css['linhaTotal']}`}>
            <dt className={css['gastoRotulo']}>Total previsto</dt>
            <dd className={css['gastoValor']}>{moeda(GASTO)}</dd>
          </div>
        </dl>
      </section>

      <section className={css['cartao']}>
        <h2 className="rotulo">alertas</h2>
        <ul className={css['lista']}>
          {ALERTAS.map((a) => (
            <li key={a.texto} className={css['alerta']}>
              {a.destaque ? (
                <span className={a.tom === 'teal' ? css['alertaTeal'] : css['alertaCoral']}>
                  {a.destaque}
                </span>
              ) : null}
              {a.texto}
            </li>
          ))}
        </ul>
      </section>

      <section className={css['cartao']}>
        <h2 className="rotulo">documentos</h2>
        <ul className={css['lista']}>
          {DOCUMENTOS.map((d) => (
            <li key={d.label} className={css['documento']}>
              <span>{d.label}</span>
              <span className={d.ok ? css['documentoOk'] : css['documentoPendente']}>{d.valor}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${css['cartao']} ${css['largo']}`}>
        <h2 className="rotulo">checklist</h2>
        <ul className={css['lista']}>
          {CHECKLIST.map((c) => {
            const feito = checklist.includes(c.id)
            return (
              <li key={c.id}>
                <label className={`${css['checkItem']} ${feito ? css['checkItemFeito'] : ''}`}>
                  <input
                    type="checkbox"
                    className={css['checkInput']}
                    checked={feito}
                    onChange={() => {
                      alternarChecklist(c.id)
                    }}
                  />
                  <span className={`${css['caixa']} ${feito ? css['caixaFeita'] : ''}`} aria-hidden="true">
                    {feito ? '✓' : ''}
                  </span>
                  <span className={`${css['checkTexto']} ${feito ? css['checkTextoFeito'] : ''}`}>
                    {c.label}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={`${css['cartao']} ${css['largo']}`}>
        <div className={css['cabecalhoCartao']}>
          <h2 className="rotulo">favoritos</h2>
          <span className={css['contagem']}>
            {salvos.length} {salvos.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
        <ul className={css['lista']}>
          {salvos.map((f) => (
            <li key={f.id} className={css['favorito']}>
              <div>
                <p className={css['favoritoNome']}>{f.titulo}</p>
                <p className={css['favoritoSub']}>{resumo(f.sub)}</p>
              </div>
              <div className={css['favoritoDireita']}>
                <span className={css['favoritoPreco']}>{moeda(f.preco)}</span>
                <button
                  type="button"
                  className={css['remover']}
                  onClick={() => {
                    alternarFavorito(f.id)
                  }}
                  aria-label={`Remover ${f.titulo} dos favoritos`}
                >
                  remover
                </button>
              </div>
            </li>
          ))}
          {salvos.length === 0 ? (
            <li className={css['vazio']}>
              Nada salvo ainda. Toque em “Salvar” em qualquer voo, hotel ou passeio.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  )
}
