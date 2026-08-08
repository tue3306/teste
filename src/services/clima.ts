import { buscarJson } from './http'
import { env } from '@/config/env'

/**
 * Previsão do tempo — Open-Meteo.
 *
 * Escolhida entre as alternativas por três motivos práticos: não pede chave
 * (nada de segredo no bundle), responde com `Access-Control-Allow-Origin: *`
 * (chamada direta do navegador, sem proxy) e é gratuita para uso não comercial
 * sem cadastro. OpenWeather e similares exigiriam uma chave que, exposta no
 * cliente, qualquer um copiaria.
 *
 * Documentação: https://open-meteo.com/en/docs
 */

const BASE = 'https://api.open-meteo.com/v1/forecast'

/** Um dia de previsão, já traduzido para o vocabulário do produto. */
export interface DiaPrevisao {
  /** Data ISO (AAAA-MM-DD). */
  data: string
  maxima: number
  minima: number
  /** Probabilidade de chuva, de 0 a 100. */
  chuva: number
  /** Descrição curta em português ("sol", "chuva", "nublado"). */
  condicao: string
  /** Emoji correspondente, para uso decorativo. */
  icone: string
}

interface RespostaOpenMeteo {
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    precipitation_probability_max?: number[]
    weather_code?: number[]
  }
}

/**
 * Código WMO → texto e ícone.
 *
 * A tabela é explícita, código a código, e não uma escada de faixas. A versão
 * por faixa agrupava garoa (51–55) junto com chuva (61–65), e o resultado era
 * um dia de 36°C com 6% de chance de precipitação exibindo nuvem de chuva —
 * incoerente para quem está decidindo entre praia e museu. Garoa e chuva são
 * previsões diferentes e agora aparecem diferentes.
 *
 * Referência: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */
const CONDICOES: Record<number, { condicao: string; icone: string }> = {
  0: { condicao: 'céu limpo', icone: '☀️' },
  1: { condicao: 'sol entre nuvens', icone: '🌤️' },
  2: { condicao: 'parcialmente nublado', icone: '⛅' },
  3: { condicao: 'encoberto', icone: '☁️' },
  45: { condicao: 'neblina', icone: '🌫️' },
  48: { condicao: 'nevoeiro', icone: '🌫️' },
  51: { condicao: 'garoa fraca', icone: '🌦️' },
  53: { condicao: 'garoa', icone: '🌦️' },
  55: { condicao: 'garoa forte', icone: '🌦️' },
  56: { condicao: 'garoa gelada', icone: '🌧️' },
  57: { condicao: 'garoa gelada', icone: '🌧️' },
  61: { condicao: 'chuva fraca', icone: '🌧️' },
  63: { condicao: 'chuva', icone: '🌧️' },
  65: { condicao: 'chuva forte', icone: '🌧️' },
  66: { condicao: 'chuva gelada', icone: '🌧️' },
  67: { condicao: 'chuva gelada', icone: '🌧️' },
  71: { condicao: 'neve fraca', icone: '🌨️' },
  73: { condicao: 'neve', icone: '🌨️' },
  75: { condicao: 'neve forte', icone: '🌨️' },
  77: { condicao: 'granizo fino', icone: '🌨️' },
  80: { condicao: 'pancadas isoladas', icone: '🌦️' },
  81: { condicao: 'pancadas', icone: '🌦️' },
  82: { condicao: 'pancadas fortes', icone: '⛈️' },
  85: { condicao: 'pancadas de neve', icone: '🌨️' },
  86: { condicao: 'pancadas de neve', icone: '🌨️' },
  95: { condicao: 'tempestade', icone: '⛈️' },
  96: { condicao: 'tempestade com granizo', icone: '⛈️' },
  99: { condicao: 'tempestade com granizo', icone: '⛈️' },
}

function traduzirCodigo(codigo: number): { condicao: string; icone: string } {
  return CONDICOES[codigo] ?? { condicao: 'variável', icone: '🌥️' }
}

/** Previsão diária de um ponto, para os próximos `dias` dias. */
export async function buscarPrevisao(
  latitude: number,
  longitude: number,
  dias = 7,
  sinal?: AbortSignal,
): Promise<DiaPrevisao[]> {
  if (!env.apisAbertas) return []

  const url =
    `${BASE}?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}` +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code' +
    `&timezone=America%2FSao_Paulo&forecast_days=${String(Math.min(dias, 16))}`

  const dados = await buscarJson<RespostaOpenMeteo>(url, sinal ? { sinal } : {})
  const d = dados.daily
  if (!d?.time) return []

  return d.time.map((data, i) => {
    const { condicao, icone } = traduzirCodigo(d.weather_code?.[i] ?? 0)
    return {
      data,
      maxima: Math.round(d.temperature_2m_max?.[i] ?? 0),
      minima: Math.round(d.temperature_2m_min?.[i] ?? 0),
      chuva: Math.round(d.precipitation_probability_max?.[i] ?? 0),
      condicao,
      icone,
    }
  })
}
