import { TODAS_OFERTAS } from './ofertas'

/**
 * A viagem em foco — e todo o dinheiro dela.
 *
 * Este módulo existe porque os números estavam se contradizendo. O site exibia
 * "gasto previsto R$ 5.240" enquanto a hospedagem reservada (R$ 890 × 7 noites)
 * sozinha dava R$ 6.230 — mais que o total. A economia dizia R$ 1.796 sem sair
 * de conta nenhuma. Eram valores digitados um por um, em telas diferentes, que
 * foram divergindo.
 *
 * Agora tudo sai daqui, calculado a partir do que está de fato reservado. Não é
 * possível exibir um número que não feche.
 */

/** Quem viaja, por quanto tempo e com qual teto. */
export const VIAGEM = {
  destino: 'Rio de Janeiro',
  uf: 'RJ',
  periodo: '12–19 set',
  pessoas: 2,
  noites: 7,
  /** Teto que o viajante definiu na busca. */
  orcamento: 9000,
  /**
   * Refeições e deslocamento previstos para os 7 dias, fora das reservas.
   * É estimativa, não reserva — por isso entra como valor próprio.
   */
  extras: 938,
} as const

/** O que já está reservado. */
export const RESERVADO = {
  voo: 'v2',
  hotel: 'h2',
  passeios: ['p1', 'p2'],
} as const

/** Ids reservados, na ordem em que aparecem no painel. */
export const IDS_RESERVADOS: string[] = [
  RESERVADO.voo,
  RESERVADO.hotel,
  ...RESERVADO.passeios,
]

function oferta(id: string) {
  const encontrada = TODAS_OFERTAS.find((o) => o.id === id)
  if (!encontrada) throw new Error(`Oferta reservada inexistente: ${id}`)
  return encontrada
}

/**
 * Quantas vezes cada item é cobrado.
 *
 * Hospedagem é por noite; passagem e passeio são por pessoa. Tratar tudo como
 * unidade única era parte do problema: multiplicava errado ou nem multiplicava.
 */
function multiplicador(vertical: string): number {
  return vertical === 'hoteis' ? VIAGEM.noites : VIAGEM.pessoas
}

/** Composição do gasto previsto, linha a linha. */
export interface LinhaGasto {
  rotulo: string
  detalhe: string
  valor: number
}

export const COMPOSICAO: LinhaGasto[] = (() => {
  const voo = oferta(RESERVADO.voo)
  const hotel = oferta(RESERVADO.hotel)
  const passeios = RESERVADO.passeios.map(oferta)

  const totalPasseios = passeios.reduce((s, p) => s + p.preco * VIAGEM.pessoas, 0)

  return [
    {
      rotulo: 'Voos',
      detalhe: `${voo.titulo} · ${String(VIAGEM.pessoas)} pessoas`,
      valor: voo.preco * VIAGEM.pessoas,
    },
    {
      rotulo: 'Hospedagem',
      detalhe: `${hotel.titulo} · ${String(VIAGEM.noites)} noites`,
      valor: hotel.preco * VIAGEM.noites,
    },
    {
      rotulo: 'Experiências',
      detalhe: passeios.map((p) => p.titulo.split(' · ')[0]).join(' e '),
      valor: totalPasseios,
    },
    {
      rotulo: 'Alimentação e transporte',
      detalhe: 'Estimativa para os 7 dias',
      valor: VIAGEM.extras,
    },
  ]
})()

/** Gasto previsto: a soma da composição. */
export const GASTO = COMPOSICAO.reduce((s, l) => s + l.valor, 0)

/** Quanto sobra do orçamento. */
export const SOBRA = VIAGEM.orcamento - GASTO

/** Fração do orçamento já comprometida, de 0 a 1. */
export const USO_DO_ORCAMENTO = GASTO / VIAGEM.orcamento

/**
 * Economia em relação à média do mercado.
 *
 * Soma, item a item, a diferença entre o preço médio dos concorrentes e o
 * preço da BI&B — multiplicada pelas mesmas noites e pessoas do gasto. Antes
 * era um número fixo que não vinha de conta nenhuma.
 */
export const ECONOMIA = IDS_RESERVADOS.reduce((soma, id) => {
  const o = oferta(id)
  return soma + (o.outros - o.preco) * multiplicador(o.vertical)
}, 0)

/** Quantidade de reservas confirmadas. */
export const RESERVAS_CONFIRMADAS = IDS_RESERVADOS.length
