/**
 * Configuração vinda do ambiente.
 *
 * Tudo aqui é lido de `import.meta.env`, que o Vite substitui no build. Só
 * variáveis com prefixo `VITE_` chegam ao cliente — e é justamente por isso que
 * **nenhum segredo pode passar por aqui**: o valor termina embutido no bundle,
 * legível por qualquer visitante.
 *
 * Chaves de provedores comerciais (Amadeus, Hotelbeds, Google Places) exigem
 * segredo de servidor. O lugar delas é num backend que assina a requisição; o
 * front-end fala com esse backend, cujo endereço é `VITE_API_BASE`. Ver
 * `.env.example` e a seção de integrações no README.
 */

interface Ambiente {
  /** Base do backend próprio que fala com os provedores comerciais. */
  apiBase: string | null
  /** URL pública do site, usada em canonical, sitemap e Open Graph. */
  siteUrl: string
  /** Chave pública do Unsplash — só para busca de imagem sob demanda. */
  unsplash: string | null
  /** Chave pública do Google Maps JS, restrita por domínio no console. */
  googleMaps: string | null
  /** Liga chamadas às APIs abertas (clima, geocodificação, CEP). */
  apisAbertas: boolean
}

function texto(valor: unknown): string | null {
  const v = typeof valor === 'string' ? valor.trim() : ''
  return v.length > 0 ? v : null
}

export const env: Ambiente = {
  apiBase: texto(import.meta.env['VITE_API_BASE']),
  siteUrl: texto(import.meta.env['VITE_SITE_URL']) ?? 'https://bib.com.br',
  unsplash: texto(import.meta.env['VITE_UNSPLASH_ACCESS_KEY']),
  googleMaps: texto(import.meta.env['VITE_GOOGLE_MAPS_KEY']),
  apisAbertas: import.meta.env['VITE_APIS_ABERTAS'] !== 'false',
}
