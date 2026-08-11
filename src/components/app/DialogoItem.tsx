import { Dialogo } from '@/components/ui/Dialogo'
import { Imagem } from '@/components/ui/Imagem'
import { Icone } from '@/components/ui/Icone'
import { useViagem } from '@/context/ViagemContext'
import { economia, inteiro, moeda, nota } from '@/lib/format'
import { explicarMultiplicador, subtotal } from '@/lib/orcamento'
import type { Oferta } from '@/types'
import css from './DialogoItem.module.css'

interface Props {
  item: Oferta | null
  aoFechar: () => void
}

/** Data ISO em "14 de novembro de 2026". */
function dataLonga(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Detalhe de um item do catálogo.
 *
 * O usuário precisa saber exatamente o que está escolhendo — não "hotel em
 * Búzios, R$ 620", mas qual hotel, em que bairro, com o quê incluso, a que
 * distância do centro. Cada vertical mostra os campos que tem; os que não se
 * aplicam simplesmente não aparecem, em vez de virarem "—".
 */
export function DialogoItem({ item, aoFechar }: Props) {
  const { adicionar, remover, quantidade, contexto } = useViagem()

  if (!item) return null

  const qtd = quantidade(item.id)
  const total = contexto.noites > 0 ? subtotal(item, contexto) : null

  /** Os campos específicos da vertical, já filtrados pelo que existe. */
  const detalhes: { rotulo: string; valor: string }[] = []

  if (item.companhia) detalhes.push({ rotulo: 'Companhia', valor: item.companhia })
  if (item.origem && item.chegadaIata) {
    detalhes.push({ rotulo: 'Trecho', valor: `${item.origem} → ${item.chegadaIata}` })
  }
  if (item.partida && item.chegada) {
    detalhes.push({ rotulo: 'Horário', valor: `${item.partida} → ${item.chegada}` })
  }
  if (item.duracao) detalhes.push({ rotulo: 'Duração', valor: item.duracao })
  if (item.escalas !== undefined) {
    detalhes.push({
      rotulo: 'Escalas',
      valor: item.escalas === 0 ? 'voo direto' : `${String(item.escalas)}`,
    })
  }
  if (item.bagagem) detalhes.push({ rotulo: 'Bagagem', valor: item.bagagem })

  if (item.estrelas) detalhes.push({ rotulo: 'Categoria', valor: `${String(item.estrelas)} estrelas` })
  if (item.bairro) detalhes.push({ rotulo: 'Localização', valor: item.bairro })
  if (item.distanciaCentroKm !== undefined) {
    detalhes.push({
      rotulo: 'Do centro',
      valor: `${item.distanciaCentroKm.toString().replace('.', ',')} km`,
    })
  }

  if (item.duracaoHoras) {
    detalhes.push({
      rotulo: 'Duração',
      valor: `${item.duracaoHoras.toString().replace('.', ',')} h`,
    })
  }
  if (item.saida) detalhes.push({ rotulo: 'Saída', valor: item.saida })

  if (item.cozinha) detalhes.push({ rotulo: 'Cozinha', valor: item.cozinha })

  if (item.data) detalhes.push({ rotulo: 'Data', valor: dataLonga(item.data) })
  if (item.local) detalhes.push({ rotulo: 'Local', valor: item.local })

  if (item.locadora) detalhes.push({ rotulo: 'Locadora', valor: item.locadora })
  if (item.cambio) detalhes.push({ rotulo: 'Câmbio', valor: item.cambio })
  if (item.lugares) detalhes.push({ rotulo: 'Lugares', valor: String(item.lugares) })

  const listas = [
    { titulo: 'Comodidades', itens: item.comodidades },
    { titulo: 'Incluso no preço', itens: item.inclui },
  ].filter((l) => l.itens && l.itens.length > 0)

  return (
    <Dialogo aberto aoFechar={aoFechar} titulo={item.titulo} descricao={item.sub}>
      <div className={css['corpo']}>
        <Imagem slug={item.foto} className={css['foto']} sizes="(min-width: 620px) 520px, 92vw" />

        <div className={css['topo']}>
          <span className={css['selo']}>{item.tag}</span>
          <span className={css['nota']}>
            <Icone nome="estrela" tamanho={12} />
            {nota(item.nota)}
            {item.avaliacoes ? (
              <span className={css['avaliacoes']}>· {inteiro(item.avaliacoes)} avaliações</span>
            ) : null}
          </span>
        </div>

        {detalhes.length > 0 ? (
          <dl className={css['detalhes']}>
            {detalhes.map((d) => (
              <div key={d.rotulo}>
                <dt>{d.rotulo}</dt>
                <dd>{d.valor}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {listas.map((l) => (
          <div key={l.titulo}>
            <p className={css['listaTitulo']}>{l.titulo}</p>
            <ul className={css['lista']}>
              {l.itens?.map((x) => (
                <li key={x} className={css['listaItem']}>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={css['precos']}>
          <p className={css['linha']}>
            <span>Preço médio de mercado</span>
            <span className={css['riscado']}>{moeda(item.outros)}</span>
          </p>
          <p className={css['linha']}>
            <span>Preço BI&amp;B</span>
            <span className={css['forte']}>{moeda(item.preco)}</span>
          </p>
          <p className={css['linha']}>
            <span>Sua economia</span>
            <span className={css['economia']}>{economia(item.preco, item.outros)}</span>
          </p>

          {/* A conta que faz a diferença: a etiqueta unitária virando o valor
              que realmente entra no orçamento desta viagem. */}
          {total !== null ? (
            <p className={`${css['linha']} ${css['linhaTotal']}`}>
              <span>
                Na sua viagem
                <span className={css['explicacao']}>
                  {explicarMultiplicador(item.unidade, contexto)}
                </span>
              </span>
              <span>{moeda(total)}</span>
            </p>
          ) : (
            <p className={css['semDatas']}>
              Escolha as datas da viagem para ver quanto este item soma no total.
            </p>
          )}
        </div>

        {qtd > 0 ? (
          <div className={css['acoes']}>
            <button
              type="button"
              className={css['secundario']}
              onClick={() => {
                remover(item.id)
              }}
            >
              Tirar uma unidade
            </button>
            <button
              type="button"
              className={css['principal']}
              onClick={() => {
                adicionar(item)
              }}
            >
              Somar outra ({qtd} na viagem)
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`${css['principal']} ${css['bloco']}`}
            onClick={() => {
              adicionar(item)
            }}
          >
            Adicionar à minha viagem
          </button>
        )}

        <p className={css['aviso']}>
          Dados de demonstração. Nenhuma reserva é efetivada e nenhum dado de pagamento é pedido.
        </p>
      </div>
    </Dialogo>
  )
}
