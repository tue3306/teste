import { ChatBia } from '@/components/ChatBia'
import { Reveal } from '@/components/ui/Reveal'
import css from './SecaoBia.module.css'

export function SecaoBia() {
  return (
    <section id="bia" className="shell secao" aria-labelledby="bia-titulo">
      <Reveal className={css['intro']}>
        <p className="eyebrow">04 — assistente</p>
        <h2 id="bia-titulo" className="titulo">
          Converse. <span className="serif">Ela reserva.</span>
        </h2>
        <p className="lead" style={{ marginBlockStart: 18 }}>
          “Quero 4 dias no Rio com R$ 3 mil, sem acordar cedo.” A Bia entende, monta e mostra o preço
          final.
        </p>
      </Reveal>

      <Reveal atraso={0.1} className={css['painel']}>
        <ChatBia
          convite="Pergunte à Bia: quanto vou gastar em 5 dias?"
          alturaMaxima={340}
        />
      </Reveal>
    </section>
  )
}
