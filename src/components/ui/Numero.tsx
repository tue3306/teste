import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useMovimentoReduzido } from '@/hooks/useMovimento'

interface Props {
  valor: number
  /** Formata o número para exibição. Padrão: reais sem centavos. */
  formatar?: (n: number) => string
  className?: string
}

const REAIS = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/**
 * Número que percorre a distância até o valor novo em vez de saltar.
 *
 * É a microinteração que mais muda a percepção da plataforma: quando o total da
 * viagem sai de R$ 1.508 para R$ 2.640 porque uma criança entrou no grupo, ver
 * o número **subir** conecta a causa ao efeito. Trocar de um valor para o outro
 * num quadro só deixa a pessoa sem saber se algo mudou — e o total é
 * exatamente o número que ela está tentando controlar.
 *
 * O texto é escrito num `useState` a cada quadro da animação, e não direto no
 * DOM por ref: o valor precisa continuar no fluxo do React para o leitor de
 * tela e para o `aria-live` de quem o envolve.
 */
export function Numero({ valor, formatar = (n) => REAIS.format(n), className }: Props) {
  const motion = useMotionValue(valor)
  const [texto, setTexto] = useState(() => formatar(valor))
  const semMovimento = useMovimentoReduzido()

  useEffect(() => {
    // Contagem é deslocamento de dígito, não da tela — mas é rápida o bastante
    // para incomodar quem pediu menos movimento. Aqui a preferência encurta a
    // animação em vez de matá-la.
    const duracao = semMovimento ? 0.25 : 0.75

    const controles = animate(motion, valor, {
      duration: duracao,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setTexto(formatar(Math.round(v)))
      },
    })

    return () => {
      controles.stop()
    }
    // `formatar` costuma ser uma função nova a cada render; incluí-la aqui
    // reiniciaria a animação sem que o valor tenha mudado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor, semMovimento, motion])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {texto}
    </span>
  )
}
