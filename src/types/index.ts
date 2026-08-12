import type { NomeIcone } from '@/components/ui/Icone'
import type { SlugFoto } from '@/data/fotos'

/** Modelo de domínio da BI&B. */

/** As seis verticais de inventário que a plataforma lista. */
export type Vertical = 'voos' | 'hoteis' | 'passeios' | 'restaurantes' | 'eventos' | 'carros'

/** Abas da plataforma — as verticais mais as telas derivadas. */
export type Aba = Vertical | 'destinos' | 'mapa' | 'viagem'

/**
 * Regiões turísticas do estado do Rio de Janeiro.
 *
 * Esta demonstração cobre o RJ inteiro e nada além dele. A divisão é a que o
 * próprio estado usa para turismo, e não a político-administrativa.
 */
export type RegiaoRJ =
  | 'metropolitana'
  | 'costa-do-sol'
  | 'costa-verde'
  | 'serrana'
  | 'agulhas-negras'
  | 'vale-do-cafe'
  | 'norte-fluminense'

/** Perfis de viagem. Servem de filtro no site e na plataforma. */
export type Categoria =
  | 'praia'
  | 'serra'
  | 'natureza'
  | 'historico'
  | 'aventura'
  | 'gastronomia'
  | 'noite'
  | 'familia'
  | 'romantico'
  | 'fim-de-semana'
  | 'economico'
  | 'premium'

/** Critério de ordenação da lista de resultados. */
export type Ordenacao = 'melhor' | 'preco' | 'nota'

/**
 * Como o preço de um item se multiplica no total da viagem.
 *
 * É o campo que faz o orçamento fechar: sem ele, somar uma diária de hotel a
 * uma passagem por pessoa dá um número que não significa nada. O motor de custo
 * em `src/lib/orcamento.ts` lê daqui, e só daqui, quantas vezes cobrar cada item.
 */
export type Unidade =
  /** Por pessoa — passagem, passeio, refeição. Criança paga uma fração. */
  | 'pessoa'
  /** Por noite e por quarto — hospedagem. */
  | 'noite'
  /** Por dia de locação — carro. */
  | 'dia'
  /** Valor fechado, cobrado uma vez — ingresso de evento, transfer. */
  | 'unico'

/**
 * Faceta de filtro. Cada vertical expõe o seu conjunto: filtrar voo por
 * "piscina" nunca fez sentido — no protótipo isso zerava a lista de voos.
 */
export interface Faceta {
  id: string
  label: string
}

/**
 * Um item listável do catálogo: voo, hospedagem, passeio, restaurante, evento
 * ou carro.
 *
 * Os campos específicos de cada vertical são opcionais e ficam no mesmo objeto,
 * em vez de numa união discriminada. É uma escolha deliberada: o cartão, o
 * filtro e o comparador tratam todo item pelo mesmo conjunto comum, e a união
 * obrigaria um `switch` em cada um deles para chegar em `estrelas` ou `escalas`.
 * O que é específico está agrupado e comentado abaixo.
 */
export interface Oferta {
  id: string
  vertical: Vertical
  /** Id do destino a que o item pertence (`src/data/rj/destinos.ts`). */
  destino: string
  /** Nome real do estabelecimento, voo ou experiência. */
  titulo: string
  /** Linha de detalhe, com os campos separados por " · ". */
  sub: string
  /** Preço BI&B, em reais, na unidade declarada em `unidade`. */
  preco: number
  /** Preço médio praticado no mercado para o mesmo item — base da economia. */
  outros: number
  /** Como o preço se multiplica no orçamento. */
  unidade: Unidade
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
  /** Ids de faceta que este item satisfaz. */
  facetas: string[]
  /** Perfis de viagem aos quais o item atende. */
  categorias: Categoria[]

  // --- hospedagem ---
  /** Classificação em estrelas, de 1 a 5. */
  estrelas?: number
  /** Bairro ou localidade dentro do destino. */
  bairro?: string
  /** Distância até o centro ou o principal ponto turístico, em km. */
  distanciaCentroKm?: number
  /** Lista completa de comodidades, exibida no detalhe. */
  comodidades?: string[]

  // --- voo ---
  companhia?: string
  /** Código IATA de origem. */
  origem?: string
  /** Código IATA de destino. */
  chegadaIata?: string
  /** Horário de partida, "HH:MM". */
  partida?: string
  /** Horário de chegada, "HH:MM". */
  chegada?: string
  /** Duração total, "1h10". */
  duracao?: string
  /** Número de escalas; 0 é voo direto. */
  escalas?: number
  /** Política de bagagem, em texto curto. */
  bagagem?: string

  // --- passeio ---
  duracaoHoras?: number
  /** Horário de saída, "HH:MM". */
  saida?: string
  /** O que está incluso no preço. */
  inclui?: string[]

  // --- restaurante ---
  cozinha?: string

  // --- evento ---
  /** Data em ISO ("2026-09-14"), para ordenar e formatar. */
  data?: string
  local?: string

  // --- carro ---
  locadora?: string
  cambio?: string
  lugares?: number
}

/**
 * Um destino do estado do Rio de Janeiro.
 *
 * O inventário não fica aqui dentro: cada item do catálogo aponta para o
 * destino pelo id. Isso mantém o destino leve o suficiente para a vitrine da
 * home carregar os 28 de uma vez, e permite acrescentar itens sem tocar no
 * cadastro do destino.
 */
export interface Destino {
  id: string
  nome: string
  /** Sempre 'RJ' nesta etapa. O campo existe para a expansão futura. */
  uf: string
  regiao: RegiaoRJ
  latitude: number
  longitude: number
  /** Foto principal, do catálogo local. */
  foto: SlugFoto
  /** Fotos adicionais exibidas na página do destino. */
  galeria: SlugFoto[]
  /** Frase curta de vitrine. */
  chamada: string
  /** Dois a três parágrafos sobre o destino. */
  descricao: string
  /** Principais atrações, em ordem de relevância. */
  atracoes: string[]
  /** Praias, quando o destino tem litoral. */
  praias: string[]
  /** Melhor época para visitar, em texto corrido. */
  epoca: string
  /** Distância rodoviária a partir da capital, em km. */
  distanciaKm: number
  /** Tempo estimado de viagem de carro a partir da capital. */
  tempoViagem: string
  /** Nota média do destino, de 0 a 10. */
  nota: number
  /** Faixa de preço de uma diária típica, em reais. */
  faixaPreco: { min: number; max: number }
  /** Perfis de viagem que o destino atende. */
  categorias: Categoria[]
  /** Ids de destinos próximos ou parecidos, para combinar a viagem. */
  relacionados: string[]
}

/**
 * Composição do grupo que viaja.
 *
 * As faixas seguem a prática das companhias aéreas, que é também a das
 * operadoras de passeio: bebê de colo não ocupa assento e não paga; criança
 * paga uma fração; adulto paga inteira. O orçamento inteiro depende disto.
 */
export interface Pessoas {
  /** 12 anos ou mais. */
  adultos: number
  /** De 2 a 11 anos. */
  criancas: number
  /** Até 1 ano, de colo. */
  bebes: number
}

/** Ponto no mapa da viagem. */
export interface PinMapa {
  id: string
  nome: string
  /** Coordenadas reais, usadas pelo mapa. */
  latitude: number
  longitude: number
  tipo: 'hotel' | 'passeio' | 'restaurante' | 'evento' | 'praia'
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

/** Parâmetros da busca preenchidos no hero. */
export interface Busca {
  /** Id do destino escolhido, ou string vazia. */
  destino: string
  /** Data de ida, em ISO ("2026-09-14"). */
  ida: string
  /** Data de volta, em ISO. */
  volta: string
  pessoas: Pessoas
  /** Teto de gasto em reais; 0 quando não informado. */
  orcamento: number
  /**
   * Perfis de viagem escolhidos.
   *
   * Lista, e não um valor só: quem viaja em família e gosta de praia quer as
   * duas coisas, e o campo antigo (`tipo: Categoria | ''`) obrigava a escolher
   * uma. A lista alimenta o destaque de itens compatíveis e o filtro de
   * destinos.
   */
  preferencias: Categoria[]
}

/** Item do checklist de preparação da viagem. */
export interface ItemChecklist {
  id: string
  label: string
}
