/**
 * Manifesto de fotos: que imagem buscar, e de onde.
 *
 * A chave é o slug usado no código; `titulo` é o artigo da Wikipédia em
 * português de onde sai a imagem principal. Trocar a foto de um destino é
 * trocar o título aqui e rodar `npm run fotos` — nenhum componente muda.
 *
 * Só entram artigos cuja imagem principal está no Wikimedia Commons com licença
 * livre. O script grava autor e licença de cada arquivo; a atribuição aparece no
 * rodapé do site.
 */
export const MANIFESTO = [
  // --- destinos do Brasil ---
  { slug: 'rio-de-janeiro', titulo: 'Rio de Janeiro', alt: 'Vista do Rio de Janeiro com o Pão de Açúcar' },
  { slug: 'sao-paulo', titulo: 'São Paulo', alt: 'Skyline da cidade de São Paulo' },
  { slug: 'salvador', titulo: 'Salvador', alt: 'Centro histórico de Salvador, na Bahia' },
  { slug: 'noronha', titulo: 'Fernando de Noronha', alt: 'Praia em Fernando de Noronha' },
  { slug: 'foz-do-iguacu', titulo: 'Cataratas do Iguaçu', alt: 'Cataratas do Iguaçu' },
  { slug: 'gramado', titulo: 'Gramado', alt: 'Arquitetura de Gramado, no Rio Grande do Sul' },
  // "Jericoacoara" sozinho é página de desambiguação e não tem imagem principal.
  { slug: 'jericoacoara', titulo: 'Praia de Jericoacoara', alt: 'Dunas e mar em Jericoacoara' },
  { slug: 'chapada-diamantina', titulo: 'Parque Nacional da Chapada Diamantina', alt: 'Paisagem da Chapada Diamantina' },
  { slug: 'bonito', titulo: 'Bonito (Mato Grosso do Sul)', alt: 'Águas transparentes em Bonito' },
  { slug: 'lencois-maranhenses', titulo: 'Parque Nacional dos Lençóis Maranhenses', alt: 'Lagoas entre as dunas dos Lençóis Maranhenses' },

  // --- pontos e bairros do Rio, usados nas ofertas e no roteiro ---
  { slug: 'cristo-redentor', titulo: 'Cristo Redentor', alt: 'Estátua do Cristo Redentor no Corcovado' },
  { slug: 'pao-de-acucar', titulo: 'Pão de Açúcar', alt: 'Bondinho do Pão de Açúcar sobre a Baía de Guanabara' },
  { slug: 'copacabana', titulo: 'Praia de Copacabana', alt: 'Orla da praia de Copacabana' },
  { slug: 'ipanema', titulo: 'Ipanema', alt: 'Praia de Ipanema com os Dois Irmãos ao fundo' },
  { slug: 'arpoador', titulo: 'Arpoador', alt: 'Pedra do Arpoador ao pôr do sol' },
  { slug: 'santa-teresa', titulo: 'Santa Teresa (Rio de Janeiro)', alt: 'Ruas do bairro de Santa Teresa' },
  { slug: 'lapa', titulo: 'Arcos da Lapa', alt: 'Arcos da Lapa iluminados' },
  { slug: 'jardim-botanico', titulo: 'Jardim Botânico do Rio de Janeiro', alt: 'Alameda de palmeiras do Jardim Botânico' },
  { slug: 'museu-do-amanha', titulo: 'Museu do Amanhã', alt: 'Fachada do Museu do Amanhã na Praça Mauá' },
  { slug: 'leblon', titulo: 'Leblon', alt: 'Praia do Leblon' },
  { slug: 'barra-da-tijuca', titulo: 'Barra da Tijuca', alt: 'Orla da Barra da Tijuca' },
  { slug: 'dois-irmaos', titulo: 'Morro Dois Irmãos (Rio de Janeiro)', alt: 'Morro Dois Irmãos visto do mar' },
  { slug: 'escadaria-selaron', titulo: 'Escadaria Selarón', alt: 'Degraus coloridos da Escadaria Selarón' },
  { slug: 'aeroporto-santos-dumont', titulo: 'Aeroporto Santos Dumont', alt: 'Aeroporto Santos Dumont visto do alto' },
  { slug: 'aeroporto-galeao', titulo: 'Aeroporto Internacional do Rio de Janeiro-Galeão', alt: 'Aeroporto Internacional do Galeão' },
  { slug: 'aeroporto-guarulhos', titulo: 'Aeroporto Internacional de São Paulo/Guarulhos', alt: 'Aeroporto Internacional de Guarulhos' },
  { slug: 'baia-de-guanabara', titulo: 'Baía de Guanabara', alt: 'Baía de Guanabara vista do alto' },
]

/** Larguras geradas para o `srcset`. */
export const LARGURAS = [480, 960, 1600]
