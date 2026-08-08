import type { Faceta, Oferta, Vertical } from '@/types'

/**
 * Catálogo de demonstração.
 *
 * Os dados vieram do protótipo sem alteração de conteúdo. O que mudou é a
 * forma: cada oferta agora declara as facetas de filtro que satisfaz e as
 * categorias a que pertence, em vez do objeto `amen` de quatro booleanos que
 * era aplicado indiscriminadamente às três verticais.
 */

export const VOOS: Oferta[] = [
  {
    id: 'v1',
    vertical: 'voos',
    titulo: 'LATAM · GRU → SDU',
    sub: '06:20 → 07:25 · 1h05 · direto · bagagem de mão inclusa',
    preco: 389,
    outros: 512,
    nota: 8.9,
    tag: 'Mais rápido',
    foto: 'aeroporto-santos-dumont',
    chips: ['Direto', 'Bagagem de mão', 'Assento à escolha'],
    facetas: ['direto', 'bagagem'],
    categorias: [],
  },
  {
    id: 'v2',
    vertical: 'voos',
    titulo: 'GOL · GRU → GIG',
    sub: '09:45 → 10:55 · 1h10 · direto · cancelamento grátis em 24h',
    preco: 342,
    outros: 448,
    nota: 8.6,
    tag: 'Melhor escolha',
    foto: 'aeroporto-galeao',
    chips: ['Direto', 'Cancelamento grátis', 'Wi-Fi a bordo'],
    facetas: ['direto', 'cancelamento', 'wifi'],
    categorias: [],
  },
  {
    id: 'v3',
    vertical: 'voos',
    titulo: 'Azul · VCP → SDU',
    sub: '13:10 → 14:20 · 1h10 · direto · traslado de ônibus incluso',
    preco: 407,
    outros: 498,
    nota: 8.8,
    tag: 'Mais confortável',
    foto: 'aeroporto-guarulhos',
    chips: ['Direto', 'Traslado incluso', 'Espaço extra'],
    facetas: ['direto', 'bagagem'],
    categorias: [],
  },
  {
    id: 'v4',
    vertical: 'voos',
    titulo: 'GOL · GRU → GIG',
    sub: '18:30 → 21:40 · 3h10 · 1 parada em CNF · só bagagem pessoal',
    preco: 298,
    outros: 372,
    nota: 7.4,
    tag: 'Mais barato',
    foto: 'aeroporto-galeao',
    chips: ['1 parada', 'Sem bagagem', 'Madrugada livre'],
    facetas: [],
    categorias: [],
  },
  {
    id: 'v5',
    vertical: 'voos',
    titulo: 'LATAM · CGH → SDU',
    sub: '20:15 → 21:20 · 1h05 · direto · ponte aérea, sala VIP',
    preco: 465,
    outros: 560,
    nota: 9.1,
    tag: 'Ponte aérea',
    foto: 'aeroporto-santos-dumont',
    chips: ['Direto', 'Sala VIP', 'Bagagem 23kg'],
    facetas: ['direto', 'bagagem', 'vip'],
    categorias: [],
  },
]

export const HOTEIS: Oferta[] = [
  {
    id: 'h1',
    vertical: 'hoteis',
    titulo: 'Copa Vista Mar',
    sub: 'Copacabana · 120 m da praia · 4 estrelas · café da manhã',
    preco: 612,
    outros: 748,
    nota: 9.2,
    avaliacoes: 1842,
    tag: 'Custo-benefício',
    foto: 'copacabana',
    chips: ['Piscina', 'Café incluso', 'Cancelamento grátis'],
    facetas: ['piscina', 'cafe', 'cancelamento'],
    categorias: ['praia'],
  },
  {
    id: 'h2',
    vertical: 'hoteis',
    titulo: 'Ipanema Arpoador Suítes',
    sub: 'Ipanema · 2 min do Arpoador · 4 estrelas · rooftop',
    preco: 890,
    outros: 1094,
    nota: 9.5,
    avaliacoes: 2317,
    tag: 'Mais amado',
    foto: 'arpoador',
    chips: ['Piscina', 'Academia', 'Cancelamento grátis'],
    facetas: ['piscina', 'academia', 'cancelamento'],
    categorias: ['praia', 'luxo'],
  },
  {
    id: 'h3',
    vertical: 'hoteis',
    titulo: 'Casa Santa Teresa',
    sub: 'Santa Teresa · casarão restaurado · 12 quartos · pet friendly',
    preco: 430,
    outros: 512,
    nota: 9.0,
    avaliacoes: 764,
    tag: 'Charme',
    foto: 'santa-teresa',
    chips: ['Pet friendly', 'Café incluso', 'Wi-Fi rápido'],
    facetas: ['pet', 'cafe', 'wifi'],
    categorias: ['cultura'],
  },
  {
    id: 'h4',
    vertical: 'hoteis',
    titulo: 'Lapa Social Hostel',
    sub: 'Lapa · quarto duplo privativo · rooftop bar · 24h',
    preco: 186,
    outros: 232,
    nota: 8.4,
    avaliacoes: 3105,
    tag: 'Mais barato',
    foto: 'lapa',
    chips: ['Café incluso', 'Cancelamento grátis'],
    facetas: ['cafe', 'cancelamento'],
    categorias: ['noite'],
  },
  {
    id: 'h5',
    vertical: 'hoteis',
    titulo: 'Leblon Garden Flat',
    sub: 'Leblon · apartamento com cozinha · 7 noites mínimo',
    preco: 735,
    outros: 848,
    nota: 9.3,
    avaliacoes: 512,
    tag: 'Para ficar',
    foto: 'leblon',
    chips: ['Pet friendly', 'Estacionamento'],
    facetas: ['pet', 'estacionamento'],
    categorias: ['praia', 'familia'],
  },
  {
    id: 'h6',
    vertical: 'hoteis',
    titulo: 'Resort Barra Ocean',
    sub: 'Barra da Tijuca · resort pé na areia · 5 estrelas · all inclusive',
    preco: 1480,
    outros: 1790,
    nota: 9.1,
    avaliacoes: 986,
    tag: 'Luxo',
    foto: 'barra-da-tijuca',
    chips: ['Piscina', 'Academia', 'Café incluso'],
    facetas: ['piscina', 'academia', 'cafe', 'cancelamento'],
    categorias: ['praia', 'luxo', 'familia'],
  },
]

export const PASSEIOS: Oferta[] = [
  {
    id: 'p1',
    vertical: 'passeios',
    titulo: 'Cristo Redentor · trem do Corcovado',
    sub: 'Ingresso com horário marcado · 2h30 · sem fila',
    preco: 135,
    outros: 178,
    nota: 9.4,
    tag: 'Imperdível',
    foto: 'cristo-redentor',
    chips: ['Sem fila', 'Guia opcional', 'Cancelamento grátis'],
    facetas: ['semfila', 'guia', 'cancelamento'],
    categorias: ['cultura', 'natureza'],
  },
  {
    id: 'p2',
    vertical: 'passeios',
    titulo: 'Bondinho Pão de Açúcar',
    sub: 'Dois trechos · 3h · melhor no fim da tarde',
    preco: 189,
    outros: 216,
    nota: 9.3,
    tag: 'Pôr do sol',
    foto: 'pao-de-acucar',
    chips: ['Sem fila', 'Pôr do sol'],
    facetas: ['semfila', 'cancelamento'],
    categorias: ['natureza', 'praia'],
  },
  {
    id: 'p3',
    vertical: 'passeios',
    titulo: 'Trilha Dois Irmãos',
    sub: 'Vidigal · 2h · guia local · nível moderado',
    preco: 95,
    outros: 120,
    nota: 9.6,
    tag: 'Melhor avaliado',
    foto: 'dois-irmaos',
    chips: ['Guia local', 'Nível moderado'],
    facetas: ['guia', 'cancelamento'],
    categorias: ['natureza'],
  },
  {
    id: 'p4',
    vertical: 'passeios',
    titulo: 'Jardim Botânico + Parque Lage',
    sub: 'Manhã guiada · 3h · café no Parque Lage incluso',
    preco: 78,
    outros: 96,
    nota: 9.0,
    tag: 'Tranquilo',
    foto: 'jardim-botanico',
    chips: ['Café incluso', 'Sombra'],
    facetas: ['guia', 'cafe'],
    categorias: ['natureza', 'familia'],
  },
  {
    id: 'p5',
    vertical: 'passeios',
    titulo: 'Roda de samba na Lapa',
    sub: 'Noite guiada · 4h · entrada em duas casas',
    preco: 145,
    outros: 190,
    nota: 9.2,
    tag: 'Vida noturna',
    foto: 'escadaria-selaron',
    chips: ['Vida noturna', 'Guia local'],
    facetas: ['guia', 'cancelamento'],
    categorias: ['noite', 'cultura'],
  },
  {
    id: 'p6',
    vertical: 'passeios',
    titulo: 'Museu do Amanhã + Boulevard Olímpico',
    sub: 'Centro · 3h · ideal em dia de chuva',
    preco: 60,
    outros: 74,
    nota: 8.7,
    tag: 'Dia de chuva',
    foto: 'museu-do-amanha',
    chips: ['Coberto', 'Sem fila'],
    facetas: ['semfila', 'cancelamento'],
    categorias: ['cultura', 'familia'],
  },
]

/** Índice único por vertical, para lookup direto. */
export const OFERTAS_POR_VERTICAL: Record<Vertical, Oferta[]> = {
  voos: VOOS,
  hoteis: HOTEIS,
  passeios: PASSEIOS,
}

/** Catálogo completo, usado para resolver favoritos salvos. */
export const TODAS_OFERTAS: Oferta[] = [...VOOS, ...HOTEIS, ...PASSEIOS]

/**
 * Facetas de filtro por vertical.
 *
 * O protótipo mostrava "Piscina / Café / Pet / Cancelamento" nas três abas.
 * Como voos não têm nenhum desses atributos e o filtro exigia que a oferta
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
    { id: 'pet', label: 'Pet friendly' },
    { id: 'cancelamento', label: 'Cancelamento grátis' },
  ],
  passeios: [
    { id: 'semfila', label: 'Sem fila' },
    { id: 'guia', label: 'Guia local' },
    { id: 'cancelamento', label: 'Cancelamento grátis' },
  ],
}

/**
 * Faixa de preço de um conjunto de ofertas, arredondada para fora numa dezena
 * cheia. O slider de preço usa a faixa da vertical aberta em vez dos
 * `min=200 max=2400` fixos do protótipo — que deixavam metade do curso morto na
 * aba de voos (R$ 298 a R$ 465) e cortavam o resort de R$ 1.480 fora do alcance
 * quando o valor inicial era menor.
 */
export function faixaDePreco(ofertas: readonly Oferta[]): { min: number; max: number } {
  if (ofertas.length === 0) return { min: 0, max: 0 }
  const precos = ofertas.map((o) => o.preco)
  return {
    min: Math.floor(Math.min(...precos) / 10) * 10,
    max: Math.ceil(Math.max(...precos) / 10) * 10,
  }
}
