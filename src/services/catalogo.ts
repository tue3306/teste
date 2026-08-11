import { CATALOGO, ITEM_POR_ID, itensDe, itensDoDestino } from '@/data/rj'
import type { Oferta, Vertical } from '@/types'

/**
 * Camada de serviço do catálogo.
 *
 * Tudo o que a interface lista passa por aqui. É a fronteira que separa
 * "de onde vem o inventário" de "como o inventário é exibido" — hoje a origem é
 * um catálogo local tipado, amanhã é um backend, e nenhuma tela precisa saber
 * disso.
 *
 * ## Por que síncrono
 *
 * As funções devolvem valor direto, e não `Promise`. Enquanto a origem é local,
 * um `async` seria cerimônia: obrigaria cada lista a ter estado de carregamento
 * para algo que nunca demora, e um esqueleto que pisca por zero milissegundo é
 * pior que nenhum. Quando o backend entrar, o ponto de troca é
 * `services/provedores.ts` — que já é assíncrono, já trata falha e já devolve
 * `Oferta[]` normalizado — e as listas passam a consumi-lo por `useRecurso`,
 * que também já existe e já trata os três estados.
 *
 * ## Origem dos dados
 *
 * O catálogo é de **demonstração**. Destinos, coordenadas, distâncias e
 * atrações são reais; estabelecimentos, preços e avaliações foram escritos para
 * o exemplo. Nada aqui se apresenta como resultado de busca ao vivo, e nenhuma
 * função desta camada finge ter falado com uma API.
 */

/** Uma consulta ao catálogo. Todos os campos são opcionais e se combinam por E. */
export interface Consulta {
  destino?: string
  /** Teto de preço unitário, em reais. */
  precoMax?: number
  /** Ids de faceta que o item precisa satisfazer — todas elas. */
  facetas?: string[]
  /** Nota mínima, de 0 a 10. */
  notaMin?: number
}

function atende(item: Oferta, c: Consulta): boolean {
  if (c.destino !== undefined && item.destino !== c.destino) return false
  if (c.precoMax !== undefined && item.preco > c.precoMax) return false
  if (c.notaMin !== undefined && item.nota < c.notaMin) return false
  if (c.facetas && !c.facetas.every((f) => item.facetas.includes(f))) return false
  return true
}

/** Constrói o serviço de uma vertical. */
function servico(vertical: Vertical) {
  return {
    vertical,
    /** Todos os itens da vertical, opcionalmente filtrados. */
    listar(consulta: Consulta = {}): Oferta[] {
      return itensDe(vertical, consulta.destino).filter((o) => atende(o, consulta))
    },
    /** Um item pelo id, ou `undefined`. */
    porId(id: string): Oferta | undefined {
      const achado = ITEM_POR_ID.get(id)
      return achado?.vertical === vertical ? achado : undefined
    },
    /** Quantos itens desta vertical existem num destino. */
    contar(destino: string): number {
      return itensDe(vertical, destino).length
    },
  }
}

export const voosService = servico('voos')
export const hospedagemService = servico('hoteis')
export const passeioService = servico('passeios')
export const restauranteService = servico('restaurantes')
export const eventoService = servico('eventos')
export const carroService = servico('carros')

/** Índice por vertical, para quem precisa escolher o serviço em tempo de execução. */
export const SERVICOS: Record<Vertical, ReturnType<typeof servico>> = {
  voos: voosService,
  hoteis: hospedagemService,
  passeios: passeioService,
  restaurantes: restauranteService,
  eventos: eventoService,
  carros: carroService,
}

/** Todo o inventário de um destino, seja qual for a vertical. */
export function inventarioDoDestino(destino: string): Oferta[] {
  return itensDoDestino(destino)
}

/** Resolve uma lista de ids — favoritos e a viagem montada, por exemplo. */
export function resolverIds(ids: readonly string[]): Oferta[] {
  return ids.map((id) => ITEM_POR_ID.get(id)).filter((o): o is Oferta => o !== undefined)
}

/** O catálogo inteiro. Usado pelo motor de orçamento, que soma sobre tudo. */
export function catalogoCompleto(): Oferta[] {
  return CATALOGO
}
