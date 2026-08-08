import { useId, useState, type FormEvent } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Dialogo } from '@/components/ui/Dialogo'
import css from './DialogoEntrar.module.css'

interface Props {
  aberto: boolean
  aoFechar: () => void
}

/** Validação de e-mail deliberadamente permissiva: rejeita erro de digitação
 *  óbvio sem brigar com endereços válidos e incomuns. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Entrada por link mágico.
 *
 * Pede só o e-mail: sem senha não há o que vazar, e não há campo de credencial
 * a proteger num front-end estático. No protótipo o botão "Entrar" não tinha
 * ação nenhuma.
 *
 * O envio ainda não fala com um backend — o estado de sucesso diz isso com
 * todas as letras em vez de fingir que a conta foi criada.
 */
export function DialogoEntrar({ aberto, aoFechar }: Props) {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)
  const campoId = useId()
  const erroId = useId()

  // O cabeçalho só monta este componente quando a modal abre, então o estado
  // já nasce limpo a cada abertura — sem efeito de reset.

  function aoEnviar(e: FormEvent) {
    e.preventDefault()
    const valor = email.trim()

    if (!valor) {
      setErro('Escreva seu e-mail para continuar.')
      return
    }
    if (!EMAIL.test(valor)) {
      setErro('Esse e-mail não parece completo. Confira e tente de novo.')
      return
    }

    setErro(null)
    setEnviado(true)
  }

  return (
    <Dialogo
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Entrar na BI&B"
      descricao={
        enviado ? undefined : 'Mandamos um link de acesso por e-mail. Sem senha para lembrar.'
      }
    >
      {enviado ? (
        <div className={css['sucesso']} role="status">
          <span className={css['sucessoTitulo']}>Link a caminho de {email}</span>
          <p className={css['sucessoTexto']}>
            Assim que a autenticação entrar no ar, é por aqui que você vai acessar suas reservas
            salvas. Por enquanto, tudo que você salvar fica guardado neste navegador.
          </p>
          <Botao variante="secundario" onClick={aoFechar}>
            Fechar
          </Botao>
        </div>
      ) : (
        <form className={css['form']} onSubmit={aoEnviar} noValidate>
          <div className={css['campo']}>
            <label className={css['rotulo']} htmlFor={campoId}>
              Seu e-mail
            </label>
            <input
              id={campoId}
              className={css['entrada']}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (erro) setErro(null)
              }}
              aria-invalid={erro ? 'true' : 'false'}
              aria-describedby={erro ? erroId : undefined}
            />
            {erro ? (
              <span id={erroId} className={css['erro']} role="alert">
                {erro}
              </span>
            ) : null}
          </div>

          <Botao type="submit" bloco>
            Enviar link de acesso
          </Botao>

          <p className={css['aviso']}>
            Planejar é grátis e não exige conta. A entrada serve para levar seus favoritos e
            roteiros de um aparelho para outro.
          </p>
        </form>
      )}
    </Dialogo>
  )
}
