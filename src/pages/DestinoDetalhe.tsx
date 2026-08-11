import { useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { LayoutSite } from '@/components/site/LayoutSite'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { Reveal } from '@/components/ui/Reveal'
import { DESTINO_POR_ID, DESTINOS, NOMES_REGIAO, contarPorVertical } from '@/data/rj'
import { inventarioDoDestino } from '@/services/catalogo'
import { useAuth } from '@/context/AuthContext'
import { useViagem } from '@/context/ViagemContext'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import { useMovimentoReduzido } from '@/hooks/useMovimento'
import { GRADE, ITEM_GRADE, TAP_CARTAO, hoverCartao } from '@/lib/motion'
import { moeda, nota } from '@/lib/format'
import type { NomeIcone } from '@/components/ui/Icone'
import type { Vertical } from '@/types'
import css from './DestinoDetalhe.module.css'

const ROTULO: Record<Vertical, { label: string; icone: NomeIcone }> = {
  voos: { label: 'voos', icone: 'aviao' },
  hoteis: { label: 'hospedagens', icone: 'hotel' },
  passeios: { label: 'passeios', icone: 'aventura' },
  restaurantes: { label: 'restaurantes', icone: 'gastronomia' },
  eventos: { label: 'eventos', icone: 'evento' },
  carros: { label: 'carros', icone: 'carro' },
}

const ORDEM: Vertical[] = ['hoteis', 'passeios', 'restaurantes', 'eventos', 'carros']

/**
 * Página de um destino.
 *
 * A descrição, a galeria, as atrações, as praias e os destinos vizinhos
 * existiam no dado desde o começo e não apareciam em lugar nenhum — a vitrine
 * mostrava só o nome e uma frase. Esta página é onde o conteúdo do estado
 * realmente vive, e é dela que se entra na plataforma já com o destino
 * escolhido.
 */
export function DestinoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const destino = id ? DESTINO_POR_ID.get(id) : undefined
  const navegar = useNavigate()
  const { definirBusca } = useViagem()
  const { autenticado } = useAuth()
  const semMovimento = useMovimentoReduzido()

  const { scrollY } = useScroll()
  // Parallax da capa: a foto sobe mais devagar que a página. É deslocamento
  // amplo preso ao scroll — a categoria que o movimento reduzido contém.
  const yCapa = useTransform(scrollY, [0, 600], semMovimento ? [0, 0] : [0, 120])
  const escalaCapa = useTransform(scrollY, [0, 600], semMovimento ? [1, 1] : [1, 1.12])

  const inventario = useMemo(() => (destino ? inventarioDoDestino(destino.id) : []), [destino])
  const conta = useMemo(() => (destino ? contarPorVertical(destino.id) : null), [destino])

  useMetaDaPagina(
    destino ? `${destino.nome}, RJ` : 'Destino',
    destino?.chamada ?? 'Destino do estado do Rio de Janeiro.',
  )

  if (!destino) return <Navigate to="/plataforma/destinos" replace />

  const relacionados = destino.relacionados
    .map((r) => DESTINOS.find((d) => d.id === r))
    .filter((d) => d !== undefined)

  function abrirNaPlataforma(aba: string) {
    if (!destino) return
    definirBusca('destino', destino.id)
    void navegar(autenticado ? `/plataforma/${aba}` : '/login')
  }

  return (
    <LayoutSite>
      {/* --- capa com parallax --- */}
      <header className={css['capa']}>
        <motion.div className={css['capaFoto']} style={{ y: yCapa, scale: escalaCapa }}>
          <Imagem slug={destino.foto} sizes="100vw" prioridade className={css['capaImg']} />
        </motion.div>
        <div className={css['capaVeu']} aria-hidden="true" />

        <div className={`shell ${css['capaTexto']}`}>
          <motion.p
            className={css['migalha']}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/#destinos">Destinos</Link> · {NOMES_REGIAO[destino.regiao]}
          </motion.p>

          <motion.h1
            className={css['titulo']}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {destino.nome}
          </motion.h1>

          <motion.p
            className={css['chamada']}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {destino.chamada}
          </motion.p>

          <motion.ul
            className={css['fatosCapa']}
            initial="oculto"
            animate="visivel"
            variants={{ visivel: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
          >
            {[
              { rotulo: 'nota', valor: nota(destino.nota) },
              {
                rotulo: 'do Rio',
                valor: destino.distanciaKm === 0 ? 'você está aqui' : `${String(destino.distanciaKm)} km`,
              },
              { rotulo: 'viagem', valor: destino.tempoViagem },
              {
                rotulo: 'diária',
                valor: `${moeda(destino.faixaPreco.min)}–${moeda(destino.faixaPreco.max)}`,
              },
            ].map((f) => (
              <motion.li key={f.rotulo} variants={ITEM_GRADE} className={css['fatoCapa']}>
                <span className={css['fatoValor']}>{f.valor}</span>
                <span className={css['fatoRotulo']}>{f.rotulo}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </header>

      {/* --- corpo --- */}
      <div className={`shell ${css['corpo']}`}>
        <div className={css['principal']}>
          <Reveal>
            <h2 className={css['secaoTitulo']}>Sobre {destino.nome}</h2>
            {destino.descricao.split('\n\n').map((p) => (
              <p key={p.slice(0, 32)} className={css['paragrafo']}>
                {p}
              </p>
            ))}
          </Reveal>

          {destino.galeria.length > 0 ? (
            <motion.ul className={css['galeria']} {...GRADE}>
              {destino.galeria.map((slug) => (
                <motion.li key={slug} variants={ITEM_GRADE} className={css['galeriaItem']}>
                  <Imagem slug={slug} sizes="(min-width: 900px) 280px, 45vw" zoom />
                </motion.li>
              ))}
            </motion.ul>
          ) : null}

          <Reveal>
            <h2 className={css['secaoTitulo']}>O que ver</h2>
            <motion.ul className={css['listaChips']} {...GRADE}>
              {destino.atracoes.map((a) => (
                <motion.li key={a} variants={ITEM_GRADE} className={css['chip']}>
                  <Icone nome="cultura" tamanho={14} />
                  {a}
                </motion.li>
              ))}
            </motion.ul>
          </Reveal>

          {destino.praias.length > 0 ? (
            <Reveal>
              <h2 className={css['secaoTitulo']}>Praias</h2>
              <motion.ul className={css['listaChips']} {...GRADE}>
                {destino.praias.map((p) => (
                  <motion.li key={p} variants={ITEM_GRADE} className={`${css['chip']} ${css['chipPraia']}`}>
                    <Icone nome="praia" tamanho={14} />
                    {p}
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          ) : null}

          {/* Amostra do inventário, uma linha por vertical. */}
          <Reveal>
            <h2 className={css['secaoTitulo']}>O que a BI&amp;B compara aqui</h2>
            <div className={css['verticais']}>
              {ORDEM.filter((v) => (conta?.[v] ?? 0) > 0).map((v) => {
                const itens = inventario.filter((i) => i.vertical === v).slice(0, 3)
                return (
                  <div key={v} className={css['vertical']}>
                    <p className={css['verticalTitulo']}>
                      <Icone nome={ROTULO[v].icone} tamanho={15} />
                      {conta?.[v]} {ROTULO[v].label}
                    </p>
                    <motion.ul className={css['amostra']} {...GRADE}>
                      {itens.map((i) => (
                        <motion.li key={i.id} variants={ITEM_GRADE}>
                          <motion.button
                            type="button"
                            className={css['amostraItem']}
                            whileHover={hoverCartao(semMovimento)}
                            whileTap={TAP_CARTAO}
                            onClick={() => {
                              abrirNaPlataforma(v)
                            }}
                          >
                            <Imagem slug={i.foto} className={css['amostraFoto']} sizes="80px" />
                            <span className={css['amostraCorpo']}>
                              <span className={css['amostraNome']}>{i.titulo}</span>
                              <span className={css['amostraSub']}>{i.sub}</span>
                            </span>
                            <span className={css['amostraPreco']}>{moeda(i.preco)}</span>
                          </motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                )
              })}
            </div>
          </Reveal>

          {relacionados.length > 0 ? (
            <Reveal>
              <h2 className={css['secaoTitulo']}>Combina com</h2>
              <p className={css['ajuda']}>
                Cidades vizinhas que cabem na mesma viagem — no Rio de Janeiro, juntar dois destinos
                costuma custar menos que esticar a estadia em um só.
              </p>
              <motion.ul className={css['relacionados']} {...GRADE}>
                {relacionados.map((r) => (
                  <motion.li key={r.id} variants={ITEM_GRADE}>
                    <motion.div whileHover={hoverCartao(semMovimento)} whileTap={TAP_CARTAO}>
                      <Link to={`/destino/${r.id}`} className={css['relacionado']}>
                        <Imagem slug={r.foto} className={css['relacionadoFoto']} sizes="200px" zoom />
                        <span className={css['relacionadoNome']}>{r.nome}</span>
                        <span className={css['relacionadoSub']}>
                          {r.distanciaKm} km do Rio · {NOMES_REGIAO[r.regiao]}
                        </span>
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          ) : null}
        </div>

        {/* --- coluna fixa --- */}
        <aside className={css['lateral']}>
          <div className={css['cartaoAcao']}>
            <p className={css['cartaoRotulo']}>Melhor época</p>
            <p className={css['cartaoValor']}>{destino.epoca}</p>

            <div className={css['divisoria']} />

            <p className={css['cartaoRotulo']}>Perfis</p>
            <ul className={css['tags']}>
              {destino.categorias.map((c) => (
                <li key={c} className={css['tag']}>
                  {c.replace('-', ' ')}
                </li>
              ))}
            </ul>

            <div className={css['divisoria']} />

            <p className={css['cartaoRotulo']}>No catálogo</p>
            <p className={css['cartaoValor']}>
              {inventario.length} opções em {ORDEM.filter((v) => (conta?.[v] ?? 0) > 0).length}{' '}
              categorias
            </p>

            <Botao
              variante="primario"
              bloco
              onClick={() => {
                abrirNaPlataforma('hoteis')
              }}
            >
              Montar viagem para {destino.nome}
            </Botao>

            <p className={css['cartaoNota']}>
              {autenticado
                ? 'Abre a plataforma com este destino já escolhido.'
                : 'Você precisa entrar para abrir a plataforma.'}
            </p>
          </div>
        </aside>
      </div>
    </LayoutSite>
  )
}
