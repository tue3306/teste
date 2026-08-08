import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Icone } from '@/components/ui/Icone'
import { Reveal } from '@/components/ui/Reveal'
import { useNaTela } from '@/hooks/useNaTela'
import { CATEGORIAS } from '@/data/site'
import { ASSENTA, CONTAINER, HOVER_CARTAO, TAP_CARTAO } from '@/lib/motion'
import css from './Categorias.module.css'

const CartaoMovel = motion.create(Link)

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
  const [gradeRef, visivel] = useNaTela<HTMLUListElement>()

  return (
    <section className="shell" style={{ paddingBlockStart: 26 }} aria-labelledby="categorias-titulo">
      <h2 id="categorias-titulo" className="sr-only">
        Buscar por categoria
      </h2>

      {/* Dois sistemas em camadas: o `Reveal` externo desvanece em CSS (que
          nunca deixa conteúdo preso) e o Motion interno assenta os cartões um a
          um, com mola. */}
      <motion.ul
        ref={gradeRef}
        className={css['grade']}
        variants={CONTAINER}
        initial="oculto"
        animate={visivel ? 'visivel' : 'oculto'}
      >
        {CATEGORIAS.map((c, i) => (
          <Reveal key={c.id} como="li" atraso={i * 0.05}>
            <motion.span variants={ASSENTA} style={{ display: 'block', height: '100%' }}>
              <CartaoMovel
                to={`/plataforma/hoteis?cat=${c.id}`}
                className={css['cartao']}
                whileHover={HOVER_CARTAO}
                whileTap={TAP_CARTAO}
              >
                <span className={css['selo']} style={{ background: c.grad }}>
                  <Icone nome={c.icone} tamanho={24} />
                </span>
                <span className={css['texto']}>
                  <span className={css['nome']}>{c.label}</span>
                  <span className={css['contagem']}>{c.contagem}</span>
                </span>
              </CartaoMovel>
            </motion.span>
          </Reveal>
        ))}
      </motion.ul>
    </section>
  )
}
