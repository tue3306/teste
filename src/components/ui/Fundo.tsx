import { useEffect, useRef } from 'react'
import { useMovimentoReduzido } from '@/hooks/useMovimento'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import css from './Fundo.module.css'

interface Mote {
  x: number
  y: number
  r: number
  s: number
  d: number
  o: number
}

const TETO_DPR = 2

/**
 * Cenário fixo atrás do conteúdo: mar animado, sol e reflexo de água.
 *
 * O mar são três faixas senoidais sobrepostas, cada uma com período e
 * amplitude próprios: é a defasagem entre elas que dá profundidade, e não o
 * desenho de nenhuma isolada. Por cima passam partículas lentas, como reflexo
 * na água.
 *
 * ## Movimento reduzido não desliga o mar
 *
 * O canvas nem chegava a ser montado quando o sistema pedia menos movimento —
 * quem tem "efeitos de animação" desligado no Windows recebia um degradê
 * parado, e o mar parecia ter sido removido do produto. Não tinha: estava atrás
 * de um `if`.
 *
 * Agora ele roda sempre, e a preferência regula **amplitude e velocidade**:
 * ondas de um terço da altura, metade da velocidade, sem partículas. Um mar
 * calmo continua sendo um mar; um degradê estático não é.
 *
 * Duas garantias de custo, mantidas: o `requestAnimationFrame` para quando a
 * aba sai de foco, e todos os ouvintes saem no desmonte.
 */
export function Fundo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const semMovimento = useMovimentoReduzido()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Os dois botões de volume do efeito. Com movimento reduzido a onda fica
    // baixa e lenta, e o reflexo de partículas sai — é o que mais chama o olho.
    const calma = semMovimento ? 0.34 : 1
    const velocidade = semMovimento ? 0.0026 : 0.006

    const dpr = Math.min(window.devicePixelRatio || 1, TETO_DPR)
    let largura = 0
    let altura = 0
    let motes: Mote[] = []
    let t = 0
    let raf = 0

    const redimensionar = () => {
      largura = canvas.clientWidth
      altura = canvas.clientHeight
      if (!largura || !altura) return

      canvas.width = Math.round(largura * dpr)
      canvas.height = Math.round(altura * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const quantidade = semMovimento ? 0 : Math.round((largura * altura) / 42000)
      motes = Array.from({ length: quantidade }, () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        r: Math.random() * 2.2 + 0.8,
        s: Math.random() * 0.16 + 0.04,
        d: Math.random() * Math.PI * 2,
        o: Math.random() * 0.35 + 0.12,
      }))
    }

    const quadro = () => {
      if (largura && altura) {
        t += velocidade
        ctx.clearRect(0, 0, largura, altura)

        // Três faixas de mar sobrepostas, cada uma com período e amplitude
        // próprios — é a defasagem entre elas que dá a sensação de profundidade.
        for (let i = 0; i < 3; i++) {
          const base = altura - 30 - i * 46
          const amplitude = (12 + i * 7) * calma
          ctx.beginPath()
          ctx.moveTo(0, base)
          for (let x = 0; x <= largura; x += 12) {
            ctx.lineTo(x, base + Math.sin(x / (170 + i * 60) + t * (1 + i * 0.35)) * amplitude)
          }
          ctx.lineTo(largura, altura)
          ctx.lineTo(0, altura)
          ctx.closePath()
          ctx.fillStyle = `rgba(14, 154, 167, ${String(0.16 - i * 0.04)})`
          ctx.fill()
        }

        for (const p of motes) {
          p.y -= p.s
          p.d += 0.01
          p.x += Math.sin(p.d) * 0.22
          if (p.y < -6) {
            p.y = altura + 6
            p.x = Math.random() * largura
          }
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${String(p.o)})`
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(quadro)
    }

    const iniciar = () => {
      raf ||= requestAnimationFrame(quadro)
    }

    const parar = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const aoTrocarVisibilidade = () => {
      if (document.hidden) parar()
      else iniciar()
    }

    redimensionar()
    iniciar()

    window.addEventListener('resize', redimensionar)
    document.addEventListener('visibilitychange', aoTrocarVisibilidade)

    const ro = new ResizeObserver(redimensionar)
    ro.observe(canvas)

    return () => {
      parar()
      window.removeEventListener('resize', redimensionar)
      document.removeEventListener('visibilitychange', aoTrocarVisibilidade)
      ro.disconnect()
    }
  }, [semMovimento])

  return (
    <>
      <canvas ref={canvasRef} className={css['canvas']} aria-hidden="true" />
      <div className={css['sol']} aria-hidden="true" />
      <div className={css['agua']} aria-hidden="true" />
    </>
  )
}

/**
 * Barra de progresso de leitura.
 *
 * Anima `transform: scaleX`, não `width`: escalar roda no compositor, enquanto
 * mexer na largura força layout e paint a cada quadro de scroll.
 */
export function BarraProgresso() {
  const progresso = useScrollProgress()

  return (
    <div
      className={css['progresso']}
      style={{ width: '100%', transform: `scaleX(${String(progresso)})` }}
      aria-hidden="true"
    />
  )
}
