import { Botao } from '@/components/ui/Botao'
import { Reveal } from '@/components/ui/Reveal'
import { DIFERENCIAIS_SOCIAL, VIAJANTES, type Viajante } from '@/data/site'
import css from './SecaoSocial.module.css'

/** Cor do avatar por tipo de coincidência — a mesma família do selo. */
const COR_AVATAR: Record<Viajante['tipo'], string> = {
  voo: 'var(--teal-strong)',
  hotel: 'var(--coral-strong)',
  passeio: '#5b8239',
  evento: 'var(--ink)',
}

const CLASSE_SELO: Record<Viajante['tipo'], string> = {
  voo: 'tipoVoo',
  hotel: 'tipoHotel',
  passeio: 'tipoPasseio',
  evento: 'tipoEvento',
}

/**
 * Seção de viagem em grupo.
 *
 * Antes era uma grade cinza com três bolinhas piscando, que não comunicava
 * nada: parecia um mapa quebrado. Como o produto aqui é encontrar gente indo
 * para o mesmo lugar, são as pessoas que precisam aparecer — com o que coincide
 * com a sua viagem, o que elas curtem e se o perfil foi conferido.
 */
export function SecaoSocial() {
  return (
    <section id="grupos" className="shell secao" aria-labelledby="social-titulo">
      <div className={css['grade']}>
        <Reveal className={css['painel']}>
          <div className={css['painelTopo']}>
            <h3 className="rotulo">quem mais vai estar no Rio</h3>
            <span className={css['contagem']}>12–19 set · 34 pessoas</span>
          </div>

          <ul className={css['lista']}>
            {VIAJANTES.map((v) => (
              <li key={v.id} className={css['viajante']}>
                <span className={css['avatar']} style={{ background: COR_AVATAR[v.tipo] }} aria-hidden="true">
                  {v.iniciais}
                </span>

                <div className={css['corpo']}>
                  <div className={css['linhaNome']}>
                    <span className={css['nome']}>{v.nome}</span>
                    {v.verificado ? (
                      <span className={css['verificado']}>
                        <span aria-hidden="true">✓</span> perfil verificado
                      </span>
                    ) : null}
                  </div>
                  <p className={css['origem']}>{v.origem}</p>
                  <p className={`${css['coincidencia']} ${css[CLASSE_SELO[v.tipo]]}`}>
                    {v.coincidencia}
                  </p>
                  <ul className={css['interesses']}>
                    {v.interesses.map((i) => (
                      <li key={i} className={css['interesse']}>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <div className={css['grupo']}>
            <div>
              <p className={css['grupoTexto']}>7 viajantes vão dividir o Uber do aeroporto</p>
              <p className={css['grupoSub']}>Mesmo voo · GRU → SDU · 12 set, 07:25</p>
            </div>
            <Botao para="/plataforma/dashboard" tamanho="sm">
              Entrar no grupo
            </Botao>
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
            Crie grupos, divida corrida e hospedagem, troque dicas.
          </p>
          <ul className={css['lista2']}>
            {DIFERENCIAIS_SOCIAL.map((d) => (
              <li key={d} className={css['item']}>
                <span className={css['marcador']} aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
          <p className={css['aviso']}>
            O modo invisível é o padrão: ninguém vê que você está indo até que você decida
            aparecer. Você escolhe o que mostrar — e para quem.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
