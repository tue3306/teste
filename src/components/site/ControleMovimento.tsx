import { useId } from 'react'
import {
  definirPreferenciaMovimento,
  useMovimentoReduzido,
  usePreferenciaMovimento,
  type PreferenciaMovimento,
} from '@/hooks/useMovimento'
import css from './ControleMovimento.module.css'

const OPCOES: { valor: PreferenciaMovimento; rotulo: string }[] = [
  { valor: 'sistema', rotulo: 'Seguir o sistema' },
  { valor: 'ligado', rotulo: 'Sempre com animação' },
  { valor: 'reduzido', rotulo: 'Movimento reduzido' },
]

/**
 * Controle de animação do site.
 *
 * Existe por um motivo concreto: no Windows, desligar "efeitos de animação" faz
 * o navegador anunciar `prefers-reduced-motion` para todo site, e o site
 * obedece — corretamente. Só que quem mexeu naquele interruptor pensando no
 * desempenho da máquina não imagina que apagou a animação da web inteira, e a
 * página parece sem graça sem explicação.
 *
 * O padrão continua sendo obedecer ao sistema, que é o comportamento certo. O
 * que muda é ter como dizer o contrário, e a escolha fica guardada no aparelho.
 */
export function ControleMovimento() {
  const preferencia = usePreferenciaMovimento()
  const reduzido = useMovimentoReduzido()
  const id = useId()

  /** O sistema está barrando e o usuário ainda não opinou. */
  const barradoPeloSistema = preferencia === 'sistema' && reduzido

  return (
    <span className={css['controle']}>
      <label htmlFor={id}>Animações</label>
      <select
        id={id}
        className={css['select']}
        value={preferencia}
        onChange={(e) => {
          definirPreferenciaMovimento(e.target.value as PreferenciaMovimento)
        }}
      >
        {OPCOES.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>

      {barradoPeloSistema ? (
        <span className={css['dica']} role="status">
          Seu sistema pede menos animação, então desligamos. Escolha “sempre com animação” para ver
          o site em movimento.
        </span>
      ) : null}
    </span>
  )
}
