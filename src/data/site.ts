import { CATALOGO, DESTINOS } from '@/data/rj'
import type { Busca, CardCategoria, Categoria, ItemChecklist, LinhaComparador } from '@/types'

/**
 * Conta quantos itens do catálogo atendem a um perfil de viagem.
 *
 * As contagens da régua de categorias eram escritas à mão — "64 opções", "38
 * trilhas" — e não correspondiam a nada. Agora saem do próprio catálogo, então
 * mudam sozinhas quando o inventário muda e nunca prometem o que não existe.
 */
function contar(categoria: Categoria): number {
  return CATALOGO.filter((o) => o.categorias.includes(categoria)).length
}

/** Quantos destinos do estado atendem a um perfil. */
function contarDestinos(categoria: Categoria): number {
  return DESTINOS.filter((d) => d.categorias.includes(categoria)).length
}

/** Régua de categorias do site — cada cartão abre a plataforma já filtrada. */
export const CATEGORIAS: CardCategoria[] = [
  {
    id: 'praia',
    label: 'Praia',
    contagem: `${String(contarDestinos('praia'))} destinos`,
    icone: 'praia',
    grad: 'var(--grad-mar)',
  },
  {
    id: 'serra',
    label: 'Serra',
    contagem: `${String(contarDestinos('serra'))} destinos`,
    icone: 'serra',
    grad: 'var(--grad-mata)',
  },
  {
    id: 'natureza',
    label: 'Natureza',
    contagem: `${String(contar('natureza'))} opções`,
    icone: 'natureza',
    grad: 'var(--grad-mata)',
  },
  {
    id: 'historico',
    label: 'Histórico',
    contagem: `${String(contar('historico'))} opções`,
    icone: 'cultura',
    grad: 'var(--grad-céu)',
  },
  {
    id: 'aventura',
    label: 'Aventura',
    contagem: `${String(contar('aventura'))} opções`,
    icone: 'aventura',
    grad: 'var(--grad-praia)',
  },
  {
    id: 'gastronomia',
    label: 'Gastronomia',
    contagem: `${String(contar('gastronomia'))} lugares`,
    icone: 'gastronomia',
    grad: 'var(--grad-sol)',
  },
  {
    id: 'noite',
    label: 'Vida noturna',
    contagem: `${String(contar('noite'))} opções`,
    icone: 'noite',
    grad: 'var(--grad-noite)',
  },
  {
    id: 'familia',
    label: 'Com crianças',
    contagem: `${String(contar('familia'))} opções`,
    icone: 'familia',
    grad: 'var(--grad-praia)',
  },
  {
    id: 'romantico',
    label: 'Romântico',
    contagem: `${String(contar('romantico'))} opções`,
    icone: 'romantico',
    grad: 'var(--grad-sol)',
  },
  {
    id: 'fim-de-semana',
    label: 'Fim de semana',
    contagem: `${String(contarDestinos('fim-de-semana'))} destinos`,
    icone: 'evento',
    grad: 'var(--grad-céu)',
  },
  {
    id: 'economico',
    label: 'Econômico',
    contagem: `${String(contar('economico'))} opções`,
    icone: 'carro',
    grad: 'var(--grad-mata)',
  },
  {
    id: 'premium',
    label: 'Premium',
    contagem: `${String(contar('premium'))} opções`,
    icone: 'luxo',
    grad: 'var(--grad-sol)',
  },
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
]

/** Itens da faixa rolante ("marquee") sob o hero. */
export const FONTES_CONECTADAS = [
  `${String(CATALOGO.length)} opções no catálogo`,
  'companhias aéreas',
  'hotéis & resorts',
  'pousadas',
  'aluguel de temporada',
  'restaurantes',
  'passeios',
  'eventos',
  'aluguel de carros',
  `${String(DESTINOS.length)} destinos do RJ`,
]

/**
 * Comparação de preço da mesma hospedagem em cinco canais.
 *
 * As larguras de barra são proporcionais aos preços.
 */
export const COMPARADOR: LinhaComparador[] = [
  {
    fonte: 'BI&B',
    preco: 'R$ 890',
    nota: 'sem taxa de serviço · cancela grátis',
    largura: '54%',
    destaque: true,
  },
  {
    fonte: 'Agência A',
    preco: 'R$ 980',
    nota: 'taxa de R$ 90 no checkout',
    largura: '64%',
    destaque: false,
  },
  {
    fonte: 'Buscador B',
    preco: 'R$ 1.010',
    nota: 'cancelamento pago',
    largura: '69%',
    destaque: false,
  },
  {
    fonte: 'Portal C',
    preco: 'R$ 1.066',
    nota: 'café não incluído',
    largura: '76%',
    destaque: false,
  },
  {
    fonte: 'Site do hotel',
    preco: 'R$ 1.094',
    nota: 'tarifa balcão',
    largura: '84%',
    destaque: false,
  },
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
export const CHECKLIST_INICIAL = ['doc']

/** Estatísticas animadas do hero, derivadas do catálogo. */
export const ESTATISTICAS = [
  { valor: DESTINOS.length, sufixo: '', label: 'destinos no RJ' },
  { valor: CATALOGO.length, sufixo: '', label: 'opções comparadas' },
  { valor: 34, sufixo: '%', label: 'economia média' },
]

/** Diferenciais listados na seção de viagem em grupo. */
export const DIFERENCIAIS_SOCIAL = [
  'Grupos por destino, voo, hotel ou evento',
  'Viagens compartilhadas e divisão de custos',
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
    coincidencia: 'Mesma pousada · Búzios · 12–19 set',
    tipo: 'hotel',
    interesses: ['Surf', 'Vida noturna'],
    verificado: true,
  },
  {
    id: 'v-julia',
    nome: 'Júlia',
    iniciais: 'J',
    origem: 'Belo Horizonte, MG',
    coincidencia: 'Mesmo passeio · Arraial do Cabo · 15 set',
    tipo: 'passeio',
    interesses: ['Fotografia', 'Mergulho'],
    verificado: false,
  },
  {
    id: 'v-familia',
    nome: 'Família Duarte',
    iniciais: 'FD',
    origem: 'Porto Alegre, RS',
    coincidencia: 'Mesmo período · 11–20 set · Região Serrana',
    tipo: 'evento',
    interesses: ['Com crianças', 'Serra'],
    verificado: true,
  },
]

/** Perfis de viagem oferecidos no formulário de busca. */
export const TIPOS_DE_VIAGEM: { id: Categoria; label: string }[] = [
  { id: 'praia', label: 'Praia' },
  { id: 'serra', label: 'Serra' },
  { id: 'romantico', label: 'Romântico' },
  { id: 'familia', label: 'Família' },
  { id: 'aventura', label: 'Aventura' },
  { id: 'gastronomia', label: 'Gastronomia' },
  { id: 'economico', label: 'Econômico' },
  { id: 'premium', label: 'Premium' },
]

/**
 * Datas iniciais: um fim de semana prolongado daqui a três semanas.
 *
 * São calculadas a partir de hoje, e não escritas à mão, porque data fixa em
 * dado de demonstração envelhece — o protótipo abria com "12–19 set" muito
 * depois de setembro ter passado.
 */
function daquiA(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

/** Valores iniciais do formulário de busca. */
export const BUSCA_INICIAL: Busca = {
  destino: 'rio-de-janeiro',
  ida: daquiA(21),
  volta: daquiA(26),
  pessoas: { adultos: 2, criancas: 0, bebes: 0 },
  orcamento: 6000,
  preferencias: [],
}
