import { createContext, use } from 'react'
import type { Busca, Destino, Oferta, Pessoas } from '@/types'
import type { ContextoViagem, Orcamento } from '@/lib/orcamento'

export interface ViagemContexto {
  /** Parâmetros da busca, compartilhados entre o site e a plataforma. */
  busca: Busca
  /** Troca um campo simples da busca. */
  definirBusca: <C extends keyof Busca>(campo: C, valor: Busca[C]) => void
  /** Ajusta uma faixa etária do grupo. Nunca deixa o número ficar negativo. */
  definirPessoas: (faixa: keyof Pessoas, valor: number) => void

  /** Destino resolvido a partir da busca; nunca nulo. */
  destino: Destino

  /** Noites, dias e quartos derivados das datas e do grupo. */
  contexto: ContextoViagem
  /** Quartos escolhidos à mão; `null` significa "usar o sugerido". */
  definirQuartos: (quartos: number | null) => void

  /** Ids de item salvos, persistidos entre sessões. */
  favoritos: string[]
  alternarFavorito: (id: string) => void
  ehFavorito: (id: string) => boolean

  /**
   * A viagem montada: id do item para quantidade.
   *
   * Guardar a quantidade em vez de repetir o id numa lista deixa "tirar um dos
   * dois passeios" ser uma subtração, e não uma busca pelo índice certo.
   */
  selecao: Record<string, number>
  /** Acrescenta uma unidade do item. Em verticais de escolha única, substitui. */
  adicionar: (item: Oferta) => void
  /** Remove uma unidade. Em zero, o item sai da viagem. */
  remover: (id: string) => void
  /** Tira o item da viagem, seja qual for a quantidade. */
  descartar: (id: string) => void
  /** Quantas unidades deste item estão na viagem. */
  quantidade: (id: string) => number
  /** Esvazia a viagem. */
  limparViagem: () => void

  /** Os itens escolhidos, resolvidos do catálogo. */
  itensEscolhidos: Oferta[]
  /** O extrato completo, recalculado a cada mudança. */
  orcamento: Orcamento

  /** Ids do checklist já concluídos, persistidos entre sessões. */
  checklist: string[]
  alternarChecklist: (id: string) => void
}

export const ViagemContext = createContext<ViagemContexto | null>(null)

/** Acessa o estado da viagem. Lança se usado fora do provider. */
export function useViagem(): ViagemContexto {
  const ctx = use(ViagemContext)
  if (!ctx) {
    throw new Error('useViagem precisa estar dentro de <ViagemProvider>.')
  }
  return ctx
}
