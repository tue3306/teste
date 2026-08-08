/**
 * Formatação pt-BR.
 *
 * Os formatadores do `Intl` são criados uma vez e reaproveitados: construir um
 * `Intl.NumberFormat` é caro e o protótipo chamava `toLocaleString` dentro de
 * `map()` a cada renderização da lista.
 */

const MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const INTEIRO = new Intl.NumberFormat('pt-BR')

/** O `Intl` separa símbolo e número com espaço não separável (U+00A0). */
const ESPACO_NAO_SEPARAVEL = /\u00A0/g

/** Formata reais sem centavos: `612` → `R$ 612`. */
export function moeda(valor: number): string {
  // Trocar o U+00A0 por espaço comum deixa o valor copiável e comparável como
  // qualquer outro texto do site.
  return MOEDA.format(valor).replace(ESPACO_NAO_SEPARAVEL, ' ')
}

/** Formata um inteiro com separador de milhar: `1842` → `1.842`. */
export function inteiro(valor: number): string {
  return INTEIRO.format(valor)
}

/** Nota de 0 a 10 com uma casa e vírgula decimal: `9.5` → `9,5`. */
export function nota(valor: number): string {
  return valor.toFixed(1).replace('.', ',')
}

/** Desconto percentual arredondado: `(612, 748)` → `−18%`. */
export function desconto(preco: number, referencia: number): string {
  if (referencia <= 0) return '−0%'
  return `−${String(Math.round((1 - preco / referencia) * 100))}%`
}

/** Economia absoluta em relação à média do mercado. */
export function economia(preco: number, referencia: number): string {
  return `−${moeda(referencia - preco)} vs. média`
}

/**
 * Primeiros `n` segmentos de uma linha de detalhe separada por " · ".
 * `"Copacabana · 120 m da praia · 4 estrelas"` → `"Copacabana · 120 m da praia"`.
 */
export function resumo(sub: string, n = 2): string {
  return sub.split(' · ').slice(0, n).join(' · ')
}
