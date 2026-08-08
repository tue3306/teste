import { motion } from 'motion/react'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { useViagem } from '@/context/ViagemContext'
import { economia, inteiro, moeda, nota } from '@/lib/format'
import type { Oferta } from '@/types'
import css from './CartaoOferta.module.css'

interface Props {
  oferta: Oferta
  /** Cartão apontado pela URL (`?oferta=`), vindo da vitrine do site. */
  destacado?: boolean
  aoReservar: (oferta: Oferta) => void
}

export function CartaoOferta({ oferta, destacado = false, aoReservar }: Props) {
  const { ehFavorito, alternarFavorito, ehReservada } = useViagem()
  const salvo = ehFavorito(oferta.id)
  const reservada = ehReservada(oferta.id)

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
      className={`${css['cartao']} ${destacado ? css['destacado'] : ''}`}
      aria-labelledby={`oferta-${oferta.id}`}
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
            <h3 id={`oferta-${oferta.id}`} className={css['nome']}>
              {oferta.titulo}
            </h3>
            <span className={css['selo']}>{oferta.tag}</span>
            {reservada ? (
              <span className={`${css['selo']} ${css['seloReservado']}`}>Reservado</span>
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
          <span className={css['preco']}>{moeda(oferta.preco)}</span>
          <br />
          <span className={css['economia']}>{economia(oferta.preco, oferta.outros)}</span>
        </p>

        <div className={css['acoes']}>
          <button
            type="button"
            className={`${css['favorito']} ${salvo ? css['favoritoAtivo'] : ''}`}
            aria-pressed={salvo}
            onClick={() => {
              alternarFavorito(oferta.id)
            }}
          >
            {salvo ? 'Salvo ✓' : 'Salvar'}
          </button>
          <Botao
            variante="escuro"
            tamanho="sm"
            quadrado
            onClick={() => {
              aoReservar(oferta)
            }}
          >
            {reservada ? 'Ver reserva' : 'Reservar'}
          </Botao>
        </div>
      </div>
    </motion.article>
  )
}
