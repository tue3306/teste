import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '@/components/ui/Botao'
import { Icone } from '@/components/ui/Icone'
import { useAuth } from '@/context/AuthContext'
import { REGRAS } from '@/services/autenticacao'
import css from './FormularioLogin.module.css'

interface Props {
  /** Chamado depois de um login bem-sucedido. */
  aoEntrar: () => void
  /** Rótulo do link para cadastro; o modal e a página levam a lugares distintos. */
  aoCadastrar?: () => void
  /** Compacta o espaçamento, para caber no modal. */
  compacto?: boolean
}

/**
 * O formulário de login, compartilhado pela página `/login` e pelo modal.
 *
 * Existe um só porque as regras de validação, as mensagens de erro e o estado
 * de carregamento precisam ser idênticos nos dois lugares. Quando eram dois
 * componentes, a página validava o tamanho do usuário e o modal não — e a
 * mesma credencial errada produzia mensagens diferentes conforme por onde a
 * pessoa entrasse.
 */
export function FormularioLogin({ aoEntrar, aoCadastrar, compacto = false }: Props) {
  const { entrar, entrando, erro, limparErro } = useAuth()

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  /** Erros de formato, só exibidos depois da primeira tentativa. */
  const [tocado, setTocado] = useState(false)

  const idUsuario = useId()
  const idSenha = useId()
  const idErro = useId()

  const erroUsuario = tocado && !REGRAS.usuario.valido(usuario) ? REGRAS.usuario.erro : null
  const erroSenha = tocado && !REGRAS.senha.valido(senha) ? REGRAS.senha.erro : null

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setTocado(true)

    // Validação de formato antes de chamar o serviço: não faz sentido gastar
    // uma requisição — nem a espera dela — para saber que o campo está vazio.
    if (!REGRAS.usuario.valido(usuario) || !REGRAS.senha.valido(senha)) return

    const ok = await entrar(usuario, senha)
    if (ok) aoEntrar()
  }

  return (
    <form className={`${css['form']} ${compacto ? css['compacto'] : ''}`} onSubmit={(e) => { void enviar(e) }} noValidate>
      <div className={css['campo']}>
        <label htmlFor={idUsuario} className={css['rotulo']}>
          Usuário
        </label>
        <input
          id={idUsuario}
          className={css['entrada']}
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={usuario}
          aria-invalid={erroUsuario !== null}
          aria-describedby={erroUsuario ? `${idUsuario}-erro` : undefined}
          onChange={(e) => {
            setUsuario(e.target.value)
            limparErro()
          }}
        />
        {erroUsuario ? (
          <p id={`${idUsuario}-erro`} className={css['ajuda']}>
            {erroUsuario}
          </p>
        ) : null}
      </div>

      <div className={css['campo']}>
        <label htmlFor={idSenha} className={css['rotulo']}>
          Senha
        </label>
        <div className={css['comBotao']}>
          <input
            id={idSenha}
            className={css['entrada']}
            type={verSenha ? 'text' : 'password'}
            autoComplete="current-password"
            value={senha}
            aria-invalid={erroSenha !== null}
            aria-describedby={erroSenha ? `${idSenha}-erro` : undefined}
            onChange={(e) => {
              setSenha(e.target.value)
              limparErro()
            }}
          />
          {/* `aria-pressed` em vez de trocar o rótulo: o leitor de tela anuncia
              o estado sem que o nome do botão mude debaixo do foco. */}
          <button
            type="button"
            className={css['olho']}
            aria-pressed={verSenha}
            aria-label="Mostrar a senha"
            onClick={() => {
              setVerSenha((v) => !v)
            }}
          >
            <Icone nome={verSenha ? 'noite' : 'estrela'} tamanho={17} />
          </button>
        </div>
        {erroSenha ? (
          <p id={`${idSenha}-erro`} className={css['ajuda']}>
            {erroSenha}
          </p>
        ) : null}
      </div>

      {/* `role="alert"` para o erro do servidor chegar ao leitor de tela sem
          que o foco precise se mover até ele. */}
      {erro ? (
        <p id={idErro} className={css['erro']} role="alert">
          {erro}
        </p>
      ) : null}

      <Botao type="submit" variante="primario" bloco disabled={entrando}>
        {entrando ? 'Entrando…' : 'Entrar'}
      </Botao>

      <p className={css['rodape']}>
        Ainda não tem conta?{' '}
        {aoCadastrar ? (
          <button type="button" className={css['link']} onClick={aoCadastrar}>
            Criar conta
          </button>
        ) : (
          <Link to="/cadastro" className={css['link']}>
            Criar conta
          </Link>
        )}
      </p>
    </form>
  )
}
