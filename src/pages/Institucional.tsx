import { Navigate, useLocation } from 'react-router-dom'
import { LayoutSite } from '@/components/site/LayoutSite'
import { Botao } from '@/components/ui/Botao'
import { Reveal } from '@/components/ui/Reveal'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import { PAGINAS } from '@/data/institucional'
import css from './Institucional.module.css'

/**
 * Páginas institucionais: Sobre, Privacidade e Termos.
 *
 * Uma rota só, com o conteúdo vindo de `data/institucional.ts`. Três
 * componentes quase idênticos seria a forma de os três divergirem no primeiro
 * ajuste de espaçamento.
 */
export function Institucional() {
  // O slug vem do caminho, e não de um parâmetro: as rotas são declaradas uma a
  // uma em App.tsx, então aqui basta ler qual delas está ativa.
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  const pagina = PAGINAS[slug]

  useMetaDaPagina(
    pagina ? `${pagina.titulo} ${pagina.subtitulo}` : 'Institucional',
    pagina?.chamada ?? 'Informações institucionais da BI&B.',
  )

  // Só acontece se uma rota for declarada sem conteúdo correspondente. Volta
  // para a home, que existe sempre — nunca para um caminho que possa recair aqui.
  if (!pagina) return <Navigate to="/" replace />

  return (
    <LayoutSite>
      <article className={`shell ${css['pagina']}`}>
        <Reveal>
          <p className="eyebrow">BI&amp;B</p>
          <h1 className={css['titulo']}>
            {pagina.titulo} <span className="serif">{pagina.subtitulo}</span>
          </h1>
          <p className={css['chamada']}>{pagina.chamada}</p>

          {pagina.aviso ? (
            <div className={css['aviso']} role="note">
              <span className={css['avisoIcone']} aria-hidden="true">
                ⚠️
              </span>
              <p className={css['avisoTexto']}>{pagina.aviso}</p>
            </div>
          ) : null}
        </Reveal>

        {pagina.blocos.map((bloco, i) => (
          <Reveal
            key={bloco.titulo}
            como="section"
            atraso={Math.min(i, 4) * 0.04}
            className={css['bloco']}
          >
            <h2 className={css['blocoTitulo']}>{bloco.titulo}</h2>
            {bloco.paragrafos.map((p) => (
              <p key={p.slice(0, 24)} className={css['paragrafo']}>
                {p}
              </p>
            ))}
            {bloco.itens ? (
              <ul className={css['lista']}>
                {bloco.itens.map((item) => (
                  <li key={item} className={css['item']}>
                    <span className={css['marcador']} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        ))}

        <footer className={css['rodapeNota']}>
          <p>Última atualização: {pagina.atualizadoEm}.</p>
          <div className={css['navegacao']}>
            <Botao para="/contato" variante="secundario" tamanho="sm">
              Falar com a gente
            </Botao>
            <Botao para="/" variante="secundario" tamanho="sm">
              Voltar ao início
            </Botao>
          </div>
        </footer>
      </article>
    </LayoutSite>
  )
}
