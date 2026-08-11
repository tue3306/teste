import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { useViagem } from '@/context/ViagemContext'
import { SERVICOS } from '@/services/catalogo'
import { subtotal } from '@/lib/orcamento'
import { moeda, nota } from '@/lib/format'
import { GRADE, ITEM_GRADE } from '@/lib/motion'
import type { Vertical } from '@/types'
import css from './EtapaCatalogo.module.css'

interface Props {
  vertical: Vertical
  /** Sobrescreve o título, para quando duas verticais dividem a mesma etapa. */
  titulo?: string
}

const SUFIXO: Record<string, string> = {
  pessoa: '/pessoa',
  noite: '/noite',
  dia: '/dia',
  unico: '',
}

/**
 * Uma vertical dentro do fluxo.
 *
 * As opções vêm ordenadas pelo que combina com as preferências declaradas — não
 * por preço nem por nota isoladas. Alguém que marcou "praia" e "gastronomia" na
 * etapa 4 e recebe a lista na mesma ordem de sempre não entende para que serviu
 * ter marcado.
 *
 * Cada cartão mostra o preço unitário **e** quanto ele soma na viagem. É a
 * informação que falta em toda plataforma de viagem: "R$ 890 a diária" não diz
 * nada até virar "R$ 4.450 pelas cinco noites".
 */
export function EtapaCatalogo({ vertical, titulo }: Props) {
  const { destino, busca, contexto, adicionar, remover, quantidade } = useViagem()

  const itens = useMemo(() => {
    const lista = SERVICOS[vertical].listar({ destino: destino.id })

    // Quantas preferências cada item atende. Empate desfeito por nota.
    const afinidade = (o: (typeof lista)[number]) =>
      busca.preferencias.filter((p) => o.categorias.includes(p)).length

    return [...lista].sort((a, b) => afinidade(b) - afinidade(a) || b.nota - a.nota)
  }, [vertical, destino.id, busca.preferencias])

  if (itens.length === 0) {
    return (
      <div className={css['vazio']}>
        {titulo ? <p className={css['titulo']}>{titulo}</p> : null}
        <p className={css['vazioTexto']}>
          {vertical === 'carros' && destino.id === 'ilha-grande'
            ? 'Não circulam carros na Ilha Grande — tudo é trilha ou barco. Esta etapa não se aplica aqui.'
            : `Ainda não há inventário desta categoria em ${destino.nome}. Você pode seguir para a próxima etapa.`}
        </p>
      </div>
    )
  }

  return (
    <div className={css['bloco']}>
      {titulo ? <p className={css['titulo']}>{titulo}</p> : null}

      <motion.ul className={css['lista']} {...GRADE}>
        {itens.map((o) => {
          const qtd = quantidade(o.id)
          const naViagem = qtd > 0
          const total = contexto.noites > 0 ? subtotal(o, contexto) : null
          const combina = busca.preferencias.filter((p) => o.categorias.includes(p))

          return (
            <motion.li key={o.id} variants={ITEM_GRADE}>
              <article className={`${css['cartao']} ${naViagem ? css['escolhido'] : ''}`}>
                <Imagem slug={o.foto} className={css['foto']} sizes="120px" />

                <div className={css['corpo']}>
                  <div className={css['linhaTopo']}>
                    <h4 className={css['nome']}>{o.titulo}</h4>
                    <span className={css['nota']}>
                      <Icone nome="estrela" tamanho={10} />
                      {nota(o.nota)}
                    </span>
                  </div>

                  <p className={css['sub']}>{o.sub}</p>

                  <ul className={css['chips']}>
                    {combina.map((c) => (
                      <li key={c} className={`${css['chip']} ${css['chipCombina']}`}>
                        ✓ {c.replace('-', ' ')}
                      </li>
                    ))}
                    {o.chips.slice(0, 2).map((c) => (
                      <li key={c} className={css['chip']}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={css['direita']}>
                  <p className={css['precos']}>
                    <span className={css['antes']}>{moeda(o.outros)}</span>
                    <span className={css['preco']}>
                      {moeda(o.preco)}
                      <span className={css['unidade']}>{SUFIXO[o.unidade]}</span>
                    </span>
                    {total !== null && total !== o.preco ? (
                      <span className={css['naViagem']}>{moeda(total)} na viagem</span>
                    ) : null}
                  </p>

                  {naViagem ? (
                    <div className={css['contador']}>
                      <button
                        type="button"
                        className={css['passo']}
                        aria-label={`Tirar uma unidade de ${o.titulo}`}
                        onClick={() => {
                          remover(o.id)
                        }}
                      >
                        −
                      </button>
                      <span className={css['qtd']} aria-live="polite">
                        {qtd}
                      </span>
                      <button
                        type="button"
                        className={css['passo']}
                        aria-label={`Somar uma unidade de ${o.titulo}`}
                        onClick={() => {
                          adicionar(o)
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={css['adicionar']}
                      onClick={() => {
                        adicionar(o)
                      }}
                    >
                      Escolher
                    </button>
                  )}
                </div>
              </article>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}
