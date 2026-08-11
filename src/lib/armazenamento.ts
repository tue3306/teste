/**
 * Armazenamento local do BI&B.
 *
 * ## Por que existe
 *
 * O produto não tem conta. Planejar uma viagem não deveria exigir cadastro, e
 * a versão anterior trancava a plataforma inteira atrás de um login que não
 * protegia nada — a credencial estava no pacote que o navegador baixava.
 *
 * Sem conta, o navegador **é** a conta. E aí a persistência deixa de ser um
 * detalhe: é o que faz a viagem sobreviver ao recarregar, ao fechar a aba e ao
 * voltar amanhã.
 *
 * ## Por que num módulo só
 *
 * Todo `localStorage.setItem` do projeto passa por aqui. Espalhar a chamada
 * pelos componentes é como um projeto acaba com quatro chaves diferentes
 * guardando a mesma coisa, uma delas com o formato antigo, e nenhuma rotina
 * capaz de apagar tudo quando o usuário pede.
 *
 * Este módulo resolve quatro coisas de uma vez:
 *
 * - **Prefixo único.** Toda chave começa com `bib:`, então dá para listar e
 *   apagar o que é nosso sem tocar no que é de outro site no mesmo domínio.
 * - **Versão no nome.** `bib:v2:viagem` — quando o formato do dado mudar, sobe
 *   a versão e o dado antigo é ignorado em vez de quebrar a tela.
 * - **Consentimento.** Quem recusa o armazenamento não tem nada gravado, e o
 *   que já existia é apagado. A recusa é respeitada na escrita, não só na
 *   leitura.
 * - **Falha silenciosa.** Modo privado do Safari, cota estourada, política de
 *   empresa: o armazenamento pode simplesmente lançar. Aqui isso vira "não
 *   guardou", nunca uma tela branca.
 */

const PREFIXO = 'bib:'
const VERSAO = 'v2'

/** Chaves conhecidas. Declarar aqui é o que evita chave solta pelo projeto. */
export const CHAVES = {
  destino: 'destino',
  datas: 'datas',
  pessoas: 'pessoas',
  preferencias: 'preferencias',
  orcamento: 'orcamento',
  favoritos: 'favoritos',
  viagem: 'viagem',
  checklist: 'checklist',
  etapa: 'etapa',
  consentimento: 'consentimento',
} as const

export type Chave = (typeof CHAVES)[keyof typeof CHAVES]

function nomeCompleto(chave: Chave): string {
  // O consentimento fica fora da versão: ele precisa sobreviver a uma troca de
  // formato dos dados, senão a pergunta volta a aparecer sem motivo.
  if (chave === CHAVES.consentimento) return `${PREFIXO}${chave}`
  return `${PREFIXO}${VERSAO}:${chave}`
}

/** O usuário permitiu guardar dados neste navegador? */
export function podeGuardar(): boolean {
  try {
    return window.localStorage.getItem(`${PREFIXO}consentimento`) !== 'recusado'
  } catch {
    return false
  }
}

/** Lê um valor. Devolve o padrão quando não existe, é inválido ou falha. */
export function ler<T>(chave: Chave, padrao: T): T {
  try {
    const bruto = window.localStorage.getItem(nomeCompleto(chave))
    if (bruto === null) return padrao
    return JSON.parse(bruto) as T
  } catch {
    // JSON corrompido por edição manual ou por versão antiga que escapou:
    // melhor voltar ao padrão do que derrubar a aplicação na primeira leitura.
    return padrao
  }
}

/** Grava um valor. Não faz nada quando o usuário recusou o armazenamento. */
export function gravar<T>(chave: Chave, valor: T): void {
  if (!podeGuardar()) return
  try {
    window.localStorage.setItem(nomeCompleto(chave), JSON.stringify(valor))
  } catch {
    // Cota cheia ou armazenamento bloqueado. O estado em memória continua
    // correto — só não sobrevive ao recarregar.
  }
}

/** Remove uma chave. */
export function remover(chave: Chave): void {
  try {
    window.localStorage.removeItem(nomeCompleto(chave))
  } catch {
    // Nada a fazer.
  }
}

/** Tudo o que o BI&B guardou, para a tela de privacidade poder listar. */
export function inventario(): { chave: string; tamanho: number }[] {
  try {
    return Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIXO))
      .map((k) => ({ chave: k, tamanho: (window.localStorage.getItem(k) ?? '').length }))
      .sort((a, b) => b.tamanho - a.tamanho)
  } catch {
    return []
  }
}

/** Apaga tudo o que é do BI&B, inclusive versões antigas. */
export function limparTudo(): void {
  try {
    for (const { chave } of inventario()) window.localStorage.removeItem(chave)
  } catch {
    // Nada a fazer.
  }
}

/**
 * Registra a decisão sobre o armazenamento.
 *
 * Recusar apaga o que já existe — de nada adianta parar de escrever e deixar o
 * que foi escrito antes.
 */
export function definirConsentimento(aceito: boolean): void {
  try {
    if (!aceito) limparTudo()
    window.localStorage.setItem(`${PREFIXO}consentimento`, aceito ? 'aceito' : 'recusado')
  } catch {
    // Sem armazenamento, não há o que consentir.
  }
}

/** A decisão já foi tomada? `null` quando ainda não. */
export function consentimento(): 'aceito' | 'recusado' | null {
  try {
    const v = window.localStorage.getItem(`${PREFIXO}consentimento`)
    return v === 'aceito' || v === 'recusado' ? v : null
  } catch {
    return null
  }
}
