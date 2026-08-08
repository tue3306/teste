import { buscarJson } from './http'
import { env } from '@/config/env'

/**
 * Busca de lugares — geocodificação Open-Meteo.
 *
 * Mesmo raciocínio do clima: sem chave, com CORS aberto e sem cadastro. O
 * Nominatim do OpenStreetMap resolveria também, mas a política de uso pede
 * User-Agent identificável e limita a 1 requisição por segundo — restrições que
 * um autocomplete no navegador não tem como respeitar direito.
 *
 * Documentação: https://open-meteo.com/en/docs/geocoding-api
 */

const BASE = 'https://geocoding-api.open-meteo.com/v1/search'

export interface Lugar {
  id: number
  nome: string
  /** Estado ou região. */
  regiao: string | null
  latitude: number
  longitude: number
  /** Rótulo pronto para exibição: "Paraty, Rio de Janeiro". */
  rotulo: string
}

interface RespostaGeocoding {
  results?: {
    id: number
    name: string
    latitude: number
    longitude: number
    admin1?: string
    country_code?: string
  }[]
}

/**
 * Cidades brasileiras que casam com o termo.
 *
 * O filtro por país é do lado do cliente de propósito: a API aceita
 * `countryCode`, mas devolve zero resultado quando o termo tem acento parcial
 * ("Sao Paulo"), enquanto a busca aberta acerta e nos deixa filtrar depois.
 */
export async function buscarLugares(termo: string, sinal?: AbortSignal): Promise<Lugar[]> {
  const limpo = termo.trim()
  if (!env.apisAbertas || limpo.length < 3) return []

  const url = `${BASE}?name=${encodeURIComponent(limpo)}&count=10&language=pt&format=json`
  const dados = await buscarJson<RespostaGeocoding>(url, sinal ? { sinal } : {})

  return (dados.results ?? [])
    .filter((r) => r.country_code === 'BR')
    .map((r) => ({
      id: r.id,
      nome: r.name,
      regiao: r.admin1 ?? null,
      latitude: r.latitude,
      longitude: r.longitude,
      rotulo: r.admin1 ? `${r.name}, ${r.admin1}` : r.name,
    }))
    .sort((a, b) => relevancia(b.nome, limpo) - relevancia(a.nome, limpo))
    .slice(0, 8)
}

/**
 * Quão bem o nome responde ao que foi digitado.
 *
 * A API ordena por população, não por semelhança: digitar "Paraty" trazia
 * "Araquari" no topo porque é uma cidade maior que casou de forma difusa.
 * Reordenar no cliente é barato e coloca o que o usuário escreveu em primeiro.
 */
function relevancia(nome: string, termo: string): number {
  const n = normalizar(nome)
  const t = normalizar(termo)
  if (n === t) return 3
  if (n.startsWith(t)) return 2
  if (n.includes(t)) return 1
  return 0
}

/** Minúsculas e sem acento, para comparar "Sao Paulo" com "São Paulo". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
