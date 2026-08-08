import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { ControleMovimento } from './ControleMovimento'
import css from './Rodape.module.css'

const PRODUTO = [
  { href: '#tudo', label: 'Busca' },
  { href: '#comparar', label: 'Comparador' },
  { href: '#roteiro', label: 'Roteiro IA' },
  { href: '#bia', label: 'Assistente' },
]

/**
 * Rodapé.
 *
 * As quatro entradas de "empresa" apontavam todas para `#topo` no protótipo:
 * clicar em "Termos" rolava a página de volta ao começo. Aqui o que existe é
 * link, o que ainda não existe usa o rótulo "em breve" — o mesmo tratamento que
 * a coluna de destinos já dava a São Paulo e Salvador — e o contato é um
 * `mailto:` que funciona.
 */
export function Rodape() {
  return (
    <footer className={`shell ${css['rodape']}`}>
      <div className={css['grade']}>
        <div>
          <Logo />
          <p className={css['sobre']}>
            Planejamento de viagem inteligente. Voo, hotel e roteiro em uma busca só. Feito no Rio de
            Janeiro.
          </p>
        </div>

        <nav className={css['coluna']} aria-label="Produto">
          <h2 className={css['tituloColuna']}>produto</h2>
          {PRODUTO.map((l) => (
            <a key={l.href} className={css['link']} href={`/${l.href}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <nav className={css['coluna']} aria-label="Destinos">
          <h2 className={css['tituloColuna']}>destinos</h2>
          <Link className={css['link']} to="/plataforma/hoteis">
            Rio de Janeiro
          </Link>
          <span className={css['emBreve']}>São Paulo · em breve</span>
          <span className={css['emBreve']}>Salvador · em breve</span>
          <span className={css['emBreve']}>Lisboa · em breve</span>
        </nav>

        <nav className={css['coluna']} aria-label="Empresa">
          <h2 className={css['tituloColuna']}>empresa</h2>
          <Link className={css['link']} to="/sobre">
            Sobre
          </Link>
          <Link className={css['link']} to="/privacidade">
            Privacidade
          </Link>
          <Link className={css['link']} to="/termos">
            Termos
          </Link>
          <Link className={css['link']} to="/contato">
            Contato
          </Link>
        </nav>
      </div>

      <div className={css['base']}>
        <span>© {new Date().getFullYear()} BI&amp;B tecnologia</span>
        <ControleMovimento />
        <span>melhor preço garantido</span>
      </div>
    </footer>
  )
}
