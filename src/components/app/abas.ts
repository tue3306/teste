import type { NomeIcone } from '@/components/ui/Icone'
import type { Aba, Vertical } from '@/types'

/** Abas da plataforma, na ordem em que aparecem. */
export const ABAS: { id: Aba; label: string; icone: NomeIcone }[] = [
  { id: 'destinos', label: 'Destinos', icone: 'praia' },
  { id: 'voos', label: 'Voos', icone: 'aviao' },
  { id: 'hoteis', label: 'Hospedagem', icone: 'hotel' },
  { id: 'passeios', label: 'Passeios', icone: 'aventura' },
  { id: 'restaurantes', label: 'Restaurantes', icone: 'gastronomia' },
  { id: 'eventos', label: 'Eventos', icone: 'evento' },
  { id: 'carros', label: 'Carros', icone: 'carro' },
  { id: 'mapa', label: 'Mapa', icone: 'natureza' },
  { id: 'viagem', label: 'Planejar viagem', icone: 'estrela' },
]

/** Abas que listam itens do catálogo e, por isso, exibem o painel de filtros. */
export const VERTICAIS: Vertical[] = [
  'voos',
  'hoteis',
  'passeios',
  'restaurantes',
  'eventos',
  'carros',
]

/** Estreita uma string de rota para uma aba conhecida. */
export function ehAba(valor: string | undefined): valor is Aba {
  return ABAS.some((a) => a.id === valor)
}

/** Verdadeiro quando a aba lista itens do catálogo. */
export function ehVertical(aba: Aba): aba is Vertical {
  return (VERTICAIS as string[]).includes(aba)
}

/**
 * Título e subtítulo de cada aba.
 *
 * O título do destino é preenchido em tempo de execução — a plataforma serve os
 * 29 destinos do estado, e escrever "Voos para o Rio de Janeiro" fixo era
 * mentira em 28 deles.
 */
export const TITULOS: Record<Aba, { titulo: (destino: string) => string; subtitulo?: string }> = {
  destinos: {
    titulo: () => 'Destinos do Rio de Janeiro',
    subtitulo: 'Escolha para onde ir — o inventário todo se ajusta ao destino',
  },
  voos: {
    titulo: (d) => `Voos — ${d}`,
    subtitulo: 'Preço por passageiro, já somado ao total da sua viagem',
  },
  hoteis: {
    titulo: (d) => `Onde ficar — ${d}`,
    subtitulo: 'Preço por noite e por quarto',
  },
  passeios: {
    titulo: (d) => `Passeios — ${d}`,
    subtitulo: 'Preço por pessoa; criança de 2 a 11 anos paga 70%',
  },
  restaurantes: {
    titulo: (d) => `Onde comer — ${d}`,
    subtitulo: 'Valor médio por pessoa, por refeição',
  },
  eventos: {
    titulo: (d) => `Eventos — ${d}`,
    subtitulo: 'Ingresso individual, na data indicada',
  },
  carros: {
    titulo: (d) => `Aluguel de carro — ${d}`,
    subtitulo: 'Diária de locação; o total cobre da chegada à saída',
  },
  mapa: {
    titulo: () => 'Mapa do estado',
    subtitulo: 'Os 29 destinos, com distância e tempo a partir da capital',
  },
  viagem: {
    titulo: () => 'Planejar a viagem',
    subtitulo: 'O que você escolheu, quanto custa e quanto está economizando',
  },
}
