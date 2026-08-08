import { Botao } from '@/components/ui/Botao'
import { Reveal } from '@/components/ui/Reveal'
import { useMagnetic } from '@/hooks/useTilt'
import css from './ChamadaFinal.module.css'

export function ChamadaFinal() {
  const refMagnetico = useMagnetic<HTMLAnchorElement>()

  return (
    <section className="shell secao" aria-labelledby="cta-titulo">
      <Reveal className={css['caixa']}>
        <div className={css['brilho']} aria-hidden="true" />
        <h2 id="cta-titulo" className={css['titulo']}>
          Sua próxima viagem
          <br />
          <span className="serif" style={{ color: 'inherit' }}>
            começa em uma linha.
          </span>
        </h2>
        <p className={css['texto']}>
          Grátis para planejar. Você só paga o que reservar — sempre no melhor preço.
        </p>
        <div className={css['acoes']}>
          <Botao para="/plataforma/voos" tamanho="lg" ref={refMagnetico} className="magnetico">
            Planejar o Rio agora
          </Botao>
          <Botao para="/plataforma/bia" variante="secundario" tamanho="lg">
            Falar com a Bia
          </Botao>
        </div>
      </Reveal>
    </section>
  )
}
