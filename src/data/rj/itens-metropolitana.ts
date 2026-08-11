import { carros, eventos, hospedagens, passeios, restaurantes } from './construtores'
import type { Oferta } from '@/types'

/**
 * Inventário da Região Metropolitana e do litoral próximo.
 *
 * Dados de demonstração. Os nomes são fictícios, mas os bairros, as praias, as
 * distâncias e o padrão de preço de cada cidade são reais — é o que permite
 * comparar Ipanema com Itaipuaçu e a diferença fazer sentido. Nenhum destes
 * itens veio de API alguma, e nada aqui se apresenta como resultado de busca ao
 * vivo.
 */
export const ITENS_METROPOLITANA: Oferta[] = [
  // ───────────────────────────── Rio de Janeiro ─────────────────────────────
  ...hospedagens('rio-de-janeiro', [
    {
      nome: 'Arpoador Vista Suítes',
      sub: 'Ipanema · 2 min do Arpoador · 4 estrelas · rooftop com piscina',
      preco: 890, margem: 23, nota: 9.5, av: 2317, tag: 'Mais amado', foto: 'arpoador',
      estrelas: 4, bairro: 'Ipanema', km: 6.4,
      comodidades: ['Piscina no rooftop', 'Café da manhã', 'Academia', 'Cancelamento grátis', 'Ar-condicionado'],
      chips: ['Piscina', 'Café incluso', 'Cancelamento grátis'],
      facetas: ['piscina', 'cafe', 'cancelamento', 'academia', 'praia'],
      cats: ['praia', 'premium', 'romantico'],
    },
    {
      nome: 'Copa Vista Mar',
      sub: 'Copacabana · 120 m da praia · 4 estrelas · café da manhã',
      preco: 612, margem: 22, nota: 9.2, av: 1842, tag: 'Custo-benefício', foto: 'copacabana',
      estrelas: 4, bairro: 'Copacabana', km: 5.1,
      comodidades: ['Piscina', 'Café da manhã', 'Cancelamento grátis', 'Cofre', 'Wi-Fi rápido'],
      chips: ['Piscina', 'Café incluso', '120 m da praia'],
      facetas: ['piscina', 'cafe', 'cancelamento', 'praia'],
      cats: ['praia', 'familia'],
    },
    {
      nome: 'Casa Santa Teresa',
      sub: 'Santa Teresa · casarão restaurado · 12 quartos · pet friendly',
      preco: 430, margem: 19, nota: 9.0, av: 764, tag: 'Charme', foto: 'santa-teresa',
      estrelas: 3, bairro: 'Santa Teresa', km: 2.8,
      comodidades: ['Café da manhã', 'Pet friendly', 'Jardim', 'Wi-Fi rápido'],
      chips: ['Pet friendly', 'Café incluso', 'Casarão histórico'],
      facetas: ['pet', 'cafe', 'estacionamento'],
      cats: ['historico', 'romantico'],
    },
    {
      nome: 'Lapa Social Hostel',
      sub: 'Lapa · quarto duplo privativo · rooftop bar · recepção 24h',
      preco: 186, margem: 25, nota: 8.4, av: 3105, tag: 'Mais barato', foto: 'lapa',
      estrelas: 2, bairro: 'Lapa', km: 1.4,
      comodidades: ['Café da manhã', 'Rooftop bar', 'Cancelamento grátis', 'Lavanderia'],
      chips: ['Café incluso', 'Cancelamento grátis', 'Rooftop'],
      facetas: ['cafe', 'cancelamento'],
      cats: ['noite', 'economico'],
    },
  ]),
  ...passeios('rio-de-janeiro', [
    {
      nome: 'Cristo Redentor · trem do Corcovado',
      sub: 'Ingresso com horário marcado · 2h30 · sem fila na bilheteria',
      preco: 135, margem: 32, nota: 9.4, av: 5210, tag: 'Imperdível', foto: 'cristo-redentor',
      horas: 2.5, saida: '08:30', inclui: ['Trem ida e volta', 'Ingresso do santuário'],
      chips: ['Sem fila', 'Guia opcional', 'Cancelamento grátis'],
      facetas: ['semfila', 'guia', 'cancelamento', 'transporte'],
      cats: ['historico', 'natureza', 'familia'],
    },
    {
      nome: 'Bondinho Pão de Açúcar · pôr do sol',
      sub: 'Dois trechos · 3h · entrada no fim da tarde, com a cidade acendendo',
      preco: 189, margem: 14, nota: 9.3, av: 4180, tag: 'Pôr do sol', foto: 'pao-de-acucar',
      horas: 3, saida: '15:30', inclui: ['Bondinho nos dois trechos', 'Acesso aos mirantes'],
      chips: ['Sem fila', 'Pôr do sol'],
      facetas: ['semfila', 'cancelamento'],
      cats: ['natureza', 'romantico'],
    },
    {
      nome: 'Trilha Dois Irmãos · Vidigal',
      sub: 'Vidigal · 2h · guia local · nível moderado · vista da Zona Sul inteira',
      preco: 95, margem: 26, nota: 9.6, av: 1290, tag: 'Melhor avaliado', foto: 'dois-irmaos',
      horas: 2, saida: '06:30', inclui: ['Guia local credenciado', 'Água', 'Mototáxi até a base'],
      chips: ['Guia local', 'Nível moderado'],
      facetas: ['guia', 'cancelamento', 'transporte'],
      cats: ['natureza', 'aventura'],
    },
  ]),
  ...restaurantes('rio-de-janeiro', [
    {
      nome: 'Aconchego Carioca',
      sub: 'Praça da Bandeira · botequim premiado · bolinho de feijoada',
      preco: 118, margem: 16, nota: 9.3, av: 2870, tag: 'Botequim',
      cozinha: 'Brasileira de boteco', bairro: 'Praça da Bandeira',
      chips: ['Reserva', 'Boteco premiado'], facetas: ['reserva', 'familia'],
      cats: ['gastronomia'],
    },
    {
      nome: 'Barraca do Pepê',
      sub: 'Barra da Tijuca · pé na areia · sanduíche natural e açaí',
      preco: 58, margem: 21, nota: 8.7, av: 1940, tag: 'Pé na areia', foto: 'barra-da-tijuca',
      cozinha: 'Rápida e saudável', bairro: 'Barra da Tijuca',
      chips: ['Vista para o mar', 'Vegetariano'], facetas: ['vista', 'vegetariano'],
      cats: ['praia', 'economico'],
    },
    {
      nome: 'Mesa do Leblon',
      sub: 'Leblon · frutos do mar · menu-degustação de seis tempos',
      preco: 285, margem: 13, nota: 9.4, av: 860, tag: 'Alta gastronomia', foto: 'leblon',
      cozinha: 'Contemporânea e frutos do mar', bairro: 'Leblon',
      chips: ['Reserva obrigatória', 'Frutos do mar'], facetas: ['reserva', 'frutosdomar'],
      cats: ['gastronomia', 'premium', 'romantico'],
    },
  ]),
  ...eventos('rio-de-janeiro', [
    {
      nome: 'Roda de samba no Pedra do Sal',
      sub: 'Saúde · roda tradicional na segunda-feira · entrada solidária',
      preco: 30, margem: 40, nota: 9.1, av: 1120, tag: 'Tradição', foto: 'lapa',
      data: '2026-09-14', local: 'Pedra do Sal, Saúde',
      chips: ['Ao ar livre', 'Roda tradicional'], facetas: ['gratuito'],
      cats: ['noite', 'historico'],
    },
    {
      nome: 'Réveillon de Copacabana · camarote',
      sub: 'Copacabana · queima de fogos de 12 min · open bar e vista da areia',
      preco: 420, margem: 28, nota: 9.0, av: 640, tag: 'Réveillon', foto: 'copacabana',
      data: '2026-12-31', local: 'Posto 4, Copacabana',
      chips: ['Open bar', 'Vista da queima'], facetas: ['coberto'],
      cats: ['noite', 'premium'],
    },
  ]),
  ...carros('rio-de-janeiro', [
    {
      nome: 'Localiza · Fiat Argo 1.3',
      sub: 'Retirada no Galeão ou Santos Dumont · quilometragem livre',
      preco: 129, margem: 24, nota: 8.8, av: 1560, tag: 'Mais alugado', foto: 'aeroporto-galeao',
      locadora: 'Localiza', cambio: 'manual', lugares: 5,
      chips: ['Ar-condicionado', 'Km livre'], facetas: ['arcondicionado'],
      cats: ['economico'],
    },
    {
      nome: 'Movida · Jeep Renegade',
      sub: 'Retirada no Galeão · automático · proteção sem franquia inclusa',
      preco: 248, margem: 18, nota: 9.0, av: 720, tag: 'Sem franquia', foto: 'aeroporto-galeao',
      locadora: 'Movida', cambio: 'automatico', lugares: 5,
      chips: ['Automático', 'Sem franquia', 'SUV'], facetas: ['automatico', 'semfranquia', 'suv', 'arcondicionado'],
      cats: ['familia', 'premium'],
    },
  ]),

  // ───────────────────────────────── Niterói ────────────────────────────────
  ...hospedagens('niteroi', [
    {
      nome: 'Icaraí Bay Hotel',
      sub: 'Icaraí · vista para a baía e para o Pão de Açúcar · 4 estrelas',
      preco: 395, margem: 20, nota: 9.0, av: 940, tag: 'Melhor vista',
      estrelas: 4, bairro: 'Icaraí', km: 3.2,
      comodidades: ['Café da manhã', 'Piscina', 'Estacionamento', 'Academia'],
      chips: ['Piscina', 'Café incluso', 'Vista da baía'],
      facetas: ['piscina', 'cafe', 'estacionamento', 'academia'],
      cats: ['praia', 'gastronomia'],
    },
    {
      nome: 'Pousada Itacoatiara Surf',
      sub: 'Itacoatiara · 200 m da praia · guarda-pranchas · café reforçado',
      preco: 236, margem: 17, nota: 8.8, av: 610, tag: 'Para surfar',
      estrelas: 3, bairro: 'Itacoatiara', km: 12.5,
      comodidades: ['Café da manhã', 'Guarda-pranchas', 'Pet friendly', 'Estacionamento'],
      chips: ['Pet friendly', 'Café incluso', '200 m da praia'],
      facetas: ['pet', 'cafe', 'praia', 'estacionamento'],
      cats: ['praia', 'aventura', 'economico'],
    },
  ]),
  ...passeios('niteroi', [
    {
      nome: 'Caminho Niemeyer + MAC',
      sub: 'Centro · 3h · visita guiada pelo conjunto arquitetônico e o museu',
      preco: 89, margem: 22, nota: 9.2, av: 730, tag: 'Arquitetura',
      horas: 3, saida: '10:00', inclui: ['Entrada no MAC', 'Guia de arquitetura'],
      chips: ['Guia local', 'Sem fila'], facetas: ['guia', 'semfila', 'cancelamento'],
      cats: ['historico', 'familia'],
    },
    {
      nome: 'Trilha da Pedra do Elefante',
      sub: 'Serra da Tiririca · 3h30 · nível moderado · vista de Itacoatiara',
      preco: 78, margem: 28, nota: 9.4, av: 520, tag: 'Melhor vista',
      horas: 3.5, saida: '06:00', inclui: ['Guia credenciado', 'Água', 'Seguro'],
      chips: ['Guia local', 'Nível moderado'], facetas: ['guia', 'cancelamento'],
      cats: ['natureza', 'aventura'],
    },
  ]),
  ...restaurantes('niteroi', [
    {
      nome: 'Peixaria do Gragoatá',
      sub: 'Gragoatá · peixe do dia na brasa · vista para a baía',
      preco: 132, margem: 15, nota: 9.1, av: 1180, tag: 'Frutos do mar',
      cozinha: 'Frutos do mar', bairro: 'Gragoatá',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'reserva'],
      cats: ['gastronomia', 'praia'],
    },
  ]),
  ...carros('niteroi', [
    {
      nome: 'Unidas · Chevrolet Onix',
      sub: 'Retirada em Icaraí · quilometragem livre · devolução no Rio sem taxa',
      preco: 118, margem: 22, nota: 8.6, av: 430, tag: 'Econômico',
      locadora: 'Unidas', cambio: 'manual', lugares: 5,
      chips: ['Ar-condicionado', 'Km livre'], facetas: ['arcondicionado'],
      cats: ['economico'],
    },
  ]),

  // ────────────────────────────────── Maricá ────────────────────────────────
  ...hospedagens('marica', [
    {
      nome: 'Pousada Restinga de Itaipuaçu',
      sub: 'Itaipuaçu · frente para a restinga · piscina · café colonial',
      preco: 218, margem: 18, nota: 8.9, av: 480, tag: 'Custo-benefício',
      estrelas: 3, bairro: 'Itaipuaçu', km: 9.0,
      comodidades: ['Piscina', 'Café colonial', 'Estacionamento', 'Pet friendly'],
      chips: ['Piscina', 'Café incluso', 'Pet friendly'],
      facetas: ['piscina', 'cafe', 'pet', 'estacionamento'],
      cats: ['praia', 'economico', 'familia'],
    },
    {
      nome: 'Casa da Lagoa Ponta Negra',
      sub: 'Ponta Negra · casa inteira · 3 quartos · 400 m da praia',
      preco: 340, margem: 21, nota: 9.1, av: 210, tag: 'Casa inteira',
      estrelas: 3, bairro: 'Ponta Negra', km: 14.0,
      comodidades: ['Casa inteira', 'Cozinha equipada', 'Churrasqueira', 'Estacionamento', 'Wi-Fi'],
      chips: ['Casa inteira', 'Churrasqueira', '400 m da praia'],
      facetas: ['estacionamento', 'praia', 'familia', 'pet'],
      cats: ['praia', 'familia'],
    },
  ]),
  ...passeios('marica', [
    {
      nome: 'Travessia das quatro lagoas de caiaque',
      sub: 'Lagoa de Maricá · 4h · caiaque duplo · parada na restinga',
      preco: 145, margem: 24, nota: 9.2, av: 340, tag: 'Na água',
      horas: 4, saida: '08:00', inclui: ['Caiaque e colete', 'Instrutor', 'Lanche'],
      chips: ['Guia local', 'Equipamento incluso'], facetas: ['guia', 'cancelamento', 'criancas'],
      cats: ['natureza', 'aventura', 'familia'],
    },
    {
      nome: 'Nascer do sol no Morro do Frade',
      sub: 'Ponta Negra · 3h · trilha curta e íngreme · saída antes do amanhecer',
      preco: 68, margem: 30, nota: 9.3, av: 260, tag: 'Nascer do sol',
      horas: 3, saida: '04:45', inclui: ['Guia credenciado', 'Lanterna de cabeça'],
      chips: ['Guia local', 'Nascer do sol'], facetas: ['guia', 'cancelamento'],
      cats: ['natureza', 'aventura', 'romantico'],
    },
  ]),
  ...restaurantes('marica', [
    {
      nome: 'Quiosque Maré de Jaconé',
      sub: 'Jaconé · camarão na moranga e peixe frito · pé na areia',
      preco: 86, margem: 19, nota: 8.8, av: 720, tag: 'Pé na areia',
      cozinha: 'Frutos do mar', bairro: 'Jaconé',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'familia'],
      cats: ['praia', 'gastronomia', 'economico'],
    },
  ]),
  ...carros('marica', [
    {
      nome: 'Foco · Renault Kwid',
      sub: 'Retirada no centro de Maricá · ideal para a estrada da restinga',
      preco: 98, margem: 26, nota: 8.4, av: 190, tag: 'Mais barato',
      locadora: 'Foco', cambio: 'manual', lugares: 5,
      chips: ['Ar-condicionado', 'Km livre'], facetas: ['arcondicionado'],
      cats: ['economico'],
    },
  ]),

  // ───────────────────────────────── Itaboraí ───────────────────────────────
  ...hospedagens('itaborai', [
    {
      nome: 'Hotel Fazenda Macacu',
      sub: 'Zona rural · 12 chalés · piscina natural · pensão completa opcional',
      preco: 265, margem: 17, nota: 8.7, av: 320, tag: 'Fazenda',
      estrelas: 3, bairro: 'Sambaetiba', km: 11.0,
      comodidades: ['Piscina natural', 'Café da manhã', 'Cavalgada', 'Estacionamento', 'Pet friendly'],
      chips: ['Piscina', 'Café incluso', 'Pet friendly'],
      facetas: ['piscina', 'cafe', 'pet', 'estacionamento', 'familia'],
      cats: ['natureza', 'familia', 'fim-de-semana'],
    },
    {
      nome: 'Pousada Centro Histórico',
      sub: 'Centro · casarão do século XIX · 8 quartos · café da manhã caseiro',
      preco: 148, margem: 20, nota: 8.3, av: 180, tag: 'Mais barato',
      estrelas: 2, bairro: 'Centro', km: 0.4,
      comodidades: ['Café da manhã', 'Wi-Fi', 'Estacionamento'],
      chips: ['Café incluso', 'Casarão histórico'], facetas: ['cafe', 'estacionamento'],
      cats: ['historico', 'economico'],
    },
  ]),
  ...passeios('itaborai', [
    {
      nome: 'Rota dos engenhos e fazendas do café',
      sub: 'Zona rural · 5h · três fazendas com visita guiada · almoço à parte',
      preco: 92, margem: 25, nota: 8.8, av: 210, tag: 'História',
      horas: 5, saida: '09:00', inclui: ['Transporte entre as fazendas', 'Guia de história'],
      chips: ['Guia local', 'Transporte incluso'], facetas: ['guia', 'transporte', 'cancelamento'],
      cats: ['historico', 'natureza'],
    },
    {
      nome: 'Cachoeira do Jacarandá',
      sub: 'Serra de Cachoeiras · 4h · trilha leve até três poços',
      preco: 64, margem: 28, nota: 9.0, av: 260, tag: 'Refrescante',
      horas: 4, saida: '08:30', inclui: ['Guia credenciado', 'Seguro'],
      chips: ['Guia local', 'Nível leve'], facetas: ['guia', 'criancas', 'cancelamento'],
      cats: ['natureza', 'familia', 'aventura'],
    },
  ]),
  ...restaurantes('itaborai', [
    {
      nome: 'Sabor do Engenho',
      sub: 'Sambaetiba · comida mineira e fluminense no fogão a lenha',
      preco: 72, margem: 18, nota: 8.9, av: 410, tag: 'Fogão a lenha',
      cozinha: 'Brasileira rural', bairro: 'Sambaetiba',
      chips: ['Fogão a lenha', 'Para a família'], facetas: ['familia', 'vegetariano'],
      cats: ['gastronomia', 'economico'],
    },
  ]),
  ...carros('itaborai', [
    {
      nome: 'Localiza · Hyundai HB20',
      sub: 'Retirada no centro · quilometragem livre · bom para estrada de serra',
      preco: 112, margem: 23, nota: 8.5, av: 150, tag: 'Econômico',
      locadora: 'Localiza', cambio: 'manual', lugares: 5,
      chips: ['Ar-condicionado', 'Km livre'], facetas: ['arcondicionado'],
      cats: ['economico'],
    },
  ]),

  // ──────────────────────────────── Guapimirim ──────────────────────────────
  ...hospedagens('guapimirim', [
    {
      nome: 'Refúgio Dedo de Deus',
      sub: 'Parque Nacional · chalé com lareira · vista para o Dedo de Deus',
      preco: 385, margem: 16, nota: 9.3, av: 420, tag: 'Melhor vista',
      estrelas: 4, bairro: 'Parque Nacional', km: 6.0,
      comodidades: ['Lareira', 'Café da manhã', 'Piscina aquecida', 'Estacionamento', 'Pet friendly'],
      chips: ['Piscina', 'Lareira', 'Pet friendly'],
      facetas: ['piscina', 'cafe', 'pet', 'estacionamento'],
      cats: ['serra', 'natureza', 'romantico'],
    },
    {
      nome: 'Camping e Chalés Soberbo',
      sub: 'Beira do rio Soberbo · chalé simples ou barraca · área de churrasco',
      preco: 132, margem: 22, nota: 8.5, av: 380, tag: 'Mais barato',
      estrelas: 2, bairro: 'Soberbo', km: 4.2,
      comodidades: ['Churrasqueira', 'Estacionamento', 'Área de camping', 'Pet friendly'],
      chips: ['Pet friendly', 'Churrasqueira'], facetas: ['pet', 'estacionamento', 'familia'],
      cats: ['natureza', 'economico', 'aventura'],
    },
  ]),
  ...passeios('guapimirim', [
    {
      nome: 'Poço Verde e piscinas do rio Soberbo',
      sub: 'Parque Nacional · 4h · trilha leve entre poços de água cristalina',
      preco: 75, margem: 26, nota: 9.2, av: 640, tag: 'Para a família',
      horas: 4, saida: '09:00', inclui: ['Ingresso do parque', 'Guia credenciado'],
      chips: ['Guia local', 'Nível leve'], facetas: ['guia', 'criancas', 'cancelamento'],
      cats: ['natureza', 'familia'],
    },
    {
      nome: 'Travessia Petrópolis–Teresópolis · dia 1',
      sub: 'Serra dos Órgãos · 10h · a trilha de montanha mais clássica do país',
      preco: 420, margem: 15, nota: 9.7, av: 290, tag: 'Alta montanha',
      horas: 10, saida: '05:00', inclui: ['Guia de montanha', 'Seguro', 'Ingresso', 'Transporte à base'],
      chips: ['Guia local', 'Nível difícil', 'Seguro incluso'],
      facetas: ['guia', 'transporte', 'cancelamento'],
      cats: ['aventura', 'natureza', 'serra'],
    },
  ]),
  ...restaurantes('guapimirim', [
    {
      nome: 'Truta da Serra',
      sub: 'Estrada do parque · truta na manteiga com alcaparras · varanda',
      preco: 98, margem: 17, nota: 9.0, av: 520, tag: 'Truta fresca',
      cozinha: 'Serrana', bairro: 'Parque Nacional',
      chips: ['Vista para a serra', 'Vegetariano'], facetas: ['vista', 'vegetariano', 'reserva'],
      cats: ['gastronomia', 'serra'],
    },
  ]),
  ...carros('guapimirim', [
    {
      nome: 'Movida · Jeep Compass',
      sub: 'Retirada no centro · automático · tração ideal para estrada de terra',
      preco: 268, margem: 19, nota: 8.9, av: 160, tag: 'Para a serra',
      locadora: 'Movida', cambio: 'automatico', lugares: 5,
      chips: ['Automático', 'SUV', 'Ar-condicionado'],
      facetas: ['automatico', 'suv', 'arcondicionado'],
      cats: ['aventura', 'familia'],
    },
  ]),
]
