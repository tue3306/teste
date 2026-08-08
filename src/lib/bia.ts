/**
 * Bia — a assistente de demonstração.
 *
 * É um classificador por palavra-chave, não um modelo de linguagem: a pergunta
 * cai na primeira regra que casar e a resposta correspondente é devolvida. A
 * tabela abaixo torna explícito o que no protótipo era uma escada de sete `if`
 * com expressões regulares embutidas — adicionar um assunto agora é acrescentar
 * uma entrada, não editar fluxo de controle.
 *
 * O ponto de troca por uma API real é `responder()`: basta torná-la assíncrona
 * e chamar o backend, mantendo esta tabela como resposta de contingência.
 */

interface Regra {
  /** Assunto que a regra cobre — serve de documentação e de chave de teste. */
  assunto: string
  padrao: RegExp
  resposta: string
}

const REGRAS: Regra[] = [
  {
    assunto: 'orçamento',
    padrao: /gast|orçam|orcam|custo|quanto/i,
    resposta:
      'Com o que já está no seu roteiro, a viagem fecha em R$ 5.240 para duas pessoas: R$ 731 de voos, R$ 3.290 de hospedagem, R$ 742 de experiências e R$ 477 de comida e transporte. Sobram R$ 760 do orçamento.',
  },
  {
    assunto: 'hospedagem',
    padrao: /hotel|hospedag|quarto|pousada/i,
    resposta:
      'Trocando Ipanema por Copacabana você economiza R$ 1.946 nas 7 noites e continua a 120 m da praia. Se quiser manter Ipanema, o Arpoador Suítes tem tarifa não reembolsável 12% menor — R$ 783 a noite.',
  },
  {
    assunto: 'gastronomia',
    padrao: /restaurante|comer|comida|jantar/i,
    resposta:
      'Três a menos de 10 min do seu hotel: peixe grelhado na Farme de Amoedo (R$ 135 pra dois), boteco clássico no Arpoador (R$ 78) e o mais bem avaliado da Dias Ferreira (R$ 210, reserve com 4 dias).',
  },
  {
    assunto: 'vida noturna',
    padrao: /noite|balada|samba|bar/i,
    resposta:
      'Sábado é o melhor dia: roda de samba na Lapa às 21h (R$ 145 com entrada em duas casas). Quarta tem jazz em Botafogo, e quinta a Pedra do Sal enche cedo — chegue às 19h.',
  },
  {
    assunto: 'fora do circuito',
    padrao: /escondid|secreto|fora do rot|local/i,
    resposta:
      'Fora do circuito: Praia da Joatinga na maré baixa, o mirante do Parque da Cidade em Niterói ao pôr do sol, e a feira de sábado do Jardim Botânico.',
  },
  {
    assunto: 'clima e época',
    padrao: /época|epoca|quando|clima|chuva/i,
    resposta:
      'Setembro é a melhor janela: 28–31°C, mar a 23°C, baixa temporada e passagens 34% abaixo do pico. Só o dia 4 tem chuva prevista — já mudei aquele dia para o Centro histórico.',
  },
  {
    assunto: 'roteiro',
    padrao: /rotei|dias|planej|monte/i,
    resposta:
      'Refiz o roteiro: praia e trilha nas manhãs de sol, museus na quinta chuvosa, jantares perto de onde você já está. Sete dias, 9 experiências, R$ 5.240 no total. Abra a aba Roteiro para ver dia por dia.',
  },
]

const PADRAO = 'Anotado. Ajustei sua busca no Rio com isso em mente — veja os resultados atualizados nas abas de voos, hotéis e passeios. Quer que eu já encaixe no roteiro de 7 dias?'

/** Resposta da Bia para uma pergunta livre. */
export function responder(pergunta: string): string {
  const regra = REGRAS.find((r) => r.padrao.test(pergunta))
  return regra ? regra.resposta : PADRAO
}

/** Quanto a Bia "pensa" antes de responder, em milissegundos. */
export const ATRASO_RESPOSTA = 620
