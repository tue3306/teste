import type { Categoria, Oferta } from '@/types'
import type { SlugFoto } from '@/data/fotos'

/**
 * Construtores do catálogo.
 *
 * Um item do catálogo tem quinze campos, e cinco deles são sempre iguais dentro
 * de uma mesma vertical: hospedagem é sempre `unidade: 'noite'`, passeio é
 * sempre `'pessoa'`, carro é sempre `'dia'`. Repetir isso em 180 objetos é
 * convite a erro de digitação silencioso — e errar a unidade estraga o
 * orçamento inteiro sem quebrar nada visível.
 *
 * Então a vertical, a unidade e o id vêm daqui, e cada entrada declara só o que
 * é dela. O preço de mercado é derivado de uma margem explícita por item: fixar
 * uma margem única faria toda oferta economizar exatamente a mesma
 * porcentagem, o que nenhum comparador real produz.
 */

/** Campos que toda entrada declara, seja qual for a vertical. */
interface Comum {
  /** Nome real do estabelecimento, experiência ou serviço. */
  nome: string
  /** Linha de detalhe, campos separados por " · ". */
  sub: string
  /** Preço BI&B em reais, na unidade da vertical. */
  preco: number
  /** Quanto o mercado cobra a mais, em porcentagem (12 = 12% acima). */
  margem: number
  nota: number
  /** Número de avaliações. */
  av: number
  /** Selo curto exibido ao lado do título. */
  tag: string
  chips: string[]
  facetas: string[]
  cats: Categoria[]
  /** Foto própria; sem isto, usa a do destino. */
  foto?: SlugFoto
}

/** Aplica a margem e arredonda para o real cheio. */
function mercado(preco: number, margem: number): number {
  return Math.round(preco * (1 + margem / 100))
}

function base(
  destino: string,
  id: string,
  vertical: Oferta['vertical'],
  unidade: Oferta['unidade'],
  e: Comum,
): Oferta {
  return {
    id,
    vertical,
    destino,
    titulo: e.nome,
    sub: e.sub,
    preco: e.preco,
    outros: mercado(e.preco, e.margem),
    unidade,
    nota: e.nota,
    avaliacoes: e.av,
    tag: e.tag,
    foto: e.foto ?? (destino as SlugFoto),
    chips: e.chips,
    facetas: e.facetas,
    categorias: e.cats,
  }
}

interface Hosp extends Comum {
  estrelas: number
  bairro: string
  /** Distância até o centro ou o principal ponto turístico, em km. */
  km: number
  comodidades: string[]
}

/** Hospedagem: preço por noite, por quarto. */
export function hospedagens(destino: string, entradas: Hosp[]): Oferta[] {
  return entradas.map((e, i) => ({
    ...base(destino, `${destino}-h${String(i + 1)}`, 'hoteis', 'noite', e),
    estrelas: e.estrelas,
    bairro: e.bairro,
    distanciaCentroKm: e.km,
    comodidades: e.comodidades,
  }))
}

interface Pass extends Comum {
  horas: number
  /** Horário de saída, "HH:MM". */
  saida: string
  inclui: string[]
}

/** Passeio: preço por pessoa. */
export function passeios(destino: string, entradas: Pass[]): Oferta[] {
  return entradas.map((e, i) => ({
    ...base(destino, `${destino}-p${String(i + 1)}`, 'passeios', 'pessoa', e),
    duracaoHoras: e.horas,
    saida: e.saida,
    inclui: e.inclui,
  }))
}

interface Rest extends Comum {
  cozinha: string
  bairro: string
}

/**
 * Restaurante: preço médio por pessoa.
 *
 * `letra` existe porque o catálogo é escrito em duas passadas — a primeira por
 * região, a segunda completando o que ficou raso. Sem ela, a segunda passada
 * geraria `niteroi-r1` de novo e o id colidiria em silêncio: o mapa por id
 * ficaria com um dos dois, e o outro sumiria da tela sem erro nenhum.
 */
export function restaurantes(destino: string, entradas: Rest[], letra = 'r'): Oferta[] {
  return entradas.map((e, i) => ({
    ...base(destino, `${destino}-${letra}${String(i + 1)}`, 'restaurantes', 'pessoa', e),
    cozinha: e.cozinha,
    bairro: e.bairro,
  }))
}

interface Ev extends Comum {
  /** Data em ISO, "2026-11-14". */
  data: string
  local: string
}

/** Evento: ingresso individual. Ver `restaurantes` sobre `letra`. */
export function eventos(destino: string, entradas: Ev[], letra = 'e'): Oferta[] {
  return entradas.map((e, i) => ({
    ...base(destino, `${destino}-${letra}${String(i + 1)}`, 'eventos', 'pessoa', e),
    data: e.data,
    local: e.local,
  }))
}

interface Carro extends Comum {
  locadora: string
  cambio: string
  lugares: number
}

/** Aluguel de carro: preço por dia de locação. */
export function carros(destino: string, entradas: Carro[]): Oferta[] {
  return entradas.map((e, i) => ({
    ...base(destino, `${destino}-c${String(i + 1)}`, 'carros', 'dia', e),
    locadora: e.locadora,
    cambio: e.cambio,
    lugares: e.lugares,
  }))
}
