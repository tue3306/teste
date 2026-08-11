import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { DESTINOS, NOMES_REGIAO, contarPorVertical } from '@/data/rj'
import { useViagem } from '@/context/ViagemContext'
import { selosDe } from '@/lib/selos'
import { moeda, nota } from '@/lib/format'
import { GRADE, ITEM_GRADE } from '@/lib/motion'
import type { RegiaoRJ } from '@/types'
import css from './EtapaDestino.module.css'

const REGIOES = Object.keys(NOMES_REGIAO) as RegiaoRJ[]

/**
 * Etapa 1 — escolha do destino.
 *
 * Versão enxuta da aba de destinos: sem a barra de filtro completa, porque
 * dentro do fluxo a pessoa está decidindo, não explorando. O que fica é o
 * atalho por região e uma busca por nome, que é como alguém que já sabe para
 * onde vai chega ao destino em dois toques.
 */
export function EtapaDestino() {
  const { destino, definirBusca, busca } = useViagem()
  const [regiao, setRegiao] = useState<RegiaoRJ | 'todas'>('todas')
  const [texto, setTexto] = useState('')

  const lista = useMemo(() => {
    const alvo = texto.trim().toLowerCase()
    return DESTINOS.filter((d) => {
      const naRegiao = regiao === 'todas' || d.regiao === regiao
      const noTexto =
        alvo === '' ||
        d.nome.toLowerCase().includes(alvo) ||
        d.chamada.toLowerCase().includes(alvo) ||
        d.praias.some((p) => p.toLowerCase().includes(alvo)) ||
        d.atracoes.some((a) => a.toLowerCase().includes(alvo))
      return naRegiao && noTexto
    })
  }, [regiao, texto])

  return (
    <div className={css['bloco']}>
      <div className={css['controles']}>
        <label className={css['busca']}>
          <Icone nome="praia" tamanho={16} />
          <input
            type="search"
            className={css['buscaEntrada']}
            placeholder="Buscar por cidade, praia ou atração"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
            }}
          />
        </label>

        <div className={css['regioes']}>
          <button
            type="button"
            className={`${css['pilula']} ${regiao === 'todas' ? css['ativa'] : ''}`}
            aria-pressed={regiao === 'todas'}
            onClick={() => {
              setRegiao('todas')
            }}
          >
            Todas
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
      </div>

      <p className={css['contagem']} aria-live="polite">
        {lista.length} {lista.length === 1 ? 'destino' : 'destinos'}
      </p>

      {lista.length === 0 ? (
        <div className={css['vazio']}>
          <p className={css['vazioTitulo']}>Nada com esse nome</p>
          <p className={css['vazioTexto']}>
            Tente outra grafia, ou solte a região. A busca também encontra por praia e por
            atração — "Lopes Mendes" leva à Ilha Grande.
          </p>
          <button
            type="button"
            className={css['vazioBotao']}
            onClick={() => {
              setTexto('')
              setRegiao('todas')
            }}
          >
            Limpar busca · {DESTINOS.length} destinos
          </button>
        </div>
      ) : (
        <motion.ul className={css['grade']} {...GRADE}>
          {lista.map((d) => {
            const escolhido = d.id === destino.id
            const conta = contarPorVertical(d.id)
            const opcoes = Object.values(conta).reduce((s, n) => s + n, 0)
            const selos = selosDe(d)
            // Combina com o que a pessoa disse gostar, na etapa de preferências.
            const combina = busca.preferencias.filter((p) => d.categorias.includes(p))

            return (
              <motion.li key={d.id} variants={ITEM_GRADE}>
                <button
                  type="button"
                  className={`${css['cartao']} ${escolhido ? css['cartaoAtivo'] : ''}`}
                  aria-pressed={escolhido}
                  onClick={() => {
                    definirBusca('destino', d.id)
                  }}
                >
                  <Imagem
                    slug={d.foto}
                    className={css['foto']}
                    sizes="(min-width: 900px) 240px, 45vw"
                  />

                  <span className={css['corpo']}>
                    <span className={css['linhaTopo']}>
                      <span className={css['nome']}>{d.nome}</span>
                      <span className={css['nota']}>
                        <Icone nome="estrela" tamanho={10} />
                        {nota(d.nota)}
                      </span>
                    </span>

                    <span className={css['regiaoLinha']}>{NOMES_REGIAO[d.regiao]}</span>
                    <span className={css['chamada']}>{d.chamada}</span>

                    <span className={css['fatos']}>
                      {d.distanciaKm === 0 ? 'na capital' : `${String(d.distanciaKm)} km`} ·{' '}
                      {d.tempoViagem} · {opcoes} opções
                    </span>
                    <span className={css['fatos']}>
                      diária {moeda(d.faixaPreco.min)}–{moeda(d.faixaPreco.max)} · {d.epoca}
                    </span>

                    <span className={css['selos']}>
                      {combina.map((c) => (
                        <span key={c} className={`${css['selo']} ${css['seloCombina']}`}>
                          ✓ {c.replace('-', ' ')}
                        </span>
                      ))}
                      {selos.map((s) => (
                        <span key={s.id} className={css['selo']} title={s.criterio}>
                          {s.emoji} {s.label}
                        </span>
                      ))}
                    </span>
                  </span>

                  {escolhido ? <span className={css['marca']}>Escolhido</span> : null}
                </button>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
    </div>
  )
}
