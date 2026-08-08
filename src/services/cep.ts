import { buscarJson } from './http'
import { env } from '@/config/env'

/**
 * Consulta de CEP — ViaCEP.
 *
 * Público, sem chave e com CORS aberto. Usado no cadastro de cobrança para
 * poupar digitação: informado o CEP, cidade e estado vêm preenchidos.
 *
 * Documentação: https://viacep.com.br/
 */

export interface Endereco {
  cep: string
  logradouro: string
  bairro: string
  cidade: string
  uf: string
}

interface RespostaViaCep {
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean | string
}

/** Só os dígitos: aceita "22071-900", "22071900" e "22.071-900". */
function normalizar(cep: string): string {
  return cep.replace(/\D/g, '')
}

/** Endereço do CEP, ou `null` se o CEP for inválido ou não existir. */
export async function buscarEndereco(cep: string, sinal?: AbortSignal): Promise<Endereco | null> {
  const digitos = normalizar(cep)
  if (!env.apisAbertas || digitos.length !== 8) return null

  try {
    const dados = await buscarJson<RespostaViaCep>(
      `https://viacep.com.br/ws/${digitos}/json/`,
      sinal ? { sinal } : {},
    )

    // O ViaCEP responde 200 com `{"erro": "true"}` para CEP inexistente — o
    // status HTTP sozinho não distingue os dois casos.
    if (dados.erro === true || dados.erro === 'true' || !dados.localidade) return null

    return {
      cep: dados.cep ?? digitos,
      logradouro: dados.logradouro ?? '',
      bairro: dados.bairro ?? '',
      cidade: dados.localidade,
      uf: dados.uf ?? '',
    }
  } catch {
    return null
  }
}
