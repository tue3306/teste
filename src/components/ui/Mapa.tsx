import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import css from './Mapa.module.css'

export interface PontoMapa {
  id: string
  nome: string
  latitude: number
  longitude: number
  /** Cor do marcador. */
  cor: string
}

interface Props {
  pontos: PontoMapa[]
  /** Id do ponto em destaque. */
  ativo?: string
  aoEscolher?: (id: string) => void
  /** Rótulo acessível do mapa como um todo. */
  rotulo: string
  className?: string
}

/**
 * Mapa real, com Leaflet sobre tiles do OpenStreetMap.
 *
 * O que havia antes era uma grade desenhada em CSS com bolinhas posicionadas em
 * porcentagem — não tinha relação nenhuma com a geografia do Rio, e quem
 * conhece a cidade percebia na hora. Agora as coordenadas são reais e o
 * enquadramento é calculado a partir delas.
 *
 * OpenStreetMap foi escolhido por não exigir chave: o Google Maps JavaScript
 * cobra por carregamento e a chave, sendo pública por natureza, precisaria de
 * restrição por domínio para não ser usada por terceiros na conta do cliente.
 * A atribuição no canto é obrigatória pela licença ODbL — não é enfeite.
 *
 * O Leaflet manipula o DOM por conta própria, então o React só entrega o
 * contêiner e sai do caminho: os marcadores são criados imperativamente e
 * atualizados por efeito.
 */
export function Mapa({ pontos, ativo, aoEscolher, rotulo, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapaRef = useRef<L.Map | null>(null)
  const marcadoresRef = useRef(new Map<string, L.Marker>())
  /**
   * Mantém o callback atual sem recriar o mapa a cada render.
   *
   * A escrita acontece num efeito, e não durante a renderização: os
   * manipuladores do Leaflet só disparam depois que os efeitos rodaram, então
   * eles sempre encontram o valor atualizado.
   */
  const aoEscolherRef = useRef(aoEscolher)
  useEffect(() => {
    aoEscolherRef.current = aoEscolher
  }, [aoEscolher])

  // Criação do mapa: uma vez só.
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapaRef.current) return

    const marcadores = marcadoresRef.current

    const mapa = L.map(container, {
      // A rolagem da página tem precedência: dar zoom sem querer ao rolar por
      // cima do mapa é uma das interações mais irritantes que existem.
      scrollWheelZoom: false,
      attributionControl: true,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa)

    mapaRef.current = mapa

    return () => {
      mapa.remove()
      mapaRef.current = null
      marcadores.clear()
    }
  }, [])

  // Marcadores e enquadramento.
  useEffect(() => {
    const mapa = mapaRef.current
    if (!mapa || pontos.length === 0) return

    for (const marcador of marcadoresRef.current.values()) marcador.remove()
    marcadoresRef.current.clear()

    for (const ponto of pontos) {
      const destacado = ponto.id === ativo
      const lado = destacado ? 20 : 15

      const icone = L.divIcon({
        className: '',
        html: `<div class="${css['marcador']} ${destacado ? css['marcadorAtivo'] ?? '' : ''}" style="background:${ponto.cor}"></div>${
          destacado ? `<span class="${css['rotulo']}">${ponto.nome}</span>` : ''
        }`,
        iconSize: [lado, lado],
        iconAnchor: [lado / 2, lado / 2],
      })

      const marcador = L.marker([ponto.latitude, ponto.longitude], {
        icon: icone,
        title: ponto.nome,
        keyboard: true,
        alt: ponto.nome,
        // O ativo fica por cima para o rótulo não sumir sob os vizinhos.
        zIndexOffset: destacado ? 1000 : 0,
      })
        .addTo(mapa)
        .on('click', () => {
          aoEscolherRef.current?.(ponto.id)
        })
        .on('keypress', () => {
          aoEscolherRef.current?.(ponto.id)
        })

      marcadoresRef.current.set(ponto.id, marcador)
    }

    const limites = L.latLngBounds(pontos.map((p) => [p.latitude, p.longitude] as [number, number]))
    mapa.fitBounds(limites, { padding: [48, 48], maxZoom: 14 })
  }, [pontos, ativo])

  return (
    <div
      ref={containerRef}
      className={[css['mapa'], className].filter(Boolean).join(' ')}
      role="application"
      aria-label={rotulo}
    />
  )
}
