import { Link } from 'react-router-dom'
import { Imagem } from '@/components/ui/Imagem'
import { Reveal } from '@/components/ui/Reveal'
import { DESTINOS, DESTINOS_ATIVOS } from '@/data/destinos'
import css from './SecaoDestinos.module.css'

/** Larguras candidatas por breakpoint — 1, 2 ou 5 colunas dentro da faixa. */
const SIZES = '(min-width: 1140px) 246px, (min-width: 600px) 46vw, 92vw'

/**
 * Destinos cobertos pela BI&B.
 *
 * Os que já têm inventário viram link para a plataforma; os demais aparecem
 * como "em breve" — o mesmo tratamento honesto que o rodapé dá a São Paulo e
 * Salvador. Prometer resultado que não existe é o tipo de coisa que só se
 * descobre no clique.
 */
export function SecaoDestinos() {
  const ativos = DESTINOS_ATIVOS.length

  return (
    <section id="destinos" className="shell secao" aria-labelledby="destinos-titulo">
      <Reveal className={css['topo']}>
        <div style={{ maxWidth: 620 }}>
          <p className="eyebrow">o brasil inteiro</p>
          <h2 id="destinos-titulo" className="titulo">
            Dez destinos,
            <br />
            <span className="serif">um jeito só de planejar.</span>
          </h2>
        </div>
        <p className="lead" style={{ maxWidth: 340, fontSize: '1rem' }}>
          {ativos === 1
            ? 'O Rio já está no ar com inventário completo. Os outros nove entram ao longo do ano.'
            : `${String(ativos)} destinos com inventário completo. Os demais entram ao longo do ano.`}
        </p>
      </Reveal>

      <ul className={css['grade']}>
        {DESTINOS.map((d, i) => {
          const interno = (
            <>
              <Imagem slug={d.foto} className={css['foto']} sizes={SIZES} zoom />
              <span className={`${css['selo']} ${d.disponivel ? '' : css['seloEmBreve']}`}>
                {d.disponivel ? 'no ar' : 'em breve'}
              </span>
              <span className={css['conteudo']}>
                <span className={css['nome']}>
                  {d.nome}
                  <span className={css['uf']}>{d.uf}</span>
                </span>
                <span className={css['chamada']}>{d.chamada}</span>
                <span className={css['epoca']}>melhor época · {d.epoca}</span>
              </span>
            </>
          )

          return (
            <Reveal key={d.id} como="li" atraso={Math.min(i, 6) * 0.05}>
              {d.disponivel ? (
                <Link
                  to="/plataforma/hoteis"
                  className={`${css['item']} ${css['clicavel']}`}
                  aria-label={`${d.nome}, ${d.uf} — abrir na plataforma`}
                >
                  {interno}
                </Link>
              ) : (
                /* Sem hover de elevação: levantar um cartão "em breve"
                   prometeria uma interação que não existe. */
                <div className={css['item']}>{interno}</div>
              )}
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
