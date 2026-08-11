import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CabecalhoApp } from '@/components/app/CabecalhoApp'
import { CabecalhoSecao } from '@/components/app/CabecalhoSecao'
import { DialogoItem } from '@/components/app/DialogoItem'
import { SecaoLista } from '@/components/app/SecaoLista'
import { VisaoDestinos } from '@/components/app/VisaoDestinos'
import { VisaoMapa } from '@/components/app/VisaoMapa'
import { VisaoViagem } from '@/components/app/VisaoViagem'
import { TITULOS, ehAba, ehVertical } from '@/components/app/abas'
import { useViagem } from '@/context/ViagemContext'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import type { Oferta } from '@/types'
import css from './Plataforma.module.css'

/**
 * Plataforma.
 *
 * O que era estado interno virou URL: a aba é um segmento de rota. Isso conserta
 * de uma vez o botão voltar, o compartilhamento de link e o recarregamento da
 * página — no protótipo o endereço nunca mudava, então voltar saía do site.
 *
 * A rota é privada; o portão está em `App.tsx`, e não aqui, para que nenhum
 * código da plataforma chegue a rodar sem sessão.
 */
export function Plataforma() {
  const { aba } = useParams<{ aba: string }>()
  const { destino } = useViagem()
  const [aberto, setAberto] = useState<Oferta | null>(null)

  const abaValida = ehAba(aba) ? aba : null
  const info = abaValida ? TITULOS[abaValida] : null

  useMetaDaPagina(
    info ? `${info.titulo(destino.nome)} · Plataforma` : 'Plataforma',
    info?.subtitulo ?? 'Compare voos, hospedagem, passeios e carros no Rio de Janeiro.',
  )

  if (!abaValida) return <Navigate to="/plataforma/destinos" replace />

  const vertical = ehVertical(abaValida) ? abaValida : null

  return (
    <div className={css['pagina']}>
      <CabecalhoApp />

      <div className={`shell-app ${css['corpo']}`}>
        <main id="conteudo">
          {vertical ? (
            /* A `key` remonta a lista ao trocar de vertical ou de destino, o
               que zera os filtros sem precisar de um efeito para isso. */
            <SecaoLista key={`${vertical}-${destino.id}`} vertical={vertical} aoAbrir={setAberto} />
          ) : (
            <>
              <CabecalhoSecao
                titulo={info?.titulo(destino.nome) ?? ''}
                subtitulo={info?.subtitulo ?? ''}
              />
              {abaValida === 'destinos' ? <VisaoDestinos /> : null}
              {abaValida === 'mapa' ? <VisaoMapa /> : null}
              {abaValida === 'viagem' ? <VisaoViagem /> : null}
            </>
          )}
        </main>
      </div>

      {/* A `key` zera o estado interno do diálogo a cada item diferente. */}
      <DialogoItem
        key={aberto?.id ?? 'nenhum'}
        item={aberto}
        aoFechar={() => {
          setAberto(null)
        }}
      />
    </div>
  )
}
