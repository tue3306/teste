import type { Aba, Vertical } from '@/types'

/** Abas da plataforma, na ordem em que aparecem. */
export const ABAS: { id: Aba; label: string }[] = [
  { id: 'voos', label: 'Voos' },
  { id: 'hoteis', label: 'Hospedagem' },
  { id: 'passeios', label: 'Passeios' },
  { id: 'roteiro', label: 'Roteiro IA' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'dashboard', label: 'Minha viagem' },
  { id: 'bia', label: 'Bia · assistente' },
]

/** Abas que listam ofertas e, por isso, exibem o painel de filtros. */
export const VERTICAIS: Vertical[] = ['voos', 'hoteis', 'passeios']

/** Estreita uma string de rota para uma aba conhecida. */
export function ehAba(valor: string | undefined): valor is Aba {
  return ABAS.some((a) => a.id === valor)
}

/** Verdadeiro quando a aba lista ofertas. */
export function ehVertical(aba: Aba): aba is Vertical {
  return (VERTICAIS as string[]).includes(aba)
}

/** Título e subtítulo de cada aba. */
export const TITULOS: Record<Aba, { titulo: string; subtitulo?: string }> = {
  voos: { titulo: 'Voos para o Rio de Janeiro' },
  hoteis: { titulo: 'Onde ficar no Rio' },
  passeios: { titulo: 'Passeios e experiências' },
  roteiro: {
    titulo: 'Roteiro de 7 dias',
    subtitulo: 'Gerado pela IA a partir de clima, distância e orçamento',
  },
  mapa: {
    titulo: 'Mapa da viagem',
    subtitulo: 'Escolha um ponto para ver detalhes e adicionar ao roteiro',
  },
  dashboard: { titulo: 'Minha viagem', subtitulo: 'Reservas, documentos, alertas e favoritos' },
  bia: {
    titulo: 'Bia, sua copiloto',
    subtitulo: 'Pergunte em português; ela recalcula preço e roteiro',
  },
}
