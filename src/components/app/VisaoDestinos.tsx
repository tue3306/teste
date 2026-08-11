import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { DESTINOS, NOMES_REGIAO, contarPorVertical } from '@/data/rj'
import { useViagem } from '@/context/ViagemContext'
import { moeda, nota } from '@/lib/format'
import { CATEGORIAS } from '@/data/site'
import type { Categoria, RegiaoRJ } from '@/types'
import css from './VisaoDestinos.module.css'

const REGIOES = Object.keys(NOMES_REGIAO) as RegiaoRJ[]

/**
 * Escolha do destino.
 *
 * É a primeira aba de propósito: o destino comanda tudo o que as outras seis
 * mostram. Antes a plataforma abria em "Voos" com um destino fixo escrito no
 * código, e não havia como trocar.
 */
export function VisaoDestinos() {
  const { destino, definirBusca } = useViagem()
  const navegar = useNavigate()

  const [regiao, setRegiao] = useState<RegiaoRJ | 'todas'>('todas')
  const [categoria, setCategoria] = useState<Categoria | 'todas'>('todas')

  const lista = useMemo(
    () =>
      DESTINOS.filter(
        (d) =>
          (regiao === 'todas' || d.regiao === regiao) &&
          (categoria === 'todas' || d.categorias.includes(categoria)),
      ),
    [regiao, categoria],
  )

  return (
    <div className={css['bloco']}>
      <div className={css['filtros']}>
        <div className={css['grupo']} role="group" aria-label="Filtrar por região">
          <button
            type="button"
            className={`${css['pilula']} ${regiao === 'todas' ? css['ativa'] : ''}`}
            aria-pressed={regiao === 'todas'}
            onClick={() => {
              setRegiao('todas')
            }}
          >
            Todas as regiões
          </button>
          {REGIOES.map((r) => (
            <button
              key={r}
              type="button"
              className={`${css['pilula']} ${regiao === r ? css['ativa'] : ''}`}
              aria-pressed={regiao === r}
              onClick={() => {
                setRegiao(r)
              }}
            >
              {NOMES_REGIAO[r]}
            </button>
          ))}
        </div>

        <div className={css['grupo']} role="group" aria-label="Filtrar por perfil de viagem">
          <button
            type="button"
            className={`${css['pilula']} ${categoria === 'todas' ? css['ativa'] : ''}`}
            aria-pressed={categoria === 'todas'}
            onClick={() => {
              setCategoria('todas')
            }}
          >
            Todos os perfis
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${css['pilula']} ${categoria === c.id ? css['ativa'] : ''}`}
              aria-pressed={categoria === c.id}
              onClick={() => {
                setCategoria(c.id)
              }}
            >
              <Icone nome={c.icone} tamanho={14} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className={css['contagem']} aria-live="polite">
        {lista.length === 1 ? '1 destino' : `${String(lista.length)} destinos`} no estado do Rio de
        Janeiro
      </p>

      {lista.length === 0 ? (
        <p className={css['vazio']}>
          Nenhum destino combina essa região com esse perfil. Solte um dos dois filtros.
        </p>
      ) : (
        <ul className={css['grade']}>
          {lista.map((d) => {
            const conta = contarPorVertical(d.id)
            const escolhido = d.id === destino.id
            const opcoes = Object.values(conta).reduce((s, n) => s + n, 0)

            return (
              <motion.li key={d.id} layout className={css['item']}>
                <article className={`${css['cartao']} ${escolhido ? css['cartaoAtivo'] : ''}`}>
                  <div className={css['foto']}>
                    <Imagem
                      slug={d.foto}
                      sizes="(min-width: 1100px) 340px, (min-width: 700px) 45vw, 92vw"
                      zoom
                    />
                    <span className={css['regiao']}>{NOMES_REGIAO[d.regiao]}</span>
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
                      {escolhido ? <span className={css['selo']}>Escolhido</span> : null}
                    </div>

                    {/* Destinos próximos: combinar duas cidades numa viagem só é
                        o uso mais comum no RJ, e sem esta pista ninguém descobre
                        que Arraial fica a 20 minutos de Cabo Frio. */}
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
                </article>
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
