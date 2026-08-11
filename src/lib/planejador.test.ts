import { describe, expect, it } from 'vitest'
import {
  ETAPAS,
  PRIMEIRA,
  anterior,
  indiceDe,
  normalizar,
  pendencias,
  podeAvancar,
  progresso,
  proxima,
  resolvida,
  type EstadoPlano,
  type IdEtapa,
} from './planejador'
import type { Busca, Oferta } from '@/types'

const BUSCA_VAZIA: Busca = {
  destino: '',
  ida: '',
  volta: '',
  pessoas: { adultos: 1, criancas: 0, bebes: 0 },
  orcamento: 0,
  preferencias: [],
}

const BUSCA_COMPLETA: Busca = {
  destino: 'paraty',
  ida: '2026-09-01',
  volta: '2026-09-06',
  pessoas: { adultos: 2, criancas: 1, bebes: 0 },
  orcamento: 6000,
  preferencias: ['praia'],
}

/** Item mínimo: o planejador só olha a vertical. */
function item(vertical: Oferta['vertical']): Oferta {
  return {
    id: `x-${vertical}`,
    vertical,
    destino: 'paraty',
    titulo: 'x',
    sub: '',
    preco: 100,
    outros: 120,
    unidade: 'pessoa',
    nota: 9,
    tag: '',
    foto: 'paraty',
    chips: [],
    facetas: [],
    categorias: [],
  }
}

const vazio: EstadoPlano = { busca: BUSCA_VAZIA, escolhidos: [] }
const basico: EstadoPlano = { busca: BUSCA_COMPLETA, escolhidos: [] }

describe('navegação entre etapas', () => {
  it('percorre as onze etapas para a frente e volta ao início', () => {
    const ida: IdEtapa[] = []
    let cursor: IdEtapa | null = PRIMEIRA
    while (cursor) {
      ida.push(cursor)
      cursor = proxima(cursor)
    }
    expect(ida).toHaveLength(ETAPAS.length)
    expect(ida[0]).toBe('destino')
    expect(ida.at(-1)).toBe('resumo')

    // Voltar refaz exatamente o mesmo caminho ao contrário.
    const volta: IdEtapa[] = []
    let atras: IdEtapa | null = ida.at(-1)!
    while (atras) {
      volta.push(atras)
      atras = anterior(atras)
    }
    expect(volta.reverse()).toEqual(ida)
  })

  it('a primeira não tem anterior e a última não tem próxima', () => {
    expect(anterior('destino')).toBeNull()
    expect(proxima('resumo')).toBeNull()
  })

  it('normaliza etapa desconhecida para a primeira', () => {
    expect(normalizar('etapa-que-nao-existe')).toBe('destino')
    expect(normalizar(null)).toBe('destino')
    expect(normalizar(undefined)).toBe('destino')
    expect(normalizar('mapa')).toBe('mapa')
  })

  it('indiceDe acompanha a ordem declarada', () => {
    ETAPAS.forEach((e, i) => {
      expect(indiceDe(e.id)).toBe(i)
    })
  })
})

describe('travas de avanço', () => {
  it('as três primeiras seguram quando estão vazias', () => {
    expect(podeAvancar('destino', vazio)).toBe(false)
    expect(podeAvancar('datas', vazio)).toBe(false)
    // Pessoas nasce com um adulto, então já está resolvida.
    expect(podeAvancar('pessoas', vazio)).toBe(true)
  })

  it('nenhuma etapa opcional trava, mesmo sem escolha nenhuma', () => {
    for (const e of ETAPAS.filter((x) => !x.obrigatoria)) {
      expect(podeAvancar(e.id, vazio)).toBe(true)
    }
  })

  it('com destino, datas e pessoas, tudo libera', () => {
    for (const e of ETAPAS) {
      expect(podeAvancar(e.id, basico)).toBe(true)
    }
  })
})

describe('etapas resolvidas', () => {
  it('datas só resolvem quando a volta é depois da ida', () => {
    const invertido = { ...basico, busca: { ...BUSCA_COMPLETA, volta: '2026-08-01' } }
    expect(resolvida('datas', invertido)).toBe(false)
    expect(resolvida('datas', basico)).toBe(true)
  })

  it('cada vertical resolve a sua etapa', () => {
    const casos: [IdEtapa, Oferta['vertical']][] = [
      ['hospedagem', 'hoteis'],
      ['passeios', 'passeios'],
      ['restaurantes', 'restaurantes'],
      ['eventos', 'eventos'],
      ['transporte', 'voos'],
    ]
    for (const [etapa, vertical] of casos) {
      expect(resolvida(etapa, basico)).toBe(false)
      expect(resolvida(etapa, { ...basico, escolhidos: [item(vertical)] })).toBe(true)
    }
  })

  it('transporte aceita voo OU carro', () => {
    expect(resolvida('transporte', { ...basico, escolhidos: [item('carros')] })).toBe(true)
  })

  it('mapa e resumo são leitura e nunca ficam pendentes', () => {
    expect(resolvida('mapa', vazio)).toBe(true)
    expect(resolvida('resumo', vazio)).toBe(true)
  })
})

describe('pendências e progresso', () => {
  it('lista só o que é obrigatório e falta', () => {
    const faltando = pendencias(vazio).map((e) => e.id)
    expect(faltando).toContain('destino')
    expect(faltando).toContain('datas')
    expect(faltando).not.toContain('hospedagem')
  })

  it('não sobra pendência quando o essencial está preenchido', () => {
    expect(pendencias(basico)).toEqual([])
  })

  it('o progresso ignora as etapas de leitura', () => {
    const p = progresso(vazio)
    // Nove etapas contáveis: as onze menos mapa e resumo.
    expect(p.total).toBe(ETAPAS.length - 2)
    expect(p.pct).toBeLessThan(100)
  })

  it('chega a 100% quando tudo foi decidido', () => {
    const tudo: EstadoPlano = {
      busca: BUSCA_COMPLETA,
      escolhidos: [
        item('hoteis'),
        item('passeios'),
        item('restaurantes'),
        item('eventos'),
        item('voos'),
      ],
    }
    const p = progresso(tudo)
    expect(p.feitas).toBe(p.total)
    expect(p.pct).toBe(100)
  })

  it('o progresso cresce a cada escolha e nunca regride sozinho', () => {
    const passos: EstadoPlano[] = [
      vazio,
      { ...vazio, busca: { ...BUSCA_VAZIA, destino: 'paraty' } },
      { busca: BUSCA_COMPLETA, escolhidos: [] },
      { busca: BUSCA_COMPLETA, escolhidos: [item('hoteis')] },
      { busca: BUSCA_COMPLETA, escolhidos: [item('hoteis'), item('passeios')] },
    ]
    for (let i = 1; i < passos.length; i += 1) {
      expect(progresso(passos[i]).feitas).toBeGreaterThanOrEqual(progresso(passos[i - 1]).feitas)
    }
  })
})
