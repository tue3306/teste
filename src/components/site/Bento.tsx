import { Reveal } from '@/components/ui/Reveal'
import { useCountUp } from '@/hooks/useCountUp'
import { useTilt } from '@/hooks/useTilt'
import { VERTICAIS_BUSCADAS } from '@/data/site'
import css from './Bento.module.css'

const CARTOES = [
  {
    titulo: 'Orçamento que fecha',
    texto:
      'Diária × noites, passagem × passageiros, carro × dias. Trocou uma escolha, o total se refaz na hora.',
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
 * Cada cartão descreve algo que a plataforma faz de fato. A versão anterior
 * prometia roteiro gerado por IA e uma assistente que "remonta a viagem em
 * segundos" — nada disso existia, e prometer o que não se entrega é a forma
 * mais rápida de perder quem clicou.
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
          <h3 className={css['tituloMenor']}>29 destinos do RJ</h3>
          <p className={css['texto']}>
            Da Costa Verde ao Norte Fluminense, com hospedagem, passeio, restaurante, evento e carro
            em cada um — e destinos vizinhos para combinar duas cidades numa viagem.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
