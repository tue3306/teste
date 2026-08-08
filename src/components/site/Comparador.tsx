import { Reveal } from '@/components/ui/Reveal'
import { COMPARADOR } from '@/data/site'
import css from './Comparador.module.css'

/**
 * Comparação do mesmo quarto em sete canais.
 *
 * É uma `<table>` de verdade, com cabeçalho e legenda: são dados tabulares, e
 * só a tabela dá ao leitor de tela a associação entre "R$ 7.010" e "Buscador
 * B". O protótipo montava a grade com `<div>`, então cada linha era lida como
 * uma sequência solta de números.
 *
 * A barra é decorativa — o valor que ela representa já está na coluna de preço.
 */
export function Comparador() {
  return (
    <section id="comparar" className="shell secao" aria-labelledby="comparar-titulo">
      <Reveal className={css['topo']}>
        <div style={{ maxWidth: 620 }}>
          <p className="eyebrow">02 — comparador</p>
          <h2 id="comparar-titulo" className="titulo">
            O mesmo quarto,
            <br />
            <span className="serif">sete preços diferentes.</span>
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
            <span className={css['miniatura']} aria-hidden="true" />
            <div>
              <p className={css['quarto']}>Ipanema Arpoador Suítes · quarto duplo vista mar</p>
              <p className={css['estadia']}>7 noites · 12–19 set · 2 adultos</p>
            </div>
          </div>
          <p className={css['aviso']}>preço final, com taxas</p>
        </div>

        <table className={css['tabela']}>
          <caption className="sr-only">
            Preço final de 7 noites no Ipanema Arpoador Suítes em cinco canais de venda, do mais
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
            {COMPARADOR.map((l) => (
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
                      style={{ width: l.largura }}
                    />
                  </div>
                </td>
                <td className={`${css['celula']} ${css['condicao']}`}>{l.nota}</td>
                <td
                  className={`${css['celula']} ${css['preco']} ${l.destaque ? css['precoDestaque'] : ''}`}
                >
                  {l.preco}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={css['rodape']}>
          <p className={css['rodapeTexto']}>Sua economia com a BI&amp;B nesta reserva</p>
          <p className={css['rodapeValor']}>R$ 1.036</p>
        </div>
      </Reveal>
    </section>
  )
}
