import type { SVGProps } from 'react'

/**
 * Ícones da BI&B.
 *
 * Desenhados no mesmo grid de 24×24, com traço de 1,6 e pontas arredondadas —
 * é essa disciplina que faz sete ícones parecerem uma família e não sete
 * desenhos avulsos. Todos herdam a cor via `currentColor`, então o estado do
 * componente pai comanda a cor sem prop extra.
 *
 * São inline de propósito: nenhuma requisição, nenhum flash de ícone faltando,
 * e o traço acompanha a tipografia em qualquer zoom.
 */

export type NomeIcone =
  | 'praia'
  | 'natureza'
  | 'gastronomia'
  | 'cultura'
  | 'noite'
  | 'familia'
  | 'luxo'
  | 'serra'
  | 'aventura'
  | 'romantico'
  | 'aviao'
  | 'hotel'
  | 'carro'
  | 'evento'
  | 'estrela'
  | 'setaCima'
  | 'setaBaixo'
  | 'setaDireita'
  | 'fechar'

const TRACOS: Record<NomeIcone, React.ReactNode> = {
  /* Cordilheira com neve no cume. */
  serra: (
    <>
      <path d="M1.6 19.6h20.8" />
      <path d="m3 19.6 5.6-10.4 3 5.2" />
      <path d="m9.4 19.6 5.6-12 6 12" />
      <path d="m12.8 11.4 2.2 1.4 2.2-1.4" />
    </>
  ),

  /* Mosquetão de escalada — o objeto que diz "aventura" sem virar ilustração. */
  aventura: (
    <>
      <path d="M8.6 3.4a5.4 5.4 0 0 0 0 10.8h1.2" />
      <path d="M8.6 3.4h2.2a5.4 5.4 0 0 1 0 10.8" />
      <path d="M10.8 14.2v6.4" />
      <path d="M7.6 17.4h6.4" />
    </>
  ),

  /* Duas taças brindando. */
  romantico: (
    <>
      <path d="M4.4 3.2h5.2l-1 5.2a1.7 1.7 0 0 1-3.2 0Z" />
      <path d="M14.4 3.2h5.2l-1 5.2a1.7 1.7 0 0 1-3.2 0Z" />
      <path d="M7 10v10.4M17 10v10.4" />
      <path d="M4.4 20.8h5.2M14.4 20.8h5.2" />
    </>
  ),

  /* Avião em rota ascendente. */
  aviao: (
    <>
      <path d="M2.6 13.4 21 4.2l-4.4 8.4-2.2 8.6-2.6-5.8-6.2-1.4Z" />
      <path d="m11.8 15.4 4.8-3.2" />
    </>
  ),

  /* Cama de hotel. */
  hotel: (
    <>
      <path d="M2.6 19.4V7.6M21.4 19.4v-6.6H2.6" />
      <path d="M2.6 16.6h18.8" />
      <path d="M6.6 12.8v-2.4a1.6 1.6 0 0 1 1.6-1.6h3a1.6 1.6 0 0 1 1.6 1.6v2.4" />
    </>
  ),

  /* Carro de perfil. */
  carro: (
    <>
      <path d="M3.2 15.6h17.6v-3l-1.8-.6-2-4a1.6 1.6 0 0 0-1.4-.9H8.4a1.6 1.6 0 0 0-1.4.9l-2 4-1.8.6Z" />
      <circle cx="7.2" cy="17.8" r="1.8" />
      <circle cx="16.8" cy="17.8" r="1.8" />
    </>
  ),

  /* Calendário com um dia marcado. */
  evento: (
    <>
      <rect x="3.2" y="4.8" width="17.6" height="16" rx="2.2" />
      <path d="M3.2 9.6h17.6M8 2.6v4.4M16 2.6v4.4" />
      <path d="M8.4 14.2h3v3h-3z" />
    </>
  ),

  /* Sol sobre o mar. */
  praia: (
    <>
      <circle cx="12" cy="7.6" r="3.4" />
      <path d="M12 1.4v1.8M12 12v1.8M6.2 7.6H4.4M19.6 7.6h-1.8M7.9 3.5 6.6 2.2M17.4 13 16.1 11.7M7.9 11.7 6.6 13M17.4 2.2 16.1 3.5" />
      <path d="M2.4 17.6c1.6 0 1.6 1.5 3.2 1.5s1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5 1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5" />
      <path d="M2.4 21.2c1.6 0 1.6 1.5 3.2 1.5s1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5 1.6-1.5 3.2-1.5 1.6 1.5 3.2 1.5" />
    </>
  ),

  /* Serra com sol nascendo atrás. */
  natureza: (
    <>
      <circle cx="17.6" cy="5.6" r="2.1" />
      <path d="M2.2 19.4h19.6" />
      <path d="m3.4 19.4 6.2-11 3.8 6.6 2.4-3.4 5 7.8" />
    </>
  ),

  /* Garfo e faca. */
  gastronomia: (
    <>
      <path d="M6.6 21.4V10.6" />
      <path d="M4 2.6v5a2.6 2.6 0 0 0 5.2 0v-5" />
      <path d="M6.6 2.6v5" />
      <path d="M17.4 21.4v-8.2" />
      <path d="M17.4 13.2c1.8 0 3.2-1.4 3.2-3.2V2.6c-3.5 0-6.4 2.9-6.4 6.4 0 2.3 1.4 4.2 3.2 4.2z" />
    </>
  ),

  /* Fachada neoclássica de museu. */
  cultura: (
    <>
      <path d="M2.8 9.4 12 3.4l9.2 6" />
      <path d="M5.4 9.8v9M9.8 9.8v9M14.2 9.8v9M18.6 9.8v9" />
      <path d="M2.4 18.8h19.2" />
      <path d="M2.4 21.4h19.2" />
    </>
  ),

  /* Lua e estrela. */
  noite: (
    <>
      <path d="M20.4 14.8A8.6 8.6 0 0 1 9.2 3.6a8.6 8.6 0 1 0 11.2 11.2z" />
      <path d="m17.2 2.6.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" />
    </>
  ),

  /* Adulto e criança. */
  familia: (
    <>
      <circle cx="8" cy="5.8" r="2.6" />
      <path d="M3.4 21.4v-3.6A4.6 4.6 0 0 1 8 13.2a4.6 4.6 0 0 1 4.6 4.6v3.6" />
      <circle cx="17.4" cy="9.4" r="2.1" />
      <path d="M13.8 21.4v-2.8a3.6 3.6 0 0 1 3.6-3.6 3.6 3.6 0 0 1 3.6 3.6v2.8" />
    </>
  ),

  /* Diamante lapidado. */
  luxo: (
    <>
      <path d="M6.2 2.8h11.6l3.8 5.8L12 21.2 2.4 8.6z" />
      <path d="M2.4 8.6h19.2" />
      <path d="m8.8 8.6 3.2 12.6 3.2-12.6" />
      <path d="M6.2 2.8 8.8 8.6M17.8 2.8 15.2 8.6" />
    </>
  ),

  /* Estrela cheia, para nota. */
  estrela: (
    <path
      d="m12 2.4 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"
      fill="currentColor"
      stroke="none"
    />
  ),

  setaCima: <path d="M12 19.5V4.5M5.5 11 12 4.5 18.5 11" />,
  setaBaixo: <path d="M12 4.5v15M18.5 13 12 19.5 5.5 13" />,
  setaDireita: <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />,
  fechar: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
}

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  nome: NomeIcone
  /** Lado do ícone em pixels. Padrão 24. */
  tamanho?: number
  /**
   * Nome acessível. Sem ele o ícone é tratado como decoração — que é o certo
   * quando há texto ao lado dizendo a mesma coisa.
   */
  rotulo?: string
}

export function Icone({ nome, tamanho = 24, rotulo, ...resto }: Props) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
      focusable="false"
      {...resto}
    >
      {TRACOS[nome]}
    </svg>
  )
}
