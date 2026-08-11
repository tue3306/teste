import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { FormularioLogin } from '@/components/auth/FormularioLogin'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import { DESTINOS } from '@/data/rj'
import css from './Auth.module.css'

/** Para onde mandar quem já está autenticado e caiu no /login. */
const PADRAO = '/plataforma/destinos'

export function Login() {
  useMetaDaPagina('Entrar', 'Acesse sua conta BI&B e retome o planejamento da sua viagem.')

  const { autenticado, estado } = useAuth()
  const navegar = useNavigate()
  const local = useLocation()

  /**
   * De onde a pessoa veio, guardado pela `RotaProtegida`.
   *
   * Só aceita caminho interno começando por "/": um `state` vem do histórico do
   * navegador e pode ser forjado, e redirecionar para um endereço arbitrário
   * depois do login é exatamente o buraco que um open redirect abre.
   */
  const bruto = (local.state as { de?: unknown } | null)?.de
  const de = typeof bruto === 'string' && bruto.startsWith('/') && !bruto.startsWith('//') ? bruto : PADRAO

  // Quem já entrou não vê a tela de login: vai direto para onde queria ir.
  if (estado === 'autenticado' || autenticado) return <Navigate to={de} replace />

  return (
    <main className={css['pagina']} id="conteudo">
      <motion.section
        className={css['painel']}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Link to="/" className={css['voltar']}>
          ← Voltar ao site
        </Link>

        <div className={css['marca']}>
          <Logo />
        </div>

        <h1 className={css['titulo']}>Entrar na plataforma</h1>
        <p className={css['sub']}>
          Compare voos, hospedagem, passeios e carros nos {DESTINOS.length} destinos do Rio de
          Janeiro — e veja o total da viagem se atualizar a cada escolha.
        </p>

        <FormularioLogin
          aoEntrar={() => {
            void navegar(de, { replace: true })
          }}
        />

        {/*
          A credencial aparece na tela de propósito. Esta é uma demonstração sem
          servidor: a senha está no pacote que o navegador baixa e é pública de
          qualquer jeito. Escondê-la não protegeria nada e só faria quem for ver
          o projeto ficar travado na porta.
        */}
        <p className={css['demo']}>
          <strong>Demonstração:</strong> usuário <code>tuerezende</code> · senha{' '}
          <code>rezendetue</code>
        </p>
      </motion.section>

      <aside className={css['lado']} aria-hidden="true">
        <div className={css['ladoConteudo']}>
          <p className={css['ladoNumero']}>{DESTINOS.length}</p>
          <p className={css['ladoTexto']}>
            destinos do estado do Rio de Janeiro, da Costa Verde ao Norte Fluminense
          </p>
        </div>
      </aside>
    </main>
  )
}
