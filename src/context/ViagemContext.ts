import { createContext, use } from 'react'
import type { Busca, DiaRoteiro, ItemRoteiro, Mensagem } from '@/types'

export interface ViagemContexto {
  /** Parâmetros da busca, compartilhados entre o site e a plataforma. */
  busca: Busca
  atualizarBusca: (campo: keyof Busca, valor: string) => void

  /** Ids de oferta salvos, persistidos entre sessões. */
  favoritos: string[]
  alternarFavorito: (id: string) => void
  ehFavorito: (id: string) => boolean

  /** Ids de oferta reservados, persistidos entre sessões. */
  reservas: string[]
  reservar: (id: string) => void
  ehReservada: (id: string) => boolean

  /** Ids do checklist já concluídos, persistidos entre sessões. */
  checklist: string[]
  alternarChecklist: (id: string) => void

  /** Roteiro da viagem, editável e persistido. */
  roteiro: DiaRoteiro[]
  /** Move uma parada uma posição para cima (−1) ou para baixo (+1). */
  moverParada: (dia: number, indice: number, direcao: -1 | 1) => void
  /** Acrescenta uma parada ao fim do dia informado. */
  adicionarParada: (dia: number, item: ItemRoteiro) => void
  /** Devolve o roteiro ao estado gerado pela IA. */
  restaurarRoteiro: () => void

  /** Conversa com a Bia. */
  chat: Mensagem[]
  enviarMensagem: (texto: string) => void
  biaDigitando: boolean
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
