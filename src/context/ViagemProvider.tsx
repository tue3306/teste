import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ViagemContext, type ViagemContexto } from './ViagemContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { BUSCA_INICIAL, CHECKLIST_INICIAL } from '@/data/site'
import { ITEM_POR_ID, acharDestino } from '@/data/rj'
import { catalogoCompleto, resolverIds } from '@/services/catalogo'
import { calcularOrcamento, noitesEntre, quartosSugeridos } from '@/lib/orcamento'
import type { Busca, Oferta, Pessoas, Vertical } from '@/types'

/**
 * Verticais em que a escolha é única.
 *
 * Ninguém pega dois voos para o mesmo trecho nem dorme em dois hotéis na mesma
 * noite. Escolher outro **substitui** o anterior, em vez de somar — que era o
 * que acontecia antes e produzia um total com duas hospedagens dentro.
 *
 * Passeio, restaurante, evento e carro podem repetir: dá para fazer três
 * passeios e jantar em dois lugares.
 */
const ESCOLHA_UNICA: ReadonlySet<Vertical> = new Set<Vertical>(['voos', 'hoteis'])

/**
 * Estado da viagem em curso.
 *
 * Favoritos, seleção e checklist vão para `localStorage`: no protótipo tudo
 * voltava ao padrão a cada recarga, então "Salvar" não salvava nada.
 *
 * O orçamento **não** é guardado. Ele é derivado — da seleção, das datas e do
 * grupo — e derivar a cada render é mais barato do que manter sincronizado. Um
 * total persistido é um total que uma hora discorda das próprias linhas.
 */
export function ViagemProvider({ children }: { children: ReactNode }) {
  const [busca, setBusca] = useState<Busca>(BUSCA_INICIAL)
  const [quartosManuais, setQuartosManuais] = useState<number | null>(null)

  const [favoritos, setFavoritos] = useLocalStorage<string[]>('bib:favoritos', [])
  const [selecao, setSelecao] = useLocalStorage<Record<string, number>>('bib:viagem:v2', {})
  const [checklist, setChecklist] = useLocalStorage<string[]>('bib:checklist', CHECKLIST_INICIAL)

  const definirBusca = useCallback(<C extends keyof Busca>(campo: C, valor: Busca[C]) => {
    setBusca((atual) => ({ ...atual, [campo]: valor }))
  }, [])

  const definirPessoas = useCallback((faixa: keyof Pessoas, valor: number) => {
    setBusca((atual) => {
      const pessoas = { ...atual.pessoas, [faixa]: Math.max(0, valor) }
      // Sempre ao menos um adulto: um grupo de zero adultos e duas crianças não
      // é uma viagem que se possa reservar, e o total daria uma fração de
      // passageiro sem significado.
      if (pessoas.adultos < 1) pessoas.adultos = 1
      return { ...atual, pessoas }
    })
  }, [])

  const destino = useMemo(() => acharDestino(busca.destino), [busca.destino])

  const contexto = useMemo(() => {
    const noites = noitesEntre(busca.ida, busca.volta)
    return {
      pessoas: busca.pessoas,
      noites,
      // A locação cobre o dia da chegada e o da saída: quem fica três noites
      // fica com o carro quatro dias.
      dias: noites > 0 ? noites + 1 : 0,
      quartos: quartosManuais ?? quartosSugeridos(busca.pessoas),
    }
  }, [busca.ida, busca.volta, busca.pessoas, quartosManuais])

  const alternarFavorito = useCallback(
    (id: string) => {
      setFavoritos((atual) => (atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id]))
    },
    [setFavoritos],
  )

  const adicionar = useCallback(
    (item: Oferta) => {
      setSelecao((atual) => {
        if (!ESCOLHA_UNICA.has(item.vertical)) {
          return { ...atual, [item.id]: (atual[item.id] ?? 0) + 1 }
        }
        // Escolha única: tira o que havia da mesma vertical antes de entrar.
        const limpo: Record<string, number> = {}
        for (const [id, qtd] of Object.entries(atual)) {
          if (ITEM_POR_ID.get(id)?.vertical !== item.vertical) limpo[id] = qtd
        }
        limpo[item.id] = 1
        return limpo
      })
    },
    [setSelecao],
  )

  const remover = useCallback(
    (id: string) => {
      setSelecao((atual) => {
        const restante = (atual[id] ?? 0) - 1
        const { [id]: _saiu, ...resto } = atual
        return restante > 0 ? { ...resto, [id]: restante } : resto
      })
    },
    [setSelecao],
  )

  const descartar = useCallback(
    (id: string) => {
      setSelecao((atual) => {
        const { [id]: _saiu, ...resto } = atual
        return resto
      })
    },
    [setSelecao],
  )

  const limparViagem = useCallback(() => {
    setSelecao({})
  }, [setSelecao])

  const alternarChecklist = useCallback(
    (id: string) => {
      setChecklist((atual) => (atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]))
    },
    [setChecklist],
  )

  const itensEscolhidos = useMemo(() => resolverIds(Object.keys(selecao)), [selecao])

  const orcamento = useMemo(
    () => calcularOrcamento(catalogoCompleto(), selecao, contexto, busca.orcamento),
    [selecao, contexto, busca.orcamento],
  )

  const valor = useMemo<ViagemContexto>(
    () => ({
      busca,
      definirBusca,
      definirPessoas,
      destino,
      contexto,
      definirQuartos: setQuartosManuais,
      favoritos,
      alternarFavorito,
      ehFavorito: (id: string) => favoritos.includes(id),
      selecao,
      adicionar,
      remover,
      descartar,
      quantidade: (id: string) => selecao[id] ?? 0,
      limparViagem,
      itensEscolhidos,
      orcamento,
      checklist,
      alternarChecklist,
    }),
    [
      busca,
      definirBusca,
      definirPessoas,
      destino,
      contexto,
      favoritos,
      alternarFavorito,
      selecao,
      adicionar,
      remover,
      descartar,
      limparViagem,
      itensEscolhidos,
      orcamento,
      checklist,
      alternarChecklist,
    ],
  )

  return <ViagemContext value={valor}>{children}</ViagemContext>
}
