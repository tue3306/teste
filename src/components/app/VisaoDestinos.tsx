import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { FiltroDestinos } from './FiltroDestinos'
import { DESTINOS, NOMES_REGIAO, contarPorVertical } from '@/data/rj'
import { useViagem } from '@/context/ViagemContext'
import { moeda, nota } from '@/lib/format'
import { filtrar, ordenar, saidas, type Filtros, type OrdemDestino } from '@/lib/filtros'
import { selosDe, tamanhoInventario } from '@/lib/selos'
import { GRADE, ITEM_GRADE, TAP_CARTAO, hoverCartao } from '@/lib/motion'
import { useMovimentoReduzido } from '@/hooks/useMovimento'
import type { Categoria, RegiaoRJ } from '@/types'
import css from './VisaoDestinos.module.css'

/** Lê os filtros da URL. Permite compartilhar uma busca filtrada por link. */
function daUrl(params: URLSearchParams, perfilDaBusca: Categoria | ''): Filtros {
  const regioes = params.getAll('regiao') as RegiaoRJ[]
  const perfis = params.getAll('perfil') as Categoria[]

  // Sem nada na URL, herda o perfil escolhido no formulário do hero.
  if (regioes.length === 0 && perfis.length === 0 && perfilDaBusca) {
    return { regioes: [], perfis: [perfilDaBusca] }
  }
  return { regioes, perfis }
}

/**
 * Escolha do destino.
 *
 * É a primeira aba de propósito: o destino comanda tudo o que as outras seis
 * mostram.
 *
 * Os filtros ficam num componente à parte e a regra de combinação numa função
 * pura (`lib/filtros.ts`), testada. Era aqui que morava o bug: um valor por
 * grupo, cruzados com E — clicar na segunda pílula apagava a primeira, e 15 das
 * 60 combinações possíveis devolviam zero sem explicar por quê.
 */
export function VisaoDestinos() {
  const { destino, definirBusca, busca, favoritos, alternarFavorito } = useViagem()
  const navegar = useNavigate()
  const [params, setParams] = useSearchParams()
  const semMovimento = useMovimentoReduzido()

  const [ordem, setOrdem] = useState<OrdemDestino>('relevancia')
  const filtros = useMemo(() => daUrl(params, busca.tipo), [params, busca.tipo])

  /** Grava os filtros na URL — o histórico do navegador passa a desfazê-los. */
  function aplicar(novos: Filtros) {
    const p = new URLSearchParams()
    for (const r of novos.regioes) p.append('regiao', r)
    for (const c of novos.perfis) p.append('perfil', c)
    setParams(p, { replace: true })
  }

  const lista = useMemo(
    () => ordenar(filtrar(DESTINOS, filtros), ordem, tamanhoInventario),
    [filtros, ordem],
  )

  /** O que soltar quando o cruzamento não devolve nada. */
  const escapes = useMemo(
    () => (lista.length === 0 ? saidas(DESTINOS, filtros) : []),
    [lista.length, filtros],
  )

  return (
    <div className={css['bloco']}>
      <FiltroDestinos
        filtros={filtros}
        aoMudar={aplicar}
        ordem={ordem}
        aoOrdenar={setOrdem}
        encontrados={lista.length}
      />

      {lista.length === 0 ? (
        /*
          Estado vazio que não é beco sem saída. Um cruzamento como
          "Região Serrana + Praia" é geograficamente impossível, não é dado
          faltando — então a tela explica isso e oferece o caminho de volta,
          com o número de destinos que cada saída destrava.
        */
        <motion.div
          className={css['vazio']}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={css['vazioIcone']} aria-hidden="true">
            <Icone nome="praia" tamanho={30} />
          </span>
          <h3 className={css['vazioTitulo']}>Nenhum destino combina esses filtros</h3>
          <p className={css['vazioTexto']}>
            Nem toda combinação existe no estado — não há praia na Região Serrana nem serra na
            Costa do Sol. Solte um dos filtros para voltar a ver resultados.
          </p>

          <div className={css['vazioAcoes']}>
            {escapes.map((s) => (
              <button
                key={s.grupo}
                type="button"
                className={css['vazioBotao']}
                onClick={() => {
                  aplicar({ ...filtros, [s.grupo]: [] })
                }}
              >
                Soltar {s.grupo === 'regioes' ? 'a região' : 'o perfil'} · {s.quantidade}{' '}
                {s.quantidade === 1 ? 'destino' : 'destinos'}
              </button>
            ))}
            <button
              type="button"
              className={`${css['vazioBotao']} ${css['vazioPrimario']}`}
              onClick={() => {
                aplicar({ regioes: [], perfis: [] })
              }}
            >
              Limpar filtros · {DESTINOS.length} destinos
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.ul className={css['grade']} {...GRADE} key={`${filtros.regioes.join()}|${filtros.perfis.join()}`}>
          {lista.map((d) => {
            const conta = contarPorVertical(d.id)
            const escolhido = d.id === destino.id
            const salvo = favoritos.includes(d.id)
            const opcoes = Object.values(conta).reduce((s, n) => s + n, 0)
            const selos = selosDe(d)

            return (
              <motion.li key={d.id} layout variants={ITEM_GRADE} className={css['item']}>
                <motion.article
                  className={`${css['cartao']} ${escolhido ? css['cartaoAtivo'] : ''}`}
                  whileHover={hoverCartao(semMovimento)}
                  whileTap={TAP_CARTAO}
                >
                  <div className={css['foto']}>
                    <Imagem
                      slug={d.foto}
                      sizes="(min-width: 1100px) 340px, (min-width: 700px) 45vw, 92vw"
                      zoom
                    />
                    <span className={css['regiao']}>{NOMES_REGIAO[d.regiao]}</span>

                    {/* Favoritar não exige conta: o id vai para o armazenamento
                        deste navegador e continua lá na próxima visita. */}
                    <button
                      type="button"
                      className={`${css['coracao']} ${salvo ? css['coracaoAtivo'] : ''}`}
                      aria-pressed={salvo}
                      aria-label={salvo ? `Tirar ${d.nome} dos favoritos` : `Favoritar ${d.nome}`}
                      onClick={() => {
                        alternarFavorito(d.id)
                      }}
                    >
                      {salvo ? '♥' : '♡'}
                    </button>

                    {selos.length > 0 ? (
                      <ul className={css['selos']}>
                        {selos.map((s) => (
                          <li key={s.id} className={css['seloItem']} title={s.criterio}>
                            <span aria-hidden="true">{s.emoji}</span> {s.label}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className={css['corpo']}>
                    <div className={css['linhaNome']}>
                      <h3 className={css['nome']}>{d.nome}</h3>
                      <span className={css['nota']}>
                        <Icone nome="estrela" tamanho={11} />
                        {nota(d.nota)}
                      </span>
                    </div>

                    <p className={css['chamada']}>{d.chamada}</p>

                    <ul className={css['fatos']}>
                      <li>
                        {d.distanciaKm === 0 ? 'na capital' : `${String(d.distanciaKm)} km do Rio`}
                      </li>
                      <li>{d.tempoViagem}</li>
                      <li>
                        diária {moeda(d.faixaPreco.min)}–{moeda(d.faixaPreco.max)}
                      </li>
                    </ul>

                    <ul className={css['tags']}>
                      {d.categorias.slice(0, 4).map((c) => (
                        <li key={c} className={css['tag']}>
                          {c.replace('-', ' ')}
                        </li>
                      ))}
                    </ul>

                    <p className={css['inventario']}>
                      {opcoes} opções · {conta.hoteis} hospedagens · {conta.passeios} passeios ·{' '}
                      {conta.restaurantes} restaurantes
                    </p>

                    <div className={css['acoes']}>
                      <button
                        type="button"
                        className={css['escolher']}
                        onClick={() => {
                          definirBusca('destino', d.id)
                          void navegar('/plataforma/hoteis')
                        }}
                      >
                        {escolhido ? 'Ver hospedagem' : 'Escolher este destino'}
                      </button>
                      <Link to={`/destino/${d.id}`} className={css['detalhes']}>
                        Detalhes
                      </Link>
                    </div>

                    {d.relacionados.length > 0 ? (
                      <p className={css['relacionados']}>
                        Combina com{' '}
                        {d.relacionados
                          .map((id) => DESTINOS.find((x) => x.id === id)?.nome)
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    ) : null}
                  </div>
                </motion.article>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
    </div>
  )
}
