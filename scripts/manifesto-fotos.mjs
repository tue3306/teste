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
  // --- os 28 destinos do estado do Rio de Janeiro ---
  // Região metropolitana e litoral próximo
  { slug: 'rio-de-janeiro', titulo: 'Rio de Janeiro', alt: 'Vista do Rio de Janeiro com o Pão de Açúcar' },
  { slug: 'niteroi', titulo: 'Niterói', alt: 'Museu de Arte Contemporânea e a baía em Niterói' },
  { slug: 'marica', titulo: 'Maricá', alt: 'Lagoa e restinga em Maricá' },
  { slug: 'itaborai', titulo: 'Itaboraí', alt: 'Centro histórico de Itaboraí' },
  { slug: 'guapimirim', titulo: 'Guapimirim', alt: 'Serra dos Órgãos vista de Guapimirim' },

  // Costa do Sol / Região dos Lagos
  { slug: 'buzios', titulo: 'Armação dos Búzios', alt: 'Enseada e barcos em Búzios' },
  { slug: 'cabo-frio', titulo: 'Cabo Frio', alt: 'Praia do Forte em Cabo Frio' },
  { slug: 'arraial-do-cabo', titulo: 'Arraial do Cabo', alt: 'Água transparente na Prainha de Arraial do Cabo' },
  { slug: 'araruama', titulo: 'Araruama', alt: 'Lagoa de Araruama ao entardecer' },
  { slug: 'sao-pedro-da-aldeia', titulo: 'São Pedro da Aldeia', alt: 'Orla da lagoa em São Pedro da Aldeia' },
  { slug: 'saquarema', titulo: 'Saquarema', alt: 'Igreja de Nossa Senhora de Nazareth sobre o mar em Saquarema' },
  { slug: 'rio-das-ostras', titulo: 'Rio das Ostras', alt: 'Praia urbana de Rio das Ostras' },

  // Costa Verde
  // O artigo do município tem a bandeira como imagem principal, não uma foto.
  { slug: 'angra-dos-reis', titulo: 'Baía da Ilha Grande', alt: 'Ilhas e mar calmo na Baía da Ilha Grande, em Angra dos Reis' },
  // O artigo da ilha tem um mapa topográfico como imagem principal.
  { slug: 'ilha-grande', titulo: 'Lopes Mendes', alt: 'Praia de Lopes Mendes, na Ilha Grande' },
  { slug: 'paraty', titulo: 'Paraty', alt: 'Casario colonial do centro histórico de Paraty' },
  { slug: 'mangaratiba', titulo: 'Mangaratiba', alt: 'Baía de Mangaratiba' },
  { slug: 'itaguai', titulo: 'Itaguaí', alt: 'Orla de Itaguaí' },

  // Região Serrana
  { slug: 'petropolis', titulo: 'Petrópolis', alt: 'Museu Imperial e jardins em Petrópolis' },
  { slug: 'teresopolis', titulo: 'Teresópolis', alt: 'Dedo de Deus na serra de Teresópolis' },
  { slug: 'nova-friburgo', titulo: 'Nova Friburgo', alt: 'Montanhas em volta de Nova Friburgo' },
  { slug: 'miguel-pereira', titulo: 'Miguel Pereira', alt: 'Vale verde de Miguel Pereira' },
  { slug: 'vassouras', titulo: 'Vassouras', alt: 'Casarões do ciclo do café em Vassouras' },
  { slug: 'valenca', titulo: 'Valença (Rio de Janeiro)', alt: 'Centro histórico de Valença' },
  { slug: 'conservatoria', titulo: 'Conservatória (Valença)', alt: 'Ruas do distrito de Conservatória' },

  // Norte e Noroeste Fluminense
  { slug: 'campos-dos-goytacazes', titulo: 'Campos dos Goytacazes', alt: 'Centro de Campos dos Goytacazes' },
  { slug: 'sao-joao-da-barra', titulo: 'São João da Barra', alt: 'Foz do rio Paraíba do Sul em São João da Barra' },
  // O artigo do município tem a bandeira como imagem principal.
  { slug: 'sao-francisco-de-itabapoana', titulo: 'Rio Itabapoana', alt: 'Rio Itabapoana, na divisa do norte fluminense' },
  { slug: 'macae', titulo: 'Macaé', alt: 'Orla e porto de Macaé' },
  { slug: 'quissama', titulo: 'Quissamã', alt: 'Restinga e lagoas de Quissamã' },

  // --- pontos e bairros do Rio, usados nas ofertas e no roteiro ---
  { slug: 'cristo-redentor', titulo: 'Cristo Redentor', alt: 'Estátua do Cristo Redentor no Corcovado' },
  // "Pão de Açúcar" virou página de desambiguação e deixou de ter imagem principal.
  { slug: 'pao-de-acucar', titulo: 'Pão de Açúcar (Rio de Janeiro)', alt: 'Bondinho do Pão de Açúcar sobre a Baía de Guanabara' },
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
