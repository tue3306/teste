import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CabecalhoSecao } from './CabecalhoSecao'
import { CartaoOferta } from './CartaoOferta'
import { PainelFiltros } from './PainelFiltros'
import { TITULOS } from './abas'
import { useViagem } from '@/context/ViagemContext'
import { faixaDePreco } from '@/data/rj'
import { SERVICOS } from '@/services/catalogo'
import { custoBeneficio } from '@/lib/orcamento'
import type { Oferta, Ordenacao, Vertical } from '@/types'
import css from './SecaoLista.module.css'

interface Props {
  vertical: Vertical
  aoAbrir: (oferta: Oferta) => void
}

/**
 * Uma vertical do catálogo: lista, filtros e ordenação.
 *
 * O destino vem do contexto da viagem, e não de um prop: trocar de destino
 * precisa reordenar as seis abas de uma vez, e passar o id por seis níveis de
 * componente seria a mesma informação escrita seis vezes.
 */
export function SecaoLista({ vertical, aoAbrir }: Props) {
  const { destino } = useViagem()
  const [params] = useSearchParams()
  const destacado = params.get('item')

  const itens = useMemo(
    () => SERVICOS[vertical].listar({ destino: destino.id }),
    [vertical, destino.id],
  )
  const faixa = useMemo(() => faixaDePreco(itens), [itens])

  const [precoMax, setPrecoMax] = useState<number | null>(null)
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('melhor')
  const [facetas, setFacetas] = useState<string[]>([])

  // O teto começa no máximo da faixa e só passa a existir quando o usuário
  // mexe. Guardar `faixa.max` em estado exigiria um efeito para ressincronizar
  // a cada troca de vertical ou destino — e efeito que corrige estado é
  // exatamente a fonte de tela piscando.
  const teto = precoMax ?? faixa.max

  const filtrados = useMemo(() => {
    const lista = itens.filter(
      (o) => o.preco <= teto && facetas.every((f) => o.facetas.includes(f)),
    )

    const ordenado = [...lista]
    if (ordenacao === 'preco') ordenado.sort((a, b) => a.preco - b.preco)
    else if (ordenacao === 'nota') ordenado.sort((a, b) => b.nota - a.nota)
    else {
      // "Melhor escolha" é nota por real, o mesmo critério do comparador — e
      // não a ordem em que os itens foram escritos no arquivo.
      const cb = custoBeneficio(lista)
      ordenado.sort((a, b) => (cb.get(b.id) ?? 0) - (cb.get(a.id) ?? 0))
    }
    return ordenado
  }, [itens, teto, facetas, ordenacao])

  const notas = useMemo(() => custoBeneficio(filtrados), [filtrados])
  const info = TITULOS[vertical]

  return (
    <>
      <CabecalhoSecao titulo={info.titulo(destino.nome)} subtitulo={info.subtitulo ?? ''} />

      <div className={css['grade']}>
        <div className={css['filtros']}>
          <PainelFiltros
            vertical={vertical}
            faixa={faixa}
            precoMax={teto}
            aoTrocarPreco={setPrecoMax}
            ordenacao={ordenacao}
            aoTrocarOrdenacao={setOrdenacao}
            facetas={facetas}
            aoAlternarFaceta={(id) => {
              setFacetas((atual) =>
                atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id],
              )
            }}
            encontrados={filtrados.length}
          />
        </div>

        <div className={css['lista']}>
          {filtrados.length === 0 ? (
            <p className={css['vazio']}>
              {itens.length === 0
                ? `Ainda não há inventário desta categoria em ${destino.nome}. Escolha outro destino na aba Destinos.`
                : 'Nenhuma opção passa por todos os filtros. Solte alguma característica ou suba o teto de preço.'}
            </p>
          ) : (
            filtrados.map((o) => (
              <CartaoOferta
                key={o.id}
                oferta={o}
                destacado={o.id === destacado}
                custoBeneficio={notas.get(o.id)}
                aoAbrir={aoAbrir}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
