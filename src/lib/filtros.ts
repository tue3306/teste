import type { Categoria, Destino, RegiaoRJ } from '@/types'

/**
 * Motor de filtro dos destinos.
 *
 * ## A regra: OU dentro do grupo, E entre grupos
 *
 * "Costa do Sol **ou** Costa Verde" — porque escolher duas regiões significa
 * "aceito qualquer uma das duas", nunca "quero uma cidade que esteja nas duas",
 * que é impossível.
 *
 * "…**e** praia **ou** gastronomia" — o mesmo dentro do grupo de perfis, e um
 * E ligando os dois grupos: a pessoa quer um destino naquela região que atenda
 * a pelo menos um dos perfis pedidos.
 *
 * ## Por que isso importa
 *
 * A versão anterior guardava **um** valor por grupo e cruzava os dois com E
 * simples. Duas consequências:
 *
 * 1. Clicar num segundo perfil substituía o primeiro. A interface tinha
 *    `aria-pressed` e cara de multisseleção, mas só uma pílula ficava ativa —
 *    a pessoa clicava três e via uma.
 * 2. Com E simples entre um perfil e uma região, **15 das 60 combinações
 *    possíveis devolvem zero destinos** (Serrana + Praia, Costa do Sol + Serra,
 *    Norte + Aventura…). Não é dado faltando: é geografia. Mas a tela ficava
 *    vazia sem explicar nada.
 *
 * Com OU dentro do grupo, marcar mais perfis **amplia** o resultado em vez de
 * estreitá-lo, que é o que a pessoa espera ao marcar mais caixas.
 *
 * A função é pura e vive fora do componente de propósito: é a regra de negócio
 * mais fácil de errar do produto, e assim ela pode ser testada sem montar React.
 */

/** Grupos de filtro aplicados à lista de destinos. Vazio significa "todos". */
export interface Filtros {
  regioes: readonly RegiaoRJ[]
  perfis: readonly Categoria[]
}

export const FILTROS_VAZIOS: Filtros = { regioes: [], perfis: [] }

/** Um destino atende aos filtros? */
export function atende(destino: Destino, filtros: Filtros): boolean {
  // Grupo vazio não restringe nada — é o "Todas as regiões" implícito.
  const regiaoOk =
    filtros.regioes.length === 0 || filtros.regioes.includes(destino.regiao)

  const perfilOk =
    filtros.perfis.length === 0 ||
    filtros.perfis.some((p) => destino.categorias.includes(p))

  return regiaoOk && perfilOk
}

/** Aplica os filtros a uma lista de destinos. */
export function filtrar(destinos: readonly Destino[], filtros: Filtros): Destino[] {
  return destinos.filter((d) => atende(d, filtros))
}

/** Verdadeiro quando nenhum filtro está aplicado. */
export function semFiltros(filtros: Filtros): boolean {
  return filtros.regioes.length === 0 && filtros.perfis.length === 0
}

/** Quantos filtros estão marcados ao todo. */
export function contarFiltros(filtros: Filtros): number {
  return filtros.regioes.length + filtros.perfis.length
}

/** Liga ou desliga um valor dentro de um grupo, devolvendo filtros novos. */
export function alternar<G extends keyof Filtros>(
  filtros: Filtros,
  grupo: G,
  valor: Filtros[G][number],
): Filtros {
  const atual = filtros[grupo] as readonly (typeof valor)[]
  const proximo = atual.includes(valor)
    ? atual.filter((v) => v !== valor)
    : [...atual, valor]
  return { ...filtros, [grupo]: proximo }
}

/**
 * Sugestões de como sair de um resultado vazio.
 *
 * Quando o cruzamento não devolve nada, dizer "nenhum resultado" não ajuda —
 * a pessoa não sabe qual dos filtros é o culpado. Esta função descobre isso:
 * remove um grupo de cada vez e mede o que voltaria.
 *
 * "Sem o filtro de perfil você veria 5 destinos" é acionável; "0 resultados"
 * não é.
 */
export interface Saida {
  /** Qual grupo soltar. */
  grupo: keyof Filtros
  /** Quantos destinos apareceriam ao soltá-lo. */
  quantidade: number
}

export function saidas(destinos: readonly Destino[], filtros: Filtros): Saida[] {
  const opcoes: Saida[] = []

  if (filtros.regioes.length > 0) {
    opcoes.push({
      grupo: 'regioes',
      quantidade: filtrar(destinos, { ...filtros, regioes: [] }).length,
    })
  }
  if (filtros.perfis.length > 0) {
    opcoes.push({
      grupo: 'perfis',
      quantidade: filtrar(destinos, { ...filtros, perfis: [] }).length,
    })
  }

  // Só vale sugerir o que de fato traz resultado, e o que traz mais primeiro.
  return opcoes.filter((o) => o.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade)
}

/** Critério de ordenação da lista de destinos. */
export type OrdemDestino = 'relevancia' | 'nota' | 'perto' | 'barato' | 'nome'

export const ORDENS: { id: OrdemDestino; label: string }[] = [
  { id: 'relevancia', label: 'Mais procurados' },
  { id: 'nota', label: 'Melhor avaliados' },
  { id: 'perto', label: 'Mais perto do Rio' },
  { id: 'barato', label: 'Menor diária' },
  { id: 'nome', label: 'Ordem alfabética' },
]

/**
 * Ordena os destinos.
 *
 * "Mais procurados" não inventa número de busca: é a nota do destino combinada
 * com o tamanho do inventário, que são os dois sinais que o projeto realmente
 * tem. Um contador de buscas fabricado seria mentira apresentada como dado.
 */
export function ordenar(
  destinos: readonly Destino[],
  ordem: OrdemDestino,
  tamanhoInventario: (id: string) => number,
): Destino[] {
  const lista = [...destinos]
  switch (ordem) {
    case 'nota':
      return lista.sort((a, b) => b.nota - a.nota)
    case 'perto':
      return lista.sort((a, b) => a.distanciaKm - b.distanciaKm)
    case 'barato':
      return lista.sort((a, b) => a.faixaPreco.min - b.faixaPreco.min)
    case 'nome':
      return lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    case 'relevancia':
      return lista.sort(
        (a, b) =>
          b.nota * 10 + tamanhoInventario(b.id) - (a.nota * 10 + tamanhoInventario(a.id)),
      )
  }
}
