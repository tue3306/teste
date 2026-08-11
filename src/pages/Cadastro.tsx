import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Botao } from '@/components/ui/Botao'
import { Logo } from '@/components/ui/Logo'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import { ErroLogin, REGRAS, solicitarCadastro } from '@/services/autenticacao'
import css from './Auth.module.css'
import campo from '@/components/auth/FormularioLogin.module.css'

interface Campos {
  nome: string
  usuario: string
  email: string
  senha: string
  confirmar: string
  aceite: boolean
}

const VAZIO: Campos = { nome: '', usuario: '', email: '', senha: '', confirmar: '', aceite: false }

/**
 * Valida tudo de uma vez e devolve o erro de cada campo.
 *
 * Uma função pura, fora do componente: dá para ler a regra inteira num lugar só
 * e o formulário não precisa de um estado de erro por campo.
 */
function validar(c: Campos): Partial<Record<keyof Campos, string>> {
  const erros: Partial<Record<keyof Campos, string>> = {}
  if (!REGRAS.nome.valido(c.nome)) erros.nome = REGRAS.nome.erro
  if (!REGRAS.usuario.valido(c.usuario)) erros.usuario = REGRAS.usuario.erro
  if (!REGRAS.email.valido(c.email)) erros.email = REGRAS.email.erro
  if (!REGRAS.senha.valido(c.senha)) erros.senha = REGRAS.senha.erro
  if (c.confirmar !== c.senha) erros.confirmar = 'As senhas não coincidem.'
  if (!c.aceite) erros.aceite = 'É preciso aceitar os termos para continuar.'
  return erros
}

export function Cadastro() {
  useMetaDaPagina('Criar conta', 'Crie sua conta na BI&B e comece a montar sua viagem pelo Rio.')

  const [campos, setCampos] = useState<Campos>(VAZIO)
  const [tocado, setTocado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroServidor, setErroServidor] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const ids = {
    nome: useId(),
    usuario: useId(),
    email: useId(),
    senha: useId(),
    confirmar: useId(),
    aceite: useId(),
  }

  const erros = tocado ? validar(campos) : {}

  function trocar<C extends keyof Campos>(chave: C, valor: Campos[C]) {
    setCampos((atual) => ({ ...atual, [chave]: valor }))
    setErroServidor(null)
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setTocado(true)
    if (Object.keys(validar(campos)).length > 0) return

    setEnviando(true)
    setErroServidor(null)
    try {
      await solicitarCadastro({
        nome: campos.nome,
        usuario: campos.usuario,
        email: campos.email,
        senha: campos.senha,
      })
      setEnviado(true)
    } catch (erro) {
      setErroServidor(
        erro instanceof ErroLogin ? erro.message : 'Não foi possível registrar agora.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className={css['pagina']} id="conteudo">
      <motion.section
        className={css['painel']}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Link to="/login" className={css['voltar']}>
          ← Voltar para o login
        </Link>

        <div className={css['marca']}>
          <Logo />
        </div>

        <h1 className={css['titulo']}>Criar conta</h1>

        {enviado ? (
          <>
            <p className={css['sucesso']}>
              <strong>Pedido registrado, {campos.nome.split(' ')[0]}.</strong> Enquanto a BI&amp;B
              está em demonstração, o acesso é liberado manualmente — assim que a sua conta for
              habilitada, você recebe um aviso em {campos.email}.
            </p>
            <Botao para="/login" variante="primario" bloco>
              Voltar para o login
            </Botao>
          </>
        ) : (
          <>
            <p className={css['sub']}>
              Preencha os dados e a gente avisa quando a sua conta estiver liberada.
            </p>

            <form className={campo['form']} onSubmit={(e) => { void enviar(e) }} noValidate>
              <div className={campo['campo']}>
                <label htmlFor={ids.nome} className={campo['rotulo']}>
                  Nome completo
                </label>
                <input
                  id={ids.nome}
                  className={campo['entrada']}
                  type="text"
                  autoComplete="name"
                  value={campos.nome}
                  aria-invalid={erros.nome !== undefined}
                  onChange={(e) => {
                    trocar('nome', e.target.value)
                  }}
                />
                {erros.nome ? <p className={campo['ajuda']}>{erros.nome}</p> : null}
              </div>

              <div className={css['linha']}>
                <div className={campo['campo']}>
                  <label htmlFor={ids.usuario} className={campo['rotulo']}>
                    Usuário
                  </label>
                  <input
                    id={ids.usuario}
                    className={campo['entrada']}
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={campos.usuario}
                    aria-invalid={erros.usuario !== undefined}
                    onChange={(e) => {
                      trocar('usuario', e.target.value)
                    }}
                  />
                  {erros.usuario ? <p className={campo['ajuda']}>{erros.usuario}</p> : null}
                </div>

                <div className={campo['campo']}>
                  <label htmlFor={ids.email} className={campo['rotulo']}>
                    E-mail
                  </label>
                  <input
                    id={ids.email}
                    className={campo['entrada']}
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={campos.email}
                    aria-invalid={erros.email !== undefined}
                    onChange={(e) => {
                      trocar('email', e.target.value)
                    }}
                  />
                  {erros.email ? <p className={campo['ajuda']}>{erros.email}</p> : null}
                </div>
              </div>

              <div className={css['linha']}>
                <div className={campo['campo']}>
                  <label htmlFor={ids.senha} className={campo['rotulo']}>
                    Senha
                  </label>
                  <input
                    id={ids.senha}
                    className={campo['entrada']}
                    type="password"
                    autoComplete="new-password"
                    value={campos.senha}
                    aria-invalid={erros.senha !== undefined}
                    onChange={(e) => {
                      trocar('senha', e.target.value)
                    }}
                  />
                  {erros.senha ? <p className={campo['ajuda']}>{erros.senha}</p> : null}
                </div>

                <div className={campo['campo']}>
                  <label htmlFor={ids.confirmar} className={campo['rotulo']}>
                    Confirmar senha
                  </label>
                  <input
                    id={ids.confirmar}
                    className={campo['entrada']}
                    type="password"
                    autoComplete="new-password"
                    value={campos.confirmar}
                    aria-invalid={erros.confirmar !== undefined}
                    onChange={(e) => {
                      trocar('confirmar', e.target.value)
                    }}
                  />
                  {erros.confirmar ? <p className={campo['ajuda']}>{erros.confirmar}</p> : null}
                </div>
              </div>

              <label className={css['termos']} htmlFor={ids.aceite}>
                <input
                  id={ids.aceite}
                  type="checkbox"
                  checked={campos.aceite}
                  aria-invalid={erros.aceite !== undefined}
                  onChange={(e) => {
                    trocar('aceite', e.target.checked)
                  }}
                />
                <span>
                  Li e aceito os <Link to="/termos">termos de uso</Link> e a{' '}
                  <Link to="/privacidade">política de privacidade</Link>.
                </span>
              </label>
              {erros.aceite ? <p className={campo['ajuda']}>{erros.aceite}</p> : null}

              {erroServidor ? (
                <p className={campo['erro']} role="alert">
                  {erroServidor}
                </p>
              ) : null}

              <Botao type="submit" variante="primario" bloco disabled={enviando}>
                {enviando ? 'Registrando…' : 'Criar conta'}
              </Botao>
            </form>

            {/*
              Honestidade sobre o que o botão faz. Sem servidor não há onde criar
              conta, e uma conta "criada" que vivesse no armazenamento deste
              navegador sumiria na primeira limpeza de dados — pior do que não
              existir, porque a pessoa sairia achando que tem acesso.
            */}
            <p className={css['aviso']}>
              A BI&amp;B está em demonstração e ainda não tem servidor de contas. O formulário
              valida os dados e registra o pedido; o acesso é liberado manualmente. Para entrar
              agora, use a credencial de demonstração indicada na{' '}
              <Link to="/login">tela de login</Link>.
            </p>
          </>
        )}
      </motion.section>

      <aside className={css['lado']} aria-hidden="true">
        <div className={css['ladoConteudo']}>
          <p className={css['ladoNumero']}>RJ</p>
          <p className={css['ladoTexto']}>
            Uma conta para comparar voo, hospedagem, passeio, restaurante, evento e carro no mesmo
            orçamento
          </p>
        </div>
      </aside>
    </main>
  )
}
