import { CATALOGO, DESTINOS } from '@/data/rj'
import type { Categoria, Destino } from '@/types'

/**
 * Selos e rankings dos destinos.
 *
 * **Nada aqui é inventado.** Não há contador de buscas, número de reservas nem
 * "1.240 pessoas viram este destino" — dados desse tipo não existem no projeto,
 * e fabricá-los seria apresentar ficção como métrica.
 *
 * Todo selo sai de algo que o catálogo realmente sabe: a nota do destino, o
 * tamanho do inventário, a faixa de diária, a distância da capital. "Mais
 * procurado" é o destino com maior nota e maior inventário — e o rótulo diz
 * "destaque", não "mais buscado", justamente porque busca é o que não temos.
 */

export type IdSelo =
  | 'destaque'
  | 'melhor-nota'
  | 'custo-beneficio'
  | 'fim-de-semana'
  | 'mais-completo'

export interface Selo {
  id: IdSelo
  label: string
  /** Emoji usado no selo. Decorativo — o rótulo carrega o significado. */
  emoji: string
  /** Uma frase explicando de onde o selo saiu. Aparece no título do elemento. */
  criterio: string
}

const SELOS: Record<IdSelo, Selo> = {
  destaque: {
    id: 'destaque',
    label: 'Destaque',
    emoji: '🔥',
    criterio: 'Maior nota combinada com o maior inventário do estado',
  },
  'melhor-nota': {
    id: 'melhor-nota',
    label: 'Melhor avaliado',
    emoji: '⭐',
    criterio: 'Entre as três maiores notas do catálogo',
  },
  'custo-beneficio': {
    id: 'custo-beneficio',
    label: 'Custo-benefício',
    emoji: '💰',
    criterio: 'Nota alta com a menor diária inicial do estado',
  },
  'fim-de-semana': {
    id: 'fim-de-semana',
    label: 'Bom para fim de semana',
    emoji: '🧳',
    criterio: 'Até 120 km da capital e marcado como destino de fim de semana',
  },
  'mais-completo': {
    id: 'mais-completo',
    label: 'Mais completo',
    emoji: '🏆',
    criterio: 'Tem opção em todas as categorias do catálogo',
  },
}

/** Quantos itens cada destino tem, calculado uma vez. */
const INVENTARIO = new Map<string, number>()
const CATEGORIAS_COBERTAS = new Map<string, Set<string>>()

for (const item of CATALOGO) {
  INVENTARIO.set(item.destino, (INVENTARIO.get(item.destino) ?? 0) + 1)
  const set = CATEGORIAS_COBERTAS.get(item.destino) ?? new Set<string>()
  set.add(item.vertical)
  CATEGORIAS_COBERTAS.set(item.destino, set)
}

/** Tamanho do inventário de um destino. */
export function tamanhoInventario(id: string): number {
  return INVENTARIO.get(id) ?? 0
}

/** Pontuação de destaque: nota pesa mais, inventário desempata. */
function pontuacao(d: Destino): number {
  return d.nota * 10 + tamanhoInventario(d.id)
}

const POR_PONTUACAO = [...DESTINOS].sort((a, b) => pontuacao(b) - pontuacao(a))
const TOP_NOTA = new Set(
  [...DESTINOS].sort((a, b) => b.nota - a.nota).slice(0, 3).map((d) => d.id),
)
const TOP_DESTAQUE = new Set(POR_PONTUACAO.slice(0, 3).map((d) => d.id))
const TOP_BARATO = new Set(
  [...DESTINOS]
    .filter((d) => d.nota >= 8.5)
    .sort((a, b) => a.faixaPreco.min - b.faixaPreco.min)
    .slice(0, 3)
    .map((d) => d.id),
)

/** Selos que um destino carrega. No máximo dois, para não virar enfeite. */
export function selosDe(destino: Destino): Selo[] {
  const lista: Selo[] = []

  if (TOP_DESTAQUE.has(destino.id)) lista.push(SELOS.destaque)
  if (TOP_NOTA.has(destino.id)) lista.push(SELOS['melhor-nota'])
  if (TOP_BARATO.has(destino.id)) lista.push(SELOS['custo-beneficio'])
  if ((CATEGORIAS_COBERTAS.get(destino.id)?.size ?? 0) >= 5) {
    lista.push(SELOS['mais-completo'])
  }
  if (destino.categorias.includes('fim-de-semana') && destino.distanciaKm <= 120) {
    lista.push(SELOS['fim-de-semana'])
  }

  return lista.slice(0, 2)
}

/** Uma lista ordenada de destinos para uma finalidade. */
export interface Ranking {
  id: string
  titulo: string
  /** De onde a ordem saiu. Exibido junto do ranking, para ser verificável. */
  criterio: string
  destinos: Destino[]
}

function topPara(categoria: Categoria, n = 5): Destino[] {
  return DESTINOS.filter((d) => d.categorias.includes(categoria))
    .sort((a, b) => pontuacao(b) - pontuacao(a))
    .slice(0, n)
}

/**
 * Rankings exibidos na home.
 *
 * Cada um declara o critério ao lado do título. É a diferença entre um ranking
 * que a pessoa pode conferir e um que ela precisa acreditar.
 */
export const RANKINGS: Ranking[] = [
  {
    id: 'destaques',
    titulo: 'Destaques do estado',
    criterio: 'nota do destino somada ao tamanho do inventário',
    destinos: POR_PONTUACAO.slice(0, 5),
  },
  {
    id: 'praia',
    titulo: 'Melhores para praia',
    criterio: 'destinos de praia, ordenados por nota e inventário',
    destinos: topPara('praia'),
  },
  {
    id: 'serra',
    titulo: 'Melhores para serra',
    criterio: 'destinos de serra, ordenados por nota e inventário',
    destinos: topPara('serra'),
  },
  {
    id: 'fim-de-semana',
    titulo: 'Melhores para fim de semana',
    criterio: 'até 120 km da capital, ordenados por nota',
    destinos: DESTINOS.filter((d) => d.distanciaKm <= 120 && d.distanciaKm > 0)
      .sort((a, b) => b.nota - a.nota)
      .slice(0, 5),
  },
  {
    id: 'familia',
    titulo: 'Melhores com crianças',
    criterio: 'destinos marcados como família, ordenados por nota e inventário',
    destinos: topPara('familia'),
  },
  {
    id: 'economico',
    titulo: 'Melhor custo-benefício',
    criterio: 'nota a partir de 8,5, ordenados pela menor diária inicial',
    destinos: DESTINOS.filter((d) => d.nota >= 8.5)
      .sort((a, b) => a.faixaPreco.min - b.faixaPreco.min)
      .slice(0, 5),
  },
].filter((r) => r.destinos.length >= 3)
