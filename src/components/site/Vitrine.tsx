import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { Imagem } from '@/components/ui/Imagem'
import { Reveal } from '@/components/ui/Reveal'
import { HOVER_CARTAO, TAP_CARTAO } from '@/lib/motion'
import { HOTEIS } from '@/data/ofertas'
import { desconto, moeda, nota, resumo } from '@/lib/format'
import css from './Vitrine.module.css'

const EM_DESTAQUE = HOTEIS.slice(0, 4)
const ItemMovel = motion.create(Link)

/**
 * Vitrine de hospedagem.
 *
 * Cada cartão é um link para a oferta dentro da plataforma. No protótipo eram
 * `<div>` com `cursor: pointer` e nenhum manipulador — pareciam clicáveis e não
 * eram, nem por mouse nem por teclado.
 */
export function Vitrine() {
  return (
    <section className="shell secao" aria-labelledby="vitrine-titulo">
      <Reveal className={css['topo']}>
        <h2 id="vitrine-titulo" className={css['titulo']}>
          Onde ficar no Rio
        </h2>
        <Botao para="/plataforma/hoteis" variante="secundario">
          Ver todas as opções
          <Icone nome="setaDireita" tamanho={16} />
        </Botao>
      </Reveal>

      <ul className={css['grade']}>
        {EM_DESTAQUE.map((h, i) => (
          <Reveal key={h.id} como="li" atraso={i * 0.06}>
            <ItemMovel
              to={`/plataforma/hoteis?oferta=${h.id}`}
              className={css['item']}
              whileHover={HOVER_CARTAO}
              whileTap={TAP_CARTAO}
            >
              <div className={css['moldura']}>
                <Imagem
                  slug={h.foto}
                  className={css['foto']}
                  sizes="(min-width: 1060px) 300px, (min-width: 720px) 46vw, 92vw"
                  zoom
                  veu
                />
                <span
                  className={css['selo']}
                  style={{ color: h.tag === 'Mais barato' ? 'var(--teal-text)' : 'var(--coral-text)' }}
                >
                  {h.tag}
                </span>
              </div>
              <div className={css['cabecalho']}>
                <span className={css['nome']}>{h.titulo}</span>
                <span className={css['nota']}>
                  <Icone nome="estrela" tamanho={12} />
                  <span className="sr-only">nota </span>
                  {nota(h.nota)}
                </span>
              </div>
              <p className={css['local']}>{resumo(h.sub)}</p>
              <p className={css['precos']}>
                <span className={css['preco']}>{moeda(h.preco)} /noite</span>
                <span className={css['antes']}>
                  <span className="sr-only">preço médio do mercado: </span>
                  {moeda(h.outros)}
                </span>
                <span className={css['economia']}>{desconto(h.preco, h.outros)}</span>
              </p>
            </ItemMovel>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
