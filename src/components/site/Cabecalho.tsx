import { useEffect, useId, useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Logo } from '@/components/ui/Logo'
import css from './Cabecalho.module.css'

const SECOES = [
  { href: '#tudo', label: 'Como funciona' },
  { href: '#destinos', label: 'Destinos' },
  { href: '#comparar', label: 'Economia' },
  { href: '#grupos', label: 'Grupos' },
]

/** Primeira tela da plataforma para quem já entrou. */
const PLATAFORMA = '/plataforma/destinos'

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
            <Botao para={PLATAFORMA}>Abrir plataforma</Botao>

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
          </div>
        ) : null}
      </div>

    </header>
  )
}
