import { FOTOS } from '@/data/fotos'
import css from './Creditos.module.css'

/** Fotos ordenadas por slug, para a lista sair estável entre builds. */
const CREDITOS = Object.values(FOTOS).sort((a, b) => a.slug.localeCompare(b.slug))

/**
 * Créditos de imagem.
 *
 * As fotos vêm do Wikimedia Commons sob licença livre, e licença livre não
 * quer dizer sem obrigação: quase todas exigem atribuição ao autor e menção à
 * licença. A lista é gerada a partir do mesmo arquivo que alimenta as imagens,
 * então uma foto nova não tem como entrar no site sem entrar aqui.
 *
 * Fica dentro de um `<details>` porque são 27 linhas que ninguém precisa ler
 * sempre — mas que precisam estar presentes, acessíveis e verificáveis.
 */
export function Creditos() {
  return (
    <details className={css['bloco']}>
      <summary className={css['resumo']}>Créditos de imagem e fontes de dados</summary>

      <p className={css['texto']}>
        As fotos de destinos e pontos turísticos vêm do{' '}
        <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer noopener">
          Wikimedia Commons
        </a>
        , sob licenças livres, e são servidas a partir deste domínio após otimização. Previsão do
        tempo por{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer noopener">
          Open-Meteo
        </a>
        , busca de cidades pela geocodificação do Open-Meteo e consulta de CEP pelo{' '}
        <a href="https://viacep.com.br/" target="_blank" rel="noreferrer noopener">
          ViaCEP
        </a>
        . Preços, disponibilidade e avaliações são dados de demonstração.
      </p>

      <ul className={css['lista']}>
        {CREDITOS.map((f) => (
          <li key={f.slug} className={css['item']}>
            <a href={f.arquivo} target="_blank" rel="noreferrer noopener">
              {f.alt}
            </a>{' '}
            — {f.autor} ({f.licenca})
          </li>
        ))}
      </ul>
    </details>
  )
}
