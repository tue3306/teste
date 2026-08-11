import { Reveal } from '@/components/ui/Reveal'
import { Icone } from '@/components/ui/Icone'
import { WHATSAPP_COMUNIDADE, comunidadeAtiva } from '@/config/negocio'
import { DESTINOS } from '@/data/rj'
import css from './Comunidade.module.css'

const VANTAGENS = [
  'Alertas de queda de preço nos destinos que você segue',
  'Dicas de quem acabou de voltar — praia cheia, estrada em obra, restaurante fechado',
  'Caronas e divisão de hospedagem entre quem viaja nas mesmas datas',
  'Avisos de evento e alta temporada antes de o preço subir',
]

/**
 * Convite para a comunidade.
 *
 * O link do WhatsApp fica em `config/negocio.ts` e **está vazio** — inventar um
 * convite mandaria gente para um grupo de estranhos. Enquanto não houver link
 * real, a seção mostra o estado de espera em vez de um botão que não leva a
 * lugar nenhum, e o texto diz isso com todas as letras.
 */
export function Comunidade() {
  const ativa = comunidadeAtiva()

  return (
    <section id="comunidade" className="shell secao" aria-labelledby="comunidade-titulo">
      <Reveal className={css['painel']}>
        <div className={css['texto']}>
          <p className="eyebrow">comunidade</p>
          <h2 id="comunidade-titulo" className={css['titulo']}>
            Quem já foi sabe
            <br />
            <span className="serif">o que o site não conta.</span>
          </h2>
          <p className={css['lead']}>
            Um grupo de quem viaja pelo estado do Rio. {DESTINOS.length} destinos, gente indo e
            voltando o ano inteiro.
          </p>

          <ul className={css['vantagens']}>
            {VANTAGENS.map((v) => (
              <li key={v} className={css['vantagem']}>
                <span className={css['marcador']} aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>

          {ativa ? (
            <a
              className={css['botao']}
              href={WHATSAPP_COMUNIDADE}
              target="_blank"
              rel="noopener noreferrer"
            >
              Entrar no grupo do WhatsApp
              <Icone nome="setaDireita" tamanho={16} />
            </a>
          ) : (
            <div className={css['espera']}>
              <p className={css['esperaTitulo']}>O grupo abre em breve</p>
              <p className={css['esperaTexto']}>
                O convite ainda não foi criado. Quando existir, ele entra em um lugar só do
                código e este botão passa a funcionar — sem link provisório e sem convite
                inventado no meio do caminho.
              </p>
            </div>
          )}
        </div>

        <div className={css['selo']} aria-hidden="true">
          <span className={css['seloNumero']}>{DESTINOS.length}</span>
          <span className={css['seloTexto']}>destinos do RJ</span>
        </div>
      </Reveal>
    </section>
  )
}
