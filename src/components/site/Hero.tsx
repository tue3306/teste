import { Reveal } from '@/components/ui/Reveal'
import { useCountUp } from '@/hooks/useCountUp'
import { ESTATISTICAS } from '@/data/site'
import { inteiro } from '@/lib/format'
import { CartoesFlutuantes } from './CartoesFlutuantes'
import { FormularioBusca } from './FormularioBusca'
import { CATALOGO, DESTINOS } from '@/data/rj'
import css from './Hero.module.css'

export function Hero() {
  return (
    <section id="topo" className={`shell ${css['hero']}`} aria-labelledby="hero-titulo">
      <div>
        <Reveal>
          <p className={css['selo']}>
            <span className={css['pulso']} aria-hidden="true" />
            {CATALOGO.length} opções comparadas em {DESTINOS.length} destinos do RJ
          </p>
        </Reveal>

        <Reveal atraso={0.08}>
          <h1 id="hero-titulo" className={css['titulo']}>
            Voo, hotel e passeio.
            <br />
            <span className="serif">Uma busca só.</span>
          </h1>
        </Reveal>

        <Reveal atraso={0.16}>
          <p className={css['subtitulo']}>
            A BI&amp;B varre companhias aéreas, hospedagens, passeios e restaurantes ao mesmo tempo,
            compara tudo lado a lado e fecha o orçamento da viagem. Melhor preço garantido — ou
            devolvemos a diferença.
          </p>
        </Reveal>

        <Reveal atraso={0.24}>
          <FormularioBusca />
        </Reveal>

        <Reveal atraso={0.32}>
          <dl className={css['estatisticas']}>
            {ESTATISTICAS.map((e) => (
              <Estatistica key={e.label} valor={e.valor} sufixo={e.sufixo} label={e.label} />
            ))}
          </dl>
        </Reveal>
      </div>

      <CartoesFlutuantes />
    </section>
  )
}

/**
 * Número que conta de zero ao entrar na tela.
 *
 * O valor final vai no `aria-label` do grupo: quem usa leitor de tela recebe
 * "34% economia média" de uma vez, sem ouvir a contagem intermediária.
 */
function Estatistica({ valor, sufixo, label }: { valor: number; sufixo: string; label: string }) {
  const { ref, valor: atual } = useCountUp(valor)

  return (
    <div aria-label={`${inteiro(valor)}${sufixo} ${label}`}>
      <dd className={css['numero']} style={{ margin: 0 }}>
        <span ref={ref} aria-hidden="true">
          {inteiro(atual)}
          {sufixo}
        </span>
      </dd>
      <dt className={css['legenda']} aria-hidden="true">
        {label}
      </dt>
    </div>
  )
}
