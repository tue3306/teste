import type { NomeIcone } from '@/components/ui/Icone'
import type { SlugFoto } from '@/data/fotos'

/** Modelo de domínio da BI&B. */

/** As três verticais que a plataforma lista lado a lado. */
export type Vertical = 'voos' | 'hoteis' | 'passeios'

/** Abas da plataforma — as três verticais mais as telas derivadas. */
export type Aba = Vertical | 'roteiro' | 'mapa' | 'dashboard' | 'bia'

/** Categorias de interesse usadas na vitrine do site e como filtro na plataforma. */
export type Categoria =
  | 'praia'
  | 'natureza'
  | 'gastronomia'
  | 'cultura'
  | 'noite'
  | 'familia'
  | 'luxo'

/** Critério de ordenação da lista de resultados. */
export type Ordenacao = 'melhor' | 'preco' | 'nota'

/**
 * Faceta de filtro. Cada vertical expõe o seu conjunto: filtrar voo por
 * "piscina" nunca fez sentido — no protótipo isso zerava a lista de voos.
 */
export interface Faceta {
  id: string
  label: string
}

/** Uma oferta listável: voo, hospedagem ou passeio. */
export interface Oferta {
  id: string
  vertical: Vertical
  titulo: string
  /** Linha de detalhe, com os campos separados por " · ". */
  sub: string
  /** Preço final da BI&B, em reais. */
  preco: number
  /** Preço médio praticado pelos concorrentes, em reais. */
  outros: number
  /** Nota de 0 a 10. */
  nota: number
  /** Número de avaliações; ausente quando a nota é proprietária da BI&B. */
  avaliacoes?: number
  /** Selo curto exibido ao lado do título. */
  tag: string
  /** Chave da foto no catálogo local (`src/data/fotos.ts`). */
  foto: SlugFoto
  /** Atributos exibidos como chips no cartão. */
  chips: string[]
  /** Ids de faceta que esta oferta satisfaz. */
  facetas: string[]
  /** Categorias de interesse às quais a oferta pertence. */
  categorias: Categoria[]
}

/** Um item da linha do tempo de um dia do roteiro. */
export interface ItemRoteiro {
  hora: string
  titulo: string
  local: string
  tipo: string
  /** Custo já formatado ("R$ 135", "grátis", "reservado", "—"). */
  custo: string
}

/** Um dia do roteiro gerado. */
export interface DiaRoteiro {
  n: number
  /** Dia da semana abreviado ("seg", "ter"…). */
  dia: string
  /** Nome do dia da semana por extenso — usado em rótulos e leitores de tela. */
  diaLongo: string
  clima: string
  titulo: string
  total: string
  km: string
  transporte: string
  dica: string
  itens: ItemRoteiro[]
}

/** Ponto no mapa da viagem. */
export interface PinMapa {
  id: string
  nome: string
  /** Coordenadas reais, usadas pelo mapa. */
  latitude: number
  longitude: number
  tipo: 'hotel' | 'passeio' | 'restaurante' | 'noite' | 'praia'
  sub: string
  detalhe: string
  preco: string
  /** Chave da foto no catálogo local. */
  foto: SlugFoto
}

/** Linha da tabela de comparação de preços. */
export interface LinhaComparador {
  fonte: string
  preco: string
  nota: string
  /** Largura da barra, proporcional ao preço. */
  largura: string
  /** Verdadeiro na linha da própria BI&B, que recebe destaque. */
  destaque: boolean
}

/** Categoria exibida na régua de atalhos do site. */
export interface CardCategoria {
  id: Categoria
  label: string
  /** Contagem exibida no cartão ("64 opções"). */
  contagem: string
  /** Ícone do cartão. */
  icone: NomeIcone
  /** Gradiente de fundo do selo do ícone. */
  grad: string
}

/** Autor de uma mensagem no chat da Bia. */
export type Autor = 'bot' | 'user'

/** Mensagem do chat da Bia. */
export interface Mensagem {
  id: string
  autor: Autor
  texto: string
}

/** Parâmetros da busca preenchidos no hero. */
export interface Busca {
  destino: string
  datas: string
  pessoas: string
  orcamento: string
  tipo: string
}

/** Item do checklist de preparação da viagem. */
export interface ItemChecklist {
  id: string
  label: string
}
