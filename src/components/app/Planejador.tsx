import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { Numero } from '@/components/ui/Numero'
import { Mapa, type PontoMapa } from '@/components/ui/Mapa'
import { SeletorPessoas } from './SeletorPessoas'
import { EtapaDestino } from './EtapaDestino'
import { EtapaCatalogo } from './EtapaCatalogo'
import { useViagem } from '@/context/ViagemContext'
import { CHAVES, gravar, ler } from '@/lib/armazenamento'
import { DESTINOS, NOMES_REGIAO } from '@/data/rj'
import { TIPOS_DE_VIAGEM } from '@/data/site'
import { moeda } from '@/lib/format'
import {
  ETAPAS,
  anterior,
  indiceDe,
  normalizar,
  pendencias,
  podeAvancar,
  progresso,
  proxima,
  resolvida,
  type IdEtapa,
} from '@/lib/planejador'
import css from './Planejador.module.css'

/**
 * Planejador de viagem em etapas.
 *
 * As abas continuam existindo para quem quer ir direto a uma vertical — mas
 * este é o caminho principal: onze etapas em ordem, com o que já foi decidido
 * sempre visível ao lado.
 *
 * ## Três decisões
 *
 * **A etapa vive na URL** (`?etapa=datas`). O botão voltar do navegador desfaz
 * um passo, o link é compartilhável e recarregar não joga a pessoa de volta ao
 * começo. Guardar em `useState` custaria as três coisas.
 *
 * **Nada é perdido ao voltar.** Cada etapa escreve direto no estado da viagem,
 * que persiste no navegador. Não há rascunho separado que precise ser
 * confirmado no fim — voltar da hospedagem para as preferências e avançar de
 * novo encontra tudo como estava.
 *
 * **Só as três primeiras travam.** Destino, datas e pessoas seguram o avanço
 * porque sem eles não existe orçamento. Da hospedagem em diante a etapa
 * incompleta vira pendência no resumo, e não um bloqueio: travar um formulário
 * de onze passos numa etapa opcional é a forma mais rápida de fazer alguém
 * desistir.
 */
export function Planejador() {
  const viagem = useViagem()
  const { busca, definirBusca, destino, contexto, orcamento, itensEscolhidos } = viagem
  const [params, setParams] = useSearchParams()

  const atual = normalizar(params.get('etapa'))
  const etapa = ETAPAS[indiceDe(atual)]

  const estado = useMemo(
    () => ({ busca, escolhidos: itensEscolhidos }),
    [busca, itensEscolhidos],
  )

  const irPara = useCallback(
    (id: IdEtapa) => {
      const p = new URLSearchParams(params)
      p.set('etapa', id)
      setParams(p)
      // A etapa fica guardada para quem fecha a aba no meio e volta depois.
      gravar(CHAVES.etapa, id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [params, setParams],
  )

  // Retomada: sem `?etapa=` na URL, volta para onde a pessoa parou.
  useEffect(() => {
    if (params.get('etapa')) return
    const guardada = ler<IdEtapa | null>(CHAVES.etapa, null)
    if (guardada && guardada !== 'destino') irPara(normalizar(guardada))
  }, [params, irPara])

  const prog = progresso(estado)
  const faltando = pendencias(estado)
  const anteriorId = anterior(atual)
  const proximaId = proxima(atual)
  const liberado = podeAvancar(atual, estado)

  return (
    <div className={css['grade']}>
      <div className={css['principal']}>
        {/* --- trilha de etapas --- */}
        <nav className={css['trilha']} aria-label="Etapas do planejamento">
          <div className={css['barra']}>
            <motion.div
              className={css['preenche']}
              animate={{ width: `${String(prog.pct)}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>

          <ol className={css['passos']}>
            {ETAPAS.map((e, i) => {
              const feita = resolvida(e.id, estado)
              const aqui = e.id === atual
              return (
                <li key={e.id}>
                  {/*
                    Toda etapa é clicável, inclusive as que vêm depois. Um
                    assistente que só deixa avançar em linha reta obriga a
                    passar por seis telas para corrigir a data — e ninguém
                    passa: abandona.
                  */}
                  <button
                    type="button"
                    className={`${css['passo']} ${aqui ? css['passoAqui'] : ''} ${feita ? css['passoFeito'] : ''}`}
                    aria-current={aqui ? 'step' : undefined}
                    onClick={() => {
                      irPara(e.id)
                    }}
                  >
                    <span className={css['passoNumero']} aria-hidden="true">
                      {feita && !aqui ? '✓' : i + 1}
                    </span>
                    <span className={css['passoNome']}>{e.titulo}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* --- conteúdo da etapa --- */}
        <motion.section
          key={atual}
          className={css['painel']}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          aria-labelledby="etapa-titulo"
        >
          <header className={css['cabecalho']}>
            <span className={css['etapaIcone']} aria-hidden="true">
              <Icone nome={etapa.icone} tamanho={20} />
            </span>
            <div>
              <p className={css['etapaContador']}>
                Etapa {indiceDe(atual) + 1} de {ETAPAS.length}
                {etapa.obrigatoria ? ' · obrigatória' : ' · opcional'}
              </p>
              <h2 id="etapa-titulo" className={css['etapaTitulo']}>
                {etapa.titulo}
              </h2>
              <p className={css['etapaAjuda']}>{etapa.ajuda}</p>
            </div>
          </header>

          <div className={css['corpo']}>
            {atual === 'destino' ? <EtapaDestino /> : null}

            {atual === 'datas' ? <BlocoDatas /> : null}

            {atual === 'pessoas' ? <SeletorPessoas /> : null}

            {atual === 'preferencias' ? (
              <div className={css['perfis']}>
                {TIPOS_DE_VIAGEM.map((t) => {
                  const ativa = busca.preferencias.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`${css['perfil']} ${ativa ? css['perfilAtivo'] : ''}`}
                      aria-pressed={ativa}
                      onClick={() => {
                        definirBusca(
                          'preferencias',
                          ativa
                            ? busca.preferencias.filter((p) => p !== t.id)
                            : [...busca.preferencias, t.id],
                        )
                      }}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            ) : null}

            {etapa.vertical ? <EtapaCatalogo vertical={etapa.vertical} /> : null}

            {atual === 'transporte' ? (
              <div className={css['duplo']}>
                <EtapaCatalogo vertical="voos" titulo="Como chegar" />
                <EtapaCatalogo vertical="carros" titulo="Como circular" />
              </div>
            ) : null}

            {atual === 'mapa' ? <BlocoMapa /> : null}

            {atual === 'resumo' ? <BlocoResumo /> : null}
          </div>

          {/* --- navegação --- */}
          <footer className={css['rodape']}>
            {anteriorId ? (
              <button
                type="button"
                className={css['voltar']}
                onClick={() => {
                  irPara(anteriorId)
                }}
              >
                ← {ETAPAS[indiceDe(anteriorId)]?.titulo}
              </button>
            ) : (
              <span />
            )}

            {proximaId ? (
              <button
                type="button"
                className={css['avancar']}
                disabled={!liberado}
                onClick={() => {
                  irPara(proximaId)
                }}
              >
                {ETAPAS[indiceDe(proximaId)]?.titulo} →
              </button>
            ) : null}
          </footer>

          {!liberado ? (
            <p className={css['travado']} role="status">
              Esta etapa é obrigatória: sem ela o orçamento não fecha.
            </p>
          ) : null}
        </motion.section>
      </div>

      {/* --- resumo lateral, sempre visível --- */}
      <aside className={css['lateral']} aria-label="Resumo da viagem">
        <div className={css['resumo']}>
          <p className={css['resumoTitulo']}>Sua viagem</p>

          <dl className={css['resumoLista']}>
            <div>
              <dt>Destino</dt>
              <dd>{destino.nome}</dd>
            </div>
            <div>
              <dt>Período</dt>
              <dd>
                {contexto.noites > 0
                  ? `${String(contexto.noites)} ${contexto.noites === 1 ? 'noite' : 'noites'}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>Grupo</dt>
              <dd>
                {busca.pessoas.adultos} adulto{busca.pessoas.adultos > 1 ? 's' : ''}
                {busca.pessoas.criancas > 0 ? `, ${String(busca.pessoas.criancas)} criança${busca.pessoas.criancas > 1 ? 's' : ''}` : ''}
              </dd>
            </div>
            <div>
              <dt>Escolhas</dt>
              <dd>
                {itensEscolhidos.length} {itensEscolhidos.length === 1 ? 'item' : 'itens'}
              </dd>
            </div>
          </dl>

          <div className={css['resumoTotal']}>
            <span className={css['resumoTotalRotulo']}>Total estimado</span>
            <Numero valor={orcamento.total} className={css['resumoTotalValor']} />
            {orcamento.economia > 0 ? (
              <span className={css['resumoEconomia']}>
                −{moeda(orcamento.economia)} vs. mercado
              </span>
            ) : null}
          </div>

          {faltando.length > 0 ? (
            <div className={css['pendencias']}>
              <p className={css['pendenciasTitulo']}>Falta para fechar a conta</p>
              <ul>
                {faltando.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      className={css['pendencia']}
                      onClick={() => {
                        irPara(e.id)
                      }}
                    >
                      {e.titulo}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={css['completo']}>
              {prog.feitas} de {prog.total} etapas decididas
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}

/** Etapa 2 — ida e volta. */
function BlocoDatas() {
  const { busca, definirBusca, contexto } = useViagem()

  return (
    <div className={css['datas']}>
      <label className={css['campo']}>
        <span className={css['campoRotulo']}>Ida</span>
        <input
          type="date"
          className={css['campoEntrada']}
          value={busca.ida}
          onChange={(e) => {
            definirBusca('ida', e.target.value)
          }}
        />
      </label>

      <label className={css['campo']}>
        <span className={css['campoRotulo']}>Volta</span>
        <input
          type="date"
          className={css['campoEntrada']}
          /* A volta nunca antes da ida: barrar no campo evita um estado
             inválido em vez de explicá-lo depois com mensagem de erro. */
          min={busca.ida}
          value={busca.volta}
          onChange={(e) => {
            definirBusca('volta', e.target.value)
          }}
        />
      </label>

      <label className={css['campo']}>
        <span className={css['campoRotulo']}>Orçamento total</span>
        <input
          type="number"
          className={css['campoEntrada']}
          min={0}
          step={100}
          inputMode="numeric"
          placeholder="6000"
          value={busca.orcamento || ''}
          onChange={(e) => {
            definirBusca('orcamento', Number(e.target.value))
          }}
        />
      </label>

      <p className={css['datasResumo']} aria-live="polite">
        {contexto.noites > 0
          ? `${String(contexto.noites)} ${contexto.noites === 1 ? 'noite' : 'noites'} · carro por ${String(contexto.dias)} dias`
          : 'Escolha a volta depois da ida para a conta fechar.'}
      </p>
    </div>
  )
}

/** Etapa 10 — onde tudo fica. */
function BlocoMapa() {
  const { destino } = useViagem()

  const pontos = useMemo<PontoMapa[]>(
    () =>
      DESTINOS.map((d) => ({
        id: d.id,
        nome: d.nome,
        latitude: d.latitude,
        longitude: d.longitude,
        cor: d.id === destino.id ? '#e0663f' : '#0f766e',
      })),
    [destino.id],
  )

  const vizinhos = destino.relacionados
    .map((r) => DESTINOS.find((d) => d.id === r))
    .filter((d) => d !== undefined)

  return (
    <div className={css['mapaBloco']}>
      <div className={css['mapaMoldura']}>
        <Mapa
          pontos={pontos}
          ativo={destino.id}
          rotulo={`Mapa do estado, com ${destino.nome} destacado`}
        />
      </div>

      {vizinhos.length > 0 ? (
        <div>
          <p className={css['mapaTitulo']}>Dá para combinar com</p>
          <ul className={css['vizinhos']}>
            {vizinhos.map((v) => (
              <li key={v.id} className={css['vizinho']}>
                <Imagem slug={v.foto} className={css['vizinhoFoto']} sizes="72px" />
                <span>
                  <span className={css['vizinhoNome']}>{v.nome}</span>
                  <span className={css['vizinhoSub']}>{NOMES_REGIAO[v.regiao]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/** Etapa 11 — a viagem inteira. */
function BlocoResumo() {
  const { orcamento, destino, contexto, busca } = useViagem()

  if (orcamento.linhas.length === 0) {
    return (
      <div className={css['resumoVazio']}>
        <p className={css['resumoVazioTitulo']}>Sua viagem ainda está vazia</p>
        <p className={css['resumoVazioTexto']}>
          Volte às etapas de hospedagem, passeios ou transporte e escolha o que quiser. O total
          aparece aqui e se recalcula a cada mudança.
        </p>
      </div>
    )
  }

  return (
    <div className={css['resumoFinal']}>
      <p className={css['resumoFinalCabecalho']}>
        {destino.nome} · {contexto.noites} {contexto.noites === 1 ? 'noite' : 'noites'} ·{' '}
        {busca.pessoas.adultos + busca.pessoas.criancas + busca.pessoas.bebes} pessoas
      </p>

      <ul className={css['extrato']}>
        {orcamento.linhas.map((l) => (
          <li key={l.item.id} className={css['linha']}>
            <Imagem slug={l.item.foto} className={css['linhaFoto']} sizes="56px" />
            <span className={css['linhaCorpo']}>
              <span className={css['linhaNome']}>{l.item.titulo}</span>
              {/* A conta aberta: preço unitário × multiplicador, e por quê. */}
              <span className={css['linhaConta']}>
                {moeda(l.item.preco)} {l.explicacao}
                {l.quantidade > 1 ? ` · ${String(l.quantidade)}×` : ''}
              </span>
            </span>
            <span className={css['linhaValor']}>{moeda(l.total)}</span>
          </li>
        ))}
      </ul>

      <div className={css['fecho']}>
        <p className={css['fechoLinha']}>
          <span>Preço médio de mercado</span>
          <span className={css['riscado']}>{moeda(orcamento.totalMercado)}</span>
        </p>
        <p className={`${css['fechoLinha']} ${css['fechoTotal']}`}>
          <span>Total pela BI&amp;B</span>
          <Numero valor={orcamento.total} />
        </p>
        <p className={css['fechoLinha']}>
          <span>Por pessoa</span>
          <span>{moeda(orcamento.porPessoa)}</span>
        </p>
        <p className={css['fechoEconomia']}>
          Você economiza {moeda(orcamento.economia)} —{' '}
          {orcamento.economiaPercentual.toFixed(1).replace('.', ',')}% abaixo da média
        </p>
      </div>

      <p className={css['aviso']}>
        Dados de demonstração. Nenhuma reserva é efetivada e nenhum dado de pagamento é pedido.
      </p>
    </div>
  )
}
