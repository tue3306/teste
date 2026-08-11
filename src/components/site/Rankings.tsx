import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Imagem } from '@/components/ui/Imagem'
import { Icone } from '@/components/ui/Icone'
import { Reveal } from '@/components/ui/Reveal'
import { RANKINGS } from '@/lib/selos'
import { NOMES_REGIAO } from '@/data/rj'
import { moeda, nota } from '@/lib/format'
import { ITEM_GRADE, CONTAINER } from '@/lib/motion'
import css from './Rankings.module.css'

/**
 * Rankings de destinos.
 *
 * Cada lista mostra o critério que a gerou, ao lado do título. Isso não é
 * rodapé legal: é o que separa um ranking que a pessoa pode conferir de um que
 * ela precisa acreditar. Nenhum número aqui é inventado — não há contador de
 * buscas nem de reservas, porque o projeto não tem essas medidas. O que existe
 * é nota, tamanho de inventário, diária e distância, e é só com isso que as
 * ordens são construídas (ver `src/lib/selos.ts`).
 */
export function Rankings() {
  const [ativo, setAtivo] = useState(RANKINGS[0]?.id ?? '')
  const ranking = RANKINGS.find((r) => r.id === ativo) ?? RANKINGS[0]

  if (!ranking) return null

  return (
    <section id="rankings" className="shell secao" aria-labelledby="rankings-titulo">
      <Reveal className={css['topo']}>
        <div style={{ maxWidth: 620 }}>
          <p className="eyebrow">03 — onde ir</p>
          <h2 id="rankings-titulo" className="titulo">
            Os melhores do estado,
            <br />
            <span className="serif">e por que estão aí.</span>
          </h2>
        </div>
        <p className="lead" style={{ maxWidth: 340, fontSize: '1rem' }}>
          Cada lista diz de onde saiu a ordem. Nenhum número foi inventado — a base é o catálogo.
        </p>
      </Reveal>

      <Reveal atraso={0.08}>
        <div className={css['abas']} role="tablist" aria-label="Rankings de destinos">
          {RANKINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === ativo}
              className={`${css['aba']} ${r.id === ativo ? css['abaAtiva'] : ''}`}
              onClick={() => {
                setAtivo(r.id)
              }}
            >
              {r.titulo}
            </button>
          ))}
        </div>

        <p className={css['criterio']}>
          <Icone nome="estrela" tamanho={13} />
          Ordenado por {ranking.criterio}
        </p>

        {/* `key` no ranking faz a lista remontar e reanimar ao trocar de aba —
            sem isso a troca é instantânea e não se percebe que mudou. */}
        <motion.ol
          key={ranking.id}
          className={css['lista']}
          variants={CONTAINER}
          initial="oculto"
          animate="visivel"
        >
          {ranking.destinos.map((d, i) => (
            <motion.li key={d.id} variants={ITEM_GRADE} className={css['item']}>
              <Link to={`/destino/${d.id}`} className={css['linha']}>
                <span className={css['posicao']}>{i + 1}</span>
                <Imagem slug={d.foto} className={css['foto']} sizes="96px" />
                <span className={css['corpo']}>
                  <span className={css['nome']}>{d.nome}</span>
                  <span className={css['sub']}>
                    {NOMES_REGIAO[d.regiao]} ·{' '}
                    {d.distanciaKm === 0 ? 'na capital' : `${String(d.distanciaKm)} km do Rio`}
                  </span>
                </span>
                <span className={css['direita']}>
                  <span className={css['nota']}>
                    <Icone nome="estrela" tamanho={11} />
                    {nota(d.nota)}
                  </span>
                  <span className={css['preco']}>a partir de {moeda(d.faixaPreco.min)}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </Reveal>
    </section>
  )
}
