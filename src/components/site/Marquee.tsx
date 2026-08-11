import { FONTES_CONECTADAS } from '@/data/site'
import css from './Marquee.module.css'

/**
 * Faixa com as fontes conectadas.
 *
 * O conteúdo vive em dois grupos irmãos de largura idêntica. O trilho desliza
 * exatamente `-50%`, que é a largura de um grupo — então, no instante em que o
 * laço reinicia, o segundo grupo está no pixel onde o primeiro começou e não há
 * emenda visível. A versão anterior punha `gap` no trilho, e essa folga extra
 * entre os grupos fazia a repetição saltar a cada volta.
 *
 * A faixa anda sempre. Com `prefers-reduced-motion` ela apenas desacelera, de
 * 38s para 100s por volta — e apontar o mouse a congela.
 */
export function Marquee() {
  const grupo = (
    <div className={css['grupo']}>
      {FONTES_CONECTADAS.map((item) => (
        <span key={item} className={css['item']}>
          {item}
          <span className={css['separador']} aria-hidden="true">
            ◦
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={css['faixa']}>
      {/* A lista visual é decorativa: o mesmo conteúdo está aqui em texto
          corrente. Sem isto o leitor de tela leria tudo duas vezes. */}
      <p className="sr-only">
        Categorias no catálogo: {FONTES_CONECTADAS.slice(1).join(', ')}.
      </p>

      <div className={css['trilho']} aria-hidden="true">
        {/* Duas cópias de largura idêntica: o trilho desliza -50%, que é
            exatamente uma delas, e o laço reinicia sem emenda visível. */}
        {grupo}
        {grupo}
      </div>
    </div>
  )
}
