import { useState } from 'react'
import { Botao } from '@/components/ui/Botao'
import { Dialogo } from '@/components/ui/Dialogo'
import { useViagem } from '@/context/ViagemContext'
import { economia, moeda } from '@/lib/format'
import type { Oferta } from '@/types'

interface Props {
  oferta: Oferta | null
  aoFechar: () => void
}

/**
 * Confirmação de reserva.
 *
 * O botão "Reservar" do protótipo não tinha manipulador nenhum — era o único
 * caminho de conversão do produto e não fazia nada. Aqui ele abre um resumo com
 * o preço final, e a confirmação registra a reserva, que passa a contar no
 * painel "Minha viagem".
 */
export function DialogoReserva({ oferta, aoFechar }: Props) {
  const { reservar, ehReservada } = useViagem()
  // A página remonta este componente com `key={oferta.id}`, então este estado
  // já nasce zerado a cada oferta — não é preciso um efeito para reiniciá-lo.
  const [confirmada, setConfirmada] = useState(false)

  if (!oferta) return null

  const jaReservada = ehReservada(oferta.id)

  return (
    <Dialogo
      aberto={oferta !== null}
      aoFechar={aoFechar}
      titulo={confirmada || jaReservada ? 'Reserva confirmada' : 'Confirmar reserva'}
      descricao={oferta.titulo}
    >
      <dl
        style={{
          display: 'grid',
          gap: 10,
          padding: 18,
          borderRadius: 'var(--r-xl)',
          background: 'var(--sand)',
          border: '1px solid var(--ink-a07)',
          margin: 0,
        }}
      >
        <Linha rotulo="O que é" valor={oferta.sub} />
        <Linha rotulo="Preço médio do mercado" valor={moeda(oferta.outros)} />
        <Linha rotulo="Sua economia" valor={economia(oferta.preco, oferta.outros)} destaque />
        <Linha rotulo="Total com taxas" valor={moeda(oferta.preco)} forte />
      </dl>

      {confirmada || jaReservada ? (
        <>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>
            {jaReservada && !confirmada
              ? 'Esta reserva já está na sua viagem. Você acompanha tudo em “Minha viagem”.'
              : 'Pronto. Adicionamos à sua viagem — o pagamento acontece direto com o fornecedor, sem taxa da BI&B.'}
          </p>
          <Botao para="/plataforma/dashboard" variante="secundario" bloco>
            Ver em “Minha viagem”
          </Botao>
        </>
      ) : (
        <>
          <Botao
            bloco
            onClick={() => {
              reservar(oferta.id)
              setConfirmada(true)
            }}
          >
            Confirmar por {moeda(oferta.preco)}
          </Botao>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-3)', lineHeight: 1.5, margin: 0 }}>
            Preço final, com taxas. Nenhum dado de pagamento é pedido nesta etapa.
          </p>
        </>
      )}
    </Dialogo>
  )
}

function Linha({
  rotulo,
  valor,
  destaque = false,
  forte = false,
}: {
  rotulo: string
  valor: string
  destaque?: boolean
  forte?: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'baseline' }}>
      <dt style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-3)' }}>{rotulo}</dt>
      <dd
        style={{
          margin: 0,
          fontSize: forte ? '1.125rem' : 'var(--fs-sm)',
          fontWeight: forte ? 800 : 650,
          color: destaque ? 'var(--coral-text)' : 'var(--ink)',
          textAlign: 'right',
        }}
      >
        {valor}
      </dd>
    </div>
  )
}
