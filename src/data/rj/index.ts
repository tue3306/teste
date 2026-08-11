import type { Faceta, Oferta, Vertical } from '@/types'
import { ITENS_INTERIOR } from './itens-interior'
import { ITENS_LITORAL } from './itens-litoral'
import { ITENS_METROPOLITANA } from './itens-metropolitana'
import { VOOS } from './voos'

export { DESTINOS, DESTINO_POR_ID, DESTINO_PADRAO, NOMES_REGIAO, acharDestino } from './destinos'

/**
 * O catálogo inteiro, em uma lista só.
 *
 * Tudo o que a plataforma lista sai daqui. Os arquivos por região existem para
 * o catálogo ser editável — 29 destinos num arquivo só seria impossível de
 * revisar —, mas quem consome vê uma coleção única e filtra pelo que precisa.
 */
export const CATALOGO: Oferta[] = [
  ...VOOS,
  ...ITENS_METROPOLITANA,
  ...ITENS_LITORAL,
  ...ITENS_INTERIOR,
]

/** Índice por id, para resolver favoritos e seleções salvas sem varrer a lista. */
export const ITEM_POR_ID = new Map(CATALOGO.map((o) => [o.id, o]))

/** Itens de uma vertical, opcionalmente restritos a um destino. */
export function itensDe(vertical: Vertical, destino?: string): Oferta[] {
  return CATALOGO.filter(
    (o) => o.vertical === vertical && (destino === undefined || o.destino === destino),
  )
}

/** Todo o inventário de um destino, seja qual for a vertical. */
export function itensDoDestino(destino: string): Oferta[] {
  return CATALOGO.filter((o) => o.destino === destino)
}

/** Quantos itens um destino tem em cada vertical. Alimenta os contadores da vitrine. */
export function contarPorVertical(destino: string): Record<Vertical, number> {
  const conta: Record<Vertical, number> = {
    voos: 0,
    hoteis: 0,
    passeios: 0,
    restaurantes: 0,
    eventos: 0,
    carros: 0,
  }
  for (const item of CATALOGO) {
    if (item.destino === destino) conta[item.vertical] += 1
  }
  return conta
}

/**
 * Facetas de filtro por vertical.
 *
 * O protótipo mostrava "Piscina / Café / Pet / Cancelamento" nas três abas.
 * Como voo não tem nenhum desses atributos e o filtro exigia que a oferta
 * satisfizesse todos os marcados, marcar qualquer comodidade na aba Voos
 * esvaziava a lista. Agora cada vertical declara o que faz sentido nela.
 */
export const FACETAS_POR_VERTICAL: Record<Vertical, Faceta[]> = {
  voos: [
    { id: 'direto', label: 'Voo direto' },
    { id: 'bagagem', label: 'Bagagem inclusa' },
    { id: 'cancelamento', label: 'Cancelamento grátis' },
    { id: 'wifi', label: 'Wi-Fi a bordo' },
  ],
  hoteis: [
    { id: 'piscina', label: 'Piscina' },
    { id: 'cafe', label: 'Café incluso' },
    { id: 'praia', label: 'Perto da praia' },
    { id: 'pet', label: 'Aceita pet' },
    { id: 'estacionamento', label: 'Estacionamento' },
    { id: 'cancelamento', label: 'Cancelamento grátis' },
  ],
  passeios: [
    { id: 'guia', label: 'Guia local' },
    { id: 'transporte', label: 'Transporte incluso' },
    { id: 'criancas', label: 'Bom para crianças' },
    { id: 'semfila', label: 'Sem fila' },
    { id: 'cancelamento', label: 'Cancelamento grátis' },
  ],
  restaurantes: [
    { id: 'frutosdomar', label: 'Frutos do mar' },
    { id: 'vegetariano', label: 'Opção vegetariana' },
    { id: 'vista', label: 'Com vista' },
    { id: 'reserva', label: 'Aceita reserva' },
    { id: 'familia', label: 'Bom para a família' },
  ],
  eventos: [
    { id: 'gratuito', label: 'Ao ar livre' },
    { id: 'coberto', label: 'Coberto' },
    { id: 'criancas', label: 'Bom para crianças' },
  ],
  carros: [
    { id: 'automatico', label: 'Câmbio automático' },
    { id: 'suv', label: 'SUV ou picape' },
    { id: 'semfranquia', label: 'Proteção sem franquia' },
    { id: 'arcondicionado', label: 'Ar-condicionado' },
  ],
}

/**
 * Faixa de preço de um conjunto de itens, arredondada para fora numa dezena
 * cheia. O controle de preço usa a faixa do que está na tela, em vez dos
 * `min=200 max=2400` fixos do protótipo — que deixavam metade do curso morto na
 * aba de voos e cortavam o resort de R$ 1.480 fora do alcance.
 */
export function faixaDePreco(itens: readonly Oferta[]): { min: number; max: number } {
  if (itens.length === 0) return { min: 0, max: 0 }
  const precos = itens.map((o) => o.preco)
  return {
    min: Math.floor(Math.min(...precos) / 10) * 10,
    max: Math.ceil(Math.max(...precos) / 10) * 10,
  }
}
