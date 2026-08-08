import type { SlugFoto } from './fotos'

/**
 * Destinos cobertos pela BI&B.
 *
 * As coordenadas são reais e alimentam a previsão do tempo (Open-Meteo). A foto
 * vem do catálogo local gerado a partir do Wikimedia Commons.
 *
 * `disponivel: false` marca destino anunciado mas ainda sem inventário — o site
 * o exibe como "em breve" em vez de prometer resultado que não existe.
 */
export interface Destino {
  id: string
  nome: string
  uf: string
  latitude: number
  longitude: number
  foto: SlugFoto
  /** Frase curta de vitrine. */
  chamada: string
  /** Melhor época, em texto corrido. */
  epoca: string
  disponivel: boolean
}

export const DESTINOS: Destino[] = [
  {
    id: 'rio-de-janeiro',
    nome: 'Rio de Janeiro',
    uf: 'RJ',
    latitude: -22.9068,
    longitude: -43.1729,
    foto: 'rio-de-janeiro',
    chamada: 'Praia de manhã, montanha à tarde, samba à noite.',
    epoca: 'abril a outubro',
    disponivel: true,
  },
  {
    id: 'noronha',
    nome: 'Fernando de Noronha',
    uf: 'PE',
    latitude: -3.8576,
    longitude: -32.4297,
    foto: 'noronha',
    chamada: 'O mar mais claro do Atlântico, com vaga limitada.',
    epoca: 'agosto a dezembro',
    disponivel: false,
  },
  {
    id: 'salvador',
    nome: 'Salvador',
    uf: 'BA',
    latitude: -12.9777,
    longitude: -38.5016,
    foto: 'salvador',
    chamada: 'Centro histórico, axé e a comida mais temperada do país.',
    epoca: 'setembro a março',
    disponivel: false,
  },
  {
    id: 'foz-do-iguacu',
    nome: 'Foz do Iguaçu',
    uf: 'PR',
    latitude: -25.5163,
    longitude: -54.5854,
    foto: 'foz-do-iguacu',
    chamada: '275 quedas d’água numa caminhada só.',
    epoca: 'março a maio',
    disponivel: false,
  },
  {
    id: 'jericoacoara',
    nome: 'Jericoacoara',
    uf: 'CE',
    latitude: -2.7969,
    longitude: -40.5127,
    foto: 'jericoacoara',
    chamada: 'Duna do pôr do sol, lagoas e vento o ano inteiro.',
    epoca: 'julho a dezembro',
    disponivel: false,
  },
  {
    id: 'lencois-maranhenses',
    nome: 'Lençóis Maranhenses',
    uf: 'MA',
    latitude: -2.4856,
    longitude: -43.1281,
    foto: 'lencois-maranhenses',
    chamada: 'Lagoas de água doce entre dunas brancas.',
    epoca: 'junho a setembro',
    disponivel: false,
  },
  {
    id: 'chapada-diamantina',
    nome: 'Chapada Diamantina',
    uf: 'BA',
    latitude: -12.5833,
    longitude: -41.4,
    foto: 'chapada-diamantina',
    chamada: 'Cachoeiras, grutas e trilhas de dias inteiros.',
    epoca: 'abril a outubro',
    disponivel: false,
  },
  {
    id: 'bonito',
    nome: 'Bonito',
    uf: 'MS',
    latitude: -21.1261,
    longitude: -56.4836,
    foto: 'bonito',
    chamada: 'Flutuação em rio transparente e gruta azul.',
    epoca: 'dezembro a março',
    disponivel: false,
  },
  {
    id: 'gramado',
    nome: 'Gramado',
    uf: 'RS',
    latitude: -29.3788,
    longitude: -50.8739,
    foto: 'gramado',
    chamada: 'Serra gaúcha, inverno de verdade e rota do vinho.',
    epoca: 'junho a agosto',
    disponivel: false,
  },
  {
    id: 'sao-paulo',
    nome: 'São Paulo',
    uf: 'SP',
    latitude: -23.5505,
    longitude: -46.6333,
    foto: 'sao-paulo',
    chamada: 'A melhor cena gastronômica da América do Sul.',
    epoca: 'o ano todo',
    disponivel: false,
  },
]

/** Destino em foco da demonstração. */
export const DESTINO_ATUAL = DESTINOS[0]

/** Destinos com inventário ativo. */
export const DESTINOS_ATIVOS = DESTINOS.filter((d) => d.disponivel)
