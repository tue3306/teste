import { Link } from 'react-router-dom'
import { Icone } from '@/components/ui/Icone'
import { Reveal } from '@/components/ui/Reveal'
import { CATEGORIAS } from '@/data/site'
import css from './Categorias.module.css'

/**
 * Régua de categorias.
 *
 * Cada cartão é um link que abre a plataforma já filtrada. No protótipo eram
 * botões cujo `onClick` só trocava a própria cor de fundo: o estado `cat` era
 * escrito e nunca lido, então clicar em "Praia" não mudava um resultado sequer.
 *
 * Cada categoria ganhou ícone próprio — antes eram sete quadrados de gradiente
 * indistinguíveis entre si, o que obrigava a ler o rótulo para saber o que era
 * o quê.
 *
 * A entrada escalonada é CSS, não Motion. O motivo é robustez: o Motion escreve
 * `opacity` inline a cada quadro de `requestAnimationFrame`, e aba aberta em
 * segundo plano não recebe quadro nenhum — o cartão ficaria em `opacity: 0` até
 * o usuário focar a aba. O CSS declara o alvo e o navegador resolve sozinho,
 * visível ou não. Movimento fica onde só ele resolve: hover, layout e parallax.
 */
export function Categorias() {
  return (
    <section className="shell" style={{ paddingBlockStart: 26 }} aria-labelledby="categorias-titulo">
      <h2 id="categorias-titulo" className="sr-only">
        Buscar por categoria
      </h2>

      <ul className={css['grade']}>
        {CATEGORIAS.map((c, i) => (
          <Reveal key={c.id} como="li" atraso={i * 0.055}>
            <Link to={`/plataforma/hoteis?cat=${c.id}`} className={css['cartao']}>
              <span className={css['selo']} style={{ background: c.grad }}>
                <Icone nome={c.icone} tamanho={24} />
              </span>
              <span className={css['texto']}>
                <span className={css['nome']}>{c.label}</span>
                <span className={css['contagem']}>{c.contagem}</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
