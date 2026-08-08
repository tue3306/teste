import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CabecalhoApp } from '@/components/app/CabecalhoApp'
import { CabecalhoSecao } from '@/components/app/CabecalhoSecao'
import { DialogoReserva } from '@/components/app/DialogoReserva'
import { SecaoLista } from '@/components/app/SecaoLista'
import { VisaoMapa } from '@/components/app/VisaoMapa'
import { VisaoPainel } from '@/components/app/VisaoPainel'
import { VisaoRoteiro } from '@/components/app/VisaoRoteiro'
import { TITULOS, ehAba, ehVertical } from '@/components/app/abas'
import { ChatBia } from '@/components/ChatBia'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import type { Oferta } from '@/types'
import css from './Plataforma.module.css'

/**
 * Plataforma.
 *
 * O que era estado interno virou URL: a aba é um segmento de rota e a categoria
 * um parâmetro de busca. Isso conserta de uma vez o botão voltar, o
 * compartilhamento de link e o recarregamento da página — no protótipo o
 * endereço nunca mudava, então voltar saía do site inteiro.
 */
export function Plataforma() {
  const { aba } = useParams<{ aba: string }>()
  const [aReservar, setAReservar] = useState<Oferta | null>(null)

  const abaValida = ehAba(aba) ? aba : null
  const info = abaValida ? TITULOS[abaValida] : null

  useMetaDaPagina(
    info ? `${info.titulo} · Plataforma` : 'Plataforma',
    info?.subtitulo ?? 'Compare voos, hospedagem e passeios da sua viagem ao Rio de Janeiro.',
  )

  if (!abaValida) return <Navigate to="/plataforma/voos" replace />

  const vertical = ehVertical(abaValida) ? abaValida : null

  return (
    <div className={css['pagina']}>
      <CabecalhoApp />

      <div className={`shell-app ${css['corpo']}`}>
        <main id="conteudo">
          {vertical ? (
            /* A `key` remonta a lista ao trocar de vertical, o que zera os
               filtros sem precisar de um efeito para isso. */
            <SecaoLista key={vertical} vertical={vertical} aoReservar={setAReservar} />
          ) : (
            <>
              <CabecalhoSecao titulo={info?.titulo ?? ''} subtitulo={info?.subtitulo ?? ''} />
              {abaValida === 'roteiro' ? <VisaoRoteiro /> : null}
              {abaValida === 'mapa' ? <VisaoMapa /> : null}
              {abaValida === 'dashboard' ? <VisaoPainel /> : null}
              {abaValida === 'bia' ? (
                <div className={css['painelBia']}>
                  <ChatBia alturaMaxima={420} />
                </div>
              ) : null}
            </>
          )}
        </main>
      </div>

      {/* A `key` zera o estado interno do diálogo a cada oferta diferente. */}
      <DialogoReserva
        key={aReservar?.id ?? 'nenhuma'}
        oferta={aReservar}
        aoFechar={() => {
          setAReservar(null)
        }}
      />
    </div>
  )
}
