import { eventos, restaurantes } from './construtores'
import type { Oferta } from '@/types'

/**
 * Segunda camada do inventário: mais mesas e a agenda de eventos.
 *
 * A primeira rodada deixou o catálogo desequilibrado — 62 hospedagens contra 33
 * restaurantes e 6 eventos, o que fazia a aba "Eventos" abrir vazia em 23 dos
 * 29 destinos. Aqui cada cidade ganha pelo menos um evento e a maioria chega a
 * três restaurantes.
 *
 * Os eventos são datados entre setembro de 2026 e março de 2027 e seguem o
 * calendário real de cada lugar: festa de padroeiro, festival consolidado,
 * temporada de surfe, colheita. Os nomes dos estabelecimentos continuam
 * fictícios, como no resto do catálogo.
 */
export const ITENS_EXTRA: Oferta[] = [
  // ─────────────────────────── Região Metropolitana ───────────────────────────
  ...restaurantes('niteroi', [
    {
      nome: 'Icaraí Cozinha de Bairro',
      sub: 'Icaraí · menu executivo e massa fresca · casa de esquina',
      preco: 74, margem: 19, nota: 8.8, av: 540, tag: 'Custo-benefício',
      cozinha: 'Contemporânea', bairro: 'Icaraí',
      chips: ['Vegetariano', 'Reserva'], facetas: ['vegetariano', 'reserva', 'familia'],
      cats: ['gastronomia', 'economico'],
    },
    {
      nome: 'Costão de Itacoatiara',
      sub: 'Itacoatiara · peixe na crosta e ceviche · varanda sobre a praia',
      preco: 148, margem: 16, nota: 9.2, av: 780, tag: 'Vista da praia',
      cozinha: 'Frutos do mar', bairro: 'Itacoatiara',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'reserva'],
      cats: ['gastronomia', 'praia', 'romantico'],
    },
  ], 'rx'),
  ...restaurantes('marica', [
    {
      nome: 'Cantina de Itaipuaçu',
      sub: 'Itaipuaçu · massa artesanal e forno a lenha · 200 m da areia',
      preco: 82, margem: 20, nota: 8.9, av: 390, tag: 'Massa fresca',
      cozinha: 'Italiana', bairro: 'Itaipuaçu',
      chips: ['Vegetariano', 'Para a família'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'familia'],
    },
  ], 'rx'),
  ...restaurantes('itaborai', [
    {
      nome: 'Casa de Farinha',
      sub: 'Centro · galinha caipira e tutu de feijão · almoço servido em travessa',
      preco: 58, margem: 22, nota: 8.6, av: 280, tag: 'Mais barato',
      cozinha: 'Fluminense', bairro: 'Centro',
      chips: ['Para a família', 'Porção generosa'], facetas: ['familia', 'vegetariano'],
      cats: ['gastronomia', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('guapimirim', [
    {
      nome: 'Varanda do Soberbo',
      sub: 'Parque Nacional · café colonial e bolo de fubá · vista do Dedo de Deus',
      preco: 62, margem: 24, nota: 9.0, av: 420, tag: 'Café colonial',
      cozinha: 'Café e doces', bairro: 'Parque Nacional',
      chips: ['Vista para a serra', 'Vegetariano'], facetas: ['vista', 'vegetariano', 'familia'],
      cats: ['gastronomia', 'serra', 'economico'],
    },
  ], 'rx'),
  ...eventos('niteroi', [
    {
      nome: 'Festa de São Pedro dos Pescadores',
      sub: 'Ponta d’Areia · procissão marítima e barracas de peixe · três dias',
      preco: 25, margem: 36, nota: 8.9, av: 420, tag: 'Tradição',
      data: '2026-11-08', local: 'Praia da Ponta d’Areia',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia'],
    },
  ], 'ex'),
  ...eventos('marica', [
    {
      nome: 'Maricá Verão · palco na Barra',
      sub: 'Barra de Maricá · shows na areia ao pôr do sol · janeiro inteiro',
      preco: 40, margem: 32, nota: 8.7, av: 310, tag: 'Verão',
      data: '2027-01-17', local: 'Praia da Barra de Maricá',
      chips: ['Ao ar livre', 'Pôr do sol'], facetas: ['gratuito'],
      cats: ['noite', 'praia'],
    },
  ], 'ex'),
  ...eventos('itaborai', [
    {
      nome: 'Festa de São João Batista',
      sub: 'Centro · quermesse na praça da Matriz · comida de festa junina',
      preco: 20, margem: 40, nota: 8.4, av: 190, tag: 'Padroeiro',
      data: '2026-09-27', local: 'Praça da Matriz',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia', 'economico'],
    },
  ], 'ex'),
  ...eventos('guapimirim', [
    {
      nome: 'Encontro de Montanhismo da Serra dos Órgãos',
      sub: 'Sede do parque · palestras, oficinas e travessia guiada · fim de semana',
      preco: 85, margem: 28, nota: 9.1, av: 240, tag: 'Montanhismo',
      data: '2026-10-10', local: 'Sede Guapimirim do PARNASO',
      chips: ['Oficinas', 'Trilha guiada'], facetas: ['coberto'],
      cats: ['aventura', 'natureza'],
    },
  ], 'ex'),

  // ──────────────────────────── Costa do Sol ─────────────────────────────────
  ...restaurantes('cabo-frio', [
    {
      nome: 'Dunas do Peró Beach Club',
      sub: 'Peró · risoto de camarão e drinks · mesa na areia até o pôr do sol',
      preco: 168, margem: 15, nota: 9.0, av: 920, tag: 'Pé na areia',
      cozinha: 'Frutos do mar', bairro: 'Peró',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'reserva'],
      cats: ['gastronomia', 'praia', 'premium'],
    },
    {
      nome: 'Bistrô da Passagem',
      sub: 'Passagem · menu de três tempos · casa pequena, 9 mesas',
      preco: 195, margem: 14, nota: 9.3, av: 460, tag: 'Alta gastronomia',
      cozinha: 'Francesa contemporânea', bairro: 'Passagem',
      chips: ['Reserva obrigatória', 'Vegetariano'], facetas: ['reserva', 'vegetariano'],
      cats: ['gastronomia', 'romantico', 'premium'],
    },
  ], 'rx'),
  ...restaurantes('arraial-do-cabo', [
    {
      nome: 'Cantinho da Prainha',
      sub: 'Prainha · moqueca de badejo para dois · fila de espera no verão',
      preco: 96, margem: 20, nota: 9.1, av: 1120, tag: 'Tradicional',
      cozinha: 'Frutos do mar', bairro: 'Prainha',
      chips: ['Frutos do mar', 'Para a família'], facetas: ['frutosdomar', 'familia'],
      cats: ['gastronomia', 'praia'],
    },
    {
      nome: 'Boteco do Pescador',
      sub: 'Praia dos Anjos · isca de peixe e cerveja gelada · aberto desde as 11h',
      preco: 54, margem: 24, nota: 8.7, av: 680, tag: 'Mais barato',
      cozinha: 'Boteco de praia', bairro: 'Praia dos Anjos',
      chips: ['Vista para o porto', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'familia'],
      cats: ['gastronomia', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('araruama', [
    {
      nome: 'Sal da Lagoa',
      sub: 'Iguabinha · peixe da lagoa e camarão ao molho de maracujá · deck',
      preco: 92, margem: 18, nota: 8.9, av: 380, tag: 'Sobre a lagoa',
      cozinha: 'Frutos do mar', bairro: 'Iguabinha',
      chips: ['Vista para a lagoa', 'Reserva'], facetas: ['vista', 'frutosdomar', 'reserva'],
      cats: ['gastronomia', 'romantico'],
    },
  ], 'rx'),
  ...restaurantes('sao-pedro-da-aldeia', [
    {
      nome: 'Forno da Aldeia',
      sub: 'Centro · pizza napolitana em forno a lenha · noite inteira',
      preco: 68, margem: 21, nota: 8.6, av: 340, tag: 'Forno a lenha',
      cozinha: 'Pizza', bairro: 'Centro',
      chips: ['Vegetariano', 'Para a família'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'familia', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('saquarema', [
    {
      nome: 'Café do Surfista',
      sub: 'Itaúna · açaí, tapioca e café de coador · abre às 6h',
      preco: 42, margem: 26, nota: 8.8, av: 620, tag: 'Café da manhã',
      cozinha: 'Café e lanches', bairro: 'Itaúna',
      chips: ['Vegetariano', 'Abre cedo'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'economico', 'aventura'],
    },
    {
      nome: 'Mesa da Vila',
      sub: 'Praia da Vila · frutos do mar e massa · frente para a igrejinha',
      preco: 118, margem: 17, nota: 9.0, av: 480, tag: 'Melhor vista',
      cozinha: 'Frutos do mar', bairro: 'Praia da Vila',
      chips: ['Vista para o mar', 'Reserva'], facetas: ['vista', 'frutosdomar', 'reserva'],
      cats: ['gastronomia', 'romantico', 'praia'],
    },
  ], 'rx'),
  ...restaurantes('rio-das-ostras', [
    {
      nome: 'Jazz Bistrô',
      sub: 'Centro · cozinha de bar e música ao vivo de quinta a domingo',
      preco: 88, margem: 20, nota: 8.8, av: 420, tag: 'Música ao vivo',
      cozinha: 'Bistrô', bairro: 'Centro',
      chips: ['Música ao vivo', 'Reserva'], facetas: ['reserva', 'vegetariano'],
      cats: ['gastronomia', 'noite'],
    },
  ], 'rx'),
  ...eventos('cabo-frio', [
    {
      nome: 'Réveillon da Praia do Forte',
      sub: 'Praia do Forte · queima de fogos e três palcos na areia',
      preco: 60, margem: 34, nota: 8.9, av: 740, tag: 'Réveillon',
      data: '2026-12-31', local: 'Praia do Forte',
      chips: ['Ao ar livre', 'Queima de fogos'], facetas: ['gratuito'],
      cats: ['noite', 'praia', 'familia'],
    },
  ], 'ex'),
  ...eventos('arraial-do-cabo', [
    {
      nome: 'Festival do Mar de Arraial',
      sub: 'Praia dos Anjos · gastronomia caiçara e mergulho guiado gratuito',
      preco: 35, margem: 33, nota: 9.0, av: 380, tag: 'Gastronomia',
      data: '2026-10-24', local: 'Orla da Praia dos Anjos',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['gastronomia', 'praia', 'familia'],
    },
  ], 'ex'),
  ...eventos('araruama', [
    {
      nome: 'Regata da Lagoa de Araruama',
      sub: 'Orla de Iguabinha · vela e stand-up · arquibancada na praia',
      preco: 22, margem: 38, nota: 8.5, av: 190, tag: 'Esporte',
      data: '2026-11-21', local: 'Orla de Iguabinha',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['aventura', 'familia', 'economico'],
    },
  ], 'ex'),
  ...eventos('sao-pedro-da-aldeia', [
    {
      nome: 'Festa de Nossa Senhora da Assunção',
      sub: 'Centro histórico · missa, procissão e quermesse na igreja de 1723',
      preco: 20, margem: 40, nota: 8.6, av: 260, tag: 'Padroeira',
      data: '2026-09-13', local: 'Igreja de Nossa Senhora da Assunção',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia', 'economico'],
    },
  ], 'ex'),
  ...eventos('saquarema', [
    {
      nome: 'Etapa mundial de surfe em Itaúna',
      sub: 'Praia de Itaúna · arquibancada, arena e transmissão · uma semana',
      preco: 75, margem: 30, nota: 9.4, av: 1280, tag: 'Circuito mundial',
      data: '2027-01-10', local: 'Praia de Itaúna',
      chips: ['Ao ar livre', 'Arena montada'], facetas: ['gratuito', 'criancas'],
      cats: ['aventura', 'praia', 'familia'],
    },
  ], 'ex'),

  // ───────────────────────────── Costa Verde ─────────────────────────────────
  ...restaurantes('angra-dos-reis', [
    {
      nome: 'Bracuhy Marina Grill',
      sub: 'Bracuí · peixe na brasa e ostras · mesas sobre o píer',
      preco: 142, margem: 16, nota: 9.0, av: 620, tag: 'Sobre o píer',
      cozinha: 'Frutos do mar', bairro: 'Bracuí',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'reserva'],
      cats: ['gastronomia', 'praia'],
    },
    {
      nome: 'Cozinha do Centro Histórico',
      sub: 'Centro · comida caiçara e camarão na moranga · casarão colonial',
      preco: 88, margem: 19, nota: 8.8, av: 480, tag: 'Custo-benefício',
      cozinha: 'Caiçara', bairro: 'Centro',
      chips: ['Frutos do mar', 'Para a família'], facetas: ['frutosdomar', 'familia'],
      cats: ['gastronomia', 'historico'],
    },
  ], 'rx'),
  ...restaurantes('ilha-grande', [
    {
      nome: 'Bar do Abraão',
      sub: 'Vila do Abraão · isca de peixe e caipirinha · pé na areia',
      preco: 64, margem: 23, nota: 8.7, av: 780, tag: 'Mais barato',
      cozinha: 'Boteco de praia', bairro: 'Vila do Abraão',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'familia'],
      cats: ['gastronomia', 'economico', 'praia'],
    },
    {
      nome: 'Terraço Lopes Mendes',
      sub: 'Vila do Abraão · menu de peixe do dia · jantar com reserva',
      preco: 165, margem: 15, nota: 9.2, av: 340, tag: 'Jantar',
      cozinha: 'Contemporânea', bairro: 'Vila do Abraão',
      chips: ['Reserva obrigatória', 'Vegetariano'], facetas: ['reserva', 'vegetariano', 'vista'],
      cats: ['gastronomia', 'romantico', 'premium'],
    },
  ], 'rx'),
  ...restaurantes('paraty', [
    {
      nome: 'Quintal das Letras',
      sub: 'Centro histórico · cozinha caiçara no quintal · jantar à luz de vela',
      preco: 158, margem: 16, nota: 9.2, av: 720, tag: 'Romântico',
      cozinha: 'Caiçara', bairro: 'Centro histórico',
      chips: ['Reserva', 'Vegetariano'], facetas: ['reserva', 'vegetariano'],
      cats: ['gastronomia', 'romantico', 'historico'],
    },
    {
      nome: 'Armazém da Cachaça',
      sub: 'Centro histórico · petiscos e degustação de alambiques locais',
      preco: 72, margem: 22, nota: 8.9, av: 940, tag: 'Degustação',
      cozinha: 'Petiscos', bairro: 'Centro histórico',
      chips: ['Degustação', 'Aberto até tarde'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'noite', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('mangaratiba', [
    {
      nome: 'Serra do Piloto Café',
      sub: 'Serra do Piloto · café da roça e truta · varanda a 700 m de altitude',
      preco: 76, margem: 21, nota: 8.9, av: 260, tag: 'Na serra',
      cozinha: 'Serrana', bairro: 'Serra do Piloto',
      chips: ['Vista da baía', 'Vegetariano'], facetas: ['vista', 'vegetariano'],
      cats: ['gastronomia', 'serra', 'romantico'],
    },
  ], 'rx'),
  ...eventos('angra-dos-reis', [
    {
      nome: 'Festa do Divino de Angra',
      sub: 'Centro histórico · folia, procissão e comida de festa · quatro dias',
      preco: 25, margem: 36, nota: 8.8, av: 420, tag: 'Tradição',
      data: '2026-10-03', local: 'Convento do Carmo, Centro',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia'],
    },
  ], 'ex'),
  ...eventos('ilha-grande', [
    {
      nome: 'Travessia do Pico do Papagaio · edição da lua cheia',
      sub: 'Abraão · subida noturna guiada e amanhecer no cume · vagas limitadas',
      preco: 290, margem: 18, nota: 9.5, av: 180, tag: 'Lua cheia',
      data: '2026-11-24', local: 'Trilha do Pico do Papagaio',
      chips: ['Guia de montanha', 'Vagas limitadas'], facetas: ['coberto'],
      cats: ['aventura', 'natureza', 'romantico'],
    },
  ], 'ex'),
  ...eventos('mangaratiba', [
    {
      nome: 'Subida da Serra do Piloto · cicloturismo',
      sub: 'Serra do Piloto · 12 km de subida cronometrada · apoio e hidratação',
      preco: 95, margem: 26, nota: 8.9, av: 210, tag: 'Ciclismo',
      data: '2026-09-20', local: 'Serra do Piloto',
      chips: ['Apoio incluso', 'Cronometrada'], facetas: ['coberto'],
      cats: ['aventura', 'natureza'],
    },
  ], 'ex'),
  ...eventos('itaguai', [
    {
      nome: 'Feira de Cerâmica de Itaguaí',
      sub: 'Centro · ateliês abertos, oficina de torno e venda direta',
      preco: 20, margem: 40, nota: 8.5, av: 160, tag: 'Artesanato',
      data: '2026-10-17', local: 'Praça do Centro',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia', 'economico'],
    },
  ], 'ex'),

  // ───────────────────────────── Região Serrana ──────────────────────────────
  ...restaurantes('petropolis', [
    {
      nome: 'Cervejaria Vale do Cuiabá',
      sub: 'Itaipava · costela defumada e chope da casa · mesas no jardim',
      preco: 112, margem: 18, nota: 9.0, av: 1240, tag: 'Chope artesanal',
      cozinha: 'Cervejaria', bairro: 'Itaipava',
      chips: ['Chope da casa', 'Para a família'], facetas: ['familia', 'vegetariano'],
      cats: ['gastronomia', 'noite'],
    },
    {
      nome: 'Confeitaria Imperial',
      sub: 'Centro Histórico · chá da tarde e torta alemã · casa de 1932',
      preco: 58, margem: 24, nota: 9.1, av: 1680, tag: 'Chá da tarde',
      cozinha: 'Confeitaria', bairro: 'Centro Histórico',
      chips: ['Vegetariano', 'Para a família'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'historico', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('teresopolis', [
    {
      nome: 'Truta do Alto',
      sub: 'Alto · truta defumada na hora e purê de mandioquinha · lareira',
      preco: 108, margem: 18, nota: 9.0, av: 640, tag: 'Truta fresca',
      cozinha: 'Serrana', bairro: 'Alto',
      chips: ['Lareira', 'Reserva'], facetas: ['reserva', 'vegetariano', 'familia'],
      cats: ['gastronomia', 'serra'],
    },
    {
      nome: 'Padaria da Feirinha',
      sub: 'Alto · pão de fermentação natural e caldo de mocotó · abre às 7h',
      preco: 44, margem: 25, nota: 8.7, av: 520, tag: 'Mais barato',
      cozinha: 'Padaria', bairro: 'Alto',
      chips: ['Abre cedo', 'Vegetariano'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('nova-friburgo', [
    {
      nome: 'Fondue da Colônia',
      sub: 'Centro · fondue de queijo e chocolate · receita suíça de 1818',
      preco: 152, margem: 16, nota: 9.1, av: 820, tag: 'Fondue',
      cozinha: 'Suíça', bairro: 'Centro',
      chips: ['Reserva', 'Vegetariano'], facetas: ['reserva', 'vegetariano'],
      cats: ['gastronomia', 'serra', 'romantico'],
    },
    {
      nome: 'Bar do Poço · São Pedro da Serra',
      sub: 'São Pedro da Serra · petiscos e cerveja artesanal · música ao vivo',
      preco: 66, margem: 22, nota: 8.8, av: 460, tag: 'Música ao vivo',
      cozinha: 'Petiscos', bairro: 'São Pedro da Serra',
      chips: ['Música ao vivo', 'Vegetariano'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'noite', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('miguel-pereira', [
    {
      nome: 'Café da Estação',
      sub: 'Governador Portela · café coado e bolo caseiro na antiga estação',
      preco: 38, margem: 26, nota: 8.7, av: 280, tag: 'Mais barato',
      cozinha: 'Café e doces', bairro: 'Governador Portela',
      chips: ['Vegetariano', 'Para criança'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'economico', 'familia'],
    },
  ], 'rx'),
  ...restaurantes('vassouras', [
    {
      nome: 'Doceria da Praça',
      sub: 'Centro · doce de leite de tacho e queijadinha · casarão do século XIX',
      preco: 36, margem: 27, nota: 8.8, av: 320, tag: 'Doces de tacho',
      cozinha: 'Doceria', bairro: 'Centro',
      chips: ['Vegetariano', 'Para criança'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'historico', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('valenca', [
    {
      nome: 'Varanda da Fazenda',
      sub: 'Zona rural · almoço servido na sede de 1860 · reserva no dia anterior',
      preco: 128, margem: 17, nota: 9.0, av: 240, tag: 'Na fazenda',
      cozinha: 'Brasileira de fazenda', bairro: 'Zona rural',
      chips: ['Reserva obrigatória', 'Vista do vale'], facetas: ['reserva', 'vista', 'familia'],
      cats: ['gastronomia', 'historico'],
    },
  ], 'rx'),
  ...restaurantes('conservatoria', [
    {
      nome: 'Café da Seresta',
      sub: 'Centro · café colonial servido a partir das 16h · antes da serenata',
      preco: 48, margem: 25, nota: 9.0, av: 380, tag: 'Café colonial',
      cozinha: 'Café colonial', bairro: 'Centro',
      chips: ['Vegetariano', 'Antes da seresta'], facetas: ['vegetariano', 'familia'],
      cats: ['gastronomia', 'romantico', 'economico'],
    },
  ], 'rx'),
  ...eventos('teresopolis', [
    {
      nome: 'Festival de Inverno de Teresópolis',
      sub: 'Centro · música, cinema ao ar livre e fondue nas ruas · 10 dias',
      preco: 45, margem: 32, nota: 9.0, av: 680, tag: 'Inverno',
      data: '2026-09-06', local: 'Centro de Teresópolis',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['gastronomia', 'serra', 'familia'],
    },
  ], 'ex'),
  ...eventos('nova-friburgo', [
    {
      nome: 'Festa Suíça de Nova Friburgo',
      sub: 'Centro · dança folclórica, fondue e chope · herança da colônia de 1818',
      preco: 38, margem: 33, nota: 9.0, av: 740, tag: 'Colônia suíça',
      data: '2026-10-31', local: 'Praça Getúlio Vargas',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['gastronomia', 'historico', 'familia'],
    },
  ], 'ex'),
  ...eventos('miguel-pereira', [
    {
      nome: 'Encontro de Balonismo do Vale',
      sub: 'Morro Azul · voo cativo, parapente e feira de produtores',
      preco: 55, margem: 30, nota: 8.9, av: 290, tag: 'Balonismo',
      data: '2026-09-12', local: 'Morro Azul',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['aventura', 'familia', 'natureza'],
    },
  ], 'ex'),
  ...eventos('vassouras', [
    {
      nome: 'Circuito Vale do Café · concertos nas fazendas',
      sub: 'Fazendas históricas · música de câmara nas sedes do século XIX',
      preco: 90, margem: 26, nota: 9.2, av: 340, tag: 'Música erudita',
      data: '2026-11-14', local: 'Fazenda Cachoeira Grande',
      chips: ['Coberto', 'Transporte opcional'], facetas: ['coberto'],
      cats: ['historico', 'romantico', 'premium'],
    },
  ], 'ex'),
  ...eventos('valenca', [
    {
      nome: 'Festa do Café de Valença',
      sub: 'Centro · colheita aberta, degustação e feira de produtores',
      preco: 30, margem: 34, nota: 8.7, av: 210, tag: 'Colheita',
      data: '2026-09-05', local: 'Praça Central',
      chips: ['Ao ar livre', 'Degustação'], facetas: ['gratuito', 'criancas'],
      cats: ['gastronomia', 'historico', 'economico'],
    },
  ], 'ex'),
  ...eventos('conservatoria', [
    {
      nome: 'Encontro Nacional de Serenateiros',
      sub: 'Ruas do centro · violeiros de todo o país · sexta e sábado até tarde',
      preco: 35, margem: 34, nota: 9.4, av: 620, tag: 'Seresta',
      data: '2026-10-09', local: 'Ruas do centro histórico',
      chips: ['Ao ar livre', 'Até tarde'], facetas: ['gratuito'],
      cats: ['romantico', 'noite', 'historico'],
    },
  ], 'ex'),

  // ────────────────────── Norte e Noroeste Fluminense ────────────────────────
  ...restaurantes('campos-dos-goytacazes', [
    {
      nome: 'Solar do Colégio Restaurante',
      sub: 'Centro · carne de sol com macaxeira · casarão restaurado',
      preco: 92, margem: 19, nota: 8.8, av: 520, tag: 'Casarão histórico',
      cozinha: 'Fluminense', bairro: 'Centro',
      chips: ['Reserva', 'Para a família'], facetas: ['reserva', 'familia'],
      cats: ['gastronomia', 'historico'],
    },
    {
      nome: 'Peixaria da Lagoa de Cima',
      sub: 'Lagoa de Cima · traíra frita e pirão · mesa na beira da água',
      preco: 66, margem: 22, nota: 8.7, av: 280, tag: 'Na lagoa',
      cozinha: 'Frutos do mar', bairro: 'Lagoa de Cima',
      chips: ['Vista para a lagoa', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'familia'],
      cats: ['gastronomia', 'natureza', 'economico'],
    },
  ], 'rx'),
  ...restaurantes('sao-joao-da-barra', [
    {
      nome: 'Grussaí Beach Grill',
      sub: 'Grussaí · camarão na chapa e caldeirada · quiosque com deck',
      preco: 96, margem: 19, nota: 8.8, av: 380, tag: 'Pé na areia',
      cozinha: 'Frutos do mar', bairro: 'Grussaí',
      chips: ['Vista para o mar', 'Frutos do mar'], facetas: ['vista', 'frutosdomar', 'familia'],
      cats: ['gastronomia', 'praia'],
    },
  ], 'rx'),
  ...restaurantes('macae', [
    {
      nome: 'Mercado do Peixe de Macaé',
      sub: 'Centro · peixe escolhido na banca e preparado na hora',
      preco: 78, margem: 21, nota: 8.9, av: 640, tag: 'Do dia',
      cozinha: 'Frutos do mar', bairro: 'Centro',
      chips: ['Frutos do mar', 'Para a família'], facetas: ['frutosdomar', 'familia'],
      cats: ['gastronomia', 'economico'],
    },
    {
      nome: 'Lagomar Cozinha de Praia',
      sub: 'Lagomar · ceviche e peixe grelhado · vista da restinga',
      preco: 124, margem: 17, nota: 9.0, av: 420, tag: 'Vista da restinga',
      cozinha: 'Contemporânea', bairro: 'Lagomar',
      chips: ['Vista para o mar', 'Vegetariano'], facetas: ['vista', 'vegetariano', 'reserva'],
      cats: ['gastronomia', 'natureza', 'romantico'],
    },
  ], 'rx'),
  ...restaurantes('quissama', [
    {
      nome: 'Peixaria da Barra do Furado',
      sub: 'Barra do Furado · camarão sete-barbas direto do barco',
      preco: 58, margem: 23, nota: 8.8, av: 190, tag: 'Direto do barco',
      cozinha: 'Frutos do mar', bairro: 'Barra do Furado',
      chips: ['Frutos do mar', 'Vista do canal'], facetas: ['vista', 'frutosdomar', 'familia'],
      cats: ['gastronomia', 'economico', 'praia'],
    },
  ], 'rx'),
  ...restaurantes('sao-francisco-de-itabapoana', [
    {
      nome: 'Cantina de Sant’Ana',
      sub: 'Sant’Ana · peixe assado na folha de bananeira · almoço só',
      preco: 54, margem: 24, nota: 8.7, av: 150, tag: 'Almoço',
      cozinha: 'Frutos do mar', bairro: 'Sant’Ana',
      chips: ['Frutos do mar', 'Para a família'], facetas: ['frutosdomar', 'familia'],
      cats: ['gastronomia', 'economico'],
    },
  ], 'rx'),
  ...eventos('campos-dos-goytacazes', [
    {
      nome: 'Temporada do Teatro Trianon',
      sub: 'Teatro Trianon · ópera e orquestra na casa de 1912 · agenda mensal',
      preco: 70, margem: 28, nota: 9.0, av: 380, tag: 'Teatro',
      data: '2026-09-26', local: 'Teatro Trianon',
      chips: ['Coberto', 'Casa histórica'], facetas: ['coberto'],
      cats: ['historico', 'premium'],
    },
  ], 'ex'),
  ...eventos('sao-joao-da-barra', [
    {
      nome: 'Festa de São João Batista de Atafona',
      sub: 'Atafona · procissão de barcos na foz do Paraíba do Sul',
      preco: 20, margem: 40, nota: 8.6, av: 220, tag: 'Padroeiro',
      data: '2026-10-11', local: 'Foz do Paraíba do Sul, Atafona',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia', 'economico'],
    },
  ], 'ex'),
  ...eventos('macae', [
    {
      nome: 'Macaé Offshore · regata e feira do mar',
      sub: 'Praia de Cavaleiros · regata, food trucks e shows na areia',
      preco: 45, margem: 31, nota: 8.8, av: 460, tag: 'Regata',
      data: '2026-11-28', local: 'Praia de Cavaleiros',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['aventura', 'praia', 'familia'],
    },
  ], 'ex'),
  ...eventos('quissama', [
    {
      nome: 'Festa do Jongo de Machadinha',
      sub: 'Fazenda Machadinha · jongo, roda e comida quilombola · patrimônio imaterial',
      preco: 30, margem: 35, nota: 9.3, av: 280, tag: 'Patrimônio',
      data: '2026-10-18', local: 'Fazenda Machadinha',
      chips: ['Ao ar livre', 'Cultura quilombola'], facetas: ['gratuito', 'criancas'],
      cats: ['historico', 'familia'],
    },
  ], 'ex'),
  ...eventos('sao-francisco-de-itabapoana', [
    {
      nome: 'Mutirão das Tartarugas de Guaxindiba',
      sub: 'Praia de Guaxindiba · soltura de filhotes com o projeto de monitoramento',
      preco: 25, margem: 36, nota: 9.2, av: 140, tag: 'Só na temporada',
      data: '2027-01-24', local: 'Praia de Guaxindiba',
      chips: ['Ao ar livre', 'Para criança'], facetas: ['gratuito', 'criancas'],
      cats: ['natureza', 'familia'],
    },
  ], 'ex'),
]
