import { motion } from 'motion/react'
import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { useViagem } from '@/context/ViagemContext'
import { ABAS } from './abas'
import css from './CabecalhoApp.module.css'

/**
 * Cabeçalho da plataforma.
 *
 * As abas são links de navegação, não botões: cada seção tem URL própria, então
 * o botão voltar funciona, dá para abrir o roteiro em outra aba e mandar o
 * endereço para alguém. `aria-current="page"` marca a seção aberta para o
 * leitor de tela — no protótipo o estado ativo era só uma cor de fundo.
 */
export function CabecalhoApp() {
  const { busca, favoritos } = useViagem()

  return (
    <header className={css['cabecalho']}>
      <div className="shell-app">
        <div className={css['topo']}>
          <Logo compacto />

          <div className={css['resumo']}>
            <span className={css['destino']}>{busca.destino}</span>
            <span className={css['separador']} aria-hidden="true">
              |
            </span>
            <span className={css['detalhe']}>{busca.datas}</span>
            <span className={css['separador']} aria-hidden="true">
              |
            </span>
            <span className={css['detalhe']}>{busca.pessoas}</span>
            <span className={css['aoVivo']} aria-hidden="true" />
          </div>

          <div className={css['espaco']} />

          <div className={css['conta']}>
            <span className={css['salvos']}>
              {favoritos.length} {favoritos.length === 1 ? 'salvo' : 'salvos'}
            </span>
            <span className={css['avatar']} aria-hidden="true">
              L
            </span>
            <span className="sr-only">Conta de Lia</span>
          </div>
        </div>

        <nav aria-label="Seções da plataforma">
          <ul className={css['abas']}>
            {ABAS.map((a) => (
              <li key={a.id} className={css['abaItem']}>
                <NavLink
                  to={`/plataforma/${a.id}`}
                  className={({ isActive }) =>
                    [css['aba'], isActive ? css['abaAtiva'] : null].filter(Boolean).join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* `layoutId` compartilhado: o realce desliza da aba
                          anterior para a nova em vez de sumir e reaparecer. */}
                      {isActive ? (
                        <motion.span
                          layoutId="aba-ativa"
                          className={css['realce']}
                          transition={{ type: 'spring', stiffness: 480, damping: 40 }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className={css['abaTexto']}>{a.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
