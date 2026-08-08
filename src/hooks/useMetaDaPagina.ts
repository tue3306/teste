import { useEffect } from 'react'

const TITULO_BASE = 'BI&B'

/**
 * Ajusta título, descrição e URL canônica conforme a rota.
 *
 * Numa SPA o `<head>` do `index.html` é escrito uma vez e nunca mais muda — o
 * usuário navega para a plataforma e a aba continua anunciando a home. Isso
 * quebra histórico, favoritos e compartilhamento. Como não há SSR, esta é a
 * forma correta de manter os metadados coerentes no cliente.
 */
export function useMetaDaPagina(titulo: string, descricao?: string) {
  useEffect(() => {
    document.title = titulo === TITULO_BASE ? titulo : `${titulo} · ${TITULO_BASE}`

    if (descricao) {
      definirMeta('name', 'description', descricao)
      definirMeta('property', 'og:description', descricao)
    }
    definirMeta('property', 'og:title', titulo)

    const canonica = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonica) canonica.href = new URL(window.location.pathname, window.location.origin).href
  }, [titulo, descricao])
}

function definirMeta(atributo: 'name' | 'property', chave: string, valor: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${chave}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(atributo, chave)
    document.head.appendChild(tag)
  }
  tag.content = valor
}
