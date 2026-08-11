/**
 * Configuração comercial do BI&B.
 *
 * Tudo o que um dia vira contrato, link de afiliado ou canal oficial mora aqui.
 * O motivo é prático: quando o primeiro parceiro fechar, a mudança é neste
 * arquivo e em nenhum componente. Espalhar `href` de afiliado pela interface é
 * como um produto acaba com três links diferentes para o mesmo parceiro, dois
 * deles sem o código de rastreio.
 */

/**
 * Link do grupo oficial no WhatsApp.
 *
 * **Vazio de propósito.** Não invento um convite — um link de WhatsApp errado
 * leva pessoas para um grupo de estranhos, e um `chat.whatsapp.com/XXXX`
 * inventado é pior que botão nenhum. Enquanto estiver vazio, a seção de
 * comunidade mostra o estado "em breve" em vez de um link quebrado.
 *
 * Para ativar: cole aqui o convite real do grupo.
 */
export const WHATSAPP_COMUNIDADE = ''

/** A comunidade já tem canal? Decide entre o convite e o "em breve". */
export function comunidadeAtiva(): boolean {
  return WHATSAPP_COMUNIDADE.trim().length > 0
}

/**
 * Como o BI&B pretende se sustentar.
 *
 * Nenhum destes canais está ativo. Estão declarados para que a arquitetura os
 * comporte sem reescrita — e para que a interface possa marcar, desde já, o que
 * é conteúdo e o que é comercial.
 */
export type CanalReceita = 'afiliado' | 'parceiro' | 'destaque' | 'lead'

export interface Canal {
  id: CanalReceita
  titulo: string
  descricao: string
  /** O que falta para o canal existir de verdade. */
  pendencia: string
}

export const CANAIS: Canal[] = [
  {
    id: 'afiliado',
    titulo: 'Comissão de afiliado',
    descricao:
      'Hospedagem, passagem, passeio e locação levam a um parceiro que paga comissão por reserva concluída. O usuário não paga nada a mais: a comissão sai da margem do fornecedor.',
    pendencia: 'Contrato de afiliação com pelo menos um consolidador e o código de rastreio.',
  },
  {
    id: 'parceiro',
    titulo: 'Parceiro local',
    descricao:
      'Pousadas, restaurantes, guias e agências do estado entram no catálogo com dados próprios e mensalidade. É o canal mais alinhado ao produto: o BI&B é fluminense e os parceiros também.',
    pendencia: 'Painel de cadastro do parceiro e um contrato-padrão.',
  },
  {
    id: 'destaque',
    titulo: 'Destaque patrocinado',
    descricao:
      'Um parceiro pode aparecer no topo de uma lista — sempre com o selo "patrocinado" visível e nunca alterando preço, nota ou ordem dos demais. Publicidade que se disfarça de recomendação destrói a confiança que o comparador depende.',
    pendencia: 'Regras de leilão ou tabela de preço, e o selo no cartão.',
  },
  {
    id: 'lead',
    titulo: 'Encaminhamento qualificado',
    descricao:
      'A viagem montada — destino, datas, grupo e orçamento — vale para um parceiro que queira fechar o pacote. O encaminhamento só acontece quando o usuário pede, e ele vê exatamente o que é enviado.',
    pendencia: 'Consentimento explícito por encaminhamento e um destinatário real.',
  },
]

/**
 * Origem de um item do catálogo.
 *
 * Hoje tudo é `'catalogo'`. O campo existe para que, quando entrar inventário
 * de parceiro ou patrocinado, a interface consiga marcar a diferença — e para
 * que ninguém precise adivinhar de onde veio um resultado.
 */
export type OrigemItem = 'catalogo' | 'parceiro' | 'patrocinado'

/** Rótulo exibido quando a origem não é o catálogo próprio. */
export const ROTULO_ORIGEM: Record<OrigemItem, string | null> = {
  catalogo: null,
  parceiro: 'Parceiro local',
  patrocinado: 'Patrocinado',
}
