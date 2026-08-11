import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CHAVES,
  consentimento,
  definirConsentimento,
  gravar,
  inventario,
  ler,
  limparTudo,
  podeGuardar,
  remover,
} from './armazenamento'

/**
 * `localStorage` de mentira.
 *
 * O ambiente de teste é Node, que não tem `window`. Um objeto simples com a
 * mesma superfície basta: o que está sob teste é a política — prefixo, versão,
 * consentimento, tolerância a falha — e não a implementação do navegador.
 */
function montarArmazenamento() {
  const dados = new Map<string, string>()
  const falso = {
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => {
      dados.set(k, v)
    },
    removeItem: (k: string) => {
      dados.delete(k)
    },
    get length() {
      return dados.size
    },
    key: (i: number) => [...dados.keys()][i] ?? null,
  }
  // `Object.keys(localStorage)` é o que `inventario()` usa; num Map isso exige
  // as chaves como propriedades reais do objeto.
  return new Proxy(falso, {
    ownKeys: () => [...dados.keys()],
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
  }) as unknown as Storage
}

beforeEach(() => {
  vi.stubGlobal('window', { localStorage: montarArmazenamento() })
})

describe('leitura e escrita', () => {
  it('grava e lê de volta com o mesmo formato', () => {
    gravar(CHAVES.favoritos, ['buzios', 'paraty'])
    expect(ler<string[]>(CHAVES.favoritos, [])).toEqual(['buzios', 'paraty'])
  })

  it('devolve o padrão quando a chave não existe', () => {
    expect(ler(CHAVES.viagem, { vazio: true })).toEqual({ vazio: true })
  })

  it('devolve o padrão em vez de lançar quando o JSON está corrompido', () => {
    window.localStorage.setItem('bib:v2:favoritos', '{isto não é json')
    expect(ler<string[]>(CHAVES.favoritos, [])).toEqual([])
  })

  it('remover apaga só a chave pedida', () => {
    gravar(CHAVES.favoritos, ['a'])
    gravar(CHAVES.checklist, ['doc'])
    remover(CHAVES.favoritos)
    expect(ler<string[]>(CHAVES.favoritos, [])).toEqual([])
    expect(ler<string[]>(CHAVES.checklist, [])).toEqual(['doc'])
  })

  it('toda chave carrega prefixo e versão', () => {
    gravar(CHAVES.pessoas, { adultos: 2 })
    const chaves = inventario().map((x) => x.chave)
    expect(chaves).toContain('bib:v2:pessoas')
    for (const c of chaves) expect(c.startsWith('bib:')).toBe(true)
  })
})

describe('consentimento', () => {
  it('começa sem decisão tomada', () => {
    expect(consentimento()).toBeNull()
    // Sem decisão, guardar é permitido: só a recusa explícita bloqueia.
    expect(podeGuardar()).toBe(true)
  })

  it('recusar bloqueia gravações novas', () => {
    definirConsentimento(false)
    expect(podeGuardar()).toBe(false)
    gravar(CHAVES.favoritos, ['buzios'])
    expect(ler<string[]>(CHAVES.favoritos, [])).toEqual([])
  })

  it('recusar apaga o que já existia', () => {
    gravar(CHAVES.favoritos, ['buzios'])
    gravar(CHAVES.checklist, ['doc'])
    definirConsentimento(false)
    // Só o próprio registro de consentimento sobrevive.
    expect(inventario().map((x) => x.chave)).toEqual(['bib:consentimento'])
  })

  it('aceitar volta a permitir', () => {
    definirConsentimento(false)
    definirConsentimento(true)
    expect(consentimento()).toBe('aceito')
    gravar(CHAVES.favoritos, ['paraty'])
    expect(ler<string[]>(CHAVES.favoritos, [])).toEqual(['paraty'])
  })

  it('o consentimento fica fora da versão e sobrevive à troca de formato', () => {
    definirConsentimento(true)
    expect(inventario().map((x) => x.chave)).toContain('bib:consentimento')
  })
})

describe('limpeza', () => {
  it('limparTudo remove tudo o que é do BI&B', () => {
    gravar(CHAVES.favoritos, ['a'])
    gravar(CHAVES.viagem, { x: 1 })
    limparTudo()
    expect(inventario()).toEqual([])
  })

  it('não toca em chave de outro site no mesmo domínio', () => {
    window.localStorage.setItem('outro-app:sessao', 'x')
    gravar(CHAVES.favoritos, ['a'])
    limparTudo()
    expect(window.localStorage.getItem('outro-app:sessao')).toBe('x')
  })
})

describe('armazenamento indisponível', () => {
  it('não lança quando o navegador bloqueia — modo privado, cota cheia', () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new Error('acesso negado')
      },
    })

    expect(() => {
      gravar(CHAVES.favoritos, ['a'])
    }).not.toThrow()
    expect(ler<string[]>(CHAVES.favoritos, ['padrao'])).toEqual(['padrao'])
    expect(podeGuardar()).toBe(false)
    expect(inventario()).toEqual([])
    expect(() => {
      limparTudo()
    }).not.toThrow()
  })
})

describe('favoritos — ciclo completo', () => {
  it('adiciona, remove e sobrevive a uma "recarga"', () => {
    const chave = CHAVES.favoritos

    gravar(chave, ['buzios'])
    gravar(chave, [...ler<string[]>(chave, []), 'paraty'])
    expect(ler<string[]>(chave, [])).toEqual(['buzios', 'paraty'])

    gravar(chave, ler<string[]>(chave, []).filter((f) => f !== 'buzios'))
    expect(ler<string[]>(chave, [])).toEqual(['paraty'])

    // "Recarregar" é só ler de novo: o armazenamento é a fonte da verdade.
    expect(ler<string[]>(chave, [])).toEqual(['paraty'])
  })
})
