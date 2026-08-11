import { motion } from 'motion/react'
import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { Icone } from '@/components/ui/Icone'
import { Numero } from '@/components/ui/Numero'
import { useAuth } from '@/context/AuthContext'
import { useViagem } from '@/context/ViagemContext'

import { ABAS } from './abas'
import css from './CabecalhoApp.module.css'

/** Data ISO em "12 set". */
function curta(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

/**
 * Cabeçalho da plataforma.
 *
 * As abas são links de navegação, não botões: cada seção tem URL própria, então
 * o botão voltar funciona, dá para abrir uma aba em outra janela e mandar o
 * endereço para alguém. `aria-current="page"` marca a seção aberta para o
 * leitor de tela — no protótipo o estado ativo era só uma cor de fundo.
 */
export function CabecalhoApp() {
  const { busca, destino, contexto, orcamento, itensEscolhidos } = useViagem()
  const { usuario, sair } = useAuth()

  const pessoas = contexto.pessoas.adultos + contexto.pessoas.criancas + contexto.pessoas.bebes

  return (
    <header className={css['cabecalho']}>
      <div className="shell-app">
        <div className={css['topo']}>
          <Logo compacto />

          {/* Resumo da viagem em curso. Antes era texto livre — "2 adultos" —
              que não entrava em conta nenhuma; agora cada campo vem do estado
              que realmente multiplica os preços. */}
          <div className={css['resumo']}>
            <span className={css['destino']}>{destino.nome}</span>
            <span className={css['separador']} aria-hidden="true">
              |
            </span>
            <span className={css['detalhe']}>
              {curta(busca.ida)}–{curta(busca.volta)}
            </span>
            <span className={css['separador']} aria-hidden="true">
              |
            </span>
            <span className={css['detalhe']}>
              {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
            </span>
            <span className={css['aoVivo']} aria-hidden="true" />
          </div>

          <div className={css['espaco']} />

          <div className={css['conta']}>
            {/* O total acompanha a pessoa por todas as abas: é o número que ela
                está tentando controlar, e escondê-lo dentro de uma aba só
                obrigava a ir e voltar a cada escolha. */}
            <NavLink to="/plataforma/viagem" className={css['totalAtalho']}>
              <span className={css['totalRotulo']}>
                {itensEscolhidos.length} {itensEscolhidos.length === 1 ? 'item' : 'itens'}
              </span>
              {/* Percorre a distância até o valor novo em vez de saltar: é o
                  que conecta "somei uma criança" a "o total subiu". */}
              <Numero valor={orcamento.total} className={css['totalValor']} />
            </NavLink>

            <span className={css['avatar']} aria-hidden="true">
              {usuario?.iniciais ?? '—'}
            </span>
            <span className="sr-only">Conta de {usuario?.nome ?? 'visitante'}</span>

            <button type="button" className={css['sair']} onClick={sair} aria-label="Sair da conta">
              <Icone nome="fechar" tamanho={14} />
            </button>
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
                      <span className={css['abaTexto']}>
                        <Icone nome={a.icone} tamanho={14} />
                        {a.label}
                      </span>
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
