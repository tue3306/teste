import { moeda } from '@/lib/format'
import { VIAGEM as VIAGEM_BASE } from './viagem'
import type { CardCategoria, ItemChecklist, LinhaComparador } from '@/types'

/** Régua de categorias do site — cada cartão abre a plataforma já filtrada. */
export const CATEGORIAS: CardCategoria[] = [
  { id: 'praia', label: 'Praia', contagem: '64 opções', icone: 'praia', grad: 'var(--grad-mar)' },
  {
    id: 'natureza',
    label: 'Natureza',
    contagem: '38 trilhas',
    icone: 'natureza',
    grad: 'var(--grad-mata)',
  },
  {
    id: 'gastronomia',
    label: 'Gastronomia',
    contagem: '212 lugares',
    icone: 'gastronomia',
    grad: 'var(--grad-sol)',
  },
  {
    id: 'cultura',
    label: 'Cultura',
    contagem: '47 museus',
    icone: 'cultura',
    grad: 'var(--grad-céu)',
  },
  {
    id: 'noite',
    label: 'Vida noturna',
    contagem: '86 casas',
    icone: 'noite',
    grad: 'var(--grad-noite)',
  },
  {
    id: 'familia',
    label: 'Com crianças',
    contagem: '29 roteiros',
    icone: 'familia',
    grad: 'var(--grad-praia)',
  },
  { id: 'luxo', label: 'Luxo', contagem: '18 resorts', icone: 'luxo', grad: 'var(--grad-sol)' },
]

/** Verticais varridas a cada busca, exibidas como chips no bento. */
export const VERTICAIS_BUSCADAS = [
  'Passagens',
  'Hotéis',
  'Resorts',
  'Pousadas',
  'Temporada',
  'Restaurantes',
  'Passeios',
  'Eventos',
  'Carros',
  'Seguro',
]

/** Itens da faixa rolante ("marquee") sob o hero. */
export const FONTES_CONECTADAS = [
  '342 fontes conectadas',
  'companhias aéreas',
  'hotéis & resorts',
  'pousadas',
  'aluguel de temporada',
  'restaurantes',
  'passeios',
  'eventos',
  'aluguel de carros',
  'seguro viagem',
]

/**
 * Comparação de preço da mesma diária em sete canais.
 *
 * As larguras de barra vêm proporcionais aos preços, como no protótipo.
 */
export const COMPARADOR: LinhaComparador[] = [
  {
    fonte: 'BI&B',
    preco: 'R$ 6.230',
    nota: 'sem taxa de serviço · cancela grátis',
    largura: '54%',
    destaque: true,
  },
  {
    fonte: 'Agência A',
    preco: 'R$ 6.860',
    nota: 'taxa de R$ 180 no checkout',
    largura: '64%',
    destaque: false,
  },
  { fonte: 'Buscador B', preco: 'R$ 7.010', nota: 'cancelamento pago', largura: '69%', destaque: false },
  { fonte: 'Portal C', preco: 'R$ 7.266', nota: 'café não incluído', largura: '76%', destaque: false },
  { fonte: 'Site do hotel', preco: 'R$ 7.480', nota: 'tarifa balcão', largura: '84%', destaque: false },
]

/** Perguntas prontas oferecidas abaixo do campo de chat da Bia. */
export const SUGESTOES_BIA = [
  'Monte um roteiro de 7 dias',
  'Quanto vou gastar?',
  'Encontre hotéis melhores',
  'O que fazer à noite?',
  'Lugares escondidos',
  'Melhor época para viajar',
]

/** Checklist de preparação exibido em "Minha viagem". */
export const CHECKLIST: ItemChecklist[] = [
  { id: 'doc', label: 'RG e CPF digitalizados' },
  { id: 'seguro', label: 'Seguro viagem contratado' },
  { id: 'checkin', label: 'Check-in online do voo' },
  { id: 'cambio', label: 'Dinheiro em espécie' },
  { id: 'mala', label: 'Mala pronta' },
]

/** Itens marcados por padrão no checklist. */
export const CHECKLIST_INICIAL = ['doc', 'seguro']

/**
 * Orçamento, gasto e economia vêm de `data/viagem.ts`, calculados a partir do
 * que está reservado. Os valores fixos que existiam aqui se contradiziam: o
 * gasto declarado era menor que a própria hospedagem.
 */
export { COMPOSICAO, ECONOMIA, GASTO, SOBRA, USO_DO_ORCAMENTO, VIAGEM } from './viagem'

/** Alertas exibidos em "Minha viagem". */
export const ALERTAS = [
  { destaque: 'Preço caiu', tom: 'teal' as const, texto: ' · voo de volta −R$ 62' },
  { destaque: 'Check-in', tom: 'coral' as const, texto: ' abre em 12 dias' },
  { destaque: '', tom: 'neutro' as const, texto: 'Chuva prevista no dia 4 — roteiro já ajustado' },
]

/** Situação dos documentos da viagem. */
export const DOCUMENTOS = [
  { label: 'RG / CPF', valor: 'ok', ok: true },
  { label: 'Seguro viagem', valor: 'ok', ok: true },
  { label: 'Febre amarela', valor: 'opcional', ok: false },
  { label: 'Cartão de embarque', valor: 'em 12 d', ok: false },
]

/** Estatísticas animadas do hero. */
export const ESTATISTICAS = [
  { valor: 34, sufixo: '%', label: 'economia média' },
  { valor: 11, sufixo: 's', label: 'roteiro completo' },
  { valor: 890, sufixo: 'k', label: 'viagens planejadas' },
]

/** Diferenciais listados na seção de viagem em grupo. */
export const DIFERENCIAIS_SOCIAL = [
  'Grupos por destino, voo, hotel ou evento',
  'Chat, roteiros compartilhados e divisão de custos',
  'Privacidade granular e verificação de perfil',
]

/**
 * Viajantes com planos coincidentes.
 *
 * Perfis de demonstração — pessoas fictícias. A seção antes mostrava uma grade
 * cinza com três bolinhas piscando, que não comunicava nada: o produto aqui é
 * encontrar gente, então são pessoas que precisam aparecer.
 */
export interface Viajante {
  id: string
  nome: string
  /** Iniciais do avatar. */
  iniciais: string
  origem: string
  /** O que coincide com a sua viagem. */
  coincidencia: string
  /** Tipo da coincidência, que define a cor do selo. */
  tipo: 'voo' | 'hotel' | 'passeio' | 'evento'
  interesses: string[]
  /** Perfil com documento conferido. */
  verificado: boolean
}

export const VIAJANTES: Viajante[] = [
  {
    id: 'v-ana',
    nome: 'Ana e Rafael',
    iniciais: 'AR',
    origem: 'São Paulo, SP',
    coincidencia: 'Mesmo voo · GRU → SDU · 12 set',
    tipo: 'voo',
    interesses: ['Trilha', 'Gastronomia'],
    verificado: true,
  },
  {
    id: 'v-marcos',
    nome: 'Marcos',
    iniciais: 'M',
    origem: 'Curitiba, PR',
    coincidencia: 'Mesmo hotel · Ipanema · 12–19 set',
    tipo: 'hotel',
    interesses: ['Surf', 'Vida noturna'],
    verificado: true,
  },
  {
    id: 'v-julia',
    nome: 'Júlia',
    iniciais: 'J',
    origem: 'Belo Horizonte, MG',
    coincidencia: 'Mesmo passeio · Bondinho · 15 set',
    tipo: 'passeio',
    interesses: ['Fotografia', 'Cultura'],
    verificado: false,
  },
  {
    id: 'v-familia',
    nome: 'Família Duarte',
    iniciais: 'FD',
    origem: 'Porto Alegre, RS',
    coincidencia: 'Mesmo período · 11–20 set',
    tipo: 'evento',
    interesses: ['Com crianças', 'Praia'],
    verificado: true,
  },
]

/** Tipos de viagem oferecidos no formulário de busca. */
export const TIPOS_DE_VIAGEM = ['Casal', 'Família', 'Mochilão', 'Luxo', 'Aventura', 'Trabalho']

/** Valores iniciais do formulário de busca, coerentes com a viagem em foco. */
export const BUSCA_INICIAL = {
  destino: `${VIAGEM_BASE.destino}, Brasil`,
  datas: VIAGEM_BASE.periodo,
  pessoas: `${String(VIAGEM_BASE.pessoas)} adultos`,
  orcamento: moeda(VIAGEM_BASE.orcamento),
  tipo: 'Casal',
}
