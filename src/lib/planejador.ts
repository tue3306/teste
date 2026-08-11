import type { NomeIcone } from '@/components/ui/Icone'
import type { Busca, Oferta, Vertical } from '@/types'
import { noitesEntre } from './orcamento'

/**
 * Máquina de etapas do planejador.
 *
 * ## Por que é um módulo puro
 *
 * Um fluxo de onze etapas com avançar, voltar e retomada tem exatamente um
 * lugar onde erra: a regra de qual etapa vem depois de qual, e quando ela está
 * completa. Deixar isso dentro do componente significa que só dá para testar
 * clicando. Aqui a regra é uma função, o teste é uma chamada, e o componente só
 * desenha.
 *
 * ## Etapas obrigatórias e opcionais
 *
 * Destino, datas e pessoas são obrigatórios: sem eles não existe orçamento —
 * `noites` é zero e diária não multiplica. Da hospedagem em diante tudo é
 * opcional, porque uma viagem sem passeio marcado continua sendo uma viagem.
 *
 * Avançar nunca é bloqueado por etapa opcional. O que a etapa incompleta faz é
 * aparecer como pendência no resumo, e não travar o caminho.
 */

export type IdEtapa =
  | 'destino'
  | 'datas'
  | 'pessoas'
  | 'preferencias'
  | 'hospedagem'
  | 'passeios'
  | 'restaurantes'
  | 'eventos'
  | 'transporte'
  | 'mapa'
  | 'resumo'

export interface Etapa {
  id: IdEtapa
  titulo: string
  /** Uma linha dizendo o que se decide aqui. */
  ajuda: string
  icone: NomeIcone
  /** Obrigatória para o orçamento fechar. */
  obrigatoria: boolean
  /** Vertical do catálogo que a etapa escolhe, quando há uma. */
  vertical?: Vertical
}

export const ETAPAS: Etapa[] = [
  {
    id: 'destino',
    titulo: 'Destino',
    ajuda: 'Para onde você vai. Tudo o que vem depois se ajusta a esta escolha.',
    icone: 'praia',
    obrigatoria: true,
  },
  {
    id: 'datas',
    titulo: 'Datas',
    ajuda: 'Ida e volta. É o que transforma uma diária em preço de estadia.',
    icone: 'evento',
    obrigatoria: true,
  },
  {
    id: 'pessoas',
    titulo: 'Pessoas',
    ajuda: 'Quem viaja. Criança de 2 a 11 paga 70%; bebê de colo não paga.',
    icone: 'familia',
    obrigatoria: true,
  },
  {
    id: 'preferencias',
    titulo: 'Preferências',
    ajuda: 'O que você gosta. Usamos para destacar o que combina com a viagem.',
    icone: 'estrela',
    obrigatoria: false,
  },
  {
    id: 'hospedagem',
    titulo: 'Hospedagem',
    ajuda: 'Onde ficar. O preço é por noite e por quarto.',
    icone: 'hotel',
    obrigatoria: false,
    vertical: 'hoteis',
  },
  {
    id: 'passeios',
    titulo: 'Passeios',
    ajuda: 'O que fazer. Preço por pessoa.',
    icone: 'aventura',
    obrigatoria: false,
    vertical: 'passeios',
  },
  {
    id: 'restaurantes',
    titulo: 'Restaurantes',
    ajuda: 'Onde comer. Valor médio por pessoa, por refeição.',
    icone: 'gastronomia',
    obrigatoria: false,
    vertical: 'restaurantes',
  },
  {
    id: 'eventos',
    titulo: 'Eventos',
    ajuda: 'O que está acontecendo nas suas datas.',
    icone: 'noite',
    obrigatoria: false,
    vertical: 'eventos',
  },
  {
    id: 'transporte',
    titulo: 'Transporte',
    ajuda: 'Como chegar e como circular: voo e carro.',
    icone: 'aviao',
    obrigatoria: false,
  },
  {
    id: 'mapa',
    titulo: 'Mapa',
    ajuda: 'Onde tudo fica, e o que dá para combinar por perto.',
    icone: 'natureza',
    obrigatoria: false,
  },
  {
    id: 'resumo',
    titulo: 'Resumo',
    ajuda: 'A viagem inteira, com o total e a economia.',
    icone: 'luxo',
    obrigatoria: false,
  },
]

export const PRIMEIRA = ETAPAS[0].id

/** Uma string vira `IdEtapa` conhecida, ou cai na primeira. */
export function normalizar(valor: string | null | undefined): IdEtapa {
  return ETAPAS.some((e) => e.id === valor) ? (valor as IdEtapa) : PRIMEIRA
}

export function indiceDe(id: IdEtapa): number {
  return ETAPAS.findIndex((e) => e.id === id)
}

/** Etapa seguinte, ou `null` na última. */
export function proxima(id: IdEtapa): IdEtapa | null {
  const i = indiceDe(id)
  return ETAPAS[i + 1]?.id ?? null
}

/** Etapa anterior, ou `null` na primeira. */
export function anterior(id: IdEtapa): IdEtapa | null {
  const i = indiceDe(id)
  return i > 0 ? (ETAPAS[i - 1]?.id ?? null) : null
}

/** Estado que o planejador consulta para saber o que já foi decidido. */
export interface EstadoPlano {
  busca: Busca
  /** Itens escolhidos, para saber quais verticais já têm decisão. */
  escolhidos: readonly Oferta[]
}

/**
 * Uma etapa está resolvida?
 *
 * "Resolvida" não é o mesmo que "obrigatória". Uma etapa opcional resolvida é
 * uma que a pessoa realmente decidiu — e é isso que o indicador de progresso
 * mostra, para que ela veja o que ainda dá para acrescentar.
 */
export function resolvida(id: IdEtapa, estado: EstadoPlano): boolean {
  const { busca, escolhidos } = estado

  switch (id) {
    case 'destino':
      return busca.destino !== ''
    case 'datas':
      return noitesEntre(busca.ida, busca.volta) > 0
    case 'pessoas':
      return busca.pessoas.adultos >= 1
    case 'preferencias':
      return busca.preferencias.length > 0
    case 'hospedagem':
      return escolhidos.some((o) => o.vertical === 'hoteis')
    case 'passeios':
      return escolhidos.some((o) => o.vertical === 'passeios')
    case 'restaurantes':
      return escolhidos.some((o) => o.vertical === 'restaurantes')
    case 'eventos':
      return escolhidos.some((o) => o.vertical === 'eventos')
    case 'transporte':
      return escolhidos.some((o) => o.vertical === 'voos' || o.vertical === 'carros')
    case 'mapa':
    case 'resumo':
      // Não há o que decidir: são leitura. Contam como vistas ao serem abertas,
      // e marcá-las como pendentes seria acusar a pessoa de não ter olhado.
      return true
  }
}

/**
 * Dá para sair desta etapa?
 *
 * Só as três primeiras seguram, e apenas porque sem elas o orçamento não
 * calcula. Travar o avanço numa etapa opcional é a forma mais rápida de fazer
 * alguém abandonar um formulário longo.
 */
export function podeAvancar(id: IdEtapa, estado: EstadoPlano): boolean {
  const etapa = ETAPAS[indiceDe(id)]
  if (!etapa?.obrigatoria) return true
  return resolvida(id, estado)
}

/** O que falta para o orçamento fechar. Vazio quando está tudo certo. */
export function pendencias(estado: EstadoPlano): Etapa[] {
  return ETAPAS.filter((e) => e.obrigatoria && !resolvida(e.id, estado))
}

/** Quantas etapas já foram resolvidas, para a barra de progresso. */
export function progresso(estado: EstadoPlano): { feitas: number; total: number; pct: number } {
  // As duas etapas de leitura ficam fora da conta: incluí-las faria o
  // progresso começar em 18% sem que nada tivesse sido decidido.
  const contaveis = ETAPAS.filter((e) => e.id !== 'mapa' && e.id !== 'resumo')
  const feitas = contaveis.filter((e) => resolvida(e.id, estado)).length
  return { feitas, total: contaveis.length, pct: (feitas / contaveis.length) * 100 }
}
