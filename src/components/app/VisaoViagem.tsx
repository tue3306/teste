import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { Numero } from '@/components/ui/Numero'
import { SeletorPessoas } from './SeletorPessoas'
import { useViagem } from '@/context/ViagemContext'
import { resolverIds } from '@/services/catalogo'
import { CHECKLIST } from '@/data/site'
import { inteiro, moeda } from '@/lib/format'
import type { NomeIcone } from '@/components/ui/Icone'
import type { Vertical } from '@/types'
import css from './VisaoViagem.module.css'

/** Como cada vertical se apresenta no extrato. */
const APRESENTACAO: Record<Vertical, { label: string; icone: NomeIcone }> = {
  voos: { label: 'Passagem', icone: 'aviao' },
  hoteis: { label: 'Hospedagem', icone: 'hotel' },
  passeios: { label: 'Passeios', icone: 'aventura' },
  restaurantes: { label: 'Restaurantes', icone: 'gastronomia' },
  eventos: { label: 'Eventos', icone: 'evento' },
  carros: { label: 'Carro', icone: 'carro' },
}

const ORDEM: Vertical[] = ['voos', 'hoteis', 'carros', 'passeios', 'restaurantes', 'eventos']

/** Data ISO em "12 de set". */
function dataCurta(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

/**
 * Minha viagem: o que foi escolhido, quanto custa e quanto está economizando.
 *
 * Todo número desta tela vem de `calcularOrcamento`. Não há um total escrito à
 * mão em lugar nenhum — era assim que a versão anterior conseguia mostrar
 * R$ 5.240 de total com R$ 6.230 só de hospedagem dentro.
 */
export function VisaoViagem() {
  const {
    orcamento,
    contexto,
    busca,
    destino,
    descartar,
    adicionar,
    remover,
    limparViagem,
    checklist,
    alternarChecklist,
    favoritos,
    alternarFavorito,
    quantidade,
  } = useViagem()

  /**
   * Os salvos.
   *
   * O botão "Salvar" existia em cada cartão e gravava no navegador desde o
   * começo — e não havia uma tela sequer que mostrasse o resultado. Salvar sem
   * lugar para ver é um botão que não faz nada.
   */
  const salvos = resolverIds(favoritos)

  const semDatas = contexto.noites === 0
  const vazio = orcamento.linhas.length === 0

  /** Agrupa o extrato por vertical, na ordem em que a viagem acontece. */
  const grupos = ORDEM.map((v) => ({
    vertical: v,
    linhas: orcamento.linhas.filter((l) => l.item.vertical === v),
  })).filter((g) => g.linhas.length > 0)

  return (
    <div className={css['grade']}>
      <div className={css['coluna']}>
        {/* --- extrato --- */}
        <section className={css['cartao']} aria-labelledby="extrato">
          <div className={css['cabecalho']}>
            <h3 id="extrato" className={css['tituloCartao']}>
              Sua viagem para {destino.nome}
            </h3>
            <p className={css['periodo']}>
              {semDatas
                ? 'escolha as datas para fechar a conta'
                : `${dataCurta(busca.ida)} a ${dataCurta(busca.volta)} · ${String(contexto.noites)} ${contexto.noites === 1 ? 'noite' : 'noites'}`}
            </p>
          </div>

          {vazio ? (
            <div className={css['vazio']}>
              <p className={css['vazioTitulo']}>Nada escolhido ainda.</p>
              <p className={css['vazioTexto']}>
                Adicione um voo, uma hospedagem e o que mais quiser fazer — o total aparece aqui e
                se recalcula a cada mudança.
              </p>
              <Botao para="/plataforma/hoteis" variante="primario">
                Começar pela hospedagem
              </Botao>
            </div>
          ) : (
            <>
              {semDatas ? (
                <p className={css['aviso']} role="status">
                  Sem datas escolhidas, hospedagem e carro não podem ser multiplicados — o total
                  abaixo conta só o que é cobrado por pessoa. Defina ida e volta no cabeçalho.
                </p>
              ) : null}

              {grupos.map((g) => (
                <div key={g.vertical} className={css['grupo']}>
                  <p className={css['grupoTitulo']}>
                    <Icone nome={APRESENTACAO[g.vertical].icone} tamanho={15} />
                    {APRESENTACAO[g.vertical].label}
                  </p>

                  {g.linhas.map((l) => (
                    <motion.div key={l.item.id} layout className={css['linha']}>
                      <Imagem
                        slug={l.item.foto}
                        className={css['miniatura']}
                        sizes="64px"
                      />

                      <div className={css['linhaCorpo']}>
                        <p className={css['linhaNome']}>{l.item.titulo}</p>
                        <p className={css['linhaSub']}>{l.item.sub}</p>
                        {/*
                          A conta aberta: preço unitário, multiplicador e por quê.
                          É o que separa "R$ 4.450" de "R$ 890 × 5 noites".
                        */}
                        <p className={css['linhaConta']}>
                          {moeda(l.item.preco)} {l.explicacao}
                          {l.quantidade > 1 ? ` · ${String(l.quantidade)} unidades` : ''}
                        </p>
                      </div>

                      <div className={css['linhaDireita']}>
                        <span className={css['linhaValor']}>{moeda(l.total)}</span>
                        <div className={css['linhaAcoes']}>
                          <button
                            type="button"
                            className={css['passo']}
                            aria-label={`Tirar uma unidade de ${l.item.titulo}`}
                            onClick={() => {
                              remover(l.item.id)
                            }}
                          >
                            −
                          </button>
                          <span className={css['qtd']}>{l.quantidade}</span>
                          <button
                            type="button"
                            className={css['passo']}
                            aria-label={`Somar uma unidade de ${l.item.titulo}`}
                            onClick={() => {
                              adicionar(l.item)
                            }}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className={css['remover']}
                            aria-label={`Tirar ${l.item.titulo} da viagem`}
                            onClick={() => {
                              descartar(l.item.id)
                            }}
                          >
                            <Icone nome="fechar" tamanho={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}

              <div className={css['totais']}>
                <p className={css['linhaTotal']}>
                  <span>Preço médio de mercado</span>
                  <span className={css['riscado']}>{moeda(orcamento.totalMercado)}</span>
                </p>
                <p className={`${css['linhaTotal']} ${css['linhaGrande']}`}>
                  <span>Total pela BI&amp;B</span>
                  <Numero valor={orcamento.total} />
                </p>
                <p className={css['linhaTotal']}>
                  <span>Por pessoa</span>
                  <span>{moeda(orcamento.porPessoa)}</span>
                </p>
              </div>

              <button type="button" className={css['limpar']} onClick={limparViagem}>
                Esvaziar a viagem
              </button>
            </>
          )}
        </section>
      </div>

      <div className={css['coluna']}>
        {/* --- economia --- */}
        <section className={`${css['cartao']} ${css['cartaoEconomia']}`} aria-labelledby="economia">
          <h3 id="economia" className={css['tituloCartao']}>
            Economia estimada
          </h3>

          {vazio ? (
            <p className={css['vazioTexto']}>
              A economia aparece quando houver algo escolhido — é a diferença entre o que você
              pagaria no mercado e o que paga aqui.
            </p>
          ) : (
            <>
              <Numero valor={orcamento.economia} className={css['economiaValor']} />
              <p className={css['economiaPct']}>
                {orcamento.economiaPercentual.toFixed(1).replace('.', ',')}% mais barato que a média
                do mercado
              </p>

              <div className={css['barras']}>
                <div className={css['barraLinha']}>
                  <span className={css['barraRotulo']}>Mercado</span>
                  <div className={css['barra']}>
                    <div className={`${css['preenche']} ${css['preencheMercado']}`} style={{ width: '100%' }} />
                  </div>
                  <span className={css['barraValor']}>{moeda(orcamento.totalMercado)}</span>
                </div>
                <div className={css['barraLinha']}>
                  <span className={css['barraRotulo']}>BI&amp;B</span>
                  <div className={css['barra']}>
                    <div
                      className={css['preenche']}
                      style={{
                        width: `${String(
                          orcamento.totalMercado > 0
                            ? (orcamento.total / orcamento.totalMercado) * 100
                            : 0,
                        )}%`,
                      }}
                    />
                  </div>
                  <span className={css['barraValor']}>{moeda(orcamento.total)}</span>
                </div>
              </div>

              {busca.orcamento > 0 ? (
                <p className={orcamento.estourou ? css['estourou'] : css['dentro']}>
                  {orcamento.estourou
                    ? `${moeda(orcamento.total - busca.orcamento)} acima do seu orçamento de ${moeda(busca.orcamento)}`
                    : `${moeda(orcamento.sobra)} abaixo do seu orçamento de ${moeda(busca.orcamento)}`}
                </p>
              ) : null}
            </>
          )}
        </section>

        {/* --- quem viaja --- */}
        <section className={css['cartao']} aria-labelledby="grupo">
          <h3 id="grupo" className={css['tituloCartao']}>
            Quem viaja
          </h3>
          <p className={css['ajuda']}>
            Mudar o grupo recalcula o total inteiro na hora.
          </p>
          <SeletorPessoas />
        </section>

        {/* --- salvos --- */}
        {salvos.length > 0 ? (
          <section className={css['cartao']} aria-labelledby="salvos">
            <h3 id="salvos" className={css['tituloCartao']}>
              Salvos
            </h3>
            <p className={css['ajuda']}>
              {salvos.length} {salvos.length === 1 ? 'opção guardada' : 'opções guardadas'} para
              decidir depois.
            </p>
            <ul className={css['salvosLista']}>
              {salvos.map((s) => {
                const naViagem = quantidade(s.id) > 0
                return (
                  <motion.li key={s.id} layout className={css['salvo']}>
                    <Imagem slug={s.foto} className={css['salvoFoto']} sizes="52px" />
                    <div className={css['salvoCorpo']}>
                      <p className={css['salvoNome']}>{s.titulo}</p>
                      <p className={css['salvoPreco']}>
                        {moeda(s.preco)} · {APRESENTACAO[s.vertical].label.toLowerCase()}
                      </p>
                    </div>
                    <div className={css['salvoAcoes']}>
                      <button
                        type="button"
                        className={css['salvoAdicionar']}
                        disabled={naViagem}
                        onClick={() => {
                          adicionar(s)
                        }}
                      >
                        {naViagem ? 'Na viagem' : 'Adicionar'}
                      </button>
                      <button
                        type="button"
                        className={css['remover']}
                        aria-label={`Tirar ${s.titulo} dos salvos`}
                        onClick={() => {
                          alternarFavorito(s.id)
                        }}
                      >
                        <Icone nome="fechar" tamanho={13} />
                      </button>
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {/* --- checklist --- */}
        <section className={css['cartao']} aria-labelledby="checklist">
          <h3 id="checklist" className={css['tituloCartao']}>
            Antes de embarcar
          </h3>
          <ul className={css['check']}>
            {CHECKLIST.map((item) => {
              const feito = checklist.includes(item.id)
              return (
                <li key={item.id}>
                  <label className={`${css['checkItem']} ${feito ? css['checkFeito'] : ''}`}>
                    <input
                      type="checkbox"
                      checked={feito}
                      onChange={() => {
                        alternarChecklist(item.id)
                      }}
                    />
                    <span>{item.label}</span>
                  </label>
                </li>
              )
            })}
          </ul>
          <p className={css['ajuda']}>
            {inteiro(checklist.length)} de {inteiro(CHECKLIST.length)} concluídos
          </p>
        </section>

        <p className={css['rodapeNota']}>
          Preços de demonstração. Nenhuma reserva é efetivada — veja o que está{' '}
          <Link to="/sobre">implementado e o que falta</Link>.
        </p>
      </div>
    </div>
  )
}
