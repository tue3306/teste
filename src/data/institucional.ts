/**
 * Conteúdo das páginas institucionais.
 *
 * Sobre a Privacidade e os Termos: o texto descreve **o que este código faz de
 * fato** — quais dados ficam no navegador, quais APIs são chamadas, o que não é
 * coletado. Isso é verificável lendo `src/services/` e `src/hooks/useLocalStorage.ts`.
 *
 * O que o texto NÃO é: um documento jurídico revisado. Redigir cláusula
 * contratual e política de LGPD com aparência de definitiva, sem advogado, é
 * como um cliente publica algo que não o protege. Por isso as duas páginas
 * carregam um aviso visível de revisão pendente, e o que está escrito é
 * descrição técnica honesta em vez de juridiquês inventado.
 */

export interface Bloco {
  titulo: string
  paragrafos: string[]
  /** Itens de lista exibidos após os parágrafos. */
  itens?: string[]
}

export interface PaginaInstitucional {
  slug: string
  titulo: string
  subtitulo: string
  chamada: string
  /** Aviso destacado no topo, quando o conteúdo depende de revisão externa. */
  aviso?: string
  atualizadoEm: string
  blocos: Bloco[]
}

const ATUALIZADO = 'agosto de 2026'

export const PAGINAS: Record<string, PaginaInstitucional> = {
  sobre: {
    slug: 'sobre',
    titulo: 'Sobre',
    subtitulo: 'a BI&B',
    chamada:
      'Planejar uma viagem virou trabalho de escritório: doze abas, cinco preços para o mesmo quarto e uma planilha para não perder a conta. A BI&B existe para devolver esse tempo.',
    atualizadoEm: ATUALIZADO,
    blocos: [
      {
        titulo: 'O problema',
        paragrafos: [
          'Uma viagem de sete dias exige, em média, comparar voo em três buscadores, hospedagem em quatro e passeios em dois — e depois somar tudo à mão, sem saber se a diária que parecia barata continua barata depois de multiplicada pelas noites.',
          'Pior: o preço que aparece na busca quase nunca é o preço do checkout. Taxa de serviço, limpeza e política de cancelamento aparecem no fim, quando o cartão já está na mão.',
        ],
      },
      {
        titulo: 'O que fazemos',
        paragrafos: [
          'Uma consulta dispara todas as verticais ao mesmo tempo e devolve o resultado ranqueado por custo-benefício real — não por comissão. O preço exibido é o preço final, com taxas.',
          'Em cima disso, a BI&B fecha a conta: cada item declara como é cobrado — por pessoa, por noite, por dia — e o total da viagem se refaz a cada escolha, com a economia contra o preço médio de mercado ao lado.',
        ],
      },
      {
        titulo: 'Como ganhamos dinheiro',
        paragrafos: [
          'Comissão do fornecedor sobre o que é reservado, e só. Planejar é grátis e não exige conta.',
          'A comissão não influencia a ordenação. É por isso que a opção mais barata frequentemente aparece antes da que nos paga mais — se fosse o contrário, o comparador não serviria para nada.',
        ],
      },
      {
        titulo: 'Onde estamos',
        paragrafos: [
          'Feito no Rio de Janeiro. O Rio é o primeiro destino com inventário completo; São Paulo, Salvador, Fernando de Noronha, Foz do Iguaçu, Jericoacoara, Lençóis Maranhenses, Chapada Diamantina, Bonito e Gramado entram ao longo do ano.',
        ],
      },
    ],
  },

  privacidade: {
    slug: 'privacidade',
    titulo: 'Privacidade',
    subtitulo: 'e dados',
    chamada:
      'O que esta aplicação guarda, onde guarda e com quem fala. Descrição técnica do comportamento real do produto.',
    aviso:
      'Este texto descreve com precisão o que o código faz, mas ainda não passou por revisão jurídica. Antes de publicar, um advogado precisa adequá-lo à LGPD (Lei 13.709/2018) e nomear o controlador e o encarregado de dados.',
    atualizadoEm: ATUALIZADO,
    blocos: [
      {
        titulo: 'O que fica no seu navegador',
        paragrafos: [
          'Favoritos, a viagem montada e o checklist são gravados no `localStorage` do seu navegador. Nunca saem do seu aparelho: não há servidor recebendo esses dados nesta versão.',
          'Limpar os dados do site no navegador apaga tudo, sem deixar cópia. Não há conta, não há sincronização entre aparelhos e não há como recuperar o que foi apagado.',
        ],
        itens: [
          'bib:favoritos — ids das ofertas salvas',
          'bib:reservas — ids das ofertas reservadas',
          'bib:checklist — itens de preparação concluídos',
          'bib:viagem:v2 — os itens que você escolheu e a quantidade de cada um',
        ],
      },
      {
        titulo: 'O que não coletamos',
        paragrafos: [
          'Nenhum cookie é gravado por esta aplicação. Não há Google Analytics, pixel de rede social, mapa de calor ou qualquer script de rastreamento de terceiro. Não há formulário que peça CPF, endereço ou dado de pagamento.',
          'A sessão de login fica em `sessionStorage` e desaparece quando você fecha a aba.',
        ],
      },
      {
        titulo: 'Serviços externos consultados',
        paragrafos: [
          'Três APIs públicas são chamadas diretamente pelo seu navegador. Cada uma recebe apenas o mínimo necessário para responder, e nenhuma recebe identificador seu.',
        ],
        itens: [
          'Open-Meteo — recebe a coordenada do destino para devolver a previsão do tempo',
          'Open-Meteo Geocoding — recebe o texto digitado no campo de destino',
          'ViaCEP — recebe o CEP digitado, quando você usa essa forma de busca',
        ],
      },
      {
        titulo: 'Imagens',
        paragrafos: [
          'As fotos de destinos vêm do Wikimedia Commons, sob licença livre, e são baixadas e otimizadas na hora de gerar o site. São servidas deste mesmo domínio — o Wikimedia não recebe visita sua nem sabe que você esteve aqui. Autor e licença de cada foto estão no rodapé.',
        ],
      },
      {
        titulo: 'Quando houver conta e reserva de verdade',
        paragrafos: [
          'A versão com autenticação e reserva real vai tratar dado pessoal e de pagamento, e esta política precisará ser reescrita antes disso — com base legal declarada por finalidade, prazo de retenção e canal para exercer os direitos do titular previstos na LGPD.',
        ],
      },
    ],
  },

  termos: {
    slug: 'termos',
    titulo: 'Termos',
    subtitulo: 'de uso',
    chamada: 'As regras de uso desta plataforma e os limites do que ela promete.',
    aviso:
      'Rascunho técnico, ainda sem revisão jurídica. As cláusulas de responsabilidade, foro e alteração de termos precisam ser redigidas por um advogado antes de qualquer uso comercial.',
    atualizadoEm: ATUALIZADO,
    blocos: [
      {
        titulo: 'O que a BI&B é',
        paragrafos: [
          'A BI&B é uma plataforma de busca, comparação e planejamento. Não somos companhia aérea, hotel nem operadora de turismo: intermediamos a reserva junto ao fornecedor, e é com ele que o contrato de prestação do serviço se estabelece.',
          'Cancelamento, alteração e reembolso seguem a política do fornecedor escolhido, exibida antes da confirmação.',
        ],
      },
      {
        titulo: 'Preços e disponibilidade',
        paragrafos: [
          'Os preços exibidos são os finais, com taxas incluídas, no momento da consulta. Tarifa aérea e diária de hotel mudam ao longo do dia; a confirmação vale o preço apresentado na tela de confirmação, não o da busca anterior.',
          'Nesta versão de demonstração, preços, notas e disponibilidade são dados de exemplo e não representam ofertas reais.',
        ],
      },
      {
        titulo: 'Melhor preço garantido',
        paragrafos: [
          'Encontrando a mesma reserva mais barata em outro canal em até 24 horas, com as mesmas condições de cancelamento e as mesmas inclusões, devolvemos a diferença em crédito. Condições idênticas é o ponto: tarifa não reembolsável não se compara com tarifa flexível.',
        ],
      },
      {
        titulo: 'Uso aceitável',
        paragrafos: [
          'A plataforma é para uso pessoal de planejamento. Não é permitido raspar o conteúdo de forma automatizada, revender os dados de preço nem contornar limites técnicos do serviço.',
        ],
      },
      {
        titulo: 'Dados de demonstração',
        paragrafos: [
          'O catálogo desta versão é de demonstração: os destinos, as coordenadas e as distâncias são reais, mas os estabelecimentos, os preços e as avaliações foram criados para o exemplo e não correspondem a ofertas comercializáveis. Nenhuma reserva é efetivada e nenhum dado de pagamento é pedido.',
        ],
      },
    ],
  },
}

export const SLUGS_INSTITUCIONAIS = Object.keys(PAGINAS)
