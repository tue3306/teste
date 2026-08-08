/**
 * Cliente HTTP compartilhado.
 *
 * Três coisas que `fetch` puro não faz e toda chamada precisa: prazo máximo,
 * cancelamento encadeado e erro tipado. Sem prazo, uma API lenta deixa o
 * esqueleto de carregamento girando para sempre; sem cancelamento, a resposta
 * de um destino antigo sobrescreve a do destino que o usuário acabou de
 * escolher.
 */

export class ErroHttp extends Error {
  // Campos declarados e atribuídos no corpo, não como parâmetros de construtor:
  // `erasableSyntaxOnly` proíbe a forma abreviada, porque ela emite código em
  // vez de sumir na compilação.
  status: number | null
  url: string

  constructor(message: string, status: number | null, url: string) {
    super(message)
    this.name = 'ErroHttp'
    this.status = status
    this.url = url
  }
}

interface Opcoes {
  /** Prazo máximo em milissegundos. Padrão: 8000. */
  prazo?: number
  /** Sinal externo, para cancelar junto com o componente. */
  sinal?: AbortSignal
}

const PRAZO_PADRAO = 8000

/** Busca JSON com prazo, cancelamento e erro tipado. */
export async function buscarJson<T>(url: string, { prazo = PRAZO_PADRAO, sinal }: Opcoes = {}): Promise<T> {
  const porPrazo = AbortSignal.timeout(prazo)
  const combinado = sinal ? AbortSignal.any([sinal, porPrazo]) : porPrazo

  let resposta: Response
  try {
    resposta = await fetch(url, {
      signal: combinado,
      headers: { Accept: 'application/json' },
    })
  } catch (erro) {
    // Cancelamento pelo componente não é falha: propaga para quem chamou
    // decidir, sem virar mensagem de erro na tela.
    if (sinal?.aborted) throw erro
    const motivo = porPrazo.aborted ? 'tempo esgotado' : 'falha de rede'
    throw new ErroHttp(motivo, null, url)
  }

  if (!resposta.ok) {
    throw new ErroHttp(`resposta ${String(resposta.status)}`, resposta.status, url)
  }

  return (await resposta.json()) as T
}
