import type { Oferta, Pessoas, Unidade } from '@/types'

/**
 * Motor de orçamento da viagem.
 *
 * Um número só importa aqui: **quantas vezes cada item é cobrado**. Passagem
 * multiplica por passageiro, diária por noite e por quarto, carro por dia de
 * locação, ingresso por pessoa. Somar tudo como se fosse valor fechado — que é
 * o que a versão anterior fazia — produz um total que não corresponde a viagem
 * nenhuma: dava R$ 5.240 de total com R$ 6.230 só de hotel dentro.
 *
 * Toda a aritmética da plataforma passa por este arquivo. Nenhum componente
 * multiplica preço por conta própria, e não existe total escrito à mão em lugar
 * algum.
 */

/**
 * Fração da tarifa cheia que cada faixa etária paga.
 *
 * São as faixas que companhias aéreas e operadoras de passeio realmente usam:
 * bebê de colo não ocupa assento e não paga; criança de 2 a 11 paga uma
 * fração; de 12 anos em diante é tarifa cheia.
 */
export const FATOR_IDADE = {
  adulto: 1,
  crianca: 0.7,
  bebe: 0,
} as const

/** Hóspedes por quarto usados para sugerir a quantidade de quartos. */
const POR_QUARTO = 2

/** Contexto da viagem: o que multiplica os preços. */
export interface ContextoViagem {
  pessoas: Pessoas
  /** Noites de hospedagem. */
  noites: number
  /** Dias de locação de carro — normalmente noites + 1. */
  dias: number
  /** Quartos reservados. */
  quartos: number
}

/** Total de corpos, incluindo bebês. Serve para lotação, não para preço. */
export function totalPessoas(p: Pessoas): number {
  return p.adultos + p.criancas + p.bebes
}

/**
 * Passageiros equivalentes: o número por que se multiplica um preço "por
 * pessoa". Dois adultos e uma criança dão 2,7 — não 3.
 */
export function pessoasPagantes(p: Pessoas): number {
  return (
    p.adultos * FATOR_IDADE.adulto +
    p.criancas * FATOR_IDADE.crianca +
    p.bebes * FATOR_IDADE.bebe
  )
}

/** Quartos sugeridos para o grupo. Bebês não contam para a lotação. */
export function quartosSugeridos(p: Pessoas): number {
  return Math.max(1, Math.ceil((p.adultos + p.criancas) / POR_QUARTO))
}

/** Noites entre duas datas ISO. Devolve 0 quando as datas não fazem sentido. */
export function noitesEntre(ida: string, volta: string): number {
  const a = Date.parse(ida)
  const b = Date.parse(volta)
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0
  return Math.round((b - a) / 86_400_000)
}

/**
 * Quantas vezes um item é cobrado, dada a composição da viagem.
 *
 * É a única função que sabe traduzir uma unidade em um multiplicador. Quem
 * precisa do subtotal chama `subtotal`; quem precisa explicar a conta ao
 * usuário chama esta e mostra o número.
 */
export function multiplicador(unidade: Unidade, ctx: ContextoViagem): number {
  switch (unidade) {
    case 'pessoa':
      return pessoasPagantes(ctx.pessoas)
    case 'noite':
      return ctx.noites * ctx.quartos
    case 'dia':
      return ctx.dias
    case 'unico':
      return 1
  }
}

/** Frase curta que explica o multiplicador, exibida embaixo do subtotal. */
export function explicarMultiplicador(unidade: Unidade, ctx: ContextoViagem): string {
  const plural = (n: number, um: string, muitos: string) =>
    `${String(n)} ${n === 1 ? um : muitos}`

  switch (unidade) {
    case 'pessoa': {
      const eq = pessoasPagantes(ctx.pessoas)
      const inteiro = Number.isInteger(eq)
      return inteiro
        ? `× ${plural(eq, 'passageiro', 'passageiros')}`
        : `× ${eq.toFixed(1).replace('.', ',')} passageiros (criança paga 70%)`
    }
    case 'noite':
      return ctx.quartos > 1
        ? `× ${plural(ctx.noites, 'noite', 'noites')} × ${plural(ctx.quartos, 'quarto', 'quartos')}`
        : `× ${plural(ctx.noites, 'noite', 'noites')}`
    case 'dia':
      return `× ${plural(ctx.dias, 'dia', 'dias')}`
    case 'unico':
      return 'valor fechado'
  }
}

/** Quanto este item custa na viagem inteira, pelo preço BI&B. */
export function subtotal(item: Oferta, ctx: ContextoViagem): number {
  return Math.round(item.preco * multiplicador(item.unidade, ctx))
}

/** Quanto o mesmo item custaria pelo preço médio de mercado. */
export function subtotalMercado(item: Oferta, ctx: ContextoViagem): number {
  return Math.round(item.outros * multiplicador(item.unidade, ctx))
}

/** Uma linha do extrato da viagem. */
export interface LinhaOrcamento {
  item: Oferta
  /** Quantas unidades desta linha — 2 passeios iguais, por exemplo. */
  quantidade: number
  /** Multiplicador aplicado a cada unidade. */
  fator: number
  /** Explicação do multiplicador, em texto. */
  explicacao: string
  total: number
  totalMercado: number
}

/** O extrato inteiro, com os agregados que a tela de "Minha viagem" mostra. */
export interface Orcamento {
  linhas: LinhaOrcamento[]
  /** Soma dos preços BI&B. */
  total: number
  /** Soma dos preços médios de mercado. */
  totalMercado: number
  /** Diferença entre os dois, em reais. Nunca negativa. */
  economia: number
  /** A mesma diferença em porcentagem do preço de mercado. */
  economiaPercentual: number
  /** Total dividido pelas pessoas que efetivamente viajam. */
  porPessoa: number
  /** Quanto sobra do orçamento declarado; negativo quando estoura. */
  sobra: number
  /** Verdadeiro quando o total passou do orçamento declarado. */
  estourou: boolean
}

/**
 * Monta o extrato.
 *
 * `selecao` é um mapa de id do item para quantidade. Guardar a quantidade em
 * vez de repetir o id na lista deixa "remover um dos dois passeios" ser uma
 * operação de subtração, e não uma busca pelo índice certo.
 */
export function calcularOrcamento(
  itens: readonly Oferta[],
  selecao: Readonly<Record<string, number>>,
  ctx: ContextoViagem,
  orcamentoDeclarado = 0,
): Orcamento {
  const linhas: LinhaOrcamento[] = []

  for (const item of itens) {
    const quantidade = selecao[item.id] ?? 0
    if (quantidade <= 0) continue

    const fator = multiplicador(item.unidade, ctx)
    linhas.push({
      item,
      quantidade,
      fator,
      explicacao: explicarMultiplicador(item.unidade, ctx),
      total: subtotal(item, ctx) * quantidade,
      totalMercado: subtotalMercado(item, ctx) * quantidade,
    })
  }

  const total = linhas.reduce((s, l) => s + l.total, 0)
  const totalMercado = linhas.reduce((s, l) => s + l.totalMercado, 0)
  const economia = Math.max(0, totalMercado - total)

  // Bebês entram na divisão por pessoa: eles viajam, ainda que não paguem.
  const cabecas = Math.max(1, totalPessoas(ctx.pessoas))

  return {
    linhas,
    total,
    totalMercado,
    economia,
    economiaPercentual: totalMercado > 0 ? (economia / totalMercado) * 100 : 0,
    porPessoa: Math.round(total / cabecas),
    sobra: orcamentoDeclarado > 0 ? orcamentoDeclarado - total : 0,
    estourou: orcamentoDeclarado > 0 && total > orcamentoDeclarado,
  }
}

/**
 * Custo-benefício de um item: nota por real gasto, normalizada de 0 a 100
 * dentro do conjunto comparado.
 *
 * Comparar preço e nota separadamente responde "qual é o mais barato" e "qual é
 * o mais bem avaliado", mas não "qual vale mais a pena" — que é a pergunta que
 * o usuário realmente faz. A razão nota/preço responde, e normalizar dentro do
 * conjunto evita comparar uma diária com uma passagem.
 */
export function custoBeneficio(itens: readonly Oferta[]): Map<string, number> {
  const razoes = new Map<string, number>()
  for (const item of itens) {
    if (item.preco > 0) razoes.set(item.id, item.nota / item.preco)
  }

  const valores = [...razoes.values()]
  if (valores.length === 0) return razoes

  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const amplitude = max - min

  const escala = new Map<string, number>()
  for (const [id, razao] of razoes) {
    // Conjunto de um item só, ou todos com a mesma razão: nota máxima para
    // todos é mais honesto do que uma divisão por zero.
    escala.set(id, amplitude === 0 ? 100 : Math.round(((razao - min) / amplitude) * 100))
  }
  return escala
}
