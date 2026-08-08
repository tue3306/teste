import { Botao } from '@/components/ui/Botao'
import { Reveal } from '@/components/ui/Reveal'
import { DIFERENCIAIS_SOCIAL } from '@/data/site'
import css from './SecaoSocial.module.css'

const PONTOS = [
  { top: '22%', left: '18%', cor: 'var(--teal)', atraso: '0s' },
  { top: '52%', left: '44%', cor: 'var(--coral)', atraso: '0.7s' },
  { top: '34%', left: '70%', cor: 'var(--teal)', atraso: '1.4s' },
]

/**
 * Seção de viagem em grupo.
 *
 * O "Entrar" do cartão era um `<span>` pintado de botão: não recebia foco, não
 * respondia a Enter e não existia para leitor de tela. Agora é um botão de
 * verdade que leva para a plataforma.
 */
export function SecaoSocial() {
  return (
    <section className="shell secao" aria-labelledby="social-titulo">
      <div className={css['grade']}>
        <Reveal className={css['mapa']}>
          <div className={css['malha']} aria-hidden="true" />
          {PONTOS.map((p) => (
            <span
              key={p.left}
              className={css['ponto']}
              style={{
                top: p.top,
                left: p.left,
                background: p.cor,
                boxShadow: `0 0 0 9px color-mix(in srgb, ${p.cor} 16%, transparent)`,
                animationDelay: p.atraso,
              }}
              aria-hidden="true"
            />
          ))}

          <div className={css['cartaoGrupo']}>
            <p className={css['voo']}>mesmo voo · GRU → SDU · 12 set</p>
            <div className={css['grupoLinha']}>
              <p className={css['grupoTexto']}>7 viajantes toparam dividir o Uber do aeroporto</p>
              <Botao para="/plataforma/dashboard" tamanho="sm">
                Entrar no grupo
              </Botao>
            </div>
          </div>
        </Reveal>

        <Reveal atraso={0.1}>
          <p className="eyebrow">05 — companhia</p>
          <h2 id="social-titulo" className="titulo">
            Quem mais vai
            <br />
            <span className="serif">estar lá.</span>
          </h2>
          <p className="lead" style={{ marginBlockStart: 20, maxWidth: 440 }}>
            Descubra pessoas indo para o mesmo destino, no mesmo período, no mesmo voo ou evento.
            Crie grupos, divida corrida e hospedagem, troque roteiros. Você controla o que aparece —
            o modo invisível é o padrão.
          </p>
          <ul className={css['lista']}>
            {DIFERENCIAIS_SOCIAL.map((d) => (
              <li key={d} className={css['item']}>
                <span className={css['marcador']} aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
