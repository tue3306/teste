import { describe, expect, it } from 'vitest'
import { DESTINOS } from '@/data/rj'
import {
  FILTROS_VAZIOS,
  alternar,
  atende,
  contarFiltros,
  filtrar,
  ordenar,
  saidas,
  semFiltros,
} from './filtros'
import type { Categoria, Destino, RegiaoRJ } from '@/types'

/** Destino mínimo, só com o que o filtro olha. */
function d(id: string, regiao: RegiaoRJ, categorias: Categoria[]): Destino {
  return {
    id,
    nome: id,
    uf: 'RJ',
    regiao,
    latitude: 0,
    longitude: 0,
    foto: 'rio-de-janeiro',
    galeria: [],
    chamada: '',
    descricao: '',
    atracoes: [],
    praias: [],
    epoca: '',
    distanciaKm: 0,
    tempoViagem: '',
    nota: 8,
    faixaPreco: { min: 100, max: 200 },
    categorias,
    relacionados: [],
  }
}

const AMOSTRA: Destino[] = [
  d('praia-lagos', 'costa-do-sol', ['praia', 'gastronomia']),
  d('serra-fria', 'serrana', ['serra', 'romantico']),
  d('verde-mar', 'costa-verde', ['praia', 'natureza']),
  d('capital', 'metropolitana', ['praia', 'noite', 'historico']),
]

describe('atende — OU dentro do grupo, E entre grupos', () => {
  it('sem filtro nenhum, aceita todos', () => {
    for (const destino of AMOSTRA) {
      expect(atende(destino, FILTROS_VAZIOS)).toBe(true)
    }
  })

  it('duas regiões marcadas aceitam qualquer uma das duas', () => {
    const f = { regioes: ['costa-do-sol', 'serrana'] as RegiaoRJ[], perfis: [] }
    expect(filtrar(AMOSTRA, f).map((x) => x.id)).toEqual(['praia-lagos', 'serra-fria'])
  })

  it('dois perfis marcados AMPLIAM o resultado, não estreitam', () => {
    const so = filtrar(AMOSTRA, { regioes: [], perfis: ['serra'] })
    const dois = filtrar(AMOSTRA, { regioes: [], perfis: ['serra', 'noite'] })
    expect(dois.length).toBeGreaterThan(so.length)
  })

  it('região e perfil se cruzam com E', () => {
    const f = {
      regioes: ['costa-verde'] as RegiaoRJ[],
      perfis: ['praia'] as Categoria[],
    }
    expect(filtrar(AMOSTRA, f).map((x) => x.id)).toEqual(['verde-mar'])
  })

  it('três perfis com duas regiões devolvem a união correta', () => {
    const f = {
      regioes: ['metropolitana', 'costa-verde'] as RegiaoRJ[],
      perfis: ['natureza', 'noite', 'romantico'] as Categoria[],
    }
    // verde-mar entra por natureza; capital entra por noite. serra-fria é
    // romântico mas está fora das regiões escolhidas.
    expect(filtrar(AMOSTRA, f).map((x) => x.id).sort()).toEqual(['capital', 'verde-mar'])
  })

  it('combinação impossível devolve lista vazia sem lançar', () => {
    const f = {
      regioes: ['serrana'] as RegiaoRJ[],
      perfis: ['praia'] as Categoria[],
    }
    expect(filtrar(AMOSTRA, f)).toEqual([])
  })
})

describe('alternar', () => {
  it('liga, desliga e acumula sem mutar o objeto original', () => {
    const a = alternar(FILTROS_VAZIOS, 'perfis', 'praia')
    const b = alternar(a, 'perfis', 'serra')
    const c = alternar(b, 'perfis', 'praia')

    expect(FILTROS_VAZIOS.perfis).toEqual([])
    expect(a.perfis).toEqual(['praia'])
    expect(b.perfis).toEqual(['praia', 'serra'])
    expect(c.perfis).toEqual(['serra'])
  })

  it('grupos são independentes', () => {
    const f = alternar(alternar(FILTROS_VAZIOS, 'perfis', 'praia'), 'regioes', 'serrana')
    expect(f.perfis).toEqual(['praia'])
    expect(f.regioes).toEqual(['serrana'])
    expect(contarFiltros(f)).toBe(2)
    expect(semFiltros(f)).toBe(false)
  })
})

describe('saidas — o que soltar quando dá zero', () => {
  it('aponta o grupo que destrava mais resultados', () => {
    const f = {
      regioes: ['serrana'] as RegiaoRJ[],
      perfis: ['praia'] as Categoria[],
    }
    const opcoes = saidas(AMOSTRA, f)
    expect(opcoes.length).toBeGreaterThan(0)
    // Soltar o perfil deixa a serra aparecer; soltar a região deixa as praias.
    expect(opcoes[0].quantidade).toBeGreaterThan(0)
    // Vem ordenado do que mais destrava para o que menos destrava.
    for (let i = 1; i < opcoes.length; i += 1) {
      expect(opcoes[i - 1].quantidade).toBeGreaterThanOrEqual(opcoes[i].quantidade)
    }
  })

  it('não sugere nada quando não há filtro para soltar', () => {
    expect(saidas(AMOSTRA, FILTROS_VAZIOS)).toEqual([])
  })
})

describe('catálogo real', () => {
  it('nenhuma combinação de UMA região com UM perfil quebra a função', () => {
    const regioes: RegiaoRJ[] = [
      'metropolitana',
      'costa-do-sol',
      'costa-verde',
      'serrana',
      'norte-fluminense',
    ]
    const perfis: Categoria[] = [
      'praia', 'serra', 'natureza', 'historico', 'aventura', 'gastronomia',
      'noite', 'familia', 'romantico', 'fim-de-semana', 'economico', 'premium',
    ]

    for (const r of regioes) {
      for (const p of perfis) {
        const resultado = filtrar(DESTINOS, { regioes: [r], perfis: [p] })
        expect(Array.isArray(resultado)).toBe(true)
        // Quando dá zero, sempre existe uma saída sugerida — é o que impede a
        // tela de virar um beco sem saída.
        if (resultado.length === 0) {
          expect(saidas(DESTINOS, { regioes: [r], perfis: [p] }).length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('marcar todas as regiões equivale a não marcar nenhuma', () => {
    const todas: RegiaoRJ[] = [
      'metropolitana',
      'costa-do-sol',
      'costa-verde',
      'serrana',
      'norte-fluminense',
    ]
    expect(filtrar(DESTINOS, { regioes: todas, perfis: [] })).toHaveLength(DESTINOS.length)
  })

  it('marcar todos os perfis não esvazia a lista', () => {
    const perfis: Categoria[] = [
      'praia', 'serra', 'natureza', 'historico', 'aventura', 'gastronomia',
      'noite', 'familia', 'romantico', 'fim-de-semana', 'economico', 'premium',
    ]
    expect(filtrar(DESTINOS, { regioes: [], perfis }).length).toBe(DESTINOS.length)
  })
})

describe('ordenar', () => {
  const tamanho = () => 0

  it('não perde nem duplica destino', () => {
    for (const ordem of ['relevancia', 'nota', 'perto', 'barato', 'nome'] as const) {
      const saida = ordenar(DESTINOS, ordem, tamanho)
      expect(saida).toHaveLength(DESTINOS.length)
      expect(new Set(saida.map((x) => x.id)).size).toBe(DESTINOS.length)
    }
  })

  it('não muta a lista de entrada', () => {
    const antes = DESTINOS.map((x) => x.id)
    ordenar(DESTINOS, 'nome', tamanho)
    expect(DESTINOS.map((x) => x.id)).toEqual(antes)
  })

  it('ordena por distância crescente', () => {
    const saida = ordenar(DESTINOS, 'perto', tamanho)
    for (let i = 1; i < saida.length; i += 1) {
      expect(saida[i - 1].distanciaKm).toBeLessThanOrEqual(saida[i].distanciaKm)
    }
  })
})
