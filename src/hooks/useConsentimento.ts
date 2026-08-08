import { useSyncExternalStore } from 'react'

/**
 * Consentimento de armazenamento local.
 *
 * Este site não usa cookie nenhum e não tem rastreador. O que ele guarda são
 * preferências suas — favoritos, reservas, checklist, roteiro editado e a opção
 * de movimento — todas no `localStorage` do seu próprio aparelho, sem sair
 * dele.
 *
 * Pela LGPD, dado que não identifica ninguém e não deixa o aparelho não exige
 * consentimento prévio. Mesmo assim há um aviso, por dois motivos práticos: o
 * usuário tem direito de saber o que está sendo guardado, e tem direito de
 * apagar. Recusar aqui não é decoração — apaga o que existe e impede novas
 * gravações pelo resto da sessão.
 *
 * O que existe aqui é transparência com botão, não um banner de cookie que
 * pergunta algo cuja resposta não muda nada.
 */

export type Consentimento = 'pendente' | 'aceito' | 'recusado'

const CHAVE = 'bib:consentimento'
/** Prefixo de tudo que este site grava. */
export const PREFIXO_DADOS = 'bib:'

function lerArmazenado(): Consentimento {
  try {
    const bruto = window.localStorage.getItem(CHAVE)
    return bruto === 'aceito' || bruto === 'recusado' ? bruto : 'pendente'
  } catch {
    return 'pendente'
  }
}

let estado: Consentimento = lerArmazenado()
const ouvintes = new Set<() => void>()

function avisar() {
  for (const o of ouvintes) o()
}

/** Pode gravar preferências? Enquanto pendente, sim — nada aqui é rastreamento. */
export function podeGuardar(): boolean {
  return estado !== 'recusado'
}

/** Lista o que está guardado agora, para a pessoa poder conferir. */
export function dadosGuardados(): { chave: string; tamanho: number }[] {
  try {
    return Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIXO_DADOS) && k !== CHAVE)
      .map((k) => ({ chave: k, tamanho: (window.localStorage.getItem(k) ?? '').length }))
      .sort((a, b) => a.chave.localeCompare(b.chave))
  } catch {
    return []
  }
}

/** Apaga tudo que o site guardou, menos o próprio registro da escolha. */
export function apagarDados() {
  try {
    for (const { chave } of dadosGuardados()) window.localStorage.removeItem(chave)
  } catch {
    // Armazenamento bloqueado: não havia o que apagar.
  }
  avisar()
}

export function definirConsentimento(novo: Consentimento) {
  estado = novo
  try {
    window.localStorage.setItem(CHAVE, novo)
  } catch {
    // Sem persistência, vale só nesta sessão.
  }
  // Recusar não é só parar de gravar daqui em diante: o que já existe sai.
  if (novo === 'recusado') apagarDados()
  avisar()
}

function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar)
  return () => {
    ouvintes.delete(aoMudar)
  }
}

/** Valor assumido no servidor / pré-render, onde não há `localStorage`. */
const NO_SERVIDOR = (): Consentimento => 'aceito'

export function useConsentimento(): Consentimento {
  return useSyncExternalStore(assinar, () => estado, NO_SERVIDOR)
}

/** Reabre o aviso, para quem quiser rever a escolha. */
export function reabrirAviso() {
  estado = 'pendente'
  try {
    window.localStorage.removeItem(CHAVE)
  } catch {
    // Ignora.
  }
  avisar()
}
