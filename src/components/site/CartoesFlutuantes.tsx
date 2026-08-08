import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Imagem } from '@/components/ui/Imagem'
import { useMovimentoReduzido } from '@/hooks/useMovimento'
import { useTilt } from '@/hooks/useTilt'
import { DIA_DESTAQUE } from '@/data/roteiro'
import { HOTEIS, VOOS } from '@/data/ofertas'
import { moeda, nota, resumo } from '@/lib/format'
import { MOLA_SUAVE } from '@/lib/motion'
import css from './CartoesFlutuantes.module.css'

const HOTEL = HOTEIS[0]
const VOO = VOOS[0]
/** Quatro paradas do dia em destaque — as mesmas que a aba Roteiro mostra. */
const PARADAS = DIA_DESTAQUE.itens.slice(0, 4)

/** Entrada dos cartões: sobem e assentam, um depois do outro. */
const ENTRADA = {
  oculto: { opacity: 0, y: 34, scale: 0.97 },
  visivel: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...MOLA_SUAVE, delay: 0.15 + i * 0.09 },
  }),
}

/**
 * Vitrine flutuante do hero.
 *
 * Os quatro cartões passaram a ler o catálogo em vez de repetir valores
 * digitados à mão. No protótipo o cartão de roteiro listava "Praia Vermelha" e
 * "Roda de samba na Lapa" para o dia 3, e nenhuma das duas está no dia 3 do
 * roteiro real — a ilustração contradizia o produto.
 *
 * O parallax é ligado ao scroll, não a um ouvinte de evento: `useScroll` lê a
 * posição uma vez por quadro no compositor, sem forçar layout. O protótipo
 * media `getBoundingClientRect()` de cada elemento dentro do próprio evento de
 * scroll, que é a receita clássica de travamento.
 *
 * `aria-hidden` porque é ilustração: cada número aqui já aparece, em texto
 * corrente, nas seções abaixo.
 */
export function CartoesFlutuantes() {
  const refHotel = useTilt<HTMLDivElement>()
  const refVoo = useTilt<HTMLDivElement>()
  const refRoteiro = useTilt<HTMLDivElement>()

  const palcoRef = useRef<HTMLDivElement>(null)
  const semMovimento = useMovimentoReduzido()

  const { scrollYProgress } = useScroll({
    target: palcoRef,
    offset: ['start end', 'end start'],
  })

  // Cada camada anda a uma velocidade: é a diferença entre elas que cria a
  // sensação de profundidade. Zerado quando o usuário pede menos movimento.
  const lento = useTransform(scrollYProgress, [0, 1], semMovimento ? [0, 0] : [40, -40])
  const medio = useTransform(scrollYProgress, [0, 1], semMovimento ? [0, 0] : [70, -70])
  const rapido = useTransform(scrollYProgress, [0, 1], semMovimento ? [0, 0] : [100, -100])

  return (
    <div ref={palcoRef} className={css['palco']} aria-hidden="true">
      <motion.div
        custom={0}
        variants={ENTRADA}
        initial="oculto"
        animate="visivel"
        style={{ y: lento }}
        className={css['camada']}
      >
        <div ref={refHotel} className={`${css['cartao']} ${css['hotel']} tilt`}>
          <div className={css['foto']}>
            {/* Única foto acima da dobra: entra com prioridade porque é a
                candidata a LCP da home. */}
            <Imagem slug={HOTEL.foto} sizes="330px" prioridade className={css['fotoImg']} />
            <span className={css['nota']}>{nota(HOTEL.nota)}</span>
          </div>
          <div className={css['hotelRodape']}>
            <div>
              <div className={css['hotelNome']}>{HOTEL.titulo}</div>
              <div className={css['hotelLocal']}>{resumo(HOTEL.sub)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={css['precoAntes']}>{moeda(HOTEL.outros)}</div>
              <div className={css['precoAgora']}>{moeda(HOTEL.preco)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        custom={1}
        variants={ENTRADA}
        initial="oculto"
        animate="visivel"
        style={{ y: rapido }}
        className={css['camada']}
      >
        <div ref={refVoo} className={`${css['cartao']} ${css['voo']} ${css['compacto']} tilt`}>
          <div className={css['vooTopo']}>
            <span>GRU → SDU</span>
            <span className={css['direto']}>direto</span>
          </div>
          <div className={css['vooHorarios']}>
            <div className={css['hora']}>06:20</div>
            <div className={css['trilho']} />
            <div className={css['hora']}>07:25</div>
          </div>
          <div className={css['vooRodape']}>
            <div className={css['cia']}>LATAM · 1h 05m</div>
            <div className={css['vooPreco']}>{moeda(VOO.preco)}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        custom={2}
        variants={ENTRADA}
        initial="oculto"
        animate="visivel"
        style={{ y: medio }}
        className={css['camada']}
      >
        <div
          ref={refRoteiro}
          className={`${css['cartao']} ${css['roteiro']} ${css['compacto']} tilt`}
        >
          <div className={css['roteiroTitulo']}>roteiro · dia {DIA_DESTAQUE.n}</div>
          <div className={css['roteiroLista']}>
            {PARADAS.map((it) => (
              <div key={it.hora} className={css['roteiroItem']}>
                <span className={css['roteiroHora']}>{it.hora}</span>
                <span className={css['roteiroNome']}>{it.titulo}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        custom={3}
        variants={ENTRADA}
        initial="oculto"
        animate="visivel"
        style={{ y: rapido }}
        className={css['camada']}
      >
        <div className={`${css['cartao']} ${css['total']} ${css['compacto']}`}>
          <div className={css['totalRotulo']}>total da viagem</div>
          <div className={css['totalValores']}>
            <div className={css['totalPreco']}>R$ 5.240</div>
            <div className={css['totalEconomia']}>−R$ 760</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
