import { useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { useViagem } from '@/context/ViagemContext'
import { DESTINO_ATUAL } from '@/data/destinos'
import { Previsao } from './Previsao'
import css from './VisaoRoteiro.module.css'

/**
 * Roteiro dia a dia.
 *
 * As paradas se reordenam por botões "subir"/"descer". A escolha é deliberada:
 * arrastar com o ponteiro exclui quem usa teclado e é impreciso no toque,
 * enquanto dois botões funcionam nos três casos e são anunciados corretamente.
 * Cada movimento é confirmado numa região `aria-live`, porque quem não enxerga
 * a lista precisa ouvir que a ordem mudou.
 */
export function VisaoRoteiro() {
  const { roteiro, moverParada, restaurarRoteiro } = useViagem()
  const [diaAtivo, setDiaAtivo] = useState(3)
  const [anuncio, setAnuncio] = useState('')

  const dia = roteiro.find((d) => d.n === diaAtivo) ?? roteiro[0]
  if (!dia) return null

  function mover(indice: number, direcao: -1 | 1) {
    if (!dia) return
    const parada = dia.itens[indice]
    if (!parada) return

    moverParada(dia.n, indice, direcao)
    setAnuncio(
      `${parada.titulo} movido para a posição ${String(indice + direcao + 1)} de ${String(dia.itens.length)}.`,
    )
  }

  return (
    <div>
      <div className={css['dias']} role="group" aria-label="Escolher o dia do roteiro">
        {roteiro.map((d) => (
          <button
            key={d.n}
            type="button"
            className={`${css['dia']} ${d.n === diaAtivo ? css['diaAtivo'] : ''}`}
            aria-pressed={d.n === diaAtivo}
            onClick={() => {
              setDiaAtivo(d.n)
            }}
          >
            <span className={css['diaN']}>dia {d.n}</span>
            <span className={css['diaNome']} style={{ display: 'block' }}>
              {d.dia}
            </span>
            <span className={css['diaClima']} style={{ display: 'block' }}>
              {d.clima}
            </span>
          </button>
        ))}
      </div>

      <div className={css['grade']}>
        <section className={css['timeline']} aria-label={`Programação do dia ${String(dia.n)}`}>
          <div className={css['timelineTopo']}>
            <h2 className={css['timelineTitulo']}>{dia.titulo}</h2>
            <p className={css['timelineTotal']}>{dia.total}</p>
          </div>

          <ol>
            {dia.itens.map((it, i) => (
              <li key={`${it.hora}-${it.titulo}`} className={css['linha']}>
                <span className={css['hora']}>{it.hora}</span>
                <div className={css['parada']}>
                  <div className={css['paradaTopo']}>
                    <span className={css['paradaNome']}>{it.titulo}</span>
                    <span className={css['paradaCusto']}>{it.custo}</span>
                  </div>
                  <div className={css['paradaBase']}>
                    <span className={css['paradaLocal']}>{it.local}</span>
                    <span className={css['tipo']}>{it.tipo}</span>
                    <span className={css['mover']}>
                      <button
                        type="button"
                        className={css['botaoMover']}
                        disabled={i === 0}
                        onClick={() => {
                          mover(i, -1)
                        }}
                        aria-label={`Mover ${it.titulo} para cima`}
                      >
                        <Icone nome="setaCima" tamanho={15} />
                      </button>
                      <button
                        type="button"
                        className={css['botaoMover']}
                        disabled={i === dia.itens.length - 1}
                        onClick={() => {
                          mover(i, 1)
                        }}
                        aria-label={`Mover ${it.titulo} para baixo`}
                      >
                        <Icone nome="setaBaixo" tamanho={15} />
                      </button>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p aria-live="polite" className="sr-only">
            {anuncio}
          </p>
        </section>

        <div className={css['lateral']}>
          <Previsao
            latitude={DESTINO_ATUAL.latitude}
            longitude={DESTINO_ATUAL.longitude}
            destino={DESTINO_ATUAL.nome}
          />

          <div className={css['dica']}>
            <h3 className="rotulo">bia sugere</h3>
            <p className={css['dicaTexto']}>{dia.dica}</p>
            <div style={{ marginBlockStart: 14 }}>
              <Botao para="/plataforma/bia" variante="secundario" tamanho="sm" quadrado>
                Ajustar com a Bia
              </Botao>
            </div>
          </div>

          <div className={css['deslocamento']}>
            <h3 className="rotulo">deslocamento do dia</h3>
            <p className={css['km']}>{dia.km}</p>
            <p className={css['transporte']}>{dia.transporte}</p>
          </div>

          <div className={css['restaurar']}>
            <Botao
              variante="secundario"
              tamanho="sm"
              bloco
              quadrado
              onClick={() => {
                restaurarRoteiro()
                setAnuncio('Roteiro restaurado para a versão gerada pela IA.')
              }}
            >
              Restaurar roteiro da IA
            </Botao>
          </div>
        </div>
      </div>
    </div>
  )
}
