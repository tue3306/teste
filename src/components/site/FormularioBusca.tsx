import { useId, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Botao } from '@/components/ui/Botao'
import { useViagem } from '@/context/ViagemContext'
import { TIPOS_DE_VIAGEM } from '@/data/site'
import { CampoDestino } from './CampoDestino'
import css from './FormularioBusca.module.css'

/**
 * Busca do hero.
 *
 * É um `<form>` de verdade: no protótipo os quatro campos eram inputs soltos e
 * o botão um `onClick`, então Enter dentro de um campo não fazia nada. Agora
 * submeter — por Enter ou pelo botão — leva para a plataforma.
 */
export function FormularioBusca() {
  const { busca, atualizarBusca } = useViagem()
  const navigate = useNavigate()
  const id = useId()

  function aoEnviar(e: FormEvent) {
    e.preventDefault()
    void navigate('/plataforma/voos')
  }

  return (
    <form className={css['caixa']} onSubmit={aoEnviar}>
      <div className={css['linha']}>
        <CampoDestino
          valor={busca.destino}
          aoMudar={(v) => {
            atualizarBusca('destino', v)
          }}
        />
        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-datas`}>
            Datas
          </label>
          <input
            id={`${id}-datas`}
            className={css['entrada']}
            value={busca.datas}
            onChange={(e) => {
              atualizarBusca('datas', e.target.value)
            }}
            autoComplete="off"
          />
        </div>
        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-pessoas`}>
            Pessoas
          </label>
          <input
            id={`${id}-pessoas`}
            className={css['entrada']}
            value={busca.pessoas}
            onChange={(e) => {
              atualizarBusca('pessoas', e.target.value)
            }}
            autoComplete="off"
          />
        </div>
      </div>

      <div className={css['linha']}>
        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-orcamento`}>
            Orçamento total
          </label>
          <input
            id={`${id}-orcamento`}
            className={css['entrada']}
            value={busca.orcamento}
            onChange={(e) => {
              atualizarBusca('orcamento', e.target.value)
            }}
            inputMode="numeric"
            autoComplete="off"
          />
        </div>
        <div className={css['campo']}>
          <label className={css['rotulo']} htmlFor={`${id}-tipo`}>
            Tipo de viagem
          </label>
          <select
            id={`${id}-tipo`}
            className={`${css['entrada']} ${css['select']}`}
            value={busca.tipo}
            onChange={(e) => {
              atualizarBusca('tipo', e.target.value)
            }}
          >
            {TIPOS_DE_VIAGEM.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <Botao type="submit" tamanho="lg" className={css['enviar']}>
          Planejar viagem
        </Botao>
      </div>
    </form>
  )
}
