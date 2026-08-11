/**
 * Fronteira de autenticação.
 *
 * Esta é a única camada do projeto que sabe **como** uma credencial é
 * verificada. Componentes, páginas e o contexto conhecem apenas as funções
 * exportadas aqui — nenhum deles vê usuário ou senha.
 *
 * ## O que isto é, e o que não é
 *
 * Isto é uma demonstração **sem servidor**. A credencial abaixo está no pacote
 * que o navegador baixa, e portanto é pública: qualquer pessoa que abra as
 * ferramentas de desenvolvedor a encontra. Não é uma falha de implementação, é
 * uma consequência inevitável de validar login no cliente. Nada aqui protege
 * dado nenhum — o que existe é o *fluxo* (sessão, rota protegida, erro,
 * carregamento) montado para funcionar de verdade e para ser trocado inteiro
 * por uma API sem que nenhuma tela mude.
 *
 * ## Como trocar por um backend real
 *
 * Substitua o corpo de `autenticar` por uma chamada `fetch` ao endpoint de
 * login e devolva o usuário retornado. A assinatura já é assíncrona e já pode
 * falhar exatamente por isso. `CREDENCIAL_DEMO` some junto.
 */

/** Um usuário autenticado. É o que a sessão guarda. */
export interface Usuario {
  usuario: string
  nome: string
  email: string
  /** Iniciais para o avatar. */
  iniciais: string
}

/** Motivos pelos quais uma tentativa de login pode falhar. */
export type FalhaLogin = 'credenciais' | 'campos' | 'rede'

/**
 * Erro de autenticação com motivo legível pela interface.
 *
 * O campo é declarado e atribuído em separado, e não como propriedade de
 * parâmetro, porque o projeto compila com `erasableSyntaxOnly`: só passa
 * sintaxe que o TypeScript consegue apagar sem gerar código.
 */
export class ErroLogin extends Error {
  readonly motivo: FalhaLogin

  constructor(motivo: FalhaLogin, mensagem: string) {
    super(mensagem)
    this.name = 'ErroLogin'
    this.motivo = motivo
  }
}

/**
 * A única credencial aceita nesta demonstração.
 *
 * Um usuário só, declarado num lugar só. Espalhar isto por componentes — que é
 * o que costuma acontecer com login de demonstração — significa que trocar a
 * senha vira uma caçada, e que a próxima tela nova esquece de validar.
 */
const CREDENCIAL_DEMO = {
  usuario: 'tuerezende',
  senha: 'rezendetue',
  nome: 'Tuê Rezende',
  email: 'tue@bib.com.br',
  iniciais: 'TR',
} as const

/**
 * Latência simulada, em milissegundos.
 *
 * Uma resposta instantânea esconde o estado de carregamento, e um estado de
 * carregamento que nunca aparece é um estado que nunca foi testado. Quando o
 * backend real entrar, a latência passa a ser a da rede e esta constante sai.
 */
const LATENCIA_MS = 620

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Verifica as credenciais e devolve o usuário.
 *
 * Lança `ErroLogin` quando falha — nunca devolve `null`. Um retorno nulo
 * obrigaria cada chamador a inventar a própria mensagem de erro, e foi assim
 * que a mensagem "usuário ou senha inválidos" apareceu escrita de três formas
 * diferentes em telas diferentes.
 */
export async function autenticar(usuario: string, senha: string): Promise<Usuario> {
  const limpo = usuario.trim().toLowerCase()

  if (!limpo || !senha) {
    throw new ErroLogin('campos', 'Preencha o usuário e a senha.')
  }

  await esperar(LATENCIA_MS)

  if (limpo !== CREDENCIAL_DEMO.usuario || senha !== CREDENCIAL_DEMO.senha) {
    throw new ErroLogin('credenciais', 'Usuário ou senha inválidos.')
  }

  return {
    usuario: CREDENCIAL_DEMO.usuario,
    nome: CREDENCIAL_DEMO.nome,
    email: CREDENCIAL_DEMO.email,
    iniciais: CREDENCIAL_DEMO.iniciais,
  }
}

/** Resultado de um pedido de cadastro. */
export interface PedidoCadastro {
  nome: string
  usuario: string
  email: string
  senha: string
}

/**
 * Registra a intenção de cadastro.
 *
 * **Não cria conta**, porque não há onde criar: sem servidor, uma conta
 * "criada" viveria no `localStorage` de um navegador só e sumiria na primeira
 * limpeza de dados. Fingir o contrário seria pior do que não ter a tela — a
 * pessoa sairia achando que tem login.
 *
 * O que a função faz é validar os campos com o mesmo rigor que o backend usará
 * e devolver o pedido normalizado. A tela deixa claro que o acesso é liberado
 * manualmente enquanto a plataforma está em demonstração.
 */
export async function solicitarCadastro(pedido: PedidoCadastro): Promise<PedidoCadastro> {
  await esperar(LATENCIA_MS)

  if (pedido.usuario.trim().toLowerCase() === CREDENCIAL_DEMO.usuario) {
    throw new ErroLogin('credenciais', 'Este nome de usuário já está em uso.')
  }

  return {
    nome: pedido.nome.trim(),
    usuario: pedido.usuario.trim().toLowerCase(),
    email: pedido.email.trim().toLowerCase(),
    senha: pedido.senha,
  }
}

/** Regras de validação compartilhadas entre o login, o modal e o cadastro. */
export const REGRAS = {
  usuario: {
    min: 3,
    valido: (v: string) => /^[a-z0-9._-]{3,}$/i.test(v.trim()),
    erro: 'Use ao menos 3 caracteres, sem espaços ou acentos.',
  },
  senha: {
    min: 6,
    valido: (v: string) => v.length >= 6,
    erro: 'A senha precisa de ao menos 6 caracteres.',
  },
  email: {
    // Validação deliberadamente frouxa: e-mail válido de verdade só se prova
    // enviando uma mensagem, e regex ambiciosa rejeita endereço legítimo.
    valido: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    erro: 'Informe um e-mail válido.',
  },
  nome: {
    valido: (v: string) => v.trim().length >= 2,
    erro: 'Informe seu nome.',
  },
} as const
