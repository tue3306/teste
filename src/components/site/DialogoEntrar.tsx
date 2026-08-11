import { useNavigate } from 'react-router-dom'
import { Dialogo } from '@/components/ui/Dialogo'
import { FormularioLogin } from '@/components/auth/FormularioLogin'
import css from './DialogoEntrar.module.css'

interface Props {
  aberto: boolean
  aoFechar: () => void
  /** Para onde ir depois de entrar. Sem isto, fica onde está. */
  destinoAposEntrar?: string
}

/**
 * Modal de entrada, aberto pelo botão "Entrar" do cabeçalho.
 *
 * O formulário é o mesmo da página `/login` — mesma validação, mesmas
 * mensagens, mesmo estado de carregamento. Ter dois formulários seria ter duas
 * versões da verdade sobre o que é uma senha válida.
 *
 * As duas portas existem de propósito: "Entrar" abre o modal, porque quem está
 * lendo a home não quer perder o lugar; "Abrir plataforma" leva a `/login`,
 * porque ali a pessoa já decidiu ir para outro lugar.
 */
export function DialogoEntrar({ aberto, aoFechar, destinoAposEntrar }: Props) {
  const navegar = useNavigate()

  return (
    <Dialogo
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Entrar na BI&B"
      descricao="Acesse sua conta para montar a viagem e salvar as escolhas."
    >
      <div className={css['corpo']}>
        <FormularioLogin
          compacto
          aoEntrar={() => {
            aoFechar()
            if (destinoAposEntrar) void navegar(destinoAposEntrar)
          }}
          aoCadastrar={() => {
            aoFechar()
            void navegar('/cadastro')
          }}
        />

        {/* A credencial fica à vista: esta é uma demonstração sem servidor, e a
            senha está no pacote que o navegador já baixou. */}
        <p className={css['demo']}>
          <strong>Demonstração:</strong> usuário <code>tuerezende</code> · senha{' '}
          <code>rezendetue</code>
        </p>
      </div>
    </Dialogo>
  )
}
