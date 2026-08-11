import { useCallback } from 'react'
import { Esqueleto } from '@/components/ui/Esqueleto'
import { useRecurso } from '@/hooks/useRecurso'
import { buscarPrevisao } from '@/services/clima'
import css from './Previsao.module.css'

interface Props {
  latitude: number
  longitude: number
  /** Nome do destino, para o texto acessível. */
  destino: string
  dias?: number
}

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

/**
 * Previsão real do destino, via Open-Meteo.
 *
 * É o único ponto do produto que mostra dado ao vivo de terceiro, então trata
 * os três estados por completo: carregando (esqueleto do tamanho final), pronto
 * e falha. Numa falha a seção some em silêncio em vez de mostrar erro — clima é
 * complemento, não pode atrapalhar quem está montando a viagem.
 */
export function Previsao({ latitude, longitude, destino, dias = 7 }: Props) {
  // A identidade desta função é a chave da busca: ela só muda quando as
  // coordenadas ou o número de dias mudam, e é aí que vale refazer a chamada.
  const buscar = useCallback(
    (sinal: AbortSignal) => buscarPrevisao(latitude, longitude, dias, sinal),
    [latitude, longitude, dias],
  )
  const estado = useRecurso(buscar)

  if (estado.status === 'erro' && !estado.dados) return null
  if (estado.status === 'pronto' && estado.dados.length === 0) return null

  const previsao = estado.dados

  return (
    <section className={css['painel']} aria-live="polite" aria-busy={estado.status === 'carregando'}>
      <div className={css['topo']}>
        <h3 className="rotulo">previsão · {destino}</h3>
        <span className={css['fonte']}>Open-Meteo</span>
      </div>

      {previsao ? (
        <ol className={css['lista']}>
          {previsao.map((d, i) => {
            // `data` vem como AAAA-MM-DD; o T12:00 evita que o fuso jogue o dia
            // para trás ao converter, que é o clássico "segunda virou domingo".
            const quando = new Date(`${d.data}T12:00:00`)
            return (
              <li key={d.data} className={`${css['dia']} ${i === 0 ? css['diaAtivo'] : ''}`}>
                <div className={css['rotulo']}>
                  {i === 0 ? 'hoje' : DIAS_SEMANA[quando.getDay()]}
                </div>
                <div className={css['icone']} aria-hidden="true">
                  {d.icone}
                </div>
                <div className={css['max']}>{d.maxima}°</div>
                <div className={css['min']}>{d.minima}°</div>
                {d.chuva >= 30 ? <div className={css['chuva']}>{d.chuva}%</div> : null}
                <span className="sr-only">
                  {d.condicao}, máxima de {d.maxima} graus, mínima de {d.minima}, {d.chuva}% de
                  chance de chuva
                </span>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className={css['lista']}>
          {Array.from({ length: dias }, (_, i) => (
            <Esqueleto key={i} largura={54} altura={92} raio="var(--r-md)" />
          ))}
          <span className="sr-only">Carregando a previsão do tempo</span>
        </div>
      )}

      <p className={css['aviso']}>
        Dados do Open-Meteo, atualizados a cada hora. Use a previsão para escolher entre praia
        por museu nos dias de chuva.
      </p>
    </section>
  )
}
