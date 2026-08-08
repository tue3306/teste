import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { Reveal } from '@/components/ui/Reveal'
import { DIA_DESTAQUE } from '@/data/roteiro'
import css from './SecaoRoteiro.module.css'

const INTERESSES = ['Gastronomia', 'Natureza', 'Vida noturna', 'Cultura', 'Casal']

/**
 * Seção "roteiro inteligente".
 *
 * O cabeçalho da prévia é montado a partir do dia em destaque. No protótipo
 * estava escrito "dia 3 · quinta · 28°C sol" — mas o dia 3 do roteiro é quarta.
 */
export function SecaoRoteiro() {
  return (
    <section id="roteiro" className="shell secao" aria-labelledby="roteiro-titulo">
      <div className={css['grade']}>
        <Reveal>
          <p className="eyebrow">03 — roteiro inteligente</p>
          <h2 id="roteiro-titulo" className="titulo">
            Sete dias no Rio,
            <br />
            <span className="serif">montados em 11 segundos.</span>
          </h2>
          <p className="lead" style={{ marginBlockStart: 20, maxWidth: 460 }}>
            A IA cruza clima, distância, horário de funcionamento, fila e seu orçamento. Praia quando
            o sol colabora, museu quando chove, jantar perto de onde você já está.
          </p>

          <ul className={css['etiquetas']}>
            {INTERESSES.map((t, i) => (
              <li key={t} className={`${css['etiqueta']} ${i === 0 ? css['etiquetaAtiva'] : ''}`}>
                {t}
              </li>
            ))}
          </ul>

          <div className={css['acao']}>
            <Botao para="/plataforma/roteiro" variante="escuro" tamanho="lg">
              Ver o roteiro completo
              <Icone nome="setaDireita" tamanho={17} />
            </Botao>
          </div>
        </Reveal>

        <Reveal atraso={0.12} className={css['cartao']}>
          <div className={css['cartaoTopo']}>
            <p className={css['dia']}>
              dia {DIA_DESTAQUE.n} · {DIA_DESTAQUE.diaLongo} · {DIA_DESTAQUE.clima}
            </p>
            <p className={css['custo']}>{DIA_DESTAQUE.total} previstos</p>
          </div>

          <ol>
            {DIA_DESTAQUE.itens.map((it) => (
              <li key={`${it.hora}-${it.titulo}`} className={css['linha']}>
                <span className={css['hora']}>{it.hora}</span>
                <div className={css['parada']}>
                  <div className={css['paradaTopo']}>
                    <span className={css['paradaNome']}>{it.titulo}</span>
                    <span className={css['paradaCusto']}>{it.custo}</span>
                  </div>
                  <p className={css['paradaLocal']}>{it.local}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
