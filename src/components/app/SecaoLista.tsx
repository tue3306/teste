import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CabecalhoSecao } from './CabecalhoSecao'
import { CartaoOferta } from './CartaoOferta'
import { PainelFiltros } from './PainelFiltros'
import { TITULOS } from './abas'
import { Esqueleto } from '@/components/ui/Esqueleto'
import { Icone } from '@/components/ui/Icone'
import { useViagem } from '@/context/ViagemContext'
import { useRecurso } from '@/hooks/useRecurso'
import { buscarOfertas } from '@/services/provedores'
import { OFERTAS_POR_VERTICAL, faixaDePreco } from '@/data/ofertas'
import { CATEGORIAS } from '@/data/site'
import type { Categoria, Oferta, Ordenacao, Vertical } from '@/types'
import css from './SecaoLista.module.css'

interface Props {
  vertical: Vertical
  aoReservar: (oferta: Oferta) => void
}

/**
 * Lista de ofertas com o painel de filtros.
 *
 * O estado dos filtros mora aqui, e não na página, para que a página possa
 * remontar este bloco com `key={vertical}`: trocar de aba zera preço, ordenação
 * e facetas sem um efeito que chama `setState` — o padrão que o React 19
 * desaconselha, porque força um render em cascata a cada troca.
 */
export function SecaoLista({ vertical, aoReservar }: Props) {
  const [params, setParams] = useSearchParams()
  const [precoMaximo, setPrecoMaximo] = useState<number | null>(null)
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('melhor')
  const [facetas, setFacetas] = useState<string[]>([])

  const { busca } = useViagem()

  /**
   * As ofertas passam pela camada de provedores mesmo sem backend configurado.
   * Sem `VITE_API_BASE` a função responde do catálogo local na hora, sem tocar a
   * rede; com a variável definida, a mesma tela passa a mostrar inventário real
   * sem nenhuma mudança de componente.
   */
  const carregar = useCallback(
    (sinal: AbortSignal) => buscarOfertas({ vertical, destino: busca.destino }, sinal),
    [vertical, busca.destino],
  )
  const remoto = useRecurso(carregar)

  const ofertas = remoto.dados?.ofertas ?? OFERTAS_POR_VERTICAL[vertical]
  const carregando = remoto.status === 'carregando' && !remoto.dados
  const faixa = useMemo(() => faixaDePreco(ofertas), [ofertas])
  const teto = precoMaximo ?? faixa.max

  const categoria = params.get('cat') as Categoria | null
  const destacada = params.get('oferta')

  const resultados = useMemo(() => {
    const filtradas = ofertas
      .filter((o) => o.preco <= teto)
      .filter((o) => facetas.every((f) => o.facetas.includes(f)))
      .filter((o) => !categoria || o.categorias.includes(categoria))

    const ordenadas = [...filtradas]
    if (ordenacao === 'preco') ordenadas.sort((a, b) => a.preco - b.preco)
    else if (ordenacao === 'nota') ordenadas.sort((a, b) => b.nota - a.nota)
    else ordenadas.sort((a, b) => b.nota / b.preco - a.nota / a.preco)

    return ordenadas
  }, [ofertas, teto, facetas, categoria, ordenacao])

  const nomeCategoria = categoria ? CATEGORIAS.find((c) => c.id === categoria)?.label : null

  function limparCategoria() {
    params.delete('cat')
    setParams(params, { replace: true })
  }

  return (
    <>
      <CabecalhoSecao
        titulo={TITULOS[vertical].titulo}
        subtitulo={`${String(resultados.length)} de ${String(ofertas.length)} opções dentro dos seus filtros · preço final com taxas`}
      />

      <div className={css['grade']}>
        <div className={css['filtros']}>
          <PainelFiltros
            vertical={vertical}
            precoMaximo={teto}
            faixa={faixa}
            aoMudarPreco={setPrecoMaximo}
            ordenacao={ordenacao}
            aoMudarOrdenacao={setOrdenacao}
            facetasAtivas={facetas}
            aoAlternarFaceta={(id) => {
              setFacetas((atual) =>
                atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id],
              )
            }}
            aoLimpar={() => {
              setPrecoMaximo(null)
              setOrdenacao('melhor')
              setFacetas([])
              if (categoria) limparCategoria()
            }}
          />
        </div>

        <div>
          {nomeCategoria ? (
            <p className={css['filtroCategoria']}>
              Categoria: {nomeCategoria}
              <button
                type="button"
                className={css['limparCategoria']}
                onClick={limparCategoria}
                aria-label={`Remover o filtro de categoria ${nomeCategoria}`}
              >
                <Icone nome="fechar" tamanho={11} />
              </button>
            </p>
          ) : null}

          <div className={css['lista']} aria-busy={carregando}>
            {carregando
              ? Array.from({ length: 4 }, (_, i) => (
                  <Esqueleto key={i} altura={168} raio="var(--r-3xl)" />
                ))
              : null}

            {resultados.map((o) => (
              <CartaoOferta
                key={o.id}
                oferta={o}
                destacado={o.id === destacada}
                aoReservar={aoReservar}
              />
            ))}

            {resultados.length === 0 && !carregando ? (
              <p className={css['vazio']}>
                Nada dentro desses filtros. Solte o preço máximo, remova uma comodidade ou tire o
                filtro de categoria.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
