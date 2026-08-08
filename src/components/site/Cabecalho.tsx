import { useEffect, useId, useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Logo } from '@/components/ui/Logo'
import { DialogoEntrar } from './DialogoEntrar'
import css from './Cabecalho.module.css'

const SECOES = [
  { href: '#tudo', label: 'Como funciona' },
  { href: '#destinos', label: 'Destinos' },
  { href: '#comparar', label: 'Comparador' },
  { href: '#roteiro', label: 'Roteiro IA' },
  { href: '#bia', label: 'Assistente' },
]

/**
 * Cabeçalho do site.
 *
 * Abaixo de 900px a navegação vira um painel recolhível. O protótipo mantinha
 * os quatro links, os dois botões e o logotipo na mesma linha em qualquer
 * largura, o que estourava a tela no celular — e `overflow-x: hidden` no body
 * só escondia o sintoma.
 */
export function Cabecalho({ ancorasInternas = false }: { ancorasInternas?: boolean }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [entrarAberto, setEntrarAberto] = useState(false)
  const painelId = useId()

  // Esc fecha o painel; sem isso o teclado fica preso num menu aberto.
  useEffect(() => {
    if (!menuAberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => {
      window.removeEventListener('keydown', aoTeclar)
    }
  }, [menuAberto])

  return (
    <header className={css['cabecalho']}>
      <div className="shell">
        <nav className={css['nav']} aria-label="Principal">
          <Logo />

          <ul className={css['links']}>
            {SECOES.map((s) => (
              <li key={s.href}>
                {/* Fora da home a âncora precisa do caminho na frente, senão
                    "#comparar" resolve contra a rota atual e não vai a lugar
                    nenhum. */}
                <a className={css['link']} href={ancorasInternas ? s.href : `/${s.href}`}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={css['espaco']} />

          <div className={css['acoes']}>
            <span className={css['entrarDesktop']}>
              <Botao
                variante="secundario"
                onClick={() => {
                  setEntrarAberto(true)
                }}
              >
                Entrar
              </Botao>
            </span>
            <Botao para="/plataforma/voos">Abrir plataforma</Botao>

            <button
              type="button"
              className={css['gatilhoMenu']}
              aria-expanded={menuAberto}
              aria-controls={painelId}
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => {
                setMenuAberto((v) => !v)
              }}
            >
              <span className={css['barra']} aria-hidden="true" />
              <span className={css['barra']} aria-hidden="true" />
              <span className={css['barra']} aria-hidden="true" />
            </button>
          </div>
        </nav>

        {menuAberto ? (
          <div className={css['painel']} id={painelId}>
            <ul className={css['painelLinks']}>
              {SECOES.map((s) => (
                <li key={s.href}>
                  <a
                    className={css['painelLink']}
                    href={ancorasInternas ? s.href : `/${s.href}`}
                    onClick={() => {
                      setMenuAberto(false)
                    }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className={css['painelAcoes']}>
              <Botao
                variante="secundario"
                bloco
                onClick={() => {
                  setMenuAberto(false)
                  setEntrarAberto(true)
                }}
              >
                Entrar
              </Botao>
            </div>
          </div>
        ) : null}
      </div>

      {/* Montagem condicional: o estado do formulário nasce limpo a cada
          abertura, sem um efeito de reset dentro do diálogo. */}
      {entrarAberto ? (
        <DialogoEntrar
          aberto
          aoFechar={() => {
            setEntrarAberto(false)
          }}
        />
      ) : null}
    </header>
  )
}
