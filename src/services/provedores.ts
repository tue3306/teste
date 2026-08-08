import { buscarJson } from './http'
import { env } from '@/config/env'
import type { Oferta, Vertical } from '@/types'
import { OFERTAS_POR_VERTICAL } from '@/data/ofertas'

/**
 * Ponte com os provedores comerciais de inventário.
 *
 * Amadeus, Hotelbeds, Booking e Expedia **não podem** ser chamados do
 * navegador: todos exigem segredo de cliente ou assinatura de requisição, e
 * qualquer credencial que chegue ao bundle está publicada. Booking e Expedia,
 * além disso, só liberam a API sob contrato de afiliado.
 *
 * O desenho, então, é este: um backend próprio guarda os segredos, fala com os
 * provedores e devolve `Oferta[]` já normalizado. O front-end conhece apenas
 * `VITE_API_BASE`. Enquanto esse backend não existe, `buscarOfertas` devolve o
 * catálogo local — a interface funciona igual, e `origem` diz de onde veio o
 * dado para a tela poder ser honesta sobre isso.
 *
 * O contrato que o backend precisa cumprir está em README.md, seção
 * "Integrações externas".
 */

export type OrigemDados = 'local' | 'api'

export interface ResultadoOfertas {
  ofertas: Oferta[]
  origem: OrigemDados
}

interface RespostaBackend {
  ofertas?: Oferta[]
}

export interface ConsultaOfertas {
  vertical: Vertical
  destino: string
  latitude?: number
  longitude?: number
}

/**
 * Ofertas de uma vertical.
 *
 * Sem `VITE_API_BASE` configurada, responde do catálogo local sem tocar a rede.
 * Com a variável definida, consulta o backend e cai para o catálogo local se a
 * chamada falhar — uma indisponibilidade do provedor não pode deixar a página
 * em branco.
 */
export async function buscarOfertas(
  consulta: ConsultaOfertas,
  sinal?: AbortSignal,
): Promise<ResultadoOfertas> {
  const local: ResultadoOfertas = {
    ofertas: OFERTAS_POR_VERTICAL[consulta.vertical],
    origem: 'local',
  }

  if (!env.apiBase) return local

  const params = new URLSearchParams({ vertical: consulta.vertical, destino: consulta.destino })
  if (consulta.latitude !== undefined) params.set('lat', consulta.latitude.toFixed(4))
  if (consulta.longitude !== undefined) params.set('lon', consulta.longitude.toFixed(4))

  try {
    const dados = await buscarJson<RespostaBackend>(
      `${env.apiBase}/ofertas?${params.toString()}`,
      sinal ? { sinal } : {},
    )
    if (!dados.ofertas?.length) return local
    return { ofertas: dados.ofertas, origem: 'api' }
  } catch {
    // Provedor fora do ar: segue com o catálogo local em vez de quebrar a tela.
    return local
  }
}
