import { useMemo } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Imagem } from '@/components/ui/Imagem'
import { hospedagemService } from '@/services/catalogo'
import { useViagem } from '@/context/ViagemContext'
import { moeda } from '@/lib/format'
import css from './Comparador.module.css'

/**
 * Quanto cada canal cobra a mais que a BI&B, em porcentagem.
 *
 * Estes multiplicadores são a única coisa inventada aqui — representam a
 * margem típica de cada tipo de canal. O preço base e o número de noites vêm do
 * catálogo e do estado real da viagem, então a tabela acompanha o destino que o
 * usuário escolheu no formulário logo acima. Antes eram cinco valores fixos que
 * falavam de um hotel em Ipanema mesmo quando o destino era Paraty.
 */
const CANAIS = [
  { fonte: 'BI&B', acrescimo: 0, nota: 'sem taxa de serviço · cancela grátis', destaque: true },
  { fonte: 'Agência A', acrescimo: 0.1, nota: 'taxa de serviço no checkout', destaque: false },
  { fonte: 'Buscador B', acrescimo: 0.14, nota: 'cancelamento pago', destaque: false },
  { fonte: 'Portal C', acrescimo: 0.2, nota: 'café não incluído', destaque: false },
  { fonte: 'Balcão do hotel', acrescimo: 0.26, nota: 'tarifa cheia', destaque: false },
]

/**
 * Comparação da mesma hospedagem em cinco canais.
 *
 * É uma `<table>` de verdade, com cabeçalho e legenda: são dados tabulares, e
 * só a tabela dá ao leitor de tela a associação entre "R$ 7.010" e "Buscador
 * B". O protótipo montava a grade com `<div>`, então cada linha era lida como
 * uma sequência solta de números.
 *
 * A barra é decorativa — o valor que ela representa já está na coluna de preço.
 */
export function Comparador() {
  const { destino, contexto } = useViagem()

  /** A hospedagem mais bem avaliada do destino em foco. */
  const hotel = useMemo(() => {
    const lista = hospedagemService.listar({ destino: destino.id })
    return [...lista].sort((a, b) => b.nota - a.nota)[0]
  }, [destino.id])

  // Sem noites definidas a comparação seria de uma diária só, o que não mostra
  // o efeito que importa: a diferença cresce com a estadia.
  const noites = contexto.noites > 0 ? contexto.noites : 5
  const quartos = contexto.quartos

  if (!hotel) return null

  const base = hotel.preco * noites * quartos
  const linhas = CANAIS.map((c) => ({ ...c, valor: Math.round(base * (1 + c.acrescimo)) }))
  const maior = Math.max(...linhas.map((l) => l.valor))
  const economia = maior - base

  return (
    <section id="comparar" className="shell secao" aria-labelledby="comparar-titulo">
      <Reveal className={css['topo']}>
        <div style={{ maxWidth: 620 }}>
          <p className="eyebrow">02 — comparador</p>
          <h2 id="comparar-titulo" className="titulo">
            A mesma diária,
            <br />
            <span className="serif">cinco preços diferentes.</span>
          </h2>
        </div>
        <p className="lead" style={{ maxWidth: 360, fontSize: '1rem' }}>
          Mostramos taxa de serviço, política de cancelamento e o que está realmente incluído. Nada
          de preço que cresce no checkout.
        </p>
      </Reveal>

      <Reveal atraso={0.1} className={css['painel']}>
        <div className={css['cabecalho']}>
          <div className={css['identificacao']}>
            <Imagem slug={hotel.foto} className={css['miniatura']} sizes="56px" />
            <div>
              <p className={css['quarto']}>
                {hotel.titulo} · {destino.nome}
              </p>
              <p className={css['estadia']}>
                {noites} {noites === 1 ? 'noite' : 'noites'} ·{' '}
                {quartos === 1 ? '1 quarto' : `${String(quartos)} quartos`} ·{' '}
                {moeda(hotel.preco)}/noite
              </p>
            </div>
          </div>
          <p className={css['aviso']}>preço final, com taxas</p>
        </div>

        <table className={css['tabela']}>
          <caption className="sr-only">
            Preço final de {noites} noites em {hotel.titulo} em cinco canais de venda, do mais
            barato ao mais caro.
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Canal</th>
              <th scope="col">Proporção do preço</th>
              <th scope="col">Condição</th>
              <th scope="col">Preço final</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.fonte} className={css['linha']}>
                <th
                  scope="row"
                  className={`${css['celula']} ${css['fonte']} ${l.destaque ? css['fonteDestaque'] : ''}`}
                >
                  {l.fonte}
                </th>
                <td className={`${css['celula']} ${css['barraCelula']}`}>
                  <div className={css['barra']} aria-hidden="true">
                    <div
                      className={`${css['preenchimento']} ${l.destaque ? css['preenchimentoDestaque'] : ''}`}
                      style={{ width: `${String((l.valor / maior) * 100)}%` }}
                    />
                  </div>
                </td>
                <td className={`${css['celula']} ${css['condicao']}`}>{l.nota}</td>
                <td
                  className={`${css['celula']} ${css['preco']} ${l.destaque ? css['precoDestaque'] : ''}`}
                >
                  {moeda(l.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={css['rodape']}>
          <p className={css['rodapeTexto']}>Sua economia com a BI&amp;B nesta reserva</p>
          <p className={css['rodapeValor']}>{moeda(economia)}</p>
        </div>
      </Reveal>
    </section>
  )
}
