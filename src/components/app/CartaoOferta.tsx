import { motion } from 'motion/react'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { useViagem } from '@/context/ViagemContext'
import { economia, inteiro, moeda, nota } from '@/lib/format'
import { subtotal } from '@/lib/orcamento'
import type { Oferta } from '@/types'
import css from './CartaoOferta.module.css'

interface Props {
  oferta: Oferta
  /** Cartão apontado pela URL (`?item=`), vindo da vitrine do site. */
  destacado?: boolean
  /** Abre o detalhe completo do item. */
  aoAbrir: (oferta: Oferta) => void
  /** Nota de custo-benefício de 0 a 100, dentro da lista comparada. */
  custoBeneficio?: number
}

/** Sufixo que explica a unidade do preço, no próprio cartão. */
const SUFIXO = {
  pessoa: '/pessoa',
  noite: '/noite',
  dia: '/dia',
  unico: '',
} as const

export function CartaoOferta({ oferta, destacado = false, aoAbrir, custoBeneficio }: Props) {
  const { ehFavorito, alternarFavorito, adicionar, remover, quantidade, contexto } = useViagem()

  const salvo = ehFavorito(oferta.id)
  const qtd = quantidade(oferta.id)
  const naViagem = qtd > 0

  /**
   * O que este item custa na viagem inteira, e não só na etiqueta.
   *
   * É a informação que falta em toda plataforma de viagem: "R$ 890 a diária"
   * não diz nada até virar "R$ 4.450 pelas cinco noites". Só aparece quando há
   * datas escolhidas — sem elas o multiplicador é zero e o número seria falso.
   */
  const total = contexto.noites > 0 ? subtotal(oferta, contexto) : null
  const mostraTotal = total !== null && total !== oferta.preco

  return (
    /**
     * `layout` faz o cartão deslizar até a nova posição quando a ordenação ou o
     * filtro muda, em vez de a lista pular de um arranjo para outro. É o tipo de
     * continuidade que o CSS sozinho não dá: só o Motion conhece a posição
     * antiga e a nova.
     */
    <motion.article
      layout
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className={`${css['cartao']} ${destacado ? css['destacado'] : ''} ${naViagem ? css['escolhido'] : ''}`}
      aria-labelledby={`item-${oferta.id}`}
    >
      <Imagem
        slug={oferta.foto}
        className={css['foto']}
        sizes="(min-width: 1180px) 184px, (min-width: 940px) 150px, 100vw"
        zoom
      />

      <div className={css['miolo']}>
        <div>
          <div className={css['titulo']}>
            <h3 id={`item-${oferta.id}`} className={css['nome']}>
              <button type="button" className={css['abrir']} onClick={() => { aoAbrir(oferta) }}>
                {oferta.titulo}
              </button>
            </h3>
            <span className={css['selo']}>{oferta.tag}</span>
            {naViagem ? (
              <span className={`${css['selo']} ${css['seloReservado']}`}>
                Na viagem{qtd > 1 ? ` · ${String(qtd)}×` : ''}
              </span>
            ) : null}
          </div>
          <p className={css['sub']}>{oferta.sub}</p>
        </div>

        <ul className={css['chips']}>
          {oferta.chips.map((c) => (
            <li key={c} className={css['chip']}>
              {c}
            </li>
          ))}
          {custoBeneficio !== undefined && custoBeneficio >= 80 ? (
            <li className={`${css['chip']} ${css['chipDestaque']}`}>Melhor custo-benefício</li>
          ) : null}
        </ul>
      </div>

      <div className={css['lateral']}>
        <p className={css['avaliacao']}>
          <span className={css['avaliacoes']}>
            {oferta.avaliacoes ? `${inteiro(oferta.avaliacoes)} avaliações` : 'nota BI&B'}
          </span>
          <span className={css['nota']}>
            <Icone nome="estrela" tamanho={12} />
            <span className="sr-only">nota </span>
            {nota(oferta.nota)}
          </span>
        </p>

        <p className={css['precos']}>
          <span className={css['antes']}>
            <span className="sr-only">preço médio do mercado: </span>
            {moeda(oferta.outros)}
          </span>
          <br />
          <span className={css['preco']}>
            {moeda(oferta.preco)}
            <span className={css['unidade']}>{SUFIXO[oferta.unidade]}</span>
          </span>
          <br />
          <span className={css['economia']}>{economia(oferta.preco, oferta.outros)}</span>
        </p>

        {mostraTotal ? (
          <p className={css['totalViagem']}>
            <span className={css['totalRotulo']}>na sua viagem</span>
            <span className={css['totalValor']}>{moeda(total)}</span>
          </p>
        ) : null}

        <div className={css['acoes']}>
          <button
            type="button"
            className={`${css['favorito']} ${salvo ? css['favoritoAtivo'] : ''}`}
            aria-pressed={salvo}
            aria-label={salvo ? `Tirar ${oferta.titulo} dos salvos` : `Salvar ${oferta.titulo}`}
            onClick={() => {
              alternarFavorito(oferta.id)
            }}
          >
            {salvo ? 'Salvo ✓' : 'Salvar'}
          </button>

          {/*
            Um controle que muda de forma conforme o estado: quem não escolheu vê
            "Adicionar"; quem já escolheu vê o contador com − e +. Um botão só
            que alterna esconderia a quantidade, e a quantidade é o que faz o
            total mudar.
          */}
          {naViagem ? (
            <div className={css['contador']}>
              <button
                type="button"
                className={css['passo']}
                aria-label={`Tirar uma unidade de ${oferta.titulo}`}
                onClick={() => {
                  remover(oferta.id)
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
                aria-label={`Somar uma unidade de ${oferta.titulo}`}
                onClick={() => {
                  adicionar(oferta)
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
                adicionar(oferta)
              }}
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
