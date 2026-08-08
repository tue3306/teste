import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ViagemContext, type ViagemContexto } from './ViagemContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ATRASO_RESPOSTA, responder } from '@/lib/bia'
import { BUSCA_INICIAL, CHECKLIST_INICIAL } from '@/data/site'
import { ROTEIRO } from '@/data/roteiro'
import type { Busca, DiaRoteiro, ItemRoteiro, Mensagem } from '@/types'

const CHAT_INICIAL: Mensagem[] = [
  {
    id: 'm0',
    autor: 'bot',
    texto:
      'Oi! Sou a Bia, sua copiloto de viagem. Diga o destino, os dias e o orçamento — eu cuido do resto.',
  },
  {
    id: 'm1',
    autor: 'user',
    texto: 'Roteiro de 7 dias no Rio, R$ 6 mil pra dois, gosto de praia e comida boa.',
  },
  {
    id: 'm2',
    autor: 'bot',
    texto:
      'Fechado. Montei 7 dias entre Zona Sul e Centro histórico: praia de manhã, cultura à tarde, gastronomia à noite. Voo direto GRU→SDU, hotel em Ipanema e 9 experiências. Total previsto: R$ 5.240 — R$ 760 abaixo do seu orçamento.',
  },
]

/** Reservas já confirmadas da viagem em foco — os "4" que o painel exibe. */
const RESERVAS_INICIAIS = ['v2', 'h2', 'p1', 'p2']

/**
 * A chave do roteiro é versionada de propósito: quando o formato do dado mudar,
 * basta subir o número para que um roteiro salvo em um formato antigo seja
 * ignorado em vez de quebrar a tela.
 */
const CHAVE_ROTEIRO = 'bib:roteiro:v1'

/**
 * Estado da viagem em curso.
 *
 * Favoritos, reservas, checklist e roteiro vão para `localStorage`: no protótipo
 * tudo voltava ao padrão a cada recarga, então "Salvar" não salvava nada. A
 * conversa fica só em memória de propósito — é uma sessão, não um histórico.
 */
export function ViagemProvider({ children }: { children: ReactNode }) {
  const [busca, setBusca] = useState<Busca>(BUSCA_INICIAL)
  const [favoritos, setFavoritos] = useLocalStorage<string[]>('bib:favoritos', ['h2'])
  const [reservas, setReservas] = useLocalStorage<string[]>('bib:reservas', RESERVAS_INICIAIS)
  const [checklist, setChecklist] = useLocalStorage<string[]>('bib:checklist', CHECKLIST_INICIAL)
  const [roteiro, setRoteiro] = useLocalStorage<DiaRoteiro[]>(CHAVE_ROTEIRO, ROTEIRO)
  const [chat, setChat] = useState<Mensagem[]>(CHAT_INICIAL)
  const [biaDigitando, setBiaDigitando] = useState(false)

  /** Timers da resposta da Bia, cancelados no desmonte. */
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  const proximoId = useRef(CHAT_INICIAL.length)

  useEffect(() => {
    const pendentes = timers.current
    return () => {
      for (const t of pendentes) clearTimeout(t)
      pendentes.clear()
    }
  }, [])

  const atualizarBusca = useCallback((campo: keyof Busca, valor: string) => {
    setBusca((atual) => ({ ...atual, [campo]: valor }))
  }, [])

  const alternarFavorito = useCallback(
    (id: string) => {
      setFavoritos((atual) => (atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id]))
    },
    [setFavoritos],
  )

  const reservar = useCallback(
    (id: string) => {
      setReservas((atual) => (atual.includes(id) ? atual : [...atual, id]))
    },
    [setReservas],
  )

  const alternarChecklist = useCallback(
    (id: string) => {
      setChecklist((atual) => (atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]))
    },
    [setChecklist],
  )

  const moverParada = useCallback(
    (dia: number, indice: number, direcao: -1 | 1) => {
      setRoteiro((atual) =>
        atual.map((d) => {
          if (d.n !== dia) return d
          const destino = indice + direcao
          if (destino < 0 || destino >= d.itens.length) return d

          const itens = [...d.itens]
          const [movido] = itens.splice(indice, 1)
          if (!movido) return d
          itens.splice(destino, 0, movido)
          return { ...d, itens }
        }),
      )
    },
    [setRoteiro],
  )

  const adicionarParada = useCallback(
    (dia: number, item: ItemRoteiro) => {
      setRoteiro((atual) =>
        atual.map((d) => (d.n === dia ? { ...d, itens: [...d.itens, item] } : d)),
      )
    },
    [setRoteiro],
  )

  const restaurarRoteiro = useCallback(() => {
    setRoteiro(ROTEIRO)
  }, [setRoteiro])

  const enviarMensagem = useCallback((texto: string) => {
    const limpo = texto.trim()
    if (!limpo) return

    proximoId.current += 1
    setChat((atual) => [...atual, { id: `m${String(proximoId.current)}`, autor: 'user', texto: limpo }])
    setBiaDigitando(true)

    const timer = setTimeout(() => {
      timers.current.delete(timer)
      proximoId.current += 1
      setChat((atual) => [
        ...atual,
        { id: `m${String(proximoId.current)}`, autor: 'bot', texto: responder(limpo) },
      ])
      setBiaDigitando(false)
    }, ATRASO_RESPOSTA)

    timers.current.add(timer)
  }, [])

  const valor = useMemo<ViagemContexto>(
    () => ({
      busca,
      atualizarBusca,
      favoritos,
      alternarFavorito,
      ehFavorito: (id: string) => favoritos.includes(id),
      reservas,
      reservar,
      ehReservada: (id: string) => reservas.includes(id),
      checklist,
      alternarChecklist,
      roteiro,
      moverParada,
      adicionarParada,
      restaurarRoteiro,
      chat,
      enviarMensagem,
      biaDigitando,
    }),
    [
      busca,
      atualizarBusca,
      favoritos,
      alternarFavorito,
      reservas,
      reservar,
      checklist,
      alternarChecklist,
      roteiro,
      moverParada,
      adicionarParada,
      restaurarRoteiro,
      chat,
      enviarMensagem,
      biaDigitando,
    ],
  )

  return <ViagemContext value={valor}>{children}</ViagemContext>
}
