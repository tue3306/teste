import { Reveal } from '@/components/ui/Reveal'
import { useCountUp } from '@/hooks/useCountUp'
import { useTilt } from '@/hooks/useTilt'
import { VERTICAIS_BUSCADAS } from '@/data/site'
import css from './Bento.module.css'

const CARTOES = [
  {
    titulo: 'Roteiro em timeline',
    texto:
      'Dias, horários, deslocamentos e custo previsto. Reordene as paradas e a IA recalcula o trajeto.',
    atraso: 0.05,
  },
  {
    titulo: 'Preço final, sempre',
    texto:
      'Taxa de serviço, limpeza e cancelamento aparecem antes do checkout. Nada de valor que cresce no fim.',
    atraso: 0.12,
  },
]

/**
 * Grade "tudo em um lugar".
 *
 * A promessa do cartão de roteiro mudou de "Arraste para reorganizar" para
 * "Reordene as paradas": a plataforma reordena por botões, que funcionam no
 * toque e no teclado. Prometer arrasto e entregar outra coisa seria uma
 * promessa quebrada na primeira tentativa.
 */
export function Bento() {
  const refDestaque = useTilt<HTMLDivElement>()
  const { ref: refContador, valor } = useCountUp(34)

  return (
    <section id="tudo" className="shell secao" aria-labelledby="bento-titulo">
      <Reveal style={{ maxWidth: 680 }}>
        <p className="eyebrow">01 — tudo em um lugar</p>
        <h2 id="bento-titulo" className="titulo">
          Doze abas abertas viram
          <br />
          <span className="serif">uma tela só.</span>
        </h2>
      </Reveal>

      <div className={css['grade']}>
        <Reveal className={`${css['cartao']} ${css['destaque']}`}>
          <div ref={refDestaque} className="tilt">
            <h3 className={css['tituloCartao']}>Busca simultânea</h3>
            <p className={css['texto']}>
              Uma consulta dispara voos, hospedagem, passeios, restaurantes, eventos, carro e seguro
              ao mesmo tempo. Os resultados chegam ranqueados por custo-benefício real, não por
              comissão.
            </p>
            <ul className={css['chips']}>
              {VERTICAIS_BUSCADAS.map((v) => (
                <li key={v} className={css['chip']}>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal atraso={0.1} className={`${css['cartao']} ${css['preco']}`}>
          <h3 className={css['tituloCartao']}>Melhor preço garantido</h3>
          <div>
            <p className={css['percentual']} aria-label="34% de economia média">
              <span ref={refContador} aria-hidden="true">
                −{valor}%
              </span>
            </p>
            <p className={css['texto']} style={{ marginTop: 10 }}>
              Achou mais barato em outro lugar em até 24h? Devolvemos a diferença em crédito.
            </p>
          </div>
        </Reveal>

        {CARTOES.map((c) => (
          <Reveal key={c.titulo} atraso={c.atraso} className={css['cartao']}>
            <h3 className={css['tituloMenor']}>{c.titulo}</h3>
            <p className={css['texto']}>{c.texto}</p>
          </Reveal>
        ))}

        <Reveal atraso={0.18} className={`${css['cartao']} ${css['bia']}`}>
          <h3 className={css['tituloMenor']}>Bia, sua copiloto</h3>
          <p className={css['texto']}>
            Pergunte em português. Ela remonta a viagem inteira, com preço atualizado, em segundos.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
