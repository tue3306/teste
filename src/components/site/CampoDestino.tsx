import { useCallback, useId, useState, type KeyboardEvent } from 'react'
import { useRecurso } from '@/hooks/useRecurso'
import { buscarEndereco } from '@/services/cep'
import { buscarLugares, type Lugar } from '@/services/lugares'
import css from './CampoDestino.module.css'

/** Oito dígitos, com ou sem pontuação — trata "22071-900" como CEP. */
const CEP = /^\d{5}-?\d{3}$/

/**
 * Resolve o termo: CEP vira cidade pelo ViaCEP, texto vira busca de lugar.
 *
 * Em viagem doméstica é comum ter o CEP do hotel em mãos e não saber o nome do
 * município — bairro e cidade nem sempre batem com o que o hóspede chama de
 * "onde vou ficar".
 */
async function resolver(termo: string, sinal: AbortSignal): Promise<Lugar[]> {
  if (!CEP.test(termo)) return buscarLugares(termo, sinal)

  const endereco = await buscarEndereco(termo, sinal)
  if (!endereco) return []

  // O ViaCEP não devolve coordenada; a cidade encontrada volta para a
  // geocodificação, que sabe onde ela fica.
  const lugares = await buscarLugares(endereco.cidade, sinal)
  return lugares.length > 0
    ? lugares
    : [
        {
          id: -1,
          nome: endereco.cidade,
          regiao: endereco.uf,
          latitude: 0,
          longitude: 0,
          rotulo: `${endereco.cidade}, ${endereco.uf}`,
        },
      ]
}

interface Props {
  valor: string
  aoMudar: (valor: string) => void
  aoEscolher?: (lugar: Lugar) => void
}

/**
 * Campo de destino com sugestão de cidades brasileiras.
 *
 * Consulta a geocodificação do Open-Meteo com 280 ms de espera entre teclas — o
 * suficiente para não disparar uma requisição por caractere sem que a lista
 * pareça lenta. `useRecurso` cancela a busca anterior a cada troca, então a
 * resposta de um termo antigo nunca sobrescreve a do termo atual.
 *
 * A marcação segue o padrão combobox do ARIA. A lista usa `<div>` em vez de
 * `<ul>` de propósito: `role="listbox"` sobre `<ul>` sobrepõe a semântica
 * nativa de lista, e o leitor de tela passa a anunciar duas coisas conflitantes
 * para o mesmo elemento.
 */
export function CampoDestino({ valor, aoMudar, aoEscolher }: Props) {
  const [aberto, setAberto] = useState(false)
  const [indiceAtivo, setIndiceAtivo] = useState(-1)
  /** Último rótulo aceito — evita reconsultar o que o usuário já escolheu. */
  const [aceito, setAceito] = useState<string | null>(null)
  const id = useId()

  const termo = valor.trim()
  const consultar = aberto && termo.length >= 3 && termo !== aceito

  const buscar = useCallback((sinal: AbortSignal) => resolver(termo, sinal), [termo])
  const estado = useRecurso(buscar, { ativo: consultar, debounce: 280 })

  const opcoes = estado.dados ?? []
  const mostrarLista = aberto && termo.length >= 3

  function escolher(lugar: Lugar) {
    setAceito(lugar.rotulo)
    aoMudar(lugar.rotulo)
    aoEscolher?.(lugar)
    setAberto(false)
    setIndiceAtivo(-1)
  }

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setAberto(false)
      setIndiceAtivo(-1)
      return
    }
    if (!mostrarLista || opcoes.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndiceAtivo((i) => (i + 1) % opcoes.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceAtivo((i) => (i <= 0 ? opcoes.length - 1 : i - 1))
    } else if (e.key === 'Enter' && indiceAtivo >= 0) {
      const lugar = opcoes[indiceAtivo]
      if (lugar) {
        // Impede o submit do formulário: Enter aqui significa "aceitar a
        // sugestão", não "buscar agora".
        e.preventDefault()
        escolher(lugar)
      }
    }
  }

  return (
    <div className={css['campo']}>
      <label className={css['rotulo']} htmlFor={id}>
        Destino
      </label>
      <input
        id={id}
        className={css['entrada']}
        value={valor}
        onChange={(e) => {
          aoMudar(e.target.value)
          setAberto(true)
          setIndiceAtivo(-1)
        }}
        onFocus={() => {
          setAberto(true)
        }}
        onBlur={() => {
          // Espera o clique na opção acontecer antes de fechar.
          setTimeout(() => {
            setAberto(false)
          }, 120)
        }}
        onKeyDown={aoTeclar}
        role="combobox"
        aria-expanded={mostrarLista}
        aria-controls={`${id}-lista`}
        aria-autocomplete="list"
        aria-activedescendant={indiceAtivo >= 0 ? `${id}-op-${String(indiceAtivo)}` : undefined}
        autoComplete="off"
      />

      {mostrarLista ? (
        <div className={css['lista']} id={`${id}-lista`} role="listbox" aria-label="Cidades sugeridas">
          {estado.status === 'carregando' && opcoes.length === 0 ? (
            <p className={css['estado']}>Procurando cidades…</p>
          ) : null}

          {estado.status === 'erro' && opcoes.length === 0 ? (
            <p className={css['estado']}>Busca indisponível agora — escreva o destino livremente.</p>
          ) : null}

          {estado.status === 'pronto' && opcoes.length === 0 ? (
            <p className={css['estado']}>
              {CEP.test(termo)
                ? 'CEP não encontrado.'
                : 'Nenhuma cidade brasileira com esse nome.'}
            </p>
          ) : null}

          {opcoes.map((lugar, i) => (
            <div
              key={lugar.id}
              id={`${id}-op-${String(i)}`}
              role="option"
              // No padrão com `aria-activedescendant` o foco real fica no
              // input, mas cada opção precisa ser focável para o leitor de tela
              // conseguir apontar para ela.
              tabIndex={-1}
              aria-selected={i === indiceAtivo}
              className={`${css['opcao']} ${i === indiceAtivo ? css['opcaoAtiva'] : ''}`}
              onMouseDown={(e) => {
                // `mousedown` em vez de `click`: o blur do input dispararia
                // antes do clique e fecharia a lista debaixo do ponteiro.
                e.preventDefault()
                escolher(lugar)
              }}
              onMouseEnter={() => {
                setIndiceAtivo(i)
              }}
            >
              <span className={css['nome']}>{lugar.nome}</span>
              {lugar.regiao ? <span className={css['regiao']}>{lugar.regiao}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
