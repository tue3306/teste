import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Imagem } from '@/components/ui/Imagem'
import { Icone } from '@/components/ui/Icone'
import { Mapa, type PontoMapa } from '@/components/ui/Mapa'
import { Previsao } from './Previsao'
import { DESTINOS, NOMES_REGIAO, contarPorVertical } from '@/data/rj'
import { useViagem } from '@/context/ViagemContext'
import { moeda, nota } from '@/lib/format'
import type { RegiaoRJ } from '@/types'
import css from './VisaoMapa.module.css'

/**
 * Uma cor por região.
 *
 * O mapa com 29 alfinetes iguais não diz nada; com a cor da região, a geografia
 * do estado aparece sozinha — o azul se agrupa no litoral leste, o verde na
 * serra. As cores saem dos tokens da marca, não de uma paleta avulsa.
 */
const COR_REGIAO: Record<RegiaoRJ, string> = {
  metropolitana: '#0f766e',
  'costa-do-sol': '#0ea5b5',
  'costa-verde': '#3f8f4f',
  serrana: '#7c5cbf',
  'norte-fluminense': '#e0663f',
}

/**
 * Mapa do estado.
 *
 * O protótipo tinha uma grade desenhada em CSS com bolinhas posicionadas em
 * porcentagem — sem relação nenhuma com a geografia real. Aqui as 29
 * coordenadas são as verdadeiras, e escolher um alfinete troca o destino da
 * viagem inteira.
 */
export function VisaoMapa() {
  const { destino, definirBusca } = useViagem()
  const navegar = useNavigate()
  const [ativo, setAtivo] = useState(destino.id)

  const pontos = useMemo<PontoMapa[]>(
    () =>
      DESTINOS.map((d) => ({
        id: d.id,
        nome: d.nome,
        latitude: d.latitude,
        longitude: d.longitude,
        cor: COR_REGIAO[d.regiao],
      })),
    [],
  )

  const escolhido = DESTINOS.find((d) => d.id === ativo) ?? destino
  const conta = contarPorVertical(escolhido.id)

  return (
    <div className={css['grade']}>
      <div className={css['coluna']}>
        <div className={css['moldura']}>
          <Mapa
            pontos={pontos}
            ativo={ativo}
            aoEscolher={setAtivo}
            rotulo="Mapa dos 29 destinos do estado do Rio de Janeiro"
          />
        </div>

        <ul className={css['legenda']}>
          {(Object.keys(NOMES_REGIAO) as RegiaoRJ[]).map((r) => (
            <li key={r} className={css['legendaItem']}>
              <span className={css['bolinha']} style={{ background: COR_REGIAO[r] }} />
              {NOMES_REGIAO[r]}
            </li>
          ))}
        </ul>
      </div>

      <aside className={css['detalhe']} aria-live="polite">
        <Imagem slug={escolhido.foto} className={css['foto']} sizes="(min-width: 940px) 360px, 92vw" />

        <h3 className={css['nome']}>{escolhido.nome}</h3>
        <p className={css['sub']}>
          {NOMES_REGIAO[escolhido.regiao]} ·{' '}
          <span className={css['notaLinha']}>
            <Icone nome="estrela" tamanho={11} />
            {nota(escolhido.nota)}
          </span>
        </p>

        <p className={css['chamada']}>{escolhido.chamada}</p>

        <dl className={css['fatos']}>
          <div>
            <dt>Distância do Rio</dt>
            <dd>{escolhido.distanciaKm === 0 ? '—' : `${String(escolhido.distanciaKm)} km`}</dd>
          </div>
          <div>
            <dt>Tempo de viagem</dt>
            <dd>{escolhido.tempoViagem}</dd>
          </div>
          <div>
            <dt>Diária típica</dt>
            <dd>
              {moeda(escolhido.faixaPreco.min)}–{moeda(escolhido.faixaPreco.max)}
            </dd>
          </div>
          <div>
            <dt>Melhor época</dt>
            <dd>{escolhido.epoca}</dd>
          </div>
        </dl>

        {escolhido.praias.length > 0 ? (
          <p className={css['listaLinha']}>
            <strong>Praias:</strong> {escolhido.praias.join(', ')}
          </p>
        ) : null}

        <p className={css['listaLinha']}>
          <strong>Atrações:</strong> {escolhido.atracoes.slice(0, 5).join(', ')}
        </p>

        {/* Previsão real do destino escolhido, via Open-Meteo. É o único dado
            ao vivo de terceiro no produto, e some em silêncio se a rede falhar:
            clima é complemento, não pode travar quem está montando a viagem. */}
        <Previsao
          key={escolhido.id}
          latitude={escolhido.latitude}
          longitude={escolhido.longitude}
          destino={escolhido.nome}
          dias={5}
        />

        <p className={css['inventario']}>
          {conta.hoteis} hospedagens · {conta.passeios} passeios · {conta.restaurantes} restaurantes
          · {conta.eventos} eventos · {conta.carros} carros
        </p>

        <button
          type="button"
          className={css['escolher']}
          onClick={() => {
            definirBusca('destino', escolhido.id)
            void navegar('/plataforma/hoteis')
          }}
        >
          {escolhido.id === destino.id ? 'Ver hospedagem' : `Viajar para ${escolhido.nome}`}
        </button>
      </aside>
    </div>
  )
}
