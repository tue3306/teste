import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Imagem } from '@/components/ui/Imagem'
import { Reveal } from '@/components/ui/Reveal'
import { DESTINOS, NOMES_REGIAO, contarPorVertical } from '@/data/rj'
import { HOVER_CARTAO, TAP_CARTAO } from '@/lib/motion'
import css from './SecaoDestinos.module.css'

const CartaoMovel = motion.create(Link)

/** Larguras candidatas por breakpoint — 1, 2 ou 5 colunas dentro da faixa. */
const SIZES = '(min-width: 1140px) 246px, (min-width: 600px) 46vw, 92vw'

/**
 * Destinos cobertos pela BI&B.
 *
 * Todos os 29 têm inventário — não há mais cartão "em breve" prometendo o que
 * não existe. A vitrine mostra os doze primeiros; a lista inteira, com filtro
 * por região e por perfil, vive na plataforma.
 */
const VITRINE = DESTINOS.slice(0, 12)

export function SecaoDestinos() {

  return (
    <section id="destinos" className="shell secao" aria-labelledby="destinos-titulo">
      <Reveal className={css['topo']}>
        <div style={{ maxWidth: 620 }}>
          <p className="eyebrow">estado do rio de janeiro</p>
          <h2 id="destinos-titulo" className="titulo">
            {DESTINOS.length} destinos,
            <br />
            <span className="serif">um jeito só de planejar.</span>
          </h2>
        </div>
        <p className="lead" style={{ maxWidth: 340, fontSize: '1rem' }}>
          Da Costa Verde ao Norte Fluminense, com hospedagem, passeios,
          restaurantes, eventos e carro em cada um.
        </p>
      </Reveal>

      <ul className={css['grade']}>
        {VITRINE.map((d, i) => {
          const conta = contarPorVertical(d.id)
          const opcoes = Object.values(conta).reduce((s, n) => s + n, 0)

          return (
            <Reveal key={d.id} como="li" atraso={Math.min(i, 6) * 0.05}>
              <CartaoMovel
                to={`/plataforma/destinos?destino=${d.id}`}
                className={`${css['item']} ${css['clicavel']}`}
                aria-label={`${d.nome} — ver na plataforma`}
                whileHover={HOVER_CARTAO}
                whileTap={TAP_CARTAO}
              >
                <Imagem slug={d.foto} className={css['foto']} sizes={SIZES} zoom />
                <span className={css['selo']}>{opcoes} opções</span>
                <span className={css['conteudo']}>
                  <span className={css['nome']}>
                    {d.nome}
                    <span className={css['uf']}>{NOMES_REGIAO[d.regiao]}</span>
                  </span>
                  <span className={css['chamada']}>{d.chamada}</span>
                  <span className={css['epoca']}>
                    {d.distanciaKm === 0 ? 'na capital' : `${String(d.distanciaKm)} km · ${d.tempoViagem}`}
                  </span>
                </span>
              </CartaoMovel>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
